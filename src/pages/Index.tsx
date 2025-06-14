
// Main Landing Page for SmartLearn LMS

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Highlights from "../components/Highlights";
import HowItWorks from "../components/HowItWorks";
import CallToAction from "../components/CallToAction";

const Index = () => (
  <div>
    <Navbar />
    <main>
      <HeroSection />
      <Highlights />
      <HowItWorks />
      <CallToAction />
    </main>
    <footer className="py-8 text-center text-muted-foreground text-sm bg-background mt-10 border-t">
      &copy; {new Date().getFullYear()} SmartLearn. Empowering Knowledge for All.
    </footer>
  </div>
);

export default Index;
