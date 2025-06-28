import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Nav = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <motion.nav
      className="w-full flex items-center justify-between px-6 py-4 shadow-none bg-white font-[Rubik] fixed top-0 left-0 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-2xl font-extrabold text-emerald-600">
        EcoPlay
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <button
              onClick={logout}
              className="bg-emerald-600 cursor-pointer text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-emerald-700 font-medium hover:underline"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};