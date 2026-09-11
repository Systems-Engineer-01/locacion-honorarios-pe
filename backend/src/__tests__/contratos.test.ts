import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { prisma } from '../db/client.js';

describe('API Contratos (/api/contratos)', () => {
  let createdComitenteId: number;

  beforeEach(async () => {
    await prisma.recibo.deleteMany();
    await prisma.contrato.deleteMany();
    await prisma.locador.deleteMany();
    await prisma.comitente.deleteMany();

    const comitente = await prisma.comitente.create({
      data: {
        tipo: 'publica',
        razonSocialNombre: 'Municipalidad de Prueba',
        numDoc: '20123456789',
        domicilio: 'Calle Ficticia 123',
        repLegalNombre: 'Rep Legal Test',
        repLegalDni: '11223344'
      }
    });
    createdComitenteId = comitente.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Debe fallar al intentar crear un contrato con un locador inexistente (HTTP 404)', async () => {
    const nonExistentLocadorId = 999999;

    const payload = {
      numContrato: 'N° 001-2026-TEST',
      comitenteId: createdComitenteId,
      locadorId: nonExistentLocadorId,
      objetoServicio: 'Servicios de consultoría en sistemas',
      fechaInicio: '2026-01-01',
      fechaFin: '2026-12-31',
      montoTotal: 12000.0,
      formaPago: 'mensual',
      antecedentes: 'Requerimiento N° 005'
    };

    const res = await request(app).post('/api/contratos').send(payload);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', `El locador con ID ${nonExistentLocadorId} no existe`);
  });

  it('Debe crear un contrato exitosamente cuando comitente y locador existen (HTTP 201)', async () => {
    const locador = await prisma.locador.create({
      data: {
        nombreCompleto: 'Juan Pérez Locador',
        dni: '77665544',
        ruc: '10776655441',
        domicilio: 'Av. Locador 456',
        profesionOficio: 'Ingeniero de Sistemas'
      }
    });

    const payload = {
      numContrato: 'N° 002-2026-TEST',
      comitenteId: createdComitenteId,
      locadorId: locador.id,
      objetoServicio: 'Desarrollo de software a medida',
      fechaInicio: '2026-02-01',
      fechaFin: '2026-11-30',
      montoTotal: 25000.0,
      formaPago: 'mensual',
      antecedentes: 'Informe N° 010'
    };

    const res = await request(app).post('/api/contratos').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.numContrato).toBe(payload.numContrato);
  });
});
