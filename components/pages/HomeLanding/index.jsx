import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserLocation } from "../../../redux/slices/UserAnalytics";
import dynamic from "next/dynamic";
import { setLocationQuery } from "../../../redux/slices/SearchSlice";
import { authSelector } from "../../../redux/slices/authSlice";

const Header = dynamic(
  () => {
    return import("./Header");
  },
  { ssr: false }
);
const Navbar = dynamic(
  () => {
    return import("./Header/Navbar");
  },
  { ssr: false }
);
const Footer = dynamic(
  () => {
    return import("../../layout/Footer");
  },
  { ssr: false }
);
const InstituteSection = dynamic(
  () => {
    return import("./InstituteSection");
  },
  { ssr: false }
);
const OstelloOffers = dynamic(
  () => {
    return import("./OstelloOffers");
  },
  { ssr: false }
);

const OstelloExplore = dynamic(
  () => {
    return import("./OstelloExpore");
  },
  { ssr: false }
);

const OstelloFAQ = dynamic(
  () => {
    return import("./OstelloFAQ");
  },
  { ssr: false }
);

export default function HomeLanding() {
  const description = "Ostello ";
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(authSelector);
  useEffect(() => {
    navigator.geolocation &&
      navigator.geolocation.getCurrentPosition(function (position) {
        dispatch(
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        );
      });
  });

  useEffect(() => {
    dispatch(setLocationQuery(""));
  });

  return (
    <main className="md:max-w-[1350px] mx-auto ">
      <div className="">
        <Navbar />
      </div>
      <Header />
      <OstelloOffers />
      <InstituteSection />
      <OstelloExplore
        header={"Explore the world of Ostello with us"}
        description={description}
        usingFor={"mainLanding"}
      />
      <OstelloFAQ usingFor={"userLanding"} />
      <Footer />
    </main>
  );
}
