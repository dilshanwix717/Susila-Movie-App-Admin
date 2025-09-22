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
  CFormCheck,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { db, storage } from '../../../firebase'
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
  listAll,
} from 'firebase/storage'
// import thumbnailImage from "../../../assets/images/thumbnail.png"

const Series = () => {
  const storage = getStorage() //define storage
  const [myData, setMyData] = useState([])
  const [title, setTitle] = useState('')
  const [order, setOrder] = useState(0)
  const [description, setDescription] = useState('')
  const [trailer, setTrailer] = useState('')
  const [thumbnail_url, setThumbnail_url] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [subcategoryData, setSubcategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const CollectionRef = collection(db, 'series')
  const [visible, setVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [subcategory, setSubcategory] = useState()
  const [editId, setEditId] = useState()
  const [progress, setProgress] = useState(0)
  const [episodes, setEpisodes] = useState()
  const [hide, setHide] = useState(false)
  const [displayFeaturedContent, setDisplayFeaturedContent] = useState('')
  const [featuredContent, setFeaturedContent] = useState(false)
  const [contentProvider, setContentProvider] = useState('')
  const [contentProviderData, setContentProviderData] = useState([])
  const [contentProviderTitle, setContentProviderTitle] = useState('')
  const [uploadNow, setUploadNow] = useState(false)

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getSeries()
    getSubcategory()
    getContentProvider()
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
  const getSeries = async () => {
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

  const getSubcategory = async () => {
    let q = query(collection(db, 'subcategory'))
    q = query(q, where('category', '==', 'Teledrama'))
    const data = await getDocs(q).then(function (data) {
      setSubcategoryData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  // firebase get contentProvider
  const getContentProvider = async () => {
    let q = query(collection(db, 'contentProvider'))
    const data = await getDocs(q).then(function (data) {
      setContentProviderData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  // firebase - store data into firebase collection
  const uploadMedia = async (e) => {
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
    // const storageRef = ref(storage, `series_thumbnail/${file.name}`)
    const storageRef = ref(storage, `series_thumbnail`)
    const listResult = await listAll(storageRef)

    const fileExists = listResult.items.some((item) => item.name === file.name)

    if (fileExists) {
      alert('A file with the same name already exists.')
      return
    }

    // const uploadTask = uploadBytesResumable(storageRef, file)
    const uploadTask = uploadBytesResumable(ref(storage, `series_thumbnail/${file.name}`), file)

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
      })
  }

  // firebase - store data into firebase collection
  const storeData = async (url) => {
    if (featuredContent === true && displayFeaturedContent === '') {
      return alert('please choose featured content display option')
    }
    if (!subcategory) {
      return alert('please select valid subcategory')
    }
    setLoading(true)
    const ref = doc(CollectionRef)
    const docData = {
      id: ref.id,
      createAt: Timestamp.fromDate(new Date()),
      thumbnail_url: url,
      trailer: trailer,
      subcategory: contentProviderTitle,
      contentProvider: contentProvider,
      order: validOrder(),
      title: title,
      description: description,
      favourite_user: [],
      episodes: Number(episodes),
      hide: hide,
      featuredContent: featuredContent,
      displayFeaturedContent: displayFeaturedContent,
    }
    await setDoc(ref, docData).then(() => {
      setVisible(false)
      setProgress(0)
      setSelectedImage(null)
      setHide(false)
      setFeaturedContent(false)
      setDisplayFeaturedContent('')
      setDescription('')
      getSeries()
    })
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  const changeCheckboxForFeaturedContent = (value) => {
    setFeaturedContent(value)
  }

  const changeCheckboxForHide = (value) => {
    setHide(value)
  }

  // firebase update function
  const update = async (url) => {
    if (featuredContent === true && displayFeaturedContent === '') {
      return alert('please choose featured content display option')
    }
    setLoading(true)
    await updateDoc(doc(db, 'series', editId), {
      subcategory: subcategory,
      contentProvider: contentProvider,
      order: validOrder(),
      thumbnail_url: url,
      title: title,
      description: description,
      trailer: trailer,
      episodes: Number(episodes),
      hide: hide,
      featuredContent: featuredContent,
      displayFeaturedContent: displayFeaturedContent,
    }).then(() => {
      setHide(false)
      setFeaturedContent(false)
      setDisplayFeaturedContent('')
      setEditVisible(false)
      setSelectedImage(null)
      setProgress(0)
      getSeries()
      console.log('Print subcategory ===>', subcategory)
    })
  }

  // firebase get data for edit function
  const edit = async (id) => {
    setEditVisible(true)
    const docRef = doc(db, 'series', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let {
        subcategory,
        contentProvider,
        contentProviderTitle,
        order,
        title,
        description,
        episodes,
        trailer,
        thumbnail_url,
        hide,
        featuredContent,
        displayFeaturedContent,
      } = docSnap.data()
      setSubcategory(subcategory)
      setContentProvider(contentProvider)
      setContentProviderTitle(contentProviderTitle)
      setOrder(order)
      setThumbnail_url(thumbnail_url)
      setTitle(title)
      setHide(hide)
      setFeaturedContent(featuredContent)
      setDisplayFeaturedContent(displayFeaturedContent)
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

    deleteDoc(doc(db, 'series', editId)).then(() => {
      setEditVisible(false)
      getSeries()
    })
  }

  const handleClose = () => {
    setContentProvider('')
    setVisible(false)
    setSelectedImage(null)
    setHide(false)
    setFeaturedContent(false)
    setDisplayFeaturedContent('')
    setEditVisible(false)
  }

  function teledramaSubcategory(providerTitle) {
    subcategoryData.forEach((element) => {
      console.log('Print element :', element)
      if (element.name === providerTitle) {
        setSubcategory(element.name)
      }
    })
  }
  const handleAddNew = () => {
    setContentProvider('')
    setVisible(!visible)
  }
  if (loading) {
    return <Loading />
  }

  return (
    <>
      <CButton sm={8} onClick={handleAddNew}>
        Add New
      </CButton>
      {/* CREATE */}
      <CModal alignment="center" visible={visible} onClose={() => handleClose()}>
        <CModalHeader>
          <CModalTitle>CREATE Teledrama</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              Content Provider
            </CFormLabel>
            <CCol md={8} className="position-relative">
              <CInputGroup className="mb-1">
                <CFormSelect
                  id="validationTooltip04"
                  name="series"
                  onChange={(e) => {
                    setContentProvider(e.target.value)
                    setSubcategory(e.target.value)
                    setContentProviderTitle(e.target.options[e.target.selectedIndex].text)
                    teledramaSubcategory(e.target.options[e.target.selectedIndex].text)
                    console.log('Content provider subcategory ==>', subcategory)
                  }}
                  value={contentProvider}
                >
                  <option value="">Choose..</option>
                  {contentProviderData.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    )
                  })}
                </CFormSelect>
              </CInputGroup>
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
              Drama Title
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
          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Trailer URL
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="text" onChange={(e) => setTrailer(e.target.value)} />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={4} className="position-relative">
              <CFormCheck
                id="flexCheckChecked"
                checked={hide}
                onChange={(e) => changeCheckboxForHide(e.target.checked)}
                label="Hide"
              />
              <br />
            </CCol>
            <CCol md={5} className="position-relative">
              <CFormCheck
                id="flexCheckChecked"
                label="Featured Content"
                checked={featuredContent}
                onChange={(e) => changeCheckboxForFeaturedContent(e.target.checked)}
              />
              {featuredContent == true ? (
                <>
                  {/*<CFormLabel>Select Featured Content</CFormLabel>*/}
                  <CFormSelect onChange={(e) => setDisplayFeaturedContent(e.target.value)}>
                    <option value="">Choose...</option>
                    <option value="homeUI"> Home UI</option>
                    <option value="Tele-series"> Tele-series </option>
                  </CFormSelect>
                  <br />
                </>
              ) : null}
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
          <CModalTitle>UPDATE Teledrama</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              Content Provider
            </CFormLabel>
            <CCol md={8} className="position-relative">
              <CInputGroup className="mb-1">
                <CFormSelect
                  id="validationTooltip04"
                  name="series"
                  onChange={(e) => {
                    setContentProvider(e.target.value)
                    setSubcategory(e.target.value)
                    setContentProviderTitle(e.target.options[e.target.selectedIndex].text)
                    teledramaSubcategory(e.target.options[e.target.selectedIndex].text)
                    console.log('testing content provider sub:', subcategory)
                  }}
                  value={contentProvider}
                >
                  <option value="">Choose..</option>
                  {contentProviderData.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    )
                  })}
                </CFormSelect>
              </CInputGroup>
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
              Drama Title
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

          <CRow className="mb-3">
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
          </CRow>
          <CRow>
            <CCol md={4} className="position-relative">
              {/*<CFormLabel htmlFor="validationTooltip04">Visibility</CFormLabel>*/}

              <CFormCheck
                id="flexCheckChecked"
                checked={hide}
                onChange={(e) => setHide(e.target.checked)}
                label="Hide"
              />
              <br />
            </CCol>
            <CCol md={5} className="position-relative">
              <CFormCheck
                id="flexCheckChecked"
                label="Featured"
                checked={featuredContent}
                onChange={(e) => changeCheckboxForFeaturedContent(e.target.checked)}
              />
              {featuredContent == true ? (
                <>
                  {/*<CFormLabel>Select Featured Content</CFormLabel>*/}
                  <CFormSelect
                    onChange={(e) => setDisplayFeaturedContent(e.target.value)}
                    value={displayFeaturedContent}
                  >
                    <option value="">Choose...</option>
                    <option value="homeUI"> Home UI</option>
                    <option value="Tele-series"> Tele-series </option>
                  </CFormSelect>
                </>
              ) : null}
            </CCol>
          </CRow>
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
            <CTableHeaderCell scope="col">SERIES TITLE</CTableHeaderCell>
            <CTableHeaderCell scope="col">ORDER</CTableHeaderCell>
            <CTableHeaderCell scope="col">SUBCATEGORY</CTableHeaderCell>
            <CTableHeaderCell scope="col">FEATURED</CTableHeaderCell>
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
                <CTableDataCell>{data.featuredContent ? 'Yes' : 'No'}</CTableDataCell>

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
            <h2>Teledrama LIST</h2>
          </CCardHeader>
          <CCardBody>{Series()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
