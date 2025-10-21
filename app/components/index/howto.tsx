"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function HowItWorks() {
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
    gsap.from(featureRefs.current, {
      y: 100,
      opacity: 0,
      scale: 0.8,
      stagger: 0.2,
      duration: 0.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none none",
        // markers: true,
      },
    });
  });
  return (
    <section
      ref={sectionRef}
      className="min-h-[50dvh] flex items-center justify-center"
    >
      <div className="max-container flex flex-col md:flex-row gap-5">
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
    </section>
  );
}

export default HowItWorks;
