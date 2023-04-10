import React from "react";
import Arrow from "./Arrow";
import teamWorkModel from "../../../../assets/Pages/Home/images/teamWorkModel.webp";
import mentorImage from "../../../../assets/Pages/Home/images/mentorImage.webp";
import mentorImageMobile from "../../../../assets/Pages/Home/images/mentorImageMobile.webp";
import { useRouter } from "next/router";

export default function TwoColCard() {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push("/mentor");
      }}
      className="rounded-xl w-full lg:max-w-[690px] sm:h-auto h-[350px]"
    >
      <img
        loading="lazy"
        src={mentorImage.src}
        className="h-full w-full rounded-xl  lg:block hidden cursor-pointer"
        alt=""
      />
      <img
        loading="lazy"
        src={mentorImageMobile.src}
        className="h-full w-full rounded-xl  block lg:hidden cursor-pointer"
        alt=""
      />
    </div>
  );
}
