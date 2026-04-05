import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Theivathan Thevaraj",
  url: "https://theivathan.fr",
  email: "theivathan14@gmail.com",
  jobTitle: "Développeur Lead Full Stack",
  description:
    "Développeur Lead Full Stack passionné par la création d'expériences web modernes et performantes. Spécialisé en IA, DevOps et architectures scalables.",
  image: "https://theivathan.fr/me.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Argenteuil",
    postalCode: "95100",
    addressCountry: "FR",
  },
  sameAs: [
    "https://github.com/Rederox",
    "https://www.linkedin.com/in/theivathan/",
  ],
  knowsAbout: [
    "React", "Next.js", "TypeScript", "Node.js", "PHP", "Python",
    "Docker", "DevOps", "Intelligence Artificielle", "PostgreSQL",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
        <Navigation />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
