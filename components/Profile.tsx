/* eslint-disable react/no-unescaped-entities */
import React from "react";
import {
  MdEmail,
  MdLanguage,
  MdDriveEta,
  MdDirectionsCar,
} from "react-icons/md";
import { FaUser, FaBirthdayCake, FaRegThumbsUp, FaPhone } from "react-icons/fa";
import { SocialIcon } from "react-social-icons";
import Image from "next/image";
import MyPhoto from "../public/me.jpg";

type Interest = {
  emoji: string;
  text: string;
};

type Social = {
  network: string;
  url: string;
};

type ProfileProps = {
  firstName: string;
  lastName: string;
  age: number;
  languages: string[];
  socials: Social[];
  phone: string;
  gmail: string;
  drivingLicense: boolean;
  hasVehicle: boolean;
  interests: Interest[];
};

const Profile: React.FC<ProfileProps> = ({
  firstName,
  lastName,
  age,
  languages,
  socials,
  phone,
  gmail,
  drivingLicense,
  hasVehicle,
  interests,
}) => {
  return (
    <div className="bg-[#05092227] text-white shadow rounded-lg p-6 w-full max-w-xl mx-auto mt-[5rem] md:mt-0">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center mb-2 md:mb-0">
          {/* <FaUser className="mr-2" /> */}
          <Image
            src={MyPhoto}
            alt={"Profile Photo"}
            className="relative rounded-full mx-auto object-cover h-10 w-10 mr-2"
          />
          {`${firstName} ${lastName}`}
        </h1>
        <div className="bg-[#4801b32c] px-3 py-1 rounded-md text-sm">
          <FaBirthdayCake className="inline-block mr-1" />
          {age} ans
        </div>
      </div>
      <div className="md:grid  md:grid-cols-1 flex flex-col gap-2 md:mb-4">
        <div className="bg-[#0172b32c] p-3 rounded-md">
          <h4 className="text-sm font-bold mb-1">Coordonnées</h4>
          <div className="flex items-center space-x-2 justify-evenly">
            {socials.map((social, index) => (
              <SocialIcon
                key={index}
                network={social.network}
                url={social.url}
                bgColor="transparent"
                fgColor="#fff"
              />
            ))}
            <a href={`tel:${phone}`} className="flex items-center p-2">
              <FaPhone className="text-[1.3rem]" />
            </a>
            <a href={`mailto:${gmail}`} className="flex items-center p-2">
              <MdEmail className="text-[1.7rem]" />
            </a>
          </div>
        </div>
        <div className="bg-[#0172b32c] p-3 rounded-md">
          <h4 className="text-sm font-bold mb-1">Langues</h4>
          <div className="flex items-center flex-wrap">
            <MdLanguage className="mr-2 md:text-xl" />
            <div className="text-sm">{languages.join(", ")}</div>
          </div>
        </div>
        <div className="bg-[#0172b32c] p-3 rounded-md col-span-2 md:col-span-1">
          <h4 className="text-sm font-bold mb-1">Conduite</h4>
          <div className="flex items-center">
            <MdDirectionsCar className="mr-2 md:text-xl" />
            <div className="text-sm">
              {drivingLicense ? "Permis B" : "Pas de permis"}
              {hasVehicle ? " - Véhiculé" : " - Non véhiculé"}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 bg-[#0172b32c] p-3 rounded-md ">
        <h3 className="text-lg font-bold mb-2">Centres d'intérêt</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:whitespace-nowrap">
          {interests.map((interest, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-row md:flex-col"
            >
              <span role="img" aria-label={interest.text} className="mr-2">
                {interest.emoji}
              </span>
              {interest.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
