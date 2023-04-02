import { motion } from "framer-motion";
import React from "react";

type Props = {};

function Formation({}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="h-screen flex flex-col items-center justify-center text-center mx-auto max-w-full overflow-hidden relative z-0"
    >
      <h3 className="absolute top-[4rem] uppercase tracking-[7px] text-gray-500 text-2xl md:text-4xl w-full">
        Formation
      </h3>

      <div> Education</div>
    </motion.div>
  );
}

export default Formation;
