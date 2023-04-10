import { ClockCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdGpsFixed } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import usePlacesAutocomplete from "use-places-autocomplete";
import { authSelector } from "../../../../../../redux/slices/authSlice";
import { filterCourse, setLocationQuery } from "../../../../../../redux/slices/SearchSlice";
import { isEmpty } from "../../../../../../utils/utils";
import { titleToUrl } from "../../../../../utils";
import GeoLocation from "./GeoLocation";

const Location = ({ toggle, setToggle }) => {
  const [detect, setDetect] = useState(false);
  const [reload, setReload] = useState(false);
  const { userLocation, recentLocations } = useSelector(authSelector);
  const [location, setLocation] = useState("");
  const dispatch = useDispatch();
  const {
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    if (!isEmpty(userLocation)) {
      setDetect(false);
      const { formatted_address } = userLocation;
      setLocation(formatted_address);
    } else if (isEmpty(recentLocations)) {
      clearSuggestions();
    }
  }, [userLocation]);
  const Scroll = ({ style, children, className }) => {
    return (
      <div
        style={style}
        className={`${className} w-full absolute left-0 bg-white`}
      >
        {children}
      </div>
    );
  };
  return (
    <div
      style={{ boxShadow: "0px 2px 40px rgba(125, 35, 224, 0.15)" }}
      className="absolute w-full flex flex-col  justify-center px-5  bg-white z-50 rounded-xl  divide-y-[.5px] divide-light-slate space-y-2 py-5"
    >
      {detect && <GeoLocation {...{ reload }} />}

      <div className="flex items-start ">
        <div className="w-fit">
          <MdGpsFixed
            size={20}
            className="text-primary lg:text-xl text-lg mr-3 mt-1"
          />
        </div>
        <div
          className=" active:opacity-60 cursor-pointer"
          onClick={() => {
            setDetect(true);
            setReload(!reload);
          }}
        >
          {!isEmpty(userLocation) ? (
            <>
              <p className="text-primary font-dm-sans lg:text-lg">
                Current user location
              </p>
              <Link prefetch={false}
                onClick={() => {
                  dispatch(setLocationQuery(`${location.split(",")[1].toLowerCase()}`));
                }}
                href={`/search`}
                style={{ color: "#AFAFAF" }}
                className="lg:text-lg"
              >
                {location}
              </Link>
            </>
          ) : (
            <>
              <p className="text-primary font-dm-sans lg:text-xl">
                Detect current location
              </p>
              <p style={{ color: "#AFAFAF" }} className="lg:text-lg">
                Using GPS
              </p>
            </>
          )}
        </div>
      </div>

      <div>
        {toggle ? (
          recentLocations.length > 1 ? (
            <>
              <p className="lg:text-xl ml-5 mb-5 text-md text-gray">
                Nearby Locations
              </p>
              <Scroll
                style={{
                  boxShadow: "0px 4px 15px rgba(125, 35, 224, 0.2)",
                }}
                className="overflow-y-scroll z-10 max-h-[44vh] rounded-b-xl"
              >
                <div className="w-full divide-y-[.5px] space-y-2 divide-light-slate/10 font-medium text-gray bg-white">
                  {recentLocations?.map((item, idx) => (
                    <>
                      <div key={idx}>
                        {item?.description && (
                          <div
                            className="flex items-center space-x-2 ml-5 lg:text-sm lg:py-2 py-1 lg:ml-5 cursor-pointer"
                            onClick={() => {
                              dispatch(
                                setLocationQuery(
                                  item?.description.split(",")[0]
                                  ? item?.description.split(",")[0].toString()
                                  : item?.description.toString()
                                )
                              );
                              dispatch(filterCourse);
                            }}
                          >
                            <ClockCircleOutlined />
                            <Link prefetch={false}
                              href={`/search/locations/${titleToUrl(
                                item.description.split(",")[0]
                                  ? item?.description.split(",")[0]
                                  : item?.description
                              )}`}
                            >
                              {item?.description}
                            </Link>
                          </div>
                        )}
                      </div>
                    </>
                  ))}
                </div>
              </Scroll>
            </>
          ) : (
            <div className="flex items-center  space-x-5 lg:text-lg  lg:py-2 py-1 lg:ml-10 cursor-pointer">
              <ClockCircleOutlined />
              <p>No nearby location</p>
            </div>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Location;
