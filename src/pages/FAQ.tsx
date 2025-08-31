import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  HelpCircle, 
  Search,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = {
    gettingStarted: [
      {
        question: "How do I create an account?",
        answer: "Click the 'Register' button on the homepage, fill in your details including email, password, and full name. Verify your email address to activate your account."
      },
      {
        question: "How do I log in to the system?",
        answer: "Use your registered email and password on the login page. If you forget your password, use the 'Forgot Password' link to reset it."
      },
      {
        question: "How do I navigate the dashboard?",
        answer: "After login, you'll be redirected to your role-specific dashboard. Use the sidebar navigation menu to access different sections like courses, assignments, or messaging."
      },
      {
        question: "What should I do if I can't access my account?",
        answer: "First, check if your email is verified. If issues persist, contact support with your email address and a description of the problem."
      },
      {
        question: "How do I change my password?",
        answer: "Go to your profile settings, click on 'Change Password', enter your current password, then set a new secure password."
      }
    ],
    students: [
      {
        question: "How do I enroll in a course?",
        answer: "Browse available courses from the course catalog, click on a course you're interested in, and click the 'Enroll' button. You'll receive a confirmation email."
      },
      {
        question: "How do I access course materials?",
        answer: "Once enrolled, go to 'My Courses' in your dashboard, select the course, and navigate to the 'Materials' tab where you can download PDFs, videos, and other resources."
      },
      {
        question: "How do I submit assignments?",
        answer: "Go to the 'Assignments' section, select the assignment, read the instructions, upload your file (if required), and click 'Submit Assignment' before the deadline."
      },
      {
        question: "How do I view my grades?",
        answer: "Check the 'Grades' section in your dashboard. Grades are typically posted within 5-7 business days after assignment submission."
      },
      {
        question: "How do I participate in course discussions?",
        answer: "Use the 'Messaging' feature to start conversations with instructors or classmates. You can also join course-specific chat rooms for group discussions."
      },
      {
        question: "What if I miss an assignment deadline?",
        answer: "Contact your instructor immediately. Some instructors may accept late submissions with a grade penalty, but this varies by course policy."
      },
      {
        question: "How do I track my course progress?",
        answer: "View your progress in the 'Analytics' section of your dashboard. This shows completion rates, grades, and overall performance metrics."
      }
    ],
    lecturers: [
      {
        question: "How do I create a new course?",
        answer: "Go to 'Course Management' in your dashboard, click 'Create New Course', fill in course details (title, description, objectives), and click 'Create Course'."
      },
      {
        question: "How do I upload course materials?",
        answer: "In your course dashboard, go to 'Course Materials', click 'Upload Material', select your file, add a description, and click 'Upload'. Supported formats include PDF, DOC, PPT, and video files."
      },
      {
        question: "How do I create assignments?",
        answer: "Navigate to 'Assignments' in your course, click 'Create Assignment', fill in details (title, description, deadline, file requirements), and click 'Create'."
      },
      {
        question: "How do I grade student submissions?",
        answer: "Go to 'Gradebook', select the assignment, review student submissions, assign grades, provide feedback, and click 'Save Grade' for each student."
      },
      {
        question: "How do I monitor student performance?",
        answer: "Use the 'Analytics' dashboard to view class performance, individual student progress, assignment completion rates, and grade distributions."
      },
      {
        question: "How do I communicate with students?",
        answer: "Use the 'Messaging' system to send announcements, respond to individual questions, or start group conversations with your class."
      },
      {
        question: "How do I set course policies?",
        answer: "In course settings, you can configure grading policies, late submission rules, attendance requirements, and other course-specific guidelines."
      },
      {
        question: "How do I export course data?",
        answer: "Use the 'Reports' section to export student lists, grades, attendance records, and other course data in CSV or PDF format."
      }
    ]
  };

  const filteredFAQs = (category: keyof typeof faqData) => {
    if (!searchQuery) return faqData[category];
    return faqData[category].filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about using Campus Connect SmartLearn. 
            Whether you're a student, lecturer, or administrator, we've got you covered.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800">
            <CardHeader className="text-center">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Getting Started</CardTitle>
              <CardDescription>Account setup and basic navigation</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800">
            <CardHeader className="text-center">
              <GraduationCap className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Student Guide</CardTitle>
              <CardDescription>Course enrollment and learning tools</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Lecturer Guide</CardTitle>
              <CardDescription>Course creation and management</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* FAQ Tabs */}
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="getting-started" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Getting Started
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="lecturers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Lecturers
            </TabsTrigger>
          </TabsList>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Getting Started Guide
                </CardTitle>
                <CardDescription>
                  Essential steps to get started with Campus Connect SmartLearn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs('gettingStarted').map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left hover:text-blue-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  Student Guide
                </CardTitle>
                <CardDescription>
                  Everything you need to know as a student using the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs('students').map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left hover:text-green-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lecturers Tab */}
          <TabsContent value="lecturers">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Lecturer Guide
                </CardTitle>
                <CardDescription>
                  Comprehensive guide for lecturers managing courses and students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs('lecturers').map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left hover:text-purple-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Additional Help Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you get the most out of Campus Connect SmartLearn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use the search function above to quickly find specific answers across all FAQ categories.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🔍 Quick Navigation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Click on the colored cards above to jump directly to specific user guides.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📱 Mobile Friendly</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This FAQ page is fully responsive and works great on all devices.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 