import React, { useCallback, useEffect, useState } from "react";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import styles from "../CompanyListingDetails/CompanyListingDetails.module.css";
import { IoMdSearch } from "react-icons/io";
import { IoRefresh } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import SideMenu from "../../components/SideMenu";
import AdminNavbar from "../../components/Admin_Navbar";
import axios from "axios";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BeatLoader } from "react-spinners";
const
  AdminDashboard = () => {
    const [sideMenu, setsideMenu] = useState(false);
    const [tableData, setTableData] = useState({});
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [flag, setFlag] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [fromDateDup, setFromDateDup] = useState(null);
    const [toDateDup, setToDateDup] = useState(null);
    const getTableData = () => {
      setIsTableLoading(true);
      const userToken = sessionStorage.getItem("authToken");

      const queryParams = new URLSearchParams();
      if (searchValue !== null) {
        queryParams.append("search", searchValue);
      }
      if (toDate !== null) {
        queryParams.append("toDate", toDateDup);
      }

      if (fromDate !== null) {
        queryParams.append("fromDate", fromDateDup);
      }

      axios
        .get(
          `${import.meta.env.VITE_REACT_APP_ENDPOINT
          }/api/store/adminReport?&${queryParams.toString()}`,
          {
            headers: {
              Authorization: `${userToken}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setTableData(res.data);
          setIsTableLoading(false);
          setFlag(true);
        })
        .catch((err) => {
          console.log(err);
          setIsTableLoading(false);
        });
    };

    useEffect(() => {
      getTableData();
    }, [fromDateDup, toDateDup]);

    const downloadExcel = (apiData) => {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";

      const dataMap = new Map();

      // Format data by grouping stores by date
      apiData.forEach((item) => {
        const {
          date,
          data,
          totalPicked,
          priceOfferToCustomer,
          totalPickedPrice,
          pendingForPickup,
          pendingForPickupPrice,
          totalAvailableForPickup,
        } = item;
        if (!dataMap.has(date)) {
          dataMap.set(date, {
            Date: date,
            "Total Available Devices": totalAvailableForPickup,
            "Total Price Offered To Customer": priceOfferToCustomer,
            "Picked from store": totalPicked,
            "Picked devices price": totalPickedPrice,
            "Pendency of devices": pendingForPickup,
            "Pendency Payment": pendingForPickupPrice,
          });
        }
        data.forEach((store) => {
          const storeName = store.storeName;
          if (!dataMap.get(date)[storeName]) {
            dataMap.get(date)[storeName] = store.availableForPickup;
          } else {
            dataMap.get(date)[storeName] += store.availableForPickup;
          }
        });
      });

      // Convert the map values to array of objects
      const formattedData = Array.from(dataMap.values());

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      const dataFile = new Blob([excelBuffer], { type: fileType });
      saveAs(dataFile, "Admin_Report" + fileExtension);
    };

    const fetchDownloadData = () => {
      const userToken = sessionStorage.getItem("authToken");
      axios
        .get(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/store/adminReport`, {
          headers: {
            authorization: `${userToken}`,
          },
        })
        .then((res) => {
          downloadExcel(res.data.result);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const handleFromDateChange = (date) => {
      if (date !== null) {
        setFromDate(date);
        const formattedDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        setFromDateDup(formattedDate);
      }
      console.log("from", date);
    };
    const handleToDateChange = (date) => {
      if (date !== null) {
        setToDate(date);
        const formattedDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        setToDateDup(formattedDate);
      }
      console.log("to", date);
    };

    const handleSearchClear = useCallback(() => {
      setToDate("");
      setToDateDup("");
      setFromDate("");
      setFromDateDup("");
      setSearchValue("");
      getTableData();
    }, []);

    const handleSearchClick = () => {
      getTableData();
    };
    return (
      <div>
        {isTableLoading && (
          <div className="fixed top-0 left-0 z-49 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <BeatLoader color="var(--primary-color)" loading={isTableLoading} size={15} />
          </div>
        )}
        <div className="navbar">
          <AdminNavbar setsideMenu={setsideMenu} sideMenu={sideMenu} />
          <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
        </div>
        <div className="flex gap-2 items-center justify-center outline-none mt-5 w-[100%]">
          <div className={`${styles.search_bar_wrap}`}>
            <input
              className="text-sm"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              type="text"
              value={searchValue}
            />
            <IoMdSearch size={25} onClick={handleSearchClick} />
          </div>
          <div className={styles.icons_box}>
            <IoRefresh className="" onClick={handleSearchClear} size={25} />
          </div>
          <button
            onClick={fetchDownloadData}
            className={`${styles.bulkdown_button}`}
          >
            <FaDownload /> Bulk Download
          </button>

          <div className="[bg-[#F5F4F9]">
            <DatePicker
              onChange={handleFromDateChange}
              selected={fromDate}
              className={` mt-1 p-[6px] w-[150px] sm:w-[250px] border rounded-md`}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select from date"
              isClearable // <-- Added for better UX
            />
          </div>
          <div>
            <DatePicker
              onChange={handleToDateChange}
              selected={toDate}
              className="mt-1 p-[6px] w-[150px] sm:w-[250px] border rounded-md"
              dateFormat="yyyy-MM-dd"
              placeholderText="Select to date"
              minDate={fromDate} // <-- Prevents invalid date ranges
              isClearable
            />
          </div>
        </div>

        {flag && <DashboardTable tableData={tableData} />}
      </div>
    );
  };

export default AdminDashboard;
