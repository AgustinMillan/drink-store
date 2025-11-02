import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Supabase
// Si existe DB_URL, usamos esa (formato: postgresql://user:password@host:port/database)
// Si no, usamos las variables individuales
let sequelize;

if (process.env.DB_URL) {
  // Usar URL de conexión directa (Supabase)
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    timezone: '-03:00', // Timezone de Argentina (UTC-3)
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    sync: { force: false }, // Nunca hacer force en producción
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      useUTC: false, // No usar UTC por defecto
      dateStrings: false,
      typeCast: true,
      connectTimeout: 30000,
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    define: {
      freezeTableName: true
    },
    // Hook para configurar timezone después de cada conexión
    hooks: {
      afterConnect: async (connection, config) => {
        try {
          await connection.query("SET TIME ZONE '-03:00';");
        } catch (error) {
          console.warn('⚠️  No se pudo configurar timezone en la conexión:', error.message);
        }
      }
    }
  });
} else {
  // Usar configuración individual (fallback)
  sequelize = new Sequelize(
    process.env.DB_NAME || '',
    process.env.DB_USER || '',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      timezone: '-03:00', // Timezone de Argentina (UTC-3)
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      sync: { force: process.env.NODE_ENV === 'development' ? true : false },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        useUTC: false, // No usar UTC por defecto
        dateStrings: false,
        typeCast: true,
        connectTimeout: 30000
      },
      define: {
        freezeTableName: true
      },
      // Hook para configurar timezone después de cada conexión
      hooks: {
        afterConnect: async (connection, config) => {
          try {
            await connection.query("SET TIME ZONE '-03:00';");
          } catch (error) {
            console.warn('⚠️  No se pudo configurar timezone en la conexión:', error.message);
          }
        }
      }
    }
  );
}

// Función para probar la conexión y configurar timezone
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    
    // Configurar timezone en PostgreSQL para esta sesión
    await sequelize.query("SET TIME ZONE '-03:00';");
    
    // Verificar timezone actual en PostgreSQL
    const [results] = await sequelize.query("SHOW TIMEZONE;");
    const timezone = results[0]?.TimeZone || results[0]?.timezone || 'desconocido';
    
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    console.log(`✅ Timezone configurado: ${timezone} (UTC-3 Argentina)`);
    
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    return false;
  }
};

// Función para configurar timezone en cada conexión del pool
// Esta función se debe llamar periódicamente o usar con un hook de pool
export const configureTimezone = async () => {
  try {
    await sequelize.query("SET TIME ZONE '-03:00';");
  } catch (error) {
    console.warn('⚠️  Advertencia: No se pudo configurar el timezone:', error.message);
  }
};

export default sequelize;
