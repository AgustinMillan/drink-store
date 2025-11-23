import { z } from 'zod';

// DTO para crear un item de promoción
export const promotionItemSchema = z.object({
  ProductId: z.number().int().positive('ProductId es requerido'),
  Quantity: z.number().int().positive('La cantidad debe ser mayor a 0').default(1)
});

// DTO para crear una promoción
export const createPromotionSchema = z.object({
  Name: z.string().min(1, 'El nombre es requerido'),
  Description: z.string().optional().nullable(),
  Price: z.number().positive('El precio debe ser positivo'),
  StartDate: z.string().datetime().optional().nullable(),
  EndDate: z.string().datetime().optional().nullable(),
  IsActive: z.boolean().optional().default(true),
  Items: z.array(promotionItemSchema).min(1, 'Debe incluir al menos un producto')
});

// DTO para actualizar una promoción
export const updatePromotionSchema = z.object({
  Name: z.string().min(1).optional(),
  Description: z.string().optional().nullable(),
  Price: z.number().positive().optional(),
  StartDate: z.string().datetime().optional().nullable(),
  EndDate: z.string().datetime().optional().nullable(),
  IsActive: z.boolean().optional(),
  Items: z.array(promotionItemSchema).optional()
});

// DTO para crear una venta con promoción
export const createSaleWithPromotionSchema = z.object({
  PromotionId: z.number().int().positive('PromotionId es requerido'),
  PaymentAmount: z.number().positive('El monto de pago debe ser positivo'),
  TicketNumber: z.string().optional().nullable()
});

