import React, { useState } from "react";
import { motion } from "framer-motion";
import { FloatingIcon } from "@/components/FloatingIcon";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await registerApi({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      login(response.token, {
        id: response.id,
        email: response.email,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error.error) {
        setErrors({ api: error.error });
      } else {
        setErrors({ api: "An error occurred during registration" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white text-gray-800 font-[Rubik] flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`,
        }}
      />

      <FloatingIcon icon="✨" delay={0} position="top-10 left-10" />
      <FloatingIcon icon="📝" delay={0.5} position="top-20 right-16" />
      <FloatingIcon icon="🚀" delay={1} position="bottom-20 left-16" />
      <FloatingIcon icon="👋" delay={1.5} position="bottom-10 right-10" />

      <motion.div
        className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-block mb-4"
              whileHover={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-200">
                🎉 Join Us
              </span>
            </motion.div>

            <motion.h2
              className="text-3xl font-black mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Create Account
              </span>
            </motion.h2>

            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Start your financial journey with us
            </motion.p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {errors.api && (
              <motion.div
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.api}
              </motion.div>
            )}
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    } outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all`}
                    placeholder="yourname"
                  />
                </motion.div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all`}
                    placeholder="your@email.com"
                  />
                </motion.div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all`}
                    placeholder="••••••••"
                  />
                </motion.div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all`}
                    placeholder="••••••••"
                  />
                </motion.div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 outline-none focus:ring-emerald-500 border-gray-300 rounded"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a href="#" className="text-emerald-600 hover:underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-emerald-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </motion.div>

              <motion.button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      ⏳
                    </motion.span>
                  ) : (
                    <>
                      Sign Up
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        🎉
                      </motion.span>
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </motion.form>

          <motion.div
            className="mt-6 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-500"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="mt-8 flex flex-wrap justify-center gap-3 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[
          "✨ Easy Setup",
          "🛡️ Secure",
          "🚀 Fast Onboarding",
          "💯 Satisfaction Guaranteed",
        ].map((badge, index) => (
          <motion.span
            key={index}
            className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            {badge}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default RegisterPage;
