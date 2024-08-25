import React, { useState } from "react";
import HeroSection from "../components/HeroSection/HeroSection";
import FeaturesSection from "../components/FeaturesSection/FeaturesSection";
import AboutSection from "../components/AboutSection/AboutSection";

export default function Home() {
  const [language, setLanguage] = useState("en");

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
    </div>
  );
}
