import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from '../components/Admin_Navbar';
import SideMenu from '../components/SideMenu';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io';
import CouponForm from '../components/CouponForm';
import toast from 'react-hot-toast';

const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
        console.error("Invalid date string for formatting:", dateString);
        return '';
    }
};

const getStorePrefix = (storeName = '') => {
    return storeName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
};

const validateForm = (formData, isEditMode) => {
    const errors = {};
    if (!formData.couponCode.trim()) { errors.couponCode = 'Coupon Code is required.'; }
    else if (/\s/.test(formData.couponCode)) { errors.couponCode = 'Coupon Code cannot contain spaces.'; }
    if (!formData.storeId) { errors.storeId = 'A store must be selected.'; }
    if (!formData.discountValue) { errors.discountValue = 'Discount value is required.'; }
    else if (Number(formData.discountValue) <= 0) { errors.discountValue = 'Discount value must be greater than zero.'; }
    const minPrice = Number(formData['devicePriceRange.min']);
    const maxPriceInput = formData['devicePriceRange.max'];
    if (minPrice < 0) { errors.priceRange = 'Minimum price cannot be negative.'; }
    else if (maxPriceInput && Number(maxPriceInput) <= minPrice) { errors.priceRange = 'Maximum price must be greater than minimum price.'; }
    if (!formData.validFrom || !formData.validTo) { errors.dates = 'Both "Valid From" and "Valid To" dates are required.'; }
    else {
        const fromDate = new Date(formData.validFrom);
        const toDate = new Date(formData.validTo);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (toDate < fromDate) { errors.dates = '"Valid To" date cannot be before "Valid From" date.'; }
        if (!isEditMode && toDate < today) {
            errors.dates = 'The coupon validity period cannot end in the past.';
        }
    }
    return errors;
};

const getStores = async (token) => {
    const config = {
        method: 'get',
        url: `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/store/findAll?page=0&limit=9999`,
        headers: { Authorization: token },
    };
    try {
        const response = await axios.request(config);
        return response.data.result.map((store) => ({
            storeName: store.storeName,
            _id: store._id,
            region: store.region,
        }));
    } catch (error) {
        console.error("Error fetching stores:", error);
        toast.error(`Failed to fetch stores: ${error.response?.data?.message || 'Check permissions.'}`);
        return [];
    }
};

const initForm = {
    couponCode: '', storeId: '', 'devicePriceRange.min': '0', 'devicePriceRange.max': '',
    discountType: 'Fixed', discountValue: '', validFrom: '', validTo: '', status: 'Active',
};

const CreateCoupon = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const token = sessionStorage.getItem('authToken');
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initForm);
    const [storeData, setStoreData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccessModal, setIsSuccessModal] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isCodeManuallyChanged, setIsCodeManuallyChanged] = useState(false);
    const [pageTitle, setPageTitle] = useState("Create Coupon");
    const [sideMenu, setSideMenu] = useState(false);

    useEffect(() => {
        const fetchAllStores = async () => {
            setIsLoading(true);
            const stores = await getStores(token);
            setStoreData(stores);
            setIsLoading(false);
        };
        if (token) fetchAllStores();
    }, [token]);

    useEffect(() => {
        if (isEditMode) {
            setIsLoading(true);
            setPageTitle("Edit Coupon");
            const fetchCouponData = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/coupons/list?id=${id}`, {
                        headers: { Authorization: token },
                    });

                    if (response.data.data && response.data.data.length > 0) {
                        const coupon = response.data.data[0];
                        setFormData({
                            ...coupon,
                            'devicePriceRange.min': coupon.devicePriceRange.min,
                            'devicePriceRange.max': coupon.devicePriceRange.max === Infinity ? '' : coupon.devicePriceRange.max,
                            validFrom: formatDateForInput(coupon.validFrom),
                            validTo: formatDateForInput(coupon.validTo),
                        });
                    } else {
                        throw new Error("Coupon not found.");
                    }
                } catch (error) {
                    toast.error("Could not load coupon data for editing.");
                    navigate('/coupondetails');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchCouponData();
        }
    }, [id, isEditMode, token, navigate]);

    useEffect(() => {
        if (!isEditMode && !isCodeManuallyChanged && formData.discountValue && formData.storeId) {
            const selectedStore = storeData.find(store => store._id === formData.storeId);
            if (!selectedStore) return;
            const storePrefix = getStorePrefix(selectedStore.storeName);
            const value = formData.discountValue;
            const typeSuffix = formData.discountType === 'Percentage' ? 'P' : '';
            const baseCode = `SW${value}${typeSuffix}`;
            const generatedCode = `${storePrefix}-${baseCode}`.toUpperCase();
            setFormData(prev => ({ ...prev, couponCode: generatedCode }));
        }
    }, [formData.discountValue, formData.discountType, formData.storeId, isCodeManuallyChanged, storeData, isEditMode]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        if (name === 'couponCode') { setIsCodeManuallyChanged(true); }
        if (['discountType', 'discountValue', 'storeId'].includes(name)) { setIsCodeManuallyChanged(false); }
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        if (formErrors[name] || formErrors.dates || formErrors.priceRange) {
            const newErrors = { ...formErrors };
            delete newErrors[name];
            if (name.includes('devicePriceRange')) delete newErrors.priceRange;
            if (name.includes('valid')) delete newErrors.dates;
            setFormErrors(newErrors);
        }
    }, [formErrors]);

    const submitHandler = useCallback(async (event) => {
        event.preventDefault();
        const errors = validateForm(formData);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;
        setIsLoading(true);
        const payload = {
            couponCode: formData.couponCode.trim().toUpperCase(),
            storeId: formData.storeId,
            devicePriceRange: {
                min: Number(formData['devicePriceRange.min']),
                max: formData['devicePriceRange.max'] ? Number(formData['devicePriceRange.max']) : Infinity,
            },
            discountType: formData.discountType,
            discountValue: Number(formData.discountValue),
            validFrom: formData.validFrom,
            validTo: formData.validTo,
            status: formData.status,
        };
        const config = {
            method: isEditMode ? 'put' : 'post',
            url: isEditMode
                ? `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/coupons/update/${id}`
                : `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/coupons/create`,
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },
            data: payload
        };

        try {
            await axios.request(config);
            setModalMessage(`Coupon ${isEditMode ? 'updated' : 'created'} successfully`);
            setIsSuccessModal(true);
            setIsModalOpen(true);
            if (isEditMode) {
                setTimeout(() => navigate('/coupondetails'), 1500);
            } else {
                setFormData(initForm);
                setFormErrors({});
                setIsCodeManuallyChanged(false);
            }
        } catch (error) {
            const backendMessage = error.response?.data?.message;
            const errorMessage = backendMessage || 'An unknown error occurred.';
            setModalMessage(`Failed to ${isEditMode ? 'update' : 'create'} coupon: ` + errorMessage);
            setIsSuccessModal(false);
            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    }, [formData, token, isEditMode, id, navigate]);

    return (
        <div className='min-h-screen pb-20 bg-[#F5F4F9]'>
            <div className='navbar'>
                <AdminNavbar setsideMenu={setSideMenu} sideMenu={sideMenu} />
                <SideMenu setsideMenu={setSideMenu} sideMenu={sideMenu} />
            </div>

            {isLoading && (<div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50'> <BeatLoader color='var(--primary-color)' loading={isLoading} size={15} /> </div>)}

            {isModalOpen && (<div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50'> <div className={`bg-white w-1/2 rounded-lg flex flex-col justify-center items-center p-5 gap-5 ${isSuccessModal ? 'text-green-500' : 'text-primary'}`}> {isSuccessModal ? <IoIosCheckmarkCircle size={90} /> : <IoIosCloseCircle size={90} />} <h6 className='text-3xl font-bold'>{isSuccessModal ? 'Success!' : 'Error!'}</h6> <p className='text-lg font-medium text-slate-500 text-center'>{modalMessage}</p> <button onClick={() => setIsModalOpen(false)} className={`shadow-md px-8 py-2 mt-2 rounded-lg text-lg font-medium transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg ${isSuccessModal ? 'bg-green-500 text-white' : 'text-white bg-primary'}`}>Okay</button> </div> </div>)}

            <div style={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 10px, rgba(0, 0, 0, 0.1) 0px 5px 12px' }} className='items-center bg-white max-w-4xl flex py-8 mx-auto mt-4 justify-center flex-col'>
                <div className='flex flex-col w-full px-10'>
                    <div className='mb-6 flex flex-col gap-2 border-b-2 pb-2'>
                        <div className='flex items-center gap-6'>
                            <p className='text-4xl font-bold'>{pageTitle}</p>
                        </div>
                        <p className='text-lg'>All fields marked with * are required</p>
                    </div>
                    <div className='flex flex-wrap gap-2 mb-10'>
                        <button onClick={() => navigate('/coupondetails')} className='font-medium text-sm text-white p-3 rounded bg-primary shadow-sm hover:shadow-md transition-shadow'>View Details</button>
                    </div>
                    <CouponForm formData={formData} submitHandler={submitHandler} handleChange={handleChange} storeData={storeData} errors={formErrors} formType={isEditMode ? 'update' : 'create'} />
                </div>
            </div>
        </div>
    );
};

export default CreateCoupon;