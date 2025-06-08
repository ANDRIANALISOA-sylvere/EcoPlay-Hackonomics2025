import React from "react";
import { HeroSection } from "./components/HeroSection";
import { Nav } from "./components/Nav";
import { Features } from "./components/Features";
import { CallToAction } from "./components/CallToAction";
import { Footer } from "./components/Footer";

const HomePage = () => {
  return (
    <div className="homepage">
      <Nav></Nav>
      <HeroSection />
      <Features></Features>
      <CallToAction></CallToAction>
      <Footer></Footer>
    </div>
  );
};

export default HomePage;
