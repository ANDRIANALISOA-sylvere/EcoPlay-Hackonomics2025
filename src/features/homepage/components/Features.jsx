import React, { useEffect, useRef, useState } from "react";

const features = [
  {
    title: "Interactive Scenarios",
    emoji: "🎮",
    description:
      "Dive into realistic financial situations and make decisions that impact your virtual budget.",
    color: "from-blue-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
  },
  {
    title: "XP & Level System",
    emoji: "📈",
    description:
      "Earn experience with every smart financial decision and unlock new economic challenges.",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
  },
  {
    title: "Financial Skills",
    emoji: "💡",
    description:
      "Build your expertise in saving, investing, budgeting, and financial planning.",
    color: "from-yellow-500 to-orange-600",
    bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
  },
  {
    title: "Weekly Leaderboard",
    emoji: "🏆",
    description:
      "Compare your performance with other players and climb the expert financial leaderboard.",
    color: "from-amber-500 to-yellow-600",
    bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
  },
  {
    title: "Economic Challenges",
    emoji: "🎯",
    description:
      "Take on daily challenges to test your knowledge in economics and wealth management.",
    color: "from-red-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
  },
  {
    title: "Market Simulation",
    emoji: "📊",
    description:
      "Invest in a virtual market that reflects real-world economic trends.",
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
  },
  {
    title: "Personalized Coaching",
    emoji: "🤖",
    description:
      "Receive tailored advice based on your financial profile and progress at your own pace.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
  },
  {
    title: "Virtual Rewards",
    emoji: "💎",
    description:
      "Collect badges, trophies, and rewards to celebrate your financial achievements.",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
  },
];

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

const AnimatedFeatureCard = ({ feature, index }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-3xl transition-all duration-700 ease-out
        hover:scale-105 hover:-translate-y-3 cursor-pointer
        ${feature.bgColor}
        ${isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-90"
        }`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

      <div className="relative p-8 h-full flex flex-col">
        <div className="relative mb-6">
          <div
            className={`text-6xl transition-all duration-500 ease-out transform
              ${isVisible ? "animate-bounce" : ""}
              ${isHovered ? "scale-110 rotate-12" : "scale-100 rotate-0"}`}
            style={{
              animationDelay: `${index * 200 + 300}ms`,
              animationDuration: "1.5s",
              animationIterationCount: "1",
            }}
          >
            {feature.emoji}
          </div>

          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 
              transition-all duration-500 ease-out scale-150 blur-xl`}
          />
        </div>

        <h3
          className={`text-2xl font-black mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent
          group-hover:scale-105 transition-transform duration-300`}
        >
          {feature.title}
        </h3>

        <p className="text-gray-700 leading-relaxed flex-grow text-base">
          {feature.description}
        </p>

        <div
          className={`mt-6 flex items-center text-sm font-semibold bg-gradient-to-r ${feature.color
            } bg-clip-text text-transparent
          transform transition-all duration-300
          ${isHovered ? "translate-x-2 opacity-100" : "translate-x-0 opacity-70"
            }`}
        >
          <span>Discover more</span>
          <svg
            className={`ml-2 w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0
          transition-opacity duration-500 p-[2px]`}
        >
          <div className={`w-full h-full rounded-3xl ${feature.bgColor}`} />
        </div>
      </div>
    </div>
  );
};

const FloatingDecoration = ({ position, delay, icon }) => (
  <div
    className={`absolute ${position} text-6xl opacity-10 pointer-events-none`}
    style={{
      animation: `float_features 6s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    {icon}
  </div>
);

export const Features = () => {
  const [headerRef, headerVisible] = useIntersectionObserver({
    threshold: 0.2,
  });

  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 text-center overflow-hidden">
      <FloatingDecoration position="top-20 left-20" delay={0} icon="💰" />
      <FloatingDecoration position="top-40 right-16" delay={1} icon="📈" />
      <FloatingDecoration position="bottom-32 left-16" delay={2} icon="🎯" />
      <FloatingDecoration position="bottom-20 right-20" delay={3} icon="✨" />

      <div className="max-w-8xl mx-auto relative z-10">
        <div
          ref={headerRef}
          className={`mb-16 transition-all duration-1200 ease-out
            ${headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-12"
            }`}
        >
          <div
            className={`inline-block mb-6 transition-all duration-1000 ease-out
            ${headerVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              🎮 Premium Gaming Features
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Game Features
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Transform your financial learning into an
            <span className="font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              epic adventure
            </span>
            . Master budgeting, investing, and wealth management through
            cutting-edge gamification!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <AnimatedFeatureCard key={idx} feature={feature} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
