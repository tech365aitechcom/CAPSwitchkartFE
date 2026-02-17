import React from 'react'
import { GoDotFill } from 'react-icons/go'
import { updateGroupObject, toggleGroupObject } from '../../store/slices/QNAslice'
import imageMap from '../../utils/imageMap'
import store from '../../store/store'

const whiteText = 'text-white'
const blackText = 'text-black'
const pinkBg = 'bg-primary'
const whiteBg = 'bg-white'

// Toggle mode: one card per question, clicking the question toggles it
const ToggleGroup = ({ groupKey, questions, slice }) => (
  <div className='grid grid-cols-2 gap-y-3 gap-x-[4%]'>
    {questions.map((data, index) => (
      <div
        key={data._id}
        className={`${
          slice[index]?.answer === data.yes ? pinkBg : whiteBg
        } flex flex-col justify-start items-center shadow-lg rounded-lg px-3`}
        onClick={() => {
          store.dispatch(
            toggleGroupObject({
              group: groupKey,
              index,
              yesKey: data.yes,
              noKey: data.no,
            })
          )
        }}
      >
        <div className='mt-3 mb-1 rounded-md overflow-hidden bg-white'>
          <img
            className='scale-[1.2]'
            src={imageMap[data?.options[0]?.img] || data?.options[0]?.img}
          />
        </div>
        <div className='w-full border-t-[1.5px] py-2'>
          <p
            className={`${
              slice[index]?.answer === data.yes ? whiteText : blackText
            } text-xs font-medium text-center`}
          >
            {data.quetion}
          </p>
        </div>
      </div>
    ))}
  </div>
)

// Standard mode: option cards per question
const StandardGroup = ({ groupKey, questions, slice }) => (
  <div className='w-full flex flex-wrap gap-y-3 gap-x-[4%] justify-start flex-row'>
    {questions.map((data, index) =>
      data.options.map((option, optionIndex) => (
        <div
          key={`${data._id}_${optionIndex}`}
          onClick={() => {
            store.dispatch(
              updateGroupObject({
                group: groupKey,
                index,
                yesKey: data.yes,
                noKey: data.no,
                selectedIndex: optionIndex,
              })
            )
          }}
          className={`px-3 flex flex-col items-center w-[48%] min-h-[150px] shadow-lg rounded-lg ${
            !slice[index]?.selected[optionIndex] ? whiteBg : pinkBg
          }`}
        >
          <div className='mb-1 mt-3 rounded-md overflow-hidden bg-white'>
            <img
              className='scale-[1.2]'
              src={imageMap[option?.img] || option?.img}
            />
          </div>
          <div className='border-t-[1.5px] w-full py-2'>
            <p
              className={`font-medium text-xs text-center ${
                !slice[index]?.selected[optionIndex] ? blackText : whiteText
              }`}
            >
              {option.caption}
            </p>
          </div>
        </div>
      ))
    )}
  </div>
)

const GROUP_LABELS = {
  Core: 'Basic Condition of the Device',
  Cosmetics: 'Physical Condition of the Device',
  Display: 'Display Condition of the Device',
  Functional: 'Functional Condition of the Device',
  Functional_major: 'Functional Condition of the Device',
  Functional_minor: 'Functional Condition of the Device',
}

const GenericPart = ({ NDstate, slice, groupKey, toggleMode }) => {
  const questions = NDstate?.[groupKey] ?? []
  const label = GROUP_LABELS[groupKey] ?? groupKey

  return (
    <div className='containClass'>
      {toggleMode ? (
        <div className='text-sm text-[#676767] py-1 font-medium text-center text-pretty'>
          <p>Please choose appropriate condition to get accurate quote</p>
        </div>
      ) : (
        <div className='subheading'>
          <GoDotFill size={15} />
          <h2>{label}</h2>
        </div>
      )}
      {toggleMode ? (
        <ToggleGroup groupKey={groupKey} questions={questions} slice={slice} />
      ) : (
        <StandardGroup groupKey={groupKey} questions={questions} slice={slice} />
      )}
      <div className='flex mt-4 bg-primary text-white font-medium py-2 px-3 text-sm rounded-md'>
        Continue, If you don't have any Above-Mentioned Issues.
      </div>
    </div>
  )
}

export default GenericPart
