import React from "react";

export const Footer = () => {
  return (
    <footer className="text-center py-6 bg-gray-100 text-sm text-gray-600 font-[Rubik]">
      © {new Date().getFullYear()} EcoPlay — Built with 💚 by{" "}
      <a href="https://josephin-sylvere.vercel.app" className="text-blue-500 link" target="_blank">Joséphin Sylvère</a>  & 
      <a href="https://portfolio-funny-vazoniaina.vercel.app" className="text-blue-500 link" target="_blank"> Funny Vazoniaina</a>   for
      Hackonomics 2025
    </footer>
  );
};

