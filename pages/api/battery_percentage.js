import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const filePath = path.join(process.cwd(), 'data', 'battery_percentage.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    // Basic validation
    if (
      typeof data.percentage !== 'number' ||
      typeof data.remainingRangeKm !== 'number' ||
      typeof data.avgWhPerKm !== 'number'
    ) {
      throw new Error('battery_percentage.json is missing required numeric fields');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error reading battery_percentage.json:', error);
    return res.status(500).json({ message: 'Internal server error', details: error.message });
  }
} 