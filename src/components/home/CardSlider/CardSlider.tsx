"use client";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";
import "./CardSlider.scss";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

// import required modules
import { EffectCards } from "swiper/modules";
import Link from "next/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { IoIosArrowDroprightCircle as FaCircleArrowRight, IoIosArrowDropleftCircle as FaCircleArrowLeft} from "react-icons/io";

const artworks = [
  "https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/presale%2FdropPanel%2Fartist1.1.jpg?alt=media&token=537292cf-5ce3-43ee-b71d-846a5719e143",
  "https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/presale%2FdropPanel%2Fartist2.3.jpg?alt=media&token=d3456d6d-8a78-44fc-9437-6e1323218466",
  "https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/presale%2FdropPanel%2Fartist3.jpg?alt=media&token=22c7ad56-e335-4fd5-97a6-0d2b4ab84c45",
  "https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/presale%2FdropPanel%2Fartist4.jpg?alt=media&token=3fd1c5ba-06e6-448a-8f47-e0f840b9ac8b",
  "https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/presale%2FdropPanel%2Fartist5.jpg?alt=media&token=8a2195e3-4332-4b42-97a7-f75e9f841b37",
  "https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/presale%2FdropPanel%2Fartist6.jpg?alt=media&token=5b7312c8-463c-4b40-b806-293c6cdfa860",
];

const CardSlider = ({ viewMoreText }: { viewMoreText: string }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<any>(null);
  const leftDisabled: boolean = activeSlide <= 0;
  const rightDisabled: boolean = activeSlide >= artworks.length - 1;
  return (
    <Swiper
      ref={swiperRef}
      effect={"cards"}
      grabCursor={true}
      modules={[EffectCards]}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      onSlideChange={(swiper) =>
        setActiveSlide(
          swiper.isEnd ? artworks.length : swiperRef.current.activeIndex
        )
      }
    >
      {artworks.map((artwork) => (
        <SwiperSlide
          key={artwork}
          style={{
            backgroundImage: `url(${artwork})`,
          }}
        >
          <Link href="/presale#dropPanel" className="slide-button-view">
            {viewMoreText}
          </Link>
        </SwiperSlide>
      ))}
      <div className="slider-arrows">
        <FaCircleArrowLeft
          className="slider-arrow slider-arrow--left"
          onClick={() => swiperRef.current.slidePrev()}
        />
        <FaCircleArrowRight
          className="slider-arrow slider-arrow--right"
          onClick={() => swiperRef.current.slideNext()}
        />
      </div>
    </Swiper>
  );
};

export default CardSlider;
