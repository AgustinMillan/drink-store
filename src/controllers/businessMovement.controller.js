import express from 'express';
import businessMovementService from '../services/businessMovement.service.js';
import { createBusinessMovementSchema, updateBusinessMovementSchema } from '../dto/businessMovement.dto.js';
import { validateId } from '../dto/common.dto.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// GET /api/business-movements - Obtener todos los movimientos
router.get('/', async (req, res) => {
  const result = await businessMovementService.getAll();
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// GET /api/business-movements/:id - Obtener un movimiento por ID
router.get('/:id', validateId, async (req, res) => {
  const result = await businessMovementService.getById(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// GET /api/business-movements/product/:productId - Obtener movimientos por ProductId
router.get('/product/:productId', validateId, async (req, res) => {
  const result = await businessMovementService.getByProductId(req.params.productId);
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// POST /api/business-movements - Crear un nuevo movimiento
router.post('/', validate(createBusinessMovementSchema), async (req, res) => {
  const result = await businessMovementService.create(req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// PUT /api/business-movements/:id - Actualizar un movimiento
router.put('/:id', validateId, validate(updateBusinessMovementSchema), async (req, res) => {
  const result = await businessMovementService.update(req.params.id, req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// DELETE /api/business-movements/:id - Eliminar un movimiento
router.delete('/:id', validateId, async (req, res) => {
  const result = await businessMovementService.delete(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

export default router;
