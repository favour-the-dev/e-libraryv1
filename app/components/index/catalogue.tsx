"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { BookOpen } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function Catalogue() {
  const headerRef = useRef<HTMLElement | null>(null);
  const bookRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

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

  useGSAP(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
        // markers: true, // Uncomment to debug
      },
    });

    if (headerRef.current) {
      tl.from(headerRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }

    const validBooks = bookRefs.current.filter((ref) => ref !== null);
    if (validBooks.length > 0) {
      tl.from(
        validBooks,
        {
          y: 80,
          opacity: 0,
          scale: 0.9,
          stagger: 0.15,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.3"
      );
    }
  });

  return (
    <section
      id="catalogue"
      ref={sectionRef}
      className="bg-gray-50 dark:bg-corbeau/30 py-16 my-10"
    >
      <div className="max-container flex flex-col gap-8">
        <header
          ref={headerRef}
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
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <div
              key={index}
              //   ref={(el) => {
              //     if (el) bookRefs.current[index] = el;
              //   }}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Catalogue;
