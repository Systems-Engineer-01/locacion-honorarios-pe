import express, { Request, Response } from 'express';
import cors from 'cors';
import comitentesRouter from './routes/comitentes.js';
import locadoresRouter from './routes/locadores.js';
import contratosRouter from './routes/contratos.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/comitentes', comitentesRouter);
app.use('/api/locadores', locadoresRouter);
app.use('/api/contratos', contratosRouter);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
  });
}

export default app;
