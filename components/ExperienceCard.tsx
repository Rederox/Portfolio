import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Experience } from "@/typings";
import { urlFor } from "@/sanity";
import sanityLoader, { createSanityLoader } from "../utils/sanityLoader";

import moment from 'moment';
import 'moment/locale/fr';

type Props = {
  experience: Experience;
};


function ExperienceCard({ experience }: Props) {
  const mySanityLoader = createSanityLoader({ width: 400, quality: 90 });

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <motion.article className="flex flex-col rounded-xl items-center space-y-3 bg-[#001b5c1f] h-[70vh] shadow-lg p-5">
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
        className="flex flex-col items-center justify-center w-full mt-5 sm:mt-20"
      >
        <div className="bg-opacity-20 bg-white rounded-[8px] py-4 flex flex-col items-center justify-center w-[90%] h-[5rem] sm:h-[7rem]">
          <Image
            loader={sanityLoader}
            src={urlFor(experience?.companyImage).url()}
            alt={experience.jobTitle}
            className="object-contain w-full h-[85%]"
            width={150}
            height={100}
          />
          <h2 className="text-2xl font-semibold text-emerald-100 mb-1">
            {experience.company}
          </h2>
        </div>


      </motion.div>

      <div className="w-[90%] flex flex-col items-center justify-center py-5 bg-opacity-20 bg-white rounded-[8px]">
        <p className="text-xl font-medium text-emerald-300">
          {experience.jobTitle}
        </p>

        {experience.dateStarted ? (
            <div>
              <p className="text-xs font-semibold text-emerald-300">
              {capitalizeFirstLetter(moment(experience.dateStarted).format('MMMM YYYY'))} - {" "}
              {experience.isCurrentlyWorkingHere
                ? "Actuelle"
                : capitalizeFirstLetter(moment(experience.dateEnded).format('MMMM YYYY'))
              }
              </p>
            </div>
          ) : null
        }

        <div className="flex flex-wrap space-x-2 space-y-2 mt-4 items-center justify-center">
          {experience.technologies?.map((tech) => (
            <Image
              key={tech._id}
              loader={mySanityLoader}
              src={urlFor(tech?.image).url()}
              alt={tech.title}
              width={100}
              height={100}
              className="h-8 w-8 sm:h-14 sm:w-14 rounded-full object-contain shadow-lg"
            />
          ))}
        </div>

      </div>
      <hr className="my-2 w-[80%] border-t-2 border-emerald-700" />
      <ul className="list-none w-[90%] text-emerald-200 text-base leading-relaxed overscroll-none overflow-y-auto py-5 bg-opacity-20 bg-white rounded-[8px] m-5 min-h-[30%]">
        {experience.points?.map((point, index) => (
          <li key={index} className="mb-2 text-left pl-5">
            <span className="text-emerald-400 font-semibold">👉</span> {point}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export default ExperienceCard;
