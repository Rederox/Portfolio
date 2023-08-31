import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Experience } from "@/typings";
import { urlFor } from "@/sanity";
import sanityLoader, { createSanityLoader } from "../utils/sanityLoader";

type Props = {
  experience: Experience;
};

function ExperienceCard({ experience }: Props) {
  const mySanityLoader = createSanityLoader({ width: 400, quality: 90 });
  return (
    <motion.article className="flex flex-col rounded-lg items-center space-y-5 bg-[#001b5c1f] h-[50rem] shadow-lg">
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
        className="flex flex-col items-center mt-8"
      >
        <div className="bg-opacity-20 bg-white rounded-[8px] p-2">
          <Image
            loader={sanityLoader}
            src={urlFor(experience?.companyImage).url()}
            alt={experience.jobTitle}
            className="object-contain"
            width={150}
            height={100}
          />
        </div>
      </motion.div>

      <div className="px-4 md:px-10 w-full flex flex-col items-center justify-center py-5">
        <h2 className="text-2xl font-semibold text-emerald-100 mb-2">
          {experience.company}
        </h2>
        <p className="text-sm font-semibold text-emerald-300">
          {experience.jobTitle}
        </p>

        <div className="flex flex-wrap space-x-2 space-y-2 mt-4 items-center justify-center">
          {experience.technologies?.map((tech) => (
            <Image
              key={tech._id}
              loader={mySanityLoader}
              src={urlFor(tech?.image).url()}
              alt={tech.title}
              width={100}
              height={100}
              className="h-14 w-14 rounded-full object-contain shadow-lg"
            />
          ))}
        </div>

        {experience.dateStarted ? (
          <div className="mt-4">
            <p className="text-base font-medium text-emerald-300">
              {experience.dateStarted} -{" "}
              {experience.isCurrentlyWorkingHere
                ? "Actuelle"
                : experience.dateEnded}
            </p>
          </div>
        ) : null}

        <hr className="my-4 w-4/5 border-t-2 border-emerald-700" />

        <ul className="list-none text-emerald-200 text-base leading-relaxed">
          {experience.points?.map((point, index) => (
            <li key={index} className="mb-2">
              <span className="text-emerald-400 font-semibold">•</span> {point}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export default ExperienceCard;
