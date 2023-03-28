/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Image from "next/image";
import MyPhotoAbout from "../public/about.jpg";
import { motion } from "framer-motion";
import Profile from "./Profile";

type Props = {};
const bio = `
👋 Salut tout le monde ! Bienvenue sur mon profil ! 

👨‍💻 Je suis un développeur Full Stack. Je maîtrise plusieurs langages de programmation, notamment HTML/CSS, JavaScript/Typescript/PHP/SQL, C/C++, et bien d'autres. 

🤖 J'aime travailler avec de nouvelles technologies et explorer de nouveaux langages deprogrammation pour améliorer mes compétences. Je suis également un grand fan des dernières tendances en matière de développement et d'automatisation. 

🚀 Je suis une personne motivée et déterminée, toujours prête à relever de nouveaux défis. J'aime travailler en équipe, mais je suis également capable de travailler de manière autonome et de prendre des décisions éclairées. 
`;

function About({}: Props) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="flex flex-col relative min-h-screen
    text-center md:text-left md:flex-row max-w-5xl px-3 md:px-10 mx-auto items-center overflow-hidden snap-start"
      >
        <h3 className="absolute top-20 uppercase tracking-wider text-gray-500 text-xl md:text-3xl w-full">
          À propos
        </h3>

        <motion.div
          initial={{
            x: -200,
            opacity: 0,
          }}
          transition={{
            duration: 1.2,
          }}
          whileInView={{
            x: 0,
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          className="w-[12rem] h-[10rem] md:w-64 md:h-95 xl:w-[500px] xl:h-[500px] mt-[7rem] flex items-center justify-center"
        >
          <Image
            src={MyPhotoAbout}
            alt={"A propos"}
            className="w-full h-full rounded-full object-cover md:rounded-lg shadow-lg"
          />
        </motion.div>
        <div className="md:pl-10 mt-0 md:mt-32">
          <h4 className="text-xl md:text-2xl font-semibold text-gray-400  mt-2">
            Qui{" "}
            <span className="bg-[#3cff1180] text-white rounded px-1">
              suis-Je
            </span>{" "}
          </h4>
          <p className="text-sm md:text-base whitespace-pre-line text-gray-400  md:w-[500px]">
            {bio}
          </p>
        </div>
      </motion.div>
      <div
        className="flex flex-col relative min-h-screen
      text-center md:text-left md:flex-row max-w-full px-3 md:px-10 mx-auto items-center overflow-hidden snap-center"
      >
        <Profile
          firstName="Thevaraj"
          lastName="Theivathan"
          age={21}
          languages={["Français", "Anglais", "Tamoul"]}
          socials={[
            {
              network: "github",
              url: "https://github.com/Rederox",
            },
            {
              network: "linkedin",
              url: "https://www.linkedin.com/in/theivathan/",
            },
            {
              network: "instagram",
              url: "https://www.instagram.com/theivathan14/",
            },
          ]}
          phone="+33784968840"
          gmail="theivathan14@gmail.com"
          drivingLicense={true}
          hasVehicle={true}
          interests={[
            { emoji: "💻", text: "Nouvelles Technologie" },
            { emoji: "🎮", text: "Jeux vidéo" },
            { emoji: "📚", text: "Mangas/Webtoon" },
            { emoji: "💪", text: "Musculation" },
            { emoji: "🖥️", text: "Montage d'ordinateurs" },
          ]}
        />
      </div>
    </div>
  );
}

export default About;
