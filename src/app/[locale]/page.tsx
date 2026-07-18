"use client";

import React from 'react';

import Hero from "../../components/Hero";
import WelcomeIntro from "../../components/WelcomeIntro";
import PortfolioGallery from "../../components/PortfolioGallery";
import HandcraftedMaterials from "../../components/HandcraftedMasterpieces"; // Verified from your folder tree name
import BespokeConfigurator from "../../components/BespokeConfigurator";
import FutureVision from "../../components/FutureVision";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] antialiased">
      {/* Global Navigation Overlay */}
   
      
      {/* 1. Visual Hook */}
      <Hero />
      
      {/* 2. Core Brand Philosophy */}
      <WelcomeIntro />

      {/* 3. Aspirational Macro Work (Completed Spaces) */}
      <PortfolioGallery />

      {/* 4. Material Education & Tangible Masterpieces (Micro Deep-Dive) */}
      <HandcraftedMaterials />
      
      {/* 5. High-Intent Interactive Engagement (Personalization) */}
      <BespokeConfigurator />
      
      {/* 6. Strategic Authority, Sustainability & Trust Metrics */}
      <FutureVision />

      {/* 7. Structural Anchor */}
      
    </div>
  );
}