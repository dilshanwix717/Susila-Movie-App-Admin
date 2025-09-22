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
  CModalFooter,
  CFormLabel,
  CFormInput,
  CRow,
  CCol,
  CCardHeader,
  CCard,
  CCardBody,
  CImage,
  CInputGroup,
  CProgress,
  CProgressBar,
  CContainer,
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
import thumbnailImage from '../../../assets/images/thumbnail.png'
import { deleteObject, getDownloadURL, listAll, ref, uploadBytesResumable } from 'firebase/storage'

const Shorts = () => {
  const [myData, setMyData] = useState([])
  const [loading, setLoading] = useState(true)
  const CollectionRef = collection(db, 'shorts')
  const [visible, setVisible] = useState(false)
  const [visibleForThumbnail, setVisibleForThumbnail] = useState(false)
  const [editVisibleForThumbnail, setEditVisibleForThumbnail] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [short_url, setShort_url] = useState()
  const [short_name, setShort_name] = useState()
  const [editId, setEditId] = useState()
  const [thumbnail, setThumbnail] = useState()
  const [progress, setProgress] = useState(0)
  const [selectedImage, setSelectedImage] = useState()

  // FIREBASE - GET USER FROM FIRESTORE
  const getShorts = async () => {
    setLoading(true)
    let q = query(CollectionRef)
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

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getShorts()
  }, [])

  //react image upload
  const handleThumbnailUpload = async (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return

    //const storageRef = ref(storage, `thumbnail/${file.name}`)
    const storageRef = ref(storage, `shorts_thumbnail`)
    const listResult = await listAll(storageRef)

    const fileExists = listResult.items.some((item) => item.name === file.name)

    if (fileExists) {
      alert('A file with the same name already exists.')
      return
    }
    if (thumbnail && thumbnail !== thumbnailImage) {
      const existingFileRef = ref(storage, thumbnail)
      await deleteObject(existingFileRef)
    }
    const uploadTask = uploadBytesResumable(ref(storage, `shorts_thumbnail/${file.name}`), file)

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
          setVisibleForThumbnail(false)
        })
      },
    )
  }

  // firebase - store data into firebase collection
  const StoreData = async () => {
    setLoading(true)
    const ref = doc(CollectionRef)
    if (!thumbnail) {
      return alert('please upload thumbnail image')
    }
    const docData = {
      id: ref.id,
      createAt: Timestamp.fromDate(new Date()),
      short_url: short_url,
      short_name: short_name,
      thumbnail_url: thumbnail,
    }
    await setDoc(ref, docData).then(() => {
      setThumbnail('')
      setSelectedImage(null)
      setVisible(false)
      getShorts()
    })
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleClose = () => {
    setVisibleForThumbnail(false)
    setSelectedImage(null)
  }

  // firebase get data for edit function
  const edit = async (id) => {
    setEditVisible(true)
    const docRef = doc(db, 'shorts', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let { short_url, short_name, thumbnail_url } = docSnap.data()
      setShort_url(short_url)
      setShort_name(short_name)
      setThumbnail(thumbnail_url)
      setEditId(id)
    }
  }

  // firebase update function
  const update = async () => {
    setLoading(true)
    await updateDoc(doc(db, 'shorts', editId), {
      short_url: short_url,
      short_name: short_name,
      thumbnail_url: thumbnail,
    }).then(() => {
      setEditVisible(false)
      getShorts()
    })
  }

  // // firebase delete function
  // const Delete = async () => {
  //   setLoading(true)
  //   await deleteDoc(doc(db, 'shorts', editId)).then(() => {
  //     setEditVisible(false)
  //     getShorts()
  //   })
  // }

  const Delete = async () => {
    const httpsReference = ref(storage, thumbnail) //get thumbnail url from state
    const desertRef = ref(storage, `shorts_thumbnail/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        // console.log('success')
      })
      .catch((error) => {
        // console.log('error', error)
      })

    deleteDoc(doc(db, 'shorts', editId)).then(() => {
      setEditVisible(false)
      getShorts()
    })
  }
  const removeThumbnailImage = async () => {
    const httpsReference = ref(storage, thumbnail) //get thumbnail url from state
    const desertRef = ref(storage, `shorts_thumbnail/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        setLoading(false)
        console.log('Image deleted successfully')
      })
      .catch((error) => {
        console.log('error', error)
        // setLoading(false)
        // history(-1)
      })
    setVisible(false)
  }

  const handleAddNew = async () => {
    setVisible(!visible)
    setThumbnail('')
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <CButton sm={8} onClick={handleAddNew}>
        Add New
      </CButton>
      {/* css modal for add */}
      <CModal alignment="center" visible={visible} onClose={removeThumbnailImage}>
        <CModalHeader>
          <CModalTitle>New Short Video</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="row justify-content-md-center">
            <CCol md={4}>
              <img
                onClick={() => setVisibleForThumbnail(true)}
                width={200}
                className="rounded"
                src={thumbnail ? thumbnail : thumbnailImage}
                alt=""
              />
            </CCol>
          </CRow>
          <br />
          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Short Title
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="text" onChange={(e) => setShort_name(e.target.value)} />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Short Link
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="text" onChange={(e) => setShort_url(e.target.value)} />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={removeThumbnailImage}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => StoreData()}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* css modal for add */}
      <CModal alignment="center" visible={visibleForThumbnail} onClose={() => handleClose()}>
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

      {/* css modal for edit */}
      <CModal alignment="center" visible={editVisible} onClose={() => setEditVisible(false)}>
        <CModalHeader>
          <CModalTitle>Update</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="row justify-content-md-center">
            <CCol md={4}>
              <img
                onClick={() => setVisibleForThumbnail(true)}
                width={200}
                className="rounded"
                src={thumbnail ? thumbnail : thumbnailImage}
                alt=""
              />
            </CCol>
          </CRow>
          <br />
          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Short Title
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="text"
                value={short_name}
                onChange={(e) => setShort_name(e.target.value)}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Short Link
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="text"
                value={short_url}
                onChange={(e) => setShort_url(e.target.value)}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => Delete()}>
            Delete
          </CButton>
          <CButton color="primary" onClick={() => update()}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>

      {/* react - Table sub categories list */}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Short Title</CTableHeaderCell>
            <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData.map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{data.short_name}</CTableDataCell>

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

                  {/* <CButton color="danger" className="me-md-1" onClick={() => openDelete(data.id)}>
                    Delete
                  </CButton> */}
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
            <h2>SHORTS</h2>
          </CCardHeader>
          <CCardBody>{Shorts()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
