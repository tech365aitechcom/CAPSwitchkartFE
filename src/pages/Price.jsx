import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CgSpinner } from 'react-icons/cg'

// Import components
import PriceHeader from '../components/Price/PriceHeader'
import PriceFormFields from '../components/Price/PriceFormFields'

// Import hooks
import { usePriceForm } from '../hooks/usePriceForm'
import { usePriceUpload } from '../hooks/usePriceUpload'

const pink = 'bg-primary'

const Price = () => {
  const navigate = useNavigate()

  // Use custom hooks
  const formState = usePriceForm()
  const {
    uploadStatus,
    handleFileChange,
    uploadAllImages,
    isLoading,
    uploadIndividualFile,
  } = usePriceUpload(formState)

  const {
    imeinumber,
    phoneFront,
    phoneBack,
    phoneLeft,
    phoneRight,
    phoneTop,
    phoneBottom,
    signatureFile, //add signature file
    customerPhoto, //add customer photo state
    ceirImage, //add CEIR image state
    isAadharVerified,
    handleCameraButtonClick,
  } = formState

  return (
    <div className='flex flex-col h-[100dvh] bg-white'>
      <div className='flex-shrink-0'>
        <PriceHeader navigate={navigate} />
      </div>
      <div className='flex-1 overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch'>
        <div className='w-[90%] md:w-[90%] mx-auto pb-4 mb-2'>
          <div className='mt-3 text-center relative'>
            <h1 className='text-2xl font-semibold'>Upload Documents</h1>
            <p className='mt-4 text-gray-600'>
              Regulations require you to upload a national identity card. Don't
              worry, your data will stay safe and private.
            </p>
          </div>
          <PriceFormFields
            formState={formState}
            uploadStatus={uploadStatus}
            handleFileChange={handleFileChange}
            handleCameraButtonClick={handleCameraButtonClick}
            uploadIndividualFile={uploadIndividualFile} //added for file uploads
          />
        </div>
      </div>
      <div className='flex-shrink-0 flex flex-col w-full gap-2 p-4 bg-white border-t-2'>
        {!isAadharVerified && (
          <p className='text-sm text-center text-red-500'>
            Please verify your Aadhar number before submitting
          </p>
        )}
        <div
          onClick={() => uploadAllImages(navigate)}
          className={` relative text-center py-1 px-2 rounded-lg cursor-pointer flex justify-between text-white items-center ${
            !imeinumber ||
            !phoneFront ||
            !phoneBack ||
            !phoneLeft ||
            !phoneRight ||
            !phoneTop ||
            !phoneBottom ||
            !signatureFile || //check signature
            !customerPhoto || // check customer photo
            !ceirImage || // check CEIR image
            !isAadharVerified // check aadhar verification
              ? 'cursor-not-allowed bg-gray-400'
              : pink
          }`}
        >
          {isLoading && (
            <CgSpinner
              size={20}
              className='absolute left-[28%] top-[8px] mt-1 animate-spin'
            />
          )}
          <p className='w-full p-1 text-xl font-medium'>
            {isLoading ? 'Submitting' : 'Submit'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Price
