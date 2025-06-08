import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

const FloatingElement = ({ children, delay = 0, className = "" }) => {
  return (
    <div
      className={`animate-float ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: "3s",
        animationIterationCount: "infinite",
      }}
    >
      {children}
    </div>
  );
};

export const CallToAction = () => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: "50px",
  });

  const [buttonHovered, setButtonHovered] = useState(false);

  return (
    <section
      ref={ref}
      className="py-16 px-6 text-center bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-600 text-white font-[Rubik] relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement
          delay={0}
          className="absolute top-10 left-10 text-4xl opacity-20"
        >
          💰
        </FloatingElement>
        <FloatingElement
          delay={1000}
          className="absolute top-20 right-20 text-3xl opacity-20"
        >
          📈
        </FloatingElement>
        <FloatingElement
          delay={2000}
          className="absolute bottom-20 left-20 text-3xl opacity-20"
        >
          🎯
        </FloatingElement>
        <FloatingElement
          delay={1500}
          className="absolute bottom-10 right-10 text-4xl opacity-20"
        >
          🏆
        </FloatingElement>
        <FloatingElement
          delay={500}
          className="absolute top-1/2 left-1/4 text-2xl opacity-10"
        >
          💡
        </FloatingElement>
        <FloatingElement
          delay={2500}
          className="absolute top-1/3 right-1/3 text-2xl opacity-10"
        >
          💎
        </FloatingElement>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div
          className={`transition-all duration-1000 ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95"
            }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span
              className={`inline-block transition-all duration-700 ease-out
                ${isVisible ? "animate-pulse" : ""}`}
              style={{
                animationDelay: "500ms",
                animationDuration: "2s",
                animationIterationCount: "1",
              }}
            >
              🚀
            </span>
            <span className="ml-3 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              Ready to become a money master?
            </span>
          </h2>

          <p
            className={`mb-8 text-xl md:text-2xl leading-relaxed transition-all duration-1000 ease-out
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            style={{ transitionDelay: "300ms" }}
          >
            Join <span className="font-bold text-yellow-300">EcoPlay</span> and
            start your journey in financial literacy today!
          </p>

          <div
            className={`flex flex-wrap justify-center gap-8 mb-8 transition-all duration-1000 ease-out
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            style={{ transitionDelay: "600ms" }}
          >
            {[
              { number: "10K+", label: "Active Players" },
              { number: "95%", label: "Success Rate" },
              { number: "4.9★", label: "User Rating" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-500 ease-out
                  ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                style={{ transitionDelay: `${800 + index * 200}ms` }}
              >
                <div className="text-2xl font-bold text-yellow-300">
                  {stat.number}
                </div>
                <div className="text-sm text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>

          <div
            className={`transition-all duration-1000 ease-out
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <a
              href="/signup"
              className={`inline-block bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg
                shadow-2xl hover:shadow-3xl transition-all duration-300 ease-out
                hover:bg-emerald-50 hover:scale-105 hover:-translate-y-1
                active:scale-95 active:translate-y-0
                ${buttonHovered ? "animate-pulse" : ""}
                relative overflow-hidden group`}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:translate-x-full transition-all duration-700 transform -translate-x-full"></div>

              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Sign Up Free</span>
                <span
                  className={`transition-all duration-300 ease-out
                    ${buttonHovered ? "translate-x-1" : "translate-x-0"}`}
                >
                  →
                </span>
              </span>
            </a>
          </div>

          <p
            className={`mt-4 text-sm text-emerald-100 transition-all duration-1000 ease-out
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            style={{ transitionDelay: "1200ms" }}
          >
            🔒 100% Free • No Credit Card Required • Start Learning Today
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(5deg);
          }
          50% {
            transform: translateY(-20px) rotate(0deg);
          }
          75% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
