import { z } from 'zod';

// DTO para crear un estado de negocio
export const createBusinessStateSchema = z.object({
  TotalStockValue: z.number().nonnegative('El valor de stock debe ser positivo'),
  Balance: z.number().nonnegative('El balance debe ser positivo'),
});
