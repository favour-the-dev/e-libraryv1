"use client";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

function Catalogue() {
  const books = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic",
      year: "1925",
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      year: "1960",
    },
    {
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      year: "1949",
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Romance",
      year: "1813",
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      genre: "Fiction",
      year: "1951",
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      year: "1937",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const headerVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const bookVariants = {
    hidden: { y: 80, opacity: 0, scale: 0.9 },
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
      id="catalogue"
      className="bg-gray-50 dark:bg-corbeau/30 py-16 my-10 min-h-[60dvh]"
    >
      <div className="max-container flex flex-col gap-8">
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerVariants}
          className="flex flex-col items-center justify-center gap-3"
        >
          <span className="w-fit bg-deepSkyBlue/20 text-deepSkyBlue p-2 rounded-xl font-playfairDisplay font-medium text-sm text-center">
            Our Collection
          </span>
          <h2 className="font-bbh-sans text-3xl md:text-4xl text-center">
            Featured Books
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl">
            Discover our curated selection of timeless classics and modern
            masterpieces
          </p>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {books.map((book, index) => (
            <motion.div
              key={index}
              variants={bookVariants}
              className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg hover:border-deepSkyBlue/50 transition-all duration-300 ease-in-out group"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-full bg-deepSkyBlue/10 flex items-center justify-center group-hover:bg-deepSkyBlue/20 transition-colors duration-300">
                  <BookOpen className="w-6 h-6 text-deepSkyBlue" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-deepSkyBlue transition-colors duration-300">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    by {book.author}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-deepSkyBlue/10 text-deepSkyBlue text-xs rounded-full">
                    {book.genre}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500 text-xs">
                    {book.year}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Catalogue;
