import fs from 'fs';
import path from 'path';

const ALLOWED_MODES = ['AUTO', 'DRIVE', 'PARKED'];

const modeStorageMap = {
  AUTO: 'autonomous',
  DRIVE: 'manual drive',
  PARKED: 'parked',
};
// This section is intended for adding the stopped mode with vehicle speed data

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { mode } = req.body;

      const upperMode = mode?.toUpperCase();
      if (!upperMode || !ALLOWED_MODES.includes(upperMode)) {
        return res.status(400).json({ message: 'Invalid or missing mode. Allowed values: AUTO, DRIVE, PARKED' });
      }

      const filePath = path.join(process.cwd(), 'data', 'start.json');

      // Read current content (in case other properties exist)
      let current = { status: 'stopped', mode: 'none' };
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf8');
          current = JSON.parse(raw);
        } catch (err) {
          console.warn('Could not parse existing start.json, will overwrite with defaults');
        }
      }

      // Update values
      current.status = 'started';
      current.mode = modeStorageMap[upperMode];

      fs.writeFileSync(filePath, JSON.stringify(current, null, 2));

      return res.status(200).json({ message: 'Mode updated', data: current });
    } catch (error) {
      console.error('Error updating mode:', error);
      return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
  } else if (req.method === 'GET') {
    // Simple read of start.json
    try {
      const filePath = path.join(process.cwd(), 'data', 'start.json');
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: 'Error reading start.json', details: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 