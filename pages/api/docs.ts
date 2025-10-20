import { NextApiRequest, NextApiResponse } from "next";

const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Sistema de Gestión de Ingresos y Gastos API",
    version: "1.0.0",
    description:
      "API para gestionar ingresos, egresos y usuarios con autenticación y control de acceso basado en roles.",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Servidor de desarrollo",
    },
  ],
  components: {
    securitySchemes: {
      sessionAuth: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
      },
    },
    schemas: {
      Movement: {
        type: "object",
        properties: {
          id: { type: "string" },
          concept: { type: "string" },
          amount: { type: "number" },
          type: { type: "string", enum: ["INCOME", "EXPENSE"] },
          date: { type: "string", format: "date-time" },
          userId: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          role: { type: "string", enum: ["USER", "ADMIN"] },
        },
      },
      Balance: {
        type: "object",
        properties: {
          balance: { type: "number" },
          income: { type: "number" },
          expenses: { type: "number" },
          monthlyData: {
            type: "array",
            items: {
              type: "object",
              properties: {
                month: { type: "string" },
                income: { type: "number" },
                expense: { type: "number" },
              },
            },
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/movements": {
      get: {
        summary: "Obtener todos los movimientos",
        tags: ["Movements"],
        security: [{ sessionAuth: [] }],
        responses: {
          "200": {
            description: "Lista de movimientos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Movement" },
                },
              },
            },
          },
          "401": {
            description: "No autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        summary: "Crear un nuevo movimiento (Solo Admin)",
        tags: ["Movements"],
        security: [{ sessionAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  concept: { type: "string" },
                  amount: { type: "number" },
                  type: { type: "string", enum: ["INCOME", "EXPENSE"] },
                  date: { type: "string", format: "date" },
                },
                required: ["concept", "amount", "type", "date"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Movimiento creado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Movement" },
              },
            },
          },
          "400": {
            description: "Datos inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Acceso denegado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/movements/{id}": {
      put: {
        summary: "Actualizar un movimiento (Solo Admin)",
        tags: ["Movements"],
        security: [{ sessionAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  concept: { type: "string" },
                  amount: { type: "number" },
                  type: { type: "string", enum: ["INCOME", "EXPENSE"] },
                  date: { type: "string", format: "date" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Movimiento actualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Movement" },
              },
            },
          },
          "403": {
            description: "Acceso denegado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Eliminar un movimiento (Solo Admin)",
        tags: ["Movements"],
        security: [{ sessionAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Movimiento eliminado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "403": {
            description: "Acceso denegado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/users": {
      get: {
        summary: "Obtener todos los usuarios (Solo Admin)",
        tags: ["Users"],
        security: [{ sessionAuth: [] }],
        responses: {
          "200": {
            description: "Lista de usuarios",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
          "403": {
            description: "Acceso denegado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/users/{id}": {
      put: {
        summary: "Actualizar un usuario (Solo Admin)",
        tags: ["Users"],
        security: [{ sessionAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  role: { type: "string", enum: ["USER", "ADMIN"] },
                },
                required: ["name", "role"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Usuario actualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "403": {
            description: "Acceso denegado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/reports/balance": {
      get: {
        summary: "Obtener balance y datos para reportes (Solo Admin)",
        tags: ["Reports"],
        security: [{ sessionAuth: [] }],
        responses: {
          "200": {
            description: "Balance y datos mensuales",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Balance" },
              },
            },
          },
          "403": {
            description: "Acceso denegado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(openApiSpec);
  }
  return res.status(405).json({ error: "Método no permitido" });
}
