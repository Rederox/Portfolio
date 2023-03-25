/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-head-element */
import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Hero from "@/components/Hero";

const Home: NextPage = () => {
  return (
    <div className="overflow-x-hidden bg-slate-900 text-white">
      <Head>
        <title>Theivathan's Portfolio</title>
      </Head>

      <Header />

      <section id="hero">
        <Hero />
      </section>
      {/* Hero */}

      {/* About */}

      {/* Experiences */}

      {/* Skills */}

      {/* Projects */}

      {/* Contact me */}
    </div>
  );
};

export default Home;
