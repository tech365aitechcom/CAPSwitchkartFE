import React, { useEffect, useRef, useState } from "react";
const currentDomain = window.location.origin;
const DEFAULT_LOGO = "/Grest_Logo.jpg";
const BUYBACK_LOGO = "/Grest_Logo_2.jpg"; // Use your actual buyback logo
const isBuybackDomain = currentDomain === import.meta.env.VITE_BUYBACK_URL;
const GREST_LOGO = isBuybackDomain ? BUYBACK_LOGO : DEFAULT_LOGO;
import NavigateTable from "../../components/NavigateTable/NavigateTable";
import PendingDevicesTable from "../../components/PendingDevicesTable/PendingDevicesTable";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import styles from "./DevicePickupDashboard.module.css";
import SideMenu from "../../components/SideMenu";
import AdminNavbar from "../../components/Admin_Navbar";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { useSelector } from "react-redux";
import DPFilter from "./DPFilter";
const buttonStyles = "bg-primary text-white";
const updateStatusError = "Failed to update status";
const succTextColor = "text-green-500";
const failTextColor = "text-primary";
const PickupAvail = "Available For Pickup";
const LoggedInUser = JSON.parse(sessionStorage.getItem("profile"));

const DevicePickupDashboard = () => {
  const token = sessionStorage.getItem("authToken");
  const userProfile = useSelector((state) => state.user);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [pendingTableData, setPendingTableData] = useState([]);
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [devicesCount, setDevicesCount] = useState(0);
  const [devicesPrice, setDevicesPrice] = useState("0");
  const [dateValue, setDateValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("successfully updated status");
  const [errorMsg1, setErrorMsg1] = useState(null);
  const [errorMsg2, setErrorMsg2] = useState(null);
  const [successMod, setSuccessMod] = useState(false);
  const [failMod, setFailMode] = useState(false);
  const [confMod, setConfMod] = useState(false);
  const [storeName, setStoreName] = useState(userProfile.selStore);
  const [region, setRegion] = useState(userProfile.selRegion);
  const [storeData, setStoreData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [allStore, setAllStore] = useState([]);
  const firsttime = useRef(true);
  const isSuperAdmin = LoggedInUser?.role === 'Super Admin';
  const getData = () => {
    setIsTableLoaded(true);
    const config = {
      method: "get",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/pendingDevices/all?region=${region}&storeName=${storeName}`,
      headers: { Authorization: token },
    };
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.data?.length > 0) {
          setPendingTableData(response?.data?.data[0]?.documents);
          setDevicesPrice(response?.data?.data[0]?.totalPrices.toString());
          setDevicesCount(response?.data?.data[0]?.count);
        }
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setErrorMsg(`Failed to load data`);
        setFailMode(true);
        setIsTableLoaded(false);
      });
  };
  const getStore = () => {
    setIsTableLoaded(true);
    const config = {
      method: "get",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/store/findAll?page=0&limit=9999`,
      headers: { Authorization: token },
    };
    axios
      .request(config)
      .then((response) => {
        const allData = response.data.result;
        const storeNamesArray = response.data.result.map(
          (store) => store.storeName
        );
        const uniqueRegionsArray = [
          ...new Set(response.data.result.map((store) => store.region)),
        ];
        setAllStore(allData);
        setStoreData(storeNamesArray);
        setRegionData(uniqueRegionsArray);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setIsTableLoaded(false);
      });
  };
  const getDataBySearch = () => {
    setIsTableLoaded(true);
    const config = {
      method: "get",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/pendingDevices/search?rid=${searchValue}&date=${dateValue}&status=${statusValue}&region=${region}&storeName=${storeName}`,
      headers: { Authorization: token },
    };
    axios
      .request(config)
      .then((response) => {
        setPendingTableData([]);
        if (response.data.data.length === 0) {
          setDevicesPrice("0");
          setDevicesCount(0);
        } else {
          setPendingTableData(response.data.data[0].documents);
          setDevicesPrice(response.data.data[0].totalPrices.toString());
          setDevicesCount(response.data.data[0].count);
        }
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setErrorMsg(`Failed to load data`);
        setFailMode(true);
        setIsTableLoaded(false);
      });
  };

  useEffect(() => {
    if (firsttime.current) {
      getData();
      getStore();
      firsttime.current = false;
    } else {
      getDataBySearch();
    }
  }, [statusValue, dateValue, storeName, region, searchValue]);
  return (
    <div className="min-h-screen bg-white pb-8">
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
        confMod={confMod}
        setConfMod={setConfMod}
        setErrorMsg={setErrorMsg}
        setErrorMsg1={setErrorMsg1}
        setErrorMsg2={setErrorMsg2}
        getData={getData}
        selectedIds={selectedIds}
        pendingTableData={pendingTableData}
        allStore={allStore}
        storeName={storeName}
        setSelectedIds={setSelectedIds}
        setSelectedData={setSelectedData}
        setSelectedRows={setSelectedRows}
      />
      <NavigateTable />
      <div className="flex flex-row justify-end items-center py-1 px-2 font-medium text-sm text-primary">
        Total Device : {devicesCount} | Total Amount :{" "}
        {new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(devicesPrice)}
      </div>
      <DPFilter
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        getDataBySearch={getDataBySearch}
        dateValue={dateValue}
        statusValue={statusValue}
        selectedStatus={selectedStatus}
        setStatusValue={setStatusValue}
        setDateValue={setDateValue}
        setRegion={setRegion}
        region={region}
        regionData={regionData}
        storeName={storeName}
        setStoreName={setStoreName}
        allStore={allStore}
        setStoreData={setStoreData}
        storeData={storeData}
        pendingTableData={pendingTableData}
        setSelectedStatus={setSelectedStatus}
        getData={getData}
        isSuperAdmin={isSuperAdmin}
      />
      <PDTable
        pendingTableData={pendingTableData}
        setSelectedData={setSelectedData}
        setSelectedIds={setSelectedIds}
        setSelectedRows={setSelectedRows}
        selectedData={selectedData}
        selectedRows={selectedRows}
        selectedStatus={selectedStatus}
        selectedIds={selectedIds}
        setConfMod={setConfMod}
        setErrorMsg={setErrorMsg}
        setErrorMsg1={setErrorMsg1}
        setErrorMsg2={setErrorMsg2}
        setFailMode={setFailMode}
        setSelectedStatus={setSelectedStatus}
        setIsTableLoaded={setIsTableLoaded}
        setSuccessMod={setSuccessMod}
        getData={getData}
      />
    </div>
  );
};

export default DevicePickupDashboard;

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
  setConfMod,
  setErrorMsg,
  setErrorMsg1,
  setErrorMsg2,
  getData,
  selectedIds,
  pendingTableData,
  allStore,
  storeName,
  setSelectedIds,
  setSelectedData,
  setSelectedRows,
}) => {
  const [sideMenu, setsideMenu] = useState(false);
  const token1 = sessionStorage.getItem("authToken");
  const LoggedInUser1 = JSON.parse(sessionStorage.getItem("profile"));
  const reqPickupHandler = () => {
    setConfMod(false);
    const statuschk = selectedIds.every((sId) =>
      pendingTableData.some(
        (device) => device._id === sId && device.status === PickupAvail
      )
    );
    if (!statuschk) {
      setIsTableLoaded(false);
      setErrorMsg("Some devices are not Available for Pickup");
      setFailMode(true);
      return;
    }
    const address = allStore.find(
      (store) => store.storeName === storeName
    )?._id;
    const LDIds = pendingTableData
      ?.filter((obj) => selectedIds.includes(obj._id))
      .map((obj) => obj._id.toString());
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/pendingDevices/pickupreq`,
      headers: {
        Authorization: token1,
      },
      data: {
        deviceIDs: LDIds,
        storeid: address,
        userid: LoggedInUser1?._id,
      },
    };
    axios
      .request(config)
      .then((response) => {
        setSelectedIds([]);
        setSelectedData([]);
        setSelectedRows([]);
        getData();
        setErrorMsg(`Successfully Created Lot`);
        setErrorMsg1(`Lot No. :- ${response.data.data.uniqueCode}`);
        setErrorMsg2(`Check it On Picked Up`);
        setSuccessMod(true);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setErrorMsg(`Failed to create lot`);
        setFailMode(true);
        setIsTableLoaded(false);
      });
  };
  return (
    <React.Fragment>
      {isTableLoaded && (
        <div className="fixed top-0 left-0 z-49 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color="var(--primary-color)" loading={isTableLoaded} size={15} />
        </div>
      )}
      {successMod && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} ${succTextColor}`}>
            <IoIosCheckmarkCircle className={succTextColor} size={90} />
            <h6 className={succTextColor}>Success!</h6>
            <p className="text-slate-500">{errorMsg}</p>
            {errorMsg1 && <p className="text-slate-500">{errorMsg1}</p>}
            {errorMsg2 && <p className="text-slate-500">{errorMsg2}</p>}
            <button
              onClick={() => {
                setSuccessMod(false);
                setErrorMsg1(null);
                setErrorMsg2(null);
              }}
              className={"text-white  bg-green-500 "}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {failMod && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center h-full w-full bg-black bg-opacity-50">
          <div className={` ${failTextColor} ${styles.err_mod_box}`}>
            <IoIosCloseCircle size={90} className={failTextColor} />
            <h6 className={failTextColor}>Error!</h6>
            <p className="text-slate-500">{errorMsg}</p>
            <button
              className={buttonStyles}
              onClick={() => {
                setFailMode(false);
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {confMod && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} ${failTextColor}`}>
            <h6 className={failTextColor}>Confirmation!</h6>
            <p className="text-slate-500">
              {`Do you want to send ${selectedIds.length} devices for Pickup ?`}
            </p>
            <div className="flex flex-row gap-2">
              <button onClick={reqPickupHandler} className={buttonStyles}>
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
      <div className="flex items-center w-[99%] h-16 py-4 bg-white border-b-2 HEADER header">
        {LoggedInUser?.role === "Technician" ? (
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
    </React.Fragment>
  );
};

const PDTable = ({
  pendingTableData,
  setSelectedData,
  setSelectedIds,
  setSelectedRows,
  selectedData,
  selectedRows,
  selectedStatus,
  selectedIds,
  setConfMod,
  setErrorMsg,
  setErrorMsg1,
  setErrorMsg2,
  setFailMode,
  setSelectedStatus,
  setIsTableLoaded,
  setSuccessMod,
  getData,
}) => {
  const token2 = sessionStorage.getItem("authToken");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const handleStatusUpdate = (event) => {
    if (selectedIds.length === 0) {
      setErrorMsg("No device selected");
      setFailMode(true);
      return;
    }
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
    setIsTableLoaded(true);
    const LDIds = pendingTableData
      .filter((obj) => selectedIds.includes(obj._id))
      .map((obj) => obj._id.toString());
    let config;
    if (newStatus === PickupAvail) {
      config = {
        method: "post",
        url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
          }/api/pendingDevices/update`,
        headers: {
          Authorization: token2,
        },
        data: {
          deviceIDs: selectedIds,
          newStatus: newStatus,
        },
      };
    } else if (newStatus === "On Hold") {
      setShowHoldModal(true);
      return;
    } else if (newStatus === "Cancelled") {
      setShowCancelModal(true);
      return;
    } else {
      config = {
        method: "post",
        url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
          }/api/pendingDevices/updatereq`,
        headers: {
          Authorization: token2,
        },
        data: {
          deviceIDs: LDIds,
          newStatus: newStatus,
        },
      };
    }
    axios
      .request(config)
      .then((response) => {
        getData();
        setSelectedIds([]);
        setSelectedData([]);
        setSelectedRows([]);
        if (newStatus === PickupAvail) {
          setErrorMsg("Successfully updated status to " + newStatus);
        } else {
          setErrorMsg(`Successfully created ${newStatus} Lot`);
          setErrorMsg1(`Lot Id: ${response.data.data._id}`);
          setErrorMsg2(`Check it on Outstanding`);
        }
        setSuccessMod(true);
      })
      .catch((error) => {
        setIsTableLoaded(false);
        setErrorMsg(updateStatusError);
        setFailMode(true);
      });
    setSelectedStatus("");
  };
  const confHandler = () => {
    setIsTableLoaded(true);
    if (selectedIds.length === 0) {
      setIsTableLoaded(false);
      setErrorMsg("No device selected");
      setFailMode(true);
    } else {
      setConfMod(true);
    }
  };
  return (
    <React.Fragment>
      <PendingDevicesTable
        pendingTableData={pendingTableData}
        setSelectedIds={setSelectedIds}
        setSelectedData={setSelectedData}
        setSelectedRows={setSelectedRows}
        selectedData={selectedData}
        selectedRows={selectedRows}
      />
      <div className="mx-2 flex gap-2">
        <select
          className="border-2 w-1/2 outline-none border-primary bg-primary text-white text-[12px] px-4 py-2 rounded"
          value={selectedStatus}
          onChange={handleStatusUpdate}
        >
          <option value="">Status</option>
          <option value={PickupAvail}>Available For Pickup</option>
          <option value="On Hold">On Hold</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={confHandler}
          className="border-2 w-1/2 border-primary bg-primary text-white text-[12px] px-4 py-2 rounded"
        >
          Request For Pickup
        </button>
      </div>
      {showCancelModal && (
        <CancelModal
          setShowCancelModal={setShowCancelModal}
          setIsTableLoaded={setIsTableLoaded}
          token2={token2}
          selectedIds={selectedIds}
          getData={getData}
          setSelectedIds={setSelectedIds}
          setSelectedData={setSelectedData}
          setSelectedRows={setSelectedRows}
          setErrorMsg={setErrorMsg}
          setErrorMsg1={setErrorMsg1}
          setErrorMsg2={setErrorMsg2}
          setSuccessMod={setSuccessMod}
          setFailMode={setFailMode}
        />
      )}
      {showHoldModal && (
        <HoldModal
          setShowHoldModal={setShowHoldModal}
          setIsTableLoaded={setIsTableLoaded}
          token2={token2}
          selectedIds={selectedIds}
          getData={getData}
          setSelectedIds={setSelectedIds}
          setSelectedData={setSelectedData}
          setSelectedRows={setSelectedRows}
          setErrorMsg={setErrorMsg}
          setSuccessMod={setSuccessMod}
          setFailMode={setFailMode}
        />
      )}
    </React.Fragment>
  );
};

const CancelModal = ({
  setShowCancelModal,
  setIsTableLoaded,
  token2,
  selectedIds,
  getData,
  setSelectedIds,
  setSelectedData,
  setSelectedRows,
  setErrorMsg,
  setErrorMsg1,
  setErrorMsg2,
  setSuccessMod,
  setFailMode,
}) => {
  const [cancelReason, setCancelReason] = useState("");
  const handleCancelSubmit = () => {
    setIsTableLoaded(true);
    const config = {
      method: "post",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/pendingDevices/update`,
      headers: {
        Authorization: token2,
      },
      data: {
        deviceIDs: selectedIds,
        newStatus: "Cancelled",
        reason: cancelReason,
      },
    };
    axios
      .request(config)
      .then((response) => {
        getData();
        setSelectedIds([]);
        setSelectedData([]);
        setSelectedRows([]);
        setErrorMsg(`Successfully Updated status to Cancelled`);
        setErrorMsg1(`Lot No. not updated yet.`);
        setErrorMsg2(`Check it on Outstanding`);
        setSuccessMod(true);
      })
      .catch((error) => {
        setIsTableLoaded(false);
        setErrorMsg(updateStatusError);
        setFailMode(true);
      });
    setShowCancelModal(false);
    setCancelReason("");
  };
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className={`${styles.err_mod_box} ${failTextColor}`}>
        <h6 className={failTextColor}>Cancellation Reason</h6>
        <input
          type="text"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          className="border-2 border-primary rounded-md px-4 py-2 mb-4 w-full"
          placeholder="Enter Reason for Cancellation"
        />
        <div className="flex flex-row gap-2">
          <button onClick={handleCancelSubmit} className={buttonStyles}>
            Okay
          </button>
          <button
            onClick={() => {
              setShowCancelModal(false);
              setIsTableLoaded(false);
            }}
            className="bg-white text-primary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const HoldModal = ({
  setShowHoldModal,
  setIsTableLoaded,
  token2,
  selectedIds,
  getData,
  setSelectedIds,
  setSelectedData,
  setSelectedRows,
  setErrorMsg,
  setSuccessMod,
  setFailMode,
}) => {
  const [holdReason, setHoldReason] = useState("");
  const handleHoldSubmit = () => {
    setIsTableLoaded(true);
    const config = {
      method: "post",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/pendingDevices/update`,
      headers: {
        Authorization: token2,
      },
      data: {
        deviceIDs: selectedIds,
        newStatus: "On Hold",
        reason: holdReason,
      },
    };
    axios
      .request(config)
      .then((response) => {
        getData();
        setSelectedIds([]);
        setSelectedData([]);
        setSelectedRows([]);
        setErrorMsg(`Successfully updated status to On Hold`);
        setSuccessMod(true);
      })
      .catch((error) => {
        setIsTableLoaded(false);
        setErrorMsg(updateStatusError);
        setFailMode(true);
      });
    setShowHoldModal(false);
    setHoldReason("");
  };
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className={`${styles.err_mod_box} ${failTextColor}`}>
        <h6 className={failTextColor}>Hold Reason</h6>
        <input
          type="text"
          value={holdReason}
          onChange={(e) => setHoldReason(e.target.value)}
          className="border-2 border-primary rounded-md px-4 py-2 mb-4 w-full"
          placeholder="Enter Reason for Hold"
        />
        <div className="flex flex-row gap-2">
          <button onClick={handleHoldSubmit} className={buttonStyles}>
            Okay
          </button>
          <button
            onClick={() => {
              setShowHoldModal(false);
              setIsTableLoaded(false);
            }}
            className="bg-white text-primary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
