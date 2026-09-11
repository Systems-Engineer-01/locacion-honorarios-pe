import { Router, Request, Response } from 'express';
import { prisma } from '../db/client.js';
import { locadorSchema, updateLocadorSchema } from '../validators/locador.schema.js';

const router = Router();

// GET /api/locadores
router.get('/', async (_req: Request, res: Response) => {
  try {
    const locadores = await prisma.locador.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(locadores);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al obtener los locadores' });
  }
});

// GET /api/locadores/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const locador = await prisma.locador.findUnique({
      where: { id }
    });
    if (!locador) {
      return res.status(404).json({ error: 'Locador no encontrado' });
    }
    return res.json(locador);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al obtener el locador' });
  }
});

// POST /api/locadores
router.post('/', async (req: Request, res: Response) => {
  try {
    const parseResult = locadorSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: parseResult.error.flatten().fieldErrors
      });
    }

    const newLocador = await prisma.locador.create({
      data: parseResult.data
    });
    return res.status(201).json(newLocador);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al crear el locador' });
  }
});

// PUT /api/locadores/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const parseResult = updateLocadorSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: parseResult.error.flatten().fieldErrors
      });
    }

    const existing = await prisma.locador.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Locador no encontrado' });
    }

    const updated = await prisma.locador.update({
      where: { id },
      data: parseResult.data
    });
    return res.json(updated);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al actualizar el locador' });
  }
});

// DELETE /api/locadores/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const existing = await prisma.locador.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Locador no encontrado' });
    }

    await prisma.locador.delete({ where: { id } });
    return res.status(204).send();
  } catch (_error) {
    return res.status(500).json({ error: 'Error al eliminar el locador' });
  }
});

export default router;
