import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin, AuthenticatedRequest } from "@/lib/middleware";

// Endpoint para obtener usuarios (solo ADMIN)
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

export default function usersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return requireAdmin(req, res, handler);
}
