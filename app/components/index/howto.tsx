"use client";
import { motion } from "framer-motion";

function HowItWorks() {
  const featureTexts = [
    {
      feature: "Browse & Discover",
      desc: "Explore Our vast collection of books across various genres. Find your next favourite read",
    },
    {
      feature: "Borrow With Ease",
      desc: "Once you find a book you like, borrow it instantly with a single click.",
    },
    {
      feature: "Track & Return",
      desc: "Manage your borrowed books, get reminders for due dates, and return them hassle free",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const featureVariants = {
    hidden: { y: 100, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      id="how-it-works"
      className="flex items-center justify-center my-5"
    >
      <motion.div
        className="max-container flex flex-col gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.header
          variants={headerVariants}
          className="flex flex-col items-center justify-center gap-3 mb-5"
        >
          <span
            className="w-fit bg-deepSkyBlue/20 text-deepSkyBlue p-2 
          rounded-xl font-playfairDisplay font-medium text-sm text-center"
          >
            How It Works
          </span>
          <h2 className="font-bbh-sans text-3xl md:text-4xl text-center">
            Simple Steps To Start Reading
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Getting started on Bookwise is as easy as one, two, three
          </p>
        </motion.header>
        <div className="flex flex-col md:flex-row gap-5">
          {featureTexts.map((text, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span className="w-12 h-12 rounded-full border border-deepSkyBlue bg-deepSkyBlue/20 text-deepSkyBlue font-bold flex items-center justify-center text-center">
                {index + 1}
              </span>
              <h2 className="font-semibold">{text.feature}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                {text.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default HowItWorks;
