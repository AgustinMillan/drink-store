import { z } from 'zod';

// DTO compartido para validar ID
export const idSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número').transform(Number)
});

// Middleware helper para validar ID en rutas
export const validateId = (req, res, next) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'El ID debe ser un número'
    });
  }
  req.params.id = Number(id);
  next();
};
