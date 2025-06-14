
import { Calendar, BookOpen, MessageSquare, Check } from "lucide-react";

const cards = [
  {
    icon: <Calendar size={28} className="text-blue-500" />,
    title: "All-In-One Platform",
    desc: "Courses, assignments, materials, and grading—all organized seamlessly.",
  },
  {
    icon: <BookOpen size={28} className="text-emerald-500" />,
    title: "For Students & Teachers",
    desc: "Empowering both learners and instructors with tailored dashboards.",
  },
  {
    icon: <MessageSquare size={28} className="text-violet-500" />,
    title: "Discussion Forums",
    desc: "Open communication, Q&A, and announcements for each course.",
  },
  {
    icon: <Check size={28} className="text-gold-500" />,
    title: "Secure & Easy",
    desc: "Modern authentication, protected submissions, and rapid feedback.",
  },
];

const Highlights = () => (
  <section id="features" className="py-14 bg-white px-2">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Why Choose SmartLearn?</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-gray-50 px-6 py-7 rounded-2xl shadow hover:shadow-lg transition-shadow border border-gray-200
            text-center animate-fade-in"
            style={{ animationDelay: `${0.05 * idx + 0.1}s` }}
          >
            <div className="flex items-center justify-center mb-4">{card.icon}</div>
            <h3 className="font-bold text-lg mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default Highlights;
