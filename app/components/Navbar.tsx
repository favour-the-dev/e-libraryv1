"use client";
import Logo from "./ui-helpers/Logo";
import { usePathname } from "next/navigation";
import ThemeSwitchBtn from "./ui-helpers/ThemeSwitchBtn";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isNavOpen, SetIsNavOpen] = useState(false);
  const pathName = usePathname();

  return (
    <nav className="sticky inset-x-0 top-0 z-[120] w-full overflow-hidden shadow-sm">
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-0 bg-gray-100/70 dark:bg-corbeau/70 backdrop-blur-md"
          aria-hidden="true"
        />

        <div className="max-container relative flex items-center justify-between py-3">
          <Logo />

          {/* desktop links */}
          <div className="hidden md:flex items-center space-x-4 font-medium text-sm">
            <Link
              href="/"
              className={`${
                pathName === "/" && "text-deepSkyBlue"
              } hover:text-deepSkyBlue transition-colors duration-300 ease-in-out`}
            >
              Home
            </Link>
            <Link
              href="/#how-it-works"
              className={`${
                pathName === "/#how-it-works" && "text-deepSkyBlue"
              } hover:text-deepSkyBlue transition-colors duration-300 ease-in-out`}
            >
              How It Works
            </Link>
            <Link
              href="/#catalogue"
              className={`${
                pathName === "/#catalogue" && "text-deepSkyBlue"
              } hover:text-deepSkyBlue transition-colors duration-300 ease-in-out`}
            >
              Catalogue
            </Link>
            <Link
              href="#features"
              className={`${
                pathName === "/features" && "text-deepSkyBlue"
              } hover:text-deepSkyBlue transition-colors duration-300 ease-in-out`}
            >
              Testimonials
            </Link>
            <Link
              href="#contact"
              className={`${
                pathName === "/contact" && "text-deepSkyBlue"
              } hover:text-deepSkyBlue transition-colors duration-300 ease-in-out`}
            >
              Contact
            </Link>
          </div>

          {/* cta buttons */}
          <div className="flex items-center gap-3">
            <ThemeSwitchBtn />

            {/* desktop-cta */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/signin"
                className="px-5 py-2 border border-transparent bg-deepSkyBlue/30 text-deepSkyBlue text-sm rounded-md font-bold
                hover:bg-deepSkyBlue hover:text-white-solid transition-colors duration-300 ease-in-out"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 border border-transparent bg-deepSkyBlue text-white-solid text-sm rounded-md font-bold
                hover:bg-deepSkyBlue/80 transition-colors duration-300 ease-in-out"
              >
                Register
              </Link>
            </div>

            {/* mobile menu */}
            <div className="md:hidden">
              {/* menu btn */}
              <button
                type="button"
                className="w-fit relative z-50"
                onClick={() => {
                  SetIsNavOpen((prev: boolean) => !prev);
                }}
                aria-expanded={isNavOpen}
                aria-label="Toggle navigation menu"
              >
                {isNavOpen ? (
                  <X className="w-8 h-8 text-deepSkyBlue dark:text-white-solid" />
                ) : (
                  <Menu className="w-8 h-8 text-deepSkyBlue dark:text-white-solid" />
                )}
              </button>

              {/* mobile layer */}
              <div
                className={`fixed inset-0 z-[49] overflow-x-hidden transition-[opacity] duration-200 ${
                  isNavOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                {/* overlay */}
                <div
                  className="absolute inset-0 bg-black/30 dark:bg-black/50"
                  onClick={() => SetIsNavOpen(false)}
                  aria-hidden="true"
                />

                {/* nav menu */}
                <div
                  className={`absolute top-0 right-0 h-full w-[min(80vw,320px)] bg-white-solid dark:bg-corbeau py-16 px-8 transition-transform duration-300 ease-in-out flex flex-col gap-5 text-2xl border-l-2 border-gray-200 dark:border-gray-800 will-change-transform ${
                    isNavOpen ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <Link
                    href="/"
                    className={`${
                      pathName === "/" && "text-deepSkyBlue"
                    } hover:text-deepSkyBlue transition-colors duration-300 ease-in-out`}
                    onClick={() => SetIsNavOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/catalogue"
                    className={`${
                      pathName === "/catalogue" && "text-deepSkyBlue"
                    } hover:text-deepSkyBlue transition-colors duration-300 ease-in-out`}
                    onClick={() => SetIsNavOpen(false)}
                  >
                    Catalogue
                  </Link>
                  <Link
                    href="#about"
                    className={`${
                      pathName === "/about" && "text-deepSkyBlue"
                    } hover:text-deepSkyBlue transition-colors duration-300 ease-in-out`}
                    onClick={() => SetIsNavOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="#features"
                    className={`${
                      pathName === "/features" && "text-deepSkyBlue"
                    } hover:text-deepSkyBlue transition-colors duration-300 ease-in-out`}
                    onClick={() => SetIsNavOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="#contact"
                    className={`${
                      pathName === "/contact" && "text-deepSkyBlue"
                    } hover:text-deepSkyBlue transition-colors duration-300 ease-in-out`}
                    onClick={() => SetIsNavOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    href="/signin"
                    className="text-lg text-deepSkyBlue/80 font-bold"
                    onClick={() => SetIsNavOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="text-lg text-deepSkyBlue font-bold"
                    onClick={() => SetIsNavOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
