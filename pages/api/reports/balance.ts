import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin, AuthenticatedRequest } from "@/lib/middleware";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const movements = await prisma.movement.findMany();

      const income = movements
        .filter((m) => m.type === "INCOME")
        .reduce((sum, m) => sum + m.amount, 0);

      const expenses = movements
        .filter((m) => m.type === "EXPENSE")
        .reduce((sum, m) => sum + m.amount, 0);

      const balance = income - expenses;

      const monthlyData = movements.reduce((acc: any[], movement) => {
        const month = new Date(movement.date).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "short",
        });

        const existing = acc.find((item) => item.month === month);

        if (existing) {
          if (movement.type === "INCOME") {
            existing.income += movement.amount;
          } else {
            existing.expense += movement.amount;
          }
        } else {
          acc.push({
            month,
            income: movement.type === "INCOME" ? movement.amount : 0,
            expense: movement.type === "EXPENSE" ? movement.amount : 0,
          });
        }

        return acc;
      }, []);

      return res.status(200).json({
        balance,
        income,
        expenses,
        totalIncome: income,
        totalExpense: expenses,
        monthlyData,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener balance" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

export default function balanceHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return requireAdmin(req, res, handler);
}
