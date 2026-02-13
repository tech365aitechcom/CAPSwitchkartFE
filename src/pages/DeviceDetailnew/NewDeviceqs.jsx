import React, { useEffect, useReducer, useState } from "react";
import "./newDeviceqs.scss";
import { useQuestionContext } from "../../components/QuestionContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ImArrowLeft } from "react-icons/im";
import store from "../../store/store";
const currentDomain = window.location.origin;
const DEFAULT_LOGO = "/Grest_Logo.jpg";
const BUYBACK_LOGO = "/Grest_Logo_2.jpg";

const isBuybackDomain = currentDomain === import.meta.env.VITE_BUYBACK_URL;
const GREST_LOGO = isBuybackDomain ? BUYBACK_LOGO : DEFAULT_LOGO;
import { useSelector } from "react-redux";
import banner from "../../assets/banner.jpg";
import { GoDotFill } from "react-icons/go";

// Image imports (keeping the same as original)
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
  initializeGroups,
  setGroupAnswers,
  updateGroupObject,
  updateCoreObject,
  updateCosmeticsObject,
  updateDisplayObject,
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

const whiteText = "text-white";
const blackText = "text-black";
const pinkBg = "bg-primary";
const whiteBg = "bg-white";

// Group display configuration
const GROUP_DISPLAY_CONFIG = {
  Core: {
    title: "Basic Condition of the Device",
    updateAction: updateCoreObject,
  },
  Cosmetics: {
    title: "Physical Condition of the Device",
    updateAction: updateCosmeticsObject,
  },
  Display: {
    title: "Display Condition of the Device",
    updateAction: updateDisplayObject,
  },
  "Functional Major": {
    title: "Functional Condition of the Device",
    updateAction: updateFunctionalMajorObject,
  },
  "Functional Minor": {
    title: "Functional Condition of the Device",
    updateAction: updateFunctionalMinorObject,
  },
  Accessories: {
    title: "Select Accessories Not Available with Device",
    updateAction: updateAccessoriesObject,
  },
  Warranty: {
    title: "Please Choose the Appropriate Warranty Period for Your Device",
    updateAction: updateWarrantyObject,
    special: true, // Warranty has special handling
  },
};

const NewDeviceqs = () => {
  const userToken = sessionStorage.getItem("authToken");
  const DeviceType = sessionStorage.getItem("DeviceType");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { answers, setAnswers } = useQuestionContext();
  const [visible, setVisible] = useState(1);
  const [newGroupanswers, setNewGroupAnswers] = useState();
  const [availableGroups, setAvailableGroups] = useState([]);
  const profile = useUserProfile();

  // Get dynamic groups from Redux
  const qnaState = useSelector((state) => state.qna);
  const groups = qnaState.groups || {};
  const groupNames = qnaState.groupNames || [];

  const [showPopup, setShowPopup] = useState(true);
  const [NDstate, dispatch] = useReducer(reducer, { groups: {} });

  function reducer(state, action) {
    if (action.type === "SET_GROUP_ANSWERS") {
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.group]: action.answers,
        },
      };
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
        headers: { authorization: `${userToken}` },
      });

      const sortedData = response.data.data.sort((a, b) => a.viewOn - b.viewOn);

      // Extract unique group names from the questionnaires
      const uniqueGroups = [
        ...new Set(sortedData.map((q) => q.groupName).filter(Boolean)),
      ];
      setAvailableGroups(uniqueGroups);

      // Initialize Redux with dynamic groups
      store.dispatch(initializeGroups({ groupNames: uniqueGroups }));

      // Populate each group with its questions
      uniqueGroups.forEach((group) => {
        const answersTemp = sortedData.filter(
          (question) => question.groupName === group,
        );
        dispatch({ type: "SET_GROUP_ANSWERS", group, answers: answersTemp });
      });

      const newPopulateAnswers = sortedData.map((ele) => ele.default);

      let answersToProcess;

      if (answers.length === 0) {
        const newAnswers = newPopulateAnswers.map((answer, index) => {
          const questionData = sortedData[index];

          // Always initialize with all options unselected (false)
          // The user should click to select options, not start with selections
          return {
            quetion: questionData.quetion,
            answer,
            key: questionData.default === questionData.yes ? "yes" : "no",
            group: questionData.group,
            groupName: questionData.groupName,
            selected: Array(questionData.options.length).fill(false), // Always false initially
          };
        });

        setAnswers(newAnswers);
        setNewGroupAnswers(newAnswers);
        answersToProcess = newAnswers;
      } else {
        answersToProcess = answers;
        setNewGroupAnswers(answers);
      }

      // Dispatch to Redux for all groups dynamically
      uniqueGroups.forEach((group) => {
        const answersTemp = answersToProcess.filter(
          (question) => question.groupName === group,
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
      (question) => question.group === group,
    );
    store.dispatch(setGroupAnswers({ group, filteredAnswers }));
    if (showPopup === false) {
      setVisible(visible + 1);
    }
  };

  // Build parts array dynamically based on available groups
  const parts = availableGroups
    .map((groupName) => {
      const groupData = NDstate.groups[groupName];
      const groupSlice = groups[groupName];

      if (!groupData || groupData.length === 0) {
        return null;
      }

      return {
        component: DynamicGroupComponent,
        groupName: groupName,
        data: groupData,
        slice: groupSlice,
        config: GROUP_DISPLAY_CONFIG[groupName] || {
          title: groupName,
          updateAction: updateGroupObject,
        },
      };
    })
    .filter(Boolean);

  const availableParts = parts.filter(
    (part) => part.data && part.data.length > 0,
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
        qna={qnaState}
        profile={profile}
        groups={groups}
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
  groups,
}) => {
  const navigate = useNavigate();
  const CurrentPart = availableParts[visible - 1]?.component;
  const currentPartData = availableParts[visible - 1];

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
            {CurrentPart && currentPartData && (
              <CurrentPart
                groupName={currentPartData.groupName}
                data={currentPartData.data}
                slice={currentPartData.slice}
                config={currentPartData.config}
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
        groups={groups}
      />
    </div>
  );
};

// Dynamic component that renders any group
const DynamicGroupComponent = ({ groupName, data, slice, config }) => {
  // Special handling for Warranty group
  if (config.special && groupName === "Warranty") {
    return (
      <div className="containClass">
        <div className="subheading">
          <GoDotFill size={20} />
          <h2>{config.title}</h2>
        </div>
        <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
          {data &&
            data.map((questionData, index) => (
              <React.Fragment key={questionData._id}>
                {questionData?.options.map((option, optionIndex) => {
                  // Safely check if item is selected
                  const isSelected =
                    slice &&
                    slice[index] &&
                    slice[index].selected &&
                    slice[index].selected[optionIndex];

                  return (
                    <React.Fragment key={optionIndex}>
                      <div
                        onClick={(e) => {
                          store.dispatch(
                            updateWarrantyObject({
                              index: index,
                              newKey: "yes",
                              newAnswer: questionData.yes,
                            }),
                          );
                        }}
                        className={`w-[48%] flex flex-col items-center px-3 min-h-[150px] shadow-lg rounded-lg cursor-pointer ${
                          isSelected ? pinkBg : whiteBg
                        }`}
                      >
                        <div className="mt-3 mb-1 overflow-hidden bg-white rounded-md">
                          <img
                            className="scale-[1.2]"
                            src={imageMap[option?.img] || option?.img}
                            alt={option.caption}
                          />
                        </div>
                        <div className="border-t-[1.5px] w-full py-2">
                          <p
                            className={`text-xs text-center font-medium ${
                              isSelected ? whiteText : blackText
                            }`}
                          >
                            {option.caption}
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
        </div>
      </div>
    );
  }

  // Standard rendering for all other groups
  return (
    <div className="containClass">
      <div className="subheading">
        <GoDotFill size={20} />
        <h2>{config.title}</h2>
      </div>
      <div className="w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row">
        {data &&
          data.map((questionData, index) => (
            <React.Fragment key={questionData._id}>
              {questionData?.options.map((option, optionIndex) => {
                // Safely check if item is selected
                const isSelected =
                  slice &&
                  slice[index] &&
                  slice[index].selected &&
                  slice[index].selected[optionIndex];

                return (
                  <React.Fragment key={optionIndex}>
                    <div
                      onClick={(e) => {
                        // Use group-specific update action if available, otherwise use generic
                        const updateAction =
                          config.updateAction || updateGroupObject;

                        if (updateAction === updateGroupObject) {
                          // Generic update
                          store.dispatch(
                            updateGroupObject({
                              group: groupName,
                              index: index,
                              yesKey: questionData.yes,
                              noKey: questionData.no,
                              selectedIndex: optionIndex,
                            }),
                          );
                        } else {
                          // Specific group update (for backward compatibility)
                          store.dispatch(
                            updateAction({
                              index: index,
                              yesKey: questionData.yes,
                              noKey: questionData.no,
                              selectedIndex: optionIndex,
                            }),
                          );
                        }
                      }}
                      className={`flex flex-col items-center px-3 w-[48%] min-h-[150px] shadow-lg rounded-lg cursor-pointer transition-colors ${
                        isSelected ? pinkBg : whiteBg
                      }`}
                    >
                      <div className="mt-3 mb-1 rounded-md overflow-hidden bg-white">
                        <img
                          className="scale-[1.2]"
                          src={imageMap[option?.img] || option?.img}
                          alt={option.caption}
                        />
                      </div>
                      <div className="border-t-[1.5px] w-full py-2">
                        <p
                          className={`text-xs font-medium text-center ${
                            isSelected ? whiteText : blackText
                          }`}
                        >
                          {option.caption}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
      </div>
      <div className="flex mt-4 bg-primary text-white font-medium py-2 px-3 text-sm text-pretty rounded-md">
        Continue, If you don't have any Above-Mentioned Issues.
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
  groups,
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
        Cosmetics: qna.groups?.Cosmetics || [],
        Display: qna.groups?.Display || [],
        "Functional Major": qna.groups?.["Functional Major"] || [],
        "Functional Minor": qna.groups?.["Functional Minor"] || [],
        Accessories: qna.groups?.Accessories || [],
        Warranty: qna.groups?.Warranty || [],
        Core: [],
      };
    }

    // Return all groups dynamically
    return qna.groups || {};
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

    // Find bill data from Accessories if available
    const accessoriesData =
      finalPayload.QNA.Accessories || groups.Accessories || [];
    const billData = accessoriesData.find(
      (item) => item.quetion && item.quetion.toLowerCase().includes("bill"),
    );

    if (billData) {
      sessionStorage.setItem("billData", JSON.stringify(billData));
    } else {
      const cosmeticsData =
        finalPayload.QNA.Cosmetics || groups.Cosmetics || [];
      if (cosmeticsData[6]) {
        sessionStorage.setItem("billData", JSON.stringify(cosmeticsData[6]));
      }
      console.log("No Accessories item with 'bill' found.");
    }

    const response = await axios.post(
      `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/questionnaires/calculatePrice`,
      finalPayload,
      { headers: { Authorization: userToken2 } },
    );

    await logQuickQuoteAttempt(response.data.data, id);
    sessionStorage.setItem("LeadId", response.data.data.id);
    sessionStorage.setItem(
      "responsedatadata",
      JSON.stringify({ ...response.data.data, bonus: 0 }),
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
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/quoteTracking/log-quote-attempt`,
        logPayload,
        { headers: { Authorization: token } },
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
              className={`${
                visible < 2
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-primary cursor-pointer"
              } w-[30%] px-6 py-2 rounded-lg flex items-center justify-center`}
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
