import Hero from "@/app/components/index/hero";
import HowItWorks from "@/app/components/index/howto";
import Catalogue from "@/app/components/index/catalogue";
import Testimonials from "@/app/components/index/testimonials";
import Contact from "@/app/components/index/contact";
import FAQ from "@/app/components/index/faq";
import CTABanner from "@/app/components/index/cta";

function HomePage() {
  return (
    <section>
      <Hero />
      <HowItWorks />
      <Catalogue />
      <Testimonials />
      <Contact />
      <FAQ />
      <CTABanner />
    </section>
  );
}

export default HomePage;
