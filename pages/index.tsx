/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-head-element */
import Head from "next/head";
import { Analytics } from '@vercel/analytics/react';
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import ExperienceContainer from "@/components/ExperienceContainer";
import Skills from "@/components/Skills";
import Formation from "@/components/Formation";
import Contact from "@/components/Contact";

import SmoothLink from "@/components/SmoothLink";
import { Experience, PageInfo, Skill, Social } from "@/typings";
import { fetchPageInfo } from "@/utils/fetchPageInfo";
import { fetchExperience } from "@/utils/fetchExperience";
import { fetchSkills } from "@/utils/fetchSkills";
import { fetchSocial } from "@/utils/fetchSocials";

type Props = {
  pageInfo: PageInfo | null;
  experiences: Experience[];
  skills: Skill[];
  socials: Social[];
};

const Home = ({ pageInfo, experiences, skills, socials }: Props) => {
  const handleSubmit = (name: string, email: string, message: string) => {
    console.log("Formulaire soumis:", { name, email, message });
    // Gérer l'envoi du formulaire, par exemple en l'envoyant à une API ou en l'enregistrant dans une base de données
  };

  return (
    <div className="bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-emerald-900 to-slate-900 text-white h-screen snap-y snap-mandatory overflow-scroll z-0 overflow-x-hidden">
      <Head>
        <title>Thevaraj Theivathan - Développeur Web</title>
        <meta name="description" content="Portfolio de Thevaraj Theivathan, Développeur fullstack, basé à Argenteuil. Découvrez mes projets, compétences et contactez-moi pour plus d'informations." />
        <meta name="keywords" content="développeur web, Thevaraj Theivathan, portfolio, Développeur fullstack, Web, nextjs, Theivathan, Thevaraj, Master 1, typescript, javascript, PHP, HTML, Argenteuil" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Partage sur réseaux sociaux */}
        <meta property="og:title" content="Portfolio de Thevaraj Theivathan, Développeur Web" />
        <meta property="og:description" content="Découvrez les projets, compétences et expériences de Thevaraj Theivathan, Développeur fullstack." />
        <meta property="og:image" content="https://cdn.sanity.io/images/m271f9jj/production/f9de20eb434da08ad27c92065dcdc66e5f20f80e-3024x4032.jpg" />
        <meta property="og:url" content="https://theivathan.fr" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio de Thevaraj Theivathan, Développeur Web" />
        <meta name="twitter:description" content="Découvrez les projets, compétences et expériences de Thevaraj Theivathan, Développeur fullstack." />
        <meta name="twitter:image" content="https://cdn.sanity.io/images/m271f9jj/production/f9de20eb434da08ad27c92065dcdc66e5f20f80e-3024x4032.jpg" />
      </Head>

      <Header socials={socials} />

      <section id="hero" className="snap-start">
        <Hero />
      </section>

      <section id="about" className="snap-start ">
        <About />
      </section>

      <section id="experience" className="snap-start snap-y snap-mandatory">
        <ExperienceContainer experiences={experiences} />
      </section>

      <section id="skills" className="snap-start">
        <Skills skills={skills} />
      </section>

      <section id="formation" className="snap-start">
        <Formation />
      </section>

      <section id="contact" className="snap-start">
        <Contact onSubmit={handleSubmit} />
      </section>

      <SmoothLink href={"#hero"}>
        <footer className="sticky bottom-[0.7rem] w-full cursor-pointer">
          <div className="flex items-center justify-end fixed top-[93%] right-[14px]">
            <img
              className="h-10 w-10 rounded-full filter grayscale hover:grayscale-0 cursor-pointer"
              src="https://www.brochureguru.com/images/go-to-top-side.png"
              alt=""
            />
          </div>
        </footer>
      </SmoothLink>
      <Analytics />
    </div>
  );
};

export default Home;
export async function getStaticProps() {
  try {
    const pageInfo: PageInfo = await fetchPageInfo();
    const experiences: Experience[] = await fetchExperience();
    const skills: Skill[] = await fetchSkills();
    const socials: Social[] = await fetchSocial();
    return {
      props: {
        pageInfo,
        experiences,
        skills,
        socials,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        pageInfo: null,
        experiences: [],
        skills: [],
        socials: [],
      },
    };
  }
}
