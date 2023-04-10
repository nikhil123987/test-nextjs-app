import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import DashboardSidebar from "../../../../components/pages/Merchant/Dashboard/DashboardSidebar";
import ToggleDashboard from "../../../../components/pages/Merchant/Dashboard/ToggleDashboard";
import {
  authSelector,
  getInstituteDetails,
} from "../../../../redux/slices/authSlice";
import { isEmpty } from "../../../../utils/utils";
import { Box, Menu, MenuItem, Modal, TextField } from "@mui/material";
import { GiCancel } from "react-icons/gi";
import { TbChecks } from "react-icons/tb";
import { FaCrown, FaFilter, FaSortAmountUp } from "react-icons/fa";
import axios from "axios";
import { host } from "../../../../utils/constant";
import { PlusOutlined } from "@ant-design/icons";
import MerchantReviewCard from "../../../../components/pages/Shared/Reviews/MerchantReviewCard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "5px",
};

const ReviewsData = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { instituteDetails, loading, userData } = useSelector(authSelector);
  const [refetch, setRefetch] = useState(false);

  const { currentInstitute = {} } = useSelector((state) => state.institute);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const run = async () => {
      if (instituteDetails.id) {
        try {
          const res = await axios.get(
            `${host}/review?instituteId=${instituteDetails.id}&nolimit=true`
          );
          setReviews(res?.data?.message);
        } catch (err) {
          console.log(err);
        }
      }
    };

    run();
  }, [instituteDetails.id]);
  let item_limit = 8;

  console.log(instituteDetails);

  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  let item_remaining = reviews?.length - pageData?.length || 0;

  useEffect(() => {
    if (reviews?.length > 0) {
      let filtered = reviews
        .slice()
        .reverse()
        .slice(0, item_limit * page);
      setPageData(filtered);
    }
  }, [reviews, page, item_limit]);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("OWNER_ID") === null
    )
      router.push("/merchant/login");
      if (userData) {
        if (userData?.usertype !== 2) {
          router.push("/merchant/login");
        }
      }
    else if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("INSTITUTE_ID") === null
    )
      router.push("/merchant/details");
    dispatch(getInstituteDetails());
  }, [refetch, router]);

  useEffect(() => {
    console.log(instituteDetails);
    if (
      !loading &&
      !isEmpty(instituteDetails) &&
      instituteDetails.approval !== 1
    ) {
      router.push("/merchant/details/success");
    } else {
      return;
    }
  }, [instituteDetails, loading, router]);

  const [filterAnchorEl, setFilterAnchorEl] = React.useState(null);
  const filterOpen = Boolean(filterAnchorEl);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const searchOpen = Boolean(anchorEl);

  const handleSearchClose = () => {
    setAnchorEl(null);
  };

  console.log(pageData, "reviews");

  const [reviewsShow, setReviewsShow] = useState(true);

  const [subscribeData, setSubscribeData] = useState([]);

  useEffect(() => {
    const run = async () => {
      if (instituteDetails?.id) {
        try {
          const res = await axios.get(
            `${host}/institute/subscriptions?instituteid=${instituteDetails?.id}&limit=50`
          );
          setSubscribeData(res?.data?.message);
          console.log("subscribers", res);
        } catch (err) {
          toast.error(err.message);
        }
      }
    };
    run();
  }, [instituteDetails?.id, refetch]);

  console.log(subscribeData, "subscriber check");

  return (
    <>
      <div className="dashboard">
        <ToggleDashboard
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        ></ToggleDashboard>
        <div className=" grid grid-cols-6 gap-0 bg-white ">
          <DashboardSidebar />
          <div
            style={{ background: " #FAFAFB" }}
            className="  col-span-6 px-5 lg:col-span-5  "
            onClick={() => setShowSidebar(false)}
          >
            <div className="heading p-5 mb-5 flex justify-between">
              <h1 className="text-2xl font-bold ">Reviews & Subscribers</h1>
            </div>

            <div className="bg-white md:mr-3 md:p-3 rounded-lg">
              <div className="mb-3 flex">
                <button
                  onClick={() => {
                    setReviewsShow(true);
                  }}
                  className="px-5 py-1.5 text-[#F0F0F0] mr-2 text-lg font-medium rounded-lg mt-3 bg-primary border-0"
                >
                  Reviews
                </button>

                <button
                  onClick={() => {
                    setReviewsShow(false);
                  }}
                  className="px-5 py-1.5 text-[#F0F0F0] mr-2 text-lg font-medium rounded-lg mt-3 bg-primary border-0"
                >
                  Subscribers
                </button>
              </div>

              <div className="md:flex gap-x-1 md:px-5 px-3  justify-between">
                <h3 className="md:font-bold md:text-[19px] text-[16px] text-[#252733]">
                  All {reviewsShow ? "Reviews" : "Subscribers"}
                </h3>
              </div>

              {reviewsShow ? (
                <div>
                  {pageData.length ? (
                    <div className=" md:grid grid-cols-1 gap-4  place-items-center  mt-5">
                      <div className="flex-grow w-full border-b border-[#D0D5DD]"></div>
                      {pageData?.map((item) => (
                        <MerchantReviewCard key={item?.id} {...item} />
                      ))}

                      <>
                        <div
                          onClick={() => {
                            if (item_remaining > 0) {
                              setPage((prv) => prv + 1);
                            } else {
                              if (page > 1) {
                                setPage((prv) => prv - 1);
                              }
                            }
                          }}
                          className="py-6 px-10 bg-white shadow-lg rounded flex justify-between items-center w-full"
                        >
                          <p className="font-bold hover:underline cursor-pointer text-primary">
                            {item_remaining > 0
                              ? ` More ${item_remaining} reviews`
                              : `Show less `}
                          </p>
                          <PlusOutlined className=" cursor-pointer" />
                        </div>
                      </>
                    </div>
                  ) : (
                    <p className="text-red md:px-5 px-3 text-xl mt-3">
                      No Reviews
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {subscribeData?.length ? (
                    <div className=" md:grid grid-cols-1 gap-4   mt-5">
                      <div className=" w-full border-b border-[#D0D5DD]"></div>
                      <table className="mt-10 md:block hidden table-auto">
                        <thead className="bg-white table w-full table-fixed border-b border-light-gray">
                          <tr>
                            <th
                              scope="col"
                              className="text-[15px] !w-[20%] font-medium text-[#ABABAB] px-6 py-4 text-left"
                            >
                              Name of Students
                            </th>

                            <th
                              scope="col"
                              className="text-[15px] !w-[20%] font-medium text-[#ABABAB] px-6 py-4 text-left"
                            >
                              Name of School
                            </th>

                            <th
                              scope="col"
                              className="text-[15px] !w-[20%] font-medium text-[#ABABAB] px-6 py-4 text-left"
                            >
                              Students Phone Number
                            </th>

                            <th
                              scope="col"
                              className="text-[15px] !w-[20%] font-medium text-[#ABABAB] px-6 py-4 text-left"
                            >
                              Class
                            </th>
                            <th
                              scope="col"
                              className="text-[15px] !w-[20%] font-medium text-[#ABABAB] px-6 py-4 text-left"
                            >
                              Locations
                            </th>
                            <th
                              scope="col"
                              className="text-[15px] !w-[20%] font-medium text-[#ABABAB] px-6 py-4 text-left"
                            >
                              Date & Time
                            </th>
                            <th
                              scope="col"
                              className="text-[15px] !w-[20%] font-medium text-[#ABABAB] px-6 py-4 text-left"
                            ></th>
                          </tr>
                        </thead>
                        <tbody className="block max-h-[70vh] scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-100 overflow-y-auto">
                          {subscribeData?.map((item, index) => (
                            <tr
                              key={index}
                              className="bg-white border-b border-light-gray cursor-pointer transition duration-300 ease-in-out hover:bg-light-gray table w-full table-fixed"
                            >
                              <td className="px-6 py-4  font-medium text-[#252733]">
                                <div className="flex items-center ">
                                  {item?.student?.avatar?.length ? (
                                    <img
                                      className="mr-2 h-10 w-10 rounded-full"
                                      src={`https://cdn.ostello.co.in/${item?.student?.avatar?.key}`}
                                      alt=""
                                    />
                                  ) : (
                                    <div className="bg-primary mr-3  h-10 w-10 rounded-full flex items-center justify-center p-1 text-white cursor-pointer ">
                                      {item?.student?.name
                                        ?.slice(0, 1)
                                        .toUpperCase()}
                                    </div>
                                  )}
                                  <div className="w-full ">
                                    <p className={`font-bold `}>
                                      {item?.student?.name}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="text-[#252733] font-medium px-6 py-4">
                                <div className="flex flex-col">
                                  <p className="font-bold">
                                    {" "}
                                    {item?.student?.schoolname}
                                  </p>
                                </div>
                              </td>

                              <td className="text-[#252733] font-medium px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <p className="font-bold">
                                    {" "}
                                    {item?.student?.phonenumber}
                                  </p>
                                </div>
                              </td>

                              <td className="text-[#252733] font-medium px-6 py-4 ">
                                <div className="flex flex-col">
                                  <p className="font-bold">
                                    {" "}
                                    {item?.student?.grade}
                                  </p>
                                </div>
                              </td>

                              <td className="text-[#252733] font-medium px-6 py-4 ">
                                <div className="flex flex-col">
                                  <p className="font-bold">
                                    {" "}
                                    {item?.student?.location?.area}
                                  </p>
                                </div>
                              </td>

                              <td className="text-[#252733] font-medium px-6 py-4 ">
                                <div className="flex flex-col">
                                  <p className="font-bold">
                                    {" "}
                                    {/* {d?.registeredon?.split("T")[0]} */}
                                    {new Date(
                                      item?.created_at
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-[11px] text-[#717171]">
                                    {/* {recentData??.registeredon?.split("T")[1].split(".")[0]} */}
                                    {new Date(
                                      item?.created_at
                                    ).toLocaleTimeString()}
                                  </p>

                                  {/* <div>
                        
                      </div>

                      <div className="text-[#9FA2B4] text-sm">
                        
                      </div> */}
                                </div>
                              </td>

                              <td className="text-[#252733] font-medium px-6 py-4 ">
                                <button
                                  onClick={() => {
                                    // setReviewsShow(false);
                                  }}
                                  className="px-5 py-1.5 text-[#F0F0F0] mr-2 text-lg font-medium rounded-lg mt-3 bg-primary border-0 flex items-center"
                                >
                                  <FaCrown className="text-[#BF913B] mr-2" />
                                  Upgrade
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="md:hidden block p-3">
                        <div className="flex space-y-4 flex-col">
                          {subscribeData?.map((item, i) => (
                            <div key={i}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-[#252733] font-bold ">
                                      {item?.student?.avatar?.length ? (
                                        <img
                                          className="mr-2 h-10 w-10 rounded-full"
                                          src={`https://cdn.ostello.co.in/${item?.student?.avatar?.key}`}
                                          alt=""
                                        />
                                      ) : (
                                        <div className="bg-primary mr-3  h-10 w-10 rounded-full flex items-center justify-center p-1 text-white cursor-pointer ">
                                          {item?.student?.name
                                            ?.slice(0, 1)
                                            .toUpperCase()}
                                        </div>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex mt-3 space-x-1 justify-between">
                                <div className=" text-[#717171] text-sm">
                                  {/* <div>Applicant Name :</div>
                        <div>Time of Registration :</div> */}
                                  <div>Name : {item?.student?.name}</div>
                                  <div>
                                    Phonenumber : {item?.student?.phonenumber}
                                  </div>
                                  <div>
                                    Schoolname : {item?.student?.schoolname}
                                  </div>
                                  <div>
                                    Locations : {item?.student?.location?.area}
                                  </div>
                                  <div>
                                    Schoolname : {item?.student?.schoolname}
                                  </div>

                                  <div>Classes : {item?.student?.grade}</div>
                                </div>
                              </div>
                              <hr className="mt-3" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red md:px-5 px-3 text-xl mt-3">
                      No Subscribers
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewsData;
