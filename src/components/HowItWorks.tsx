
import { Book, User, MessageSquare } from "lucide-react";

const HowItWorks = () => (
  <section className="py-16 bg-blue-50 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">How SmartLearn Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white px-6 py-8 rounded-xl shadow flex flex-col items-center animate-fade-in">
          <User size={38} className="text-blue-500 mb-4" />
          <h4 className="font-semibold mb-2">Sign Up & Join</h4>
          <p className="text-gray-600 text-sm text-center">
            Students and teachers can register in seconds and access their personalized dashboards.
          </p>
        </div>
        <div className="bg-white px-6 py-8 rounded-xl shadow flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <Book size={38} className="text-emerald-500 mb-4" />
          <h4 className="font-semibold mb-2">Organize & Learn</h4>
          <p className="text-gray-600 text-sm text-center">
            Teachers create courses. Students access resources, submit work, and receive instant updates.
          </p>
        </div>
        <div className="bg-white px-6 py-8 rounded-xl shadow flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <MessageSquare size={38} className="text-violet-500 mb-4" />
          <h4 className="font-semibold mb-2">Connect & Succeed</h4>
          <p className="text-gray-600 text-sm text-center">
            Real-time feedback, interactive discussions, and grade tracking fuel meaningful progress.
          </p>
        </div>
      </div>
    </div>
  </section>
);
export default HowItWorks;
