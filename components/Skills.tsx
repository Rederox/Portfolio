import React from "react";
import Skill from "./Skill";
import { motion } from "framer-motion";

type Props = {};

function Skills({}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen flex flex-col space-x-0 items-center justify-center text-center overflow-hidden relative xl:flex-row m-w-[2000px] xl:px-10 xl:space-y-0"
    >
      <h3 className="absolute top-[4rem] uppercase tracking-[7px] text-gray-500 text-2xl md:text-4xl w-full">
        Compétences
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-5 mt-[2rem]">
        <Skill directionLeft />
        <Skill directionLeft />
        <Skill directionLeft />
        <Skill directionLeft />
        <Skill directionLeft />
        <Skill directionLeft />
        <Skill directionLeft />
        <Skill directionLeft />
        <Skill />
        <Skill />
        <Skill />
        <Skill />
        <Skill />
        <Skill />
      </div>
    </motion.div>
  );
}

export default Skills;
