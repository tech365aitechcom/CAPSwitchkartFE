import React, { useEffect, useMemo, useReducer, useState } from 'react'
import './newDeviceqs.scss'
import { useQuestionContext } from '../../components/QuestionContext'
import axios from 'axios'
import store from '../../store/store'
import { useSelector } from 'react-redux'
import banner from '../../assets/banner.jpg'
import MainQContainer from '../../components/NewDeviceqs/MainQContainer'
import GenericPart from '../../components/NewDeviceqs/GenericPart'
import SeventhPart from '../../components/NewDeviceqs/SeventhPart'
import EighthPart from '../../components/NewDeviceqs/EighthPart'
import { setGroupAnswers, setRawQuestions } from '../../store/slices/QNAslice'
import useUserProfile from '../../utils/useUserProfile'
import styless from '../QuickQuote/QuickQuote.module.css'
import { initialState, qnaReducer } from '../../utils/qnaReducer'

const GROUPS = [
  'Core',
  'Cosmetics',
  'Display',
  'Functional',
  'Functional_major',
  'Functional_minor',
  'Accessories',
  'Warranty',
]

// Maps API groupName values to state keys
const GROUP_NAME_MAP = {
  'Core': 'Core',
  'Cosmetics': 'Cosmetics',
  'Display': 'Display',
  'Accessories': 'Accessories',
  'Functional': 'Functional',
  'Functional Major': 'Functional_major',
  'Functional Minor': 'Functional_minor',
  'Warranty': 'Warranty',
}

const getGroupKey = (groupName) => GROUP_NAME_MAP[groupName] ?? null

const createDefaultSelected = (length, fillTrue = false) =>
  Array(length).fill(fillTrue)

const createAnswer = (questionData, answer) => {
  const { groupName, options, yes, no, quetion } = questionData
  const group = getGroupKey(groupName)

  // Case 1: both yes/no equal to default answer
  if (yes === answer && no === answer) {
    return {
      quetion,
      answer,
      key: 'no',
      group,
      selected: createDefaultSelected(options.length, false),
    }
  }

  // Case 2: default answer equals yes
  if (yes === answer) {
    if (group === 'Accessories') {
      // Accessories → start unselected
      return {
        quetion,
        answer: no,
        key: 'no',
        group,
        selected: createDefaultSelected(options.length, false),
      }
    }

    if (group === 'Warranty') {
      // Warranty → select "out of warranty"
      const outOfWarrantyIndex = options.findIndex((option) =>
        option.caption.toLowerCase().includes('out of warranty'),
      )
      const selected = createDefaultSelected(options.length, false)
      if (outOfWarrantyIndex !== -1) {
        selected[outOfWarrantyIndex] = true
      }
      return { quetion, answer, key: 'yes', group, selected }
    }

    // Default for other groups
    return {
      quetion,
      answer,
      key: 'yes',
      group,
      selected: createDefaultSelected(options.length, true),
    }
  }

  // Case 3: default answer equals no
  return {
    quetion,
    answer,
    group,
    key: 'no',
    selected: createDefaultSelected(options.length, false),
  }
}

const NewDeviceqs = () => {
  const userToken = sessionStorage.getItem('authToken')
  const DeviceType = sessionStorage.getItem('DeviceType')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { answers, setAnswers } = useQuestionContext()
  const [visible, setVisible] = useState(1)
  const [newGroupanswers, setNewGroupAnswers] = useState()
  const profile = useUserProfile()
  const qna = useSelector((state) => state.qna)
  const [showPopup, setShowPopup] = useState(true)
  const [NDstate, dispatch] = useReducer(qnaReducer, initialState)

  const fetchData = async () => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/questionnaires/findAll?page=0&limit=99&type=${DeviceType}`

      const response = await axios.get(apiUrl, {
        headers: { authorization: `${userToken}` },
      })

      // Sort by viewOn
      const sortedData = response.data.data.sort((a, b) => a.viewOn - b.viewOn)

      GROUPS.forEach((group) => {
        const answersTemp = sortedData.filter((q) => getGroupKey(q.groupName) === group)
        dispatch({ type: 'SET_GROUP_ANSWERS', group, answers: answersTemp })
        store.dispatch(setRawQuestions({ group, questions: answersTemp }))
      })

      if (answers.length === 0) {
        const newAnswers = sortedData
          .filter((q) => getGroupKey(q.groupName) !== null)
          .map((q) => createAnswer(q, q.default))

        setAnswers(newAnswers)
        setNewGroupAnswers(newAnswers)

        GROUPS.forEach((group) => {
          const answersTemp = newAnswers.filter((q) => q.group === group)
          store.dispatch(setGroupAnswers({ group, answers: answersTemp }))
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [visible])

  const updateAns = (group) => {
    const filteredAnswers = newGroupanswers.filter(
      (question) => question.group === group,
    )
    store.dispatch(setGroupAnswers({ group, filteredAnswers }))
    if (showPopup === false) {
      setVisible(visible + 1)
    }
  }

  // Build parts dynamically from whatever groups the API returned with data.
  // GROUPS order controls the display order.
  // Accessories and Warranty keep their special components; everything else uses GenericPart.
  // Components are memoized by groupKey so they are stable across renders.
  const availableParts = useMemo(() =>
    GROUPS
      .filter((groupKey) => NDstate[groupKey] && NDstate[groupKey].length > 0)
      .map((groupKey) => {
        if (groupKey === 'Accessories') {
          return { component: SeventhPart, data: NDstate[groupKey], slice: qna[groupKey], groupKey }
        }
        if (groupKey === 'Warranty') {
          return { component: EighthPart, data: NDstate[groupKey], slice: qna[groupKey], groupKey }
        }
        const toggleMode = groupKey === 'Functional'
        const PartComponent = (props) => (
          <GenericPart {...props} groupKey={groupKey} toggleMode={toggleMode} />
        )
        return { component: PartComponent, data: NDstate[groupKey], slice: qna[groupKey], groupKey }
      }),
  [NDstate, qna])

  return (
    <>
      <div className={`popup ${showPopup ? 'show' : ''}`}>
        <img className='object-contain' src={banner} alt='banner' />
        <div className='text'>
          Help us calculate your device value correctly by answering to the
          following questions
        </div>
        <button onClick={() => setShowPopup(false)}> Got it</button>
      </div>
      <MainQContainer
        NDstate={NDstate}
        setIsSearchOpen={setIsSearchOpen}
        isSearchOpen={isSearchOpen}
        dispatch={dispatch}
        visible={visible}
        availableParts={availableParts}
        setVisible={setVisible}
        updateAns={updateAns}
        showPopup={showPopup}
        qna={qna}
        profile={profile}
        styless={styless}
      />
    </>
  )
}
export default NewDeviceqs
