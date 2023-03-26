/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-head-element */
import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "@/components/Experience";

const Home: NextPage = () => {
  return (
    <div className="bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-emerald-900 to-slate-900 text-white h-screen snap-y snap-proximity overflow-scroll z-0">
      <Head>
        <title>Theivathan's Portfolio</title>
      </Head>

      <Header />

      <section id="hero" className="snap-start">
        <Hero />
      </section>

      <section id="about" className="snap-start">
        <About />
      </section>

      <section id="experience" className="snap-start">
        <Experience />
      </section>

      {/* Experiences */}

      {/* Skills */}

      {/* Projects */}

      {/* Contact me */}
    </div>
  );
};

export default Home;
