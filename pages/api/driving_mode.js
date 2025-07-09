import fs from 'fs';
import path from 'path';

const ALLOWED = ['P', 'R', 'N', 'D', 'A'];

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'driving_mode.json');

  if (req.method === 'GET') {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      return res.status(200).json(JSON.parse(raw));
    } catch (err) {
      return res.status(500).json({ message: 'Cannot read driving_mode.json', details: err.message });
    }
  }

  if (req.method === 'POST') {
    const { mode } = req.body;
    if (!ALLOWED.includes(mode)) {
      return res.status(400).json({ message: 'Invalid mode' });
    }
    try {
      fs.writeFileSync(filePath, JSON.stringify({ mode }, null, 2));
      return res.status(200).json({ mode });
    } catch (err) {
      return res.status(500).json({ message: 'Cannot write driving_mode.json', details: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
} 