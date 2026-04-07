
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase: any;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn('Supabase credentials missing. API will run in mock mode.');
  }
} catch (e) {
  console.error('Failed to initialize Supabase client:', e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      database: supabaseUrl ? 'Supabase Connected' : 'Supabase Not Configured' 
    });
  });

  app.get('/api/donors', async (req, res) => {
    try {
      if (!supabase) {
        return res.json([]);
      }
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Supabase Error (Donors):', error);
      res.status(500).json({ error: 'Failed to fetch donors' });
    }
  });

  app.post('/api/donors', async (req, res) => {
    try {
      if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
      }
      const { data, error } = await supabase
        .from('donors')
        .insert([req.body])
        .select();
      
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      console.error('Supabase Error (Save Donor):', error);
      res.status(500).json({ error: 'Failed to save donor' });
    }
  });

  app.get('/api/requests', async (req, res) => {
    try {
      if (!supabase) {
        return res.json([]);
      }
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .order('requestedDate', { ascending: false });
      
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Supabase Error (Requests):', error);
      res.status(500).json({ error: 'Failed to fetch requests' });
    }
  });

  app.post('/api/requests', async (req, res) => {
    try {
      if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
      }
      const { data, error } = await supabase
        .from('blood_requests')
        .insert([req.body])
        .select();
      
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      console.error('Supabase Error (Save Request):', error);
      res.status(500).json({ error: 'Failed to save request' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.get('*all', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        if (e instanceof Error) {
          vite.ssrFixStacktrace(e);
        }
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
