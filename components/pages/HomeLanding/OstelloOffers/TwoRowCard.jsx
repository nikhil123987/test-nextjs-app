import { useRouter } from "next/router";
import React from "react";
import coachingImage from "../../../../assets/Pages/Home/images/coaching.webp";
import coachingImageMobile from "../../../../assets/Pages/Home/images/coachingmobile.webp";
import Arrow from "./Arrow";
export default function TwoRowCard() {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push("/coaching-in-99");
      }}
      className="rounded-xl w-full lg:max-w-[370px]  sm:h-auto h-[350px]"
    >
      {/* pushing the codes */}
      {/* <div className='m-5 text-white absolute top-0'>
        <p className='text-[21px] md:text-[23px] font-bold'>
          10% discount on all courses. First come first serve basis. Avail it
          now oke.
        </p>
        <Arrow url={'/search/delhi'} />
      </div>
      <div className='flex justify-center  mt-5 '>
        <img
          src={collegeGirlModel.src}
          className='w-[400px] h-full hidden lg:block'
          alt='10% discount on all courses - Ostello'
        />
        <img
          src={collegeGirlModelMobile.src}
          className=' lg:hidden w-[250px]'
          alt='10% discount on all courses - Ostello'
        />
      </div> */}

      <img
        loading="lazy"
        src={coachingImage.src}
        className="h-full w-full rounded-xl lg:block hidden cursor-pointer"
        alt=""
      />
      <img
        loading="lazy"
        src={coachingImageMobile.src}
        className="h-full w-full rounded-xl lg:hidden block cursor-pointer"
        alt=""
      />
    </div>
  );
}
