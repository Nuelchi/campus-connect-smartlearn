import { Link } from "react-router-dom";
const CallToAction = () => <section className="py-8 sm:py-16 bg-gradient-to-r from-emerald-50 to-blue-100 px-4" id="contact">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 text-primary">Join SmartLearn today!</h2>
      <p className="text-gray-700 mb-6 sm:mb-7 text-base sm:text-lg leading-relaxed">
        Unlock award-winning tools for teaching, learning, and collaboration. Get started now—your digital classroom empowers you!
      </p>
      <Link to="/register" className="inline-block bg-emerald-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-lg sm:text-xl font-semibold shadow hover:bg-emerald-700 hover:scale-105 transition-all mx-0 my-[20px]">
        Start Free Now
      </Link>
      <div className="mt-8 sm:mt-10 space-y-3 sm:space-y-2 text-gray-700 text-sm sm:text-base px-4">
        <div>
          <strong>No commitment:</strong> All features available free for students and teachers.
        </div>
        <div>
          <strong>Need help?</strong> <a href="mailto:support@smartlearn.com" className="text-blue-600 underline hover:text-blue-800">Contact support</a>
        </div>
        <div>
          <strong>Privacy first:</strong> All learning data stays private—always.
        </div>
      </div>
    </div>
  </section>;
export default CallToAction;