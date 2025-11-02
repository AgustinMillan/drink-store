import express from 'express';
import productService from '../services/product.service.js';
import { createProductSchema, updateProductSchema } from '../dto/product.dto.js';
import { validateId } from '../dto/common.dto.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// GET /api/products - Obtener todos los productos
router.get('/', async (req, res) => {
  const result = await productService.getAll();
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// GET /api/products/best-price - Obtener el mejor precio por producto
router.get('/best-price', async (req, res) => {
  const result = await productService.getBestPrice();
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// GET /api/products/low-stock - Obtener productos con stock bajo (menos de 5)
router.get('/low-stock', async (req, res) => {
  const threshold = parseInt(req.query.threshold) || 5;
  const result = await productService.getLowStock(threshold);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// GET /api/products/:id - Obtener un producto por ID
router.get('/:id', validateId, async (req, res) => {
  const result = await productService.getById(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// POST /api/products - Crear un nuevo producto
router.post('/', validate(createProductSchema), async (req, res) => {
  const result = await productService.create(req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// POST /api/products/bulk-update-prices - actualizar precios de productos
router.post('/bulk-update-prices', async (_req, res) => {
  const result = await productService.bulkUpdatePrices();
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// PUT /api/products/:id - Actualizar un producto
router.put('/:id', validateId, validate(updateProductSchema), async (req, res) => {
  const result = await productService.update(req.params.id, req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// DELETE /api/products/:id - Eliminar un producto
router.delete('/:id', validateId, async (req, res) => {
  const result = await productService.delete(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

export default router;
