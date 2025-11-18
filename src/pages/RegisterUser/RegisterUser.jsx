import React, { useEffect, useState } from 'react'
import styles from './RegisterUser.module.css'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../../components/Admin_Navbar'
import SideMenu from '../../components/SideMenu'
import BulkUploadModal from '../../components/BulkUploadModal'

import { BeatLoader } from 'react-spinners'
import axios from 'axios'
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io'
import { IoEye, IoEyeOffSharp } from 'react-icons/io5'

const sucTextColor = 'text-green-500'
const failTextColor = 'text-primary'
const defaultRoles = ['Super Admin', 'Admin Manager', 'Technician']
const role = import.meta.env.VITE_REACT_APP_ROLES
  ? import.meta.env.VITE_REACT_APP_ROLES.split(',').map((item) => item.trim())
  : defaultRoles
const getStore = async () => {
  const token1 = sessionStorage.getItem('authToken')
  const config = {
    method: 'get',
    url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/store/findAll?page=0&limit=9999`,
    headers: { Authorization: token1 },
  }
  let storeNamesArray = []
  await axios
    .request(config)
    .then((response) => {
      console.log(response.data.result)
      storeNamesArray = response.data.result.map((store) => ({
        storeName: store.storeName,
        _id: store._id,
        region: store.region,
      }))
    })
    .catch((error) => {
      console.log(error)
    })
  return storeNamesArray
}

const initForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  role: '',
  storeId: '',
  city: '',
  address: '',
}

const RegisterUser = () => {
  const token = sessionStorage.getItem('authToken')
  const LoggedInUser = JSON.parse(sessionStorage.getItem("profile"));
  const isSuperAdmin = LoggedInUser?.role === 'Super Admin';
  const [sideMenu, setsideMenu] = useState(false)
  const [isGrest, setIsGrest] = useState(null)
  const [isTableLoaded, setIsTableLoaded] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [sucBox, setSucBox] = useState(false)
  const [failBox, setFailBox] = useState(false)
  const [storeData, setStoreData] = useState([])
  const [formData, setFormData] = useState(initForm)
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchAndSetStores = async () => {
      setIsTableLoaded(true);
      const stores = await getStore();
      setStoreData(stores);
      if (!isSuperAdmin && stores.length === 1) {
        setFormData(prevData => ({ ...prevData, storeId: stores[0]._id }));
      }
      setIsTableLoaded(false);
    };

    fetchAndSetStores();
  }, [isSuperAdmin]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setFormData({
      ...formData,
      [name]: newValue,
    })
  }

  const submitHandler = (event) => {
    event.preventDefault()
    setIsTableLoaded(true)
    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      role: formData.role,
      storeId: formData.storeId,
      city: formData.city,
      address: formData.address,
    }
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/userregistry/register`,
      headers: { Authorization: token },
      data: data,
    }
    axios
      .request(config)
      .then((response) => {
        setErrMsg('Successfully added new user')
        setSucBox(true)
        setIsTableLoaded(false)
        navigate('/registeruserdetails')
      })
      .catch((error) => {
        console.log(error)
        setErrMsg('Failed to add new user, ' + error.response.data.msg)
        setFailBox(true)
        setIsTableLoaded(false)
      })
  }
  return (
    <div className='min-h-screen  pb-8 bg-[#F5F4F9]'>
      <div className='navbar'>
        <AdminNavbar setsideMenu={setsideMenu} sideMenu={sideMenu} />
        <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
      </div>
      <BulkUploadModal
        isOpen={isBulkUploadModalOpen}
        onClose={() => setIsBulkUploadModalOpen(false)}
      />
      {isTableLoaded && (
        <div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50'>
          <BeatLoader
            color='var(--primary-color)'
            loading={isTableLoaded}
            size={15}
          />
        </div>
      )}
      {(sucBox || failBox) && (
        <div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50'>
          <div
            className={`${styles.err_mod_box} ${sucBox ? sucTextColor : failTextColor
              }`}
          >
            {sucBox ? (
              <IoIosCheckmarkCircle
                className={sucBox ? sucTextColor : failTextColor}
                size={90}
              />
            ) : (
              <IoIosCloseCircle
                className={sucBox ? sucTextColor : failTextColor}
                size={90}
              />
            )}
            <h6 className={sucBox ? sucTextColor : failTextColor}>
              {sucBox ? 'Success!' : 'Error!'}
            </h6>
            <p className='text-slate-500'>{errMsg}</p>
            <button
              onClick={() => {
                setSucBox(false)
                setFailBox(false)
              }}
              className={
                sucBox ? 'bg-green-500 text-white' : 'text-white bg-primary'
              }
            >
              Okay
            </button>
          </div>
        </div>
      )}
      <div
        style={{
          boxShadow:
            'rgba(0, 0, 0, 0.3) 0px 0px 10px, rgba(0, 0, 0, 0.1) 0px 5px 12px',
        }}
        className='items-center bg-white max-w-[900px] flex py-8 mx-auto mt-4 justify-center flex-col'
      >
        <div className='flex flex-col w-[900px]'>
          <div className='mb-6  flex flex-col gap-2 border-b-2 pb-2 mr-10 ml-10'>
            <div className='flex items-center gap-6 justify-centerflex-wrap'>
              <p className='text-4xl font-bold'>Register User</p>
              <button
                onClick={() => setIsBulkUploadModalOpen(true)}
                className='font-medium text-sm text-white px-4 py-2 rounded bg-primary'
              >
                Bulk Upload
              </button>
            </div>

            <p className='text-lg '>All fields marked with * are required</p>
          </div>
          <div className='flex flex-wrap gap-2 ml-10 mb-10'>
            <button
              onClick={() => navigate('/registeruserdetails')}
              className='font-medium text-sm text-white p-3 rounded bg-primary'
            >
              View Details
            </button>
          </div>
          <UserForm
            formData={formData}
            submitHandler={submitHandler}
            handleChange={handleChange}
            setIsGrest={setIsGrest}
            storeData={storeData}
            isSuperAdmin={isSuperAdmin}
          />
        </div>
      </div>
    </div>
  )
}

export default RegisterUser

const UserForm = ({ formData, submitHandler, handleChange, storeData, isSuperAdmin }) => {
  const [showUserPassword, setShowUserPassword] = useState(false)

  return (
    <form
      className='ml-10 flex flex-col gap-4'
      onSubmit={submitHandler}
      autoComplete='off'
    >
      <label className='flex flex-col w-[70%] gap-2'>
        <span className='font-medium text-xl'>First name*</span>
        <input
          name='firstName'
          id='firstName'
          placeholder='Enter first name'
          value={formData.firstName}
          onChange={handleChange}
          className='border-2 px-2 py-2 rounded-lg outline-none'
          type='text'
          required
        />
      </label>
      <label className='flex flex-col w-[70%] gap-2'>
        <span className='font-medium text-xl'>Last name</span>
        <input
          name='lastName'
          id='lastName'
          placeholder='Enter last name'
          value={formData.lastName}
          onChange={handleChange}
          className='border-2 px-2 py-2 rounded-lg outline-none'
          type='text'
        />
      </label>
      <label className='flex flex-col w-[70%] gap-2'>
        <span className='font-medium text-xl'>Email*</span>
        <input
          name='email'
          id='email'
          minLength={6}
          placeholder='Enter your email address'
          value={formData.email || ''}
          onChange={handleChange}
          className='border-2 px-2 py-2 rounded-lg  outline-none '
          type='email'
          autoComplete='off'
          required
        />
      </label>
      <div>
        <label className='font-medium text-xl' htmlFor='password'>
          Password*
        </label>
        <div className='flex flex-col relative input w-[70%] gap-2'>
          <input
            name='password'
            id='password'
            minLength={6}
            placeholder='Enter new password (min. 6 characters)'
            value={formData.password || ''}
            onChange={handleChange}
            className='border-2 px-2 py-2 rounded-lg  outline-none '
            type={showUserPassword ? 'text' : 'password'}
            autoComplete='off'
            required
          />
          <span
            onClick={() => setShowUserPassword(!showUserPassword)}
            className='absolute transform -translate-y-1/2 cursor-pointer right-2 top-6'
          >
            {!showUserPassword ? <IoEyeOffSharp /> : <IoEye />}
          </span>
        </div>
      </div>
      <label className='flex flex-col w-[70%] gap-2 '>
        <span className='font-medium text-xl'>Mobile Number*</span>
        <input
          name='phoneNumber'
          id='phoneNumber'
          minLength={10}
          placeholder='Enter 10-digit mobile number'
          value={formData.phoneNumber}
          onChange={handleChange}
          className='border-2 px-2 py-2 rounded-lg  outline-none'
          maxLength={10}
          type='tel'
          required
        />
      </label>
      {isSuperAdmin && (
        <label className='flex flex-col w-[70%] gap-2'>
          <span className='font-medium text-xl'>Store Name*</span>
          <select
            name='storeId'
            id='storeId'
            value={formData.storeId}
            className='outline-none text-base border-2 p-2 rounded-lg'
            onChange={handleChange}
            required
          >
            <option value=''> None </option>
            {storeData.map((item) => (
              <option key={item._id} value={item._id}>
                {`${item.storeName}, ${item.region}`}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className='flex flex-col w-[70%] gap-2'>
        <span className='font-medium text-xl'>Role*</span>
        <select
          id='role'
          name='role'
          value={formData.role}
          className='outline-none text-base border-2 px-2 py-2 rounded-lg'
          onChange={handleChange}
          required
        >
          <option value=''>None</option>
          {role.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className='flex flex-col w-[70%] gap-2'>
        <span className='font-medium text-xl'>City</span>
        <input
          name='city'
          id='city'
          placeholder='Enter your city name'
          value={formData.city}
          onChange={handleChange}
          className='border-2 px-2 py-2 rounded-lg  outline-none'
          type='text'
        />
      </label>
      <label className='flex flex-col w-[70%] gap-2'>
        <span className='font-medium text-xl'>Adddress</span>
        <input
          name='address'
          id='address'
          placeholder='Enter your full address'
          value={formData.address}
          onChange={handleChange}
          className='border-2 px-2 py-2 rounded-lg  outline-none'
          type='text'
        />
      </label>
      <div className='mt-8'>
        <button
          type='submit'
          className='font-medium text-sm text-white p-3 rounded bg-primary'
        >
          Submit Form
        </button>
      </div>
    </form>
  )
}
