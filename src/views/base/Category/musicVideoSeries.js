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
  CFormCheck,
  CImage,
  CProgress,
  CProgressBar,
  CInputGroup,
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
import bannerImageForPrev from '../../../assets/images/thumbnail.png'
import closeIcon from '../../../assets/images/close.png'
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  getStorage,
} from 'firebase/storage'
import { useNavigate, useParams } from 'react-router-dom'

const Category = () => {
  const params = useParams()
  const storage = getStorage() //define storage
  const history = useNavigate()
  const [myData, setMyData] = useState([])
  const [loading, setLoading] = useState(true)
  const CollectionRef = collection(db, 'musicVideoSeries')
  const [visible, setVisible] = useState(false)
  const [visibleBannerImage, setVisibleBannerImage] = useState(false)
  const [visibleBannerImageForEdit, setVisibleBannerImageForEdit] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [musicVideoSeries, setMusicVideoSeries] = useState('')
  const [editId, setEditId] = useState()
  const [tags, setTags] = useState([])
  const [progress, setProgress] = useState(0)
  const [progressForEdit, setProgressForEdit] = useState(0)
  const [contentProvider, setContentProvider] = useState('')
  const [contentProviderData, setContentProviderData] = useState([])

  // FIREBASE - GET USER FROM FIRESTORE
  const getMusicVideoSeries = async () => {
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

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getMusicVideoSeries()
    getContentProvider()
  }, [])

  // firebase - store data into firebase collection
  const StoreData = async () => {
    console.log('inside of the store data func')
    // let tagsChar = TagForSearch()
    const ref = doc(collection(db, 'musicVideoSeries'))

    if (contentProvider === '') {
      return alert('please select content Provider')
    }
    if (musicVideoSeries === '') {
      return alert('please add music video series')
    }
    setLoading(true)

    const docData = {
      id: ref.id,
      createAt: Timestamp.fromDate(new Date()),
      name: musicVideoSeries,
      contentProvider: contentProvider,
    }
    await setDoc(ref, docData).then(() => {
      setLoading(false)
      setVisible(false)
      alert('New Music Video Category created!')
      getContentProvider()
      getMusicVideoSeries()
      setProgress(0)
      setProgressForEdit(0)
    })
  }

  // firebase get data for edit function
  const edit = async (id) => {
    setEditVisible(true)
    const docRef = doc(db, 'musicVideoSeries', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let { name, contentProvider } = docSnap.data()
      setMusicVideoSeries(name)
      setContentProvider(contentProvider)
      setEditId(id)
    }
  }

  // firebase update function
  const update = async () => {
    setLoading(true)
    await updateDoc(doc(db, 'musicVideoSeries', editId), {
      name: musicVideoSeries,
      contentProvider: contentProvider,
    }).then(() => {
      setEditVisible(false)
      setProgress(0)
      setProgressForEdit(0)
      getContentProvider()
      getMusicVideoSeries()
    })
  }

  const handleClose = async () => {
    setVisible(false)
    setContentProvider('')
    setMusicVideoSeries('')
  }

  const handleAddNew = async () => {
    setVisible(!visible)
    setContentProvider('')
    setMusicVideoSeries('')
  }

  // firebase delete function
  const Delete = async () => {
    setLoading(true)
    await deleteDoc(doc(db, 'musicVideoSeries', editId)).then(() => {
      setEditVisible(false)
      getContentProvider()
      getMusicVideoSeries()
    })
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
      <CModal alignment="center" visible={visible} onClose={handleClose}>
        <CModalHeader>
          <CModalTitle>New Music Video Series</CModalTitle>
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
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Series Name
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="text" onChange={(e) => setMusicVideoSeries(e.target.value)} />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => StoreData()}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* css modal for edit */}
      <CModal alignment="center" visible={editVisible} onClose={() => setEditVisible(false)}>
        <CModalHeader>
          <CModalTitle>Update</CModalTitle>
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
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Series Name
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="text"
                value={musicVideoSeries}
                onChange={(e) => setMusicVideoSeries(e.target.value)}
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
            <CTableHeaderCell scope="col">SERIES NAME</CTableHeaderCell>
            <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData.map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{data.name}</CTableDataCell>

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
const Validation = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>MUSIC VIDEO LIST</h2>
          </CCardHeader>
          <CCardBody>{Category()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Validation
