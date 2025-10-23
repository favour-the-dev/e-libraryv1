"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function CTABanner() {
  const contentVariants = {
    hidden: { y: 60, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section className="py-16 my-10">
      <div className="max-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={contentVariants}
          className="relative bg-gradient-to-r from-deepSkyBlue to-blue-600 rounded-2xl p-12 md:p-16 overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6">
            <h2 className="font-bbh-sans text-3xl md:text-5xl text-white-solid font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-white-solid/90 text-lg md:text-xl max-w-2xl">
              Join thousands of readers and start your journey with BookWise
              today. Access unlimited books and discover your next favorite
              read.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <Link href="/register">
                <button className="px-8 py-4 bg-white-solid text-deepSkyBlue rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 ease-in-out flex items-center gap-2 group shadow-lg">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/#catalogue">
                <button className="px-8 py-4 bg-transparent border-2 border-white-solid text-white-solid rounded-lg font-bold hover:bg-white-solid/10 transition-all duration-300 ease-in-out">
                  Browse Catalogue
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTABanner;
