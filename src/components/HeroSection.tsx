
import { User, BookOpen, Globe, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="w-full bg-gradient-to-r from-blue-50 to-white pt-6 sm:pt-10 pb-12 sm:pb-20 px-4">
    <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 sm:gap-16">
      <div className="flex-1 max-w-xl text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6">
          Smarter <span className="text-blue-600">Learning</span>,<br className="hidden sm:block" />
          Happier <span className="text-emerald-600">Teaching</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-normal">
          Discover SmartLearn: the all-in-one platform for organizing classes, sharing resources, and tracking achievement. 
          Designed for seamless online & hybrid learning.
        </p>
        <ul className="mb-6 sm:mb-8 space-y-2 ml-1 text-sm sm:text-base">
          <li className="flex gap-2 items-center justify-center md:justify-start">
            <Globe className="text-blue-400 flex-shrink-0" size={20} /> 
            <span>Global classrooms, accessible from anywhere</span>
          </li>
          <li className="flex gap-2 items-center justify-center md:justify-start">
            <Sparkles className="text-emerald-400 flex-shrink-0" size={20} /> 
            <span>Tools for collaboration, grading, and feedback</span>
          </li>
          <li className="flex gap-2 items-center justify-center md:justify-start">
            <Lock className="text-slate-400 flex-shrink-0" size={20} /> 
            <span>Safe, secure, and FERPA-compliant</span>
          </li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 justify-center md:justify-start">
          <Link
            to="/login"
            className="bg-primary text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:scale-105 transition-transform shadow text-center"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="flex items-center justify-center gap-2 border border-primary px-4 sm:px-6 py-3 rounded-lg font-medium text-primary transition-[background] hover:bg-primary/10"
          >
            <BookOpen size={20} /> Explore Features
          </a>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-7 mt-8 sm:mt-10 justify-center md:justify-start">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <User size={28} className="text-blue-500 flex-shrink-0" />
            <div className="text-center md:text-left">
              <div className="font-bold text-sm sm:text-base">Students</div>
              <div className="text-xs text-gray-500">Join, learn, ask, achieve</div>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <BookOpen size={28} className="text-emerald-500 flex-shrink-0" />
            <div className="text-center md:text-left">
              <div className="font-bold text-sm sm:text-base">Teachers</div>
              <div className="text-xs text-gray-500">Create, organize, inspire</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center w-full max-w-sm sm:max-w-md">
        <img
          src="/lovable-uploads/b0395cde-8a4e-4fbb-b669-f64f70ce6fbd.png"
          alt="Students collaborating with laptops in classroom"
          className="rounded-lg shadow-2xl border-2 border-primary/10 w-full animate-fade-in"
        />
      </div>
    </div>
  </section>
);
export default HeroSection;
