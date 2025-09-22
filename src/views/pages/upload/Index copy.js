import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CRow,
  CProgress,
  CProgressBar,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CContainer,
  CBadge,
  CHeaderDivider,
  CFormCheck,
} from '@coreui/react'
import { db, storage } from '../../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { collection, doc, getDocs, query, setDoc, Timestamp } from 'firebase/firestore'
import './Index.css'
import ScreenLoading from 'src/components/loading/Loading'
import thumbnailImage from '../../assets/images/thumbnail.png'
import ccImage from '../../assets/images/caption.png'
import noCC from '../../assets/images/subtitles.png'
import { useNavigate } from 'react-router-dom'

const ContentData = (thumbnail, subtitle) => {
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [title, setTitle] = useState('')
  const [season, setSeason] = useState(0)
  const [episode, setEpisode] = useState(0)
  const [description, setDescription] = useState('')
  const [premium, setPremium] = useState(false)
  const [tags, setTags] = useState([])
  const [series, setSeriesData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [subcategoryData, setSubcategoryData] = useState([])
  const [qualityObj, setQualityObj] = useState({ '360p': '', '540p': '', '720p': '', '1080p': '' })

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

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    StoreData()
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

  const validSeason = () => {
    let modifiedValue
    if (season <= 9) {
      modifiedValue = `0${season}`
    } else {
      modifiedValue = season
    }
    return modifiedValue
  }

  const validEpisode = () => {
    let modifiedValue
    if (episode <= 9) {
      modifiedValue = `0${episode}`
    } else {
      modifiedValue = episode
    }
    return modifiedValue
  }

  const incrementCount = (state) => {
    if (state == 'season') {
      let value = parseInt(season) + 1
      setSeason(value)
    }

    if (state == 'episode') {
      let value = parseInt(episode) + 1
      setEpisode(value)
    }
  }
  const decrementCount = (state) => {
    if (state == 'season') {
      let value = parseInt(season) - 1
      setSeason(value)
    }

    if (state == 'episode') {
      let value = parseInt(episode) - 1
      setEpisode(value)
    }
  }

  // firebase  - store data into firebase collection
  const StoreData = async () => {
    let tagsChar = TagForSearch()
    const ref = doc(collection(db, 'content'))

    if (category == 'TELESERIES') {
      if (
        qualityObj['360p'] == '' &&
        qualityObj['540p'] == '' &&
        qualityObj['720p'] == '' &&
        qualityObj['1080p'] == ''
      ) {
        return alert('please paste video url')
      }

      if (category == '') {
        return alert('please select category')
      }

      if (title == '') {
        return alert('please input title')
      }

      if (parseInt(season) <= 0) {
        return alert('please select season')
      }

      if (parseInt(episode) <= 0) {
        return alert('please select episode')
      }

      if (description == '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      if (tags.length == 0) {
        return alert('please input tag word for video')
      } else {
        setLoading(true)
        const docData = {
          id: ref.id,
          createAt: Timestamp.fromDate(new Date()),
          category: category,
          subcategory: subcategory,
          title: title,
          season: validSeason(),
          episode: validEpisode(),
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
      }
    } else {
      if (
        qualityObj['360p'] == '' &&
        qualityObj['540p'] == '' &&
        qualityObj['720p'] == '' &&
        qualityObj['1080p'] == ''
      ) {
        return alert('please upload video')
      }

      if (category == '') {
        return alert('please select category')
      }

      if (title == '') {
        return alert('please input title')
      }

      if (description == '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      if (tags.length == 0) {
        return alert('please input tag word for video')
      } else {
        setLoading(true)
        const docData = {
          id: ref.id,
          createAt: Timestamp.fromDate(new Date()),
          category: category,
          subcategory: subcategory,
          title: title,
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
      }
    }
  }

  const reset = () => {
    setValidated(false)
    setLoading(false)
    setCategory('')
    setSubcategory('')
    setTitle('')
    setSeason('')
    setEpisode('')
    setDescription('')
    setPremium(false)
    setTags([])
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

  if (loading) {
    return <ScreenLoading />
  }

  return (
    <CForm
      className="row g-3 needs-validation form"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
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
            if (item.category == category) {
              return (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              )
            }
          })}
        </CFormSelect>
      </CCol>
      {category == 'TELESERIES' ? (
        <>
          {/* mui name */}
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">
              {category == 'TELESERIES' ? `Series Name` : `Title`}
            </CFormLabel>
            <CFormSelect
              onChange={(e) => setTitle(e.target.value)}
              id="validationTooltip04"
              required
            >
              <option value="">Choose...</option>
              {series.map((item) => {
                if (item.subcategory == subcategory) {
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
          {/* mui season */}
          <CCol md={4} className="position-relative">
            <CFormLabel>Season</CFormLabel>

            <div className="number-button">
              <div className="button" onClick={() => decrementCount('season')}>
                -
              </div>

              <CCol md={3} className="position-relative">
                <CFormInput onChange={(e) => setSeason(e.target.value)} required value={season} />
              </CCol>

              <div className="button" onClick={() => incrementCount('season')}>
                +
              </div>
            </div>
          </CCol>
          {/* mui episode */}
          <CCol md={4} className="position-relative">
            <CFormLabel>Episode</CFormLabel>
            <div className="number-button">
              <div className="button" onClick={() => decrementCount('episode')}>
                -
              </div>

              <CCol md={3} className="position-relative">
                <CFormInput onChange={(e) => setEpisode(e.target.value)} required value={episode} />
              </CCol>

              <div className="button" onClick={() => incrementCount('episode')}>
                +
              </div>
            </div>
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
  )
}

// react upload video component
const UploadMedia = () => {
  const [progress, setProgress] = useState(0)
  const [thumbnail, setThumbnail] = useState()
  const [subtitle, setSubtitle] = useState('')
  const [visible, setVisible] = useState(false)
  const [visibleSubtitle, setVisibleSubtitle] = useState(false)

  // react - upload media contents
  const handleUpload = (e) => {
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

  return (
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
              onClick={() => setVisibleSubtitle(true)}
              width={80}
              className="rounded"
              src={subtitle != '' ? ccImage : noCC}
              alt=""
            />
            {subtitle != '' ? (
              <CBadge color="success">CC UPLOADED</CBadge>
            ) : (
              <CBadge color="warning">CC Empty</CBadge>
            )}
          </CCol>
        </CRow>
      </CContainer>

      {/* css modal for add */}
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>THUMBNAIL</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleUpload}>
            <CRow className="mb-2">
              <CCol md={12} className="position-relative">
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="file"
                    id="inputGroupFile04"
                    aria-describedby="inputGroupFileAddon04"
                    aria-label="upload"
                    accept=".webp"
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

      {/* css modal for add */}
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

      <CCardBody>{ContentData(thumbnail, subtitle)}</CCardBody>
    </div>
  )
}

const Index = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>CONTENT UPLOAD3</h3>
          </CCardHeader>
          <CCardBody>{UploadMedia()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
