import React from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import BackgroundAnimation from "./BackgroundAnimation";
import Image from "next/image";
// import MyPhoto from "../public/me.jpg";
import Link from "next/link";
import { animate, motion } from "framer-motion";
import SmoothLink from "./SmoothLink";
type Props = {};
import sanityLoader from "../utils/sanityLoader";


export default function Hero({}: Props) {
  const [text, count] = useTypewriter({
    words: [
      "Bonjour, je m'appelle Thevaraj Theivathan",
      "J'aime transformer mes idées en code.",
      "Tout problème à une solution",
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
          src={
            "https://cdn.sanity.io/images/m271f9jj/production/50dda87656332cc530c1ba12378d58bfd1b254bc-1440x1440.jpg"
          }
          loader={sanityLoader as any}
          alt={"Profile Photo"}
          width={400}
          height={400}
          className="relative rounded-full scale-125 mx-auto object-cover h-32 w-32 shadow-lg"
        />
      </div>
      <div className="z-20">
        <h2 className="text-sm uppercase text-gray-400 pb-2 tracking-[8px] font-custom mt-4">
          Developpeur FullStack
        </h2>
        <h1 className="text-2xl lg:text-3xl font-semibold px-10">
          <span className="font-handwriting mr-3">{text}</span>
          <Cursor cursorColor="#5f2e22" cursorStyle="🖋️" />
        </h1>
        <div className="pt-5">
          <SmoothLink href="#about">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hero-button border-[#3c00ff3e] text-[#ffffff90]"
            >
              A propos
            </motion.button>
          </SmoothLink>
          <SmoothLink href="#experience">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hero-button border-[#3c00ff3e] text-[#ffffff90]"
            >
              Expériences
            </motion.button>
          </SmoothLink>
          <SmoothLink href="#skills">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hero-button border-[#3c00ff3e] text-[#ffffff90]"
            >
              Compétences
            </motion.button>
          </SmoothLink>
          <SmoothLink href="#formation">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hero-button border-[#3c00ff3e] text-[#ffffff90]"
            >
              Formation
            </motion.button>
          </SmoothLink>
          <SmoothLink href="#contact">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hero-button border-[#3c00ff3e] text-[#ffffff90]"
            >
              Contact
            </motion.button>
          </SmoothLink>
        </div>
      </div>
    </motion.div>
  );
}
