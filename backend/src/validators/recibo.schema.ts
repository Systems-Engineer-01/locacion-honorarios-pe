import { z } from 'zod';

export const reciboSchema = z.object({
  numRecibo: z
    .string({ required_error: 'El número de recibo es obligatorio' })
    .min(1, 'El número de recibo no puede estar vacío'),
  fechaEmision: z
    .string({ required_error: 'La fecha de emisión es obligatoria' })
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha de emisión inválida'),
  periodo: z
    .string({ required_error: 'El periodo es obligatorio' })
    .min(1, 'El periodo no puede estar vacío'),
  montoBruto: z
    .number({ required_error: 'El monto bruto es obligatorio' })
    .positive('El monto bruto debe ser mayor a 0'),
  modalidadPago: z.enum(['contado', 'credito'], {
    errorMap: () => ({ message: 'La modalidad de pago debe ser "contado" o "credito"' })
  }),
  descripcionServicio: z
    .string({ required_error: 'La descripción del servicio es obligatoria' })
    .min(1, 'La descripción del servicio no puede estar vacía')
});

export const updateReciboSchema = reciboSchema.partial();
