import { z } from 'zod';

// DTO para crear un precio de proveedor
export const createSupplierProductPriceSchema = z.object({
  SupplierId: z.number().int().positive('SupplierId es requerido'),
  ProductId: z.number().int().positive('ProductId es requerido'),
  UnitPrice: z.number().positive('El precio unitario debe ser positivo')
});

// DTO para actualizar un precio de proveedor
export const updateSupplierProductPriceSchema = z.object({
  SupplierId: z.number().int().positive().optional(),
  ProductId: z.number().int().positive().optional(),
  UnitPrice: z.number().positive().optional()
});
