import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin, AuthenticatedRequest } from "@/lib/middleware";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (req.method === "PUT") {
    try {
      const { name, role } = req.body;

      if (!name || !role) {
        return res.status(400).json({ error: "Nombre y rol son requeridos" });
      }

      if (role !== "USER" && role !== "ADMIN") {
        return res.status(400).json({ error: "Rol inválido" });
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          name,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      });

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar usuario" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

export default function userByIdHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return requireAdmin(req, res, handler);
}
