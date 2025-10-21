import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Endpoint de autenticación de NextAuth
export default NextAuth(authOptions);
