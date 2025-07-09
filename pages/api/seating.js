import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), 'data', 'seating.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileData);
    
    // Return all data or specific section based on query parameter
    const section = req.query.section;
    if (section && data[section]) {
      res.status(200).json({ [section]: data[section] });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error('Error reading seating status:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      details: error.message,
      path: error.path 
    });
  }
}
