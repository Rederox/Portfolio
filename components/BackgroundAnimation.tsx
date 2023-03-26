import React from "react";
import { motion } from "framer-motion";

type Props = {};

function BackgroundAnimation({}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
        scale: {
          type: "spring",
          damping: 5,
          stiffness: 100,
          restDelta: 0.001,
        },
      }}
      className="relative flex justify-center items-center"
    >
      <div className="absolute border border-[#0f182a] rounded-full h-[200px] w-[200px] mt-52 animate-ping" />
      <div className="absolute border border-[#0f182a] rounded-full opacity-20 h-[300px] w-[300px] mt-52 " />
      <div className="absolute border border-[#0f182a] rounded-full opacity-20 h-[500px] w-[500px] mt-52 " />
      <div className="absolute border rounded-full border-[#0f182a] opacity-20 h-[650px] w-[650px] mt-52 animate-pulse" />
      <div className="absolute border border-[#0f182a] rounded-full opacity-20 h-[800px] w-[800px] mt-52 " />
    </motion.div>
  );
}

export default BackgroundAnimation;
