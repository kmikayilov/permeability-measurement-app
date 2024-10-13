import { useState, Dispatch, SetStateAction } from "react"

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

type PropsType = {
    forchheimmerCorrectionIntercept: string,
    setForchheimmerCorrectionIntercept: Dispatch<SetStateAction<string>>,
    klinkenbergCorrectionIntercept: string,
    setKlinkenbergCorrectionIntercept: Dispatch<SetStateAction<string>>,
    handleCalculatePermeability: () => void,
    getPlotGraphs: (data: plotGraphRequestData) => void,
    setData: Dispatch<SetStateAction<plotGraphResponseData | null>>,
    data: plotGraphResponseData | null
}

function Sidebar( props: PropsType) {
    const { 
        forchheimmerCorrectionIntercept,
        setForchheimmerCorrectionIntercept,
        klinkenbergCorrectionIntercept,
        setKlinkenbergCorrectionIntercept,
        handleCalculatePermeability,
        getPlotGraphs,
        setData,
        data
    } = props;

    const [sampleLength, setSampleLength] = useState<string>("39.92")
    const [sampleDiameter, setSampleDiameter] = useState<string>("19.85")
    const [volumetricGasFlowRates, setVolumetricGasFlowRates] = useState<string>("391.4, 361.51, 335.96, 296.35, 266.4, 230.67")
    const [differentialPressures, setDifferentialPressures] = useState<string>("1805.2, 1686.2, 1586.8, 1429.8, 1308.7, 1161.0")

    const handlePlotGraphs = () => {
        getPlotGraphs({ 
            sample_length: parseFloat(sampleLength), 
            sample_diameter: parseFloat(sampleDiameter), 
            volumetric_gas_flow_rate: volumetricGasFlowRates,  
            differential_pressures: differentialPressures 
        })
    }

    const handleReset = () => {
        setData(null)
        setSampleLength("")
        setSampleDiameter("")
        setVolumetricGasFlowRates("")
        setDifferentialPressures("")
    }
    
    return (
        <nav className="pc-sidebar mob-sidebar-active">
            <div className="pt-4 px-3">
                <h4 className="mb-2">Settings</h4>
                <hr/>
                <div className="w-100">
                    <div className="mb-3">
                        <label className="form-label p-0">Sample Length (in mm)</label>
                        <input type="text" className="form-control" value={sampleLength} onChange={(e) => setSampleLength(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label p-0">Sample diameter (in mm)</label>
                        <input type="text" className="form-control" value={sampleDiameter} onChange={(e) => setSampleDiameter(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label p-0">Volumetric gas flow rates (in mL/min) separated by commas</label>
                        <input type="text" className="form-control" value={volumetricGasFlowRates} onChange={ (e) => setVolumetricGasFlowRates(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label p-0">Differential pressures (in mbar) separated by commas</label>
                        <input type="text" className="form-control" value={differentialPressures} onChange={ (e) => setDifferentialPressures(e.target.value)} />
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handlePlotGraphs} disabled={ !(sampleLength && sampleDiameter && volumetricGasFlowRates && differentialPressures) }>Plot graphs</button>
                    <button type="button" className="btn btn-danger mx-3" onClick={handleReset} disabled={ !(sampleLength || sampleDiameter || volumetricGasFlowRates || differentialPressures) }>Reset</button>
                    <hr/>
                    <div className="mb-3">
                        <label className="form-label p-0">Forchheimmer correction intercept value</label>
                        <input type="text" className="form-control" value={forchheimmerCorrectionIntercept} onChange={(e) => setForchheimmerCorrectionIntercept(e.target.value)} disabled={!data} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label p-0">Klinkenberg correction intercept value</label>
                        <input type="text" className="form-control" value={klinkenbergCorrectionIntercept} onChange={ (e) => setKlinkenbergCorrectionIntercept(e.target.value)} disabled={!data} />
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleCalculatePermeability} disabled={ !(forchheimmerCorrectionIntercept && klinkenbergCorrectionIntercept) }>Calculate Permeability</button>
                </div>
            </div>
        </nav>
    )
}

export default Sidebar
