import { z } from 'zod';

export const contratoSchema = z.object({
  numContrato: z
    .string({ required_error: 'El número de contrato es obligatorio' })
    .min(1, 'El número de contrato no puede estar vacío'),
  comitenteId: z
    .number({ required_error: 'El ID del comitente es obligatorio' })
    .int()
    .positive('El comitenteId debe ser un ID válido'),
  locadorId: z
    .number({ required_error: 'El ID del locador es obligatorio' })
    .int()
    .positive('El locadorId debe ser un ID válido'),
  objetoServicio: z
    .string({ required_error: 'El objeto del servicio es obligatorio' })
    .min(1, 'El objeto del servicio no puede estar vacío'),
  fechaInicio: z
    .string({ required_error: 'La fecha de inicio es obligatoria' })
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha de inicio inválida'),
  fechaFin: z
    .string({ required_error: 'La fecha de fin es obligatoria' })
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha de fin inválida'),
  montoTotal: z
    .number({ required_error: 'El monto total es obligatorio' })
    .positive('El monto total debe ser un número positivo mayor a 0'),
  formaPago: z
    .string({ required_error: 'La forma de pago es obligatoria' })
    .min(1, 'La forma de pago no puede estar vacía'),
  antecedentes: z
    .string({ required_error: 'Los antecedentes son obligatorios' })
    .min(1, 'Los antecedentes no pueden estar vacíos'),
  estado: z.enum(['activo', 'finalizado', 'resuelto']).optional().default('activo')
});

export const updateContratoSchema = contratoSchema.partial();
