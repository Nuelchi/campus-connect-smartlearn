
import { Link } from "react-router-dom";

const CallToAction = () => (
  <section className="py-14 bg-gradient-to-r from-emerald-50 to-blue-100" id="contact">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-5 text-primary">Ready to explore SmartLearn?</h2>
      <p className="text-gray-700 mb-8 text-lg">
        Unlock powerful tools for learning and teaching. Sign up now—your virtual classroom awaits!
      </p>
      <Link
        to="/register"
        className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow hover:bg-emerald-700 hover:scale-105 transition-all"
      >
        Get Started Free
      </Link>
      <p className="text-muted-foreground text-sm mt-6">
        <span className="font-semibold">Admin?</span> Access the <Link to="/admin-login" className="text-blue-600 underline hover:text-blue-800">admin login</Link>.
      </p>
    </div>
  </section>
);

export default CallToAction;
