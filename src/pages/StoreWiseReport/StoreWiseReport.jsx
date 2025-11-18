import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Admin_Navbar";
import SideMenu from "../../components/SideMenu";
import StoreWiseTable from "../../components/StoreWiseTable/StoreWiseTable";
import axios from "axios";
import styles from "./StoreWiseReport.module.css";
import { FaAngleDown, FaDownload } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { BeatLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import { IoMdSearch } from "react-icons/io";
import { IoRefresh } from "react-icons/io5";

const ALLstore = "All Stores";
const isSelled = "true";
const rotateCss = "rotate-180";
const pageLimit = 10;
const startDateFillter = "2023-01-01";
const currentDomain = window.location.origin;
const WEBSITE_SHORT_NAME = currentDomain === import.meta.env.VITE_BUYBACK_URL ? import.meta.env.VITE_BUYBACK_SHORT_NAME : import.meta.env.VITE_WEBSITE_SHORT_NAME;

const downloadExcelStoreWise = (apiData) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const formattedData = apiData.map((item) => {
    return {
      "Purchase Date": new Date(item.createdAt).toLocaleDateString("en-IN"),
      Technicians: item.userId?.firstName,
      Category: item.categoryInfo?.categoryName,
      "IMEI No.": item.documentId?.IMEI,
      "Product Details": item.modelId?.name,
      Location: item?.store?.storeName,
      Price: item?.actualPrice,
      "Price Offered To Customer": item?.price,
      "Unique ID": item?.uniqueCode,
      [`${import.meta.env.VITE_WEBSITE_TITLE} Received`]:
        item?.grestReceived || "NA",
      "Receiving Date": item?.grestRecDate || "NA",
      "New Prices As Per New Range": "NA",
      "Store Payment Status": "NA",
      "Payment Date": "NA",
      "Store Payment UTR Number": "NA",
    };
  });
  const wsStoreWise = XLSX.utils.json_to_sheet(formattedData);
  const wbStoreWise = { Sheets: { data: wsStoreWise }, SheetNames: ["data"] };
  const excelBufferStoreWise = XLSX.write(wbStoreWise, {
    bookType: "xlsx",
    type: "array",
  });
  const dataFileStoreWise = new Blob([excelBufferStoreWise], {
    type: fileType,
  });
  saveAs(dataFileStoreWise, "StoreWise_Report" + fileExtension);
};

const fetchDownloadDataStoreWise = (deviceCategory, fromDate, toDate, storeId, token) => {
  if (!fromDate || !toDate) {
    alert("Set dates before Downloading");
    return;
  }
  const userToken = sessionStorage.getItem("authToken");
  axios
    .get(
      `${import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/prospects/findAll?page=${0}&limit=${9999}&is_selled=${isSelled}&deviceType=${deviceCategory}&startDate=${fromDate}&endDate=${toDate}&store=${storeId}`,
      {
        headers: {
          authorization: `${userToken}`,
        },
      }
    )
    .then((res) => {
      downloadExcelStoreWise(res.data.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
const StoreWiseReport = () => {
  const token = sessionStorage.getItem("authToken");
  const LoggedInUser = JSON.parse(sessionStorage.getItem("profile"));
  const isSuperAdmin = LoggedInUser?.role === 'Super Admin';
  const [maxPages, setMaxPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [tableData, setTableData] = useState();
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [storeName, setStoreName] = useState(ALLstore);
  const [storeId, setStoreId] = useState("");
  const [region, setRegion] = useState("");
  const [storeData, setStoreData] = useState([]);
  const [regionalData, setRegionalData] = useState([]);
  const [entireStore, setEntireStore] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [fromDateDup, setFromDateDup] = useState(startDateFillter);
  const [toDate, setToDate] = useState("");
  const [toDateDup, setToDateDup] = useState(new Date().toISOString().split("T")[0]);
  const [grestRec, setGrestRec] = useState("");
  const [allUser, setAllUser] = useState([]);
  const [techId, setTechId] = useState("");
  const [techName, setTechName] = useState("");
  const [deviceCategory, setDeviceCategory] = useState("CTG1");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const fetchStoreData = () => {
    setIsTableLoaded(true);
    axios.get(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/prospects/findAll?page=${currentPage}
        &limit=${pageLimit}&is_selled=${isSelled}
        &store=${storeId}&rid=${searchValue}&grestRec=${grestRec}&endDate=${toDateDup}
        &startDate=${fromDateDup}&userId=${techId}&deviceType=${deviceCategory}`,
      { headers: { Authorization: token } })
      .then((res) => {
        setMaxPages(Math.ceil(res.data.totalCounts / 10));
        setTableData(res.data.data);
        setIsTableLoaded(false);
      })
      .catch((err) => {
        setIsTableLoaded(false);
      });
  };
  const getStore = () => {
    setIsTableLoaded(true);
    const config = {
      method: "get",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/store/findAll?page=0&limit=9999`,
      headers: { Authorization: token },
    };
    axios
      .request(config)
      .then((response) => {
        const allStoreData = response.data.result;
        const storeArr = response.data.result.map((store) => ({
          storeName: store.storeName,
          _id: store._id,
        }));
        const regionsUniqueArray = [
          ...new Set(response.data.result.map((store) => store.region)),
        ];
        setStoreData(storeArr);
        setEntireStore(allStoreData);
        setIsTableLoaded(false);
        setRegionalData(regionsUniqueArray);
      })
      .catch((error) => {
        setIsTableLoaded(false);
      });
  };
  const getTechnicians = () => {
    setIsTableLoaded(true);
    const config = {
      method: "get",
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/userregistry/all`,
      headers: { Authorization: token },
    };
    axios
      .request(config)
      .then((response) => {
        const allStoresData = response.data.data;
        const userNamesArray = allStoresData.filter(user => user.role === "Sale User").map((user) => ({
          userName: user?.name || user?.firstName,
          _id: user._id,
        }));
        setAllUser(userNamesArray);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setIsTableLoaded(false);
      });
  };
  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/category/getAll`,
        {
          headers: { Authorization: token },
        }
      );
      setCategories(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCategories();
    if (isSuperAdmin) {
      getStore();
      getTechnicians();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    fetchStoreData();
  }, [currentPage, pageLimit, grestRec, fromDateDup, toDateDup, techId, deviceCategory]);

  useEffect(() => {
    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  const handleSearchClear = () => {
    setStoreName(ALLstore);
    setStoreId("");
    setRegion("");
    setSearchValue("");
    setFromDate("");
    setFromDateDup(startDateFillter);
    setToDate("");
    setToDateDup(new Date().toISOString().split("T")[0]);
    setGrestRec("");
    setTechId("");
    setTechName("");
    setSearchTerm("");
  };
  useEffect(() => {
    if (storeId === "" &&
      region === "" &&
      searchValue === "" &&
      fromDate === "" &&
      fromDateDup === startDateFillter &&
      toDate === "" &&
      toDateDup === new Date().toISOString().split("T")[0] &&
      grestRec === "" &&
      techId === "" &&
      techName === "" &&
      searchTerm === ""
    ) {
      fetchStoreData();
    }
  }, [storeId, region, searchValue, fromDate, fromDateDup, toDate, toDateDup, grestRec,
    techId, techName, searchTerm
  ]);
  return (
    <div>
      <UpperFilter
        isTableLoaded={isTableLoaded}
        deviceCategory={deviceCategory}
        setDeviceCategory={setDeviceCategory}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        fromDate={fromDate}
        toDate={toDate}
        handleSearchClear={handleSearchClear}
        fetchStoreData={fetchStoreData}
        categories={categories}
        token={token}
        storeId={storeId}
      />

      <MainFilter
        techName={techName}
        setTechName={setTechName}
        setTechId={setTechId}
        allUser={allUser}
        grestRec={grestRec}
        region={region}
        regionalData={regionalData}
        storeName={storeName}
        setStoreName={setStoreName}
        setStoreId={setStoreId}
        setRegion={setRegion}
        setGrestRec={setGrestRec}
        storeData={storeData}
        setStoreData={setStoreData}
        toDate={toDate}
        fromDate={fromDate}
        entireStore={entireStore}
        setFromDateDup={setFromDateDup}
        setToDateDup={setToDateDup}
        setToDate={setToDate}
        setFromDate={setFromDate}
        handleSearchClear={handleSearchClear}
        isSuperAdmin={isSuperAdmin}
      />
      <TableCont
        currentPage={currentPage}
        tableData={tableData}
        setCurrentPage={setCurrentPage}
        maxPages={maxPages}
      />
    </div>
  );
};

export default StoreWiseReport;

const UpperFilter = ({
  isTableLoaded,
  deviceCategory,
  setDeviceCategory,
  setSearchValue,
  searchValue,
  fromDate,
  toDate,
  handleSearchClear,
  fetchStoreData,
  categories,
  storeId,
  token
}) => {
  const [sideMenu, setsideMenu] = useState(false);
  return (
    <React.Fragment>
      {isTableLoaded && (
        <div className="fixed top-0 left-0 z-49 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader
            color="var(--primary-color)"
            loading={isTableLoaded}
            size={15}
          />
        </div>
      )}
      <div className="navbar">
        <AdminNavbar setsideMenu={setsideMenu} sideMenu={sideMenu} />
        <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
      </div>
      <div className="flex flex-row gap-2 items-center justify-center">
        <div className="flex gap-2">
          <p className="font-medium">Select Category</p>
          <select
            name=""
            id=""
            className="bg-primary text-white rounded-lg outline-none px-2 py-1"
            onChange={(e) => setDeviceCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option
                className="bg-white text-primary font-medium"
                key={cat?._id}
                value={cat?.categoryCode}
              >
                {cat?.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className={`${styles.search_bar_wrap}`}>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            className="text-sm"
            type="text"
            placeholder="Search Store Name/Email/Id/Region"
            value={searchValue}
          />
          <IoMdSearch onClick={() => fetchStoreData()} size={25} />
        </div>
        <div className={styles.icons_box}>
          <IoRefresh onClick={handleSearchClear} className="" size={25} />
        </div>
        <div>
          <button
            className={`${styles.bulkdown_button}`}
            onClick={() =>
              fetchDownloadDataStoreWise(deviceCategory, fromDate, toDate, storeId, token)
            }
          >
            <FaDownload /> Bulk Download
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

const MainFilter = ({
  techName,
  setTechName,
  setTechId,
  allUser,
  grestRec,
  region,
  regionalData,
  storeName,
  setStoreName,
  setStoreId,
  setRegion,
  setGrestRec,
  storeData,
  setStoreData,
  toDate,
  fromDate,
  entireStore,
  setFromDateDup,
  setToDateDup,
  setToDate,
  setFromDate,
  handleSearchClear,
  isSuperAdmin,
}) => {
  const [regionDrop, setRegionDrop] = useState(false);
  const [storeDrop, setStoreDrop] = useState(false);
  const [grestDrop, setGrestDrop] = useState(false);
  const [techDrop, setTechDrop] = useState(false);
  const handleFromDateChange = (date) => {
    if (date === null) {
      setFromDate("");
    } else {
      setFromDate(date);
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      const today = new Date();
      const formattedToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      if (toDate === "") {
        setToDateDup(formattedToday);
      }
      setFromDateDup(formattedDate);
    }
  };
  const handleToDateChange = (date) => {
    if (date === null) {
      setToDate("");
    } else {
      setToDate(date);
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      setToDateDup(formattedDate);
      if (fromDate === "") {
        const fromDateOneYearBefore = new Date(date);
        fromDateOneYearBefore.setFullYear(
          fromDateOneYearBefore.getFullYear() - 1
        );
        const formattedFromDate = new Date(
          fromDateOneYearBefore.getTime() -
          fromDateOneYearBefore.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        setFromDateDup(formattedFromDate);
      }
    }
  };
  const handleRegionChange = (value) => {
    setRegionDrop(false);
    setStoreName("");
    const filteredStores = entireStore.filter(
      (store) => store.region === value
    );
    const storeNamesArray = filteredStores.map((store) => ({
      storeName: store.storeName,
      _id: store._id,
    }));
    setStoreData(storeNamesArray);
    setRegion(value);
  };
  const handleStoreChange = (value) => {
    setStoreDrop(false);
    const filteredStores = entireStore.filter(
      (store) => store._id === value._id
    );
    const newRegion = filteredStores[0].region;
    setRegion(newRegion);
    setStoreName(value.storeName);
    setStoreId(value._id);
  };
  const handleTechChange = (value) => {
    setTechName(value.userName);
    setTechId(value._id);
    setTechDrop(false);
  };
  const handleGrestRecChange = (value) => {
    setGrestRec(value);
    setGrestDrop(false);
  };
  return (
    <div className="flex flex-row w-100 gap-2 items-center justify-center">
      <MainFilterSub
        setTechDrop={setTechDrop}
        techDrop={techDrop}
        techName={techName}
        setTechName={setTechName}
        setTechId={setTechId}
        allUser={allUser}
        handleTechChange={handleTechChange}
        setGrestDrop={setGrestDrop}
        grestDrop={grestDrop}
        grestRec={grestRec}
        handleGrestRecChange={handleGrestRecChange}
        setRegionDrop={setRegionDrop}
        regionDrop={regionDrop}
        region={region}
        regionalData={regionalData}
        handleRegionChange={handleRegionChange}
        setStoreDrop={setStoreDrop}
        storeDrop={storeDrop}
        storeName={storeName}
        storeData={storeData}
        handleStoreChange={handleStoreChange}
        fromDate={fromDate}
        handleFromDateChange={handleFromDateChange}
        toDate={toDate}
        handleToDateChange={handleToDateChange}
        handleSearchClear={handleSearchClear}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
};

const MainFilterSub = ({
  setTechDrop,
  techDrop,
  techName,
  setTechName,
  setTechId,
  allUser,
  handleTechChange,
  setGrestDrop,
  grestDrop,
  grestRec,
  handleGrestRecChange,
  setRegionDrop,
  regionDrop,
  region,
  regionalData,
  handleRegionChange,
  setStoreDrop,
  storeDrop,
  storeName,
  storeData,
  handleStoreChange,
  fromDate,
  handleFromDateChange,
  toDate,
  handleToDateChange,
  handleSearchClear,
  isSuperAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState(storeData);
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === "") {
      setFilteredStores(storeData);
    } else {
      const filtered = storeData.filter((store) =>
        store.storeName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  };
  return (
    <div className="flex flex-row px-5 gap-2 w-[100%] justify-center items-center">
      <div className="relative w-[15%]">
        <div
          className={`${styles.filter_button}`}
          onClick={() => setTechDrop(!techDrop)}
        >
          <p className="truncate">{techName === "" ? "Select Sale User" : techName}</p>
          <FaAngleDown size={17} className={`${techDrop && rotateCss}`} />
        </div>
        {techDrop && (
          <div className={`${styles.filter_drop}`}>
            <div
              onClick={() => {
                setTechName("");
                setTechId("");
                setTechDrop(false);
              }}
              className={`${styles.filter_option}`}
            >
              <p className="truncate">Show All</p>
            </div>
            {allUser.map((item) => (
              <div
                key={item._id}
                onClick={() => handleTechChange(item)}
                className={`${styles.filter_option}`}
              ><p className="truncate">{item.userName}</p></div>
            ))}
          </div>
        )}
      </div>
      <div className="relative w-[15%]">
        <div
          className={`${styles.filter_button}`}
          onClick={() => {
            setGrestDrop(!grestDrop);
          }}
        >
          <p className="truncate">
            {grestRec === "" ? `${WEBSITE_SHORT_NAME} Received ?` : `${WEBSITE_SHORT_NAME} Rec. ` + grestRec}
          </p>
          <FaAngleDown size={17} className={`${grestDrop && rotateCss}`} />
        </div>
        {grestDrop && (
          <div className={`${styles.filter_drop}`}>
            <div
              onClick={() => handleGrestRecChange("")}
              className={`${styles.filter_option}`}
            ><p className="truncate">Show All</p></div>
            <div
              onClick={() => handleGrestRecChange("yes")}
              className={`${styles.filter_option}`}
            ><p className="truncate">Yes</p></div>
            <div
              onClick={() => handleGrestRecChange("no")}
              className={`${styles.filter_option}`}
            ><p className="truncate">No</p></div>
          </div>
        )}
      </div>

      {isSuperAdmin && (
        <>
          <div className="relative w-[20%]">
            <div
              className={`${styles.filter_button}`}
              onClick={() => {
                setRegionDrop(!regionDrop);
              }}
            >
              <p className="truncate">{region === "" ? "Select Region" : region}</p>
              <FaAngleDown size={17} className={`${regionDrop && rotateCss}`} />
            </div>
            {regionDrop && (
              <div className={`${styles.filter_drop}`}>
                {regionalData.map((item) => (
                  <div
                    key={item}
                    onClick={() => handleRegionChange(item)}
                    className={`${styles.filter_option}`}
                  >
                    <p className="truncate">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative w-[35%]">
            <div
              className={`${styles.filter_button}`}
              onClick={() => setStoreDrop(!storeDrop)}
            >
              <p className="truncate">
                {searchTerm === "" ? "Select Store" : searchTerm}
              </p>
              <FaAngleDown size={17} className={`${storeDrop && rotateCss}`} />
            </div>
            {storeDrop && (
              <div className="absolute w-full bg-white shadow-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full p-2 border-b border-gray-300"
                  placeholder="Search store..."
                />
                <div
                  className={`overflow-y-scroll max-h-[200px] ${styles.filter_drop}`}
                >
                  {filteredStores.length > 0 ? (
                    filteredStores.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          handleStoreChange(item);
                          setSearchTerm(item.storeName);
                          setStoreDrop(false);
                        }}
                        className={`${styles.filter_option}`}
                      >
                        <p className="truncate">{item.storeName}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-2 text-gray-500">No stores found</p>
                  )}
                  <div
                    className={`${styles.filter_option}`}
                    onClick={() => {
                      handleSearchClear();
                      setStoreDrop(false);
                    }}
                  >
                    <p className="truncate">{ALLstore}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <div className="w-[15%]">
        <DatePicker
          selected={fromDate}
          onChange={handleFromDateChange}
          dateFormat="yyyy-MM-dd"
          className="outline-none p-2 w-[100%] border rounded-md text-sm text-center"
          placeholderText="Select from date"
        />
      </div>
      <div className="w-[15%]">
        <DatePicker
          selected={toDate}
          onChange={handleToDateChange}
          dateFormat="yyyy-MM-dd"
          className="outline-none p-2 w-[100%] border rounded-md text-sm text-center"
          placeholderText="Select to date"
        />
      </div>
    </div>
  );
};

const TableCont = ({ currentPage, tableData, setCurrentPage, maxPages }) => {
  return (
    <React.Fragment>
      <div className="max-w-full min-h-screen">
        <StoreWiseTable currentPage={currentPage} tableData={tableData} />
      </div>
      <div className="flex justify-center mt-0 mb-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
          className={`mx-2 px-4 py-2 rounded-lg ${currentPage === 0
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-primary text-white cursor-pointer"
            }`}
        >Previous</button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === maxPages - 1}
          className={`mx-2 px-4 py-2 rounded-lg ${currentPage === maxPages - 1
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-primary text-white cursor-pointer"
            }`}
        >Next</button>
      </div>
    </React.Fragment>
  );
};
