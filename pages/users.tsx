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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "USER" | "ADMIN";
}

// Página de gestión de usuarios (solo para administradores)
export default function Users() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isPending = status === "loading";
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "USER" as "USER" | "ADMIN",
  });

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
      fetchUsers();
    }
  }, [session, userRole]);

  // Obtener lista de usuarios desde la API
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Abrir diálogo de edición con datos del usuario
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  // Actualizar usuario existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.error || "Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error al actualizar usuario");
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
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600">
              Administra los usuarios del sistema y sus permisos
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="users" className="text-base">
              Usuarios del Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                      <th className="text-left p-4 font-bold text-gray-700">
                        Nombre
                      </th>
                      <th className="text-left p-4 font-bold text-gray-700">
                        Correo
                      </th>
                      <th className="text-left p-4 font-bold text-gray-700">
                        Teléfono
                      </th>
                      <th className="text-left p-4 font-bold text-gray-700">
                        Rol
                      </th>
                      <th className="text-left p-4 font-bold text-gray-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <p className="text-gray-600 font-medium text-lg">
                              No hay usuarios registrados
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr
                          key={user.id}
                          className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="p-4 font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="p-4 text-gray-600">{user.email}</td>
                          <td className="p-4 text-gray-600">
                            {user.phone || "-"}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                user.role === "ADMIN"
                                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <Button
                              onClick={() => handleEditClick(user)}
                              variant="outline"
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                            >
                              Editar Usuario
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="bg-white border-none shadow-2xl max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-800">
                    Editar Usuario
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: "USER" | "ADMIN") =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">USER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    Guardar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
