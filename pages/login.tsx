import { useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, ArrowRight, Shield } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isPending = status === "loading";

  useEffect(() => {
    if (session && !isPending) {
      router.push("/movements");
    }
  }, [session, isPending, router]);

  const handleGitHubSignIn = async () => {
    await signIn("github", { callbackUrl: "/movements" });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20">
          <div className="mb-8 text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src="/images/logo-full.png"
                alt="Prevent Logo"
                width={250}
                height={75}
                className="h-auto w-auto max-w-full drop-shadow-2xl"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Sistema de Gestión
            </h2>
            <p className="text-blue-200">Ingresos y Gastos</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleGitHubSignIn}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-6 rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              size="lg"
            >
              <Github className="w-6 h-6" />
              Iniciar sesión con GitHub
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <Shield className="w-4 h-4" />
              <p>
                Todos los nuevos usuarios se asignan automáticamente como{" "}
                <span className="font-semibold">ADMIN</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-200 text-sm mt-6">
          © 2025 Prevent. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
