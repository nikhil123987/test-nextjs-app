import React, { useRef } from "react";

import graduationModel from "../../../../assets/Pages/Home/images/graduationModel.webp";
import location991 from "../../../../assets/Pages/Home/images/location99(1).webp";
import location992 from "../../../../assets/Pages/Home/images/location99(2).webp";
import location993 from "../../../../assets/Pages/Home/images/location99(3).webp";
import location994 from "../../../../assets/Pages/Home/images/location99(4).webp";
import location995 from "../../../../assets/Pages/Home/images/location99(5).webp";
import Carousel from "react-elastic-carousel";
import { useRouter } from "next/router";
import useScreenWidth from "../../../hooks/useScreenWidth";

export default function InstituteDisplayCard() {
  const items = [
    { id: 1, img: location991 },
    { id: 2, img: location992 },
    { id: 3, img: location993 },
    { id: 4, img: location994 },
    { id: 5, img: location995 },
  ];
  const carouselRef = useRef(null); // declare at state level
  let resetTimeout;

  const router = useRouter();
  const { screenWidth } = useScreenWidth();
  return (
    <div className=" mr-3  rounded-xl w-full    h-[350px]">
      <Carousel
        ref={carouselRef}
        enableMouseSwipe={true}
        showArrows={false}
        itemsToShow={1}
        className=""
        enableAutoPlay={true}
        onNextEnd={({ index }) => {
          console.log("index", items.length);
          if (index === items.length - 1) {
            clearTimeout(resetTimeout);
            resetTimeout = setTimeout(() => {
              carouselRef?.current?.goTo(0);
            }, 1000); // same time
          }
        }}
        pagination={screenWidth > 768 ? true : false}
        breakPoints={[
          { width: 1, itemsToShow: 1 },
          { width: 600, itemsToShow: 1 },
          { width: 900, itemsToShow: 1 },
        ]}
      >
        {items?.map((item, index) => (
          <img
            key={index}
            src={item.img.src}
            loading="lazy"
            className="w-[430px] md:h-[310px] h-[350px] rounded-xl"
            alt=""
          />
        ))}
      </Carousel>
    </div>
  );
}
