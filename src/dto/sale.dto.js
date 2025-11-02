import { z } from 'zod';

// DTO para crear un item de venta
export const saleItemSchema = z.object({
  ProductId: z.number().int().positive('ProductId es requerido'),
  Quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  Amount: z.number().positive('El monto debe ser positivo')
});

// DTO para crear una venta completa con items
export const createSaleWithItemsSchema = z.object({
  Amount: z.number().positive('El monto debe ser positivo'),
  PaymentAmount: z.number().positive('El monto de pago debe ser positivo'),
  Items: z.array(saleItemSchema).min(1, 'Debe incluir al menos un producto'),
  TicketNumber: z.string().optional().nullable()
});

// DTO para crear una venta simple (mantener compatibilidad)
export const createSaleSchema = z.object({
  Amount: z.number().positive('El monto debe ser positivo'),
  TicketNumber: z.string().optional().nullable()
});

// DTO para actualizar una venta
export const updateSaleSchema = z.object({
  Amount: z.number().positive().optional(),
  TicketNumber: z.string().optional().nullable()
});
