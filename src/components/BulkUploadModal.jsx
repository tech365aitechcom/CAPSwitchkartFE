import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { BeatLoader } from 'react-spinners'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import {
  IoDownloadOutline,
  IoDocumentTextOutline,
  IoCloudUploadOutline,
} from 'react-icons/io5'

const BulkUploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [error, setError] = useState('')
  const [previewData, setPreviewData] = useState([])
  const [previewHeaders, setPreviewHeaders] = useState([])

  const resetState = useCallback(() => {
    setFile(null)
    setIsUploading(false)
    setUploadResult(null)
    setError('')
    setPreviewData([])
    setPreviewHeaders([])
  }, [])

  useEffect(() => {
    if (isOpen) {
      resetState()
    }
  }, [isOpen, resetState])

  const generatePreview = (file) => {
    const reader = new FileReader()
    const isExcel = file.type.includes('sheet') || file.type.includes('excel')

    reader.onload = (e) => {
      try {
        if (isExcel) {
          const workbook = XLSX.read(e.target.result, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          if (json.length > 0) {
            setPreviewHeaders(json[0])
            setPreviewData(json.slice(1, 6))
          }
        } else {
          Papa.parse(e.target.result, {
            header: true,
            preview: 5,
            skipEmptyLines: true,
            complete: (results) => {
              if (results.data.length > 0) {
                setPreviewHeaders(results.meta.fields)
                setPreviewData(results.data.map((row) => Object.values(row)))
              }
            },
          })
        }
      } catch (previewError) {
        setError('Could not generate a preview for this file.')
      }
    }

    if (isExcel) {
      reader.readAsBinaryString(file)
    } else {
      reader.readAsText(file)
    }
  }

  const handleFileChange = (e) => {
    setPreviewData([])
    setPreviewHeaders([])
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ]
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setError('')
        generatePreview(selectedFile)
      } else {
        setError('Invalid file type. Please upload a .csv or .xlsx file.')
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.')
      return
    }
    setIsUploading(true)
    setError('')
    const token = sessionStorage.getItem('authToken')
    const formData = new FormData()
    formData.append('file', file)

    const config = {
      method: 'post',
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/userregistry/bulk-upload`,
      headers: { Authorization: token, 'Content-Type': 'multipart/form-data' },
      data: formData,
    }

    try {
      const response = await axios.request(config)
      setUploadResult(response.data.result)
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || 'An unexpected error occurred during upload.'
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const downloadCSV = (data, filename) => {
    const escapeCsvCell = (cell) => {
      const strCell = String(cell ?? '')
      if (
        strCell.includes(',') ||
        strCell.includes('"') ||
        strCell.includes('\n')
      ) {
        return `"${strCell.replace(/"/g, '""')}"`
      }
      return strCell
    }
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      data.map((row) => row.map(escapeCsvCell).join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadSample = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Password',
      'Mobile Number',
      'Store Name',
      'Role',
      'City',
      'Address',
    ]
    const sampleData = [
      headers,
      [
        'John',
        'Doe',
        'john.doe@example.com',
        'pass1234',
        '9876543210',
        'Store A',
        'Admin',
        'Delhi',
        '123 MG Road',
      ],
      [
        'Jane',
        'Doe',
        'jane.doe@example.com',
        'pass5678',
        '8765432109',
        'Store B',
        'Sale User',
        'Delhi',
        '123 MG Road',
      ],
    ]
    downloadCSV(sampleData, 'sample_user_upload.csv')
  }

  const handleDownloadFailed = () => {
    if (uploadResult?.failedRecords) {
      const headers = [
        'First Name',
        'Last Name',
        'Email',
        'Password',
        'Mobile Number',
        'Store Name',
        'Role',
        'City',
        'Address',
        'Error Message',
      ]
      const dataToDownload = [headers, ...uploadResult.failedRecords]
      downloadCSV(dataToDownload, 'failed_user_records.csv')
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div
        style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px' }}
        className='bg-white rounded-lg p-6 md:p-8 w-full max-w-4xl relative transform transition-all'
      >
        <button
          onClick={onClose}
          className='absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-900'
        >
          ×
        </button>
        <h2 className='text-2xl md:text-3xl font-bold mb-6 text-gray-800 border-b pb-4'>
          Bulk User Upload
        </h2>

        {isUploading ? (
          <div className='flex flex-col items-center justify-center h-64'>
            <BeatLoader
              color='var(--primary-color)'
              loading={isUploading}
              size={20}
            />
            <p className='mt-4 text-lg text-gray-600'>
              Processing your file, please wait...
            </p>
          </div>
        ) : uploadResult ? (
          <div>
            <h3 className='text-xl font-semibold text-gray-700 mb-4'>
              Upload Summary
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6'>
              <div className='p-4 bg-gray-100 rounded-lg'>
                <p className='text-3xl font-bold text-gray-800'>
                  {uploadResult.total}
                </p>
                <p className='text-sm font-medium text-gray-500'>
                  Total Records
                </p>
              </div>
              <div className='p-4 bg-green-100 rounded-lg'>
                <p className='text-3xl font-bold text-green-600'>
                  {uploadResult.succeeded}
                </p>
                <p className='text-sm font-medium text-green-500'>Succeeded</p>
              </div>
              <div className='p-4 bg-red-100 rounded-lg'>
                <p className='text-3xl font-bold text-red-600'>
                  {uploadResult.failed}
                </p>
                <p className='text-sm font-medium text-red-500'>Failed</p>
              </div>
            </div>
            {uploadResult.failed > 0 && (
              <div className='flex flex-col items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                <p className='text-gray-700 mb-3 text-center'>
                  Some records could not be Register. Download the file to see
                  the failed records with valid errors , correct them, and
                  re-upload.
                </p>
                <button
                  onClick={handleDownloadFailed}
                  className='flex items-center gap-2 font-medium text-sm text-white px-4 py-2 rounded bg-primary hover:bg-opacity-90 transition-colors'
                >
                  <IoDownloadOutline size={18} />
                  Download Failed Records
                </button>
              </div>
            )}
            <div className='mt-8 flex flex-col sm:flex-row justify-end gap-3'>
              <button
                onClick={resetState}
                className='font-medium text-sm text-gray-700 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors'
              >
                Upload Another File
              </button>
              <button
                onClick={onClose}
                className='font-medium text-sm text-white px-4 py-2 rounded bg-primary hover:bg-opacity-90'
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className='mb-6 p-4 border border-dashed rounded-lg bg-gray-50'>
              <p className='text-sm text-gray-600 mb-2'>
                Download the sample template to ensure your data is in the
                correct format. Mandatory fields are:{' '}
                <span className='font-semibold'>
                  First Name, Last Name, Email, Password, Mobile Number, Store
                  Name, Role, City,Address
                </span>
                .
              </p>
              <button
                onClick={handleDownloadSample}
                className='flex items-center gap-2 text-sm font-semibold text-primary hover:underline'
              >
                <IoDocumentTextOutline size={16} />
                Download Sample CSV
              </button>
            </div>
            <div className='flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:border-primary transition-colors'>
              <IoCloudUploadOutline className='text-gray-400' size={50} />
              <label
                htmlFor='file-upload'
                className='mt-2 cursor-pointer font-medium text-primary hover:text-primary-dark'
              >
                <span>Select a .csv or .xlsx file</span>
                <input
                  id='file-upload'
                  name='file-upload'
                  type='file'
                  className='sr-only'
                  onChange={handleFileChange}
                  accept='.csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
                />
              </label>
              {file && (
                <p className='mt-2 text-sm text-gray-500'>{file.name}</p>
              )}
            </div>
            {error && (
              <p className='mt-4 text-sm text-red-600 text-center'>{error}</p>
            )}

            {previewData.length > 0 && (
              <div className='mt-6'>
                <h4 className='font-semibold text-gray-700 mb-2'>
                  File Preview (Top 5 rows)
                </h4>
                <div className='overflow-y-auto border border-primary rounded-lg max-h-40'>
                  <table className='w-full text-sm text-left'>
                    <thead className='bg-primary text-white sticky top-0'>
                      <tr>
                        {previewHeaders.map((header, index) => (
                          <th key={index} className='p-2 md:p-3 font-medium'>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className='bg-white'>
                      {previewData.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={
                            rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                          }
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className='p-2 md:p-3 text-gray-700 truncate max-w-xs'
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className='mt-8 flex justify-end'>
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className='flex items-center gap-2 font-medium text-sm text-white px-6 py-2.5 rounded bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
              >
                <IoCloudUploadOutline size={18} />
                Upload File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BulkUploadModal
