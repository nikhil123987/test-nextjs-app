import { CloseOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Box, Modal, Rating } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/system";
import { Divider } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Data } from "../Search/Data";
import DistanceSlider from "../Search/Distance";
import Dropdown from "../Search/Dropdown";
import GroupCheckbox from "../Search/GroupCheckbox";
import GroupRadio from "../Search/GroupRadio";
import PriceSlider from "../Search/PriceSlider";
import RatingSlider from "../Search/RatingSlider";
import SubjectGroupCheckbox from "../Search/SubjectGroupCheckBox";
import instituteImage from "../../../assets/images/institute.png";
import banner from "../../../assets/toplocationbanner.png";

import {
  selectCourse,
  setFields,
  setSearch,
} from "../../../redux/slices/courseSlice";
import { institutesSelector } from "../../../redux/slices/instituteSlice";
import {
  selectSearch,
  setCategory,
  setClass,
  setExam,
  setFilteredCourses,
  setFilteredInstitutes,
  setLocationQuery,
  setPrice,
  setRating,
  setSortBy,
  setSubjects,
} from "../../../redux/slices/SearchSlice";
import { host } from "../../../utils/constant";
import { isEmpty, urlToTitle } from "../../../utils/utils";
import Scroll from "../HomeLanding/Header/SearchBar/scroll";
import ExamCheckbox from "../Search/ExamCheckBox";
import MobileFilterBar from "./MobileFilterBar";
import RecommendedCard from "./RecommendedCard";
import TopLocation from "./TopLocation";
import { useClickOutside } from "../../hooks/useClickOutside";
import Card from "../HomeLanding/Header/SearchBar/card";
import { divide } from "lodash";
import { capitalizeFirst } from "../../utils";
import { GoChevronDown } from "react-icons/go";
import CourseCard from "../Course/MetaCourseSection/CourseCard";
import InstituteCard from "../../UI/InstituteCard";
import ninetynineImage from "../../../assets/images/99rs.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",

  borderRadius: "5px",
  backgroundColor: "white",
  color: "black",
  overflow: "hidden",
};

const sortData = [
  {
    name: "Institutes",
  },
  {
    name: "Courses",
  },
];
const modeData = [
  {
    name: "Online",
    value: 1,
  },
  {
    name: "Offline",
    value: 2,
  },
  {
    name: "Hybrid",
    value: 3,
  },
  {
    name: "Clear All",
    value: "",
  },
];

const examsData = [
  {
    name: "NEET",
    instituteValue: "NEET",
    value: "NEET",
  },
  {
    name: "NEET-PG",
    instituteValue: "NEET-PG",
    value: "NEET PG",
  },
  {
    name: "AIIMS",
    instituteValue: "AIIMS",
    value: "AIIMS",
  },
  {
    name: "AIIMS-PG",
    instituteValue: "AIIMS-PG",
    value: "AIIMS PG",
  },
  {
    name: "PGIMER",
    instituteValue: "PGIMER",
    value: "PGIMER",
  },
  {
    name: "CMSE",
    instituteValue: "CMSE",
    value: "CMSE",
  },
  {
    name: "FPMT",
    instituteValue: "FPMT",
    value: "FPMT",
  },
  {
    name: "NPE-FET",
    instituteValue: "NPE-FET",
    value: "NPE FET",
  },

  {
    name: "IIT-JEE-MAIN",
    instituteValue: "IIT-JEE-MAIN",
    value: "JEE Mains",
  },
  {
    name: "IIT-JEE-ADVANCE",
    instituteValue: "IIT-JEE-ADVANCE",
    value: "JEE Advanced",
  },
  {
    name: "GATE",
    instituteValue: "GATE",
    value: "GATE",
  },
  {
    name: "NATA",
    instituteValue: "NATA",
    value: "NATA",
  },
  {
    name: "DUET",
    instituteValue: "DUET",
    value: "DUET",
  },
  {
    name: "AMET",
    instituteValue: "AMET",
    value: "AMET",
  },
  {
    name: "BITSAT",
    instituteValue: "BITSAT",
    value: "BITSAT",
  },
  {
    name: "VITEEE",
    instituteValue: "VITEEE",
    value: "VITEEE",
  },
  {
    name: "SRMJEE",
    instituteValue: "SRMJEE",
    value: "SRMJEE",
  },
  {
    name: "COMEDK",
    instituteValue: "COMEDK",
    value: "COMEDK",
  },
  {
    name: "KIITEE",
    instituteValue: "KIITEE",
    value: "KIITEE",
  },
  {
    name: "WBJEE",
    instituteValue: "WBJEE",
    value: "WBJEE",
  },
  {
    name: "MHTCET",
    instituteValue: "MHTCET",
    value: "MHTCET",
  },
  {
    name: "MET",
    instituteValue: "MET",
    value: "MET",
  },
  ,
  {
    name: "CUET",
    instituteValue: "Common University Entrance Test (CUET)",
    value: "Common University Entrance Test (CUET)",
  },
  {
    name: "Clear All",
    instituteValue: "",
    value: "",
  },
];

const classData = [
  {
    name: "Class 1",
    value: "Class 1",
  },
  {
    name: "Class 2",
    value: "Class 2",
  },
  {
    name: "Class 3",
    value: "Class 3",
  },
  {
    name: "Class 4",
    value: "Class 4",
  },
  {
    name: "Class 5",
    value: "Class 5",
  },
  {
    name: "Class 6",
    value: "Class 6",
  },
  {
    name: "Class 7",
    value: "Class 7",
  },
  {
    name: "Class 8",
    value: "Class 8",
  },
  {
    name: "Class 9",
    value: "Class 9",
  },
  {
    name: "Class 10",
    value: "Class 10",
  },
  {
    name: "Class 11",
    value: "Class 11",
  },
  {
    name: "Class 12",
    value: "Class 12",
  },
  {
    name: "Clear All",
    value: "",
  },
];

const subjectData = [
  {
    name: "English",
    value: "Upper Primary/English",
    streams: ["Upper Primary"],
  },
  {
    name: "Hindi",
    value: "Upper Primary/Hindi",
    streams: ["Upper Primary"],
  },

  {
    name: "Maths",
    value: "Upper Primary/Maths",
    streams: ["Upper Primary"],
  },
  {
    name: "Social Studies",
    value: "Upper Primary/Social Studies",
    streams: ["Upper Primary"],
  },
  {
    name: "Science",
    value: "Upper Primary/Science",
    streams: ["Upper Primary"],
  },
  {
    name: "Computer Science",
    value: "Upper Primary/Computer Science",
    streams: ["Upper Primary"],
  },
  {
    name: "English",
    value: "High School/English",
    streams: ["High School"],
  },
  {
    name: "Hindi",
    value: "High School/Hindi",
    streams: ["High School"],
  },
  {
    name: "Physics",
    value: "High School/Physics",
    streams: ["High School"],
  },
  {
    name: "Chemistry",
    value: "High School/Chemistry",
    streams: ["High School"],
  },
  {
    name: "Biology",
    value: "High School/Biology",
    streams: ["High School"],
  },
  {
    name: "Maths",
    value: "High School/Maths",
    streams: ["High School"],
  },
  {
    name: "Social Studies",
    value: "High School/Social Studies",
    streams: ["High School"],
  },
  {
    name: "Science",
    value: "High School/Science",
    streams: ["High School"],
  },

  {
    name: "Computer Science",
    value: "High School/Computer Science",
    streams: ["High School"],
  },

  {
    name: "English",
    value: "Science/English",
    streams: ["Science"],
  },
  {
    name: "Physics",
    value: "Science/Physics",
    streams: ["Science"],
  },
  {
    name: "Chemistry",
    value: "Science/Chemistry",
    streams: ["Science"],
  },
  {
    name: "Biology",
    value: "Science/Biology",
    streams: ["Science"],
  },
  {
    name: "Maths",
    value: "Science/Maths",
    streams: ["Science"],
  },
  {
    name: "Botany",
    value: "Science/Botany",
    streams: ["Science"],
  },
  {
    name: "Zoology",
    value: "Science/Zoology",
    streams: ["Science"],
  },
  {
    name: "IP",
    value: "Science/IP",
    streams: ["Science"],
  },
  {
    name: "Computer Science",
    value: "Science/Computer Science",
    streams: ["Science"],
  },
  {
    name: "Java",
    value: "Science/Java",
    streams: ["Science"],
  },
  {
    name: "English",
    value: "Commerce/English",
    streams: ["Commerce"],
  },
  {
    name: "Accounts",
    value: "Commerce/Accounts",
    streams: ["Commerce"],
  },
  {
    name: "Economics",
    value: "Commerce/Economics",
    streams: ["Commerce"],
  },
  {
    name: "Business Studies",
    value: "Commerce/Business Studies",
    streams: ["Commerce"],
  },
  {
    name: "Mathematics",
    value: "Commerce/Mathematics",
    streams: ["Commerce"],
  },
  {
    name: "Statistics",
    value: "Commerce/Statistics",
    streams: ["Commerce"],
  },
  {
    name: "IP",
    value: "Commerce/IP",
    streams: ["Commerce"],
  },
  {
    name: "Computer Science",
    value: "Commerce/Computer Science",
    streams: ["Commerce"],
  },
  {
    name: "Java",
    value: "Commerce/Java",
    streams: ["Commerce"],
  },
  {
    name: "Economics",
    value: "Humanities/Economics",
    streams: ["Humanities"],
  },
  {
    name: "History",
    value: "Humanities/History",
    streams: ["Humanities"],
  },
  {
    name: "Philosophy",
    value: "Humanities/Philosophy",
    streams: ["Humanities"],
  },
  {
    name: "Sociology",
    value: "Humanities/Sociology",
    streams: ["Humanities"],
  },
  {
    name: "Anthropology",
    value: "Humanities/Anthropology",
    streams: ["Humanities"],
  },
  {
    name: "Political Science",
    value: "Humanities/Political Science",
    streams: ["Humanities"],
  },
  {
    name: "Journalism",
    value: "Humanities/Journalism",
    streams: ["Humanities"],
  },
  {
    name: "Law",
    value: "Humanities/Law",
    streams: ["Humanities"],
  },
  {
    name: "English",
    value: "Humanities/English",
    streams: ["Humanities"],
  },
  {
    name: "Clear All",
    value: "",
    streams: [
      "Science",
      "Commerce",
      "Upper Primary",
      "High School",
      "Humanities",
    ],
  },
];

const Recommended = ({ name }) => {
  const [isViewMore, setIsViewMore] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const router = useRouter();
  const [searchShow, setSearchShow] = useState(false);
  const {
    selectedInstituteName,
    filteredCourses,
    filteredInstitutes,
    locationQuery,
    searchQuery,
    filters,
    areaLocation,
    searchByName,
  } = useSelector(selectSearch);
  const { courses, search, fields } = useSelector(selectCourse);
  const [filteredItems, setFilteredItems] = useState([]);
  console.log(router.query);

  const dispatch = useDispatch();

  const filterByLocation = async (locName) => {
    try {
      const { data } = await axios.get(
        `${host}/institute?approval=1&location=${
          locName === "Jangpura" ? "Jungpura" : locName
        }&nolimit=true`
      );
      console.log(data.message);
      setItemCount(data?.count);
      dispatch(setFilteredInstitutes(data.message));
    } catch (error) {
      toast.error(error.toString());
    }
  };

  // useEffect(() => {

  // },[])

  console.log(searchQuery, search?.type);

  // useEffect(() => {
  //   if (searchQuery?.length > 1) {
  //     filterBySearch(searchQuery, "");
  //   }
  //   if (selectedInstituteName?.length > 0) {
  //     const filterByName = courses.filter((course) => {
  //       return course.institute?.name
  //         .toLowerCase()
  //         .includes(selectedInstituteName.toLowerCase());
  //     });
  //     console.log(filterByName);
  //     dispatch(setFilteredCourses(filterByName));
  //   }
  // }, [selectedInstituteName, searchQuery, courses]);

  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const useStyle = makeStyles({
    modalBox: {
      width: "50%",
      [theme.breakpoints.down("sm")]: {
        width: "80%",
        height: "60%",
        overflowY: "scroll!important",
      },
    },
  });

  const [classOpen, setClassOpen] = useState(true);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [distanceOpen, setDistanceOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  let {
    classType,
    category,
    duration,
    // sortBy,
    rating,
    price,
    classes,
    subjects,
    board,
    exam,
    skill,
  } = filters;

  const [institutes, setInstitutes] = useState([]);
  const [allInstitutes, setAllInstitutes] = useState([]);
  const [sort, setSort] = useState(false);
  const [searchField, setSearchField] = useState("");
  const [academics, setAcademics] = useState(true);
  const [engineering, setEngineering] = useState(false);
  const [entranceExam, setEntranceExam] = useState(false);
  const [medical, setMedical] = useState(false);
  const [skillBase, setSkillBased] = useState(false);

  const [examBy, setExamBy] = useState(null);
  const [subjectBy, setSubjectBy] = useState(null);
  const [classBy, setClassBy] = useState(null);
  const [ratings, setRatings] = useState(null);

  // useEffect(() => {
  //   dispatch(fetchInstitutes());
  // }, []);

  const [locationWiseIns, setLocationWiseIns] = useState([]);

  const [instituteData, setInstituteData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [course, setCourse] = useState([]);
  const [currentInstituteCourse, setCurrentInstituteCourse] = useState([]);

  // useEffect(() => {
  //   if (searchField?.length > 1) {
  //     getCourses();
  //   }
  // }, [searchField]);

  const filterBySearch = async (text, area) => {
    // dispatch(setLocationQuery(""));
    try {
      const { data } = await axios.get(
        `${host}/institute/query?approval=1&name=${text?.replaceAll('+', '%2B')}&location=${area}&limit=50`
      );
      const sortInstitutes = data.message?.filter(
        (items) => "classmode" in items
      );

      const sortCourses = data.message?.filter((items) => "classtype" in items);
      console.log("filter search 3", data.message);
      setItemCount(data?.count);
      dispatch(setFilteredInstitutes(sortInstitutes));

      setAllInstitutes(sortInstitutes);

      dispatch(setFilteredCourses(sortCourses));

      setCourse(sortCourses);
      setCurrentInstituteCourse(sortCourses);
      //  if(area?.length > 1){
      //   filterByArea(area,sortInstitutes);
      // }
      console.log("first", data.message, sortInstitutes, sortCourses);
    } catch (error) {
      toast.error(error.toString());
    }
  };

  const filterByCategory = async (cat) => {
    try {
      const query = JSON.stringify(cat);
      const { data } = await axios.get(
        `${host}/institute?approval=1&services=${query}&location=${locationBy}&limit=50`
      );
      const sortInstitutes = data?.message;

      setItemCount(data?.count);
      console.log("filter categiry 4", data?.message, data, locationBy, query);
      // const sortCourses = data.message?.filter((items) => "classtype" in items);
      dispatch(setFilteredInstitutes(sortInstitutes));
      setAllInstitutes(sortInstitutes);
      // dispatch(
      //   setFilteredCourses(
      //     sortCourses
      //       .slice()
      //       .sort((a, b) => b?.images?.length - a?.images?.length)
      //       .sort((a, b) => b?.reviews?.length - a?.reviews?.length)
      //       .sort((a, b) => b?.rating?.length - a?.rating?.length) || []
      //   )
      // );
      //  if(area?.length > 1){
      //    filterByArea(area,sortInstitutes);
      //  }
    } catch (error) {
      toast.error(error.toString());
    }
  };

  // const allInstitutesResult = async (limit) => {
  //   try {
  //     const { data } = await axios.get(`${host}/institute?limit=${limit}`);
  //     setItemCount(data?.count);
  //     dispatch(setFilteredInstitutes(data?.message));
  //     console.log(data?.message);
  //     setAllInstitutes(data?.message);
  //   } catch (error) {
  //     toast.error(error.toString());
  //   }
  // };

  useEffect(async () => {
    if (!search?.name?.length || search === {}) {
      try {
        const { data } = await axios.get(`${host}/institute?approval=1&limit=50`);
        setItemCount(data?.count);
        dispatch(setFilteredInstitutes(data?.message));
        console.log(data?.message);
        setAllInstitutes(data?.message);
      } catch (error) {
        toast.error(error.toString());
      }
      console.log("ravi");
    }
    console.log("faahd", search);
  }, [search]);

  useEffect(() => {
    if (search?.name?.length) {
      console.log("ravi");
      if (classBy?.length) {
        console.log("fahad");
        if (classBy === "Class 11" || classBy === "Class 12") {
          const sortInstitutes = allInstitutes?.filter(
            (a) => a?.services["Senior Secondary School (Class 11-12th)"]
          );
          dispatch(setFilteredInstitutes(sortInstitutes));
          // setInstitutes(sortInstitutes);

          console.log(sortInstitutes);
        } else {
          const sortInstitutes = allInstitutes?.filter((a) =>
            a?.services[
              "Junior Secondary School (Class 6-10th)"
            ]?.classes?.includes(classBy)
          );
          dispatch(setFilteredInstitutes(sortInstitutes));
          // setInstitutes(sortInstitutes);

          console.log(sortInstitutes);
        }
      }
      if (!classBy?.length) {
        dispatch(setFilteredInstitutes(allInstitutes));
        setInstitutes(allInstitutes);
        console.log(allInstitutes);
      }
    }
  }, [allInstitutes, classBy, search]);

  useEffect(() => {
    if (!isEmpty(search)) {
      if (
        search?.type === "institute" ||
        search?.type === null ||
        search?.type === "course"
      ) {
        if (search?.name?.length > 1) {
          filterBySearch(search?.name, "");
        }
      }
      if (search?.type === "exam") {
        let json = {};
        if (search?.name?.toUpperCase() === "CUET") {
          json = {
            "Competitive Exams": {
              examsPerFields: ["Common University Entrance Test (CUET)"],
            },
          };
        } else {
          json = {
            "Competitive Exams": {
              examsPerFields: [search?.name],
            },
          };
          setExamBy({
            name: search?.name.toUpperCase(),
            value: search?.name.toUpperCase(),
          });
        }
        console.log(json);

        filterByCategory(json);
      }
    }
    if (locationQuery?.length > 1) {
      // if (!locationQuery.includes(",")) {
      filterByLocation(locationQuery);
    }
    // else {
    //   allInstitutes(10);
    // }
  }, [locationQuery, search?.type, search]);

  console.log(search);

  console.log(filteredCourses, filteredInstitutes, courses, search);

  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    const data = [];
    if (classes) {
      data.push(...data, ...classes);
    }
    if (subjects) {
      subjects.forEach((s) => {
        const subject = s.split("/")[1];
        data.push(...data, subject);
      });
    }
    // if (fields) {
    //   data.push(...data, fields);
    // }
    if (rating) {
      const rate = `${rating} Rated`;
      data.push(...data, rate);
    }
    if (category) {
      data.push(
        ...data,
        category.split("/")[1] ? category.split("/")[1] : category
      );
    }

    if (exam) {
      data.push(...data, ...exam);
    }

    let uniqueChars = [...new Set(data)];

    setSearchList(uniqueChars);
  }, [classes, subjects, category, exam, rating]);

  const [searchData, setSearchData] = useState([]);

  const removeHandle = (n) => {
    dispatch(setLocationQuery(""));

    // allInstitutes(10);

    if (classes) {
      const filterClasses = classes?.filter((c) => c !== n);
      dispatch(setClass(filterClasses));
    }
    if (subjects) {
      const filterSubject = subjects?.filter((c) => c.split("/")[1] !== n);

      dispatch(setSubjects(filterSubject));
    }
    if (exam) {
      const filterExam = exam?.filter((c) => c !== n);

      dispatch(setExam(filterExam));
    }
    if (fields) {
      dispatch(setFields(""));
    }

    if (rating) {
      dispatch(setRating(null));
    }
  };

  const [searchText, setSearchText] = useState("");
  const [ratingShow, setRatingShow] = useState(false);
  const [sortShow, setSortShow] = useState(false);
  const [locationShow, setLocationShow] = useState(false);
  const [classShow, setClassShow] = useState(false);
  const [subjectShow, setSubjectShow] = useState(false);
  const [typeShow, setTypeShow] = useState(false);
  const [examShow, setExamShow] = useState(false);

  const [dropDownClose, setDropDownClose] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", removeDropdown);
  }, []);

  const removeDropdown = (e) => {
    setRatingShow(false);
    setSortShow(false);
    setLocationShow(false);
    setClassShow(false);
    setSubjectShow(false);
    setTypeShow(false);
    setExamShow(false);
    e.stopPropagation();
  };

  // useEffect(() => {
  //   if (dropDownClose) {

  //   }
  // }, [dropDownClose]);

  console.log(dropDownClose);

  const [type, setType] = useState(null);
  const [sortBy, setSortBy] = useState("Institutes");
  const [locationBy, setLocationBy] = useState(locationQuery);

  useEffect(() => {
    if (locationQuery?.length) {
      setLocationBy(locationQuery);
    } else {
      setLocationBy(null);
    }
  }, [locationQuery]);

  const handleSearch = () => {};

  console.log(examBy);

  useEffect(() => {
    if (search?.type === "institute") {
      setSortBy("Institutes");
    }
    if (search?.type === "course") {
      setSortBy("Courses");
    }
  }, [search?.type]);

  console.log(sortData);

  const metaSection = "ravi";

  const [totalCount, setTotalCount] = useState();
  const [streams, setStreams] = useState();
  const [subjectStreams, setSubjectStreams] = useState();
  const [examStreams, setExamStreams] = useState();

  useEffect(() => {
    const run = async () => {
      let category = {};
      if (classBy) {
        category.classes = [classBy];
      }
      // if (subjectBy) {
      //   category.subjects = [subjectBy];
      // }
      if (examBy?.name) {
        category.exams = [examBy?.value];
      }
      console.log(JSON.stringify(category));

      try {
        const res = await axios.get(
          `${host}/course?category=${JSON.stringify(
            category
          )}&name=${searchText}&limit=50`
        );

        dispatch(setFilteredCourses(res?.data?.message));
        setTotalCount(res?.data?.totalCount);
        setCourse(res?.data?.message);
        setCurrentInstituteCourse(res?.data?.message);
        console.log(res?.data?.message);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (
      searchText?.length ||
      classBy?.length ||
      examBy?.name ||
      search === {} ||
      search?.name?.length === 0
    ) {
      run();
    }
  }, [searchText, classBy, examBy, search]);

  console.log(filteredCourses);

  console.log(course, totalCount, searchText);

  useEffect(() => {
    if (ratings) {
      setCurrentInstituteCourse(course.filter((a) => a.rating === ratings));
      setInstitutes(allInstitutes.filter((a) => a.rating === ratings));
      dispatch(
        setFilteredInstitutes(allInstitutes.filter((a) => a.rating === ratings))
      );
      dispatch(setFilteredCourses(course.filter((a) => a.rating === ratings)));
    }
    if (ratings === "") {
      setCurrentInstituteCourse(course);
      setInstitutes(allInstitutes);
      dispatch(setFilteredInstitutes(allInstitutes));
      dispatch(setFilteredCourses(course));
    }
  }, [course, ratings, allInstitutes]);

  useEffect(() => {
    if (searchText) {
      setInstitutes(
        allInstitutes.filter((a) =>
          a.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      dispatch(
        setFilteredInstitutes(
          allInstitutes.filter((a) =>
            a.name.toLowerCase().includes(searchText.toLowerCase())
          )
        )
      );
    }
    if (searchText === "") {
      setInstitutes(allInstitutes);
      dispatch(setFilteredInstitutes(allInstitutes));
    }
  }, [course,allInstitutes, searchText]);

  console.log(ratings, type, locationBy);

  useEffect(() => {
    if (locationBy) {
      setCurrentInstituteCourse(
        course.filter((a) =>
          a?.institute?.area_tags?.includes(locationBy.toLowerCase())
        )
      );
      setInstitutes(
        allInstitutes.filter((a) =>
          a?.area_tags?.includes(locationBy.toLowerCase())
        )
      );
      dispatch(
        setFilteredInstitutes(
          allInstitutes.filter((a) =>
            a?.area_tags?.includes(locationBy.toLowerCase())
          )
        )
      );
      dispatch(
        setFilteredCourses(
          course.filter((a) =>
            a?.institute?.area_tags?.includes(locationBy.toLowerCase())
          )
        )
      );
    }
    if (locationBy === "") {
      setCurrentInstituteCourse(course);
      setInstitutes(allInstitutes);
      dispatch(setFilteredInstitutes(allInstitutes));
      dispatch(setFilteredCourses(course));
    }
  }, [course, locationBy, allInstitutes]);

  useEffect(() => {
    console.log(type);
    if (type) {
      setCurrentInstituteCourse(course.filter((a) => a.classtype === type));
      setInstitutes(allInstitutes.filter((a) => a.classmode === type));
      dispatch(
        setFilteredInstitutes(allInstitutes.filter((a) => a.classmode === type))
      );
      dispatch(setFilteredCourses(course.filter((a) => a.classtype === type)));
    }
    if (type === "") {
      setCurrentInstituteCourse(course);
      setInstitutes(allInstitutes);
      dispatch(setFilteredInstitutes(allInstitutes));
      dispatch(setFilteredCourses(course));
    }
  }, [course, type, allInstitutes]);

  // useEffect(() => {
  //   console.log(locationBy);
  //   if (locationBy) {
  //     setCurrentInstituteCourse(
  //       course.filter((a) =>
  //         a.institute.area_tags.includes(locationBy.toLowerCase())
  //       )
  //     );
  //     setInstitutes(allInstitutes.filter((a) =>
  //     a.area_tags.includes(locationBy.toLowerCase())
  //   ))
  //   }
  //   if (!locationBy) {
  //     setCurrentInstituteCourse(course);
  //     setInstitutes(allInstitutes);
  //   }
  // }, [course, locationBy, allInstitutes]);

  // useEffect(() => {
  //   console.log(locationBy);
  //   if (locationBy) {
  //     setCurrentInstituteCourse(
  //       course.filter((a) =>
  //         a.institute.area_tags.includes(locationBy.toLowerCase())
  //       )
  //     );
  //   }
  //   if (!locationBy) {
  //     setCurrentInstituteCourse(course);
  //     // setInstitutes(allInstitutes);
  //   }
  // }, [course, locationBy, allInstitutes]);

  const [topLocationData, setTopLocationData] = useState([]);

  useEffect(() => {
    try {
      axios.get(`${host}/locations?limit=100`).then(function (response) {
        setTopLocationData(response.data.message);
        console.log(response.data.message);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const [locations, setLocations] = useState([]);

  console.log(topLocationData);

  useEffect(() => {
    let uniqueIds = [];

    const unique = topLocationData?.filter((element) => {
      const isDuplicate = uniqueIds.includes(element.name);

      if (!isDuplicate) {
        uniqueIds.push({
          name: element.name,
          value: element.name,
        });

        return true;
      }

      return false;
    });

    uniqueIds.push({
      name: "Delhi",
      value: "Delhi",
    });
    uniqueIds.push({
      name: "Clear All",
      value: "",
    });

    setLocations(uniqueIds);
    console.log(uniqueIds);
  }, [topLocationData]);

  console.log(locationQuery);
  let domNode = useClickOutside(() => {
    setSearchShow(false);
  });
  const { modalBox } = useStyle();
  return (
    // <div>
    //   <div className="divide-y divide-gray/20">
    //     <div className="md:px-24 px-5 md:py-10 py-5">
    //       <p className="text-[36px] text-[#101828] font-bold md:block hidden mb-10">
    //         Result for you
    //       </p>

    //       <div className="flex justify-between ">
    //         <div className="grid grid-cols-2 gap-1  md:grid-cols-5 md:gap-3 ">
    //           <button
    //             onClick={() => setOpen(true)}
    //             className="bg-primary py-2 px-5 rounded-md text-white"
    //           >
    //             FILTER
    //           </button>
    //           {searchList.map((s, i) => (
    //             <div
    //               key={i}
    //               onClick={() => {
    //                 removeHandle(s);
    //               }}
    //               className="border-primary border-2  py-2 px-3 md:ml-2 rounded-md text-primary flex items-center justify-between"
    //             >
    //               <p className="mr-2"> {s}</p>
    //               <CloseOutlined className="cursor-pointer" />
    //             </div>
    //           ))}
    //         </div>
    //         <div>
    //           <Dropdown primaryVariant={true} placeholderText={"Sort By"}>
    //             <GroupRadio
    //               onChange={(e) => dispatch(setSortBy(e))}
    //               options={Data.sortBy}
    //             />
    //           </Dropdown>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="md:px-24 md:pt-10 px-5 pt-5">
    //       <div>
    //         {router.query.toplocation ? (
    //           <p className="text-primary font-bold text-[36px]">
    //             {`${fields || exam?.toString() || ""} Coaching Institutes`}{" "}
    //             in{" "}
    //             <span className="text-primary font-bold">
    //             {locationQuery ? capitalizeFirst(locationQuery) : "all"}
    //             </span>{" "}
    //           </p>
    //         ) : (
    //           <p className="text-[ #101828] font-bold text-[36px]">
    //             {fields || exam?.toString() || ""}{" "}
    //             {search.type === "course" ? "Courses" : "Coaching Institutes"}{" "}
    //             in{" "}
    //             <span className="text-primary font-bold">
    //               {capitalizeFirst(locationQuery) || "all"}
    //             </span>{" "}
    //           </p>
    //         )}
    //         {search.type === "course" ? (
    //           <p className="md:w-[720px] text-[#667085] text-[18px] mt-3">
    //             There are {filteredCourses.length} Courses in{" "}
    //             {locationQuery ? `${capitalizeFirst(locationQuery)} area` : "Our site"}
    //           </p>
    //         ) : (
    //           <p className="md:w-[720px] text-[#667085] text-[18px] mt-3">
    //             There {itemCount} Institutes in{" "}
    //             {locationQuery ? `${capitalizeFirst(locationQuery)} area` : "Our site"}
    //           </p>
    //         )}
    //       </div>

    //       <div className="">
    //         <div className="">
    //           {/* <h1 className='text-2xl sm:text-4xl my-10'>Institutes near you</h1> */}
    //           <RecommendedCard />
    //           {/* <div
    //       onClick={() => {
    //         const itemHandler = () => {
    //           if (!isViewMore) {
    //             setItemCount(30)
    //           } else {
    //             setItemCount(15)
    //           }
    //         }
    //         itemHandler()

    //         setIsViewMore(!isViewMore)
    //       }}
    //       className='text-xl text-primary flex items-center space-x-2 cursor-pointer justify-center'
    //     >
    //       <p>{isViewMore ? 'View Less' : 'View More'}</p>
    //       {isViewMore ? (
    //         <UpOutlined className='flex items-center text-sm' />
    //       ) : (
    //         <DownOutlined className='flex items-center text-sm' />
    //       )}
    //     </div> */}
    //         </div>
    //       </div>
    //     </div>
    //     <Modal
    //       open={open}
    //       onClose={() => setOpen(false)}
    //       aria-labelledby="modal-modal-title"
    //       aria-describedby="modal-modal-description"
    //     >
    //       <Box sx={style} className={modalBox}>
    //         <div className="divide-y divide-gray/20">
    //           <div className="flex justify-between px-5 py-3 items-center">
    //             <p className="text-[27px] text-[#333333] font-semibold">
    //               Filters
    //             </p>
    //             <CloseOutlined
    //               onClick={() => setOpen(false)}
    //               className="text-[20px]"
    //             />
    //           </div>
    //           <div className="p-3 md:block hidden">
    //             <div className="grid grid-cols-9 gap-x-5">
    //               <div className="col-span-2 bg-[#F4EBFF] ">
    //                 <div className="pl-2 py-2">
    //                   <div
    //                     onClick={() => {
    //                       setClassOpen(true);
    //                       setSubjectOpen(false);
    //                       setLocationOpen(false);
    //                       setDistanceOpen(false);
    //                       setRatingOpen(false);
    //                       setPriceOpen(false);
    //                     }}
    //                     className={`pl-2 mb-2 ${
    //                       classOpen && "bg-white border-[#7F56D9] border-l-4"
    //                     } cursor-pointer`}
    //                   >
    //                     <p className="text-[14px] p-2">Class</p>
    //                   </div>
    //                   <div
    //                     onClick={() => {
    //                       setSubjectOpen(true);
    //                       setClassOpen(false);
    //                       setLocationOpen(false);
    //                       setDistanceOpen(false);
    //                       setRatingOpen(false);
    //                       setPriceOpen(false);
    //                     }}
    //                     className={`pl-2 mb-2 ${
    //                       subjectOpen && "bg-white border-[#7F56D9] border-l-4"
    //                     } cursor-pointer`}
    //                   >
    //                     <p className="text-[14px] p-2">Subject</p>
    //                   </div>
    //                   <div
    //                     onClick={() => {
    //                       setSubjectOpen(false);
    //                       setClassOpen(false);
    //                       setLocationOpen(false);
    //                       setDistanceOpen(false);
    //                       setPriceOpen(false);
    //                       setRatingOpen(true);
    //                     }}
    //                     className={`pl-2 mb-2 ${
    //                       ratingOpen && "bg-white border-[#7F56D9] border-l-4"
    //                     } cursor-pointer`}
    //                   >
    //                     <p className="text-[14px] p-2">Ratings</p>
    //                   </div>
    //                   <div
    //                     onClick={() => {
    //                       setSubjectOpen(false);
    //                       setClassOpen(false);
    //                       setLocationOpen(false);
    //                       setDistanceOpen(true);
    //                       setRatingOpen(false);
    //                       setPriceOpen(false);
    //                     }}
    //                     className={`pl-2 mb-2 ${
    //                       distanceOpen && "bg-white border-[#7F56D9] border-l-4"
    //                     } cursor-pointer`}
    //                   >
    //                     <p className="text-[14px] p-2">Distance</p>
    //                   </div>
    //                   <div
    //                     onClick={() => {
    //                       setSubjectOpen(false);
    //                       setClassOpen(false);
    //                       setLocationOpen(false);
    //                       setDistanceOpen(false);
    //                       setRatingOpen(false);
    //                       setPriceOpen(true);
    //                     }}
    //                     className={`pl-2 mb-2 ${
    //                       priceOpen && "bg-white border-[#7F56D9] border-l-4"
    //                     } cursor-pointer`}
    //                   >
    //                     <p className="text-[14px] p-2">Price</p>
    //                   </div>

    //                   <div
    //                     onClick={() => {
    //                       setSubjectOpen(false);
    //                       setClassOpen(false);
    //                       setLocationOpen(true);
    //                       setDistanceOpen(false);
    //                       setPriceOpen(false);
    //                       setRatingOpen(false);
    //                     }}
    //                     className={`pl-2 mb-2 ${
    //                       locationOpen && "bg-white border-[#7F56D9] border-l-4"
    //                     } cursor-pointer`}
    //                   >
    //                     <p className="text-[14px] p-2">Locations</p>
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="col-span-7">
    //                 <div
    //                   className={`flex border rounded-xl  items-center justify-center space-x-2 px-2 mb-1 border-primary w-2/4 ml-auto
    //     }`}
    //                 >
    //                   <input
    //                     className=" outline-none w-full p-2 "
    //                     type="text"
    //                     defaultValue={searchField}
    //                     onChange={(e) => setSearchField(e.target.value)}
    //                     placeholder="Search"
    //                   />

    //                   <FiSearch
    //                     onClick={() => {}}
    //                     className={`bg-primary p-1 rounded-full text-white cursor-pointer`}
    //                     size={26}
    //                   />
    //                 </div>
    //                 <div className="p-3 overflow-y-scroll h-[200px]">
    //                   {classOpen && (
    //                     <div className="divide-y divide-gray/20">
    //                       <div
    //                         onClick={() => {
    //                           setAcademics(!academics);
    //                           setEngineering(false);
    //                           setMedical(false);
    //                           setSkillBased(false);
    //                           setEntranceExam(false);
    //                         }}
    //                         className={`pl-2 mb-2 cursor-pointer flex items-center justify-between`}
    //                       >
    //                         <p className="text-[16px] font-[600px] p-2">
    //                           Academics
    //                         </p>
    //                         {academics ? <UpOutlined /> : <DownOutlined />}
    //                       </div>
    //                       {academics && (
    //                         <GroupCheckbox
    //                           checkedState={classes[0]}
    //                           onChange={(v) => {
    //                             dispatch(setClass([]));
    //                             dispatch(setExam([]));
    //                             dispatch(setCategory(""));
    //                             dispatch(setFields(v?.toString()));
    //                             dispatch(setClass(v));
    //                             let json = {};
    //                             if (
    //                               v?.toString() == "Class-11" ||
    //                               v?.toString() == "Class-12"
    //                             ) {
    //                               json = {
    //                                 "Senior Secondary School (Class 11-12th)": {
    //                                   streams: ["Science"],
    //                                 },
    //                               };
    //                             } else {
    //                               json = {
    //                                 "Junior Secondary School (Class 6-10th)": {
    //                                   classes: [
    //                                     v?.toString().replace("-", " "),
    //                                   ],
    //                                 },
    //                               };
    //                             }
    //                             filterByCategory(json,"");
    //                             dispatch(setLocationQuery(""));
    //                             // locationQuery?.length > 0
    //                             //   ? router.push(
    //                             //       `/${v}-coaching-institutes-in-${locationQuery
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(/ /g, "-")}`
    //                             //     )
    //                             //   : router.push(
    //                             //       `/${v}-coaching-institutes-in-delhi`
    //                             //     );
    //                           }}
    //                           options={Data.classNames}
    //                         />
    //                       )}
    //                       <div
    //                         onClick={() => {
    //                           setEntranceExam(!entranceExam);
    //                           setAcademics(false);
    //                           setEngineering(false);
    //                           setMedical(false);
    //                           setSkillBased(false);
    //                         }}
    //                         className={`pl-2 mb-2 cursor-pointer flex items-center justify-between`}
    //                       >
    //                         <p className="text-[16px] font-[600px] p-2">
    //                           Entrance Exams
    //                         </p>
    //                         {entranceExam ? <UpOutlined /> : <DownOutlined />}
    //                       </div>
    //                       {entranceExam && (
    //                         <ExamCheckbox
    //                           checkedState={exam[0]}
    //                           onChange={(v) => {
    //                             dispatch(setExam([]));
    //                             dispatch(setClass([]));
    //                             dispatch(setCategory(""));
    //                             dispatch(setFields(v?.toString()));
    //                             dispatch(setExam(v));
    //                             let json = {};
    //                             if(v?.toString() === "CUET"){
    //                               json = {
    //                                 "Competitive Exams": {
    //                                   examsPerFields: ["Common University Entrance Test (CUET)"],
    //                                 },
    //                               };
    //                             }
    //                             else{
    //                               json = {
    //                                 "Competitive Exams": {
    //                                   examsPerFields: [v?.toString()],
    //                                 },
    //                               };
    //                             }
    //                             filterByCategory(json,"");
    //                             dispatch(setLocationQuery(""));
    //                             // locationQuery?.length > 0
    //                             //   ? router.push(
    //                             //       `/${v
    //                             //         ?.toString()
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(
    //                             //           / /g,
    //                             //           "-"
    //                             //         )}-coaching-institutes-in-${locationQuery
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(/ /g, "-")}`
    //                             //     )
    //                             //   : router.push(
    //                             //       `/${v
    //                             //         ?.toString()
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(
    //                             //           / /g,
    //                             //           "-"
    //                             //         )}-coaching-institutes-in-delhi`
    //                             //     );
    //                           }}
    //                           options={Data.entranceExam}
    //                         />
    //                       )}
    //                       <div
    //                         onClick={() => {
    //                           setAcademics(false);
    //                           setEngineering(!engineering);
    //                           setMedical(false);
    //                           setSkillBased(false);
    //                           setEntranceExam(false);
    //                         }}
    //                         className={`pl-2 mb-2 cursor-pointer flex items-center justify-between`}
    //                       >
    //                         <p className="text-[16px] font-[600px] p-2">
    //                           Engineering
    //                         </p>
    //                         {engineering ? <UpOutlined /> : <DownOutlined />}
    //                       </div>
    //                       {engineering && (
    //                         <ExamCheckbox
    //                           checkedState={exam[0]}
    //                           onChange={(v) => {
    //                             dispatch(setExam([]));
    //                             dispatch(setClass([]));
    //                             dispatch(setCategory(""));
    //                             dispatch(setFields(v?.toString()));
    //                             dispatch(setExam(v));
    //                             const json = {
    //                               "Competitive Exams": {
    //                                 examsPerFields: [v?.toString()],
    //                               },
    //                             };
    //                             filterByCategory(json,"");
    //                             dispatch(setLocationQuery(""));
    //                             // locationQuery?.length > 0
    //                             //   ? router.push(
    //                             //       `/${v
    //                             //         ?.toString()
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(
    //                             //           / /g,
    //                             //           "-"
    //                             //         )}-coaching-institutes-in-${locationQuery
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(/ /g, "-")}`
    //                             //     )
    //                             //   : router.push(
    //                             //       `/${v
    //                             //         ?.toString()
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(
    //                             //           / /g,
    //                             //           "-"
    //                             //         )}-coaching-institutes-in-delhi`
    //                             //     );
    //                           }}
    //                           options={Data.engineeringExam}
    //                         />
    //                       )}
    //                       <div
    //                         onClick={() => {
    //                           setAcademics(false);
    //                           setEngineering(false);
    //                           setMedical(!medical);
    //                           setSkillBased(false);
    //                           setEntranceExam(false);
    //                         }}
    //                         className={`pl-2 mb-2 cursor-pointer flex items-center justify-between`}
    //                       >
    //                         <p className="text-[16px] font-[600px] p-2">
    //                           Medical
    //                         </p>
    //                         {medical ? <UpOutlined /> : <DownOutlined />}
    //                       </div>
    //                       {medical && (
    //                         <ExamCheckbox
    //                           checkedState={exam[0]}
    //                           onChange={(v) => {
    //                             dispatch(setExam([]));
    //                             dispatch(setExam(v));
    //                             dispatch(setCategory(""));
    //                             dispatch(setFields(v?.toString()));
    //                             dispatch(setClass([]));
    //                             const json = {
    //                               "Competitive Exams": {
    //                                 examsPerFields: [v?.toString()],
    //                               },
    //                             };
    //                             filterByCategory(json,"");
    //                             dispatch(setLocationQuery(""));
    //                             // locationQuery?.length > 0
    //                             //   ? router.push(
    //                             //       `/${v
    //                             //         ?.toString()
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(
    //                             //           / /g,
    //                             //           "-"
    //                             //         )}-coaching-institutes-in-${locationQuery
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(/ /g, "-")}`
    //                             //     )
    //                             //   : router.push(
    //                             //       `/${v
    //                             //         ?.toString()
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(
    //                             //           / /g,
    //                             //           "-"
    //                             //         )}-coaching-institutes-in-delhi`
    //                             //     );
    //                           }}
    //                           options={Data.medicalExam}
    //                         />
    //                       )}
    //                       <div
    //                         onClick={() => {
    //                           setAcademics(false);
    //                           setEngineering(false);
    //                           setMedical(false);
    //                           setEntranceExam(false);
    //                           setSkillBased(!skillBase);
    //                         }}
    //                         className={`pl-2 mb-2 cursor-pointer flex items-center justify-between`}
    //                       >
    //                         <p className="text-[16px] font-[600px] p-2">
    //                           Skill Based
    //                         </p>
    //                         {skillBase ? <UpOutlined /> : <DownOutlined />}
    //                       </div>
    //                       {skillBase && (
    //                         <ExamCheckbox
    //                           checkedState={exam[0]}
    //                           onChange={(v) => {
    //                             dispatch(setExam([]));
    //                             dispatch(setExam(v));
    //                             dispatch(setCategory(""));
    //                             dispatch(setFields(v?.toString()));
    //                             dispatch(setClass([]));
    //                             const json = {
    //                               "Skill Based Courses": {
    //                                 skills: [v?.toString()],
    //                               },
    //                             };
    //                             filterByCategory(json,"");
    //                             dispatch(setLocationQuery(""));
    //                             // locationQuery?.length > 0
    //                             //   ? router.push(
    //                             //       `/${v
    //                             //         ?.toString()
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(
    //                             //           / /g,
    //                             //           "-"
    //                             //         )}-coaching-institutes-in-${locationQuery
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(/ /g, "-")}`
    //                             //     )
    //                             //   : router.push(
    //                             //       `/${v
    //                             //         ?.toString()
    //                             //         ?.toLowerCase()
    //                             //         ?.replace(
    //                             //           / /g,
    //                             //           "-"
    //                             //         )}-coaching-institutes-in-delhi`
    //                             //     );
    //                           }}
    //                           options={Data.skillBased}
    //                         />
    //                       )}
    //                     </div>
    //                   )}
    //                   {subjectOpen && (
    //                     <>
    //                       <div className=" p-4 rounded-md mb-5 ">
    //                         <div className="flex ">
    //                           {Data.subjects.slice(0, 2).map((item, i) => (
    //                             <SubjectGroupCheckbox
    //                               key={i}
    //                               groupTitle={item.subjectType}
    //                               dropdownEffect={false}
    //                               options={item.subjectList}
    //                               checkedState={subjects[0]}
    //                               onChange={(v) => {
    //                                 dispatch(setSubjects([]));
    //                                 dispatch(setFields(v?.toString()));
    //                                 dispatch(setSubjects(v));
    //                                 const sub = v?.toString().split("/")[1];
    //                                 const json = {
    //                                   "Junior Secondary School (Class 6-10th)":
    //                                     {
    //                                       subjects: [
    //                                         sub?.replace("-", " "),
    //                                       ],
    //                                     },
    //                                 };
    //                                 filterByCategory(json,"");
    //                                 dispatch(setLocationQuery(""));
    //                                 // locationQuery?.length > 0 ? router.push(
    //                                 //   `/${v}-Coaching-Institutes-in-${locationQuery?.replace(/ /g,"-")}`
    //                                 // ): router.push(
    //                                 //   `/${v}-Coaching-Institutes-in-Delhi`
    //                                 // );
    //                               }}
    //                             />
    //                           ))}
    //                         </div>
    //                         <Divider type="horizontal" />
    //                         <div className="flex ">
    //                           {Data.subjects.slice(2, 4).map((item, i) => (
    //                             <SubjectGroupCheckbox
    //                               key={i}
    //                               groupTitle={item.subjectType}
    //                               dropdownEffect={false}
    //                               options={item.subjectList}
    //                               checkedState={subjects[0]}
    //                               onChange={(v) => {
    //                                 dispatch(setSubjects([]));
    //                                 dispatch(setFields(v?.toString()));
    //                                 dispatch(setSubjects(v));
    //                                 const grp = v?.toString().split("/")[0];
    //                                 const sub = v?.toString().split("/")[1];
    //                                 const json = {
    //                                   "Senior Secondary School (Class 11-12th)":
    //                                     { "subjectsForStreams": { [grp]: [sub] } },
    //                                 };
    //                                 filterByCategory(json,"");
    //                                 dispatch(setLocationQuery(""));
    //                                 // locationQuery?.length > 0
    //                                 //   ? router.push(
    //                                 //       `/${v
    //                                 //         ?.toString()
    //                                 //         ?.toLowerCase()
    //                                 //         ?.replace(
    //                                 //           / /g,
    //                                 //           "-"
    //                                 //         )}-coaching-institutes-in-${locationQuery
    //                                 //         ?.toLowerCase()
    //                                 //         ?.replace(/ /g, "-")}`
    //                                 //     )
    //                                 //   : router.push(
    //                                 //       `/${v
    //                                 //         ?.toString()
    //                                 //         ?.toLowerCase()
    //                                 //         ?.replace(
    //                                 //           / /g,
    //                                 //           "-"
    //                                 //         )}-coaching-institutes-in-delhi`
    //                                 //     );
    //                               }}
    //                             />
    //                           ))}
    //                         </div>
    //                         <Divider type="horizontal" />
    //                         <div className="flex ">
    //                           {Data.subjects.slice(4, 6).map((item, i) => (
    //                             <SubjectGroupCheckbox
    //                               key={i}
    //                               groupTitle={item.subjectType}
    //                               dropdownEffect={false}
    //                               options={item.subjectList}
    //                               checkedState={subjects[0]}
    //                               onChange={(v) => {
    //                                 dispatch(setSubjects([]));
    //                                 dispatch(setFields(v?.toString()));
    //                                 dispatch(setSubjects(v));
    //                                 const grp = v?.toString().split("/")[0];
    //                                 const sub = v?.toString().split("/")[1];
    //                                 const json = {
    //                                   "Senior Secondary School (Class 11-12th)":
    //                                     { "subjectsForStreams": { [grp]: [sub] } },
    //                                 };
    //                                 filterByCategory(json,"");
    //                                 dispatch(setLocationQuery(""));
    //                                 // locationQuery?.length > 0 ? router.push(
    //                                 //   `/${v}-Coaching-Institutes-in-${locationQuery?.replace(/ /g,"-")}`
    //                                 // ): router.push(
    //                                 //   `/${v}-Coaching-Institutes-in-Delhi`
    //                                 // );
    //                               }}
    //                             />
    //                           ))}
    //                         </div>
    //                       </div>
    //                     </>
    //                   )}
    //                   {ratingOpen && (
    //                     <RatingSlider
    //                       ratings={rating}
    //                       onChange={(e) => {
    //                         dispatch(setRating(e));
    //                       }}
    //                     />
    //                   )}
    //                   {priceOpen && (
    //                     <PriceSlider onChange={(e) => dispatch(setPrice(e))} />
    //                   )}
    //                   {distanceOpen && (
    //                     <DistanceSlider
    //                       onChange={(e) => {
    //                         dispatch(setRating(e));
    //                       }}
    //                     />
    //                   )}
    //                   {locationOpen && <TopLocation></TopLocation>}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="p-3 block md:hidden">
    //             <MobileFilterBar filterByCategory={filterByCategory}/>
    //           </div>
    //         </div>
    //       </Box>
    //     </Modal>
    //   </div>
    // </div>
    <div className="p-5 sm:p-10 ">
      <div className="md:flex justify-between items-center my-3">
        <p className=" md:text-[48px] text-[30px] text-[#1D2939]">
          Search Result of{" "}
          <span className="text-primary">{search?.name || locationQuery}</span>
        </p>
        <div className="search relative">
          {" "}
          <div
            className={` shrink md:w-96 px-3 py-2    rounded-md text-base font-normal text-slate bg-white bg-clip-padding bg-no-repeat border-2 border-solid border-light-gray first-letter:transition ease-in-out flex items-center justify-between `}
          >
            <input
              type="text"
              placeholder="Search Institute"
              autoFocus
              className="text-xl bg-white  focus:outline-none w-full"
              defaultValue={searchText || ""}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
            <FiSearch
              onClick={(e) => {
                handleSearch();
                e.stopPropagation();
              }}
              className="text-gray text-xl cursor-pointer"
            />
          </div>
          {searchText.length > 0 ? (
            <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-1 divide-y divide-gray/20 h-[300px] overflow-y-scroll" role="none">
                {institutes?.map((element, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`flex text-[#000000]
                         justify-between cursor-pointer  items-center`}
                      onClick={() => {
                        // setSortBy(element.name);
                        router.push(`/institute/${element.slug}`)
                      }}
                    >
                      <img
                        src={
                          element?.images?.length
                            ? `https://cdn.ostello.co.in/${element?.images[0]?.key}`
                            : instituteImage.src
                        }
                        className="w-[40px] h-[40px]"
                        alt=""
                     
                      />
                      <p className={`  text-[15px]  px-4 py-2 `}>
                        {element.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className=" md:flex grid grid-cols-2 gap-4  items-center my-5">
        <div className="relative  my-1">
          <p
            onClick={(e) => {
              setSortShow(!sortShow);
              setRatingShow(false);
              setTypeShow(false);
              setLocationShow(false);
              setSubjectShow(false);
              setExamShow(false);
              setExamShow(false);
              setClassShow(false);
              e.stopPropagation();
            }}
            className="flex  justify-between md:w-44 items-center  cursor-pointer border-4 border-solid border-primary  p-3 "
          >
            <p className={` text-primary text-[16px] font-bold `}>
              {sortBy ? sortBy : "Sort By"}
            </p>
            {sortShow ? (
              <GoChevronDown className="ml-1 text-primary text-[16px] rotate-180" />
            ) : (
              <GoChevronDown className="ml-1 text-primary text-[16px]" />
            )}
          </p>
          {sortShow ? (
            <>
              {/* <div className="arrow  absolute h-[20px]  w-[20px] bg-black rotate-45" id="arrow"/> */}
              <div className="absolute left-0 z-10 mt-5 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1 divide-y divide-gray/20" role="none">
                  {sortData?.map((element, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`flex ${
                          sortBy === element.name
                            ? "text-primary"
                            : "text-[#000000]"
                        }   justify-between cursor-pointer  items-center`}
                        onClick={() => {
                          setSortBy(element.name);
                        }}
                      >
                        <p className={`  text-[16px]  px-4 py-2 `}>
                          {element.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="relative  my-1">
          <p
            onClick={(e) => {
              setLocationShow(!locationShow);
              setSortShow(false);
              setRatingShow(false);
              setTypeShow(false);
              setSubjectShow(false);
              setExamShow(false);
              setClassShow(false);
              e.stopPropagation();
            }}
            className="flex w-full justify-between  items-center  cursor-pointer border-2 border-solid border-light-gray  p-3 "
          >
            <p className={` text-[#000000] text-[16px] `}>
              {locationBy ? locationBy : "Location"}
            </p>
            {locationShow ? (
              <GoChevronDown className="ml-1 text-[16px] rotate-180" />
            ) : (
              <GoChevronDown className="ml-1 text-[16px]" />
            )}
          </p>
          {locationShow ? (
            <>
              {/* <div className="arrow  absolute h-[20px]  w-[20px] bg-black rotate-45" id="arrow"/> */}
              <div className="absolute left-0 z-10 mt-5 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div
                  className="py-1 divide-y divide-gray/20 h-[400px] overflow-y-scroll"
                  role="none"
                >
                  {locations?.map((element, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`flex ${
                          locationBy === element.value
                            ? "text-primary"
                            : "text-[#000000]"
                        }   justify-between cursor-pointer  items-center`}
                        onClick={() => {
                          setLocationBy(element.value);
                          const json = {};
                          // filterByCategory(json, element.value);
                        }}
                      >
                        <p className={`  text-[16px]  px-4 py-2 `}>
                          {element.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="relative  my-1">
          <p
            onClick={(e) => {
              setTypeShow(!typeShow);
              setRatingShow(false);
              setLocationShow(false);
              setSubjectShow(false);
              setExamShow(false);
              setExamShow(false);
              setClassShow(false);
              setSortShow(false);
              e.stopPropagation();
            }}
            className="flex w-full justify-between w-44 items-center  cursor-pointer border-2 border-solid border-light-gray  p-3 "
          >
            <p className={` text-[#000000] text-[16px] `}>
              {type
                ? type === 3
                  ? "Hybrid"
                  : type === 2
                  ? "Offline"
                  : "Online"
                : "Select Type"}
            </p>
            {typeShow ? (
              <GoChevronDown className="ml-1 text-[16px] rotate-180" />
            ) : (
              <GoChevronDown className="ml-1 text-[16px]" />
            )}
          </p>
          {typeShow ? (
            <>
              {/* <div className="arrow  absolute h-[20px]  w-[20px] bg-black rotate-45" id="arrow"/> */}
              <div className="absolute left-0 z-10 mt-5 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1 divide-y divide-gray/20" role="none">
                  {modeData?.map((element, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`flex ${
                          type === element.value
                            ? "text-primary"
                            : "text-[#000000]"
                        }   justify-between cursor-pointer  items-center`}
                        onClick={() => {
                          setType(element.value);
                        }}
                      >
                        <p className={`  text-[16px]  px-4 py-2 `}>
                          {element.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>

        {search?.type !== "exam" ? (
          <>
            <div className="relative  my-1">
              <p
                onClick={(e) => {
                  setClassShow(!classShow);
                  setTypeShow(false);
                  setRatingShow(false);
                  setLocationShow(false);
                  setSubjectShow(false);
                  setExamShow(false);
                  setExamShow(false);
                  setSortShow(false);
                  e.stopPropagation();
                }}
                className="flex w-full justify-between w-44 items-center  cursor-pointer border-2 border-solid border-light-gray  p-3 "
              >
                <p className={` text-[#000000] text-[16px] `}>
                  {classBy ? classBy : "Select Class"}
                </p>
                {classShow ? (
                  <GoChevronDown className="ml-1 text-[16px] rotate-180" />
                ) : (
                  <GoChevronDown className="ml-1 text-[16px]" />
                )}
              </p>
              {classShow ? (
                <>
                  {/* <div className="arrow  absolute h-[20px]  w-[20px] bg-black rotate-45" id="arrow"/> */}
                  <div className="absolute left-0 z-10 mt-5 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div
                      className="py-1 divide-y divide-gray/20 max-h-[400px] overflow-y-scroll"
                      role="none"
                    >
                      {classData?.map((element, idx) => {
                        return (
                          <div
                            key={idx}
                            className={`flex ${
                              classBy === element.value
                                ? "text-primary"
                                : "text-[#000000]"
                            }   justify-between cursor-pointer  items-center`}
                            onClick={() => {
                              setClassBy(element.value);

                              if (!search?.name?.length || search === {}) {
                                let json = {};
                                if (element.value.length) {
                                  if (
                                    element?.value?.toString() == "Class 11" ||
                                    element?.value?.toString() == "Class 12"
                                  ) {
                                    json = {
                                      "Senior Secondary School (Class 11-12th)":
                                        {
                                          streams: [
                                            "Science",
                                            "Commerce",
                                            "Arts/Humanities",
                                          ],
                                        },
                                    };
                                  } else {
                                    json = {
                                      "Junior Secondary School (Class 6-10th)":
                                        {
                                          classes: [element?.value?.toString()],
                                        },
                                    };
                                  }
                                }
                                filterByCategory(json);
                              }
                            }}
                          >
                            <p className={`  text-[16px]  px-4 py-2 `}>
                              {element.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="relative  my-1">
              {/* subjects name */}

              {/* <p
                onClick={(e) => {
                  setSubjectShow(!subjectShow);
                  setExamShow(false);
                  setTypeShow(false);
                  setExamShow(false);
                  setRatingShow(false);
                  setLocationShow(false);
                  setClassShow(false);
                  setSortShow(false);
                  e.stopPropagation();
                }}
                className="flex w-full justify-between w-44 items-center  cursor-pointer border-2 border-solid border-light-gray  p-3 "
              >
                <p className={` text-[#000000] text-[16px] `}>
                  {" "}
                  {subjectBy ? subjectBy.split("/")[1] : "Select Subject"}
                </p>
                {subjectShow ? (
                  <GoChevronDown className="ml-1 text-[16px] rotate-180" />
                ) : (
                  <GoChevronDown className="ml-1 text-[16px]" />
                )}
              </p> */}

              {subjectShow ? (
                <>
                  {/* <div className="arrow  absolute h-[20px]  w-[20px] bg-black rotate-45" id="arrow"/> */}
                  <div className="absolute left-0 z-10 mt-5 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div
                      className="py-1 divide-y divide-gray/20 max-h-[400px] overflow-y-scroll"
                      role="none"
                    >
                      {subjectData
                        .filter((a) => a?.streams?.includes(subjectStreams))
                        ?.map((element, idx) => {
                          return (
                            <div
                              key={idx}
                              className={`flex ${
                                subjectBy === element.value
                                  ? "text-primary"
                                  : "text-[#000000]"
                              }   justify-between cursor-pointer  items-center`}
                              onClick={() => {
                                setSubjectBy(element.value);

                                if (
                                  streams === "Humanities" ||
                                  streams === "Commerce"
                                ) {
                                  let json;
                                  if (element.value.length) {
                                    json = {
                                      "Senior Secondary School (Class 11-12th)":
                                        {
                                          subjectsForStreams: {
                                            [element.streams]: [element.name],
                                          },
                                        },
                                    };
                                  }
                                  if (!element.value.length) {
                                    console.log(element.value, streams);
                                    json = {
                                      "Senior Secondary School (Class 11-12th)":
                                        {
                                          streams: [streams],
                                        },
                                    };
                                  }
                                  filterByCategory(json);
                                }
                              }}
                            >
                              <p className={`  text-[16px]  px-4 py-2 `}>
                                {element.name}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          ""
        )}

        {search?.type === "exam" ? (
          <div className="relative  my-1">
            <p
              onClick={(e) => {
                setSubjectShow(false);
                setExamShow(!examShow);
                setTypeShow(false);
                setRatingShow(false);
                setLocationShow(false);
                setClassShow(false);
                setSortShow(false);
                e.stopPropagation();
              }}
              className="flex w-full justify-between w-44 items-center  cursor-pointer border-2 border-solid border-light-gray  p-3 "
            >
              <p className={` text-[#000000] text-[16px] `}>
                {examBy.name ? examBy.name : "Select Exams"}
              </p>
              {examShow ? (
                <GoChevronDown className="ml-1 text-[16px] rotate-180" />
              ) : (
                <GoChevronDown className="ml-1 text-[16px]" />
              )}
            </p>
            {examShow ? (
              <>
                {/* <div className="arrow  absolute h-[20px]  w-[20px] bg-black rotate-45" id="arrow"/> */}
                <div className="absolute left-0 z-10 mt-5 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div
                    className="py-1 divide-y divide-gray/20 max-h-[400px] overflow-y-scroll"
                    role="none"
                  >
                    {examsData?.map((element, idx) => {
                      return (
                        <div
                          key={idx}
                          className={`flex ${
                            examBy.name === element.value
                              ? "text-primary"
                              : "text-[#000000]"
                          }   justify-between cursor-pointer  items-center`}
                          onClick={() => {
                            setExamBy(element);
                            const json = {
                              "Competitive Exams": {
                                examsPerFields: [
                                  element.instituteValue?.toString(),
                                ],
                              },
                            };
                            filterByCategory(json);
                          }}
                        >
                          <p className={`  text-[16px]  px-4 py-2 `}>
                            {element.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        <div className="relative">
          <p
            onClick={(e) => {
              setRatingShow(!ratingShow);
              setTypeShow(false);
              setLocationShow(false);
              setSubjectShow(false);
              setExamShow(false);
              setClassShow(false);
              setSortShow(false);
              e.stopPropagation();
            }}
            className="flex w-full justify-between items-center w-44 cursor-pointer border-2 border-solid border-light-gray  p-3"
          >
            <p className={` text-[#000000] text-[16px] `}>
              {ratings ? `${ratings} Star` : "Ratings"}
            </p>
            {ratingShow ? (
              <GoChevronDown className="ml-1 text-[16px] rotate-180" />
            ) : (
              <GoChevronDown className="ml-1 text-[16px]" />
            )}
          </p>
          {ratingShow ? (
            <>
              {/* <div className="arrow  absolute h-[20px]  w-[20px] bg-black rotate-45" id="arrow"/> */}
              <div className="absolute left-0 z-10 mt-5 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1 divide-y divide-gray/20" role="none">
                  <div
                    className={`flex  ${
                      ratings === 5 ? "text-primary" : "text-[#000000]"
                    } justify-between cursor-pointer  items-center`}
                    onClick={() => {
                      setRatings(5);
                    }}
                  >
                    <p className={`  text-[16px]  px-4 py-2 `}>5 star</p>
                    <Rating
                      className={`mr-2`}
                      name="read-only"
                      value={5}
                      size="small"
                      readOnly
                    />
                  </div>
                  <div
                    onClick={() => {
                      setRatings(4);
                    }}
                    className={`flex   ${
                      ratings === 4 ? "text-primary" : "text-[#000000]"
                    } justify-between cursor-pointer  items-center`}
                  >
                    <p className={`  text-[16px]  px-4 py-2 `}>4 star</p>
                    <Rating
                      className={`mr-2`}
                      name="read-only"
                      value={4}
                      size="small"
                      readOnly
                    />
                  </div>
                  <div
                    onClick={() => {
                      setRatings(3);
                    }}
                    className={`flex   ${
                      ratings === 3 ? "text-primary" : "text-[#000000]"
                    } justify-between cursor-pointer  items-center`}
                  >
                    <p className={`  text-[16px]  px-4 py-2 `}>3 star</p>
                    <Rating
                      className={`mr-2`}
                      name="read-only"
                      value={3}
                      size="small"
                      readOnly
                    />
                  </div>
                  <div
                    onClick={() => {
                      setRatings(2);
                    }}
                    className={`flex   ${
                      ratings === 2 ? "text-primary" : "text-[#000000]"
                    } justify-between cursor-pointer  items-center`}
                  >
                    <p className={`  text-[16px]  px-4 py-2 `}>2 star</p>
                    <Rating
                      className={`mr-2`}
                      name="read-only"
                      value={2}
                      size="small"
                      readOnly
                    />
                  </div>
                  <div
                    onClick={() => {
                      setRatings(1);
                    }}
                    className={`flex   ${
                      ratings === 1 ? "text-primary" : "text-[#000000]"
                    } justify-between cursor-pointer  items-center`}
                  >
                    <p className={`  text-[16px]  px-4 py-2 `}>1 star</p>
                    <Rating
                      className={`mr-2`}
                      name="read-only"
                      value={1}
                      size="small"
                      readOnly
                    />
                  </div>
                  <div
                    onClick={() => {
                      setRatings("");
                    }}
                    className={`flex   ${
                      ratings === "" ? "text-primary" : "text-[#000000]"
                    } justify-between cursor-pointer  items-center`}
                  >
                    <p className={`  text-[16px]  px-4 py-2 `}>Clear All</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="p-5 container mx-auto">
        <img
          className="md:w-full md:h-full h-[120px] cursor-pointer"
          src={ninetynineImage.src}
          onClick={() => router.push("/coaching-in-99")}
          alt=""
        />
      </div>

      {/* Course Card */}

      {sortBy === "Courses" ? (
        <div className="grid xl:grid-cols-3 grid-cols-1 md-mx-auto gap-x-[50px] gap-y-[25px] my-10">
          {filteredCourses?.length > 0 &&
            filteredCourses
              ?.slice(0, 12)
              .map((item, key) => <CourseCard {...item} key={key} />)}
        </div>
      ) : (
        <div className="grid xl:grid-cols-3 grid-cols-1 md-mx-auto gap-x-[50px] gap-y-[25px] my-10">
          {filteredInstitutes?.length > 0 &&
            filteredInstitutes
              ?.slice(0, 12)
              .map((item, key) => <InstituteCard {...item} key={key} />)}
        </div>
      )}
    </div>
  );
};

export default Recommended;
