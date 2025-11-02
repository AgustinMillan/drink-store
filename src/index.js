import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, configureTimezone } from './config/database.js';
import { syncModels } from './models/index.js';

// Importar controladores
import productController from './controllers/product.controller.js';
import saleController from './controllers/sale.controller.js';
import itemTicketController from './controllers/itemTicket.controller.js';
import supplierController from './controllers/supplier.controller.js';
import businessMovementController from './controllers/businessMovement.controller.js';
import supplierProductPriceController from './controllers/supplierProductPrice.controller.js';
import businessStateController from './controllers/businessState.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:5173', // Puerto por defecto de Vite
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'DirnkStore API',
        database: 'PostgreSQL con Sequelize',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            sales: '/api/sales',
            itemTickets: '/api/item-tickets',
            suppliers: '/api/suppliers',
            businessMovements: '/api/business-movements',
            supplierProductPrices: '/api/supplier-product-prices',
            businessStates: '/api/business-states'
        }
    });
});

// Registrar rutas
app.use('/api/products', productController);
app.use('/api/sales', saleController);
app.use('/api/item-tickets', itemTicketController);
app.use('/api/suppliers', supplierController);
app.use('/api/business-movements', businessMovementController);
app.use('/api/supplier-product-prices', supplierProductPriceController);
app.use('/api/business-states', businessStateController);

// Inicializar servidor
const startServer = async () => {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
        console.warn('⚠️  Advertencia: No se pudo conectar a la base de datos. El servidor continuará ejecutándose.');
    } else {
        // Configurar timezone adicionalmente para asegurar consistencia
        await configureTimezone();
        
        // Sincronizar modelos (crear tablas si no existen)
        // En desarrollo puedes usar syncModels(true) para resetear las tablas
        // ¡CUIDADO! Esto borra todos los datos
        const forceSync = process.env.FORCE_SYNC === 'true';
        if (forceSync) {
            console.warn('⚠️  FORCE_SYNC está activado. Esto eliminará todas las tablas existentes.');
        }
        try {
            await syncModels(forceSync);
        } catch (error) {
            console.error('❌ Error al sincronizar modelos:', error);
        }
    }

    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
};

startServer();