import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

// Tipo extendido de request con información del usuario autenticado
export type AuthenticatedRequest = NextApiRequest & {
  user: {
    id: string;
    email: string;
    name: string;
    role: "USER" | "ADMIN";
  };
};

// Middleware para proteger rutas de API que requieren autenticación
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const authenticatedReq = req as AuthenticatedRequest;
  authenticatedReq.user = {
    id: (session.user as any).id,
    email: session.user.email || "",
    name: session.user.name || "",
    role: (session.user as any).role || "USER",
  };

  return handler(authenticatedReq, res);
}

// Middleware para proteger rutas de API que requieren rol ADMIN
export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return requireAuth(req, res, async (authReq, authRes) => {
    if (authReq.user.role !== "ADMIN") {
      return authRes
        .status(403)
        .json({ error: "Acceso denegado. Se requiere rol de administrador." });
    }
    return handler(authReq, authRes);
  });
}
