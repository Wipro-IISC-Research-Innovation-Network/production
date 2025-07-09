import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'data/battery_status.json');
    
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(data);

      // Validate the complete battery data structure
      if (!jsonData || !jsonData.Battery) {
        throw new Error('Missing Battery object');
      }

      const battery = jsonData.Battery;
      const requiredFields = [
        'Voltage', 'Current', 'SOC', 'NumberOfCells', 'CellVoltage',
        'ChargingMOSFET', 'DischargingMOSFET', 'CellMinimumVoltage',
        'CellMaximumVoltage', 'Capacity', 'ErrorStatus', 'Temperature'
      ];

      // Check if all required fields exist and have correct types
      for (const field of requiredFields) {
        if (!(field in battery)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return res.status(200).json(jsonData);
    } catch (err) {
      console.error('Error processing battery_status.json:', err);
      return res.status(500).json({ 
        error: 'Failed to process battery status',
        details: err.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
