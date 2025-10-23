"use client";
import { motion } from "framer-motion";
// import { BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { Book } from "@/types/types";
import Image from "next/image";

function Catalogue() {
  const [subject, setSubject] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);

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

 useEffect(() => {
  const loadBooks = async () => {
    setLoading(true);
    try {
      const fetchedBooks = await fetch(`/api/catalogue?subject=${subject}&limit=6`)
        .then(res => res.json());
      console.log(fetchedBooks);
      setBooks(fetchedBooks.works || []); // Add fallback to empty array
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }
  loadBooks();
}, [subject]);

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
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-gray-600 dark:text-gray-400">Category:</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 
              bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 
              focus:outline-none"
            >
              <option value="all">All</option>
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="science">Science</option>
              <option value="romance">Romance</option>
              <option value="fantasy">Fantasy</option>
            </select>
          </div>
        </motion.header>

        {
          loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-deepSkyBlue border-solid"></div>
          </div>
          ) : (
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
                {/* cover image */}
                <div className="w-[200px] h-[200px]">
                  <Image
                    src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
                    alt={book.title}
                    width={48}
                    height={72}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-deepSkyBlue transition-colors duration-300">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    by {book.authors.map(author => author.name).join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-deepSkyBlue/10 text-deepSkyBlue text-xs rounded-full">
                    {book.subject[0]}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500 text-xs">
                    {book.first_publish_year}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
          ) 
        }
      </div>
    </section>
  );
}

export default Catalogue;
