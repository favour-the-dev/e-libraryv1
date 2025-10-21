"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function HowItWorks() {
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
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
  useGSAP(() => {
    const tl = gsap.timeline({
      duration: 0.5,
      delay: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom center",
        toggleActions: "play none none none",
        // markers: true,
      },
    });

    tl.from(headerRef.current, {
      y: 50,
      opacity: 0,
    });

    tl.from(featureRefs.current, {
      y: 100,
      opacity: 0,
      scale: 0.8,
      stagger: 0.2,
    });
  });
  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="flex items-center justify-center my-5"
    >
      <div className="max-container flex flex-col gap-5">
        <header
          ref={headerRef}
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
        </header>
        <div className="flex flex-col md:flex-row gap-5">
          {featureTexts.map((text, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) featureRefs.current[index] = el;
              }}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span className="w-12 h-12 rounded-full border border-deepSkyBlue bg-deepSkyBlue/20 text-deepSkyBlue font-bold flex items-center justify-center text-center">
                {index + 1}
              </span>
              <h2 className="font-semibold">{text.feature}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                {text.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
