import React from "react";
import Image from "next/image";
import fablab from "../public/Fab_Lab.png";
import { motion } from "framer-motion";

type Props = {};

function ExperienceCard({}: Props) {
  return (
    <article
      className="flex flex-col rounded-lg  items-center space-y-7 flex-shrink-0 
    w-[310px] md:w-[500px] xl:w-[600px] snap-center mt-20 
    bg-[#50c87846] p-10 hover:opacity-100 opacity-40 cursor-pointer 
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
          className="w-[80px] h-[95px]  xl:w-[150px] xl:h-[180px] object-cover"
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
          <li>Lorem ipsum</li>
          <li>Lorem ipsum</li>
          <li>Lorem ipsum</li>
          <li>Lorem ipsum</li>
          <li>Lorem ipsum</li>
        </ul>
      </div>
    </article>
  );
}

export default ExperienceCard;
