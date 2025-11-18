import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { BeatLoader } from 'react-spinners'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'

import AdminNavbar from '../components/Admin_Navbar'
import SideMenu from '../components/SideMenu'
import QuoteTrackingTable from '../components/QuoteTrackingTable'
import ActivityLogModal from '../components/QuickActivityLogModal'

import { IoMdSearch } from 'react-icons/io'
import { IoRefresh } from 'react-icons/io5'
import {
  FaDownload,
  FaAngleDown,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa'

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      ; ``
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

const QuoteTrackingDashboard = () => {
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)
  const [sideMenu, setSideMenu] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [storeData, setStoreData] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    dateRange: 'All Time',
    storeId: "",
  })

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  })

  const [modalState, setModalState] = useState({
    isOpen: false,
    userId: null,
    userName: '',
  })

  const debouncedSearch = useDebounce(filters.search, 500)

  const fetchTrackingData = useCallback(async () => {
    setLoading(true)
    const token = sessionStorage.getItem('authToken')
    try {
      const params = {
        page: pagination.currentPage,
        limit: 10,
        dateRange: filters.dateRange,
        search: debouncedSearch,
        storeId: filters.storeId,
      }

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/quoteTracking/dashboard`,
        {
          headers: { Authorization: token },
          params,
        }
      )

      setTableData(response.data.data)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching quote tracking data:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.currentPage, filters.dateRange, debouncedSearch, filters.storeId])

  useEffect(() => {
    fetchTrackingData()
  }, [fetchTrackingData])

  useEffect(() => {
    const fetchStores = async () => {
      const stores = await getStore();
      setStoreData(stores);
    };
    fetchStores();
  }, []);

  const handleFilterChange = (key, value) => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleRefresh = () => {
    setFilters({ search: '', dateRange: 'All Time', storeId: "" })
    if (pagination.currentPage !== 1) {
      setPagination((prev) => ({ ...prev, currentPage: 1 }))
    }
  }

  const handleDownload = async () => {
    if (isDownloading || tableData.length === 0) {
      return
    }

    setIsDownloading(true)
    const toastId = toast.loading(
      <div className='flex items-center gap-2'>
        <BeatLoader color='#3B82F6' size={8} />
        <span>Generating your report...</span>
      </div>
    )

    try {
      const token = sessionStorage.getItem('authToken')
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/quoteTracking/dashboard/download`,
        {
          headers: { Authorization: token },
          params: { dateRange: filters.dateRange, search: debouncedSearch, storeId: filters.storeId },
          responseType: 'blob',
        }
      )

      const blob = new Blob([response.data], { type: 'text/csv' })
      saveAs(
        blob,
        `quote_tracking_report_${new Date().toISOString().split('T')[0]}.csv`
      )

      toast.success(
        <div className='flex items-center gap-2'>
          <FaCheckCircle className='text-green-500' />
          <b>Report downloaded successfully!</b>
        </div>,
        { id: toastId }
      )
    } catch (error) {
      console.error('Failed to download report:', error)

      const errorMessage = (
        <div className='flex items-center gap-2'>
          <FaExclamationTriangle className='text-red-500' />
          <b>
            {error.response?.status === 404
              ? 'Download failed: No data available.'
              : 'An unexpected error occurred.'}
          </b>
        </div>
      )

      toast.error(errorMessage, { id: toastId })
    } finally {
      setIsDownloading(false)
    }
  }

  const openActivityLog = (user) => {
    setModalState({ isOpen: true, userId: user.userId, userName: user.email })
  }

  const closeActivityLog = () => {
    setModalState({ isOpen: false, userId: null, userName: '' })
  }

  return (
    <div>
      {loading && (
        <div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 text-primary'>
          <BeatLoader
            color='var(--primary-color)'
            loading={loading}
            size={15}
          />
        </div>
      )}

      <div className='navbar'>
        <AdminNavbar setsideMenu={setSideMenu} sideMenu={sideMenu} />
        <SideMenu setsideMenu={setSideMenu} sideMenu={sideMenu} />
      </div>

      <div className='flex flex-wrap gap-4 items-center mt-2 justify-center p-4 w-full'>
        <div className='relative w-full md:w-auto'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <IoMdSearch className='w-5 h-5 text-gray-900' />
          </div>
          <input
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className='block w-full md:w-64 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary'
            type='text'
            placeholder='Search by User ID (email)...'
            value={filters.search}
          />
        </div>
        <div className='relative w-full md:w-auto'>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className='block w-full md:w-48 p-2 pr-8 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary appearance-none'
          >
            <option value='All Time'>All Time</option>
            <option value='Today'>Today</option>
            <option value='Yesterday'>Yesterday</option>
            <option value='Last 7 Days'>Last 7 Days</option>
            <option value='1 Month'>1 Month</option>
          </select>
          <FaAngleDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
        </div>
        <button
          onClick={handleRefresh}
          title='Refresh Filters'
          className='p-2.5 text-sm font-medium text-white bg-primary rounded-lg border border-gray-300 
             transition-transform duration-150 ease-in-out active:scale-95'
        >
          <IoRefresh size={20} />
        </button>
        <button
          onClick={handleDownload}
          disabled={isDownloading || tableData.length === 0}
          className={`
                        flex items-center justify-center gap-2 px-4 py-2.5 w-48 text-sm font-semibold text-white 
                         bg-primary rounded-lg shadow-md
                        transition-all duration-200 ease-in-out
                        active:scale-95
                        disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none
                    `}
        >
          {isDownloading ? (
            <>
              <BeatLoader color='#fff' size={8} />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <FaDownload />
              <span>Download Report</span>
            </>
          )}
        </button>
      </div>

      <QuoteTrackingTable
        data={tableData}
        pagination={pagination}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        onViewActivity={openActivityLog}
      />

      {modalState.isOpen && (
        <ActivityLogModal
          userId={modalState.userId}
          userName={modalState.userName}
          onClose={closeActivityLog}
        />
      )}
    </div>
  )
}

export default QuoteTrackingDashboard
