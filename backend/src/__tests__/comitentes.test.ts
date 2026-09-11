import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { prisma } from '../db/client.js';

describe('API Comitentes (/api/comitentes)', () => {
  beforeAll(async () => {
    // Limpieza inicial de la base de datos de pruebas
    await prisma.recibo.deleteMany();
    await prisma.contrato.deleteMany();
    await prisma.comitente.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Debe crear un comitente válido exitosamente (HTTP 201)', async () => {
    const payload = {
      tipo: 'publica',
      razonSocialNombre: 'Municipalidad Distrital de Miraflores',
      numDoc: '20131378901',
      domicilio: 'Av. Larco 400, Miraflores',
      repLegalNombre: 'Juan Carlos Pérez',
      repLegalDni: '09876543',
      repLegalCargo: 'Alcalde'
    };

    const res = await request(app).post('/api/comitentes').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.razonSocialNombre).toBe(payload.razonSocialNombre);
    expect(res.body.numDoc).toBe(payload.numDoc);
  });

  it('Debe rechazar la creación de un comitente con RUC inválido (HTTP 400)', async () => {
    const payload = {
      tipo: 'privada',
      razonSocialNombre: 'Empresa Invalida S.A.C.',
      numDoc: '123', // RUC inválido (menos de 8/11 dígitos)
      domicilio: 'Av. Test 123',
      repLegalNombre: 'Carlos Gomez',
      repLegalDni: '12345678'
    };

    const res = await request(app).post('/api/comitentes').send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Error de validación');
    expect(res.body.details).toHaveProperty('numDoc');
  });
});
