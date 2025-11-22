import { Sale, ItemTicket, Product, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import { getStartOfDayArgentina, getEndOfDayArgentina, getStartOfMonthArgentina, getEndOfTodayArgentina } from '../utils/dateHelper.js';
import businessStateService from './businessState.service.js';

// Función helper para calcular reporte financiero (extraída para uso interno)
function calculateFinancialReport(sales, periodType, startDate) {
  let totalInvested = 0; // Inversión total (costo de productos vendidos)
  let totalRevenue = 0; // Ganancia total (precio de venta)
  let totalReinvestment = 0; // Reinversión necesaria (para reponer stock)

  // Calcular por cada venta
  sales.forEach(sale => {
    // El monto total de la venta
    totalRevenue += parseFloat(sale.Amount || 0);

    // Calcular inversión y reinversión por cada item
    if (sale.itemTickets && sale.itemTickets.length > 0) {
      sale.itemTickets.forEach(item => {
        const product = item.product;
        if (product) {
          const quantity = parseInt(item.Quantity || 0);
          const supplierPrice = parseFloat(product.AmountSupplier || 0);

          // Inversión: lo que costó comprar estos productos
          const itemInvestment = supplierPrice * quantity;
          totalInvested += itemInvestment;

          // Reinversión: lo que cuesta reponer el stock vendido
          // (usamos el precio de proveedor actual)
          totalReinvestment += itemInvestment;
        }
      });
    }
  });

  // Ganancia real = Ganancia - Inversión
  const realProfit = totalRevenue - totalInvested;

  // Margen de ganancia en porcentaje
  const profitMargin = totalRevenue > 0
    ? ((realProfit / totalRevenue) * 100).toFixed(2)
    : 0;

  const periodLabel = periodType === 'day'
    ? 'Día actual'
    : 'Mes actual';

  return {
    period: periodLabel,
    periodStart: startDate.toISOString().split('T')[0],
    report: {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)), // Lo ganado (ventas)
      totalInvested: parseFloat(totalInvested.toFixed(2)), // Lo invertido (costo de productos vendidos)
      totalReinvestment: parseFloat(totalReinvestment.toFixed(2)), // Cuánto reinvertir (para reponer stock)
      realProfit: parseFloat(realProfit.toFixed(2)), // Ganancia real
      profitMargin: parseFloat(profitMargin) // Margen de ganancia en %
    },
    summary: {
      totalSales: sales.length,
      message: `De las ${sales.length} ventas realizadas, se invirtió $${totalInvested.toFixed(2)}, se ganó $${totalRevenue.toFixed(2)}, con una ganancia real de $${realProfit.toFixed(2)}. Para reponer el stock vendido se necesita reinvertir $${totalReinvestment.toFixed(2)}.`
    }
  };
}

class SaleService {
  // Obtener todas las ventas
  async getAll() {
    try {
      const sales = await Sale.findAll({
        include: [{
          model: ItemTicket,
          as: 'itemTickets'
        }],
        order: [['CreatedAt', 'DESC']]
      });
      return { success: true, data: sales };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener una venta por ID
  async getById(id) {
    try {
      const sale = await Sale.findByPk(id, {
        include: [{
          model: ItemTicket,
          as: 'itemTickets'
        }]
      });
      if (!sale) {
        return { success: false, error: 'Venta no encontrada', status: 404 };
      }
      return { success: true, data: sale };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Crear una nueva venta
  async create(saleData) {
    try {
      const sale = await Sale.create(saleData);
      return { success: true, data: sale, status: 201 };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Actualizar una venta
  async update(id, saleData) {
    try {
      const sale = await Sale.findByPk(id);
      if (!sale) {
        return { success: false, error: 'Venta no encontrada', status: 404 };
      }
      await sale.update(saleData);
      return { success: true, data: sale };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Eliminar una venta
  async delete(id) {
    try {
      const sale = await Sale.findByPk(id);
      if (!sale) {
        return { success: false, error: 'Venta no encontrada', status: 404 };
      }
      await sale.destroy();
      return { success: true, message: 'Venta eliminada exitosamente' };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Crear una venta con items y reducir stock
  async createWithItems(saleData) {
    const transaction = await sequelize.transaction();

    try {
      const { Amount, PaymentAmount, Items, TicketNumber } = saleData;

      // Validar que el pago sea suficiente
      if (PaymentAmount < Amount) {
        await transaction.rollback();
        return { success: false, error: 'El monto de pago es insuficiente', status: 400 };
      }

      // Validar stock disponible para todos los productos
      for (const item of Items) {
        const product = await Product.findByPk(item.ProductId, { transaction });
        if (!product) {
          await transaction.rollback();
          return { success: false, error: `Producto con ID ${item.ProductId} no encontrado`, status: 404 };
        }

        if (product.Stock < item.Quantity) {
          await transaction.rollback();
          return {
            success: false,
            error: `Stock insuficiente para ${product.Name}. Disponible: ${product.Stock}, Solicitado: ${item.Quantity}`,
            status: 400
          };
        }
      }

      // Crear la venta
      const sale = await Sale.create({
        Amount,
        TicketNumber: TicketNumber || null
      }, { transaction });

      // Crear los items y reducir stock
      const createdItems = [];
      for (const item of Items) {
        // Crear el ItemTicket
        const itemTicket = await ItemTicket.create({
          SaleId: sale.Id,
          ProductId: item.ProductId,
          Quantity: item.Quantity,
          Amount: item.Amount
        }, { transaction });

        // Reducir el stock del producto
        const product = await Product.findByPk(item.ProductId, { transaction });
        await product.update(
          { Stock: product.Stock - item.Quantity },
          { transaction }
        );

        createdItems.push(itemTicket);
      }

      // Commit de la transacción
      await transaction.commit();

      // Obtener la venta completa con items
      const saleWithItems = await Sale.findByPk(sale.Id, {
        include: [{
          model: ItemTicket,
          as: 'itemTickets'
        }]
      });

      return {
        success: true,
        data: saleWithItems,
        message: 'Venta creada exitosamente',
        status: 201
      };
    } catch (error) {
      // Rollback en caso de error
      await transaction.rollback();
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Obtener ventas del día actual
  async getTodaySales() {
    try {
      const startOfDay = getStartOfDayArgentina();
      const endOfDay = getEndOfDayArgentina();

      const sales = await Sale.findAll({
        where: {
          CreatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay
          }
        },
        include: [{
          model: ItemTicket,
          as: 'itemTickets',
          include: [{
            model: Product,
            as: 'product'
          }]
        }],
        order: [['CreatedAt', 'DESC']]
      });

      // Calcular totales del día
      const totalAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.Amount || 0), 0);
      const totalSales = sales.length;
      const totalItems = sales.reduce((sum, sale) => sum + (sale.itemTickets?.length || 0), 0);

      return {
        success: true,
        data: {
          sales,
          summary: {
            totalSales,
            totalAmount,
            totalItems,
            date: startOfDay.toISOString().split('T')[0] // Fecha en formato YYYY-MM-DD
          }
        }
      };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Obtener ventas del mes actual (desde día 1 hasta hoy)
  async getCurrentMonthSales() {
    try {
      const startOfMonth = getStartOfMonthArgentina();
      const endOfToday = getEndOfTodayArgentina();

      const sales = await Sale.findAll({
        where: {
          CreatedAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfToday
          }
        },
        include: [{
          model: ItemTicket,
          as: 'itemTickets',
          include: [{
            model: Product,
            as: 'product'
          }]
        }],
        order: [['CreatedAt', 'DESC']]
      });

      // Calcular totales del mes
      const totalAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.Amount || 0), 0);
      const totalSales = sales.length;
      const totalItems = sales.reduce((sum, sale) => sum + (sale.itemTickets?.length || 0), 0);

      // Agrupar por día para estadísticas diarias
      const salesByDay = {};
      sales.forEach(sale => {
        const dateKey = new Date(sale.CreatedAt).toISOString().split('T')[0]; // YYYY-MM-DD
        if (!salesByDay[dateKey]) {
          salesByDay[dateKey] = {
            date: dateKey,
            count: 0,
            amount: 0
          };
        }
        salesByDay[dateKey].count += 1;
        salesByDay[dateKey].amount += parseFloat(sale.Amount || 0);
      });

      return {
        success: true,
        data: {
          sales,
          summary: {
            totalSales,
            totalAmount,
            totalItems,
            monthStart: startOfMonth.toISOString().split('T')[0],
            monthEnd: endOfToday.toISOString().split('T')[0],
            salesByDay: Object.values(salesByDay).sort((a, b) => a.date.localeCompare(b.date))
          }
        }
      };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Generar reporte financiero del día
  async getTodayFinancialReport() {
    try {
      const startOfDay = getStartOfDayArgentina();
      const endOfDay = getEndOfDayArgentina();

      const sales = await Sale.findAll({
        where: {
          CreatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay
          }
        },
        include: [{
          model: ItemTicket,
          as: 'itemTickets',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });

      return this.calculateFinancialReport(sales, 'day', startOfDay);
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Generar reporte financiero del mes
  async getCurrentMonthFinancialReport() {
    try {
      const startOfMonth = getStartOfMonthArgentina();
      const endOfToday = getEndOfTodayArgentina();

      const sales = await Sale.findAll({
        where: {
          CreatedAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfToday
          }
        },
        include: [{
          model: ItemTicket,
          as: 'itemTickets',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });

      return this.calculateFinancialReport(sales, 'month', startOfMonth);
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Generar reporte financiero del día
  async getTodayFinancialReport() {
    try {
      const startOfDay = getStartOfDayArgentina();
      const endOfDay = getEndOfDayArgentina();

      const sales = await Sale.findAll({
        where: {
          CreatedAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay
          }
        },
        include: [{
          model: ItemTicket,
          as: 'itemTickets',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });

      const report = calculateFinancialReport(sales, 'day', startOfDay);
      return { success: true, data: report };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Generar reporte financiero del mes
  async getCurrentMonthFinancialReport() {
    try {
      const startOfMonth = getStartOfMonthArgentina();
      const endOfToday = getEndOfTodayArgentina();

      const sales = await Sale.findAll({
        where: {
          CreatedAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfToday
          }
        },
        include: [{
          model: ItemTicket,
          as: 'itemTickets',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });

      const report = calculateFinancialReport(sales, 'month', startOfMonth);
      return { success: true, data: report };
    } catch (error) {
      return { success: false, error: error.message, status: 500 };
    }
  }
}

export default new SaleService();
