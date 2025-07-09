import fs from 'fs';
import path from 'path';

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

    const checks = {
      minCellVoltage: {
        value: minCellVoltage,
        passed: minCellVoltage >= MIN_CELL_VOLTAGE_THRESHOLD,
        threshold: `>= ${MIN_CELL_VOLTAGE_THRESHOLD}V`,
      },
      maxCellVoltage: {
        value: maxCellVoltage,
        passed: maxCellVoltage <= MAX_CELL_VOLTAGE_THRESHOLD,
        threshold: `<= ${MAX_CELL_VOLTAGE_THRESHOLD}V`,
      },
      tyrePressures: {
        value: tyrePressures,
        passed: tyrePressures.every((p) => p >= MIN_TPMS_PRESSURE && p <= MAX_TPMS_PRESSURE),
        threshold: `${MIN_TPMS_PRESSURE}-${MAX_TPMS_PRESSURE} PSI`,
      },
    };

    const overallStatus = Object.values(checks).every((c) => c.passed) ? 'PASS' : 'FAIL';

    return res.status(200).json({
      status: overallStatus,
      checks,
    });
  } catch (error) {
    console.error('Error computing background check status:', error);
    return res.status(500).json({
      message: 'Internal server error',
      details: error.message,
    });
  }
} 