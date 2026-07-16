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
  url: "https://www.theivathan.fr",
  email: "theivathan14@gmail.com",
  telephone: "+33784968840",
  jobTitle: "Développeur Full Stack",
  description:
    "Développeur Full Stack spécialisé React/Next.js, IA intégrée et DevOps. Marketplace créée de A à Z, 3 000+ clics SEO organiques/mois, automatisations qui économisent 3 h de travail par jour.",
  image: "https://www.theivathan.fr/me.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Argenteuil",
    postalCode: "95100",
    addressCountry: "FR",
  },
  worksFor: {
    "@type": "Organization",
    name: "IDLA — Investir dans l'ancien",
    url: "https://investirdanslancien.fr",
  },
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "ENSITECH",
      description: "Master Développeur Lead Full Stack, option Intelligence Artificielle (2025)",
    },
  ],
  knowsLanguage: ["fr", "en", "ta"],
  sameAs: [
    "https://github.com/Rederox",
    "https://www.linkedin.com/in/theivathan/",
  ],
  knowsAbout: [
    "React", "Next.js", "TypeScript", "Node.js", "PHP", "Python",
    "Docker", "DevOps", "Intelligence Artificielle", "PostgreSQL",
    "SEO technique", "Automatisation", "Mistral AI",
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
