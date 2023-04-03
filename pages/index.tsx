/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-head-element */
import type { GetStaticProps } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import ExperienceContainer from "@/components/ExperienceContainer";
import Skills from "@/components/Skills";
import Formation from "@/components/Formation";
import Contact from "@/components/Contact";
import Link from "next/link";
import SmoothLink from "@/components/SmoothLink";
import { Experience, PageInfo, Skill, Social } from "@/typings";
import { fetchPageInfo } from "@/utils/fetchPageInfo";
import { fetchExperience } from "@/utils/fetchExperience";
import { fetchSkills } from "@/utils/fetchSkills";
import { fetchSocial } from "@/utils/fetchSocials";
import { Props } from "next/script";

type props = {
  pageInfo: PageInfo;
  experiences: Experience[];
  skills: Skill[];
  socials: Social[];
};

const Home = ({ pageInfo, experiences, skills, socials }: props) => {
  const handleSubmit = (name: string, email: string, message: string) => {
    console.log("Formulaire soumis:", { name, email, message });
    // Gérer l'envoi du formulaire, par exemple en l'envoyant à une API ou en l'enregistrant dans une base de données
  };
  return (
    <div className="bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-emerald-900 to-slate-900 text-white h-screen snap-y snap-mandatory overflow-scroll z-0 overflow-x-hidden">
      <Head>
        <title>Theivathan's Portfolio</title>
      </Head>

      <Header socials={socials} />

      <section id="hero" className="snap-start">
        <Hero />
      </section>

      <section id="about" className="snap-start ">
        <About />
      </section>

      <section id="experience" className="snap-start">
        <ExperienceContainer />
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
        <footer className="sticky bottom-[3.7rem] w-full cursor-pointer">
          <div className="flex items-center justify-end">
            <img
              className="h-10 w-10 rounded-full filter grayscale hover:grayscale-0 cursor-pointer"
              src="https://www.brochureguru.com/images/go-to-top-side.png"
              alt=""
            />
          </div>
        </footer>
      </SmoothLink>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const pageInfo: PageInfo[] = await fetchPageInfo();
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
    revalidate: 10,
  };
};
