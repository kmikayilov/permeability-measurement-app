import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { useState } from 'react';
import axios from 'axios';
import './App.css';

type plotGraphRequestData = {
  sample_length: number,
  sample_diameter: number,
  volumetric_gas_flow_rate: string,
  differential_pressures: string
}

type plotGraphResponseData = {
  differential_pressure: number[],
  volumetric_gas_flow_rate: number[],
  mean_core_gas_pressure: number[],
  pm_delta_p: number[],
  forchheimer_linear_equation: string,
  klinkenberg_linear_equation: string,
  forchheimer_plot: string,
  klinkenberg_plot: string
}

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'https://' + window.location.host;

function App() {
  
  const [data, setData] = useState<plotGraphResponseData | null>(null)
  const [forchheimmerCorrectionIntercept, setForchheimmerCorrectionIntercept] = useState<string>("")
  const [klinkenbergCorrectionIntercept, setKlinkenbergCorrectionIntercept] = useState<string>("")
  const [forchheimmerCorrectionPermeability, setForchheimmerCorrectionPermeability] = useState<string>("")
  const [klinkenbergCorrectionPermeability, setKlinkenbergCorrectionPermeability] = useState<string>("")
  

  const getPlotGraphs = (data: plotGraphRequestData) => {
    axios.post(`${baseUrl}/plot`, data).then( res => setData(res.data))
  }

  const handleCalculatePermeability = () => {
    setKlinkenbergCorrectionPermeability(klinkenbergCorrectionIntercept)
    const forchheimmerCorrectionPermeability = 1 / parseFloat(forchheimmerCorrectionIntercept)
    setForchheimmerCorrectionPermeability(forchheimmerCorrectionPermeability.toExponential(4).toString())
  }

  const displayArray = (type: string, data: number[]) => {
    return data && data?.length && (
      <div style={{ height: "100px", overflowY: "auto", overflowX: "hidden" }}>
        { data?.map( item => (<div key={`${type}-${item}`}>{item}</div>)) }
      </div>
    )
  }

  return (
    <div className="App">
      <Sidebar 
        {
          ...{
            getPlotGraphs,
            forchheimmerCorrectionIntercept,
            setForchheimmerCorrectionIntercept,
            klinkenbergCorrectionIntercept,
            setKlinkenbergCorrectionIntercept,
            handleCalculatePermeability,
            data,
            setData
          }
        }
      />
      <TopBar />
      <div className="pc-container">
        <div className="pc-content">
          <div className="col-xl-12 col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Differential Pressure (Pa)</label>
                    <div className="form-control">{ data && displayArray('differential_pressure', data?.differential_pressure)}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Volumetric Gas Flow Rate (m³/s)</label>
                    <div className="form-control">{ data && displayArray('volumetric_gas_flow_rate', data?.volumetric_gas_flow_rate)}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mean Core Gas Pressure (Pa)</label>
                    <div className="form-control">{ data && displayArray('mean_core_gas_pressure', data?.mean_core_gas_pressure)}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Pm * Delta P</label>
                    <div className="form-control">{ data && displayArray('pm_delta_p', data?.pm_delta_p)}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">The Forchheimer linear equation</label>
                    <div className="form-control">{data?.forchheimer_linear_equation}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">The Klinkenberg linear equation</label>
                    <div className="form-control">{data?.klinkenberg_linear_equation}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Permeability based on your input</label>
                    <div className="form-control">{forchheimmerCorrectionPermeability}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Permeability based on your input</label>
                    <div className="form-control">{klinkenbergCorrectionPermeability}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">The Forchheimer plot</label>
                    <div className="card">
                      <div className="card-body">
                        { data?.forchheimer_plot && <img src={`data:image/png;base64,${data?.forchheimer_plot}`} alt="Forchheimer Plot" style={{ width: "100%" }} /> }
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">The Klinkenberg plot</label>
                    <div className="card">
                      <div className="card-body">
                        { data?.klinkenberg_plot && <img src={`data:image/png;base64,${data?.klinkenberg_plot}`} alt="Klinkenberg Plot" style={{ width: "100%" }} /> }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
