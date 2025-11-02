import { z } from 'zod';

// DTO para crear un ítem de ticket
export const createItemTicketSchema = z.object({
  SaleId: z.number().int().positive('SaleId es requerido'),
  ProductId: z.number().int().positive('ProductId es requerido'),
  Print: z.any().optional().nullable(), // JSONB puede ser cualquier cosa
  Amount: z.number().positive().optional().nullable(),
  Quantity: z.number().int().positive().optional().nullable()
});

// DTO para actualizar un ítem de ticket
export const updateItemTicketSchema = z.object({
  SaleId: z.number().int().positive().optional(),
  ProductId: z.number().int().positive().optional(),
  Print: z.any().optional().nullable(),
  Amount: z.number().positive().optional().nullable(),
  Quantity: z.number().int().positive().optional().nullable()
});
