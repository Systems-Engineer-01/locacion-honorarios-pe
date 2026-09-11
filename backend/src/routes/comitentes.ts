import { Router, Request, Response } from 'express';
import { prisma } from '../db/client.js';
import { comitenteSchema, updateComitenteSchema } from '../validators/comitente.schema.js';

const router = Router();

// GET /api/comitentes
router.get('/', async (_req: Request, res: Response) => {
  try {
    const comitentes = await prisma.comitente.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(comitentes);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al obtener los comitentes' });
  }
});

// GET /api/comitentes/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const comitente = await prisma.comitente.findUnique({
      where: { id }
    });
    if (!comitente) {
      return res.status(404).json({ error: 'Comitente no encontrado' });
    }
    return res.json(comitente);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al obtener el comitente' });
  }
});

// POST /api/comitentes
router.post('/', async (req: Request, res: Response) => {
  try {
    const parseResult = comitenteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: parseResult.error.flatten().fieldErrors
      });
    }

    const newComitente = await prisma.comitente.create({
      data: parseResult.data
    });
    return res.status(201).json(newComitente);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al crear el comitente' });
  }
});

// PUT /api/comitentes/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const parseResult = updateComitenteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: parseResult.error.flatten().fieldErrors
      });
    }

    const existing = await prisma.comitente.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Comitente no encontrado' });
    }

    const updated = await prisma.comitente.update({
      where: { id },
      data: parseResult.data
    });
    return res.json(updated);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al actualizar el comitente' });
  }
});

// DELETE /api/comitentes/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const existing = await prisma.comitente.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Comitente no encontrado' });
    }

    await prisma.comitente.delete({ where: { id } });
    return res.status(204).send();
  } catch (_error) {
    return res.status(500).json({ error: 'Error al eliminar el comitente' });
  }
});

export default router;
