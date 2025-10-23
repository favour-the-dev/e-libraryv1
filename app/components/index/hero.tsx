"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const spanVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center py-10 relative">
      {/* overlay */}
      <div className="absolute w-full h-full inset-0 bg-black/10 dark:bg-black/20 transition-colors duration-300 ease-in-out z-1" />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={imageVariants}
        className="absolute inset-0 w-full h-full z-0"
      >
        <Image
          alt="hero-bg"
          src={"/assets/heroimg.jpeg"}
          width={500}
          height={500}
          className="w-full h-full object-cover object-center brightness-40 dark:brightness-35"
        />
      </motion.div>
      <div className="max-container relative z-10 h-full flex flex-col md:flex-row items-center justify-between gap-5">
        {/* text content */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col gap-3 p-3"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h1
            className="font-bbh-sans tracking-wider font-semibold text-4xl md:text-5xl text-white-solid 
          flex items-center flex-wrap gap-2 md:gap-3"
          >
            {["Your", "Digital", "Library", "Simplified"].map((words, i) => (
              <motion.span
                key={i}
                variants={spanVariants}
                className={`${i > 1 ? "text-deepSkyBlue" : "text-white-solid"}`}
              >
                {words}
              </motion.span>
            ))}
          </h1>
          <motion.p
            variants={textVariants}
            className=" text-gray-400 dark:text-white-300 text-lg md:text-xl"
          >
            Manage your books with ease using bookwise, track your reading
            progress, and discover new and trending titles, join our illustrious
            community of readers.
          </motion.p>
          <Link href={"/register"}>
            <motion.button
              variants={buttonVariants}
              className="bg-blue-500 text-white px-6 py-4 rounded-md uppercase font-semibold 
            mt-2 hover:bg-blue-600 transition-colors duration-300 ease-in-out cursor-pointer w-full md:w-fit"
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
