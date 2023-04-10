import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import { toast } from "react-hot-toast";
import Modal from "@mui/material/Modal";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/system";
import { host } from "../../../../utils/constant";
import { titleToUrl } from "../../../../utils/utils";
import Dropdown from "../../../Dropdown";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
import "suneditor/dist/css/suneditor.min.css";
import dynamic from "next/dynamic";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 2,
  borderRadius: "20px",
  backgroundColor: "white",
  color: "black",
  overflow: "hidden",
};

const AddTopLocationModal = ({ setOpen, open, setReFetch }) => {
  const [name, setName] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [slugUrl, setSlugUrl] = useState("");
  const [isDisable, setIsDisable] = useState(false);

  const defaultFonts = [
    "Arial",
    "Comic Sans MS",
    "Courier New",
    "Impact",
    "Georgia",
    "Tahoma",
    "Trebuchet MS",
    "Verdana",
  ];

  const sortedFontOptions = [
    "Logical",
    "Salesforce Sans",
    "Garamond",
    "Sans-Serif",
    "Serif",
    "Times New Roman",
    "Helvetica",
    ...defaultFonts,
  ].sort();

  const [city, setCity] = useState();
  const [area, setArea] = useState("");
  const [direction, setDirection] = useState("");
  const [areaError, setAreaError] = useState("");
  const [directionError, setDirectionError] = useState("");
  const [areaOptions, setAreaOptions] = useState([]);
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const infoGenRef = useRef(null);

  const handleChange = (event, setFunction) => {
    setFunction(event.target.value);
  };

  const [desc, setDesc] = useState("");
  const getValue = (value) => {
    setDesc(value);
  };

  const handleGenerateFromPincode = (pinCode) => {
    console.log(pinCode, "p", pinCode?.length);
    if (pinCode?.length !== 6) {
      setPincodeError("Enter a valid pincode");
      setAreaOptions([]);
      setArea("");
      setCity("");
      setState("");
      setCountry("");
      return;
    }
    setIsLoading(true);

    axios
      .get(`https://api.postalpincode.in/pincode/${pinCode}`)
      .then((res) => {
        setAreaOptions([]);
        res.data.map((item) =>
          item.PostOffice.forEach((po) => {
            setAreaOptions((prev) => {
              if (prev.indexOf(po.Name) === -1) {
                return [...prev, po.Name];
              }
              return prev;
            });
          })
        );
        console.log(res.data[0]);
        setCity(res.data[0].PostOffice[0].District);
        setState(res.data[0].PostOffice[0].State);
        setCountry(res.data[0].PostOffice[0].Country);
        setIsLoading(false);
        setPincodeError("");
      })
      .catch((err) => console.log(err));
  };

  const optionList = ["East", "West", "South", "North", "Center"];

  const handleLocation = async () => {
    const d = {
      name: name,
      metatitle: metaTitle,
      metadesc: metaDesc,
      slugurl: `${name?.toLowerCase()?.replace(/ /g, "-")}`,
      city: city,
      state: state,
      area: area,
      citydirection: direction,
      pincode: pincode,
      content: desc,
    };
    try {
      console.log(d);

      const { data } = await axios.post(`${host}/locations/`, d, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${window.localStorage.getItem(
            "ACCESS_TOKEN"
          )}`,
        },
      });
      console.log(data);
      toast.success("successfully added");
    } catch (err) {
      toast.error("something went wrong !!");
    } finally {
      setOpen(false);
      setReFetch(true);
      setPincode("");
      setName("");
      setMetaDesc("");
      setMetaTitle("");
      setMetaTitle("");
      setDirection("");
      setCity("");
      setState("");
      setArea("");
    }
  };

  const theme = useTheme();
  const useStyle = makeStyles({
    modalBox: {
      width: "50%",
      height: "70%",
      overflowY: "scroll!important",
      [theme.breakpoints.down("sm")]: {
        width: "80%",
        height: "60%",
        overflowY: "scroll!important",
      },
    },
  });

  const { modalBox } = useStyle();
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className={modalBox}>
        <div className="md:px-[30px] px-[5px]  w-full !mt-[0px]">
          <p className="text-4xl text-center font-bold mb-4">
            Add Top Location
          </p>
          <div
            className={` shrink w-full px-6 py-2 mb-2  shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0  
                                    
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

          <div
            className={`shrink px-6 py-2 md:w-2/4 w-full shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0 focus:outline-none text-xl mt-2 flex`}
          >
            <input
              type="text"
              autoFocus
              className="text-xl bg-white  focus:outline-none w-full"
              name="pincode"
              placeholder="Pincode"
              onChange={(e) => handleChange(e, setPincode)}
              value={pincode}
              disabled={isDisable}
            />
            <button
              ref={infoGenRef}
              disabled={isDisable}
              onClick={(e) => {
                e.preventDefault();
                handleGenerateFromPincode(pincode);
              }}
              className="text-xs p-1 bg-primary text-white m-1 rounded-md"
            >
              Generate
            </button>
          </div>
          <div className="md:flex justify-between">
            <div className="shrink px-2 py-2 md:w-3/4 w-full shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0 focus:outline-none text-xl mt-2 mr-2">
              <input
                type="text"
                autoFocus
                className="text-xl bg-white px-5 focus:outline-none w-full"
                disabled={isDisable ? true : false}
                name="state"
                placeholder="State"
                onChange={(e) => handleChange(e, setState)}
                value={state}
              />
            </div>
            <div className="shrink px-2 py-2 md:w-3/4 w-full shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0 focus:outline-none text-xl mt-2 ">
              <input
                type="text"
                autoFocus
                className="text-xl bg-white px-5  focus:outline-none w-full"
                disabled={isDisable ? true : false}
                name="city"
                placeholder="City"
                onChange={(e) => handleChange(e, setCity)}
                value={city}
              />
            </div>
          </div>
          <div className="w-2/4 ">
            <Dropdown
              placeholderText={"Choose Area"}
              selectValueState={[area, setArea]}
              options={areaOptions}
              errorState={[areaError, setAreaError]}
            />
          </div>
          <div className="w-2/4">
            <Dropdown
              placeholderText={"Choose City Direction"}
              selectValueState={[direction, setDirection]}
              options={optionList}
              errorState={[directionError, setDirectionError]}
            />
          </div>
          <div
            className={` shrink w-full px-6 py-2 mb-2  shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0  
                                    
                                        `}
          >
            <input
              type="text"
              placeholder="Meta Title"
              autoFocus
              className="text-xl bg-white  focus:outline-none w-full"
              defaultValue={metaTitle}
              disabled={isDisable}
              onChange={(e) => {
                setMetaTitle(e.target.value);
              }}
            />
          </div>

          <div
            className={` shrink w-full px-6 py-2  shadow-md rounded-xl text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out m-0  
                                    
                                        `}
          >
            <textarea
              type="text"
              placeholder="Meta Desc"
              autoFocus
              rows={3}
              className="text-xl bg-white  focus:outline-none w-full"
              defaultValue={metaDesc}
              disabled={isDisable}
              onChange={(e) => {
                setMetaDesc(e.target.value);
              }}
            />
          </div>

          <SunEditor
            onChange={(content) => {
              getValue(content);

              // console.log(
              //   content
              // );
            }}
            setContents={desc}
            placeholder="Meta Content"
            setOptions={{
              buttonList: [
                ["undo", "redo"],
                ["font", "fontSize"],
                ["paragraphStyle", "blockquote", "formatBlock"],
                [
                  "bold",
                  "underline",
                  "italic",
                  "strike",
                  "subscript",
                  "superscript",
                ],
                ["fontColor", "hiliteColor"],
                ["align", "list", "lineHeight"],
                ["outdent", "indent"],

                ["table", "horizontalRule", "link", "image", "video"],
                ["fullScreen", "showBlocks", "codeView"],
                ["preview", "print"],
                ["removeFormat"],
              ],
              formats: ["p", "blockquote", "h1", "h2", "h3"],

              defaultTag: "div",
              minHeight: "150px",
              showPathLabel: false,
              font: sortedFontOptions,
            }}
          />
          <div className="bg-primary w-28 my-3 py-2 rounded-lg ">
            <button
              className="m-auto w-full text-lg font-bold z-50 text-white"
              onClick={handleLocation}
            >
              Add
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddTopLocationModal;
