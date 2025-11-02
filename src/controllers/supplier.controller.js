import express from 'express';
import supplierService from '../services/supplier.service.js';
import { createSupplierSchema, updateSupplierSchema } from '../dto/supplier.dto.js';
import { validateId } from '../dto/common.dto.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// GET /api/suppliers - Obtener todos los proveedores
router.get('/', async (req, res) => {
  const result = await supplierService.getAll();
  const status = result.success ? 200 : 500;
  res.status(status).json(result);
});

// GET /api/suppliers/:id - Obtener un proveedor por ID
router.get('/:id', validateId, async (req, res) => {
  const result = await supplierService.getById(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// POST /api/suppliers - Crear un nuevo proveedor
router.post('/', validate(createSupplierSchema), async (req, res) => {
  const result = await supplierService.create(req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// PUT /api/suppliers/:id - Actualizar un proveedor
router.put('/:id', validateId, validate(updateSupplierSchema), async (req, res) => {
  const result = await supplierService.update(req.params.id, req.validatedData);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

// DELETE /api/suppliers/:id - Eliminar un proveedor
router.delete('/:id', validateId, async (req, res) => {
  const result = await supplierService.delete(req.params.id);
  const status = result.status || (result.success ? 200 : 500);
  res.status(status).json(result);
});

export default router;
