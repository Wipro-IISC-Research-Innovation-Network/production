import fs from 'fs';
import path from 'path';

// helper to write status file
const writeStatusFile = (payload) => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'backgroundcheckstatus.json');
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  } catch (err) {
    console.error('Unable to write backgroundcheckstatus.json', err);
  }
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // ---------- Read battery data ----------
    const batteryFilePath = path.join(process.cwd(), 'data', 'battery_status.json');
    const batteryRaw = fs.readFileSync(batteryFilePath, 'utf8');
    const batteryJson = JSON.parse(batteryRaw);

    if (!batteryJson?.Battery) {
      throw new Error('Invalid battery_status.json structure');
    }

    // Determine min / max cell voltages
    let minCellVoltage;
    let maxCellVoltage;

    if (Array.isArray(batteryJson.Battery.Voltage)) {
      // Use the voltage array if present
      minCellVoltage = Math.min(...batteryJson.Battery.Voltage);
      maxCellVoltage = Math.max(...batteryJson.Battery.Voltage);
    } else {
      // Fallback to explicit fields if provided
      minCellVoltage = batteryJson.Battery.CellMinimumVoltage;
      maxCellVoltage = batteryJson.Battery.CellMaximumVoltage;
    }

    // ---------- Read tyre pressure data ----------
    const tyreFilePath = path.join(process.cwd(), 'data', 'doors_and_tyres.json');
    const tyreRaw = fs.readFileSync(tyreFilePath, 'utf8');
    const tyreJson = JSON.parse(tyreRaw);

    if (!tyreJson?.Tyres) {
      throw new Error('Invalid doors_and_tyres.json structure');
    }

    const tyrePressures = Object.values(tyreJson.Tyres).map((t) => t.pressure);

    // ---------- Validation rules ----------
    const MIN_CELL_VOLTAGE_THRESHOLD = 2.7; // V
    const MAX_CELL_VOLTAGE_THRESHOLD = 3.65; // V
    const MIN_TPMS_PRESSURE = 29; // PSI
    const MAX_TPMS_PRESSURE = 33; // PSI

    const classify = (value, goodCondition, badCondition) => {
      if (goodCondition(value)) return 'good';
      if (badCondition(value)) return 'bad';
      return 'critical';
    };

    const checks = {
      minCellVoltage: {
        value: minCellVoltage,
        threshold: `>= ${MIN_CELL_VOLTAGE_THRESHOLD}V`,
        severity: classify(
          minCellVoltage,
          (v) => v >= MIN_CELL_VOLTAGE_THRESHOLD,
          (v) => v >= MIN_CELL_VOLTAGE_THRESHOLD - 0.2,
        ),
      },
      maxCellVoltage: {
        value: maxCellVoltage,
        threshold: `<= ${MAX_CELL_VOLTAGE_THRESHOLD}V`,
        severity: classify(
          maxCellVoltage,
          (v) => v <= MAX_CELL_VOLTAGE_THRESHOLD,
          (v) => v <= MAX_CELL_VOLTAGE_THRESHOLD + 0.2,
        ),
      },
      tyrePressures: {
        value: tyrePressures,
        threshold: `${MIN_TPMS_PRESSURE}-${MAX_TPMS_PRESSURE} PSI`,
        severity: (() => {
          // evaluate worst case among tyres
          let worst = 'good';
          tyrePressures.forEach((p) => {
            const s = classify(
              p,
              (x) => x >= MIN_TPMS_PRESSURE && x <= MAX_TPMS_PRESSURE,
              (x) => x >= MIN_TPMS_PRESSURE - 2 && x <= MAX_TPMS_PRESSURE + 2,
            );
            if (s === 'critical') worst = 'critical';
            else if (s === 'bad' && worst === 'good') worst = 'bad';
          });
          return worst;
        })(),
      },
    };

    const overallStatus = Object.values(checks).every((c) => c.severity === 'good')
      ? 'PASS'
      : 'FAIL';

    const resultPayload = {
      timestamp: new Date().toISOString(),
      status: overallStatus,
      checks,
    };

    // persist status
    writeStatusFile(resultPayload);

    return res.status(200).json(resultPayload);
  } catch (error) {
    console.error('Error computing background check status:', error);
    return res.status(500).json({
      message: 'Internal server error',
      details: error.message,
    });
  }
} 