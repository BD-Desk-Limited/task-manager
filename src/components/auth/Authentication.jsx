"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import jwt from "jsonwebtoken";

export default function Authenticate({ children }) {
  const Router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip authentication for the login page or root path
    if (pathname === "/pages/login" || pathname === "/") {
      return;
    }

    const validateToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        Router.push("/pages/login"); // Redirect to login if no token
        return;
      }

      try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.id) {
          Router.push("/pages/login"); // Redirect if token is invalid
        }
      } catch (err) {
        Router.push("/pages/login"); // Redirect on error
      }
    };

    validateToken();
  }, [pathname, Router]);

  return <>{children}</>;
}
