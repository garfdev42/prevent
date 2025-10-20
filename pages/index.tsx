import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isPending = status === "loading";

  useEffect(() => {
    if (!isPending) {
      if (session) {
        router.push("/movements");
      } else {
        router.push("/login");
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-white text-lg">Cargando...</p>
      </div>
    </div>
  );
}
