"use client";
import authClient from "../lib/auth-client";
import { Loader } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SessionManager({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isLoading, isPending } = authClient.useSession();

  const publicRoutes = ["/", "/login", "/signup"];

  useEffect(() => {
    console.log(session);
    if (!isLoading && !isPending) {
      const isPublicRoute = publicRoutes.includes(pathname);

      if (!session && !isPublicRoute) {
        router.push("/login");
      }

      if (session && (pathname === "/login" || pathname === "/signup")) {
        router.push("/dashboard");
      }
    }
  }, [session, isLoading, isPending, pathname, router]);

  if (isLoading || isPending) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-[#05010E] text-white dark:text-white transition-colors duration-500 bg-white dark:bg-[#05010E">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  const isPublicRoute = publicRoutes.includes(pathname);
  if (!session && !isPublicRoute) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-[#05010E] text-white dark:text-white transition-colors duration-500 bg-white dark:bg-[#05010E">
        <Loader className="w-8 h-8 text-white animate-spin" />
        <p className="text-white ml-2">Redirecting to login...</p>
      </div>
    );
  }

  return children;
}
