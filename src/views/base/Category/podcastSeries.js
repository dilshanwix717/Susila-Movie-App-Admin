import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CCardHeader,
  CCard,
  CCardBody,
  CProgressBar,
  CProgress,
  CInputGroup,
  CFormTextarea,
  CBadge,
  CImage,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  where,
  query,
  orderBy,
  doc,
  setDoc,
  Timestamp,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import Loading from 'src/components/loading/Loading'
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  getStorage,
} from 'firebase/storage'

const PodcastSeries = () => {
  const storage = getStorage() //define storage
  const [myData, setMyData] = useState([])
  const [title, setTitle] = useState('')
  const [order, setOrder] = useState(0)
  const [description, setDescription] = useState('')
  const [trailer, setTrailer] = useState('')
  const [thumbnail_url, setThumbnail_url] = useState('')
  const [audio_url, setAudio_url] = useState('')
  const [selectedImage, setSelectedImage] = useState()
  const [selectedAudio, setSelectedAudio] = useState()
  const [subcategoryData, setSubcategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const CollectionRef = collection(db, 'podcastSeries')
  const [visible, setVisible] = useState(false)
  const [visibleAudio, setVisibleAudio] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [subcategory, setSubcategory] = useState()
  const [editId, setEditId] = useState()
  const [progress, setProgress] = useState(0)
  const [episodes, setEpisodes] = useState()
  const [uploadNow, setUploadNow] = useState(false)

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getPodcastSeries()
    getPodcastSubcategory()
  }, [])

  const validOrder = () => {
    let modifiedValue
    if (order <= 9) {
      modifiedValue = `0${order.replace(/^0+/, '')}`
    } else {
      modifiedValue = order.toString(8)
    }
    return modifiedValue
  }

  // FIREBASE - GET USER FROM FIRESTORE
  const getPodcastSeries = async () => {
    setLoading(true)
    let q = query(CollectionRef, orderBy('createAt', 'desc'))
    const data = await getDocs(q).then(function (data) {
      setMyData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
      setLoading(false)
    })
  }

  const getPodcastSubcategory = async () => {
    let q = query(collection(db, 'subcategory'))
    q = query(q, where('category', '==', 'Podcast'))
    const data = await getDocs(q).then(function (data) {
      setSubcategoryData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  // firebase - store data into firebase collection
  const uploadMedia = (e) => {
    setUploadNow(true)
    e.preventDefault()
    const file = e.target[0]?.files[0]

    // // when update if no change in thumbnail
    if (!file && editVisible) {
      // console.log('psh')
      update(thumbnail_url)
      setUploadNow(false)
    }

    if (!file) return
    const storageRef = ref(storage, `series_thumbnail/${file.name}`)
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
          if (editVisible) {
            // if update delete old media/image
            deleteMedia(downloadURL)
            setUploadNow(false)
          } else {
            // store new data
            storeData(downloadURL)
            setUploadNow(false)
          }
        })
      },
    )
  }

  const deleteMedia = async (newUrl) => {
    const httpsReference = ref(storage, thumbnail_url) //get thumbnail url from state
    const desertRef = ref(storage, `series_thumbnail/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        // console.log('success')
        update(newUrl)
      })
      .catch((error) => {
        console.log('error', error)
        update(newUrl)
        // Uh-oh, an error occurred!
      })
  }

  // firebase - store data into firebase collection
  const storeData = async (url) => {
    setLoading(true)
    const ref = doc(CollectionRef)
    const docData = {
      id: ref.id,
      createAt: Timestamp.fromDate(new Date()),
      thumbnail_url: url,
      trailer: trailer,
      subcategory: subcategory,
      order: validOrder(),
      title: title,
      description: description,
      favourite_user: [],
      episodes: Number(episodes),
    }
    await setDoc(ref, docData).then(() => {
      setVisible(false)
      setProgress(0)
      setSelectedImage(null)
      getPodcastSeries()
    })
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  // firebase update function
  const update = async (url) => {
    setLoading(true)
    await updateDoc(doc(db, 'podcastSeries', editId), {
      subcategory: subcategory,
      order: validOrder(),
      thumbnail_url: url,
      title: title,
      description: description,
      trailer: trailer,
      episodes: Number(episodes),
    }).then(() => {
      setEditVisible(false)
      setSelectedImage(null)
      setProgress(0)
      getPodcastSeries()
    })
  }

  // firebase get data for edit function
  const edit = async (id) => {
    setEditVisible(true)
    const docRef = doc(db, 'podcastSeries', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let { subcategory, order, title, description, episodes, trailer, thumbnail_url } =
        docSnap.data()
      setSubcategory(subcategory)
      setOrder(order)
      setThumbnail_url(thumbnail_url)
      setTitle(title)
      setTrailer(trailer)
      setDescription(description)
      setEditId(id)
      setEpisodes(episodes)
    }
  }

  // firebase delete function
  const Delete = async () => {
    const httpsReference = ref(storage, thumbnail_url) //get thumbnail url from state
    const desertRef = ref(storage, `series_thumbnail/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        // console.log('success')
      })
      .catch((error) => {
        // console.log('error', error)
      })

    deleteDoc(doc(db, 'podcastSeries', editId)).then(() => {
      setEditVisible(false)
      getPodcastSeries()
    })
  }

  const handleClose = () => {
    setVisible(false)
    setSelectedImage(null)
    setEditVisible(false)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <CButton sm={8} onClick={() => setVisible(!visible)}>
        Add New
      </CButton>
      {/* CREATE */}
      <CModal alignment="center" visible={visible} onClose={() => handleClose()}>
        <CModalHeader>
          <CModalTitle>CREATE PODCAST</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              Podcast category
            </CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                id="validationTooltip04"
                onChange={(e) => setSubcategory(e.target.value)}
                required
              >
                <option defaultValue="">Choose...</option>
                {subcategoryData.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  )
                })}
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Episodes
              </CFormLabel>
            </CCol>
            <CCol sm={8}>
              <CFormInput type="text" onChange={(e) => setEpisodes(e.target.value)} />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Order
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="number" onChange={(e) => setOrder(e.target.value)} />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Podcast Title
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="text" onChange={(e) => setTitle(e.target.value)} />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Description
            </CFormLabel>
            <CCol sm={8}>
              <CFormTextarea type="text" onChange={(e) => setDescription(e.target.value)} />
            </CCol>
          </CRow>
          {selectedImage ? (
            <CRow className="mb-3">
              <CImage align="center" rounded src={selectedImage} />
            </CRow>
          ) : null}

          <form onSubmit={uploadMedia}>
            <CRow className="mb-2">
              <CCol md={12} className="position-relative">
                <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                  Thumbnail
                </CFormLabel>
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="file"
                    id="inputGroupFile04"
                    aria-describedby="inputGroupFileAddon04"
                    aria-label="upload"
                    name="MasterImage"
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
            {uploadNow == false ? (
              <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                Upload now
              </CButton>
            ) : null}
          </form>
        </CModalBody>
      </CModal>

      {/* UPDATE*/}
      <CModal alignment="center" visible={editVisible} onClose={() => handleClose()}>
        <CModalHeader>
          <CModalTitle>UPDATE Podcast</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              Podcast category
            </CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                id="validationTooltip04"
                onChange={(e) => setSubcategory(e.target.value)}
                required
                value={subcategory}
              >
                <option defaultValue="">Choose...</option>
                {subcategoryData.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  )
                })}
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Episodes
              </CFormLabel>
            </CCol>
            <CCol sm={8}>
              <CFormInput
                type="text"
                value={episodes}
                onChange={(e) => setEpisodes(e.target.value)}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Order
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Podcast Series Title
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Description
            </CFormLabel>
            <CCol sm={8}>
              <CFormTextarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </CCol>
          </CRow>

          {/* <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Trailer
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="text"
                value={trailer}
                onChange={(e) => setTrailer(e.target.value)}
              />
            </CCol>
          </CRow> */}

          {selectedImage ? (
            <CRow className="mb-3">
              <CImage align="center" rounded src={selectedImage} />
            </CRow>
          ) : (
            <CRow className="mb-3">
              <CImage align="center" rounded src={thumbnail_url} />
            </CRow>
          )}

          <form onSubmit={uploadMedia}>
            <CRow className="mb-2">
              <CCol md={12} className="position-relative">
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="file"
                    id="inputGroupFile04"
                    aria-describedby="inputGroupFileAddon04"
                    aria-label="upload"
                    name="MasterImage"
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

            <div className="row justify-content-md-center">
              <CCol xs lg={9}>
                <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                  UPDATE
                </CButton>
              </CCol>

              <CCol>
                <CButton color="danger" onClick={() => Delete()}>
                  DELETE
                </CButton>
              </CCol>
            </div>
          </form>
        </CModalBody>
      </CModal>

      {/* react - Table sub categories list */}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">THUMBNAIL</CTableHeaderCell>
            <CTableHeaderCell scope="col">PODCAST SERIES TITLE</CTableHeaderCell>
            <CTableHeaderCell scope="col">Order</CTableHeaderCell>
            <CTableHeaderCell scope="col">SUBCATEGORY</CTableHeaderCell>
            <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData.map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>
                  <img width={100} src={data.thumbnail_url} />
                </CTableDataCell>
                <CTableDataCell>{data.title}</CTableDataCell>
                <CTableDataCell>{data.order}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color="success">{data.subcategory}</CBadge>
                </CTableDataCell>

                <CTableDataCell>
                  <CButton
                    color="success"
                    className="me-md-4"
                    active
                    tabIndex={-1}
                    onClick={() => edit(data.id)}
                  >
                    Edit
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            )
          })}
        </CTableBody>
      </CTable>
    </>
  )
}

const Index = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>PODCAST LIST</h2>
          </CCardHeader>
          <CCardBody>{PodcastSeries()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
