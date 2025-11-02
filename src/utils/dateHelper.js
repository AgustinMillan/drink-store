import moment from 'moment-timezone';

// Timezone de Argentina
const ARGENTINA_TIMEZONE = 'America/Argentina/Buenos_Aires';

/**
 * Obtiene la fecha y hora actual en el timezone de Argentina
 * @returns {Date} Fecha en timezone de Argentina
 */
export const getArgentinaDate = () => {
  return moment.tz(ARGENTINA_TIMEZONE).toDate();
};

/**
 * Obtiene la fecha y hora actual en formato ISO para Argentina
 * @returns {string} Fecha en formato ISO con timezone
 */
export const getArgentinaNowSQLISO = () => {
  return moment.tz(ARGENTINA_TIMEZONE).format();
};

/**
 * Convierte una fecha a timezone de Argentina
 * @param {Date|string} date - Fecha a convertir
 * @returns {Date} Fecha convertida a timezone de Argentina
 */
export const toArgentinaDate = (date) => {
  if (!date) return null;
  return moment.tz(date, ARGENTINA_TIMEZONE).toDate();
};

/**
 * Formatea una fecha en el timezone de Argentina
 * @param {Date|string} date - Fecha a formatear
 * @param {string} format - Formato deseado (por defecto: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} Fecha formateada
 */
export const formatArgentinaDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return null;
  return moment.tz(date, ARGENTINA_TIMEZONE).format(format);
};

/**
 * Retorna una función literal de Sequelize para usar NOW() con timezone de Argentina
 * @param {Object} sequelize - Instancia de Sequelize
 * @returns {Object} Literal de Sequelize
 */
export const getArgentinaNowLiteral = (sequelize) => {
  return sequelize.literal(`(NOW() AT TIME ZONE 'UTC' AT TIME ZONE '${ARGENTINA_TIMEZONE}')::timestamp`);
};

/**
 * Retorna la expresión SQL para obtener la fecha actual en Argentina
 * Esto convierte la hora UTC de PostgreSQL a la hora local de Argentina
 * @returns {string} Expresión SQL
 */
export const getArgentinaNowSQL = () => {
  // NOW() retorna timestamp with timezone en UTC
  // Lo convertimos a timezone de Argentina y luego a timestamp sin timezone
  // Forma 1: Si NOW() ya está en UTC (por defecto de PostgreSQL)
  return `NOW()`;
};

/**
 * Obtiene el inicio del día actual en Argentina (00:00:00)
 * @returns {Date} Fecha con hora 00:00:00 del día actual en Argentina
 */
export const getStartOfDayArgentina = () => {
  return moment.tz(ARGENTINA_TIMEZONE).startOf('day').toDate();
};

/**
 * Obtiene el final del día actual en Argentina (23:59:59.999)
 * @returns {Date} Fecha con hora 23:59:59.999 del día actual en Argentina
 */
export const getEndOfDayArgentina = () => {
  return moment.tz(ARGENTINA_TIMEZONE).endOf('day').toDate();
};

/**
 * Obtiene el inicio del mes actual en Argentina (día 1 a las 00:00:00)
 * @returns {Date} Fecha con día 1 del mes actual a las 00:00:00 en Argentina
 */
export const getStartOfMonthArgentina = () => {
  return moment.tz(ARGENTINA_TIMEZONE).startOf('month').toDate();
};

/**
 * Obtiene el final del día actual en Argentina (hora actual del día)
 * @returns {Date} Fecha con la hora actual del día en Argentina
 */
export const getEndOfTodayArgentina = () => {
  return moment.tz(ARGENTINA_TIMEZONE).toDate();
};

