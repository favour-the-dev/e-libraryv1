"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function Testimonials() {
  const headerRef = useRef<HTMLElement | null>(null);
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Book Enthusiast",
      text: "BookWise has completely transformed my reading experience. The easy borrowing system and vast collection make it my go-to library platform.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Student",
      text: "As a student, having access to such an extensive digital library has been invaluable. The interface is intuitive and the recommendations are spot-on!",
      rating: 5,
    },
    {
      name: "Emma Williams",
      role: "Teacher",
      text: "I recommend BookWise to all my students. It's reliable, user-friendly, and has an excellent selection of educational resources.",
      rating: 5,
    },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        toggleActions: "play none none none",
      },
    });

    tl.from(headerRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    });

    tl.from(testimonialRefs.current, {
      y: 80,
      opacity: 0,
      scale: 0.95,
      stagger: 0.2,
      duration: 0.6,
      ease: "power3.out",
    });
  });

  return (
    <section id="testimonials" ref={sectionRef} className="py-16 my-10">
      <div className="max-container flex flex-col gap-8">
        <header
          ref={headerRef}
          className="flex flex-col items-center justify-center gap-3"
        >
          <span className="w-fit bg-deepSkyBlue/20 text-deepSkyBlue p-2 rounded-xl font-playfairDisplay font-medium text-sm text-center">
            Testimonials
          </span>
          <h2 className="font-bbh-sans text-3xl md:text-4xl text-center">
            What Our Readers Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl">
            Join thousands of satisfied readers who have discovered their next
            favorite book with us
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              //   ref={(el) => {
              //     if (el) testimonialRefs.current[index] = el;
              //   }}
              className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg hover:border-deepSkyBlue/50 transition-all duration-300 ease-in-out relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-deepSkyBlue/20" />
              <div className="flex flex-col gap-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-deepSkyBlue text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="mt-2">
                  <h4 className="font-semibold text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
