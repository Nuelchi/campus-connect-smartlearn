
import { User, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="w-full bg-gradient-to-r from-blue-50 to-white pt-10 pb-16 px-4">
    <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-14">
      <div className="flex-1 max-w-lg">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          Empowering <span className="text-blue-600">Students</span> &<br />
          <span className="text-emerald-600">Teachers</span> to Succeed
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-normal">
          SmartLearn is your all-in-one virtual classroom. Organize courses, access learning materials, submit assignments, and track progress—on a single secure platform.
        </p>
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
        <div className="flex gap-7 mt-8">
          <div className="flex items-center gap-2">
            <User size={32} className="text-blue-500" />
            <div>
              <div className="font-bold">Students</div>
              <div className="text-xs text-gray-500">Join Classes</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={32} className="text-emerald-500" />
            <div>
              <div className="font-bold">Teachers</div>
              <div className="text-xs text-gray-500">Manage Courses</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80"
          alt="Laptop with students"
          className="rounded-lg shadow-2xl border-2 border-primary/10 w-full max-w-md animate-fade-in"
        />
      </div>
    </div>
  </section>
);
export default HeroSection;
