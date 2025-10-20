import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin, AuthenticatedRequest } from "@/lib/middleware";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (req.method === "DELETE") {
    try {
      await prisma.movement.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Movimiento eliminado" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar movimiento" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { concept, amount, type, date } = req.body;

      const movement = await prisma.movement.update({
        where: { id },
        data: {
          concept,
          amount: parseFloat(amount),
          type,
          date: new Date(date),
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

      return res.status(200).json(movement);
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar movimiento" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

export default function movementByIdHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return requireAdmin(req, res, handler);
}
