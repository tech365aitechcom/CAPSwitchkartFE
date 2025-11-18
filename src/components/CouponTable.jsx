
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { IoRefresh } from "react-icons/io5";
import CouponStatusToggle from './CouponStatusToggle';

const CouponTable = ({
    data,
    searchValue,
    setSearchValue,
    storeValue,
    setStoreValue,
    onSearch,
    onClear,
    onDelete,
    pagination,
    onPageChange,
    onStatusToggle,
}) => {
    const navigate = useNavigate();
    const { currentPage, totalPages, totalRecords } = pagination || {};

    return (
        <>
            <div className="flex flex-wrap gap-4 items-center mt-2 justify-center p-4 w-full">
                <button
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg shadow-md transition-all duration-200 ease-in-out active:scale-95"
                    onClick={() => navigate("/createcoupon")}
                >
                    <IoMdAdd /> Add Coupon
                </button>

                <div className='relative w-full md:w-auto'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                        <IoMdSearch className='w-5 h-5 text-gray-900' />
                    </div>
                    <input
                        onChange={(e) => setSearchValue(e.target.value)}
                        className='block w-full md:w-64 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary'
                        type='text'
                        placeholder='Search Coupon Code'
                        value={searchValue}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    />
                </div>

                <div className='relative w-full md:w-auto'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                        <IoMdSearch className='w-5 h-5 text-gray-900' />
                    </div>
                    <input
                        onChange={(e) => setStoreValue(e.target.value)}
                        className='block w-full md:w-64 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary'
                        type='text'
                        placeholder='Search Store Name'
                        value={storeValue}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    />
                </div>

                <button
                    onClick={onClear}
                    title='Refresh Filters'
                    className='p-2.5 text-sm font-medium text-white bg-primary rounded-lg border border-gray-300 transition-transform duration-150 ease-in-out active:scale-95'
                >
                    <IoRefresh size={20} />
                </button>
            </div>

            <div className="m-2 md:m-5">
                <div className="overflow-x-auto border border-gray-300 rounded-md">
                    <table className="w-full">
                        <thead className="bg-primary text-white">
                            <tr className="align-top">
                                <th className="px-4 py-2 text-sm font-medium text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">Action</th>
                                <th className="px-4 py-2 text-sm font-medium text-left md:px-6 md:py-3 md:text-base whitespace-nowrap">Coupon Code</th>
                                <th className="px-4 py-2 text-sm font-medium text-left md:px-6 md:py-3 md:text-base whitespace-nowrap">Store Name</th>
                                <th className="px-4 py-2 text-sm font-medium text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">Device Price Range</th>
                                <th className="px-4 py-2 text-sm font-medium text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">Discount Type</th>
                                <th className="px-4 py-2 text-sm font-medium text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">Discount Value</th>
                                <th className="px-4 py-2 text-sm font-medium text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">Validity</th>
                                <th className="px-4 py-2 text-sm font-medium text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">Status</th>
                                <th className="px-4 py-2 text-sm font-medium text-left md:px-6 md:py-3 md:text-base whitespace-nowrap">Created By</th>
                                <th className="px-4 py-2 text-sm font-medium text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">Created Date</th>
                                <th className="px-4 py-2 text-sm font-medium text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">Last Updated</th>
                                <th className="px-4 py-2 text-sm font-medium text-center md:px-6 md:py-3 md:text-base whitespace-nowrap"> TotalRedemptions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 ? (
                                data.map((val) => (
                                    <tr key={val._id} className={val._id % 2 === 0 ? "bg-gray-200" : "bg-white"}>
                                        <td className="px-4 py-2 text-sm text-left md:px-6 md:py-3 md:text-base whitespace-nowrap">
                                            <div className="flex flex-row gap-2 items-center">
                                                <button
                                                    className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                    onClick={() => navigate(`/editcoupon/${val._id}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700" onClick={() => onDelete(val)}>Delete</button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-sm font-bold text-left md:px-6 md:py-3 md:text-base whitespace-nowrap">{val.couponCode}</td>
                                        <td className="px-4 py-2 text-sm text-left md:px-6 md:py-3 md:text-base whitespace-nowrap">{val.storeName}</td>
                                        <td className="px-4 py-2 text-sm text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">{`₹${val.devicePriceRange.min} - ${val.devicePriceRange.max === Infinity ? '∞' : `₹${val.devicePriceRange.max}`}`}</td>
                                        <td className="px-4 py-2 text-sm text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">
                                            {val.discountType}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">
                                            {val.discountType === 'Fixed' ? `₹${val.discountValue}` : `${val.discountValue}%`}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">{`${new Date(val.validFrom).toLocaleDateString("en-GB")} to ${new Date(val.validTo).toLocaleDateString("en-GB")}`}</td>
                                        <td className="px-4 py-2 text-sm text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">
                                            <div className="flex justify-center">
                                                <CouponStatusToggle
                                                    isActive={val.status === 'Active'}
                                                    onToggle={() => onStatusToggle(val._id, val.status)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-left md:px-6 md:py-3 md:text-base whitespace-nowrap">{val.createdBy}</td>
                                        <td className="px-4 py-2 text-sm text-left md:px-6 md:py-3 md:text-base whitespace-nowrap">{new Date(val.createdAt).toLocaleString("en-GB")}</td>
                                        <td className="px-4 py-2 text-sm text-left md:px-6 md:py-3 md:text-base whitespace-nowrap">{new Date(val.updatedAt).toLocaleString("en-GB")}</td>
                                        <td className="px-4 py-2 text-sm text-center md:px-6 md:py-3 md:text-base whitespace-nowrap">{val.totalRedemptions}</td>


                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center text-gray-500 py-10">No coupons found for the selected filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination && totalRecords > 0 && (
                    <div className="flex justify-center items-center mt-4">
                        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="mx-2 px-4 py-2 rounded-lg bg-primary text-white disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <span className="mx-4 text-sm">
                            Page {currentPage} of {totalPages} (Total: {totalRecords} coupons)
                        </span>
                        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="mx-2 px-4 py-2 rounded-lg bg-primary text-white disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CouponTable;