import React from "react";
import Image from "next/image";
import fablab from "../public/Fab_Lab.png";
import { motion } from "framer-motion";
import { Experience } from "@/typings";
import { urlFor } from "@/sanity";

type Props = {
  experience: Experience
};

function ExperienceCard({ experience }: Props) {
  console.log(experience)
  return (
    <motion.article
      className="flex flex-col rounded-lg items-center space-y-5 bg-[#1b577734] h-[35rem] md:h-[50rem]"
    >
      <motion.div
        initial={{
          y: -100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{ duration: 1.2 }}
        className="flex flex-col items-center"
      >
        <div className="bg-[#097cff3b] rounded-[8px] mt-8">
          <Image
            src={urlFor(experience?.companyImage).url()}
            alt={experience.jobTitle}
            className="w-[150px] h-[100px] xl:w-[150px] xl:h-[180px] object-contain rounded-lg shadow-md"
            width={80}
            height={0}
          />
        </div>
      </motion.div>

      <div className="px-0 md:px-10 w-full flex items-center flex-col justify-center">
        <h2 className="text-4xl font-semibold">{experience.company}</h2>
        <p className="font-bold text-[1rem] md:text-[2rem] mt-1 text-blue-600">{experience.jobTitle}</p>
        <div className="flex space-x-2 my-2 items-center justify-center flex-wrap">
          {experience.technologies?.map((tech) => (
            <Image
              key={tech._id}
              src={urlFor(tech?.image).url()}
              alt={tech.title}
              width={300}
              height={300}
              className="h-10 w-10 md:h-[4rem] md:w-[4rem] rounded-full object-contain shadow-sm"
            />
          ))}
        </div>
        <p className="uppercase py-5 space-y-4 ml-5 text-base md:text-lg font-medium">
          {experience.dateStarted} - {experience.isCurrentlyWorkingHere ? "Actuelle" : experience.dateEnded}
        </p>
        <hr className="mb-5 w-[80%]" />
        <ul className="list-none space-y-4 ml-5 text-base md:text-lg">
          {experience.points?.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export default ExperienceCard;
