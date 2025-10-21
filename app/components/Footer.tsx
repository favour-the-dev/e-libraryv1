import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 dark:bg-corbeau/50 py-12 mt-10 border-t border-gray-200 dark:border-gray-800">
      <div className="max-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-deepSkyBlue" />
              <span className="font-bbh-sans text-xl font-bold">BookWise</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your digital library, simplified. Access thousands of books at
              your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-deepSkyBlue transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#catalogue"
                  className="text-gray-600 dark:text-gray-400 hover:text-deepSkyBlue transition-colors text-sm"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-gray-600 dark:text-gray-400 hover:text-deepSkyBlue transition-colors text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-gray-600 dark:text-gray-400 hover:text-deepSkyBlue transition-colors text-sm"
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/#contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-deepSkyBlue transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 dark:text-gray-400 hover:text-deepSkyBlue transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-deepSkyBlue transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-deepSkyBlue transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-deepSkyBlue mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  support@bookwise.co
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-deepSkyBlue mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-deepSkyBlue mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  123 Library Street, Book City
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {year} BookWise.co. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-deepSkyBlue transition-colors text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 dark:text-gray-400 hover:text-deepSkyBlue transition-colors text-sm"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-gray-600 dark:text-gray-400 hover:text-deepSkyBlue transition-colors text-sm"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
