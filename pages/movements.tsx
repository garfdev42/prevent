import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Movement {
  id: string;
  concept: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Página de gestión de ingresos y egresos
export default function Movements() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isPending = status === "loading";
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null
  );
  const [formData, setFormData] = useState({
    concept: "",
    amount: "",
    type: "INCOME" as "INCOME" | "EXPENSE",
    date: new Date().toISOString().split("T")[0],
  });

  const userRole = session?.user ? (session.user as any).role : null;

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchMovements();
    }
  }, [session]);

  // Obtener lista de movimientos desde la API
  const fetchMovements = async () => {
    try {
      const res = await fetch("/api/movements");
      if (res.ok) {
        const data = await res.json();
        setMovements(data);
      }
    } catch (error) {
      console.error("Error fetching movements:", error);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo movimiento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/movements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsDialogOpen(false);
        setFormData({
          concept: "",
          amount: "",
          type: "INCOME",
          date: new Date().toISOString().split("T")[0],
        });
        fetchMovements();
      } else {
        const error = await res.json();
        alert(error.error || "Error al crear movimiento");
      }
    } catch (error) {
      console.error("Error creating movement:", error);
      alert("Error al crear movimiento");
    }
  };

  // Abrir diálogo de edición con datos del movimiento
  const handleEdit = (movement: Movement) => {
    setSelectedMovement(movement);
    setFormData({
      concept: movement.concept,
      amount: movement.amount.toString(),
      type: movement.type,
      date: new Date(movement.date).toISOString().split("T")[0],
    });
    setIsEditDialogOpen(true);
  };

  // Actualizar movimiento existente
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovement) return;

    try {
      const res = await fetch(`/api/movements/${selectedMovement.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsEditDialogOpen(false);
        setSelectedMovement(null);
        setFormData({
          concept: "",
          amount: "",
          type: "INCOME",
          date: new Date().toISOString().split("T")[0],
        });
        fetchMovements();
      } else {
        const error = await res.json();
        alert(error.error || "Error al actualizar movimiento");
      }
    } catch (error) {
      console.error("Error updating movement:", error);
      alert("Error al actualizar movimiento");
    }
  };

  // Eliminar movimiento
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este movimiento?")) {
      return;
    }

    try {
      const res = await fetch(`/api/movements/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchMovements();
      } else {
        const error = await res.json();
        alert(error.error || "Error al eliminar movimiento");
      }
    } catch (error) {
      console.error("Error deleting movement:", error);
      alert("Error al eliminar movimiento");
    }
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

  const incomeMovements = movements.filter((m) => m.type === "INCOME");
  const expenseMovements = movements.filter((m) => m.type === "EXPENSE");
  const totalIncome = incomeMovements.reduce((sum, m) => sum + m.amount, 0);
  const totalExpense = expenseMovements.reduce((sum, m) => sum + m.amount, 0);

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
              Ingresos y Egresos
            </h1>
            <p className="text-gray-600">
              Gestiona tus movimientos financieros de forma eficiente
            </p>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="all" className="text-base">
              Todos los Movimientos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="flex justify-end mb-6">
              {userRole === "ADMIN" && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center gap-2 px-6">
                      <span className="text-xl">+</span>
                      Nuevo Movimiento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border-none shadow-2xl max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-gray-800">
                        Nuevo Movimiento
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="amount">Monto</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                          required
                          className="bg-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="concept">Concepto</Label>
                        <Input
                          id="concept"
                          value={formData.concept}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              concept: e.target.value,
                            })
                          }
                          required
                          className="bg-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          required
                          className="bg-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="type">Tipo</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value: "INCOME" | "EXPENSE") =>
                            setFormData({ ...formData, type: value })
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INCOME">Ingreso</SelectItem>
                            <SelectItem value="EXPENSE">Egreso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="submit" className="w-full">
                        Ingresar
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="bg-white border-none shadow-2xl max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-800">
                    Editar Movimiento
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="edit-amount">Monto</Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      required
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-concept">Concepto</Label>
                    <Input
                      id="edit-concept"
                      value={formData.concept}
                      onChange={(e) =>
                        setFormData({ ...formData, concept: e.target.value })
                      }
                      required
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-date">Fecha</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "INCOME" | "EXPENSE") =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INCOME">Ingreso</SelectItem>
                        <SelectItem value="EXPENSE">Egreso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Actualizar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                      <th className="text-left p-4 font-bold text-gray-700">
                        Concepto
                      </th>
                      <th className="text-left p-4 font-bold text-gray-700">
                        Monto
                      </th>
                      <th className="text-left p-4 font-bold text-gray-700">
                        Fecha
                      </th>
                      <th className="text-left p-4 font-bold text-gray-700">
                        Usuario
                      </th>
                      <th className="text-left p-4 font-bold text-gray-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="text-gray-600">
                              Cargando movimientos...
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : movements.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <p className="text-gray-600 font-medium text-lg">
                              No hay movimientos registrados
                            </p>
                            <p className="text-gray-400 text-sm">
                              Crea tu primer movimiento usando el botón Nuevo
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      movements.map((movement, index) => (
                        <tr
                          key={movement.id}
                          className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="p-4 font-medium text-gray-900">
                            {movement.concept}
                          </td>
                          <td className="p-4">
                            <span
                              className={`font-bold text-lg ${
                                movement.type === "INCOME"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {movement.type === "INCOME" ? "+" : "-"}
                              {formatCurrency(movement.amount)}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">
                            {formatDate(movement.date)}
                          </td>
                          <td className="p-4 text-gray-700">
                            {movement.user.name}
                          </td>
                          <td className="p-4">
                            {userRole === "ADMIN" && (
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleEdit(movement)}
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                                >
                                  Editar
                                </Button>
                                <Button
                                  onClick={() => handleDelete(movement.id)}
                                  variant="outline"
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white border-none"
                                >
                                  Eliminar
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-t-2 border-blue-200">
                <div className="flex justify-end gap-8">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Total Ingresos
                    </p>
                    <p className="text-2xl text-green-600 font-bold">
                      +{formatCurrency(totalIncome)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Total Egresos
                    </p>
                    <p className="text-2xl text-red-600 font-bold">
                      -{formatCurrency(totalExpense)}
                    </p>
                  </div>
                  <div className="text-right border-l-2 border-blue-300 pl-8">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Balance
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        totalIncome - totalExpense >= 0
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(totalIncome - totalExpense)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
