import React from "react";
import SkillElement from "./SkillElement";
import { motion } from "framer-motion";
import { Skill } from "@/typings";

type Props = {
  skills: Skill[];
};

function Skills({ skills }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col space-x-0 items-center justify-center text-center overflow-hidden relative xl:flex-row m-w-[2000px] xl:px-10 xl:space-y-0"
    >
      <h3 className="absolute top-[4rem] uppercase tracking-[7px] text-gray-500 text-2xl md:text-4xl w-full">
        Compétences
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-6 sm:grid-cols-4 gap-5 mt-[2rem]">
        {skills?.slice(0, skills.length / 2).map((skill) => (
          <SkillElement key={skill._id} skill={skill} directionLeft />
        ))}

        {skills?.slice(skills.length / 2, skills.length).map((skill) => (
          <SkillElement key={skill._id} skill={skill} />
        ))}
      </div>
    </div>
  );
}

export default Skills;
