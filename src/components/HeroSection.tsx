
import { User, BookOpen, Globe, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="w-full bg-gradient-to-r from-blue-50 to-white pt-10 pb-20 px-4">
    <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16">
      <div className="flex-1 max-w-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          Smarter <span className="text-blue-600">Learning</span>,<br />
          Happier <span className="text-emerald-600">Teaching</span>
        </h1>
        <p className="text-lg text-gray-700 mb-6 leading-normal">
          Discover SmartLearn: the all-in-one platform for organizing classes, sharing resources, and tracking achievement. 
          Designed for seamless online & hybrid learning.
        </p>
        <ul className="mb-8 space-y-2 ml-1">
          <li className="flex gap-2 items-center text-base"><Globe className="text-blue-400" size={21} /> Global classrooms, accessible from anywhere</li>
          <li className="flex gap-2 items-center text-base"><Sparkles className="text-emerald-400" size={21} /> Tools for collaboration, grading, and feedback</li>
          <li className="flex gap-2 items-center text-base"><Lock className="text-slate-400" size={21} /> Safe, secure, and FERPA-compliant</li>
        </ul>
        <div className="flex gap-4 mb-3">
          <Link
            to="/login"
            className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:scale-105 transition-transform shadow"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 border border-primary px-6 py-3 rounded-lg font-medium text-primary transition-[background] hover:bg-primary/10"
          >
            <BookOpen size={22} /> Explore Features
          </a>
        </div>
        <div className="flex gap-7 mt-10">
          <div className="flex items-center gap-2">
            <User size={32} className="text-blue-500" />
            <div>
              <div className="font-bold">Students</div>
              <div className="text-xs text-gray-500">Join, learn, ask, achieve</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={32} className="text-emerald-500" />
            <div>
              <div className="font-bold">Teachers</div>
              <div className="text-xs text-gray-500">Create, organize, inspire</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img
          src="/lovable-uploads/b0395cde-8a4e-4fbb-b669-f64f70ce6fbd.png"
          alt="Students collaborating with laptops in classroom"
          className="rounded-lg shadow-2xl border-2 border-primary/10 w-full max-w-md animate-fade-in"
        />
      </div>
    </div>
  </section>
);
export default HeroSection;
