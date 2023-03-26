import React from "react";
import { motion } from "framer-motion";
import ExperienceCard from "./ExperienceCard";

type Props = {};

function Experience({}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col relative min-h-screen
        text-center md:text-left md:flex-row max-w-full px-4 md:px-10
        justify-evenly mx-auto items-center overflow-hidden "
    >
      <h3 className="absolute top-20 uppercase tracking-[7px] text-gray-500 text-2xl md:text-4xl w-full">
        Expériences
      </h3>

      <div className="w-full flex space-x-5 overflow-x-scroll p-10 snap-x snap-mandatory">
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </div>
    </motion.div>
  );
}

export default Experience;
