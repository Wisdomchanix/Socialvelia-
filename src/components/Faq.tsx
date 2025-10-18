import React, { useState } from "react";
import {
  HelpCircle,
  Laptop,
  Briefcase,
  Headphones,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Question {
  question: string;
  answer: string;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  questions: Question[];
}

const categories: Category[] = [
  {
    name: "General Questions",
    icon: <HelpCircle className="w-7 h-7" />,
    questions: [
      {
        question: "What is Social Velia?",
        answer:
          "Social Velia is your all-in-one platform that helps creators and entrepreneurs find their niche, discover viral content ideas, generate AI voiceovers, and research trends to grow faster.",
      },
      {
        question: "Who is Social Velia for?",
        answer:
          "It’s designed for content creators, influencers, marketers, and anyone who wants to grow their brand or monetize their content with data-driven insights and AI tools.",
      },
      {
        question: "Do I need technical experience to use it?",
        answer:
          "Not at all! Social Velia is built to be beginner-friendly. You can start finding viral ideas and creating content within minutes.",
      },
    ],
  },
  {
    name: "Platform Features",
    icon: <Laptop className="w-7 h-7" />,
    questions: [
      {
        question: "What can I do with Social Velia?",
        answer:
          "You can find trending content in your niche, generate voiceovers, access AI writing tools, and discover money-making opportunities—all in one dashboard.",
      },
      {
        question: "Can I generate content ideas automatically?",
        answer:
          "Yes! Our AI scans viral content across platforms and recommends ideas tailored to your audience.",
      },
      {
        question: "Does Social Velia provide voiceovers?",
        answer:
          "Absolutely! You can turn scripts or summaries into realistic voiceovers for your videos or podcasts with just one click.",
      },
    ],
  },
  {
    name: "Plans & Pricing",
    icon: <Briefcase className="w-7 h-7" />,
    questions: [
      {
        question: "Is Social Velia free?",
        answer:
          "You can start free with limited access. Our Pro plans unlock unlimited niche tools, AI voiceovers, and advanced trend analytics.",
      },
      {
        question: "Can I cancel anytime?",
        answer:
          "Yes! You can upgrade, downgrade, or cancel your plan anytime—no hidden fees.",
      },
    ],
  },
  {
    name: "Support & Updates",
    icon: <Headphones className="w-7 h-7" />,
    questions: [
      {
        question: "How do I get support?",
        answer:
          "Our support team is always ready to help via email or live chat. We also provide a detailed help center for quick answers.",
      },
      {
        question: "Does Social Velia get regular updates?",
        answer:
          "Yes! We’re constantly improving the platform with new AI tools, trend insights, and content creation features.",
      },
    ],
  },
];

const Faq: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-white text-gray-900 dark:bg-[#05010E] dark:text-white py-20 px-4 relative overflow-hidden transition-colors duration-500"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7B2FF7]/10 via-[#F107A3]/10 to-white dark:from-[#7B2FF7]/20 dark:via-[#F107A3]/10 dark:to-[#05010E] blur-3xl opacity-70 pointer-events-none" />

      {/* Header */}
      <div className="text-center relative z-10 mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:bg-none dark:text-white">
          Have Questions About Social Velia?
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore frequently asked questions and learn how Social Velia helps you grow your content faster.
        </p>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-4 gap-4 mb-12">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex flex-col items-center justify-center text-center p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                activeTab === index
                  ? "bg-gradient-to-br from-[#F107A3] to-[#7B2FF7] text-white scale-105 shadow-[0_0_25px_rgba(123,47,247,0.5)]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#0A071A] dark:text-gray-300 dark:hover:bg-[#140C26] shadow-[0_0_15px_rgba(123,47,247,0.1)]"
              }`}
            >
              <div
                className={`mb-2 ${
                  activeTab === index
                    ? "text-white"
                    : "text-[#F107A3] dark:text-[#F107A3]"
                }`}
              >
                {category.icon}
              </div>
              <p className="text-sm font-semibold">{category.name}</p>
            </div>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {categories[activeTab].questions.map((q, index) => (
            <div
              key={index}
              onClick={() => handleExpand(index)}
              className={`rounded-lg cursor-pointer transition-all border ${
                expandedIndex === index
                  ? "border-[#F107A3] shadow-[0_0_25px_rgba(123,47,247,0.25)]"
                  : "border-gray-200 dark:border-[#1B152F] hover:shadow-[0_0_15px_rgba(123,47,247,0.1)]"
              } bg-white dark:bg-[#0A071A]`}
            >
              <div className="flex justify-between items-center px-5 py-4">
                <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
                  {q.question}
                </p>
                {expandedIndex === index ? (
                  <ChevronDown className="w-5 h-5 text-[#F107A3]" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-[#F107A3]" />
                )}
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedIndex === index ? "max-h-96 pb-4 px-5" : "max-h-0"
                }`}
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {q.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
