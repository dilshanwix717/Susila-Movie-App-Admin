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

const Series = () => {
  const storage = getStorage() //define storage
  const [myData, setMyData] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [trailer, setTrailer] = useState('')
  const [thumbnail_url, setThumbnail_url] = useState('')
  const [subcategoryData, setSubcategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const CollectionRef = collection(db, 'series')
  const [visible, setVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [subcategory, setSubcategory] = useState()
  const [editId, setEditId] = useState()
  const [deleteId, setDeleteId] = useState()
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getSeries()
    getSubcategory()
  }, [])

  // FIREBASE - GET USER FROM FIRESTORE
  const getSeries = async () => {
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

  const deleteMedia = async () => {
    const httpsReference = ref(storage, thumbnail_url)
    const desertRef = ref(storage, `series_thumbnail/${httpsReference.name}`)
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        console.log('success')
      })
      .catch((error) => {
        console.log('error', error)
        // Uh-oh, an error occurred!
      })
  }

  // firebase - store data into firebase collection
  const StoreData = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
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
          Save(downloadURL)
        })
      },
    )
  }

  // firebase - store data into firebase collection
  const Save = async (url) => {
    setLoading(true)
    const ref = doc(CollectionRef)
    const docData = {
      id: ref.id,
      createAt: Timestamp.fromDate(new Date()),
      thumbnail_url: url,
      trailer: trailer,
      subcategory: subcategory,
      title: title,
      description: description,
      favourite_user: [],
    }
    await setDoc(ref, docData).then(() => {
      setVisible(false)
      setProgress(0)
      getSeries()
    })
  }

  // firebase get data for edit function
  const edit = async (id) => {
    setEditVisible(true)
    const docRef = doc(db, 'series', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let { subcategory, title, description, trailer, thumbnail_url } = docSnap.data()
      setSubcategory(subcategory)
      setThumbnail_url(thumbnail_url)
      setTitle(title)
      setTrailer(trailer)
      setDescription(description)
      setEditId(id)
    }
  }

  // firebase update function
  const update = async () => {
    setLoading(true)
    await updateDoc(doc(db, 'series', editId), {
      subcategory: subcategory,
      title: title,
      description: description,
      trailer: trailer,
    }).then(() => {
      setEditVisible(false)
      getSeries()
    })
  }

  const openDelete = (id) => {
    setDeleteVisible(true)
    setDeleteId(id)
  }

  // firebase delete function
  const Delete = async (id) => {
    setLoading(true)
    await deleteDoc(doc(db, 'series', id)).then(() => {
      setDeleteVisible(false)
      getSeries()
    })
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <CButton sm={8} onClick={() => setVisible(!visible)}>
        Add New
      </CButton>
      {/* css modal for add */}
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Input New Subcategory Name</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              Drama category
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

          <form onSubmit={StoreData}>
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
          <CModalTitle>UPDATE Teledrama</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              Drama category
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

          <CRow className="mb-3">
            <CImage align="center" rounded src={thumbnail_url} />
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => update()}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>

      {/* css modal for delete */}
      <CModal alignment="center" visible={deleteVisible} onClose={() => setDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this item?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
            No, Cancel
          </CButton>
          <CButton color="primary" onClick={() => Delete(deleteId)}>
            Yes, Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* react - Table sub categories list */}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">THUMBNAIL</CTableHeaderCell>
            <CTableHeaderCell scope="col">SERIES TITLE</CTableHeaderCell>
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

                  <CButton color="danger" className="me-md-1" onClick={() => openDelete(data.id)}>
                    Delete
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

const Validation = () => {
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

export default Validation
