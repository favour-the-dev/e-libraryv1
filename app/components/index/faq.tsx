"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I borrow a book?",
      answer:
        "Simply browse our catalogue, select a book you're interested in, and click the 'Borrow' button. The book will be added to your library instantly and you can start reading right away.",
    },
    {
      question: "How long can I keep a borrowed book?",
      answer:
        "You can keep a borrowed book for up to 14 days. You'll receive reminders as the due date approaches. If you need more time, you can renew the book if it's not reserved by another user.",
    },
    {
      question: "How many books can I borrow at once?",
      answer:
        "Free members can borrow up to 3 books at a time, while premium members can borrow up to 10 books simultaneously. You can upgrade your account anytime for more benefits.",
    },
    {
      question: "What happens if I return a book late?",
      answer:
        "We understand that life gets busy! Late returns won't incur any fees, but your borrowing privileges may be temporarily paused until the overdue books are returned. We'll send you friendly reminders before the due date.",
    },
    {
      question: "Can I read books offline?",
      answer:
        "Yes! Once you borrow a book, you can download it to read offline on any of your devices. The book will remain accessible throughout your borrowing period, even without an internet connection.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "We're currently working on mobile apps for both iOS and Android. In the meantime, our website is fully responsive and works seamlessly on mobile browsers for a great reading experience on the go.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="faq" className="py-16 my-10">
      <motion.div
        className="max-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.header
          variants={headerVariants}
          className="flex flex-col items-center justify-center gap-3 mb-12"
        >
          <span className="w-fit bg-deepSkyBlue/20 text-deepSkyBlue p-2 rounded-xl font-playfairDisplay font-medium text-sm text-center">
            FAQ
          </span>
          <h2 className="font-bbh-sans text-3xl md:text-4xl text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl">
            Got questions? We've got answers. Find everything you need to know
            about using BookWise.
          </p>
        </motion.header>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
              >
                <span className="font-semibold text-lg pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-deepSkyBlue" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: {
                          duration: 0.3,
                        },
                        opacity: {
                          duration: 0.25,
                          delay: 0.1,
                        },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: {
                          duration: 0.3,
                        },
                        opacity: {
                          duration: 0.2,
                        },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default FAQ;
