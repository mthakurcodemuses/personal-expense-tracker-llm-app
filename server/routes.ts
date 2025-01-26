import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const upload = multer({ dest: 'uploads/' });

export function registerRoutes(app: Express): Server {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
  }

  app.post('/api/upload-statement', upload.single('statement'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      // Spawn Python process to handle PDF processing
      const pythonProcess = spawn('python3', ['server/pdf_processor.py', req.file.path]);

      let result = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`PDF processing error: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        // Clean up uploaded file
        fs.unlinkSync(req.file!.path);

        if (code !== 0) {
          return res.status(500).json({ message: 'Error processing PDF' });
        }

        try {
          const expenses = JSON.parse(result);
          res.json(expenses);
        } catch (e) {
          res.status(500).json({ message: 'Error parsing extracted data' });
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Server error during upload' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}