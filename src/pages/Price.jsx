import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const currentDomain = window.location.origin;
const DEFAULT_LOGO = "/Grest_Logo.jpg";
const BUYBACK_LOGO = "/Grest_Logo_2.jpg"; // Use your actual buyback logo

const isBuybackDomain = currentDomain === import.meta.env.VITE_BUYBACK_URL;
const GREST_LOGO = isBuybackDomain ? BUYBACK_LOGO : DEFAULT_LOGO;
import axios from "axios";
import User_Logo from "../assets/User_Logo.jpg";
import { FaCamera, FaInfoCircle } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";
const pink = "bg-primary";
const fileUploader = async (authToken, file, fileName, fileType) => {
  try {
    const resURL = await axios.get(
      `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/s3/get-presigned-url`,
      {
        params: {
          fileName: fileName,
          fileType: fileType,
        },
        headers: { Authorization: authToken },
      },
    );
    if (resURL?.data?.url) {
      const presignedUrl = resURL.data.url;
      const result = await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": fileType,
        },
      });
      console.log("File uploaded successfully:", result);
    }
  } catch (error) {
    console.log("Error uploading file:", error);
    throw error;
  }
};
const Price = () => {
  const leadsubmitRaw = sessionStorage.getItem("responsedatadata");
  const leadsubmitDATA =
    leadsubmitRaw && leadsubmitRaw !== "undefined"
      ? JSON.parse(leadsubmitRaw)
      : null;
  const otpDataRaw = localStorage.getItem("otpData");
  const savedOtpData =
    otpDataRaw && otpDataRaw !== "undefined" ? JSON.parse(otpDataRaw) : null;
  const token = sessionStorage.getItem("authToken");
  const [file, setFile] = useState(null);
  const [idProofBack, setIdProofBack] = useState(null);
  const [phoneBill, setPhoneBill] = useState(null);
  const [phoneFront, setPhoneFront] = useState(null);
  const [phoneBack, setPhoneBack] = useState(null);
  const [phoneLeft, setPhoneLeft] = useState(null);
  const [phoneRight, setPhoneRight] = useState(null);
  const [phoneTop, setPhoneTop] = useState(null);
  const [phoneBottom, setPhoneBottom] = useState(null);
  const [aadharNumber, setAadharNumber] = useState("");
  const [imeinumber, setImeiNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const idproofBackRef = useRef(null);
  const phoneBillRef = useRef(null);
  const phoneFrontRef = useRef(null);
  const phoneBackRef = useRef(null);
  const phoneLeftRef = useRef(null);
  const phoneRightRef = useRef(null);
  const phoneTopRef = useRef(null);
  const phoneBottomRef = useRef(null);
  const [isBillRequired, setIsBillRequired] = useState(false);
  const Device = sessionStorage.getItem("DeviceType");
  const categoriesRaw = sessionStorage.getItem("Categories");
  const categories =
    categoriesRaw && categoriesRaw !== "undefined"
      ? JSON.parse(categoriesRaw)
      : [];
  const prod = categories.filter((elem) => elem.categoryCode === Device);
  useEffect(() => {
    const billDataRaw = sessionStorage.getItem("billData");
    const billData =
      billDataRaw && billDataRaw !== "undefined"
        ? JSON.parse(billDataRaw)
        : null;
    if (billData && billData?.selected[0] === false) {
      setIsBillRequired(true);
    }
  }, []);
  const handleCameraButtonClick = (ref) => {
    if (!ref.current) {
      return;
    }
    ref.current.click();
  };
  const handleChange = (setMEthod, e) => {
    const doc = e.target.files[0];
    setMEthod(doc);
  };
  const uploadAllImages = async () => {
    setIsLoading(true);
    if (aadharNumber.length !== 12) {
      toast.error("Aadhar number must be exactly 12 digits.");
      setIsLoading(false);
      return;
    }
    if (
      !imeinumber ||
      !aadharNumber ||
      !phoneFront ||
      !phoneBack ||
      !phoneLeft ||
      !phoneRight ||
      !phoneTop ||
      !phoneBottom ||
      (isBillRequired && !phoneBill)
    ) {
      alert(
        "Please fill in all mandatory fields (IMEI/Serial number and device images).",
      );
      setIsLoading(false);
      return;
    }
    try {
      await fileUploader(token, file, imeinumber + "-adhaarFront", file.type);
      await fileUploader(
        token,
        idProofBack,
        imeinumber + "-adhaarBack",
        idProofBack.type,
      );
      if (phoneBill) {
        await fileUploader(
          token,
          phoneBill,
          imeinumber + "-phoneBill",
          phoneBill.type,
        );
      }
      await fileUploader(
        token,
        phoneFront,
        imeinumber + "-phoneFront",
        phoneFront.type,
      );
      await fileUploader(
        token,
        phoneBack,
        imeinumber + "-phoneBack",
        phoneBack.type,
      );
      await fileUploader(
        token,
        phoneTop,
        imeinumber + "-phoneTop",
        phoneTop.type,
      );
      await fileUploader(
        token,
        phoneLeft,
        imeinumber + "-phoneLeft",
        phoneLeft.type,
      );
      await fileUploader(
        token,
        phoneRight,
        imeinumber + "-phoneRight",
        phoneRight.type,
      );
      await fileUploader(
        token,
        phoneBottom,
        imeinumber + "-phoneBottom",
        phoneBottom.type,
      );
      await fileUploader(
        token,
        phoneBottom,
        imeinumber + "-signature",
        phoneBottom.type,
      );
    } catch (error) {
      setIsLoading(false);
    }
    const formData = new FormData();
    formData.append("IMEI", imeinumber);
    formData.append("leadId", leadsubmitDATA?.id);
    formData.append("emailId", savedOtpData?.email);
    formData.append("name", savedOtpData?.name);
    formData.append("phoneNumber", savedOtpData?.phone);
    formData.append("aadharNumber", aadharNumber);
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/questionnaires/upload-documents`,
        formData,
        { headers: { Authorization: token } },
      );
      setIsLoading(false);
      navigate("/specialoffers");
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-[100vh] max-h-[200vh] overflow-y-auto bg-white ">
      <PriceHeader navigate={navigate} />
      <div className="w-[90%] md:w-[90%] mx-auto h-[auto] mb-[93px]">
        <div className="mt-3 text-center relative">
          <h1 className="text-2xl font-semibold">Upload Documents</h1>
          <p className="mt-4 text-gray-600">
            Regulations require you to upload a national identity card. Don't
            worry, your data will stay safe and private.
          </p>
        </div>
        <div className="flex flex-col">
          <ImeiField
            setImeiNumber={setImeiNumber}
            imeinumber={imeinumber}
            prod={prod}
          />
          <AadharNumberField
            setAadharNumber={setAadharNumber}
            aadharNumber={aadharNumber}
            prod={prod}
          />
          <AdharField
            handleChange={handleChange}
            setFile={setFile}
            fileInputRef={fileInputRef}
            handleCameraButtonClick={handleCameraButtonClick}
            file={file}
            setIdProofBack={setIdProofBack}
            idProofBack={idProofBack}
            idproofBackRef={idproofBackRef}
            prod={prod}
          />
          <PhoneBill
            handleChange={handleChange}
            setPhoneBill={setPhoneBill}
            phoneBackRef={phoneBackRef}
            handleCameraButtonClick={handleCameraButtonClick}
            phoneBillRef={phoneBillRef}
            phoneBill={phoneBill}
            isBillRequired={isBillRequired}
            prod={prod}
          />
          <PhonePhotos1
            handleCameraButtonClick={handleCameraButtonClick}
            handleChange={handleChange}
            phoneFront={phoneFront}
            setPhoneFront={setPhoneFront}
            phoneFrontRef={phoneFrontRef}
            setPhoneBottom={setPhoneBottom}
            phoneBackRef={phoneBackRef}
            phoneBack={phoneBack}
            phoneBottom={phoneBottom}
            phoneTop={phoneTop}
            phoneBottomRef={phoneBottomRef}
            setPhoneLeft={setPhoneLeft}
            setPhoneBack={setPhoneBack}
            setPhoneTop={setPhoneTop}
            phoneLeft={phoneLeft}
            phoneRight={phoneRight}
            phoneTopRef={phoneTopRef}
            phoneRightRef={phoneRightRef}
            setPhoneRight={setPhoneRight}
            phoneLeftRef={phoneLeftRef}
            prod={prod}
          />
        </div>
      </div>
      <div className="fixed bottom-0 flex flex-col w-full gap-2 p-4 bg-white border-t-2 ">
        <div
          onClick={() => uploadAllImages()}
          className={` relative text-center py-1 px-2 rounded-lg cursor-pointer flex justify-between text-white items-center ${
            !imeinumber ||
            !phoneFront ||
            !phoneBack ||
            !phoneLeft ||
            !phoneRight ||
            !phoneTop ||
            !phoneBottom
              ? "cursor-not-allowed bg-gray-400"
              : pink
          }`}
        >
          {isLoading && (
            <CgSpinner
              size={20}
              className="absolute left-[28%] top-[8px] mt-1 animate-spin"
            />
          )}
          <p className="w-full p-1 text-xl font-medium">
            {isLoading ? "Submitting" : "Submit"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Price;

const ImeiField = ({ imeinumber, setImeiNumber, prod }) => {
  const [error, setError] = useState(true);
  const validateImeiNumber = (value) => {
    if (value.length !== 15) {
      setError("IMEI number must less than or equal to 15 digits.");
      return false;
    } else if (!/^\d{15}$/.test(value)) {
      setError("IMEI number must only contain digits.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setImeiNumber(value);
    validateImeiNumber(value);
    const dataModelRaw = sessionStorage.getItem("dataModel");
    if (dataModelRaw && dataModelRaw !== "undefined") {
      const dataModel = JSON.parse(dataModelRaw);
      dataModel.imei = value;
      sessionStorage.setItem("dataModel", JSON.stringify(dataModel));
    }
  };

  const handleVerify = () => {
    if (validateImeiNumber(imeinumber)) {
      // Handle the verify logic here
      console.log("IMEI number is valid.");
    }
  };

  return (
    <div className="flex flex-col eminumber mt-[4px]">
      <div className="flex gap-1 two">
        <p className="text-base font-medium">1.</p>
        <p className="text-base font-medium three">
          Enter your {prod[0]?.categoryName} IMEI No./serial no.
          <span className="text-red-500">*</span>
        </p>
      </div>

      <div className="flex items-center gap-4 mt-2 ml-[19px]">
        <input
          type="text"
          className="w-auto p-2 border-2 border-gray-300 rounded"
          value={imeinumber}
          placeholder="IMEI no./Serial no."
          onChange={handleChange}
          maxLength={15}
        />
        <button
          className={`px-4 py-2 font-bold text-white rounded ${
            !error ? pink : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleVerify}
          disabled={!!error}
        >
          Verify
        </button>
      </div>
      {error && <p className="text-primary mt-2 text-sm">{error}</p>}
    </div>
  );
};
const AadharNumberField = ({ aadharNumber, setAadharNumber }) => {
  const [error, setError] = useState(true);

  const validateAadharNumber = (value) => {
    if (value.length !== 12) {
      setError("Aadhar Number number must be exactly 12 digits.");
      return false;
    } else if (!/^\d{12}$/.test(value)) {
      setError("Aadhar Number must only contain digits.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setAadharNumber(value);
    validateAadharNumber(value);
  };

  const handleVerify = () => {
    if (validateAadharNumber(aadharNumber)) {
      // Handle the verify logic here
      console.log("Aadhar Number is valid.");
    }
  };

  return (
    <div className="flex flex-col eminumber mt-[4px]">
      <div className="flex gap-1 two">
        <p className="text-base font-medium">2.</p>
        <p className="text-base font-medium three">
          Enter your Aadhar Number
          <span className="text-red-500">*</span>
        </p>
      </div>

      <div className="flex items-center gap-4 mt-2 ml-[19px]">
        <input
          type="text"
          className="w-auto p-2 border-2 border-gray-300 rounded"
          value={aadharNumber}
          placeholder="Aadhar no."
          onChange={handleChange}
          maxLength={12}
        />
        <button
          className={`px-4 py-2 font-bold text-white rounded ${
            !error ? pink : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleVerify}
          disabled={!!error}
        >
          Verify
        </button>
      </div>
      {error && <p className="text-primary mt-2 text-sm">{error}</p>}
    </div>
  );
};
const AdharField = ({
  handleChange,
  setFile,
  fileInputRef,
  handleCameraButtonClick,
  file,
  setIdProofBack,
  idProofBack,
  idproofBackRef,
}) => {
  return (
    <div className="flex flex-col adharcard mt-[10px]">
      <div className="flex gap-1 two">
        <p className="text-base font-medium">3.</p>
        <div className="flex items-center">
          <p className="text-base font-medium three">
            {"Upload your Aadhar Card"} <span className="text-red-500">*</span>
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-primary">
        Note: Image size should not exceed 2MB
      </p>
      <div className="flex inputAADHAR justify-evenly">
        <div className="p-1 mt-4 text-center border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-primary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="font-semibold text-center">Adhaar(Front)</p>
          <input
            type="file"
            onChange={(e) => handleChange(setFile, e)}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <button onClick={() => handleCameraButtonClick(fileInputRef)}>
            {!file ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                className="w-full h-[60px]"
                src={URL.createObjectURL(file)}
                alt="Uploaded file"
              />
            )}
          </button>
        </div>
        <div className="p-1 mt-4 text-center border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-primary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="font-semibold text-center">Adhaar(Back)</p>
          <input
            type="file"
            onChange={(e) => handleChange(setIdProofBack, e)}
            style={{ display: "none" }}
            ref={idproofBackRef}
          />
          <button onClick={() => handleCameraButtonClick(idproofBackRef)}>
            {!idProofBack ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                className="w-full h-[60px]"
                src={URL.createObjectURL(idProofBack)}
                alt="Uploaded file"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const PhoneBill = ({
  handleChange,
  setPhoneBill,
  phoneBackRef,
  handleCameraButtonClick,
  phoneBillRef,
  phoneBill,
  isBillRequired,
  prod,
}) => {
  return (
    <div className="flex flex-col adharcard mt-[10px]">
      <div className="flex gap-1 two">
        <p className="text-base font-medium">4.</p>
        <div className="flex items-center">
          <p className="text-base font-medium three">
            Upload your {prod[0]?.categoryName} bill
            {isBillRequired && <span className="text-red-500">*</span>}
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-primary">
        Note: Image size should not exceed 2MB
      </p>
      <div className="flex justify-start ml-3 inputAADHAR">
        {/* 1 */}
        <div className="p-1 mt-4 text-center border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-primary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="font-semibold text-center">
            {prod[0]?.categoryName} Bill
          </p>
          <input
            type="file"
            onChange={(e) => handleChange(setPhoneBill, e)}
            style={{ display: "none" }}
            ref={phoneBillRef}
          />
          <button onClick={() => handleCameraButtonClick(phoneBillRef)}>
            {!phoneBill ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                className="w-full h-[60px]"
                src={URL.createObjectURL(phoneBill)}
                alt="Uploaded file"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const PhonePhotos1 = ({
  handleChange,
  handleCameraButtonClick,
  setPhoneFront,
  phoneFront,
  phoneFrontRef,
  phoneBack,
  phoneBackRef,
  setPhoneBack,
  phoneBottom,
  phoneBottomRef,
  setPhoneBottom,
  phoneTop,
  phoneTopRef,
  setPhoneTop,
  phoneLeft,
  phoneLeftRef,
  setPhoneLeft,
  phoneRight,
  phoneRightRef,
  setPhoneRight,
  prod,
}) => {
  const [showHoldModal, setShowHoldModal] = useState(false);

  return (
    <div className="flex flex-col adharcard mt-[10px] ">
      <div className="flex gap-1 two">
        <p className="text-base font-medium">5.</p>
        <div className="flex items-center">
          <p className="text-base font-medium three">
            {`Upload Your ${prod[0]?.categoryName}'s Images`}{" "}
            <span className="text-red-500">*</span>
          </p>
          <FaInfoCircle
            className="ml-2 cursor-pointer"
            onClick={() => setShowHoldModal(true)}
          />
        </div>
      </div>
      <p className="mt-2 text-sm text-primary">
        Note: Image size should not exceed 2MB
      </p>
      <div className="flex flex-wrap inputAADHAR justify-evenly">
        <div className="mt-4 p-1 text-center border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-primary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="text-center font-semibold">{`${prod[0]?.categoryName} Front`}</p>
          <input
            onChange={(e) => handleChange(setPhoneFront, e)}
            type="file"
            ref={phoneFrontRef}
            style={{ display: "none" }}
          />
          <button onClick={() => handleCameraButtonClick(phoneFrontRef)}>
            {!phoneFront ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                src={URL.createObjectURL(phoneFront)}
                className="h-[60px] w-full"
                alt="Uploaded file"
              />
            )}
          </button>
        </div>
        <div className="p-1 text-center mt-4 border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-primary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="text-center font-semibold">{`${prod[0]?.categoryName} Back`}</p>
          <input
            ref={phoneBackRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleChange(setPhoneBack, e)}
          />
          <button onClick={() => handleCameraButtonClick(phoneBackRef)}>
            {!phoneBack ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                className="w-full h-[60px]"
                alt="Uploaded file"
                src={URL.createObjectURL(phoneBack)}
              />
            )}
          </button>
        </div>

        {/* 3 */}

        <div className="text-center p-1 mt-4 border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-primary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] ">
          <p className="text-center font-semibold tracking-tighter">
            {`${prod[0]?.categoryName} Left Side`}
          </p>
          <input
            onChange={(e) => handleChange(setPhoneLeft, e)}
            type="file"
            style={{ display: "none" }}
            ref={phoneLeftRef}
          />
          <button onClick={() => handleCameraButtonClick(phoneLeftRef)}>
            {!phoneLeft ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                className="h-[60px] w-full"
                alt="Uploaded file"
                src={URL.createObjectURL(phoneLeft)}
              />
            )}
          </button>
        </div>

        {/* 4 */}
        <div className="p-1 mt-4 text-center border-2 justify-between rounded-lg w-[40vw] h-[15vh] relative border-primary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="text-center font-semibold tracking-tighter">
            {`${prod[0]?.categoryName} Right Side`}
          </p>
          <input
            onChange={(e) => handleChange(setPhoneRight, e)}
            type="file"
            style={{ display: "none" }}
            ref={phoneRightRef}
          />
          <button onClick={() => handleCameraButtonClick(phoneRightRef)}>
            {!phoneRight ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                src={URL.createObjectURL(phoneRight)}
                className="w-full h-[60px]"
                alt="Uploaded file"
              />
            )}
          </button>
        </div>

        {/* 5 */}
        <div className="border-2 p-1 mt-4 text-center justify-between rounded-lg h-[15vh] w-[40vw] relative border-primary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="font-semibold text-center tracking-tighter">
            {`${prod[0]?.categoryName} Top Side`}
          </p>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleChange(setPhoneTop, e)}
            ref={phoneTopRef}
          />
          <button onClick={() => handleCameraButtonClick(phoneTopRef)}>
            {!phoneTop ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                src={URL.createObjectURL(phoneTop)}
                className="w-full h-[60px]"
                alt="Uploaded file"
              />
            )}
          </button>
        </div>

        {/* 6 */}
        <div className="mt-4 p-1 text-center border-2 justify-between rounded-lg h-[15vh] w-[40vw] relative border-primary shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p className="font-semibold text-center tracking-tighter">
            {`${prod[0]?.categoryName} Bottom Side`}
          </p>
          <input
            onChange={(e) => handleChange(setPhoneBottom, e)}
            type="file"
            style={{ display: "none" }}
            ref={phoneBottomRef}
          />
          <button onClick={() => handleCameraButtonClick(phoneBottomRef)}>
            {!phoneBottom ? (
              <FaCamera className="text-3xl text-gray-500" />
            ) : (
              <img
                src={URL.createObjectURL(phoneBottom)}
                alt="Uploaded file"
                className="w-full h-[60px]"
              />
            )}
          </button>
        </div>
      </div>
      {showHoldModal && <MobileMoldModel setShowHoldModal={setShowHoldModal} />}
    </div>
  );
};

const MobileMoldModel = ({ setShowHoldModal }) => {
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div
        className="bg-white text-black text-sm rounded w-full py-6 px-4 shadow-lg"
        style={{ lineHeight: "1.5" }}
      >
        <p>
          Upload your device images, including close-up shots of any specific
          damage, dents, scratches, or wear and tear. Photos should be taken
          from approximately 30 cm away.
        </p>
        <p className="mt-2">
          <strong>Front Side:</strong> Ensure the entire front of the device is
          visible with the display on and a black screen background. Include the
          full screen and bezels.
        </p>
        <p className="mt-2">
          <strong>Back Side:</strong> Capture the entire back side, including
          the camera, logo, and any scratches or dents.
        </p>
        <p className="mt-2">
          <strong>Left Side:</strong> Show the complete left side, including
          buttons and any ports.
        </p>
        <p className="mt-2">
          <strong>Right Side:</strong> Show the complete right side, including
          buttons and any ports.
        </p>
        <p className="mt-2">
          <strong>Top Side:</strong> Show the full top edge of the device,
          including any ports or sensors.
        </p>
        <p className="mt-2">
          <strong>Bottom Side:</strong> Capture the full bottom edge, including
          any ports or speakers.
        </p>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowHoldModal(false)}
            className="bg-white text-[#4900AB] px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const PriceHeader = ({ navigate }) => {
  const userName = "";
  return (
    <div className="flex items-center w-[99%] h-16 py-4 bg-white border-b-2 HEADER header">
      <div className="flex items-center justify-between w-full pr-4">
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => navigate(-1)}
            className="text-xs ml-2 flex items-center justify-center text-white bg-[--primary-color] hover:cursor-pointer p-2 rounded-full"
          >
            <IoArrowBack size={24} />
          </button>
          <img
            onClick={() => navigate("/selectdevicetype")}
            className="w-40"
            src={GREST_LOGO}
            alt="app logo"
          />
        </div>
        <p className=" text-base md:text-xl">{userName}</p>
        <img className="w-[30px]" src={User_Logo} alt="" />
      </div>
    </div>
  );
};
const WatchMoldModel = ({ setShowHoldModal }) => {
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div
        className="bg-white text-black text-sm rounded w-full py-6 px-4 shadow-lg"
        style={{ lineHeight: "1.5" }}
      >
        <p>
          Upload Your device images which should include close-up shot of any
          specific damage, dent, scratches or wear and tear. Photos should be
          taken from an approx distance of 30 cms.
        </p>
        <p className="mt-2">
          <strong>Front Side:</strong> Ensure the entire front of the watch is
          visible in display On condition and black screen background. It should
          include the full screen and bezels.
        </p>
        <p className="mt-2">
          <strong>Back Side:</strong> Capture the entire back Side of the watch,
          including optical heart sensors and any scratches or dents.
        </p>
        <p className="mt-2">
          <strong>Left Side:</strong> : Show the complete left side, including
          buttons and any port.
        </p>
        <p className="mt-2">
          <strong>Right Side:</strong> Show the complete Right side, including
          buttons and any port.
        </p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowHoldModal(false)}
            className="bg-white text-[#4900AB] px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
