"use client";
import React, { useState } from "react";

const About = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqData = [
    {
      question: "Question 1",
      answer: "This is the answer to Question 1. More details about the topic will appear here.",
    },
    {
      question: "Question 2",
      answer: "Answer for Question 2. You can expand this section to reveal more information.",
    },
    {
      question: "Question 3",
      answer: "Here is the answer to Question 3. It provides additional context for the user.",
    },
  ];

  return (
    <div className="flex flex-col items-center p-8 bg-white min-h-screen">
      {/* Introduction Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Misconduct Complaint in <br /> Allegheny County
        </h1>
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">
          <p className="text-gray-700 leading-relaxed">
            Each municipality independently manages the recruitment, training,
            and oversight of its own police force in Allegheny County. While
            some police departments serve multiple municipalities, the majority
            have their own independent police force. This creates significant
            barriers to officer accountability in cases of tension due to the
            inconsistent and hyper-fragmented nature of complaint policies,
            procedures, and disciplinary actions. In 2021, the total police
            expenditure was 2.4 billion dollars. The county has a total of 2,246
            officers, with only 156 of them being part-time.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">FAQ</h2>
        {faqData.map((item, index) => (
          <div key={index} className="border-t border-gray-300">
            <button
              className="w-full flex justify-between items-center py-4 text-lg text-gray-800 hover:bg-gray-100"
              onClick={() => toggleQuestion(index)}
            >
              {item.question}
              <span className="text-gray-900">
                {openQuestion === index ? "▲" : "▼"}
              </span>
            </button>
            {openQuestion === index && (
              <div className="p-4 text-gray-600 bg-gray-50">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
