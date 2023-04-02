/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-head-element */
import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Formation from "@/components/Formation";
import Contact from "@/components/Contact";
import Link from "next/link";
import SmoothLink from "@/components/SmoothLink";

const Home: NextPage = () => {
  const handleSubmit = (name: string, email: string, message: string) => {
    console.log("Formulaire soumis:", { name, email, message });
    // Gérer l'envoi du formulaire, par exemple en l'envoyant à une API ou en l'enregistrant dans une base de données
  };
  return (
    <div className="bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-emerald-900 to-slate-900 text-white h-screen snap-y snap-mandatory overflow-scroll z-0 overflow-x-hidden">
      <Head>
        <title>Theivathan's Portfolio</title>
      </Head>

      <Header />

      <section id="hero" className="snap-start">
        <Hero />
      </section>

      <section id="about" className="snap-start ">
        <About />
      </section>

      <section id="experience" className="snap-start">
        <Experience />
      </section>

      <section id="skills" className="snap-start">
        <Skills />
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
