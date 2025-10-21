import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { requireAuth, AuthenticatedRequest } from "@/lib/middleware";

// Endpoint para obtener y crear movimientos financieros
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Obtener lista de movimientos
  if (req.method === "GET") {
    try {
      const movements = await prisma.movement.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      return res.status(200).json(movements);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener movimientos" });
    }
  }

  // Crear nuevo movimiento (solo ADMIN)
  if (req.method === "POST") {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Solo administradores pueden crear movimientos" });
    }

    try {
      const { concept, amount, type, date } = req.body;

      if (!concept || !amount || !type || !date) {
        return res
          .status(400)
          .json({ error: "Todos los campos son requeridos" });
      }

      if (type !== "INCOME" && type !== "EXPENSE") {
        return res.status(400).json({ error: "Tipo de movimiento inválido" });
      }

      const movement = await prisma.movement.create({
        data: {
          concept,
          amount: parseFloat(amount),
          type,
          date: new Date(date),
          userId: req.user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(201).json(movement);
    } catch (error) {
      return res.status(500).json({ error: "Error al crear movimiento" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

export default function movementsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return requireAuth(req, res, handler);
}
