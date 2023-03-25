import React from "react";

type Props = {};

function BackgroundAnimation({}: Props) {
  return (
    <div className="relative flex justify-center items-center">
      <div className="asbsolute border border-[#333333] rounded-full h-[200px] w-[200px] mt-52 animate-ping" />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}

export default BackgroundAnimation;
