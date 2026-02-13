import Navbar from "../components/navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import FeaturedAuctions from "../components/FeaturedAuctions";
import AboutSection from "../components/AboutSection";
import DeveloperSection from "../components/DeveloperSection";




export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
     <FeaturedAuctions />
     <AboutSection />
     <DeveloperSection />
    </>
  );
}
