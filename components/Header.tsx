import React from "react";
import { SocialIcon } from "react-social-icons";
import { motion } from "framer-motion";
import SmoothLink from "./SmoothLink";
import { Social } from "@/typings";

type Props = {
  socials: Social[];
};

function Header({ socials }: Props) {
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
        {socials.map((social) => (
          <SocialIcon
            key={social._id}
            url={social.url}
            target="_blank"
            bgColor="transparent"
            fgColor="#fff"
          />
        ))}
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
          url={"#contact"}
          className="cursor-pointer "
          network="email"
          fgColor="#fff"
          bgColor="transparent"
        />
        <SmoothLink href="#contact">
          <p className="uppercase hidden md:inline-flex text-sm text-gray-100">
            Contactez moi
          </p>
        </SmoothLink>
      </motion.div>
    </header>
  );
}

export default Header;
