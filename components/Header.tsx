import React from "react";
import { SocialIcon } from "react-social-icons";
import { motion } from "framer-motion";

type Props = {};

function Header({}: Props) {
  return (
    <header className="sticky top-0 p-5 flex items-start z-50 justify-between max-w-4xl mx-auto xl:items-center">
      <motion.div
        initial={{
          x: -500,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{ ease: "easeOut", duration: 1.5 }}
        className="flex flex-row items-center"
      >
        <SocialIcon
          url="https://github.com/Rederox"
          target="_blank"
          bgColor="transparent"
          fgColor="#fff"
        />
        <SocialIcon
          url="https://fr.linkedin.com/in/theivathan"
          target="_blank"
          bgColor="transparent"
          fgColor="#fff"
        />
      </motion.div>

      <motion.div
        initial={{
          x: 500,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{ ease: "easeOut", duration: 1.5 }}
        className="flex flex-row items-center"
      >
        <SocialIcon
          url="mailto:Theivathan14@gmail.com"
          className="cursor-pointer "
          network="email"
          fgColor="#fff"
          bgColor="transparent"
        />
        <p className="uppercase hidden md:inline-flex text-sm text-gray-100">
          Contactez moi
        </p>
      </motion.div>
    </header>
  );
}

export default Header;
