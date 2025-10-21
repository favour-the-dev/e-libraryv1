"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function Contact() {
  const headerRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    tl.from(headerRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    });

    tl.from(
      [infoRef.current, formRef.current],
      {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.3"
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-gray-50 dark:bg-corbeau/30 py-16 my-10"
    >
      <div className="max-container flex flex-col gap-8">
        <header
          ref={headerRef}
          className="flex flex-col items-center justify-center gap-3"
        >
          <span className="w-fit bg-deepSkyBlue/20 text-deepSkyBlue p-2 rounded-xl font-playfairDisplay font-medium text-sm text-center">
            Get In Touch
          </span>
          <h2 className="font-bbh-sans text-3xl md:text-4xl text-center">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div ref={infoRef} className="flex flex-col gap-6">
            <div className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-4">
                Contact Information
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-deepSkyBlue/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-deepSkyBlue" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      support@bookwise.co
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-deepSkyBlue/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-deepSkyBlue" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-deepSkyBlue/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-deepSkyBlue" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      123 Library Street, Book City, BC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef}>
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-corbeau border border-gray-200 dark:border-gray-800 rounded-lg p-6 flex flex-col gap-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-corbeau focus:outline-none focus:ring-2 focus:ring-deepSkyBlue transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-corbeau focus:outline-none focus:ring-2 focus:ring-deepSkyBlue transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-corbeau focus:outline-none focus:ring-2 focus:ring-deepSkyBlue transition-all resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-deepSkyBlue text-white-solid px-6 py-3 rounded-md font-semibold hover:bg-deepSkyBlue/90 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 group"
              >
                Send Message
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
