import React from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import BackgroundAnimation from "./BackgroundAnimation";
type Props = {};

export default function Hero({}: Props) {
  const [text, count] = useTypewriter({
    words: [
      "Bonjour, je suis un développeur full-stack ",
      "J'aime transformer mes idées en code.",
      "Toute probléme à une solution",
    ],
    loop: true,
    delaySpeed: 2000,
  });
  return (
    <div>
      <BackgroundAnimation />
      <h1>
        <span className="font-handwriting">{text}</span>
        <Cursor cursorColor="#5f2e22" cursorStyle="🖋️" />
      </h1>
    </div>
  );
}
