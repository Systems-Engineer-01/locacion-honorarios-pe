import { Router, Request, Response } from 'express';
import { prisma } from '../db/client.js';
import { contratoSchema, updateContratoSchema } from '../validators/contrato.schema.js';
import { reciboSchema } from '../validators/recibo.schema.js';

const router = Router();

// GET /api/contratos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const contratos = await prisma.contrato.findMany({
      include: {
        comitente: true,
        locador: true,
        _count: { select: { recibos: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(contratos);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al obtener los contratos' });
  }
});

// GET /api/contratos/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const contrato = await prisma.contrato.findUnique({
      where: { id },
      include: {
        comitente: true,
        locador: true,
        recibos: true
      }
    });
    if (!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    return res.json(contrato);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al obtener el contrato' });
  }
});

// POST /api/contratos
router.post('/', async (req: Request, res: Response) => {
  try {
    const parseResult = contratoSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: parseResult.error.flatten().fieldErrors
      });
    }

    const { comitenteId, locadorId, fechaInicio, fechaFin, ...rest } = parseResult.data;

    // Validar existencia de comitente
    const comitente = await prisma.comitente.findUnique({ where: { id: comitenteId } });
    if (!comitente) {
      return res.status(404).json({ error: `El comitente con ID ${comitenteId} no existe` });
    }

    // Validar existencia de locador
    const locador = await prisma.locador.findUnique({ where: { id: locadorId } });
    if (!locador) {
      return res.status(404).json({ error: `El locador con ID ${locadorId} no existe` });
    }

    const newContrato = await prisma.contrato.create({
      data: {
        ...rest,
        comitenteId,
        locadorId,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin)
      },
      include: { comitente: true, locador: true }
    });
    return res.status(201).json(newContrato);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'El número de contrato ya se encuentra registrado' });
    }
    return res.status(500).json({ error: 'Error al crear el contrato' });
  }
});

// PUT /api/contratos/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const parseResult = updateContratoSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: parseResult.error.flatten().fieldErrors
      });
    }

    const existing = await prisma.contrato.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    const dataToUpdate: any = { ...parseResult.data };
    if (parseResult.data.fechaInicio) {
      dataToUpdate.fechaInicio = new Date(parseResult.data.fechaInicio);
    }
    if (parseResult.data.fechaFin) {
      dataToUpdate.fechaFin = new Date(parseResult.data.fechaFin);
    }

    if (parseResult.data.comitenteId) {
      const comitente = await prisma.comitente.findUnique({ where: { id: parseResult.data.comitenteId } });
      if (!comitente) {
        return res.status(404).json({ error: `El comitente con ID ${parseResult.data.comitenteId} no existe` });
      }
    }

    if (parseResult.data.locadorId) {
      const locador = await prisma.locador.findUnique({ where: { id: parseResult.data.locadorId } });
      if (!locador) {
        return res.status(404).json({ error: `El locador con ID ${parseResult.data.locadorId} no existe` });
      }
    }

    const updated = await prisma.contrato.update({
      where: { id },
      data: dataToUpdate,
      include: { comitente: true, locador: true }
    });
    return res.json(updated);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al actualizar el contrato' });
  }
});

// DELETE /api/contratos/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const existing = await prisma.contrato.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    await prisma.contrato.delete({ where: { id } });
    return res.status(204).send();
  } catch (_error) {
    return res.status(500).json({ error: 'Error al eliminar el contrato' });
  }
});

// GET /api/contratos/:id/recibos
router.get('/:id/recibos', async (req: Request, res: Response) => {
  try {
    const contratoId = parseInt(req.params.id, 10);
    if (isNaN(contratoId)) {
      return res.status(400).json({ error: 'ID de contrato inválido' });
    }

    const contrato = await prisma.contrato.findUnique({ where: { id: contratoId } });
    if (!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    const recibos = await prisma.recibo.findMany({
      where: { contratoId },
      orderBy: { fechaEmision: 'desc' }
    });
    return res.json(recibos);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al obtener los recibos del contrato' });
  }
});

// POST /api/contratos/:id/recibos
router.post('/:id/recibos', async (req: Request, res: Response) => {
  try {
    const contratoId = parseInt(req.params.id, 10);
    if (isNaN(contratoId)) {
      return res.status(400).json({ error: 'ID de contrato inválido' });
    }

    const contrato = await prisma.contrato.findUnique({ where: { id: contratoId } });
    if (!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    const parseResult = reciboSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Error de validación',
        details: parseResult.error.flatten().fieldErrors
      });
    }

    const { fechaEmision, montoBruto, ...rest } = parseResult.data;

    // En Sprint 1: guarda bruto y modalidad_pago sin calcular aún la retención
    const newRecibo = await prisma.recibo.create({
      data: {
        ...rest,
        contratoId,
        fechaEmision: new Date(fechaEmision),
        montoBruto,
        aplicaRetencion: false,
        montoRetencion: 0,
        montoNeto: montoBruto
      }
    });

    return res.status(201).json(newRecibo);
  } catch (_error) {
    return res.status(500).json({ error: 'Error al crear el recibo' });
  }
});

export default router;
