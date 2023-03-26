/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Image from "next/image";
import MyPhotoAbout from "../public/about.jpg";
import { motion } from "framer-motion";

type Props = {};
const bio = `
👋 Salut tout le monde ! Bienvenue sur mon profil ! 

👨‍💻 Je suis un développeur passionné, spécialisé dans le développement Full Stack. Je maîtrise plusieurs langages de programmation, notamment HTML/CSS, JavaScript/Typescript/PHP/SQL, C/C++, et bien d'autres. 

🤖 J'aime travailler avec de nouvelles technologies et explorer de nouveaux langages deprogrammation pour améliorer mes compétences. Je suis également un grand fan des dernières tendances en matière de développement et d'automatisation. 

🌐 En dehors de mon travail de développement, j'aime également explorer le monde en ligne et découvrir de nouvelles idées et de nouveaux projets intéressants. 

🚀 Je suis une personne motivée et déterminée, toujours prête à relever de nouveaux défis. J'aime travailler en équipe, mais je suis également capable de travailler de manière autonome et de prendre des décisions éclairées. 

💼Actuellement à la recherche d'une opportunité professionnelle passionnante en tant que développeur Full Stack, je suis ouvert à toutes les propositions et les projets stimulants. 

🙏 Merci d'avoir pris le temps de lire mon "A propos" et j'espère avoir l'occasion de travailler avec vous bientôt !
`;

function About({}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col md:flex-row max-w-7xl px-4 md:px-10
justify-evenly mx-auto items-center"
    >
      <h3 className="mt-10 uppercase tracking-wider text-gray-500 text-2xl md:text-4xl w-full text-center">
        A propos
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
        className="mt-10 md:mt-0 flex-shrink-0 w-56 h-56 md:w-64 md:h-95 xl:w-[500px] xl:h-[500px] mx-auto md:mx-0"
      >
        <Image
          src={MyPhotoAbout}
          alt={"A propos"}
          className="w-full h-full rounded-full object-cover md:rounded-lg"
        />
      </motion.div>
      <div className="mt-10 md:mt-0 space-y-10 md:pl-10 text-center md:text-left">
        <h4 className="text-4xl font-semibold">
          A propos de{" "}
          <span className="underline decoration-[#F7ABOA]/50">moi</span>{" "}
        </h4>
        <p className="text-base whitespace-pre-line">{bio}</p>
      </div>
    </motion.div>
  );
}

export default About;
