# Sistema de Gestión de Ingresos y Gastos

Sistema web fullstack para la gestión de movimientos financieros, usuarios y generación de reportes.

## Tecnologías Utilizadas

### Frontend

- Next.js 14 (Pages Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Recharts

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL (Supabase)
- NextAuth.js

### Autenticación

- NextAuth.js con GitHub OAuth
- Control de acceso basado en roles (RBAC)

## Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de GitHub
- Cuenta de Supabase
- Cuenta de Vercel (para despliegue)

## Instalación Local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd Prevent
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

NEXTAUTH_SECRET="tu-secret-generado"
NEXTAUTH_URL="http://localhost:3000"

GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"
```

#### Obtener credenciales de GitHub:

1. Ve a https://github.com/settings/developers
2. Crea una nueva OAuth App
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copia el Client ID y Client Secret

#### Generar NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### 4. Configurar la base de datos

```bash
npx prisma generate
npx prisma db push
```

### 5. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

## Estructura del Proyecto

```
Prevent/
├── components/          # Componentes React reutilizables
├── lib/                 # Utilidades y configuraciones
├── pages/
│   ├── api/            # API Routes (Backend)
│   ├── movements.tsx   # Gestión de ingresos/egresos
│   ├── users.tsx       # Gestión de usuarios
│   ├── reports.tsx     # Reportes financieros
│   └── swagger.tsx     # Documentación API
├── prisma/             # Schema de base de datos
├── public/             # Archivos estáticos
└── styles/             # Estilos globales
```

## Funcionalidades

### Roles de Usuario

- **ADMIN**: Acceso completo (crear, editar, eliminar movimientos, gestionar usuarios, ver reportes)
- **USER**: Solo puede ver movimientos

**Nota**: Todos los nuevos usuarios se registran automáticamente como ADMIN.

### Módulos

#### 1. Ingresos y Egresos

- Visualización de todos los movimientos
- Crear nuevos movimientos (ADMIN)
- Editar movimientos existentes (ADMIN)
- Eliminar movimientos (ADMIN)
- Cálculo automático de totales

#### 2. Gestión de Usuarios (Solo ADMIN)

- Lista de usuarios registrados
- Editar información y roles de usuarios

#### 3. Reportes (Solo ADMIN)

- Gráfico de barras con movimientos mensuales
- Cards con totales de ingresos, egresos y balance
- Descarga de reportes en formato CSV

#### 4. Documentación API

- Disponible en `/swagger`
- Documentación OpenAPI completa de todos los endpoints

## API Endpoints

### Autenticación

- `GET /api/auth/signin` - Inicio de sesión
- `GET /api/auth/signout` - Cerrar sesión
- `GET /api/auth/callback/github` - Callback de GitHub OAuth

### Movimientos

- `GET /api/movements` - Obtener todos los movimientos
- `POST /api/movements` - Crear movimiento (ADMIN)
- `PUT /api/movements/[id]` - Actualizar movimiento (ADMIN)
- `DELETE /api/movements/[id]` - Eliminar movimiento (ADMIN)

### Usuarios

- `GET /api/users` - Obtener todos los usuarios (ADMIN)
- `PUT /api/users/[id]` - Actualizar usuario (ADMIN)

### Reportes

- `GET /api/reports/balance` - Obtener balance y estadísticas (ADMIN)
- `GET /api/reports/csv` - Descargar reporte CSV (ADMIN)

### Documentación

- `GET /api/docs` - Especificación OpenAPI en JSON

## Despliegue en Vercel

### 1. Preparar el repositorio

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Conectar con Vercel

1. Ve a https://vercel.com
2. Crea una nueva cuenta o inicia sesión
3. Haz clic en "Add New Project"
4. Importa tu repositorio de GitHub
5. Vercel detectará automáticamente Next.js

### 3. Configurar variables de entorno

En la sección "Environment Variables" de Vercel, agrega:

```
DATABASE_URL
DIRECT_URL
NEXTAUTH_SECRET
NEXTAUTH_URL (cambia a tu URL de Vercel)
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

### 4. Actualizar GitHub OAuth App

1. Ve a tu GitHub OAuth App
2. Actualiza la Authorization callback URL:
   - Agrega: `https://tu-app.vercel.app/api/auth/callback/github`

### 5. Desplegar

Haz clic en "Deploy" y espera a que termine el proceso.

## Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm start            # Ejecutar en producción
npm run lint         # Ejecutar linter
```

## Seguridad

- Control de acceso basado en roles (RBAC)
- Autenticación mediante OAuth con GitHub
- Protección de rutas API con middleware
- Variables de entorno para información sensible
- Validación de datos en backend

## Contacto

Para más información o soporte, contactar a través del repositorio de GitHub.

## Licencia

Este proyecto fue desarrollado como parte de una prueba técnica.
