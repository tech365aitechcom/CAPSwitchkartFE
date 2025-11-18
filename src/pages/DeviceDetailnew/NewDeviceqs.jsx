import React, { useEffect, useReducer, useState } from "react";
import "./newDeviceqs.scss";
import { useQuestionContext } from "../../components/QuestionContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ImArrowLeft } from "react-icons/im";
import store from "../../store/store";
const currentDomain = window.location.origin;
const DEFAULT_LOGO = "/Grest_Logo.jpg";
const BUYBACK_LOGO = "/Grest_Logo_2.jpg"; // Use your actual buyback logo

const isBuybackDomain = currentDomain === import.meta.env.VITE_BUYBACK_URL;
const GREST_LOGO = isBuybackDomain ? BUYBACK_LOGO : DEFAULT_LOGO;
import { useSelector } from "react-redux";
import banner from "../../assets/banner.jpg";
import { GoDotFill } from "react-icons/go";

import quesImg1 from "../../assets/5.jpg";
import quesImg2 from "../../assets/20.jpg";
import quesImg3 from "../../assets/8.jpg";
import quesImg4 from "../../assets/6.jpg";
import quesImg5 from "../../assets/7.jpg";
import quesImg6 from "../../assets/39.jpg";
import quesImg7 from "../../assets/41.jpg";
import quesImg8 from "../../assets/42.jpg";
import quesImg9 from "../../assets/40.jpg";
import quesImg10 from "../../assets/44.jpg";
import quesImg11 from "../../assets/37.jpg";
import quesImg12 from "../../assets/38.jpg";
import quesImg13 from "../../assets/43.jpg";
import quesImg14 from "../../assets/45.jpg";
import quesImg15 from "../../assets/35.jpg";
import quesImg16 from "../../assets/36.jpg";
import quesImg17 from "../../assets/10.jpg";
import quesImg18 from "../../assets/11.jpg";
import quesImg19 from "../../assets/9.jpg";
import quesImg20 from "../../assets/12.jpg";
import quesImg21 from "../../assets/13.jpg";
import quesImg22 from "../../assets/14.jpg";
import quesImg23 from "../../assets/17.jpg";
import quesImg24 from "../../assets/47.png";
import quesImg25 from "../../assets/46.png";
import quesImg26 from "../../assets/18.jpg";
import quesImg27 from "../../assets/19.jpg";
import quesImg29 from "../../assets/21.jpg";
import quesImg30 from "../../assets/22.jpg";
import quesImg31 from "../../assets/24.jpg";
import quesImg32 from "../../assets/23.jpg";
import quesImg33 from "../../assets/25.jpg";
import quesImg34 from "../../assets/26.jpg";
import quesImg35 from "../../assets/27.jpg";
import quesImg36 from "../../assets/29.jpg";
import quesImg39 from "../../assets/28.jpg";
import quesImg42 from "../../assets/30.jpg";
import quesImg43 from "../../assets/32.jpg";
import quesImg44 from "../../assets/31.jpg";
import quesImg45 from "../../assets/33.jpg";
import quesImg46 from "../../assets/34.jpg";
import quesImg47 from "../../assets/1.jpg";
import quesImg48 from "../../assets/2.jpg";
import quesImg49 from "../../assets/3.jpg";
import quesImg50 from "../../assets/4.jpg";
import quesImg51 from "../../assets/quesImg0.png";
import quesImg53 from "../../assets/48.jpg";
import quesImg54 from "../../assets/49.jpg";
import quesImg55 from "../../assets/major.jpeg";
import quesImg56 from "../../assets/minor.jpeg";
import question1 from "../../assets/question1.png";
import question2 from "../../assets/question2.png";
import question3 from "../../assets/question3.png";
import question4 from "../../assets/question4.png";
import question5 from "../../assets/question5.png";
import question6 from "../../assets/question6.png";
import question7 from "../../assets/question7.png";
import question8 from "../../assets/question8.png";
import question9 from "../../assets/question9.png";
import acces1 from "../../assets/access1.png";
import acces2 from "../../assets/access2.png";
import acces3 from "../../assets/access3.png";
import acces4 from "../../assets/access4.png";
const imageMap = {
  acces1,
  acces2,
  acces3,
  acces4,
  question1,
  question2,
  question3,
  question4,
  question5,
  question6,
  question7,
  question8,
  question9,
  quesImg1,
  quesImg2,
  quesImg3,
  quesImg4,
  quesImg5,
  quesImg6,
  quesImg7,
  quesImg8,
  quesImg9,
  quesImg10,
  quesImg11,
  quesImg12,
  quesImg13,
  quesImg14,
  quesImg15,
  quesImg16,
  quesImg17,
  quesImg18,
  quesImg19,
  quesImg20,
  quesImg21,
  quesImg22,
  quesImg23,
  quesImg24,
  quesImg25,
  quesImg26,
  quesImg27,
  quesImg28: quesImg2,
  quesImg29,
  quesImg30,
  quesImg31,
  quesImg32,
  quesImg33,
  quesImg34,
  quesImg35,
  quesImg36,
  quesImg37: quesImg31,
  quesImg38: quesImg19,
  quesImg39,
  quesImg40: quesImg36,
  quesImg41: quesImg35,
  quesImg42,
  quesImg43,
  quesImg44,
  quesImg45,
  quesImg46,
  quesImg47,
  quesImg48,
  quesImg49,
  quesImg50,
  quesImg51,
  quesImg52: quesImg51,
  quesImg53,
  quesImg54,
  quesImg55,
  quesImg56,
};

import {
  setGroupAnswers,
  updateCoreObject,
  updateCosmeticsObject,
  updateDisplayObject,
  //updateFunctionalObject,
  updateAccessoriesObject,
  updateFunctionalMajorObject,
  updateFunctionalMinorObject,
  updateWarrantyObject,
} from "../../store/slices/QNAslice";
import { setResponseData } from "../../store/slices/responseSlice";
import useUserProfile from "../../utils/useUserProfile";
import { CgSpinner } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";
import styless from "../QuickQuote/QuickQuote.module.css";
import { IoArrowBack } from "react-icons/io5";

const initialState = {
  Core: [],
  Cosmetics: [],
  Display: [],
  //Functional: [],
  Accessories: [],
  "Functional Major": [],
  "Functional Minor": [],
  Warranty: [],
};
const whiteText = "text-white";
const blackText = "text-black";
const pinkBg = "bg-primary";
const whiteBg = "bg-white";

const NewDeviceqs = () => {
  const userToken = sessionStorage.getItem("authToken");
  const DeviceType = sessionStorage.getItem("DeviceType");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { answers, setAnswers } = useQuestionContext();
  const [visible, setVisible] = useState(1);
  const [newGroupanswers, setNewGroupAnswers] = useState();
  const profile = useUserProfile();
  const core = useSelector((state) => state.qna.Core);
  const Cosmetics = useSelector((state) => state.qna.Cosmetics);
  const Display = useSelector((state) => state.qna.Display);
  const Accessories = useSelector((state) => state.qna.Accessories);
  //const Functional = useSelector((state) => state.qna.Functional);
  const FunctionalMajor = useSelector((state) => state.qna["Functional Major"]);
  const FunctionalMinor = useSelector((state) => state.qna["Functional Minor"]);
  const Warranty = useSelector((state) => state.qna.Warranty);
  const [showPopup, setShowPopup] = useState(true);
  const [NDstate, dispatch] = useReducer(reducer, initialState);
  const qna = useSelector((state) => state.qna);

  function reducer(state, action) {
    if (action.type === "SET_GROUP_ANSWERS") {
      return { ...state, [action.group]: action.answers };
    } else {
      throw new Error();
    }
  }
  const fetchData = async () => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/questionnaires/findAll?page=0&limit=99&type=${DeviceType}`;

      const response = await axios.get(apiUrl, {
        headers: {
          authorization: `${userToken}`,
        },
      });

      // Sort by viewOn field (assuming it's a number; modify for strings)
      const sortedData = response.data.data.sort((a, b) => a.viewOn - b.viewOn);

      [
        "Core",
        "Cosmetics",
        "Display",
        "Accessories",
        //"Functional",
        "Functional Major",
        "Functional Minor",
        "Warranty",
      ].forEach((group) => {
        const answersTemp = sortedData.filter(
          (question) => question.groupName === group
        );
        dispatch({ type: "SET_GROUP_ANSWERS", group, answers: answersTemp });
      });

      const newPopulateAnswers = sortedData.map((ele) => ele.default);

      let answersToProcess;

      if (answers.length === 0) {
        const newAnswers = newPopulateAnswers.map((answer, index) => {
          const questionData = sortedData[index];

          if (questionData.yes === answer && questionData.no === answer) {
            return {
              quetion: questionData.quetion,
              answer,
              key: "no",
              group: questionData.group,
              groupName: questionData.groupName,
              selected: Array(questionData.options.length).fill(false),
            };
          } else if (questionData.yes === answer) {
            return {
              quetion: questionData.quetion,
              answer,
              key: "yes",
              group: questionData.group,
              groupName: questionData.groupName,
              selected: Array(questionData.options.length).fill(true),
            };
          } else {
            return {
              quetion: questionData.quetion,
              answer,
              group: questionData.group,
              groupName: questionData.groupName,
              key: "no",
              selected: Array(questionData.options.length).fill(false),
            };
          }
        });

        setAnswers(newAnswers);
        setNewGroupAnswers(newAnswers);
        answersToProcess = newAnswers; // <-- 2. Assign newAnswers to it
      } else {
        answersToProcess = answers; // <-- 3. Assign existing answers to it
        setNewGroupAnswers(answers); // Make sure this is also set
      }

      // 4. Move this logic OUTSIDE the 'if' block
      [
        "Core",
        "Cosmetics",
        "Display",
        "Accessories",
        "Functional Major",
        "Functional Minor",
        "Warranty",
      ].forEach((group) => {
        const answersTemp = answersToProcess.filter(
          (question) => question.groupName === group
        );
        store.dispatch(setGroupAnswers({ group, answers: answersTemp }));
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [visible]);

  const updateAns = (group) => {
    const filteredAnswers = newGroupanswers.filter(
      (question) => question.group === group
    );
    store.dispatch(setGroupAnswers({ group, filteredAnswers }));
    if (showPopup === false) {
      setVisible(visible + 1);
    }
  };

  const parts = [
    { component: FirstPart, data: NDstate.Core, slice: core },
    //{ component: SixthPart, data: NDstate.Functional, slice: Functional },
    { component: SecondPart, data: NDstate.Cosmetics, slice: Cosmetics },
    { component: ThirdPart, data: NDstate.Display, slice: Display },
    {
      component: FourthPart,
      data: NDstate.Functional_major,
      slice: FunctionalMajor,
    },
    {
      component: FifthPart,
      data: NDstate.Functional_minor,
      slice: FunctionalMinor,
    },
    { component: SeventhPart, data: NDstate.Accessories, slice: Accessories },
    { component: EighthPart, data: NDstate.Warranty, slice: Warranty },
  ];

  const availableParts = parts.filter(
    (part) => part.data && part.data.length > 0
  );

  return (
    <>
      <div className={`popup ${showPopup ? "show" : ""}`}>
        <img className="object-contain" src={banner} alt="banner" />
        <div className="text">
          Help us calculate your device value correctly by answering to the
          following questions
        </div>
        <button onClick={() => setShowPopup(false)}> Got it</button>
      </div>
      <MainQContainer
        NDstate={NDstate}
        setIsSearchOpen={setIsSearchOpen}
        isSearchOpen={isSearchOpen}
        dispatch={dispatch}
        visible={visible}
        availableParts={availableParts}
        setVisible={setVisible}
        updateAns={updateAns}
        showPopup={showPopup}
        qna={qna}
        profile={profile}
      />
    </>
  );
};
export default NewDeviceqs;
const MainQContainer = ({
  NDstate,
  setIsSearchOpen,
  isSearchOpen,
  dispatch,
  visible,
  availableParts,
  setVisible,
  updateAns,
  showPopup,
  qna,
  profile,
}) => {
  const navigate = useNavigate();
  const CurrentPart = availableParts[visible - 1]?.component;

  return (
    <div className="mainQContainer">
      <div className="flex items-center w-[99%] h-16 py-4 bg-white border-b-2 HEADER header">
        <div className="flex items-center justify-between w-full max-w-screen overflow-hidden px-4 py-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate(-1)}
              className="text-xs flex items-center justify-center text-white bg-[--primary-color] hover:cursor-pointer p-2 rounded-full"
            >
              <IoArrowBack size={20} />
            </button>
            <img
              onClick={() => navigate("/selectdevicetype")}
              className="w-[120px] sm:w-[130px] md:w-[150px] object-contain cursor-pointer"
              src={GREST_LOGO}
              alt="app logo"
            />
          </div>
        </div>
      </div>
      <div className={`${styless.quick_page_nav}`}>
        <IoIosArrowBack
          onClick={() => navigate("/selectmodel")}
          size={25}
          className="ml-2 text-primary"
        />
        <p className="ml-2 text-xl font-medium">Device Details</p>
      </div>
      <div className="innerContainer">
        <div className={`maindata`}>
          <div className="text-lg font-medium tracking-tight text-{1.325rem}">
            Tell us more about your device?
          </div>
          <div className="underline"></div>
          <div className="questionList">
            {CurrentPart && (
              <CurrentPart
                NDstate={NDstate}
                slice={availableParts[visible - 1]?.slice}
              />
            )}
          </div>
        </div>
      </div>
      <AboveSix
        visible={visible}
        setVisible={setVisible}
        updateAns={updateAns}
        showPopup={showPopup}
        qna={qna}
        profile={profile}
        availableParts={availableParts}
      />
    </div>
  );
};

const FirstPart = ({ NDstate, slice }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={15} />
        <h2>Basic Condition of the Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate.Core &&
          NDstate.Core.map((data, index) => (
            <React.Fragment key={data._id}>
              {data?.options.map((option, optionIndex) => (
                <React.Fragment key={optionIndex}>
                  <div
                    onClick={(e) => {
                      console.log(slice);
                      console.log("firstPart-option", option);
                      console.log("firstPart-data", data);
                      console.log(optionIndex + "ok");
                      store.dispatch(
                        updateCoreObject({
                          index: index,
                          yesKey: data.yes,
                          noKey: data.no,
                          newKey: "yes",
                          selectedIndex: optionIndex,
                        })
                      );
                    }}
                    className={`px-3 flex flex-col items-center  w-[48%] min-h-[150px] shadow-lg rounded-lg ${
                      !slice[index]?.selected[optionIndex] ? whiteBg : pinkBg
                    }`}
                  >
                    <div className=" mb-1  mt-3 rounded-md overflow-hidden bg-white">
                      <img
                        className="scale-[1.2]"
                        src={imageMap[option?.img] || option?.img}
                      />
                    </div>
                    <div className="border-t-[1.5px]   w-full py-2">
                      <p
                        className={`font-medium  text-xs text-center ${
                          !slice[index]?.selected[optionIndex]
                            ? blackText
                            : whiteText
                        }`}
                      >
                        {option.caption}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
      </div>
      <div className="flex mt-4 bg-primary text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};

const SecondPart = ({ NDstate, slice }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Physical Condition of the Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate.Cosmetics &&
          NDstate.Cosmetics.map((data, index) => {
            return (
              <React.Fragment key={data._id}>
                {data?.options.map((option, optionIndex) => (
                  <React.Fragment key={optionIndex}>
                    <div
                      onClick={(e) => {
                        console.log(slice);
                        console.log("secondPart-option", option);
                        console.log("secondPart-data", data);
                        console.log(optionIndex + "ok");
                        store.dispatch(
                          updateCosmeticsObject({
                            index: index,
                            yesKey: data.yes,
                            noKey: data.no,
                            selectedIndex: optionIndex,
                            newKey: "yes",
                          })
                        );
                      }}
                      className={`flex flex-col items-center px-3 w-[48%] min-h-[150px] shadow-lg rounded-lg ${
                        !slice[index]?.selected[optionIndex] ? whiteBg : pinkBg
                      }`}
                    >
                      <div className="mt-3 mb-1 rounded-md overflow-hidden bg-white">
                        <img
                          src={imageMap[option?.img] || option?.img}
                          className="scale-[1.2]"
                        />
                      </div>
                      <div className="w-full border-t-[1.5px] py-2">
                        <p
                          className={`text-xs font-medium text-center ${
                            !slice[index]?.selected[optionIndex]
                              ? blackText
                              : whiteText
                          }`}
                        >
                          {option.caption}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </React.Fragment>
            );
          })}
      </div>
      <div className="flex mt-4 bg-primary text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};

const ThirdPart = ({ NDstate, slice }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Display Condition of the Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate.Display &&
          NDstate.Display.map((data, index) => (
            <React.Fragment key={data._id}>
              {data?.options.map((option, optionIndex) => (
                <React.Fragment key={optionIndex}>
                  <div
                    onClick={(e) => {
                      console.log(slice);
                      console.log("thirdPart-data", data);
                      console.log("thirdPart-option", option);
                      console.log(optionIndex + "ok");
                      store.dispatch(
                        updateDisplayObject({
                          index: index,
                          noKey: data.no,
                          yesKey: data.yes,
                          newKey: "yes",
                          selectedIndex: optionIndex,
                        })
                      );
                    }}
                    className={`min-h-[150px] flex flex-col items-center px-3 w-[48%]  shadow-lg rounded-lg ${
                      !slice[index]?.selected[optionIndex] ? whiteBg : pinkBg
                    }`}
                  >
                    <div className="  overflow-hidden mt-3 mb-1 rounded-md bg-white">
                      <img
                        className="scale-[1.2]"
                        src={imageMap[option?.img] || option?.img}
                      />
                    </div>
                    <div className="w-full py-2 border-t-[1.5px] ">
                      <p
                        className={`text-center text-xs font-medium  ${
                          !slice[index]?.selected[optionIndex]
                            ? blackText
                            : whiteText
                        }`}
                      >
                        {option.caption}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
      </div>
      <div className="flex bg-primary mt-4  text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};

const FourthPart = ({ NDstate, slice }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Functional Condition of the Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate?.["Functional Major"] &&
          NDstate?.["Functional Major"].map((data, index) => (
            <React.Fragment key={data._id}>
              {data?.options.map((option, optionIndex) => (
                <React.Fragment key={optionIndex}>
                  <div
                    onClick={(e) => {
                      console.log(slice);
                      console.log("fourth-option", option);
                      console.log("fourth-data", data);
                      console.log(optionIndex + "ok");
                      store.dispatch(
                        updateFunctionalMajorObject({
                          index: index,
                          yesKey: data.yes,
                          noKey: data.no,
                          selectedIndex: optionIndex,
                          newKey: "yes",
                        })
                      );
                    }}
                    className={`flex  px-3  flex-col min-h-[150px] items-center w-[48%]  shadow-lg rounded-lg ${
                      !slice[index]?.selected[optionIndex] ? whiteBg : pinkBg
                    }`}
                  >
                    <div className="mt-3 mb-1 rounded-md bg-white overflow-hidden">
                      <img
                        className="scale-[1.2]"
                        src={imageMap[option?.img] || option?.img}
                      />
                    </div>
                    <div className="border-t-[1.5px] w-full py-2">
                      <p
                        className={`text-xs font-medium ${
                          !slice[index]?.selected[optionIndex]
                            ? blackText
                            : whiteText
                        } text-center `}
                      >
                        {option.caption}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
      </div>
      <div className="flex mt-4 bg-primary  px-3 text-white font-medium py-2 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};

const FifthPart = ({ NDstate, slice }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Functional Condition of the Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate?.["Functional Minor"] &&
          NDstate?.["Functional Minor"].map((data, index) => (
            <React.Fragment key={data._id}>
              {data?.options.map((option, optionIndex) => (
                <React.Fragment key={optionIndex}>
                  <div
                    className={`flex flex-col items-center px-3 w-[48%] min-h-[150px] shadow-lg rounded-lg ${
                      !slice[index]?.selected[optionIndex] ? whiteBg : pinkBg
                    }`}
                    onClick={(e) => {
                      console.log(slice);
                      console.log("fifth-option", option);
                      console.log("fifth-data", data);
                      console.log(optionIndex + "ok");
                      store.dispatch(
                        updateFunctionalMinorObject({
                          index: index,
                          yesKey: data.yes,
                          noKey: data.no,
                          newKey: "yes",
                          selectedIndex: optionIndex,
                        })
                      );
                    }}
                  >
                    <div className="mt-3 mb-1 rounded-md overflow-hidden bg-white">
                      <img
                        className="scale-[1.2]"
                        src={imageMap[option?.img] || option?.img}
                      />
                    </div>
                    <div className="border-t-[1.5px]   py-2 w-full ">
                      <p
                        className={`text-xs    text-center  font-medium${
                          !slice[index]?.selected[optionIndex]
                            ? blackText
                            : whiteText
                        }`}
                      >
                        {option.caption}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
      </div>
      <div className="flex  mt-4 bg-primary text-white font-medium text-pretty  py-2 px-3  text-sm rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};
/* const SixthPart = ({ NDstate, slice }) => {
  return (
    <div className="containClass">
      <div className="text-sm text-[#676767] py-1 font-medium text-center text-pretty">
        <p>Please choose appropriate condition to get accurate quote</p>
      </div>
      <div className="grid grid-cols-2 gap-y-3 gap-x-[4%]">
        {NDstate?.Functional &&
          NDstate?.Functional.map((data, index) => (
            <div
              key={data._id}
              className={`${
                slice[index]?.answer === data.yes ? pinkBg : whiteBg
              } flex flex-col justify-start items-center shadow-lg rounded-lg px-3`}
              onClick={() => {
                if (slice[index]?.answer === data.yes) {
                  store.dispatch(
                    updateFunctionalObject({
                      index: index,
                      newAnswer: data.no,
                      newKey: "no",
                    })
                  );
                } else {
                  store.dispatch(
                    updateFunctionalObject({
                      index: index,
                      newAnswer: data.yes,
                      newKey: "yes",
                    })
                  );
                }
              }}
            >
              <div className="mt-3 mb-1 rounded-md overflow-hidden bg-white">
                <img
                  className="scale-[1.2]"
                  src={imageMap[data?.options[0]?.img] || data?.options[0]?.img}
                />
              </div>
              <div className="w-full border-t-[1.5px] py-2">
                <p
                  className={`${
                    slice[index]?.answer === data.yes ? whiteText :  blackText
                  } text-xs font-medium text-center`}
                >
                  {data.quetion}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className="flex mt-4 bg-primary text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};
 */
const SeventhPart = ({ NDstate, slice }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Select Accessories Not Available with Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate.Accessories &&
          NDstate.Accessories.map((data, index) => {
            return (
              <React.Fragment key={data._id}>
                {data?.options.map((option, optionIndex) => (
                  <React.Fragment key={optionIndex}>
                    <div
                      className={`flex flex-col items-center px-3 w-[48%] min-h-[150px] shadow-lg rounded-lg ${
                        !slice[index]?.selected[optionIndex] ? whiteBg : pinkBg
                      }`}
                      onClick={(e) => {
                        console.log(slice);
                        console.log("six-option", option);
                        console.log("six-data", data);
                        console.log(optionIndex + "ok");
                        store.dispatch(
                          updateAccessoriesObject({
                            noKey: data.no,
                            index: index,
                            yesKey: data.yes,
                            newKey: "yes",
                            selectedIndex: optionIndex,
                          })
                        );
                      }}
                    >
                      <div className="mt-3 mb-1 rounded-md overflow-hidden bg-white">
                        <img
                          className="scale-[1.2]"
                          src={imageMap[option?.img] || option?.img}
                        />
                      </div>
                      <div className="border-t-[1.5px] w-full py-2">
                        <p
                          className={`text-xs font-medium text-center ${
                            !slice[index]?.selected[optionIndex]
                              ? blackText
                              : whiteText
                          }`}
                        >
                          {option.caption}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </React.Fragment>
            );
          })}
      </div>
      <div className="flex mt-4 bg-primary text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  );
};

const EighthPart = ({ NDstate, slice }) => {
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>Please Choose the Appropriate Warranty Period for Your Device</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {NDstate?.Warranty &&
          NDstate?.Warranty.map((data, index) => (
            <React.Fragment key={data._id}>
              {data?.options.map((option, optionIndex) => (
                <React.Fragment key={optionIndex}>
                  <div
                    onClick={(e) => {
                      console.log(slice);
                      console.log("eight-option", option);
                      console.log("eight-data", data);
                      console.log(optionIndex + "ok");
                      store.dispatch(
                        updateWarrantyObject({
                          index: index,
                          newKey: "yes",
                          newAnswer: data.yes,
                        })
                      );
                    }}
                    className={` w-[48%]  flex flex-col items-center px-3 min-h-[150px] shadow-lg rounded-lg ${
                      !slice[index]?.selected[optionIndex] ? whiteBg : pinkBg
                    }`}
                  >
                    <div className="mt-3 mb-1 overflow-hidden bg-white  rounded-md ">
                      <img
                        className="scale-[1.2]"
                        src={imageMap[option?.img] || option?.img}
                      />
                    </div>
                    <div className="border-t-[1.5px] w-full py-2">
                      <p
                        className={`text-xs text-center  font-medium ${
                          !slice[index]?.selected[optionIndex]
                            ? blackText
                            : whiteText
                        }`}
                      >
                        {option.caption}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

const AboveSix = ({
  visible,
  setVisible,
  updateAns,
  showPopup,
  qna,
  profile,
  availableParts,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function handleADD() {
    if (showPopup === false && visible < availableParts.length) {
      setVisible(visible + 1);
    }
  }

  function handleSubtract() {
    if (visible > 1) {
      setVisible(visible - 1);
    }
  }

  function formatQNAByType(qna, type) {
    if (type === "CTG2") {
      return {
        Cosmetics: qna.Cosmetics,
        Display: qna.Display,
        "Functional Major": qna["Functional Major"],
        "Functional Minor": qna["Functional Minor"],
        Accessories: qna.Accessories,
        Warranty: qna.Warranty,
        Core: [],
      };
    }

    return qna;
  }

  const handlesubmit = async () => {
    const id = JSON.parse(sessionStorage.getItem("dataModel"));
    const userToken2 = sessionStorage.getItem("authToken");
    const DeviceType = sessionStorage.getItem("DeviceType");
    setIsLoading(true);
    console.log(id, profile);
    const finalPayload = {
      QNA: formatQNAByType(qna, DeviceType),
      phoneNumber: id?.phoneNumber ? id?.phoneNumber : "123456789",
      aadharNumber: id?.aadharNumber ? id?.aadharNumber : "123456789012",
      modelId: id?.models?._id,
      storage: id?.models?.config?.storage,
      ram: id?.models?.config?.RAM,
      name: id?.customerName ? id?.customerName : profile?.name,
    };
    console.log("finalPayload", finalPayload);
    const billData = finalPayload.QNA.Accessories.find(
      (item) => item.quetion && item.quetion.toLowerCase().includes("bill")
    );
    if (billData) {
      sessionStorage.setItem("billData", JSON.stringify(billData));
    } else {
      sessionStorage.setItem(
        "billData",
        JSON.stringify(finalPayload.QNA.Cosmetics[6])
      );
      console.log("No Accessories item with 'bill' found.");
    }
    const response = await axios.post(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/questionnaires/calculatePrice`,
      finalPayload,
      { headers: { Authorization: userToken2 } }
    );
    await logQuickQuoteAttempt(response.data.data, id);
    sessionStorage.setItem("LeadId", response.data.data.id);
    sessionStorage.setItem(
      "responsedatadata",
      JSON.stringify({ ...response.data.data, bonus: 0 })
    );
    sessionStorage.setItem("ExactQuote", true);
    store.dispatch(setResponseData({ ...response.data.data, bonus: 0 }));
    setIsLoading(false);
    navigate("/devicequote");
  };

  const logQuickQuoteAttempt = async (quoteResult, deviceModel) => {
    const token = sessionStorage.getItem("authToken");

    if (!token || !quoteResult?.id || !deviceModel?.models?._id) {
      console.error("Cannot log quote: Missing critical data.");
      return;
    }
    const logPayload = {
      quoteType: "Get Exact Value",
      quoteAmount: quoteResult.price,
      grade: quoteResult.grade,
      deviceDetails: {
        modelId: deviceModel?.models?._id,
        name: deviceModel?.models?.name,
        brandId: deviceModel?.models?.brandId,
        categoryName: deviceModel?.models?.categoryInfo?.categoryName,
        ram: deviceModel?.models?.config?.RAM,
        rom: deviceModel?.models?.config?.storage,
        series: deviceModel?.models?.series,
      },
    };
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/quoteTracking/log-quote-attempt`,
        logPayload,
        { headers: { Authorization: token } }
      );
    } catch (error) {
      console.error("Error logging Quick Quote attempt:", error);
    }
  };

  return (
    <React.Fragment>
      {visible >= availableParts.length ? (
        <div className="fixed bottom-0 flex justify-center w-full gap-2 p-3 bg-white border-t-2">
          <div
            onClick={handleSubtract}
            className={`bg-primary w-[30%] px-6 py-2 rounded-lg flex items-center justify-center`}
          >
            <ImArrowLeft color="white" size={20} />
          </div>
          <div
            onClick={handlesubmit}
            className="bg-primary w-[70%] relative text-center py-1 px-2 rounded-lg cursor-pointer flex justify-between text-white items-center"
          >
            {isLoading && (
              <CgSpinner
                size={20}
                className="absolute left-[18%] top-[8px] mt-1 animate-spin"
              />
            )}
            <p className="w-full p-1 text-xl font-medium">
              {isLoading ? "Submitting" : "Submit"}
            </p>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 justify-center flex w-full gap-2 p-3 bg-white border-t-2">
          {visible > 0 && visible <= availableParts.length && (
            <button
              onClick={handleSubtract}
              className={`  ${
                visible < 2
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-primary cursor-pointer"
              }  w-[30%] px-6 py-2 rounded-lg flex items-center justify-center`}
            >
              <ImArrowLeft color="white" size={20} />
            </button>
          )}
          <div
            onClick={handleADD}
            className="bg-primary w-[70%] py-1 px-2 text-center rounded-lg cursor-pointer flex justify-between text-white items-center"
          >
            <p className="w-full p-1 text-xl font-medium">Continue</p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
