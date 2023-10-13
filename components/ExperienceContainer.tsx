import React from "react";
import { motion } from "framer-motion";
import ExperienceCard from "./ExperienceCard";

import { Swiper, SwiperSlide } from "swiper/react";

import {  Swiper as SwiperEvent } from "swiper";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { EffectCoverflow, Pagination, Navigation } from "swiper";
import { Experience } from "@/typings";
type Props = {
  experiences: Experience[],
};

function ExperienceContainer({ experiences }: Props) {
  const allowScroll = (swiper: SwiperEvent) => {
    var activeIndex = swiper.activeIndex;
    var activeSlide = swiper.slides[activeIndex];
    var { scrollHeight, clientHeight } = activeSlide;
    const diff = scrollHeight - clientHeight;
    if (activeSlide.scrollTop === 0) activeSlide.scrollTop = 1;
    else if (activeSlide.scrollTop === diff) activeSlide.scrollTop = diff - 1;
    if (diff > 0) {
      const findScroll = (e :any) => {
        const scrollUp = e.deltaY < 0;
        if (
          (scrollUp || e.type === "touchmove") &&
          activeSlide.scrollTop <= 0
        ) {
          swiper.mousewheel.enable();
          swiper.allowTouchMove = true;
          activeSlide.removeEventListener("wheel", findScroll);
          activeSlide.removeEventListener("touchmove", findScroll);
        } else if (
          (!scrollUp || e.type === "touchmove") &&
          activeSlide.scrollTop >= diff
        ) {
          swiper.mousewheel.enable();
          swiper.allowTouchMove = true;
          activeSlide.removeEventListener("wheel", findScroll);
          activeSlide.removeEventListener("touchmove", findScroll);
        }
      };
      activeSlide.addEventListener("wheel", findScroll);
      activeSlide.addEventListener("touchmove", findScroll);
      swiper.mousewheel.disable();
      swiper.allowTouchMove = false;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 3.5 }}
      className="flex flex-col relative min-h-screen
      text-center  md:flex-row  px-3 md:px-10 mx-auto items-center overflow-hidden justify-center "
    >
      <h3 className="absolute top-[4rem] uppercase tracking-[7px] text-gray-500 text-2xl md:text-4xl w-full px-6">
        Expériences
      </h3>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        // loop={true}
        slidesPerView={3}
        spaceBetween={100}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 50,
          modifier: 2.5,
        }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 80,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 80,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 80,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 80,
          },
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container w-full flex mt-10 sm:mt-20"
      >
        {experiences.map((experience) => (
          <SwiperSlide key={experience._id}>
            <ExperienceCard key={experience._id} experience={experience} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="slider-controler ">
        <div className="swiper-button-prev slider-arrow text-xl"></div>
        <div className="swiper-button-next slider-arrow text-xl"></div>
        <div className="swiper-pagination pb-[4rem] pl-[15px]"></div>
      </div>
    </motion.div>
  );
}

export default ExperienceContainer;
