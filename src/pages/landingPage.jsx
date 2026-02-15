import { useState, useRef, useEffect } from "react";
import Navbar from "../components/navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import FeaturedAuctions from "../components/FeaturedAuctions";
import AboutSection from "../components/AboutSection";
import DeveloperSection from "../components/DeveloperSection";
import DarkVeil from "../components/DarkVeil";

export default function LandingPage() {
  const [hue, setHue] = useState(-110); // Default Maroon
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuredRef = useRef(null);
  const aboutRef = useRef(null);
  const developerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Determine hue based on visible section
            // Hero (-110), HowItWorks (-20), Featured (-110), About (-20), Developer (-110)
            if (entry.target === heroRef.current) setHue(-110);
            else if (entry.target === howItWorksRef.current) setHue(-20);
            else if (entry.target === featuredRef.current) setHue(-110);
            else if (entry.target === aboutRef.current) setHue(-20);
            else if (entry.target === developerRef.current) setHue(-110);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    const sections = [heroRef.current, howItWorksRef.current, featuredRef.current, aboutRef.current, developerRef.current];
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#1a0505' }}>
      {/* Fixed DarkVeil Background - Constant throughout page */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <DarkVeil
            hueShift={hue}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.7}
            scanlineFrequency={0}
            warpAmount={0}
            resolutionScale={1}
          />
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
        <div ref={heroRef}><Hero /></div>
        <div ref={howItWorksRef}><HowItWorks /></div>
        <div ref={featuredRef}><FeaturedAuctions /></div>
        <div ref={aboutRef}><AboutSection /></div>
        <div ref={developerRef}><DeveloperSection /></div>
      </div>
    </div>
  );
}
