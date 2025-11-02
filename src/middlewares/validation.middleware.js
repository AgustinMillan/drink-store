// Middleware para validar requests con Zod
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: 'Error de validación',
          details: result.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      req.validatedData = result.data;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error en la validación',
        message: error.message
      });
    }
  };
};

// Middleware para validar parámetros de ruta (ID)
export const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'El ID debe ser un número'
    });
  }
  req.params.id = parseInt(id);
  next();
};
