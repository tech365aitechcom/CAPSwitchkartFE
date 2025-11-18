import React, { useState, useEffect } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

const QuickActivityLogModal = ({ userId, userName, onClose }) => {
    const [logData, setLogData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDownloading, setIsDownloading] = useState(false);
    const rowsPerPage = 8;

    useEffect(() => {
        if (userId) {
            const fetchLog = async () => {
                setLoading(true);
                setError(null);
                try {
                    const token = sessionStorage.getItem("authToken");
                    const response = await axios.get(
                        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/quoteTracking/activity-log/${userId}`,
                        { headers: { Authorization: token } }
                    );
                    setLogData(response.data.logs);
                } catch (error) {
                    const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
                    setError(errorMessage);
                } finally {
                    setLoading(false);
                }
            };
            fetchLog();
        }
    }, [userId]);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = logData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(logData.length / rowsPerPage);

    const handleDownload = async () => {
        if (isDownloading || logData.length === 0) {
            return;
        }

        setIsDownloading(true);
        const toastId = toast.loading(
            <div className='flex items-center gap-2'>
                <BeatLoader color='#3B82F6' size={8} />
                <span>Generating activity log...</span>
            </div>
        );

        try {
            const headers = ['S.No.', 'Timestamp', 'Device Name', 'Series', 'Category', 'Device Details', 'Quote Type', 'Quote Amount'];
            const csvContent = [
                headers.join(','),
                ...logData.map((log, index) => [
                    index + 1,
                    `"${new Date(log.timestamp).toLocaleString("en-IN")}"`,
                    `"${log.deviceDetails?.name || '-'}"`,
                    `"${log.deviceDetails?.series || '-'}"`,
                    `"${log.deviceDetails?.categoryName || '-'}"`,
                    `"RAM: ${log.deviceDetails?.ram || 'N/A'}, ROM: ${log.deviceDetails?.rom || 'N/A'}"`,
                    `"${log.quoteType}"`,
                    log.quoteAmount
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, `activity_log_${userName.replace('@', '_').replace('.', '_')}_${new Date().toISOString().split('T')[0]}.csv`);

            toast.success('Activity log downloaded successfully!', { id: toastId });
        } catch (error) {
            console.error('Failed to download activity log:', error);
            toast.error('Failed to download activity log', { id: toastId });
        } finally {
            setIsDownloading(false);
        }
    };

    if (!userId) return null;

    return (
        <div className="fixed   inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4">
            <div
                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 5px 12px" }}
                className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col"
            >
                <div className="flex justify-between items-center border-b p-5">
                    <h2 className="text-2xl font-bold text-gray-800">Activity Log</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading || logData.length === 0}
                            className={`
                                flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white 
                                bg-primary rounded-lg shadow-md transition-all duration-200 ease-in-out
                                active:scale-95 disabled:bg-gray-400 disabled:text-gray-500 
                                disabled:cursor-not-allowed disabled:shadow-none
                            `}
                        >
                            {isDownloading ? (
                                <>
                                    <BeatLoader color='#fff' size={6} />
                                    <span>Downloading...</span>
                                </>
                            ) : (
                                <>
                                    <FaDownload />
                                    <span>Download</span>
                                </>
                            )}
                        </button>
                        <button onClick={onClose} className="text-3xl font-light text-gray-500 hover:text-gray-900">×</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 text-sm">
                    <div><strong className="text-gray-600">User ID:</strong><p className="truncate">{userName}</p></div>
                    <div><strong className="text-gray-600">Total Records Found:</strong><p className="font-semibold">{logData.length}</p></div>
                </div>

                <div className="flex-grow overflow-hidden px-5 pb-5">
                    {loading ? (
                        <div className="flex justify-center items-center h-full"><BeatLoader color="var(--primary-color)" /></div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-full text-red-600 bg-red-50 p-4 rounded-lg">
                            <p>Error: {error}</p>
                        </div>
                    ) :
                        (
                            <div className="h-full overflow-y-auto border border-primary rounded-lg">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-primary text-white sticky top-0 z-10">
                                        <tr>
                                            <th className="p-3 font-medium text-center">S.No.</th>
                                            <th className="p-3 font-medium">Timestamp</th>
                                            <th className="p-3 font-medium">Device Name</th>
                                            <th className="p-3 font-medium">Series </th>
                                            <th className="p-3 font-medium">Category</th>
                                            <th className="p-3 font-medium">Device Details</th>
                                            <th className="p-3 font-medium">Quote </th>
                                            <th className="p-3 font-medium text-right">Quote Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {currentRows.length > 0 ? currentRows.map((log, index) => (
                                            <tr key={log.timestamp + index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                                <td className="p-3 w-16 text-center">{indexOfFirstRow + index + 1}</td>
                                                <td className="p-3 whitespace-nowrap">{new Date(log.timestamp).toLocaleString("en-IN")}</td>
                                                <td className="p-3 max-w-xs truncate">{log.deviceDetails?.name || '-'}</td>
                                                <td className="p-3 max-w-xs truncate">{log.deviceDetails?.series || '-'}</td>
                                                <td className="p-3">{log.deviceDetails?.categoryName || '-'}</td>
                                                <td className="p-3 whitespace-nowrap">{`RAM: ${log.deviceDetails?.ram || 'N/A'}, ROM: ${log.deviceDetails?.rom || 'N/A'}`}</td>
                                                <td className="p-3">{log.quoteType}</td>
                                                <td className="p-3 text-right font-semibold">₹{log.quoteAmount.toLocaleString("en-IN")}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" className="text-center p-6 text-gray-500">No activity logs found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </div>

                {totalPages > 1 && !error && (
                    <div className="flex justify-center items-center border-t p-4">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`mx-2 px-4 py-2 rounded-lg ${currentPage === 1
                                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                : "bg-primary text-white cursor-pointer"
                                }`}
                        >
                            Previous
                        </button>
                        <span className="mx-4 text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`mx-2 px-4 py-2 rounded-lg ${currentPage === totalPages
                                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                : "bg-primary text-white cursor-pointer"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickActivityLogModal;