import React from "react";
import styles from "./DeviceReport.module.css";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const DeviceReport = ({ setShowDeviceReport, quoteSaved }) => {
  console.log(quoteSaved);
  const exactQuoteValue = sessionStorage.getItem("ExactQuote");
  const DeviceType = sessionStorage.getItem("DeviceType");
  const isWatch = DeviceType === "Watch" ? true : false;
  const navigate = useNavigate();
  let data = useSelector((state) => state.qna);
  const watchdata = useSelector((state) => state.watchQNA);
  const quickData = useSelector((state) => state.qnaQuick);
  console.log(quickData)
  if (isWatch) {
    data = watchdata;
  }

  const closeHandler = () => {
    setShowDeviceReport(false);
  };

  const clickHandler = () => {
    if (!isWatch) {
      if (exactQuoteValue === "true") {
        navigate("/device/Qestions");
      } else {
        navigate("/QuickQuote");
      }
    } else {
      navigate("/watchQs");
    }
  };

  return (
    <div className={`${styles.devrep_page} z-50 select-none`}>
        <div className={`${styles.devrep_wrap}`}>
          <div className={`${styles.devrep_nav}`}>
            <p className="px-2 text-xl font-medium border-r-2 border-black cursor-default">
              Device Report
            </p>
            {!quoteSaved && (
              <p
                onClick={clickHandler}
                className="cursor-pointer pl-2 text-sm font-medium text-primary underline underline-offset-2 hover:underline-offset-4"
              >
                Modify Answers
              </p>
            )}
            <IoClose
              size={25}
              className="absolute right-2 text-primary cursor-pointer"
              onClick={closeHandler}
            />
          </div>
          <CoreCosDis data={data} quickData={quickData} />
          {(data?.Accessories.length > 0 ) &&

          <div className={`${styles.ques_box}`}>
            <p className={`${styles.ques_head} font-medium text-base`}>
              Accessories
            </p>
            <div className={`${styles.ques_wrap}`}>
              {data?.Accessories.map((item) => (
                <div key={item.index} className="flex flex-row items-center w-full">
                  <LuDot size={25} className="shrink-0 text-primary" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">{item.quetion}</p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          }
          {(data?.Functional.length > 0 ) &&

          <div className={`${styles.ques_box}`}>
            <p className={`${styles.ques_head} font-medium text-base`}>
              Functional
            </p>
            <div className={`${styles.ques_wrap}`}>
              {data?.Functional.map((item) => (
                <div key={item.index} className="flex flex-row items-center w-full">
                  <LuDot size={25} className="shrink-0 text-primary" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">{item.quetion}</p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          }
          {(data?.Physical) &&
          <div className={`${styles.ques_box}`}>
            <p className={`${styles.ques_head} font-medium text-base`}>Physical</p>
            <div className={`${styles.ques_wrap}`}>
              {data?.Physical?.map((item, ItemIndex) => (
                <div key={ItemIndex} className="flex flex-row w-full items-center">
                  <LuDot className="shrink-0 text-primary" size={25} />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm  opacity-60 font-medium">
                      {item.quetion}
                    </p>
                    <p className="ml-2 font-mediumfont-medium text-base  uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          }
          <>
            <FunctionalList
              title="Functional Major"
              data={data?.Functional_major}
              quickData={quickData?.Functional_major}
              exactQuoteValue={exactQuoteValue}
            />
            <FunctionalList
              title="Functional Minor"
              data={data?.Functional_minor}
              quickData={quickData?.Functional_minor}
              exactQuoteValue={exactQuoteValue}
            />
          </>
          <div className={`${styles.ques_box}`}>
            <p className={`${styles.ques_head} font-medium text-base`}>
              Warranty
            </p>
            <div className="flex div">
              <LuDot size={25} className="shrink-0 text-primary" />
              <p className="text-sm font-medium opacity-[0.8]">
                What is your phone's age?
              </p>
            </div>
            <div className={`${styles.ques_wrap}`}>
              {exactQuoteValue === "false"
                ? quickData.Warranty.map((item) => (
                    <div
                      key={item.index}
                      className="flex flex-row items-center w-full"
                    >
                      {item.key === "yes" && (
                        <div className="flex justify-between w-[85%] questionkey">
                          <p className="text-sm font-medium opacity-60 ml-[30px]">
                            {item.quetion}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                : data.Warranty.map((item) => (
                    <div
                      key={item.index}
                      className="flex flex-row items-center w-full"
                    >
                      {item.key === "yes" && (
                        <div className="flex justify-between w-[85%] questionkey">
                          <p className="text-sm font-medium opacity-60 ml-[30px]">
                            {item.quetion}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default DeviceReport;

const CoreCosDis = ({ data, quickData }) => {
  const exactQuoteValue = sessionStorage.getItem("ExactQuote");
  return (
    <React.Fragment>
      {(quickData?.Core.length > 0 || data?.Core.length > 0) &&
      <div className={`${styles.ques_box}`}>
        <p className={`${styles.ques_head} font-medium text-base`}>Core</p>
        <div className={`${styles.ques_wrap}`}>
          {exactQuoteValue === "false"
            ? quickData?.Core.slice(0, 2).map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-primary" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))
            : data?.Core.map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-primary" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
      }
      {(quickData?.Cosmetics.length > 0 || data?.Cosmetics.length > 0) &&
      <div className={`${styles.ques_box}`}>
        <p className={`${styles.ques_head} font-medium text-base`}>Cosmetics</p>
        <div className={`${styles.ques_wrap}`}>
          {exactQuoteValue === "false"
            ? quickData?.Cosmetics.slice(0, 2).map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-primary" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))
            : data?.Cosmetics.map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-primary" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
      }
  {(quickData?.Display.length > 0 || data?.Display.length > 0) &&
      <div className={`${styles.ques_box}`}>
        <p className={`${styles.ques_head} font-medium text-base`}>Display</p>
        <div className={`${styles.ques_wrap}`}>
          {exactQuoteValue === "false"
            ? quickData?.Display.slice(0, 2).map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-primary" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))
            : data?.Display.map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-primary" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    }
    </React.Fragment>
  );
};

const FunctionalList = ({ title, data, quickData, exactQuoteValue }) => {
  const items =
    exactQuoteValue === "false"
      ? quickData?.slice(0, 2)
      : data;

  if (!items || items.length === 0) {
    return null;
  }
  return (
    <div className={`${styles.ques_box}`}>
      <p className={`${styles.ques_head} font-medium text-base`}>{title}</p>
      <div className={`${styles.ques_wrap}`}>
        {items.map((item, index) => (
          <div key={index} className="flex flex-row items-center w-full">
            <LuDot size={25} className="shrink-0 text-primary" />
            <div className="flex justify-between w-[85%] questionkey">
              <p className="text-sm font-medium opacity-60">{item.quetion}</p>
              <p className="ml-2 text-base font-medium uppercase">{item.key}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
