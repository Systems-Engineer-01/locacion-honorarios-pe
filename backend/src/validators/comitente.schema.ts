import { z } from 'zod';

export const baseComitenteSchema = z.object({
  tipo: z.enum(['publica', 'privada', 'natural'], {
    errorMap: () => ({ message: 'El tipo debe ser "publica", "privada" o "natural"' })
  }),
  razonSocialNombre: z
    .string({ required_error: 'La razón social o nombre es obligatorio' })
    .min(1, 'La razón social o nombre no puede estar vacío'),
  numDoc: z
    .string({ required_error: 'El número de documento es obligatorio' })
    .regex(/^\d{8}$|^\d{11}$/, 'El documento debe tener 8 dígitos (DNI) u 11 dígitos (RUC)'),
  domicilio: z
    .string({ required_error: 'El domicilio es obligatorio' })
    .min(1, 'El domicilio no puede estar vacío'),
  repLegalNombre: z.string().optional().nullable(),
  repLegalDni: z
    .string()
    .regex(/^\d{8}$/, 'El DNI del representante legal debe contener 8 dígitos')
    .optional()
    .nullable()
    .or(z.literal('')),
  repLegalCargo: z.string().optional().nullable()
});

export const comitenteSchema = baseComitenteSchema.refine(
  (data) => {
    if (data.tipo === 'publica' || data.tipo === 'privada') {
      return (
        typeof data.repLegalNombre === 'string' &&
        data.repLegalNombre.trim().length > 0
      );
    }
    return true;
  },
  {
    message: 'El representante legal (nombre) es obligatorio para comitentes públicos o privados',
    path: ['repLegalNombre']
  }
);

export const updateComitenteSchema = baseComitenteSchema.partial();
