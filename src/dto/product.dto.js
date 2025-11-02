import { z } from 'zod';

// DTO para crear un producto
export const createProductSchema = z.object({
  Name: z.string().min(1, 'El nombre es requerido'),
  Description: z.string().optional().nullable(),
  AmountToSale: z.number().int().positive('El monto de venta debe ser positivo'),
  AmountSupplier: z.number().int().positive('El monto de proveedor debe ser positivo'),
  Stock: z.number().int().min(0, 'El stock no puede ser negativo').default(0)
});

// DTO para actualizar un producto
export const updateProductSchema = z.object({
  Name: z.string().min(1).optional(),
  Description: z.string().optional().nullable(),
  AmountToSale: z.number().int().positive().optional(),
  AmountSupplier: z.number().int().positive().optional(),
  Stock: z.number().int().min(0, 'El stock no puede ser negativo').optional()
});
