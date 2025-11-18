import React, { useEffect, useState, useRef } from "react";
import NavigateTable from "../../components/NavigateTable/NavigateTable";
import axios from "axios";
import styles from "./PickedUpDevices.module.css";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
const currentDomain = window.location.origin;
const DEFAULT_LOGO = "/Grest_Logo.jpg";
const BUYBACK_LOGO = "/Grest_Logo_2.jpg"; // Use your actual buyback logo

const isBuybackDomain = currentDomain === import.meta.env.VITE_BUYBACK_URL;
const GREST_LOGO = isBuybackDomain ? BUYBACK_LOGO : DEFAULT_LOGO;
import ViewPickupTable from "../../components/ViewPickupTable/ViewPickupTable";
import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoMdSearch,
} from "react-icons/io";
import { IoRefresh } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import AdminNavbar from "../../components/Admin_Navbar";
import SideMenu from "../../components/SideMenu";
import { BsCalendarDate } from "react-icons/bs";
import { BeatLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setStoreFilter } from "../../store/slices/userSlice";

const userRoles = ["Pickup", "Payroll"];
const succTextColor = "text-green-500";
const failTextColor = "text-primary";
const checkOnPkd = "Check it On Picked Up";
const PendingConf = "Pending Pickup Confirmation";
const PickConf = "Pending Delivery At Warehouse"; //Technican Earlier - Pickup Confirmed
const PickDelivered = "Pickup Delivered At Warehouse"; //Technican
const ApprovDelivery = "Approved Delivery At Warehouse"; //Admin Manager
const FinalStatus = "Payment Confirmed"; //Admin Manager

const PickedUpDevices = () => {
  const LoggedInUser = JSON.parse(sessionStorage.getItem("profile"));
  const userRole = LoggedInUser?.role || "";
  const QRole = userRole === "Technician" ? userRole : "Admin";
  const token = sessionStorage.getItem("authToken");
  const isSuperAdmin = userRole === 'Super Admin';
  const userProfile = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [tempId, setTempId] = useState();
  const [tempUCode, setTempUCode] = useState();
  const [successMod, setSuccessMod] = useState(false);
  const [errorMsg, setErrorMsg] = useState("successfully updated status");
  const [errorMsg1, setErrorMsg1] = useState(null);
  const [errorMsg2, setErrorMsg2] = useState(null);
  const [confMod, setConfMod] = useState(false);
  const [failMod, setFailMode] = useState(false);
  const [region, setRegion] = useState(userProfile.selRegion);
  const [storeName, setStoreName] = useState(userProfile.selStore);
  const [regionData, setRegionData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const firsttime = useRef(true);
  const [allStore, setAllStore] = useState([]);

  const getData = () => {
    setIsTableLoaded(true);
    const configuration = {
      method: "get",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/pickupDevices/all?region=${region}&storeName=${storeName}&userRole=${QRole}`,
      headers: { Authorization: token },
    };
    axios
      .request(configuration)
      .then((res) => {
        setData(res.data.data);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setErrorMsg(`Failed to load data`);
        setIsTableLoaded(false);
        setFailMode(true);
      });
  };

  const getStore = () => {
    setIsTableLoaded(true);
    const configuration = {
      method: "get",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/store/findAll?page=0&limit=9999`,
      headers: { Authorization: token },
    };
    axios
      .request(configuration)
      .then((res) => {
        const allData = res.data.result;
        const storeNamesArr = res.data.result.map((store) => store.storeName);
        const uniqueRegionsArr = [
          ...new Set(res.data.result.map((store) => store.region)),
        ];
        setStoreData(storeNamesArr);
        setAllStore(allData);
        setIsTableLoaded(false);
        setRegionData(uniqueRegionsArr);
      })
      .catch((error) => {
        setIsTableLoaded(false);
      });
  };

  const getDataBySearch = () => {
    setIsTableLoaded(true);
    const configuration = {
      method: "get",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/pickupDevices/search?rid=${searchValue}&date=${dateValue}&region=${region}&storeName=${storeName}&userRole=${QRole}`,
      headers: { Authorization: token },
    };
    axios
      .request(configuration)
      .then((response) => {
        setData(response.data.data);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setErrorMsg(`Failed to load data`);
        setFailMode(true);
        setIsTableLoaded(false);
      });
  };


  useEffect(() => {
    if (firsttime.current && !!storeName && !!region) {
      getData();
      if (isSuperAdmin) {
        getStore();
      }
      firsttime.current = false;
    } else if (!firsttime.current) {
      getDataBySearch();
    }
  }, [dateValue, storeName, region, searchValue]);

  const confHandler = (id, uniqueCode) => {
    console.log(id);
    setTempId(id);
    setTempUCode(uniqueCode);
    setIsTableLoaded(true);
    setConfMod(true);
  };

  return (
    <div className={`${styles.pickedup_page}`}>
      <ExtComps
        successMod={successMod}
        errorMsg={errorMsg}
        errorMsg1={errorMsg1}
        errorMsg2={errorMsg2}
        setSuccessMod={setSuccessMod}
        isTableLoaded={isTableLoaded}
        setIsTableLoaded={setIsTableLoaded}
        failMod={failMod}
        setFailMode={setFailMode}
        tempUCode={tempUCode}
        confMod={confMod}
        setConfMod={setConfMod}
        setErrorMsg={setErrorMsg}
        setErrorMsg1={setErrorMsg1}
        setErrorMsg2={setErrorMsg2}
        getData={getData}
        tempId={tempId}
      />
      <div className="flex flex-row m-2 gap-4"></div>
      <NavigateTable />
      <PickedUpFilter
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        getDataBySearch={getDataBySearch}
        setDateValue={setDateValue}
        dateValue={dateValue}
        setRegion={setRegion}
        region={region}
        regionData={regionData}
        storeName={storeName}
        setStoreName={setStoreName}
        allStore={allStore}
        setStoreData={setStoreData}
        storeData={storeData}
        getData={getData}
        isSuperAdmin={isSuperAdmin}
      />
      <PickedUpDevicesTable
        data={data}
        confHandler={confHandler}
        setIsTableLoaded={setIsTableLoaded}
        setConfMod={setConfMod}
        getData={getData}
        setErrorMsg={setErrorMsg}
        setErrorMsg1={setErrorMsg1}
        setErrorMsg2={setErrorMsg2}
        setSuccessMod={setSuccessMod}
        setFailMode={setFailMode}
      />
    </div>
  );
};

export default PickedUpDevices;

const ExtComps = ({
  successMod,
  errorMsg,
  errorMsg1,
  errorMsg2,
  setSuccessMod,
  isTableLoaded,
  setIsTableLoaded,
  failMod,
  setFailMode,
  confMod,
  tempUCode,
  setConfMod,
  setErrorMsg,
  setErrorMsg1,
  setErrorMsg2,
  getData,
  tempId,
}) => {
  const [sideMenu, setsideMenu] = useState(false);
  const token1 = sessionStorage.getItem("authToken");
  const LoggedInUser = JSON.parse(sessionStorage.getItem("profile"));
  const userRole = LoggedInUser?.role || "";
  const statusUpdHandler = (refID, newStatus) => {
    setConfMod(false);
    setIsTableLoaded(true);
    const config = {
      method: "post",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/pickupDevices/update`,
      headers: { Authorization: token1 },
      data: {
        refIDs: [refID],
        newStatus: newStatus,
      },
    };
    axios
      .request(config)
      .then((response) => {
        getData();
        setErrorMsg(
          `Successfully Updated Status of Lot ${tempUCode} to ${newStatus}`
        );
        if (newStatus === ApprovDelivery) {
          setErrorMsg(`Delivery Approved for Lot ${refID}.`);
          setErrorMsg1("Check it on history.");
        }
        setIsTableLoaded(false);
        setSuccessMod(true);
      })
      .catch((error) => {
        setErrorMsg(`Failed to Updated Status of Lot ${refID} to ${newStatus}`);
        setFailMode(true);
        setIsTableLoaded(false);
      });
  };
  return (
    <React.Fragment>
      <div className="flex items-center border-b-2 w-screen h-16 py-4 bg-white HEADER ">
        {userRole === "Technician" ? (
          <div className="flex items-center justify-between w-full ">
            <ProfileBox />
            <img className="w-40" src={GREST_LOGO} alt="app logo" />
          </div>
        ) : (
          <div className="navbar">
            <AdminNavbar setsideMenu={setsideMenu} sideMenu={sideMenu} />
            <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
          </div>
        )}
      </div>
      {successMod && (
        <div className="fixed left-0 top-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} ${succTextColor}`}>
            <IoIosCheckmarkCircle size={90} className={succTextColor} />
            <h6 className={succTextColor}>Success!</h6>
            <p className="text-green-500 block">{errorMsg}</p>
            {errorMsg1 && <p className="text-slate-700 block">{errorMsg1}</p>}
            {errorMsg2 && <p className="text-slate-700 block">{errorMsg2}</p>}
            <button
              className={"text-white bg-green-500 "}
              onClick={() => {
                setSuccessMod(false);
                setErrorMsg1(null);
                setErrorMsg2(null);
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {failMod && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} ${failTextColor}`}>
            <IoIosCloseCircle className={failTextColor} size={90} />
            <h6 className={failTextColor}>Error!</h6>
            <p className="text-slate-700">{errorMsg}</p>
            <button
              onClick={() => {
                setFailMode(false);
              }}
              className={"bg-primary text-white"}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {confMod && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center h-full w-full bg-black bg-opacity-50">
          <div className={`${failTextColor} ${styles.err_mod_box} `}>
            <h6 className={failTextColor}>Confirmation!</h6>
            <p className="text-slate-700">
              {`Confirm Payment for lot - ${tempUCode} ?`}
            </p>
            <div className="flex flex-row gap-2">
              <button
                onClick={() =>
                  statusUpdHandler(tempId, "Pending Admin Approval")
                }
                className={"bg-primary text-white"}
              >
                Okay
              </button>
              <button
                onClick={() => {
                  setConfMod(false);
                  setIsTableLoaded(false);
                }}
                className="bg-white text-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isTableLoaded && (
        <div className="fixed top-0 left-0 z-49 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color="var(--primary-color)" loading={isTableLoaded} size={15} />
        </div>
      )}
    </React.Fragment>
  );
};

const PickedUpFilter = ({
  setSearchValue,
  searchValue,
  getDataBySearch,
  setDateValue,
  dateValue,
  setRegion,
  region,
  regionData,
  storeName,
  setStoreName,
  allStore,
  setStoreData,
  storeData,
  getData,
  isSuperAdmin,
}) => {
  const [regionDrop, setRegionDrop] = useState(false);
  const [storeDrop, setStoreDrop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState(storeData);
  const dispatch = useDispatch();
  const handleSearchClear = () => {
    setSearchValue("");
    setSearchTerm("");
    setDateValue("");
    setRegion("");
    setStoreName(import.meta.env.VITE_USER_STORE_NAME);
  };

  useEffect(() => {
    if (dateValue === "" && searchValue === "") {
      getData();
    }
  }, [dateValue, searchValue]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredStores(storeData);
    } else {
      const filtered = storeData.filter((store) =>
        store.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  };

  const handleRegionChange = (value) => {
    setRegionDrop(false);
    setStoreName("");
    const filteredStoresTemp = allStore?.filter((store) => store.region === value);
    const storeNamesArray = filteredStoresTemp.map((store) => store.storeName);
    dispatch(setStoreFilter({ selStore: "", selRegion: value }));
    setStoreData(storeNamesArray);
    setRegion(value);
  };

  const handleStoreChange = (value) => {
    setStoreDrop(false);
    const filteredStoresTemp2 = allStore?.filter(
      (store) => store.storeName === value
    );
    const newRegion = filteredStoresTemp2[0].region;
    setRegion(newRegion);
    dispatch(setStoreFilter({ selStore: value, selRegion: newRegion }));
    setStoreName(value);
  };

  const dateChangeHandler = (event) => {
    const formattedDate = new Date(event.target.value).toLocaleDateString(
      "en-GB"
    );
    setDateValue(formattedDate);
  };

  return (
    <div className="m-2 flex flex-col gap-2">
      <div className="mt-[3px] flex gap-2 items-center outline-none">
        <div className={`${styles.search_bar_wrap}`}>
          <input
            className="text-sm"
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            value={searchValue}
            placeholder="Search"
          />
          <IoMdSearch size={34} onClick={() => getDataBySearch()} />
        </div>
        <div className={styles.icons_box}>
          <IoRefresh className="" onClick={handleSearchClear} size={25} />
        </div>
        <div
          className={`flex flex-row  items-center justify-center ${styles.date_picker_wrap}`}
        >
          <input
            id="datepicker"
            style={{ color: "var(--primary-color)" }}
            type="date"
            value={dateValue}
            onChange={dateChangeHandler}
            className=""
          />
          <div
            onClick={() => document.getElementById("datepicker").showPicker()}
            className={styles.date_box}
          >
            <p>{dateValue ? dateValue : "DD/MM/YYYY"}</p>
            <BsCalendarDate size={25} />
          </div>
        </div>
      </div>
      {isSuperAdmin && (
        <div className="flex gap-2 w-100 items-center outline-none">
          <div className="relative w-[45%]">
            <div
              className={`${styles.filter_button}`}
              onClick={() => {
                setRegionDrop(!regionDrop);
              }}
            >
              <p className="truncate">
                {region === "" ? "Select Region" : region}
              </p>
              <FaAngleDown
                size={17}
                className={`${regionDrop && "rotate-180"}`}
              />
            </div>
            {regionDrop && (
              <div className={`${styles.filter_drop}`}>
                {regionData.map((element) => (
                  <div
                    key={element}
                    className={`${styles.filter_option}`}
                    onClick={() => handleRegionChange(element)}
                  >
                    <p className="truncate">{element}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative w-[70%]">
            <div
              className={`${styles.filter_button} w-full`}
              onClick={() => setStoreDrop(!storeDrop)}
            >
              <p className="  truncate">
                {searchTerm === "" ? "Select Store" : searchTerm}
              </p>
              <FaAngleDown className={`${storeDrop && "rotate-180"}`} size={17} />
            </div>
            {storeDrop && (
              <div className="absolute w-full bg-white   shadow-md">
                <input
                  type="text"
                  onChange={handleSearch}
                  value={searchTerm}
                  className="w-full p-2 border-b   border-gray-300"
                  placeholder="Search store..."
                />
                <div
                  className={`overflow-y-scroll   max-h-[200px] ${styles.filter_drop} w-full`}
                >
                  {filteredStores.length > 0 ? (
                    filteredStores.map((item2, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          handleStoreChange(item2);
                          setSearchTerm(item2);
                          setStoreDrop(false);
                        }}
                        className={`${styles.filter_option}`}
                      >
                        <p className="truncate">{item2}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-2   text-gray-500">No stores found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PickedUpDevicesTable = ({
  data,
  confHandler,
  setIsTableLoaded,
  setConfMod,
  getData,
  setErrorMsg,
  setErrorMsg1,
  setErrorMsg2,
  setSuccessMod,
  setFailMode,
}) => {
  const LoggedInUser = JSON.parse(sessionStorage.getItem("profile"));
  const userRole = LoggedInUser?.role || "";
  const [showView, setShowView] = useState(false);
  const [viewRef, setViewRef] = useState("");
  const token2 = sessionStorage.getItem("authToken");
  const viewHandler = (refID) => {
    setViewRef(refID);
    setShowView(true);
  };

  const statusUpdateHandler = (refID, newStatus, uniqueCode) => {
    setIsTableLoaded(true);
    setConfMod(false);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/pickupDevices/update`,
      headers: { Authorization: token2 },
      data: {
        refIDs: [refID],
        newStatus: newStatus,
      },
    };
    console.log(config);
    axios
      .request(config)
      .then((response) => {
        setErrorMsg(`Successfully Updated Status to ${newStatus}`);
        setErrorMsg1(`Lot No. :- ${uniqueCode}`);
        setErrorMsg2(checkOnPkd);
        if (newStatus === PickConf) {
          setErrorMsg(`Pickup Confirmed Successfully, Lot No. ${uniqueCode}`);
          setErrorMsg1(`Status Pending for Delivery at Warehouse`);
          setErrorMsg2(checkOnPkd);
        }
        if (newStatus === PickDelivered) {
          setErrorMsg(`Successfully Updated Status to ${newStatus}`);
          setErrorMsg1(
            `Pending Admin Approval for Delivery for Lot No. :- ${uniqueCode}`
          );
          setErrorMsg2("Check it On History");
        }
        if (newStatus === ApprovDelivery) {
          setErrorMsg(`Successfully Updated Status to ${newStatus}`);
          setErrorMsg1(`Lot No. :- ${uniqueCode}`);
          setErrorMsg2("Check it On History");
        }
        console.log(response);
        setSuccessMod(true);
        getData();
      })
      .catch((error) => {
        setErrorMsg(
          `Failed to updated the status of lot ${uniqueCode} to ${newStatus}`
        );
        setFailMode(true);
        setIsTableLoaded(false);
      });
  };
  return (
    <div className={`${styles.pd_cont}`}>
      <div className="m-2 overflow-x-auto md:m-5">
        {showView && (
          <div className={styles.view_wrap}>
            <ViewPickupTable refNo={viewRef} setShowView={setShowView} />
          </div>
        )}
        <table className="w-full border border-primary">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-2 text-sm md:p-3 md:text-base">Action</th>
              <th className="p-2 text-sm md:p-3 md:text-base">Status</th>
              <th className="p-2 text-sm md:p-3 md:text-base">Date</th>
              <th className="p-2 text-sm md:p-3 md:text-base">Lot Number</th>
              <th className="p-2 text-sm md:p-3 md:text-base">
                Number Of Device
              </th>
              <th className="p-2 text-sm md:p-3 md:text-base">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-200" : ""}>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {userRoles[userRole] === "Store" && (
                    <div className="flex flex-col gap-1">
                      <button
                        className={`${styles.view_btn}`}
                        onClick={() => viewHandler(val?._id)}
                      >
                        View
                      </button>
                    </div>
                  )}
                  {(userRole === "Super Admin" ||
                    userRole === "Admin Manager") && (
                      <UserAdminContent
                        confHandler={confHandler}
                        val={val}
                        statusUpdateHandler={statusUpdateHandler}
                        viewHandler={viewHandler}
                      />
                    )}
                  {userRole === "Technician" && (
                    <div className="flex flex-col gap-1">
                      <button
                        className={`${styles.view_btn}`}
                        onClick={() => viewHandler(val?._id)}
                      >
                        View
                      </button>
                      {val?.status === PendingConf && (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() =>
                              statusUpdateHandler(
                                val?._id,
                                PickConf,
                                val?.uniqueCode
                              )
                            }
                            className={`${styles.acpt_btn}`}
                          >
                            Pickup
                          </button>
                        </div>
                      )}
                      {val?.status === PickConf && (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() =>
                              statusUpdateHandler(
                                val?._id,
                                PickDelivered,
                                val?.uniqueCode
                              )
                            }
                            className={`${styles.acpt_btn}`}
                          >
                            Pickup Delivered
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {val?.status}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {new Date(val.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {val?.uniqueCode || val?._id}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {val?.totalDevice}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {val?.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserAdminContent = ({
  confHandler,
  val,
  statusUpdateHandler,
  viewHandler,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <button
        className={`${styles.view_btn}`}
        onClick={() => viewHandler(val?._id)}
      >
        View
      </button>
      {val?.status === "Pending Payment Confirmation" && (
        <div className="flex flex-col gap-1">
          <button
            onClick={() => confHandler(val?._id, val?.uniqueCode)}
            className={`${styles.acpt_btn}`}
          >
            Confirm Payment
          </button>
        </div>
      )}
      {val?.status === "Pending Admin Approval" && (
        <div className="flex flex-col gap-1">
          <button
            onClick={() =>
              statusUpdateHandler(val?._id, PendingConf, val?.uniqueCode)
            }
            className={`${styles.acpt_btn}`}
          >
            Accept
          </button>
        </div>
      )}
      {val?.status === PickDelivered && (
        <div className="flex flex-col gap-1">
          <button
            onClick={() =>
              statusUpdateHandler(val?._id, ApprovDelivery, val?.uniqueCode)
            }
            className={`${styles.acpt_btn}`}
          >
            Approve Delivery
          </button>
        </div>
      )}
    </div>
  );
};
