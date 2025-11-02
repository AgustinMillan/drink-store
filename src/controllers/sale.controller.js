import express from 'express';
import saleService from '../services/sale.service.js';
import { createSaleSchema, updateSaleSchema, createSaleWithItemsSchema } from '../dto/sale.dto.js';
import { validateId } from '../dto/common.dto.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// GET /api/sales - Obtener todas las ventas
router.get('/', async (req, res) => {
  const result = await saleService.getAll();
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// GET /api/sales/today - Obtener ventas del día actual
router.get('/today', async (req, res) => {
  const result = await saleService.getTodaySales();
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// GET /api/sales/current-month - Obtener ventas del mes actual
router.get('/current-month', async (req, res) => {
  const result = await saleService.getCurrentMonthSales();
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// GET /api/sales/financial-report/today - Reporte financiero del día
router.get('/financial-report/today', async (req, res) => {
  const result = await saleService.getTodayFinancialReport();
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// GET /api/sales/financial-report/current-month - Reporte financiero del mes
router.get('/financial-report/current-month', async (req, res) => {
  const result = await saleService.getCurrentMonthFinancialReport();
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// GET /api/sales/:id - Obtener una venta por ID
router.get('/:id', validateId, async (req, res) => {
  const result = await saleService.getById(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// POST /api/sales - Crear una nueva venta
router.post('/', validate(createSaleSchema), async (req, res) => {
  const result = await saleService.create(req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// POST /api/sales/with-items - Crear una venta con items y reducir stock
router.post('/with-items', validate(createSaleWithItemsSchema), async (req, res) => {
  const result = await saleService.createWithItems(req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// PUT /api/sales/:id - Actualizar una venta
router.put('/:id', validateId, validate(updateSaleSchema), async (req, res) => {
  const result = await saleService.update(req.params.id, req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// DELETE /api/sales/:id - Eliminar una venta
router.delete('/:id', validateId, async (req, res) => {
  const result = await saleService.delete(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

export default router;
