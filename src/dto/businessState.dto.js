import { z } from 'zod';

// DTO para crear un estado de negocio
export const createBusinessStateSchema = z.object({
  Date: z.string().datetime().optional().nullable().or(z.date()),
  TotalStockValue: z.number().nonnegative('El valor de stock debe ser positivo'),
  TotalSales: z.number().nonnegative('Las ventas totales deben ser positivas'),
  TotalPurchases: z.number().nonnegative('Las compras totales deben ser positivas'),
  TotalProfit: z.number('El profit total debe ser un número'),
  Notes: z.string().optional().nullable()
});

// DTO para actualizar un estado de negocio
export const updateBusinessStateSchema = z.object({
  Date: z.string().datetime().optional().nullable().or(z.date()).optional(),
  TotalStockValue: z.number().nonnegative().optional(),
  TotalSales: z.number().nonnegative().optional(),
  TotalPurchases: z.number().nonnegative().optional(),
  TotalProfit: z.number().optional(),
  Notes: z.string().optional().nullable()
});
