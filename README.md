# Sistema de Gestión de Ingresos y Egresos

Aplicación fullstack para la gestión de movimientos financieros con control de acceso basado en roles.

## Tecnologías Utilizadas

- Next.js (Pages Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- NextAuth.js
- Prisma ORM
- PostgreSQL (Supabase)
- Recharts
- Jest y React Testing Library

## Características

### Autenticación

- Login con GitHub mediante NextAuth.js
- Gestión de sesiones con base de datos
- Todos los nuevos usuarios se asignan automáticamente con rol ADMIN

### Gestión de Movimientos

- Visualización de ingresos y egresos en tabla
- Creación de nuevos movimientos (solo ADMIN)
- Edición de movimientos existentes (solo ADMIN)
- Eliminación de movimientos (solo ADMIN)
- Filtros por tipo (Ingresos/Egresos/Todos)

### Gestión de Usuarios

- Listado de usuarios registrados
- Edición de nombre y rol
- Acceso restringido a ADMIN

### Reportes

- Gráfico de barras con movimientos mensuales
- Resumen de balance, ingresos y egresos totales
- Exportación a CSV
- Acceso restringido a ADMIN

## Arquitectura del Proyecto

```
prevent/
├── components/          # Componentes React reutilizables
│   ├── ui/             # Componentes de Shadcn UI
│   └── Layout.tsx      # Layout principal con sidebar
├── lib/                # Utilidades y configuración
│   ├── auth.ts         # Configuración de NextAuth
│   ├── db.ts           # Cliente de Prisma
│   ├── middleware.ts   # Middlewares de autenticación
│   └── utils.ts        # Funciones utilitarias
├── pages/              # Páginas de la aplicación
│   ├── api/            # API routes
│   │   ├── auth/       # Endpoints de autenticación
│   │   ├── movements/  # CRUD de movimientos
│   │   ├── users/      # Gestión de usuarios
│   │   ├── reports/    # Endpoints de reportes
│   │   ├── docs.ts     # Especificación OpenAPI
│   │   └── check-env.ts # Verificación de variables
│   ├── index.tsx       # Página de inicio
│   ├── login.tsx       # Página de login
│   ├── movements.tsx   # Gestión de movimientos
│   ├── users.tsx       # Gestión de usuarios
│   ├── reports.tsx     # Reportes financieros
│   └── swagger.tsx     # Documentación interactiva
├── prisma/             # Esquema de base de datos
│   └── schema.prisma
├── public/             # Archivos estáticos
│   └── images/         # Logos de la aplicación
├── styles/             # Estilos globales
├── types/              # Tipos de TypeScript
└── __tests__/          # Pruebas unitarias
```

## Control de Acceso (RBAC)

### Rol USER

- Acceso a visualización de movimientos

### Rol ADMIN

- Todas las funciones de USER
- Crear, editar y eliminar movimientos
- Gestionar usuarios
- Ver reportes y exportar datos

## API Endpoints

### Movimientos

- GET /api/movements - Obtener todos los movimientos
- POST /api/movements - Crear movimiento (ADMIN)
- PUT /api/movements/[id] - Actualizar movimiento (ADMIN)
- DELETE /api/movements/[id] - Eliminar movimiento (ADMIN)

### Usuarios

- GET /api/users - Listar usuarios (ADMIN)
- PUT /api/users/[id] - Actualizar usuario (ADMIN)

### Reportes

- GET /api/reports/balance - Obtener balance y datos mensuales (ADMIN)

### Documentación

- GET /api/docs - Especificación OpenAPI en JSON
- GET /swagger - Interfaz Swagger UI interactiva

## Instalación y Ejecución Local

### Requisitos Previos

- Node.js 18 o superior
- Cuenta de GitHub
- Base de datos PostgreSQL

### Pasos

1. Clonar el repositorio

```bash
git clone git@github.com:garfdev42/prevent.git
cd prevent
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno
   Crear archivo `.env` en la raíz del proyecto con las variables necesarias.

4. Sincronizar base de datos

```bash
npx prisma db push
```

5. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en https://prevent-kohl.vercel.app/

## Scripts Disponibles

- `npm run dev` - Ejecutar servidor de desarrollo
- `npm run build` - Generar build de producción
- `npm start` - Ejecutar build de producción
- `npm test` - Ejecutar pruebas unitarias
- `npm run lint` - Verificar código con ESLint

## Pruebas Unitarias

Se implementaron pruebas para las funciones utilitarias:

- Formateo de moneda (formatCurrency)
- Formateo de fechas (formatDate)
- Generación de CSV (generateCSV)

Ejecutar pruebas:

```bash
npm test
```

## Despliegue en Vercel

1. Conectar repositorio de GitHub con Vercel
2. Configurar variables de entorno en el dashboard de Vercel
3. Desplegar automáticamente desde la rama principal

## Estructura de Base de Datos

### Tablas Principales

**users** - Información de usuarios

- id, name, email, role, createdAt, updatedAt

**movements** - Movimientos financieros

- id, concept, amount, type, date, userId, createdAt, updatedAt

**accounts** - Cuentas OAuth

- Información de autenticación de GitHub

**sessions** - Sesiones activas

- Gestión de sesiones de usuario
