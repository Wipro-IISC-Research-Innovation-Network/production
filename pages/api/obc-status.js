import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), 'data', 'obc_status.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileData);
    
    // Structure the response to include Temperature data
    const response = {
      OBC: {
        ChargeLevel: data.OBC.ChargeLevel,
        ACData: data.OBC.ACData,
        DCData: data.OBC.DCData,
        ChargingTime: data.OBC.ChargingTime,
        ErrorStatus: data.OBC.ErrorStatus,
        Temperature: data.OBC.Temperature
      }
    };

    // Return the structured data
    res.status(200).json(response);
  } catch (error) {
    console.error('Error reading OBC status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 