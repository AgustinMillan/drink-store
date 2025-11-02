import express from 'express';
import itemTicketService from '../services/itemTicket.service.js';
import { createItemTicketSchema, updateItemTicketSchema } from '../dto/itemTicket.dto.js';
import { validateId } from '../dto/common.dto.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// GET /api/item-tickets - Obtener todos los ítems
router.get('/', async (req, res) => {
  const result = await itemTicketService.getAll();
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// GET /api/item-tickets/:id - Obtener un ítem por ID
router.get('/:id', validateId, async (req, res) => {
  const result = await itemTicketService.getById(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// GET /api/item-tickets/sale/:saleId - Obtener ítems por SaleId
router.get('/sale/:saleId', validateId, async (req, res) => {
  const result = await itemTicketService.getBySaleId(req.params.saleId);
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// POST /api/item-tickets - Crear un nuevo ítem
router.post('/', validate(createItemTicketSchema), async (req, res) => {
  const result = await itemTicketService.create(req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// PUT /api/item-tickets/:id - Actualizar un ítem
router.put('/:id', validateId, validate(updateItemTicketSchema), async (req, res) => {
  const result = await itemTicketService.update(req.params.id, req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// DELETE /api/item-tickets/:id - Eliminar un ítem
router.delete('/:id', validateId, async (req, res) => {
  const result = await itemTicketService.delete(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

export default router;
