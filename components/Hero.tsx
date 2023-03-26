import React from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import BackgroundAnimation from "./BackgroundAnimation";
import Image from "next/image";
import MyPhoto from "../public/me.jpg";
import Link from "next/link";
import { animate, motion } from "framer-motion";
type Props = {};

export default function Hero({}: Props) {
  const [text, count] = useTypewriter({
    words: [
      "Bonjour, je m'appelle Thevaraj Theivathan",
      "J'aime transformer mes idées en code.",
      "Toute probléme à une solution",
    ],
    loop: true,
    delaySpeed: 2000,
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 3,
      }}
      className="h-screen flex flex-col space-x-0 items-center justify-center text-center overflow-hidden"
    >
      <BackgroundAnimation />
      <div className="h-32 w-32 ">
        <Image
          src={MyPhoto}
          alt={"Profile Photo"}
          className="relative rounded-full mx-auto object-cover h-32 w-32 "
        />
      </div>
      <div className="z-20">
        <h2 className="text-sm uppercase text-gray-400 pb-2 tracking-[8px] font-medium mt-4">
          Developpeur FullStack
        </h2>
        <h1 className="text-2xl lg:text-3xl font-semibold px-10">
          <span className="font-handwriting mr-3">{text}</span>
          <Cursor cursorColor="#5f2e22" cursorStyle="🖋️" />
        </h1>
        <div className="pt-5">
          <Link href="#about">
            <button className="hero-button">A propos</button>
          </Link>
          <Link href="#experience">
            <button className="hero-button">Expériences</button>
          </Link>
          <Link href="#skills">
            <button className="hero-button">Compétences</button>
          </Link>
          <Link href="#projects">
            <button className="hero-button">Projets</button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
