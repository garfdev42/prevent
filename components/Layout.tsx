import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "./ui/button";
import { LogOut, BarChart3, Users, DollarSign } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const isActive = (path: string) => router.pathname === path;
  const userRole = session?.user ? (session.user as any).role : null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl h-screen sticky top-0 flex flex-col">
        <div className="p-6">
          <div className="mb-8 flex items-center justify-center">
            <Image
              src="/images/logo-icon.png"
              alt="Prevent Logo"
              width={80}
              height={80}
              className="h-auto w-auto drop-shadow-2xl"
              priority
            />
          </div>

          <nav className="space-y-2">
            <Link
              href="/movements"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive("/movements")
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Ingresos y Egresos</span>
            </Link>

            {userRole === "ADMIN" && (
              <>
                <Link
                  href="/users"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive("/users")
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Usuarios</span>
                </Link>

                <Link
                  href="/reports"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive("/reports")
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Reportes</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {session && session.user && (
          <div className="mt-auto p-6">
            <div className="bg-slate-700/50 rounded-lg p-4 backdrop-blur-sm border border-slate-600">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-300 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                  {userRole}
                </span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="w-full bg-slate-600 border-slate-500 text-white hover:bg-slate-500 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
