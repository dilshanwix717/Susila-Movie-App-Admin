import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CForm,
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
  CContainer,
  CLink,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { db, storage } from '../../firebase'
import { Link } from 'react-router-dom'
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
import thumbnailImage from '../../assets/images/thumbnail.png'
import { useParams } from 'react-router-dom'
import contentProvider from '../base/Category/contentProvider'
import category from '../base/Category/category'
import MyReportID from './MyReportID'

const Series = () => {
  const storage = getStorage() //define storage
  const [myData, setMyData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [myFilteredData, setMyFilteredData] = useState([])
  const [contentData, setContentData] = useState([])
  const [title, setTitle] = useState('')
  const [order, setOrder] = useState(0)
  const [description, setDescription] = useState('')
  const [trailer, setTrailer] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [thumbnail_url, setThumbnail_url] = useState('')
  const [profilePicture_url, setProfilePicture_url] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedProfilePicture, setSelectedProfilePicture] = useState('')
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [visibleProfilePicture, setVisibleProfilePicture] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [editVisibleProfilePicture, setEditVisibleProfilePicture] = useState(false)
  const [editVisibleBannerImage, setEditVisibleBannerImage] = useState(false)
  const [editId, setEditId] = useState()
  const [progress, setProgress] = useState(0)
  const [validated, setValidated] = useState(false)
  const CollectionRef = collection(db, 'contentProvider')
  const params = useParams()

  const [formValue, setFormValue] = useState({
    contentProvider: '',
    category: '',
  })

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getContentProvider()
    getData()
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

  const userCollectionRef = collection(db, 'content')

  // FIREBASE - GET DATA FROM FIRESTORE
  const getData = async () => {
    setLoading(true)
    let q = query(userCollectionRef, orderBy('createAt', 'desc'))
    // q = query(q, where('contentProvider', '==', 'contentProvider'))
    const data = await getDocs(q).then(function (data) {
      setContentData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )

      setLoading(false)
    })
  }

  const getContentProvider = async () => {
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

  const FilterFunction = async () => {
    setLoading(true)
    let q = query(userCollectionRef)
    //q = query(q, where('contentProvider', '==', contentProvider))

    // if (!contentProvider == '') {
    //   q = query(q, where('contentProvider', '==', contentProvider))
    // }
    // if (!podcastSeries == '') {
    //   q = query(q, where('podcastSeriesName', '==', podcastSeries))
    // }
    const data = await getDocs(q).then(function (data) {
      setMyFilteredData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
      setLoading(false)
    })
  }

  useEffect(() => {
    FilterFunction()
  }, [formValue])

  if (loading) {
    return <Loading />
  }
  return (
    <>
      {/* react - Table sub categories list */}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">
              <center>PROFILE PICTURE</center>
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">CONTENT PROVIDER NAME</CTableHeaderCell>
            {/*<CTableHeaderCell scope="col">CONTENT</CTableHeaderCell>*/}
            {/*<CTableHeaderCell scope="col">VIEW COUNT</CTableHeaderCell>*/}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData.map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>
                  <center>
                    <img width={40} height={40} src={data.profilePicture_url} />
                  </center>
                </CTableDataCell>
                <Link to={`/myReportID/${data.id}`}>
                  <CButton color="success" className="me-md-4" active tabIndex={-1}>
                    {data.title}
                  </CButton>
                  {/*<CTableDataCell>{data.title}</CTableDataCell>*/}
                </Link>
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
            <h2>My Report</h2>
          </CCardHeader>
          <CCardBody>{Series()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
