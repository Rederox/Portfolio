import React from "react";
import { motion } from "framer-motion";
import { Skill } from "@/typings";
import { urlFor } from "@/sanity";
import sanityLoader from "@/utils/sanityLoader";
import Image from "next/image";

type Props = {
  directionLeft?: boolean;
  skill: Skill;
};

function SkillElement({ directionLeft, skill }: Props) {
  return (
    <div className="group relative flex cursor-pointer">
      <motion.div
        initial={{
          x: directionLeft ? -200 : 200,
            opacity: 0,
          }}
          transition={{ duration: 1 }}
          animate={{ opacity: 1, x: 0 }}
      >
          <Image
            loader={sanityLoader}
            src={urlFor(skill?.image).url()}
            className="rounded-full border border-[#00ff513c] object-contain p-0 w-[4rem] h-[4rem] sm:w-20 sm:h-20 md:w-28 md:h-28 xl:w-32 xl:h-32 filter group-hover:grayscale transition duration-300 ease-in-out"
            width={200}
            height={200} alt={""} 
          />
      </motion.div>
      <div className="absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-white h-20 w-20 md:h-28 md:w-28 xl:h-32 xl:w-32 rounded-full z-0 select-none">
        <div className="flex items-center flex-col justify-center h-full">
          <p className="text-sm font-bold text-black">{skill.title}</p>
          <p className="text-3xl font-bold text-black">{skill.progress}%</p>
        </div>
      </div>
    </div>
  );
}

export default SkillElement;
