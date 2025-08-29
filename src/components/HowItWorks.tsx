
import { Book, User, MessageSquare, FileCheck, AlarmClock, Star } from "lucide-react";

const HowItWorks = () => (
  <section className="py-8 sm:py-16 bg-blue-50 px-4 sm:px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center px-4">How SmartLearn Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-white px-4 sm:px-6 py-6 sm:py-8 rounded-xl shadow flex flex-col items-center animate-fade-in">
          <User size={32} className="text-blue-500 mb-3 sm:mb-4" />
          <h4 className="font-semibold mb-2 text-center">Sign Up & Join</h4>
          <p className="text-gray-600 text-xs sm:text-sm text-center leading-relaxed">
            Create your free account in moments. Choose your role: student or teacher. 
            Access your secure SmartLearn dashboard and connect with your class instantly.
          </p>
        </div>
        <div className="bg-white px-4 sm:px-6 py-6 sm:py-8 rounded-xl shadow flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <Book size={32} className="text-emerald-500 mb-3 sm:mb-4" />
          <h4 className="font-semibold mb-2 text-center">Organize & Learn</h4>
          <p className="text-gray-600 text-xs sm:text-sm text-center leading-relaxed">
            Teachers create courses, add learning materials, and schedule assignments. 
            Students can browse resources, join discussions, and submit work—all in one place.
          </p>
          <FileCheck size={26} className="text-orange-400 mt-3 sm:mt-4" />
          <span className="block mt-1 text-xs text-gray-400 text-center">Everything organized, never miss a thing.</span>
        </div>
        <div className="bg-white px-4 sm:px-6 py-6 sm:py-8 rounded-xl shadow flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <MessageSquare size={32} className="text-violet-500 mb-3 sm:mb-4" />
          <h4 className="font-semibold mb-2 text-center">Connect & Achieve</h4>
          <p className="text-gray-600 text-xs sm:text-sm text-center leading-relaxed">
            Post questions, interact with peers, and receive real-time feedback from teachers.
            Track grades, celebrate milestones, and stay motivated!
          </p>
          <div className="flex gap-3 mt-3">
            <AlarmClock size={20} className="text-blue-400" />
            <Star size={20} className="text-yellow-400" />
          </div>
        </div>
      </div>
      <div className="text-center mt-8 sm:mt-12 text-base sm:text-lg font-medium text-primary opacity-70 px-4">
        SmartLearn brings everyone together for a smarter, happier education journey.
      </div>
    </div>
  </section>
);
export default HowItWorks;
