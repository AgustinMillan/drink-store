import { z } from 'zod';

// DTO para crear un proveedor
export const createSupplierSchema = z.object({
  Name: z.string().min(1, 'El nombre es requerido'),
  ContactName: z.string().optional().nullable(),
  Phone: z.string().optional().nullable(),
  Email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
  Address: z.string().optional().nullable(),
  Notes: z.string().optional().nullable()
});

// DTO para actualizar un proveedor
export const updateSupplierSchema = z.object({
  Name: z.string().min(1).optional(),
  ContactName: z.string().optional().nullable(),
  Phone: z.string().optional().nullable(),
  Email: z.string().email().optional().nullable().or(z.literal('')),
  Address: z.string().optional().nullable(),
  Notes: z.string().optional().nullable()
});
