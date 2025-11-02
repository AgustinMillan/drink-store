# DirnkStore Backend

Backend del proyecto DirnkStore usando Express.js y Sequelize con PostgreSQL.

## 📋 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional

## ✅ Requisitos Previos

### Opción 1: Instalación Local

- Node.js >= 18.x
- PostgreSQL >= 12.x
- npm >= 9.x

### Opción 2: Docker (Recomendado)

- Docker >= 20.x
- Docker Compose >= 2.x

## 📦 Instalación

```bash
npm install
```

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

### Opción 1: URL de Conexión (Recomendado para Supabase)

```env
# === BASE DE DATOS - Supabase ===
DB_URL=postgresql://postgres:tu_contraseña@db.tu-proyecto.supabase.co:5432/postgres
DB_SSL=false

# === SERVIDOR ===
PORT=3000
NODE_ENV=development
```

### Opción 2: Variables Individuales (PostgreSQL local)

```env
# === BASE DE DATOS ===
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=dirnkstore

# === SERVIDOR ===
PORT=3000
NODE_ENV=development
```

### Configuración de PostgreSQL

1. Asegúrate de que PostgreSQL esté corriendo
2. Crea la base de datos:
   ```sql
   CREATE DATABASE dirnkstore;
   ```
3. Configura las credenciales en tu archivo `.env`

## 🚀 Ejecución

### Con Docker (Recomendado)

#### Desarrollo:

```bash
# Crear archivo .env (ver sección Variables de Entorno)
# Luego ejecutar:
docker-compose up

# O en segundo plano:
docker-compose up -d

# Ver logs:
docker-compose logs -f app

# Detener servicios:
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Borra datos):
docker-compose down -v
```

#### Producción:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Sin Docker (Instalación Local)

#### Modo Desarrollo (con hot-reload):

```bash
npm run dev
```

#### Modo Producción:

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Variables de Entorno para Docker

Cuando uses Docker, el archivo `.env` solo necesita estas variables mínimas:

```env
# Para Docker, DB_HOST será 'postgres' automáticamente
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=dirnkstore
PORT=3000
NODE_ENV=development
```

Docker Compose configurará automáticamente la conexión entre contenedores.

## 🏗️ Estructura del Proyecto

```
be/
├── config/
│   └── database.js      # Configuración de Sequelize
├── models/
│   ├── index.js         # Inicialización de modelos
│   └── Example.js       # Ejemplo de modelo
├── index.js             # Punto de entrada de la aplicación
├── package.json
└── .env                 # Variables de entorno (no se commitea)
```

## 📚 Uso de Sequelize

### Crear un Modelo

1. Crea un archivo en `models/` siguiendo el ejemplo de `Example.js`
2. Importa el modelo en `models/index.js`
3. Sincroniza los modelos con la base de datos:

```javascript
import { syncModels } from "./models/index.js";

// Sincronizar (crear tablas si no existen)
await syncModels();

// Sincronizar forzando (¡CUIDADO! Esto borra todas las tablas)
await syncModels(true);
```

### Ejemplo de Uso de un Modelo

```javascript
import Example from "./models/Example.js";

// Crear un registro
const example = await Example.create({
  name: "Ejemplo",
  description: "Descripción del ejemplo",
});

// Buscar todos los registros
const examples = await Example.findAll();

// Buscar por ID
const exampleById = await Example.findByPk(1);

// Actualizar
await example.update({ name: "Nuevo nombre" });

// Eliminar
await example.destroy();
```

## 🔍 Verificar Conexión

Al iniciar el servidor, se probará automáticamente la conexión a la base de datos. Verás en la consola:

- ✅ Si la conexión es exitosa
- ❌ Si hay algún error de conexión

### Verificar con Docker

```bash
# Ver logs de la aplicación
docker-compose logs app

# Ver logs de PostgreSQL
docker-compose logs postgres

# Conectarse a PostgreSQL desde el contenedor
docker-compose exec postgres psql -U postgres -d dirnkstore

# Ejecutar comandos en el contenedor de la app
docker-compose exec app sh
```

## 🐳 Docker

### Comandos Útiles de Docker

```bash
# Reconstruir imágenes
docker-compose build

# Reiniciar solo un servicio
docker-compose restart app

# Ver estado de los contenedores
docker-compose ps

# Limpiar todo (contenedores, imágenes, volúmenes)
docker-compose down -v --rmi all
```

### Volúmenes de Datos

Los datos de PostgreSQL se guardan en un volumen de Docker llamado `dirnkstore-postgres-data`. Esto significa que aunque elimines los contenedores, los datos se mantienen.

Para eliminar completamente los datos:

```bash
docker-compose down -v
```

## 📝 Próximos Pasos

1. Crea tus modelos en la carpeta `models/`
2. Define tus rutas y controladores
3. Configura tus middlewares según necesites
4. Implementa tu lógica de negocio

---

//////////////////////////////////////////////////////
// 📦 ESQUEMA GENERAL DE NEGOCIO (POSTGRES / DBML)
//////////////////////////////////////////////////////

Table Product {
Id integer [primary key]
Name varchar [not null]
Description varchar
AmountToSale int [not null]
AmountSupplier int [not null]
LastModified timestamp
}

Table Sale {
Id integer [primary key]
Amount decimal [not null]
TicketNumber varchar
CreatedAt timestamp
}

Table ItemTicket {
Id integer [primary key]
SaleId int [not null]
ProductId int [not null]
Print jsonb
Amount decimal
Quantity int
}

Table Supplier {
Id integer [primary key]
Name varchar [not null]
ContactName varchar
Phone varchar
Email varchar
Address varchar
Notes text
CreatedAt timestamp
}

Table BusinessMovement {
Id integer [primary key]
ProductId int [not null]
SupplierId int // puede ser NULL para salidas
Type varchar [not null] // 'IN' | 'OUT'
Reason varchar [not null] // 'SALE', 'PURCHASE', 'ADJUSTMENT', 'LOSS', etc.
Quantity int [not null]
UnitCost decimal
TotalAmount decimal
ReferenceId int // id de la venta/compra
ReferenceType varchar // 'Sale', 'PurchaseOrder', etc.
CreatedAt timestamp
}

Table SupplierProductPrice {
Id integer [primary key]
SupplierId int [not null]
ProductId int [not null]
UnitPrice decimal [not null]
LastUpdated timestamp
}

Table BusinessState {
Id integer [primary key]
Date timestamp
TotalStockValue decimal [not null]
TotalSales decimal [not null]
TotalPurchases decimal [not null]
TotalProfit decimal [not null]
Notes text
}

//////////////////////////////////////////////////////
// 🔗 RELACIONES
//////////////////////////////////////////////////////

// Relación producto <-> ítem del ticket
Ref: Product.Id < ItemTicket.ProductId

// Relación venta (ticket) <-> ítem del ticket
Ref: Sale.Id < ItemTicket.SaleId

// Relación producto <-> movimiento
Ref: Product.Id < BusinessMovement.ProductId

// Relación proveedor <-> movimiento
Ref: Supplier.Id < BusinessMovement.SupplierId

// Relación proveedor <-> precios de producto
Ref: Supplier.Id < SupplierProductPrice.SupplierId

// Relación producto <-> precios de proveedor
Ref: Product.Id < SupplierProductPrice.ProductId

## 📄 Licencia

ISC
