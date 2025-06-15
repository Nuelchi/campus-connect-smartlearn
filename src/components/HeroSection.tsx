
import { User, BookOpen, Globe, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="w-full bg-gradient-to-r from-blue-50 to-white pt-6 sm:pt-10 pb-12 sm:pb-20 px-4">
    <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
      {/* Content Section */}
      <div className="flex-1 max-w-xl text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          Smarter <span className="text-blue-600">Learning</span>,<br />
          Happier <span className="text-emerald-600">Teaching</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
          Discover SmartLearn: the all-in-one platform for organizing classes, sharing resources, and tracking achievement. 
          Designed for seamless online & hybrid learning.
        </p>
        
        {/* Features List */}
        <ul className="mb-6 sm:mb-8 space-y-2 ml-1">
          <li className="flex gap-2 items-center text-sm sm:text-base justify-center lg:justify-start">
            <Globe className="text-blue-400 flex-shrink-0" size={18} /> 
            <span>Global classrooms, accessible from anywhere</span>
          </li>
          <li className="flex gap-2 items-center text-sm sm:text-base justify-center lg:justify-start">
            <Sparkles className="text-emerald-400 flex-shrink-0" size={18} /> 
            <span>Tools for collaboration, grading, and feedback</span>
          </li>
          <li className="flex gap-2 items-center text-sm sm:text-base justify-center lg:justify-start">
            <Lock className="text-slate-400 flex-shrink-0" size={18} /> 
            <span>Safe, secure, and FERPA-compliant</span>
          </li>
        </ul>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 items-center lg:items-start">
          <Link
            to="/login"
            className="w-full sm:w-auto bg-primary text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:scale-105 transition-transform shadow text-center"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-primary px-4 sm:px-6 py-3 rounded-lg font-medium text-primary transition-[background] hover:bg-primary/10"
          >
            <BookOpen size={20} /> Explore Features
          </a>
        </div>
        
        {/* User Types */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 items-center lg:items-start justify-center lg:justify-start">
          <div className="flex items-center gap-2">
            <User size={28} sm:size={32} className="text-blue-500" />
            <div className="text-center sm:text-left">
              <div className="font-bold text-sm sm:text-base">Students</div>
              <div className="text-xs text-gray-500">Join, learn, ask, achieve</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={28} sm:size={32} className="text-emerald-500" />
            <div className="text-center sm:text-left">
              <div className="font-bold text-sm sm:text-base">Teachers</div>
              <div className="text-xs text-gray-500">Create, organize, inspire</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Section */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src="/lovable-uploads/b0395cde-8a4e-4fbb-b669-f64f70ce6fbd.png"
          alt="Students collaborating with laptops in classroom"
          className="rounded-lg shadow-2xl border-2 border-primary/10 w-full max-w-sm sm:max-w-md animate-fade-in"
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
