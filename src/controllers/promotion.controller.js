import express from 'express';
import promotionService from '../services/promotion.service.js';
import { createPromotionSchema, updatePromotionSchema } from '../dto/promotion.dto.js';
import { validateId } from '../dto/common.dto.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// GET /api/promotions - Obtener todas las promociones
router.get('/', async (req, res) => {
  const result = await promotionService.getAll();
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// GET /api/promotions/active - Obtener promociones activas
router.get('/active', async (req, res) => {
  const result = await promotionService.getActive();
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// GET /api/promotions/:id - Obtener una promoción por ID
router.get('/:id', validateId, async (req, res) => {
  const result = await promotionService.getById(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// POST /api/promotions - Crear una nueva promoción
router.post('/', validate(createPromotionSchema), async (req, res) => {
  const result = await promotionService.create(req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// PUT /api/promotions/:id - Actualizar una promoción
router.put('/:id', validateId, validate(updatePromotionSchema), async (req, res) => {
  const result = await promotionService.update(req.params.id, req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// DELETE /api/promotions/:id - Eliminar una promoción
router.delete('/:id', validateId, async (req, res) => {
  const result = await promotionService.delete(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

export default router;

