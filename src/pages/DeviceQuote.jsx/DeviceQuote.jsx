import React, { useEffect, useState, useRef } from "react";
const currentDomain = window.location.origin;
const DEFAULT_LOGO = "/Grest_Logo.jpg";
const BUYBACK_LOGO = "/Grest_Logo_2.jpg";

const isBuybackDomain = currentDomain === import.meta.env.VITE_BUYBACK_URL;
const GREST_LOGO = isBuybackDomain ? BUYBACK_LOGO : DEFAULT_LOGO;
import styles from "./DeviceQuote.module.css";
import QuoteModal from "../../components/QuoteModal/QuoteModal";
import ContOTP from "../../components/ContOTP/ContOTP";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DeviceReport from "../../components/DeviceReport/DeviceReport";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import apple_watch from "../../assets/apple_watch.png";
import { setResponseData } from "../../store/slices/responseSlice";
import { toast } from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { BeatLoader } from "react-spinners";

const buyback = import.meta.env.VITE_BUYBACK_URL;
const switchKart = import.meta.env.VITE_SWITCHKART_URL;
const deviceTypePage = "/selectdevicetype";

const calculateDisplayPrice = ({ quoteSaved, savedBonus, Price, bonus }) => {
  if (quoteSaved) {
    return savedBonus
      ? Number(Price) + Number(bonus) - Number(savedBonus)
      : Number(Price) + Number(bonus);
  } else {
    return Number(Price);
  }
};

const DeviceQuote = () => {
  const dispatch = useDispatch();
  const Device = sessionStorage.getItem("DeviceType");
  const DummyImg = Device === "CTG1"
    ? "https://grest-c2b-images.s3.ap-south-1.amazonaws.com/gresTest/1705473080031front.jpg"
    : apple_watch;
  const phoneImg = JSON.parse(sessionStorage.getItem("dataModel"));
  const phoneFrontPhoto =
    phoneImg?.models?.phonePhotos?.front ||
    phoneImg?.models?.phonePhotos?.upFront;
  const exactQuoteValue = sessionStorage.getItem("ExactQuote");
  const dataModel = JSON.parse(sessionStorage.getItem("dataModel"));
  const deviceModalInfo = dataModel;
  const [showModal, setShowModal] = useState(false);
  const [continueOTPOpen, setContinueOTPOpen] = useState(false);
  const [showDeviceReport, setShowDeviceReport] = useState(false);
  const [quoteSaved, setQuoteSaved] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const savedBonus = useSelector((state) => state.responseData?.bonus) || null;
  const [termsChecked, setTermsChecked] = useState(false);
  const ResponseData = useSelector((state) => state.responseData);
  const Price = useSelector((state) => state.responseData.price);
  const uniqueCode = useSelector((state) => state.responseData.uniqueCode);
  const [bonus, setBonus] = useState(0);
  const [eligibleCoupon, setEligibleCoupon] = useState(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isLoadingCoupon, setIsLoadingCoupon] = useState(true);
  const leadId = sessionStorage.getItem("LeadId");
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    setQuoteId(uniqueCode);
  }, [uniqueCode]);
  const displayPrice = calculateDisplayPrice({
    quoteSaved,
    savedBonus,
    Price,
    bonus
  });
  const continueOTPHandler = () => {
    const resData = {
      grade: ResponseData.grade,
      price: 0,
      bonus: 0,
      uniqueCode: ResponseData.uniqueCode,
      id: ResponseData.id,
    };
    resData.price = Number(ResponseData.price);
    resData.bonus = Number(bonus);
    sessionStorage.setItem("responsedatadata", JSON.stringify(resData));
    dispatch(setResponseData(resData));
    setContinueOTPOpen(!continueOTPOpen);
  };
  const showDeviceReportHandler = () => {
    setShowDeviceReport(!showDeviceReport);
  };
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const hasShownError = useRef(false);
  useEffect(() => {
    if (
      !hasShownError.current &&
      quoteSaved === false &&
      exactQuoteValue === "true" &&
      currentDomain !== buyback
    ) {
      hasShownError.current = true;
    }
  }, [quoteSaved, exactQuoteValue, currentDomain]);


  useEffect(() => {
    const fetchCoupon = async () => {
      if (!leadId || !token) {
        setIsLoadingCoupon(false);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/coupons/find-eligible/${leadId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const coupon = response?.data?.data;
        setEligibleCoupon(coupon);
        if (coupon && coupon.couponCode) {
          sessionStorage.setItem("eligibleCouponCode", coupon.couponCode);
        }
      } catch (error) {
        console.error("❌ Error fetching coupon:", error?.response?.data || error.message);
        setEligibleCoupon(null);
      } finally {
        setIsLoadingCoupon(false);
      }
    };
    fetchCoupon();
  }, [leadId, token]);

  const handleApplyCoupon = () => {
    if (!eligibleCoupon) return;
    const discountAmount = eligibleCoupon.discountType === 'Fixed'
      ? eligibleCoupon.discountValue
      : (Price * eligibleCoupon.discountValue) / 100;

    setBonus(Math.round(discountAmount));
    setIsCouponApplied(true);
    toast.success(`Coupon "${eligibleCoupon.couponCode}" applied!`);
  };

  const handleRemoveCoupon = () => {
    setBonus(0);
    setIsCouponApplied(false);
    toast.success("Coupon bonus removed.");
  };

  return (
    <div
      className={`bg-white min-h-screen ${styles.page_wrap}`}
      style={{
        paddingTop: continueOTPOpen ? 0 : 'calc(4rem + env(safe-area-inset-top))',
        minHeight: '100vh'
      }}
    >
      {continueOTPOpen ? (
        <ContOTP setContinueOTPOpen={setContinueOTPOpen} />
      ) : (
        <>
          <DeviceQuoteHeader isContOTPOpen={continueOTPOpen} />
          <div className="max-w-[900px] mx-auto px-4 flex flex-col items-center">
            <p className="my-4 text-xl font-medium">Device Quote Details</p>
            <div className={`${styles.QuoteCardShadow} rounded-md p-4 w-full max-w-[600px]`}>
              <div className="flex items-center gap-4">
                <div>
                  <img
                    className="w-[50px]"
                    src={phoneFrontPhoto ? phoneFrontPhoto : DummyImg}
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <p className="font-medium text-gray-700">
                    {`${deviceModalInfo.models?.name}${deviceModalInfo.models?.type === "CTG1"
                      ? `(${deviceModalInfo.models?.config?.RAM}/${deviceModalInfo.models?.config?.storage})`
                      : ""
                      }`}
                  </p>
                  <p className="text-primary font-semibold">₹{displayPrice.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <QuoteModal
                show={showModal}
                handleClose={toggleModal}
                setQuoteSaved={setQuoteSaved}
                quoteId={quoteId}
                bonusPrice={bonus}
              />
              {quoteSaved === false &&
                exactQuoteValue === "true" &&
                currentDomain !== buyback && (
                  <>
                    <div className="px-2  my-3 h-12 flex items-center justify-center">
                      {isLoadingCoupon ? (
                        <BeatLoader color="var(--primary-color)" size={8} />
                      ) : eligibleCoupon ? (
                        <div className="flex items-center justify-between w-full p-2 bg-green-100 border border-green-400 rounded-md">
                          <p className="text-sm font-medium text-green-800">
                            Eligible: {eligibleCoupon.couponCode} ({eligibleCoupon.discountType === 'Fixed' ? `₹${eligibleCoupon.discountValue}` : `${eligibleCoupon.discountValue}%`})
                          </p>
                          {!isCouponApplied ? (
                            <button onClick={handleApplyCoupon} className="px-3 py-1 text-xs font-semibold text-white bg-primary rounded-md">Apply</button>
                          ) : (
                            <button onClick={handleRemoveCoupon} className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-md">Remove</button>
                          )}
                        </div>
                      ) : (
                        <div className="w-full p-2 text-center bg-gray-100 border border-gray-300 rounded-md">
                          <p className="text-sm font-medium text-gray-600">No coupons available for this device.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              <div className="mx-1 my-4 border-b-2 border-gray-400 border-dashed"></div>
              <div className="flex items-center justify-between">
                <p
                  className="text-gray-700 text-[17px] underline font-medium"
                  onClick={showDeviceReportHandler}
                >
                  Device Report
                </p>
                {quoteSaved === false && (
                  <button
                    className="text-primary border-2 border-primary text-sm font-medium p-2 rounded-md"
                    onClick={toggleModal}
                  >
                    Save Quote
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 flex flex-col w-full gap-2 p-4 border-t-2">
            {quoteSaved === false && exactQuoteValue === "true" && (
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={() => setTermsChecked(!termsChecked)}
                />
                <p className="font-medium">
                  I agree to the
                  <span className="text-primary cursor-pointer">
                    Terms & Conditions
                  </span>
                </p>
              </div>
            )}
            <SubDeviceQuote
              savedBonus={savedBonus}
              Price={Price}
              bonus={bonus}
              quoteSaved={quoteSaved}
              exactQuoteValue={exactQuoteValue}
              termsChecked={termsChecked}
              continueOTPHandler={continueOTPHandler}
            />
          </div>
        </>
      )}
      {showDeviceReport && (
        <DeviceReport
          setShowDeviceReport={setShowDeviceReport}
          quoteSaved={quoteSaved}
        />
      )}
    </div>
  );
};
export default DeviceQuote;
const SubDeviceQuote = ({
  savedBonus,
  Price,
  bonus,
  quoteSaved,
  exactQuoteValue,
  termsChecked,
  continueOTPHandler,
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10); // 10 seconds countdown
  useEffect(() => {
    let timer;
    if (quoteSaved && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          console.log("Countdown:", prevCount - 1); // Log the countdown
          return prevCount - 1;
        });
      }, 1000);
    } else if (quoteSaved && countdown === 0) {
      navigate(deviceTypePage);
    }
    return () => clearInterval(timer);
  }, [quoteSaved, countdown, navigate]);
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col w-1/2 text-xl font-medium">
        <p>
          ₹
          {Number(Price) + Number(bonus)}
        </p>
      </div>
      {quoteSaved === false && exactQuoteValue === "true" && (
        <div
          onClick={termsChecked ? continueOTPHandler : undefined}
          className={`${termsChecked ? "bg-primary" : "bg-gray-400 cursor-not-allowed"
            } py-1 rounded-lg cursor-pointer w-1/2 sm:max-w-[200px]  flex justify-between px-2 text-white items-center`}
        >
          <p className="font-medium mx-auto text-xl p-[6px] ">Continue</p>
        </div>
      )}
      {quoteSaved === false && exactQuoteValue === "false" && (
        <div
          onClick={() => navigate("/device/Qestions")}
          className="bg-primary rounded-lg cursor-pointer w-1/2 sm:max-w-[200px] flex justify-between px-2 text-white items-center"
        >
          <p className="p-2 mx-auto text-lg font-medium ">Get Exact Value</p>
        </div>
      )}
      {quoteSaved === true && (
        <div
          onClick={() => navigate(deviceTypePage)}
          className="bg-primary rounded-lg cursor-pointer w-1/2 sm:max-w-[200px] flex justify-between px-2 text-white items-center"
        >
          <p className="p-2 mx-auto text-lg font-medium ">
            Return To Home ({countdown}s){" "}
          </p>
        </div>
      )}
    </div>
  );
};

const DeviceQuoteHeader = ({ isContOTPOpen }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`flex items-center justify-center border-b-2 w-screen bg-white fixed top-0 left-0 z-50`}
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)',
        height: 'calc(4rem + env(safe-area-inset-top))'
      }}
    >
      <div className="flex items-center justify-between w-full max-w-screen px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-xs flex items-center justify-center text-white bg-[--primary-color] hover:cursor-pointer p-2 rounded-full"
          >
            <IoArrowBack size={20} />
          </button>
          {!isContOTPOpen && (
            <img
              onClick={() => navigate(deviceTypePage)}
              className="w-[120px] sm:w-[130px] md:w-[150px] object-contain cursor-pointer"
              src={GREST_LOGO}
              alt="app logo"
            />
          )}
        </div>
        {!isContOTPOpen && <ProfileBox />}
      </div>
    </div>
  )
}
