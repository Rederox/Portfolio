import React from "react";
import Image from "next/image";
import fablab from "../public/Fab_Lab.png";
import { motion } from "framer-motion";

type Props = {};

function ExperienceCard({}: Props) {
  return (
    <article
      className="flex flex-col rounded-lg  items-center space-y-7 flex-shrink-0 
    w-[330px] md:w-[600px] xl:w-[700px] snap-center mt-20 
    bg-[#292929] p-10 hover:opacity-100 opacity-40 cursor-pointer 
    transition-opacity duration-200 overflow-hidden"
    >
      <motion.div
        initial={{
          y: -100,
          opacity: 0,
        }}
        transition={{ duration: 1.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Image
          src={fablab}
          alt="Expererience"
          className="w-32 h-33  xl:w-[200px] xl:h-[200px] object-cover"
        />
      </motion.div>

      <div className="px-0 md:px-10">
        <h2 className="text-4xl font-light">Fablab</h2>
        <p className="font-bold text-2xl mt-1">Argenteuil</p>
        <div className="flex space-x-2 my-2">
          <Image
            src={
              "https://logos-marques.com/wp-content/uploads/2021/03/JavaScript-Logo.png"
            }
            alt="Language de programtion"
            width={300}
            height={300}
            className="h-10 w-10 rounded-full object-cover"
          />
          <Image
            src={
              "https://logos-marques.com/wp-content/uploads/2021/03/JavaScript-Logo.png"
            }
            alt="Language de programtion"
            width={300}
            height={300}
            className="h-10 w-10 rounded-full object-cover"
          />
          <Image
            src={
              "https://logos-marques.com/wp-content/uploads/2021/03/JavaScript-Logo.png"
            }
            alt="Language de programtion"
            width={300}
            height={300}
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
        <p className="uppercase py-5 space-y-4 ml-5 text-lg">debut .....</p>
        <ul className="list-disc space-y-4 ml-5 text-lg">
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo ullam
            exercitationem sit.
          </li>
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo ullam
            exercitationem sit.
          </li>
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo ullam
            exercitationem sit.
          </li>
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo ullam
            exercitationem sit.
          </li>
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo ullam
            exercitationem sit.
          </li>
        </ul>
      </div>
    </article>
  );
}

export default ExperienceCard;
