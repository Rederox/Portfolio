import React from "react";
import { motion } from "framer-motion";

type Props = {
  directionLeft?: boolean;
};

function Skill({ directionLeft }: Props) {
  return (
    <div className="group relative flex cursor-pointer">
      <motion.img
        initial={{
          x: directionLeft ? -200 : 200,
          opacity: 0,
        }}
        transition={{ duration: 1 }}
        animate={{ opacity: 1, x: 0 }}
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmTFBgBZxS4XgsWoTleevOwISBPh1CMrZASH3nZse99JmleYctDd7oaMJDIZAl3DET8Wo&usqp=CAU"
        className="rounded-full border border-[#00ff513c] object-cover w-20 h-20 md:w-28 md:h-28 xl:w-32 xl:h-32 filter group-hover:grayscale transition duration-300 ease-in-out"
      />
      <div className="absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-white h-20 w-20 md:h-28 md:w-28 xl:h-32 xl:w-32 rounded-full z-0">
        <div className="flex items-center justify-center h-full">
          <p className="text-3xl font-bold text-black">100%</p>
        </div>
      </div>
    </div>
  );
}

export default Skill;
