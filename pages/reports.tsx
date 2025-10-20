import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, generateCSV, downloadCSV } from "@/lib/utils";

interface BalanceData {
  balance: number;
  income: number;
  expenses: number;
  totalIncome: number;
  totalExpense: number;
  monthlyData: {
    month: string;
    income: number;
    expense: number;
  }[];
}

export default function Reports() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isPending = status === "loading";
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);

  const userRole = session?.user ? (session.user as any).role : null;

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if (userRole !== "ADMIN") {
        router.push("/movements");
      }
    }
  }, [session, isPending, userRole, router]);

  useEffect(() => {
    if (session && userRole === "ADMIN") {
      fetchBalance();
    }
  }, [session, userRole]);

  const fetchBalance = async () => {
    try {
      const res = await fetch("/api/reports/balance");
      if (res.ok) {
        const data = await res.json();
        setBalanceData(data);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!balanceData) return;

    const csvData = balanceData.monthlyData.map((item) => ({
      Mes: item.month,
      Ingresos: item.income,
      Egresos: item.expense,
      Balance: item.income - item.expense,
    }));

    const csv = generateCSV(csvData, ["Mes", "Ingresos", "Egresos", "Balance"]);
    downloadCSV(csv, `reporte-${new Date().toISOString().split("T")[0]}.csv`);
  };

  if (isPending || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Cargando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Image
            src="/images/logo-icon.png"
            alt="Prevent Icon"
            width={60}
            height={60}
            className="drop-shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Reportes Financieros
            </h1>
            <p className="text-gray-600">
              Visualiza y analiza tus movimientos financieros
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm font-medium opacity-90 mb-2">
                Total Ingresos
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency(balanceData?.totalIncome || 0)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm font-medium opacity-90 mb-2">
                Total Egresos
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency(balanceData?.totalExpense || 0)}
              </p>
            </div>

            <div
              className={`bg-gradient-to-br rounded-xl p-6 text-white shadow-lg ${
                (balanceData?.balance || 0) >= 0
                  ? "from-blue-500 to-blue-600"
                  : "from-orange-500 to-orange-600"
              }`}
            >
              <p className="text-sm font-medium opacity-90 mb-2">Balance</p>
              <p className="text-3xl font-bold">
                {formatCurrency(balanceData?.balance || 0)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Movimientos Mensuales
              </h2>
              <Button
                onClick={handleDownloadCSV}
                className="bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center gap-2"
              >
                Descargar CSV
              </Button>
            </div>

            <div className="mb-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={balanceData?.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                  />
                  <YAxis style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "14px", fontWeight: "500" }}
                  />
                  <Bar
                    dataKey="income"
                    fill="#10b981"
                    name="Ingresos"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#ef4444"
                    name="Egresos"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
