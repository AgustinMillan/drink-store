import express from 'express';
import businessStateService from '../services/businessState.service.js';
import { createBusinessStateSchema } from '../dto/businessState.dto.js';
import { validateId } from '../dto/common.dto.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// GET /api/business-states - Obtener todos los estados
router.get('/', async (req, res) => {
  const result = await businessStateService.getAll();
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// GET /api/business-states/latest - Obtener el último estado
router.get('/latest', async (req, res) => {
  const result = await businessStateService.getLatest();
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// GET /api/business-states/:id - Obtener un estado por ID
router.get('/:id', validateId, async (req, res) => {
  const result = await businessStateService.getById(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// POST /api/business-states - Crear un nuevo estado
router.post('/', validate(createBusinessStateSchema), async (req, res) => {
  const result = await businessStateService.create(req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// PUT /api/business-states/:id - Actualizar un estado
router.put('/:id', validateId, validate(createBusinessStateSchema), async (req, res) => {
  const result = await businessStateService.update(req.params.id, req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// DELETE /api/business-states/:id - Eliminar un estado
router.delete('/:id', validateId, async (req, res) => {
  const result = await businessStateService.delete(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

export default router;
