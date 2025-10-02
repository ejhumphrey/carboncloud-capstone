/** @jsxImportSource react */
import { useState, useMemo } from 'react';

// --- HELPER COMPONENTS ---

const Tooltip = ({ text }) => (
  <div className="tooltip-container">
    <span className="tooltip-icon">(i)</span>
    <span className="tooltip-text">{text}</span>
  </div>
);

const RadioButtons = ({ name, values, selectedValue, onChange }) => (
  <div className="radio-buttons">
    {values.map(value => (
      <button
        key={value}
        type="button"
        className={selectedValue === value ? 'active' : ''}
        onClick={() => onChange(value)}
      >
        {value}
      </button>
    ))}
  </div>
);

const InputControl = ({ label, description, values, selectedValue, onChange }) => (
  <div className="input-control">
    <label>
      {label} <Tooltip text={description} />
    </label>
    <RadioButtons
      name={label}
      values={values}
      selectedValue={selectedValue}
      onChange={onChange}
    />
  </div>
);

const DisplayValue = ({ label, description, value, unit = '' }) => (
  <div className="display-value">
    <div className="display-label">
      {label} <Tooltip text={description} />
    </div>
    <div className="display-data">
      <span className="value">{value}</span>
      {unit && <span className="unit">{unit}</span>}
    </div>
  </div>
);

const FinalOutputDisplay = ({ label, description, value, unit = '' }) => {
  const getStatusClass = (val) => {
    if (val >= 3) return 'bad';
    if (val >= 2) return 'okay';
    if (val >= 1) return 'good';
    return 'great';
  };

  const statusClass = getStatusClass(value);

  return (
    <div className={`display-value final-output ${statusClass}`}>
      <div className="display-label">
        {label} <Tooltip text={description} />
      </div>
      <div className="display-data">
        <span className="value">{value}</span>
        {unit && <span className="unit">{unit}</span>}
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---

export default function Co2FilterCalculator() {
  // --- STATE MANAGEMENT (useState) ---
  const [filterWidth, setFilterWidth] = useState(20);
  const [filterLength, setFilterLength] = useState(20);
  const [filterDepthL, setFilterDepthL] = useState(0.1);
  const [airflowQ, setAirflowQ] = useState(0.47);
  const [dailyRuntime, setDailyRuntime] = useState(6);
  const [maxStaticPressure, setMaxStaticPressure] = useState(80);
  const [sorbentCaptureEfficiencyEta, setSorbentCaptureEfficiencyEta] = useState(0.018);
  const [sorbentWorkingCapacityCw, setSorbentWorkingCapacityCw] = useState(0.08);
  const [initialCo2ConcentrationCin, setInitialCo2ConcentrationCin] = useState(0.0007);
  const [sorbentMassFraction, setSorbentMassFraction] = useState(0.7);
  const [maxCartridgeWeight, setMaxCartridgeWeight] = useState(10);

  // --- CALCULATIONS (useMemo) ---
  const calculations = useMemo(() => {
    // Computed Values
    const frontalAreaA = (filterWidth * 0.0254) * (filterLength * 0.0254);
    const airVelocityV = airflowQ / frontalAreaA;
    const residenceTimeTau = filterDepthL / airVelocityV;
    const hourlyCo2CaptureRateY = (airflowQ * initialCo2ConcentrationCin * sorbentCaptureEfficiencyEta) * 3600;
    const totalWeeklyCo2Capture = hourlyCo2CaptureRateY * dailyRuntime * 7;
    const requiredSorbentMass = totalWeeklyCo2Capture / sorbentWorkingCapacityCw;
    
    // Outputs
    const totalFilterWeight = requiredSorbentMass / sorbentMassFraction;
    const weeklyCartridgeSwaps = totalFilterWeight / maxCartridgeWeight;

    return {
      frontalAreaA,
      airVelocityV,
      residenceTimeTau,
      hourlyCo2CaptureRateY,
      requiredSorbentMass,
      totalWeeklyCo2Capture,
      totalFilterWeight,
      weeklyCartridgeSwaps,
    };
  }, [
    filterWidth,
    filterLength,
    filterDepthL,
    airflowQ,
    dailyRuntime,
    sorbentCaptureEfficiencyEta,
    sorbentWorkingCapacityCw,
    initialCo2ConcentrationCin,
    sorbentMassFraction,
    maxCartridgeWeight,
  ]);

  return (
    <>
      <div className="calculator-container">
        <div className="controls">
          <h2>Controls</h2>
          <InputControl
            label="Filter Width"
            description="The width of the filter's frontal face."
            values={[20, 24, 25]}
            selectedValue={filterWidth}
            onChange={setFilterWidth}
          />
          <InputControl
            label="Filter Length"
            description="The length of the filter's frontal face."
            values={[20, 24, 25]}
            selectedValue={filterLength}
            onChange={setFilterLength}
          />
          <InputControl
            label="Filter Depth (L)"
            description="The depth of the filter in the direction of airflow, in meters."
            values={[0.1, 0.12, 0.15]}
            selectedValue={filterDepthL}
            onChange={setFilterDepthL}
          />
          <InputControl
            label="Airflow (Q)"
            description="The volumetric flow rate of air through the HVAC system, in cubic meters per second."
            values={[0.47, 0.57, 0.66]}
            selectedValue={airflowQ}
            onChange={setAirflowQ}
          />
          <InputControl
            label="Daily Runtime"
            description="The average number of hours the HVAC system runs per day."
            values={[6, 8, 10]}
            selectedValue={dailyRuntime}
            onChange={setDailyRuntime}
          />
          <InputControl
            label="Sorbent Capture Efficiency (η)"
            description="The fraction of CO₂ removed from the air that passes through the filter."
            values={[0.018, 0.022, 0.025]}
            selectedValue={sorbentCaptureEfficiencyEta}
            onChange={setSorbentCaptureEfficiencyEta}
          />
          <InputControl
            label="Sorbent Working Capacity (Cw)"
            description="The mass of CO₂ the sorbent can capture per unit mass of sorbent (e.g., 0.1 is 10%)."
            values={[0.08, 0.1, 0.12]}
            selectedValue={sorbentWorkingCapacityCw}
            onChange={setSorbentWorkingCapacityCw}
          />
          <InputControl
            label="Initial CO₂ Concentration (Cin)"
            description="The concentration of CO₂ in the incoming air, in kg/m³."
            values={[0.0007, 0.0008, 0.0009]}
            selectedValue={initialCo2ConcentrationCin}
            onChange={setInitialCo2ConcentrationCin}
          />
          <InputControl
            label="Sorbent Mass Fraction"
            description="The fraction of the total filter weight that is composed of sorbent material."
            values={[0.7, 0.75, 0.8]}
            selectedValue={sorbentMassFraction}
            onChange={setSorbentMassFraction}
          />
          <InputControl
            label="Max Cartridge Weight"
            description="The maximum practical weight for a single, user-swappable filter cartridge, in kg."
            values={[10, 12.5, 15]}
            selectedValue={maxCartridgeWeight}
            onChange={setMaxCartridgeWeight}
          />
        </div>
        
        <div className="results">
          <div className="output-group">
            <h3>Intermediate Calculations</h3>
            <DisplayValue
              label="Frontal Area (A)"
              description="The cross-sectional area available for airflow, calculated as (Filter Width * Filter Length)."
              value={calculations.frontalAreaA.toFixed(2)}
              unit="m²"
            />
            <DisplayValue
              label="Air Velocity (v)"
              description="The speed of the air passing through the filter, calculated as (Airflow / Frontal Area)."
              value={calculations.airVelocityV.toFixed(2)}
              unit="m/s"
            />
            <DisplayValue
              label="Residence Time (τ)"
              description="The duration the air spends within the filter, calculated as (Filter Depth / Air Velocity)."
              value={calculations.residenceTimeTau.toFixed(3)}
              unit="s"
            />
            <DisplayValue
              label="Hourly CO₂ Capture Rate (Y)"
              description="The mass of CO₂ captured per hour of operation, calculated as ((Airflow * Initial CO₂ Concentration * Sorbent Capture Efficiency) * 3600)."
              value={calculations.hourlyCo2CaptureRateY.toFixed(3)}
              unit="kg/hr"
            />
            <DisplayValue
              label="Required Sorbent Mass"
              description="The total mass of sorbent needed for one week of operation, calculated as ((Hourly CO₂ Capture Rate * Daily Runtime * 7) / Sorbent Working Capacity)."
              value={calculations.requiredSorbentMass.toFixed(1)}
              unit="kg"
            />
          </div>
          <div className="output-group">
            <h3>Final Outputs</h3>
             <DisplayValue
              label="Total Weekly CO₂ Capture"
              description="The total mass of CO₂ captured in a 7-day period, calculated as (Hourly CO₂ Capture Rate * Daily Runtime * 7)."
              value={calculations.totalWeeklyCo2Capture.toFixed(2)}
              unit="kg"
            />
            <DisplayValue
              label="Total Filter Weight"
              description="The total weight of the filter system required for one week, calculated as (Required Sorbent Mass / Sorbent Mass Fraction)."
              value={calculations.totalFilterWeight.toFixed(1)}
              unit="kg"
            />
            <FinalOutputDisplay
              label="Weekly Cartridge Swaps"
              description="The number of modular cartridges a user must swap weekly, calculated as (Total Filter Weight / Max Cartridge Weight). Lower is better."
              value={calculations.weeklyCartridgeSwaps.toFixed(1)}
              unit="swaps/wk"
            />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .calculator-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          font-family: sans-serif;
          color: #333;
          background-color: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #ddd;
        }
        .controls, .results {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .controls {
          border-right: 1px solid #ddd;
          padding-right: 2rem;
        }
        h2, h3 {
          margin-top: 0;
          color: #1a2b4d;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 0.5rem;
        }
        .output-group {
          margin-bottom: 1.5rem;
        }
        .input-control {
          margin-bottom: 0.5rem;
        }
        .input-control label {
          display: flex;
          align-items: center;
          font-weight: bold;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        .tooltip-container {
          position: relative;
          display: inline-block;
          margin-left: 6px;
        }
        .tooltip-icon {
          cursor: pointer;
          color: #888;
          font-weight: bold;
          font-size: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .tooltip-text {
          visibility: hidden;
          width: 220px;
          background-color: #555;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 8px;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          margin-left: -110px;
          opacity: 0;
          transition: opacity 0.3s;
          font-size: 0.85rem;
          font-weight: normal;
        }
        .tooltip-text::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #555 transparent transparent transparent;
        }
        .tooltip-container:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
        .radio-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .radio-buttons button {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ccc;
          background-color: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .radio-buttons button:hover {
          background-color: #f0f0f0;
        }
        .radio-buttons button.active {
          background-color: #007bff;
          color: white;
          border-color: #0056b3;
        }
        .display-value {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background-color: #fff;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
          margin-bottom: 0.5rem;
        }
        .display-label {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
          color: #555;
        }
        .display-data {
          text-align: right;
        }
        .display-data .value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1a2b4d;
        }
        .display-data .unit {
          margin-left: 0.5rem;
          font-size: 0.9rem;
          color: #777;
        }
        .final-output {
            border-left-width: 5px;
        }
        .final-output.bad { border-left-color: #e53e3e; }
        .final-output.bad .value { color: #e53e3e; }
        .final-output.okay { border-left-color: #dd6b20; }
        .final-output.okay .value { color: #dd6b20; }
        .final-output.good { border-left-color: #38a169; }
        .final-output.good .value { color: #38a169; }
        .final-output.great { border-left-color: #3182ce; }
        .final-output.great .value { color: #3182ce; }
      `}</style>
    </>
  );
}
