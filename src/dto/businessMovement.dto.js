import { z } from 'zod';

// DTO para crear un movimiento de negocio
export const createBusinessMovementSchema = z.object({
  ProductId: z.number().int().positive('ProductId es requerido'),
  SupplierId: z.number().int().positive().optional().nullable(),
  Type: z.enum(['IN', 'OUT'], {
    errorMap: () => ({ message: 'Type debe ser IN o OUT' })
  }),
  Reason: z.enum(['SALE', 'PURCHASE', 'ADJUSTMENT', 'LOSS'], {
    errorMap: () => ({ message: 'Reason debe ser SALE, PURCHASE, ADJUSTMENT o LOSS' })
  }),
  Quantity: z.number().int().positive('La cantidad debe ser positiva'),
  UnitCost: z.number().positive().optional().nullable(),
  TotalAmount: z.number().positive().optional().nullable(),
  ReferenceId: z.number().int().positive().optional().nullable(),
  ReferenceType: z.string().optional().nullable()
});

// DTO para actualizar un movimiento de negocio
export const updateBusinessMovementSchema = z.object({
  ProductId: z.number().int().positive().optional(),
  SupplierId: z.number().int().positive().optional().nullable(),
  Type: z.enum(['IN', 'OUT']).optional(),
  Reason: z.enum(['SALE', 'PURCHASE', 'ADJUSTMENT', 'LOSS']).optional(),
  Quantity: z.number().int().positive().optional(),
  UnitCost: z.number().positive().optional().nullable(),
  TotalAmount: z.number().positive().optional().nullable(),
  ReferenceId: z.number().int().positive().optional().nullable(),
  ReferenceType: z.string().optional().nullable()
});
