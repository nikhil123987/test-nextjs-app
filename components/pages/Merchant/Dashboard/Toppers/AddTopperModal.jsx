import axios from "axios";
import "react-calendar/dist/Calendar.css";
import React, { useEffect, useRef, useState } from "react";
import { FaSortAmountUp } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import {
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { toast } from "react-hot-toast";
import Modal from "@mui/material/Modal";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/system";
import { CloseCircleOutlined, StarFilled } from "@ant-design/icons";
import { isEmpty, FileUploader } from "../../../../../utils/utils";
import imgProto from "../../../../../assets/images/icons/img.svg";
import Calendar from "react-calendar";
import { host } from "../../../../../utils/constant";
import Swal from "sweetalert2";
import {
  authSelector,
  getInstituteDetails,
  updatePercentage,
  uploadingEnded,
  uploadingStarted,
} from "../../../../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import OtpModal from "./OtpModal";
import { MdAddPhotoAlternate } from "react-icons/md";
import { CustomInputField } from "../MyProfile/CustomInputField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "10px",
  backgroundColor: "white",
  color: "black",
  overflow: "hidden",
  p: 2,
};

const AddTopperModal = ({ setOpen, open, instituteDetails }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [topper, setTopper] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const infoGenRef = useRef(null);
  const [isVerified, setIsVerified] = useState(false);

  console.log(instituteDetails?.updatedRequest?.toppers, topper);

  useEffect(() => {
    if (
      instituteDetails.toppers &&
      !instituteDetails?.updatedRequest?.toppers
    ) {
      setTopper(instituteDetails.toppers);
    }
    if (
      !instituteDetails.toppers &&
      !instituteDetails?.updatedRequest?.toppers
    ) {
      setTopper();
    }
    if (instituteDetails?.updatedRequest?.toppers) {
      setTopper(instituteDetails?.updatedRequest?.toppers);
    }
  }, [instituteDetails?.updatedRequest?.toppers, instituteDetails.toppers]);

  const imageInputRef = useRef({});
  const videoInputRef = useRef({});
  const thumbnailInputRef = useRef([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);

  const [rank, setRank] = useState();
  const [link, setLink] = useState("");
  const [subject, setSubject] = useState("");
  const [exam, setExam] = useState("");
  const [number, setNumber] = useState("");
  const [disable, setDisable] = useState(false);
  const [description, setDescription] = useState("");

  const handleChange = (event, setFunction) => {
    setFunction(event.target.value);
  };

  console.log(images, videos, thumbnails);

  const [uploading, setUploading] = useState(false);

  const { percentage, isUploading } = useSelector(authSelector);

  const handleTopper = async () => {
    // if (!name || !email || !time || !exam || !link || !subject || !value) {
    //   toast.error("Please add every field first");
    //   return;
    // }
    // if (!isVerified) {
    //   toast.error("Please verify number first");
    //   return;
    // }
    setDisable(true);

    let uploading = toast.loading("Uploading Files Please Wait");
    let videosUploaded;
    let thumbnailsUploaded;
    let image;

    if (videos[0]?.name) {
      videosUploaded = await FileUploader(videos, (percent) =>
        dispatch(updatePercentage(percent))
      );
    }
    if (thumbnails[0]?.name) {
      thumbnailsUploaded = await FileUploader(thumbnails, (percent) =>
        dispatch(updatePercentage(percent))
      );
    }
    if (images[0]?.name) {
      image = await FileUploader(images, (percent) =>
        dispatch(updatePercentage(percent))
      );
    }

    const video = {
      thumbnail: thumbnailsUploaded,
      video: videosUploaded,
    };

    const emptyState = () => {
      setName("");
      setEmail("");
      setSubject("");
      setExam("");
      setLink("");
      setRank("");
      setTime("");
      setImages([]);
      setVideos([]);
      setThumbnails([]);
      setDescription("");
      setNumber("");
    };

    const data = {
      id: `${name.replaceAll(" ", "")}${Math.floor(
        Math.random() * 1000000 + 1
      )}${8448753}`,
      name: name,
      // email: email,
      // time: time,
      // rank: rank,
      // exam: exam,
      // rank: rank,
      // link: link,
      // subject: subject,
      // date: value,
      image: image,
      video: video,
      // number: number,
      description: description,
    };

    const updatedData = {
      id: instituteDetails?.id,
      updates: {
        toppers: topper ? [...topper, data] : [data],
      },
    };

    console.log(isVerified, updatedData);

    try {
      const { data } = await axios.patch(
        `${host}/institute/update`,
        updatedData,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${
              typeof window !== "undefined" &&
              window.localStorage.getItem("ACCESS_TOKEN")
            }`,
          },
        }
      );
      console.log(data);
      toast.success("Add request sent .wait for super admin approval");
      setOpen(false);
      setDisable(false);
      dispatch(getInstituteDetails());
    } catch (err) {
      console.log(err);
      toast.success("Something went wrong try again later");
      setOpen(false);
      setDisable(false);
    } finally {
      toast.remove(uploading);
      setUploading(false);
      emptyState();
    }
  };

  const theme = useTheme();
  const useStyle = makeStyles({
    modalBox: {
      width: "30%",

      overflowY: "scroll!important",
      [theme.breakpoints.down("sm")]: {
        width: "80%",
        height: "60%",
        overflowY: "scroll!important",
      },
    },
  });
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);

  const { modalBox } = useStyle();
  const [firstNumber, setFirstNumber] = useState("+91");

  const mobileNumRef = useRef(null);

  console.log(percentage, "percentage");

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className={modalBox}>
          <div className="px-[5px]  w-full !mt-[0px]">
            <p className="text-4xl  font-bold mb-4">Add Topper</p>

            <div className="flex flex-col space-y-2 ">
              <p>Add Image</p>
              <div
                className="
                    w-[100%] h-[100px]  shadow-md rounded-xl  rounded-md 
                    "
              >
                {isEmpty(images) ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <img
                      onClick={() => imageInputRef.current.click()}
                      className="w-[30px] h-[30px] cursor-pointer "
                      src={imgProto.src}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="p-2">
                    {images.length ? (
                      <section>
                        <p>Image:</p>
                        <div className="flex items-center space-x-2 flex-wrap">
                          {images?.map((item, idx) => (
                            <div key={idx} className="relative ">
                              <img
                                className="w-20"
                                src={URL.createObjectURL(item)}
                                alt=""
                              />
                              <CloseCircleOutlined
                                onClick={() => {
                                  setImages((prv) =>
                                    prv.filter((_, index) => idx !== index)
                                  );
                                }}
                                className="absolute right-0 top-0"
                              />
                            </div>
                          ))}
                        </div>
                      </section>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                <input
                  onChange={(e) => {
                    const filesObj = e.target.files;
                    Object.values(filesObj).forEach((item) => {
                      if (item.type.includes("image")) {
                        setImages((prv) => prv.concat(item));
                      }
                    });
                  }}
                  ref={imageInputRef}
                  type="file"
                  name="image"
                  hidden
                  accept="image/*"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2 ">
              <p>Add Video</p>
              <div
                className="
                    w-[100%] h-[100px]  shadow-md rounded-xl  rounded-md 
                    "
              >
                {isEmpty(videos) ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <img
                      onClick={() => videoInputRef.current.click()}
                      className="w-[30px] h-[30px] cursor-pointer "
                      src={imgProto.src}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="p-2">
                    {videos?.length ? (
                      <section className="flex ">
                        <div className="mr-3">
                          <p>Videos:</p>
                          <div>
                            {videos?.map((item, idx) => (
                              <>
                                <video
                                  className="w-20 "
                                  key={idx}
                                  src={URL.createObjectURL(item)}
                                  alt=""
                                />
                                <div key={idx} className="flex space-x-2">
                                  <p className=" truncate md:block hidden">
                                    {idx + 1}. {item?.name.slice(0, 20)}
                                  </p>
                                  <CloseCircleOutlined
                                    onClick={() => {
                                      setVideos((prv) =>
                                        prv.filter((_, index) => idx !== index)
                                      );
                                    }}
                                    className="flex items-center text-xl text-[#FF0000]"
                                  />
                                </div>
                              </>
                            ))}
                          </div>
                        </div>
                        {thumbnails?.length > 0 ? (
                          <div className="h-full">
                            <p>Thumbnail:</p>
                            <div className="flex items-center space-x-2 flex-wrap">
                              {thumbnails?.map((item, idx) => (
                                <div key={idx} className="relative ">
                                  <img
                                    className="w-20"
                                    src={URL.createObjectURL(item)}
                                    alt=""
                                  />
                                  <CloseCircleOutlined
                                    onClick={() => {
                                      setThumbnails((prv) =>
                                        prv.filter((_, index) => idx !== index)
                                      );
                                    }}
                                    className="absolute right-0 top-0"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="">
                            <div className="">
                              <p>Videos Thumbnail:</p>
                              <div>
                                <div className="border w-36 relative rounded-lg flex items-center justify-center">
                                  <div>
                                    <MdAddPhotoAlternate
                                      onClick={() => {
                                        thumbnailInputRef.current.click();
                                        console.log("a");
                                      }}
                                      size={15}
                                    />
                                    <input
                                      ref={thumbnailInputRef}
                                      onChange={(e) => {
                                        const filesObj = e.target.files;
                                        Object.values(filesObj).forEach(
                                          (item) => {
                                            if (item.type.includes("image")) {
                                              setThumbnails((prv) =>
                                                prv.concat(item)
                                              );
                                            }
                                          }
                                        );
                                      }}
                                      type="file"
                                      name="thumbnail"
                                      hidden
                                      accept="image/*"
                                    />
                                  </div>
                                </div>
                                <p className="text-center my-2">
                                  This image will be used as video thumbnail
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </section>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                <input
                  onChange={(e) => {
                    const filesObj = e.target.files;
                    Object.values(filesObj).forEach((item) => {
                      if (item.type.includes("video")) {
                        setVideos((prv) => prv.concat(item));
                      }
                    });
                  }}
                  ref={videoInputRef}
                  type="file"
                  name="thumbnail"
                  hidden
                  accept="video/*"
                />
              </div>
            </div>

            <div
              className={` shrink w-full px-6 py-2 my-3  shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0  
                                    
                                        `}
            >
              <input
                type="text"
                placeholder="Name"
                autoFocus
                className="text-xl bg-white  focus:outline-none w-full"
                defaultValue={name}
                disabled={isDisable}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            {/* <div
              className={` shrink w-full px-6 py-2 my-3  shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0  
                                    
                                        `}
            >
              <input
                type="email"
                placeholder="Email"
                autoFocus
                className="text-xl bg-white  focus:outline-none w-full"
                defaultValue={email}
                disabled={isDisable}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div> */}

            {/* <div
              className={`shrink px-6 py-2 md:w-3/4  w-full shadow-md rounded-xl font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0 focus:outline-none text-xl mt-2 flex`}
            >
              <PhoneInput
                className="w-10"
                placeholder="Enter your mobile number"
                defaultCountry="IN"
                value={firstNumber}
                onChange={setFirstNumber}
                international
              />
              <p className="py-2">{firstNumber}</p>
              <input
                type="number"
                autoFocus
                className="text-xl px-1 bg-white  focus:outline-none w-full"
                name="Number"
                placeholder="Number"
                onKeyDown={(evt) =>
                  ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
                }
                ref={mobileNumRef}
                onChange={(e) => {
                  setNumber(e.target.value);
                  setIsVerified(false);
                }}
                value={number}
              />
              <button
                ref={infoGenRef}
                onClick={(e) => {
                  axios({
                    method: "get",
                    url: `${host}/auth/otp/generate`,
                    params: {
                      phonenumber: number,
                      // email: emailRef.current.value,
                      //   otp: 2154,
                    },
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                    },
                  })
                    .then((res) => {
                      console.log(res);
                      setModalOpen(true);
                      dispatch(setAuthModalState(6));
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
                className="text-xs p-1 px-2 bg-primary text-white m-1 rounded-md"
              >
                Verify
              </button>
            </div> */}

            <CustomInputField
              type="textarea"
              defaultValue={description}
              onChange={(e) => setDescription(e)}
              disableState={[isDisable, setIsDisable]}
              className=" w-full shrink"
              name="Description"
            />

            {/* <div className="md:flex justify-between mb-2">
              <div className="shrink px-2 py-2 md:w-3/4 w-full shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0 focus:outline-none text-xl mt-2 mr-2">
                <input
                  type="text"
                  autoFocus
                  className="text-xl bg-white px-5 focus:outline-none w-full"
                  disabled={isDisable ? true : false}
                  name="exam"
                  placeholder="Exam"
                  onChange={(e) => handleChange(e, setExam)}
                  value={exam}
                />
              </div>
              <div className="shrink px-2 py-2 md:w-3/4 w-full shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0 focus:outline-none text-xl mt-2 ">
                <input
                  type="text"
                  autoFocus
                  className="text-xl bg-white px-5  focus:outline-none w-full"
                  disabled={isDisable ? true : false}
                  name="rank"
                  placeholder="Rank"
                  onChange={(e) => handleChange(e, setRank)}
                  value={rank}
                />
              </div>
            </div> */}

            {/* <div
              className={` shrink w-full px-6 py-2 mb-2  shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0  
                                    
                                        `}
            >
              <input
                type="text"
                placeholder="Subject"
                autoFocus
                className="text-xl bg-white  focus:outline-none w-full"
                defaultValue={subject}
                disabled={isDisable}
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
              />
            </div> */}
            {/* <div
              className={` shrink w-full px-6 py-2 mb-2  shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0  
                                    
                                        `}
            >
              <input
                type="text"
                placeholder="Link"
                autoFocus
                className="text-xl bg-white  focus:outline-none w-full"
                defaultValue={link}
                disabled={isDisable}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
              />
            </div> */}

            {/* <div className="md:flex justify-between mb-2">
              <Calendar
                onChange={onChange}
                className=" md:w-6/12 w-full"
                value={value}
              />

              <div className="md:ml-2 md:mt-0 mt-3 md:w-6/12 w-full">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    e.preventDefault();
                    setTime(e.target.value);
                  }}
                  className={`select-none form-select   marker:block w-full px-4 py-2 text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid rounded-xl shadow-md first-letter:transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none`}
                />
              </div>
            </div> */}
            {uploading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box sx={{ width: "50%", mr: 1 }}>
                  <LinearProgress variant="determinate" value={percentage} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >{`${Math.round(percentage)}%`}</Typography>
                </Box>
              </Box>
            ) : (
              <div className="bg-primary  w-[100px] my-3 py-2 rounded-lg ">
                <button
                  disabled={disable && "disable"}
                  className="m-auto w-full bg-primary text-lg font-bold z-50 text-white"
                  onClick={() => {
                    handleTopper();
                    setUploading(true);
                  }}
                >
                  Add
                </button>
              </div>
            )}
            {/* <button
                  disabled={disable && "disable"}
                  className="m-auto w-full bg-primary text-lg font-bold z-50 text-white"
                  onClick={() => {
                    handleTopper();
                    setUploading(true);
                  }}
                >
                  Add
                </button> */}
          </div>
        </Box>
      </Modal>
      <OtpModal
        open={modalOpen}
        setOpen={setModalOpen}
        mobilenumber={number}
        setIsVerified={setIsVerified}
        isVerified={isVerified}
      ></OtpModal>
    </>
  );
};

export default AddTopperModal;
