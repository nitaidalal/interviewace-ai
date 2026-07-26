import HeroSection from "../features/home/HeroSection.jsx";
import FeaturesSection from "../features/home/FeaturesSection.jsx";
import HowItWorksSection from "../features/home/HowItWorksSection.jsx";
import PricingSection from "../features/home/PricingSection.jsx";
import FooterSection from "../features/home/FooterSection.jsx";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
};

export default HomePage;
