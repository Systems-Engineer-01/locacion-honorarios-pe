import { z } from 'zod';

export const locadorSchema = z.object({
  nombreCompleto: z
    .string({ required_error: 'El nombre completo es obligatorio' })
    .min(1, 'El nombre completo no puede estar vacío'),
  dni: z
    .string({ required_error: 'El DNI es obligatorio' })
    .regex(/^\d{8}$/, 'El DNI debe contener exactamente 8 dígitos numéricos'),
  ruc: z
    .string()
    .regex(/^\d{11}$/, 'El RUC debe contener exactamente 11 dígitos numéricos')
    .optional()
    .nullable()
    .or(z.literal('')),
  domicilio: z
    .string({ required_error: 'El domicilio es obligatorio' })
    .min(1, 'El domicilio no puede estar vacío'),
  profesionOficio: z
    .string({ required_error: 'La profesión u oficio es obligatoria' })
    .min(1, 'La profesión u oficio no puede estar vacía')
});

export const updateLocadorSchema = locadorSchema.partial();
