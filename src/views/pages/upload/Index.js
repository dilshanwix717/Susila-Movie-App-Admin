import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CFormFeedback, CFormLabel, CFormSelect, CFormTextarea, CInputGroup, CRow, CProgress, CProgressBar, CModal, CModalBody, CModalHeader, CModalTitle, CContainer, CBadge, CHeaderDivider, CFormCheck, CImage } from '@coreui/react';
import { db, storage } from '../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { collection, doc, getDocs, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import './Index.css';
import ScreenLoading from 'src/components/loading/Loading';
import thumbnailImage from '../../assets/images/thumbnail.png';
import ccImage from '../../assets/images/caption.png';
import noCC from '../../assets/images/subtitles.png';


const ContentData = () => {
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [language, setLanguage] = useState('')
  const [title, setTitle] = useState('')
  const [season, setSeason] = useState(0)
  const [episode, setEpisode] = useState(1)
  const [description, setDescription] = useState('')
  const [premium, setPremium] = useState(false)
  const [tags, setTags] = useState([])
  const [series, setSeriesData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [subcategoryData, setSubcategoryData] = useState([])
  const [qualityObj, setQualityObj] = useState({ '360p': '', '540p': '', '720p': '', '1080p': '' })
  const [selectedImage, setSelectedImage] = useState()
  const [seasonsNumber, setSeasonsNumber] = useState(1)
  const [nextSeason, setNextSeason] = useState('i')
  const [numberOfEpisodes, setNumberOfEpisodes] = useState(0)
  const [nextEpisode, setNextEpisode] = useState('i')

  // uploads
  const [progress, setProgress] = useState(0)
  const [thumbnail, setThumbnail] = useState()
  const [subtitle, setSubtitle] = useState('')
  const [visible, setVisible] = useState(false)
  const [visibleSubtitle, setVisibleSubtitle] = useState(false)

  // firebase get super category
  const getSeries = async () => {
    let q = query(collection(db, 'series'))
    const data = await getDocs(q).then(function (data) {
      setSeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  const setSeriesNextSeasonAndEpisode = async () => {
    let seasonsQuery = query(collection(db, 'content'))
    let seriesQuery = query(collection(db, 'series'))
    seriesQuery = query(seriesQuery, where('title', '==', title))
    seasonsQuery = query(seasonsQuery, where('title', '==', title))

    await getDocs(seriesQuery).then(async function (data) {
      const newData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      console.log(newData)
      setNumberOfEpisodes(newData[0].episodes)
      await getDocs(seasonsQuery).then(async function (data2) {
        const newData2 = data2.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        console.log(newData2)
        let currentSeason = 0
        let modifiedSeason = ''
        let modifiedEpisode = ''
        let currentEpisode = 0
        let numberOfEpisodes = newData[0].episodes

        if (newData2.length === 0) {
          console.log('inside of the newdata 2 length 0')
          setSeasonsNumber(1)
          setEpisode(1)
          await StoreData(1, 1)
        } else {
          for (const el of newData2.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))) {
            console.log('====>>>', el)

            if (parseInt(el.episode) < numberOfEpisodes) {
              currentEpisode = parseInt(el.episode)
              currentSeason = parseInt(el.season)
              modifiedEpisode = currentEpisode + 1
              setEpisode(modifiedEpisode)
              console.log('episode mod if ==', modifiedEpisode)
              console.log('number of episodes ==', newData[0].episodes)

              modifiedSeason = currentSeason
              setSeasonsNumber(modifiedSeason)
              console.log('season mod else ==', modifiedSeason)
              console.log('number of episodes ==', numberOfEpisodes)
            } else if (parseInt(el.episode) === numberOfEpisodes) {
              currentEpisode = parseInt(el.episode)
              currentSeason = parseInt(el.season)
              modifiedEpisode = currentEpisode + 1
              numberOfEpisodes = newData[0].episodes
              console.log('episode mod if ==', modifiedEpisode)
              modifiedSeason = currentSeason + 1
              numberOfEpisodes = modifiedSeason * numberOfEpisodes
              console.log('number of episodes ==', numberOfEpisodes)
              setSeasonsNumber(modifiedSeason)
              console.log('season mod if ==', modifiedSeason)
            } else {
              currentEpisode = parseInt(el.episode)
              currentSeason = parseInt(el.season)
              modifiedEpisode = currentEpisode + 1
              setEpisode(modifiedEpisode)
              console.log('episode mod if ==', modifiedEpisode)
              console.log('number of episodes ==', newData[0].episodes)

              modifiedSeason = currentSeason
              setSeasonsNumber(modifiedSeason)
              console.log('season mod if ==', modifiedSeason)
              console.log('number of episodes ==', numberOfEpisodes)
            }
          }
          await StoreData(modifiedSeason, modifiedEpisode)
        }
      })
    })
  }


  const setSeasonValue = (value) => {
    setSeasonsNumber(value)
  }

  const setEpisodeValue = (value) => {
    setEpisode(value)
  }

  const getCategory = async () => {
    let q = query(collection(db, 'category'))
    const data = await getDocs(q).then(function (data) {
      setCategoryData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  // firebase get sub category
  const getSubcategoryList = async () => {
    let q = query(collection(db, 'subcategory'))
    const data = await getDocs(q).then(function (data) {
      setSubcategoryData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  useEffect(() => {
    getSeries()
    getCategory()
    getSubcategoryList()
  }, [])

  const HandleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    if (category === 'Teledrama') {
      setSeriesNextSeasonAndEpisode()
    } else {
      StoreData(1, 1)
    }

    // StoreData()
  }

  //react image upload
  const handleThumbnailUpload = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return
    const storageRef = ref(storage, `thumbnail/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressData = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgress(progressData)
      },
      (error) => {
        alert(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setThumbnail(downloadURL)
          setProgress(0)
          setVisible(false)
        })
      },
    )
  }

  //react subtitle upload
  const handleUploadSubtitle = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return
    const storageRef = ref(storage, `subtitle/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressData = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgress(progressData)
      },
      (error) => {
        alert(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setSubtitle(downloadURL)
          setProgress(0)
          setVisibleSubtitle(false)
        })
      },
    )
  }

  const TagForSearch = () => {
    let array = []
    for (let i = 0; i < tags.length; i++) {
      for (let j = 1; j <= tags[i].length; j++) {
        array.push(tags[i].substring(0, j))
      }
    }
    return array
  }

  const validSeason = (season) => {
    console.log('inside of the validation season')
    let modifiedValue
    if (season <= 9) {
      modifiedValue = `0${season}`
      console.log('inside of the validation season if', season)
      setNextSeason(modifiedValue)
      console.log('inside of the validation season if modified', modifiedValue)
    } else {
      modifiedValue = `${season}`
      console.log('inside of the validation season else', modifiedValue)
      setNextSeason(modifiedValue)
    }
    return modifiedValue
  }

  const validEpisode = (episodeNum) => {
    console.log('inside of the validation episode')
    let modifiedValue
    if (episodeNum <= 9) {
      modifiedValue = `0${episodeNum}`
      console.log('inside of the validation episode if', episodeNum)
      setNextEpisode(modifiedValue)
      console.log('inside of the validation episode if modified', modifiedValue)
    } else {
      modifiedValue = `${episodeNum}`
      console.log('inside of the validation episode else', modifiedValue)
      setNextEpisode(modifiedValue)
    }
    return modifiedValue
  }

  // firebase  - store data into firebase collection
  const StoreData = async (season, episode) => {
    console.log('inside of the store data func')
    console.log('inside of the store data func season modified', season)
    console.log('inside of the store data func episode modified', episode)
    let tagsChar = TagForSearch()
    const ref = doc(collection(db, 'content'))

    if (category === 'Teledrama') {
      if (
        qualityObj['360p'] === '' &&
        qualityObj['540p'] === '' &&
        qualityObj['720p'] === '' &&
        qualityObj['1080p'] === ''
      ) {
        return alert('please paste video url')
      }

      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      // if (tags.length === 0) {
      //   return alert('please input tag word for video')
      // } else {
      setLoading(true)
      console.log('data ===> ', episode)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        subcategory: subcategory,
        title: title,
        lang: language,
        season: validSeason(season),
        episode: validEpisode(episode),
        premium: !premium,
        thumbnail_url: thumbnail,
        video_url: qualityObj,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        subTitle: subtitle,
      }
      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })
      // }
    } else {
      if (
        qualityObj['360p'] === '' &&
        qualityObj['540p'] === '' &&
        qualityObj['720p'] === '' &&
        qualityObj['1080p'] === ''
      ) {
        return alert('please upload video')
      }

      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      // if (tags.length === 0) {
      //   return alert('please input tag word for video')
      // } else {
      setLoading(true)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        subcategory: subcategory,
        title: title,
        lang: language,
        premium: !premium,
        thumbnail_url: thumbnail,
        video_url: qualityObj,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        subtitle: subtitle,
      }
      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })
      // }
    }
  }

  const reset = () => {
    setValidated(false)
    setLanguage('')
    setNextSeason('')
    setNextEpisode()
    setLoading(false)
    setCategory('')
    setSubcategory('')
    setTitle('')
    setSeason(0)
    setSeasonsNumber('')
    setEpisode(0)
    setDescription('')
    setPremium(false)
    setTags([])
    setThumbnail('')
    setSubtitle('')
    setSelectedImage(null)
    setQualityObj({
      '360p': '',
      '540p': '',
      '720p': '',
      '1080p': '',
    })
  }

  // js tag generate
  function handleKeyDown(e) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    e.stopPropagation()
    const value = e.target.value.toLowerCase()
    if (!value.trim()) return
    setTags([...tags, value])
    e.target.value = ''
  }

  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index))
  }

  function qualityArray(quality, url) {
    if (quality == '360p') {
      setQualityObj(() => {
        return { ...qualityObj, '360p': url }
      })
    }

    if (quality == '540p') {
      setQualityObj(() => {
        return { ...qualityObj, '540p': url }
      })
    }

    if (quality == '720p') {
      setQualityObj(() => {
        return { ...qualityObj, '720p': url }
      })
    }

    if (quality == '1080p') {
      setQualityObj(() => {
        return { ...qualityObj, '1080p': url }
      })
    }
  }

  const changeCheckbox = (value) => {
    setPremium(value)
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleClose = () => {
    setVisible(false)
    setSelectedImage(null)
  }

  if (loading) {
    return <ScreenLoading />
  }

  return (
    <>
      {/* mui category */}
      <CCol md={4} className="position-relative">
        <CFormLabel htmlFor="validationTooltip04"> Category</CFormLabel>

        <CFormSelect
          id="validationTooltip04"
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Choose...</option>
          {categoryData.map((item) => {
            return (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            )
          })}
        </CFormSelect>
        <CFormFeedback tooltip invalid>
          Please select Category.
        </CFormFeedback>
      </CCol>
      {/* mui subcategory */}
      <CCol md={4} className="position-relative">
        <CFormLabel>Subcategory</CFormLabel>
        <CFormSelect onChange={(e) => setSubcategory(e.target.value)}>
          <option value="">Choose...</option>
          {subcategoryData.map((item) => {
            if (item.category === category) {
              return (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              )
            }
          })}
        </CFormSelect>
      </CCol>

      {/* mui subcategory */}
      <CCol md={4} className="position-relative">
        <CFormLabel>Language</CFormLabel>
        <CFormSelect onChange={(e) => setLanguage(e.target.value)}>
          <option value="">Choose...</option>
          <option value="sinhala"> Sinhalese </option>
          <option value="tamil"> Tamil </option>
          <option value="english"> English </option>
        </CFormSelect>
      </CCol>

      {category == 'Teledrama' ? (
        <>
          {/* mui name */}
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">
              {category === 'Teledrama' ? `Series Name` : `Title`}
            </CFormLabel>
            <CFormSelect
              onChange={(e) => setTitle(e.target.value)}
              // onSelect={(e) => setSeriesNextSeasonAndEpisode()}
              id="validationTooltip04"
              required
            >
              <option value="">Choose...</option>
              {series.map((item) => {
                if (item.subcategory === subcategory) {
                  return (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  )
                }
              })}
            </CFormSelect>
            <CFormFeedback tooltip invalid>
              Please select title.
            </CFormFeedback>
          </CCol>
        </>
      ) : (
        <CCol md={4} className="position-relative">
          <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
          <CFormInput
            onChange={(e) => setTitle(e.target.value)}
            id="validationTooltip04"
            required
            type="text"
          />

          <CFormFeedback tooltip invalid>
            Please select title.
          </CFormFeedback>
        </CCol>
      )}

      <div>
        <CContainer>
          <CRow className="row justify-content-md-center">
            <CCol md={4}>
              <img
                onClick={() => setVisible(true)}
                width={200}
                className="rounded"
                src={thumbnail ? thumbnail : thumbnailImage}
                alt=""
              />
            </CCol>
          </CRow>

          <CRow>
            <CCol md={4}>
              <img
                onClick={() => setVisibleSubtitle(false)}
                width={80}
                className="rounded"
                src={subtitle !== '' ? ccImage : noCC}
                alt=""
              />
              {subtitle !== '' ? (
                <CBadge color="success">CC UPLOADED</CBadge>
              ) : (
                <CBadge color="warning">CC Empty</CBadge>
              )}
            </CCol>
          </CRow>
        </CContainer>

        {/* css modal for add */}
        <CModal alignment="center" visible={visible} onClose={() => handleClose()}>
          <CModalHeader>
            <CModalTitle>THUMBNAIL</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedImage ? (
              <CRow className="mb-3">
                <CImage align="center" rounded src={selectedImage} />
              </CRow>
            ) : null}

            <form onSubmit={handleThumbnailUpload}>
              <CRow className="mb-2">
                <CCol md={12} className="position-relative">
                  <CInputGroup className="mb-1">
                    <CFormInput
                      type="file"
                      id="inputGroupFile04"
                      aria-describedby="inputGroupFileAddon04"
                      aria-label="upload"
                      accept=".webp"
                      onChange={imageChange}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow className="mb-1">
                <CCol md={12} className="position-relative">
                  <CProgress className="mb-1">
                    <CProgressBar value={progress}>{progress}%</CProgressBar>
                  </CProgress>
                </CCol>
              </CRow>

              <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                Upload now
              </CButton>
            </form>
          </CModalBody>
        </CModal>

        {/* css modal for subtitle */}
        <CModal
          alignment="center"
          visible={visibleSubtitle}
          onClose={() => setVisibleSubtitle(false)}
        >
          <CModalHeader>
            <CModalTitle>SUBTITLE</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <form onSubmit={handleUploadSubtitle}>
              <CRow className="mb-2">
                <CCol md={12} className="position-relative">
                  <CInputGroup className="mb-1">
                    <CFormInput
                      type="file"
                      id="inputGroupFile04"
                      aria-describedby="inputGroupFileAddon04"
                      aria-label="upload"
                      accept=".vtt"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow className="mb-1">
                <CCol md={12} className="position-relative">
                  <CProgress className="mb-1">
                    <CProgressBar value={progress}>{progress}%</CProgressBar>
                  </CProgress>
                </CCol>
              </CRow>

              <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                Upload now
              </CButton>
            </form>
          </CModalBody>
        </CModal>
      </div>

      <CForm
        className="row g-3 needs-validation form"
        noValidate
        validated={validated}
        onSubmit={HandleSubmit}
      >
        {/* quality section */}
        <CCol md={2} className="position-relative">
          <CFormInput id="validationTooltip04" required disabled value="360p - LOW" />
        </CCol>

        <CCol md={10} className="position-relative">
          <CFormInput
            onChange={(e) => qualityArray('360p', e.target.value)}
            id="validationTooltip04"
            required
            type="url"
            value={qualityObj['360p']}
          />

          <CFormFeedback tooltip invalid>
            Please input URL.
          </CFormFeedback>
        </CCol>

        <CCol md={2} className="position-relative">
          <CFormInput id="validationTooltip04" required disabled value="540p - SD" />
        </CCol>

        <CCol md={10} className="position-relative">
          <CFormInput
            onChange={(e) => qualityArray('540p', e.target.value)}
            id="validationTooltip04"
            required
            type="url"
            value={qualityObj['540p']}
          />

          <CFormFeedback tooltip invalid>
            Please select URL.
          </CFormFeedback>
        </CCol>

        <CCol md={2} className="position-relative">
          <CFormInput id="validationTooltip04" required disabled value="720p - HD" />
        </CCol>

        <CCol md={10} className="position-relative">
          <CFormInput
            onChange={(e) => qualityArray('720p', e.target.value)}
            id="validationTooltip04"
            required
            type="url"
            value={qualityObj['720p']}
          />

          <CFormFeedback tooltip invalid>
            Please select URL.
          </CFormFeedback>
        </CCol>

        <CCol md={2} className="position-relative">
          <CFormInput id="validationTooltip04" required disabled value="1080p - FHD" />
        </CCol>

        <CCol md={10} className="position-relative">
          <CFormInput
            onChange={(e) => qualityArray('1080p', e.target.value)}
            id="validationTooltip04"
            required
            type="url"
            value={qualityObj['1080p']}
          />

          <CFormFeedback tooltip invalid>
            Please select URL.
          </CFormFeedback>
        </CCol>

        <br />
        <br />
        <br />
        <br />

        <CHeaderDivider />

        {/* mui Description */}
        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="exampleFormControlTextarea1">Description</CFormLabel>
          <CFormTextarea
            onChange={(e) => setDescription(e.target.value)}
            id="exampleFormControlTextarea1"
            rows="4"
            required
          ></CFormTextarea>
          <CFormFeedback tooltip invalid>
            Please input content description.
          </CFormFeedback>
        </CCol>
        {/* react tag words */}
        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="validationTooltip04">Keywords</CFormLabel>
          <div className="tags-input-container">
            {tags.map((tag, index) => (
              <div className="tag-item" key={index}>
                <span className="text">{tag}</span>
                <span className="close" onClick={() => removeTag(index)}>
                  &times;
                </span>
              </div>
            ))}
            <input
              onKeyDown={handleKeyDown}
              type="text"
              className="tags-input"
              placeholder="Type and enter"
            />
          </div>
        </CCol>

        {/* mui type */}
        <CCol md={4} className="position-relative">
          <CFormLabel htmlFor="validationTooltip04">Content Type</CFormLabel>

          <CFormCheck
            id="flexCheckChecked"
            label="Free"
            checked={premium}
            onChange={(e) => changeCheckbox(e.target.checked)}
          />
        </CCol>

        <CCol xs={12} className="position-relative">
          <CButton color="primary" type="submit">
            Upload Now
          </CButton>
        </CCol>
      </CForm>
    </>
  )
}

const Index = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>CONTENT UPLOAD</h3>
          </CCardHeader>
          <CCardBody>{ContentData()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
