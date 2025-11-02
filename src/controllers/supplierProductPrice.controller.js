import express from 'express';
import supplierProductPriceService from '../services/supplierProductPrice.service.js';
import { createSupplierProductPriceSchema, updateSupplierProductPriceSchema } from '../dto/supplierProductPrice.dto.js';
import { validateId } from '../dto/common.dto.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// GET /api/supplier-product-prices - Obtener todos los precios
router.get('/', async (req, res) => {
  const result = await supplierProductPriceService.getAll();
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// GET /api/supplier-product-prices/:id - Obtener un precio por ID
router.get('/:id', validateId, async (req, res) => {
  const result = await supplierProductPriceService.getById(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// GET /api/supplier-product-prices/supplier/:supplierId - Obtener precios por SupplierId
router.get('/supplier/:id', validateId, async (req, res) => {
  const result = await supplierProductPriceService.getBySupplierId(req.params.id);
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// GET /api/supplier-product-prices/product/:productId - Obtener precios por ProductId
router.get('/product/:id', validateId, async (req, res) => {
  const result = await supplierProductPriceService.getByProductId(req.params.id);
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// POST /api/supplier-product-prices - Crear un nuevo precio
router.post('/', validate(createSupplierProductPriceSchema), async (req, res) => {
  const result = await supplierProductPriceService.create(req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// PUT /api/supplier-product-prices/:id - Actualizar un precio
router.put('/:id', validateId, validate(updateSupplierProductPriceSchema), async (req, res) => {
  const result = await supplierProductPriceService.update(req.params.id, req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// DELETE /api/supplier-product-prices/:id - Eliminar un precio
router.delete('/:id', validateId, async (req, res) => {
  const result = await supplierProductPriceService.delete(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

export default router;
