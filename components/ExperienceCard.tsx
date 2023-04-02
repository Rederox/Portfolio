import React from "react";
import Image from "next/image";
import fablab from "../public/Fab_Lab.png";
import { motion } from "framer-motion";

type Props = {};

function ExperienceCard({}: Props) {
  return (
    <motion.article
      className="flex flex-col rounded-lg items-center  bg-[#1b577734] h-[35rem] md:h-[50rem]"
      // whileHover={{ scale: 1.05 }}
      // transition={{ duration: 0.3 }}
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
      >
        <Image
          src={fablab}
          alt="Experience"
          className="w-[80px] h-[95px] xl:w-[150px] xl:h-[180px] object-cover rounded-lg shadow-md"
        />
      </motion.div>

      <div className="px-0 md:px-10">
        <h2 className="text-4xl font-semibold">Fablab</h2>
        <p className="font-bold text-2xl mt-1 text-blue-600">Argenteuil</p>
        <div className="flex space-x-2 my-2">
          <Image
            src={
              "https://logos-marques.com/wp-content/uploads/2021/03/JavaScript-Logo.png"
            }
            alt="Programming language"
            width={300}
            height={300}
            className="h-10 w-10 rounded-full object-cover shadow-sm"
          />
          <Image
            src={
              "https://logos-marques.com/wp-content/uploads/2021/03/JavaScript-Logo.png"
            }
            alt="Programming language"
            width={300}
            height={300}
            className="h-10 w-10 rounded-full object-cover shadow-sm"
          />
          <Image
            src={
              "https://logos-marques.com/wp-content/uploads/2021/03/JavaScript-Logo.png"
            }
            alt="Programming language"
            width={300}
            height={300}
            className="h-10 w-10 rounded-full object-cover shadow-sm"
          />
        </div>
        <p className="uppercase py-5 space-y-4 ml-5 text-lg font-medium">
          Debut .....
        </p>
        <ul className="list-disc space-y-4 ml-5 text-lg">
          <li>Lorem ipsum</li>
          <li>Lorem ipsum</li>
          <li>Lorem ipsum</li>
          <li>Lorem ipsum</li>
          <li>Lorem ipsum</li>
        </ul>
      </div>
    </motion.article>
  );
}

export default ExperienceCard;
