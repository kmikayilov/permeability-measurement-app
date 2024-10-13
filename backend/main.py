from fastapi import FastAPI
from fastapi.responses import JSONResponse
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Function to convert a Matplotlib figure to a base64 string
def fig_to_base64(fig):
    buf = BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    return img_base64

app = FastAPI()

# Allow CORS for all origins (not recommended for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust origins as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PlotData(BaseModel):
    sample_length: float
    sample_diameter: float
    volumetric_gas_flow_rate: str
    differential_pressures: str

@app.post("/plot")
async def get_plot(data: PlotData):
    # Constants
    pressure_conversion_factor = 100  # 1 mbar = 100 Pa
    atm = 101325  # Atmospheric pressure in Pa
    poise = 0.0000176

    volumetric_gas_flow_rate_ml_min = np.array([float(x) for x in data.volumetric_gas_flow_rate.split(',')])
    differential_pressure_mbar = np.array([float(x) for x in data.differential_pressures.split(',')])

    # Convert pressures and flow rates
    differential_pressure_pa = differential_pressure_mbar * pressure_conversion_factor
    volumetric_gas_flow_rate_m3_s = volumetric_gas_flow_rate_ml_min / 1e6 / 60  # Convert mL/min to m³/s

    # Calculate mean core gas pressure
    mean_core_gas_pressure_pa = (differential_pressure_pa + 2 * atm) / 2
    Pm_delta_P = mean_core_gas_pressure_pa * differential_pressure_pa

    # Calculate Forchheimer and Klinkenberg coefficients
    radius_m = data.sample_diameter / 2000  # convert to meters and divide by 2 for radius
    area_m2 = np.pi * radius_m**2
    k_m2 = (volumetric_gas_flow_rate_m3_s * atm * poise * (data.sample_length / 1000)) / (differential_pressure_pa * area_m2 * mean_core_gas_pressure_pa)  # raw k
    inverse_k = 1 / k_m2
    inv_mean_pressure = 1 / mean_core_gas_pressure_pa

    coefficients = np.polyfit(volumetric_gas_flow_rate_m3_s, inverse_k, 1)
    k, b = coefficients  # k is the slope, b is the intercept

    coefficients2 = np.polyfit(inv_mean_pressure, k_m2, 1)
    a, c = coefficients2  # a is the slope, c is the intercept

    equation_label_forsch = f'y = {k:.4e}x + {b:.4e}'
    equation_label_klink = f'y = {a:.4e}x + {c:.4e}'

    # Plot results
    fig1 = plt.figure(figsize=(8, 6))
    plt.plot(volumetric_gas_flow_rate_m3_s, inverse_k, 'o-', label=f'The linear equation is: {equation_label_forsch}')
    plt.xlabel('Volumetric Gas Flow Rate (m³/s)')
    plt.ylabel('Inverse Permeability (1/m²)')
    plt.title('Forchheimer Correction')
    plt.grid(True)
    plt.legend()
    forchheimer_plot = fig_to_base64(fig1)
    plt.close(fig1)

    fig2 = plt.figure(figsize=(8, 6))
    plt.plot(inv_mean_pressure, k_m2, 'x-', label=f'The linear equation is: {equation_label_klink}')
    plt.xlabel('1/Pm')
    plt.ylabel('k (m²)')
    plt.title('Klinkenberg Correction')
    plt.grid(True)
    plt.legend()
    klinkenberg_plot = fig_to_base64(fig2)
    plt.close(fig2)

    return JSONResponse(content={
        "differential_pressure": differential_pressure_pa.tolist(),
        "volumetric_gas_flow_rate": volumetric_gas_flow_rate_m3_s.tolist(),
        "mean_core_gas_pressure": mean_core_gas_pressure_pa.tolist(),
        "pm_delta_p": Pm_delta_P.tolist(),
        "forchheimer_linear_equation": equation_label_forsch,
        "klinkenberg_linear_equation": equation_label_klink,
        "forchheimer_plot": forchheimer_plot,
        "klinkenberg_plot": klinkenberg_plot

    })