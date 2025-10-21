"use client";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
function Hero() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const buttonRef = useRef<HTMLAnchorElement | null>(null);
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.2, delay: 0.1 },
    });
    tl.from(imageRef.current, {
      opacity: 0,
      scale: 0.8,
    });
    tl.from(spanRefs.current, {
      y: 50,
      opacity: 0,
      stagger: 0.1,
    });
    tl.from(textRef.current, {
      y: 50,
      opacity: 0,
    });
    tl.from(buttonRef.current, {
      scale: 0.9,
      opacity: 0,
    });
  });
  return (
    <section className="min-h-[90vh] flex items-center justify-center py-10 relative">
      {/* overlay */}
      <div className="absolute w-full h-full inset-0 bg-black/10 dark:bg-black/20 transition-colors duration-300 ease-in-out z-1" />
      <Image
        ref={imageRef}
        alt="hero-bg"
        src={"/assets/heroimg.jpeg"}
        width={500}
        height={500}
        className="absolute inset-0 w-full h-full object-cover object-center brightness-40 dark:brightness-35 z-0"
      />
      <div className="max-container relative z-10 h-full flex flex-col md:flex-row items-center justify-between gap-5">
        {/* text content */}
        <div className="w-full md:w-1/2 flex flex-col gap-3 p-3">
          <h1
            className="font-bbh-sans tracking-wider font-semibold text-4xl md:text-5xl text-white-solid 
          flex items-center flex-wrap gap-2 md:gap-3"
          >
            {["Your", "Digital", "Library", "Simplified"].map((words, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) spanRefs.current[i] = el;
                }}
                className={`${i > 1 ? "text-deepSkyBlue" : "text-white-solid"}`}
              >
                {words}
              </span>
            ))}
          </h1>
          <p
            ref={textRef}
            className=" text-gray-400 dark:text-white-300 text-lg md:text-xl"
          >
            Manage your books with ease using bookwise, track your reading
            progress, and discover new and trending titles, join our illustrious
            community of readers.
          </p>
          <Link href={"/register"} ref={buttonRef}>
            <button
              className="bg-blue-500 text-white px-6 py-4 rounded-md uppercase font-semibold 
            mt-2 hover:bg-blue-600 transition-colors duration-300 ease-in-out cursor-pointer w-full md:w-fit"
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
