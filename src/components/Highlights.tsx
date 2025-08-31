
import { Calendar, BookOpen, MessageSquare, Check, Users, Layers, FileBarChart, Award } from "lucide-react";

const cards = [
  {
    icon: <Calendar size={28} className="text-blue-500" />,
    title: "Unified Course Hub",
    desc: "Manage class schedules, assignments, and events in one dashboard.",
  },
  {
    icon: <BookOpen size={28} className="text-emerald-500" />,
    title: "Student & Teacher Role Support",
    desc: "Dedicated features tailored for every user—switch easily as a dual-role user.",
  },
  {
    icon: <MessageSquare size={28} className="text-violet-500" />,
    title: "Instant Messaging & Forums",
    desc: "Engage in course-specific discussions, Q&A, and peer collaboration with live updates.",
  },
  {
    icon: <Check size={28} className="text-gold-500" />,
    title: "Safe & Hassle-Free",
    desc: "Modern login, protected submissions, auto-grading, and robust data privacy.",
  },
  {
    icon: <Users size={28} className="text-rose-500" />,
    title: "Collaborative Projects",
    desc: "Invite classmates, group chat, real-time editing, and feedback for every project.",
  },
  {
    icon: <Layers size={28} className="text-sky-500" />,
    title: "Resource Library",
    desc: "Upload, share, and annotate documents, links, and media files—all securely stored.",
  },
  {
    icon: <FileBarChart size={28} className="text-indigo-500" />,
    title: "Insights & Progress Tracking",
    desc: "Visual performance dashboards, attendance, and growth metrics at a glance.",
  },
  {
    icon: <Award size={28} className="text-yellow-500" />,
    title: "Achievements & Certificates",
    desc: "Recognize success with badges, leaderboards, and printable certificates.",
  },
];

const Highlights = () => (
  <section id="features" className="py-14 bg-white px-2">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Why Choose SmartLearn?</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-7">
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
