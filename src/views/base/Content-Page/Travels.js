import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CCol,
  CFormSelect,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../../../firebase'
import {
  collection,
  getDocs,
  where,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore'
import ScreenLoading from 'src/components/loading/Loading'

const Index = () => {
  const params = useParams()
  const [myData, setMyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')

  // react delete
  const [deleteId, setDeleteId] = useState()
  const [deleteVisible, setDeleteVisible] = useState(false)

  // react store all category data
  const [subcategoryData, setSubcategoryData] = useState([])
  const [travelSeriesData, setTravelSeriesData] = useState([])
  const [travelSeries, setTravelSeries] = useState('')

  const [formValue, setFormValue] = useState({
    subcategory: '',
    // travelSeries: '',
  })

  const userCollectionRef = collection(db, 'content')
  const { subcategory } = formValue

  // FIREBASE - GET DATA FROM FIRESTORE
  const getData = async () => {
    setLoading(true)
    let q = query(userCollectionRef, orderBy('createAt', 'desc'))
    q = query(q, where('category', '==', 'Travel'))
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

  const getSubcategories = async () => {
    let q = query(collection(db, 'subcategory'))
    q = query(q, where('category', '==', 'Travel'))
    const data = await getDocs(q).then(function (data) {
      setSubcategoryData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  const getTravelSeries = async () => {
    let q = query(collection(db, 'travelSeries'))
    const data = await getDocs(q).then(function (data) {
      setTravelSeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  // firebase get match data
  // const getDataForTravel = async () => {
  //   const docRef = doc(db, 'content', params.id)
  //   const docSnap = await getDoc(docRef)
  //   if (docSnap.exists()) {
  //     let { travelSeriesName } = docSnap.data()
  //     console.log('Document data:', docSnap.data())
  //     // console.log('Document data 2:', video_url)
  //
  //     setTravelSeriesName(travelSeriesName)
  //   }
  // }
  const FilterFunction = async () => {
    setLoading(true)
    let q = query(userCollectionRef, orderBy('createAt', 'desc'))
    q = query(q, where('category', '==', 'Travel'))

    if (!subcategory == '') {
      q = query(q, where('subcategory', '==', subcategory))
    }

    if (!travelSeries == '') {
      q = query(q, where('travelSeriesName', '==', travelSeries))
    }

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

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValue((prevState) => {
      console.log('value===>', event.target.value)
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const handleChangeTravelSeries = (event) => {
    const { name, value } = event.target
    setTravelSeries(value)
    setFormValue((prevState) => {
      console.log('value===>', event.target.value)
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  useEffect(() => {
    FilterFunction()
  }, [formValue])

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getData()
    getSubcategories()
    getTravelSeries()
    // getDataForTravel()getDataForTravel()
  }, [])

  // firebase   - delete funtion
  const openDelete = (id) => {
    setDeleteVisible(true)
    setDeleteId(id)
  }

  // firebase delete function
  const Delete = async (id) => {
    setLoading(true)
    await deleteDoc(doc(db, 'content', id)).then(() => {
      setDeleteVisible(false)
      getData()
    })
  }

  if (loading) {
    return <ScreenLoading />
  }

  return (
    <div>
      <CRow>
        <CCol md={3} className="position-relative">
          <CFormSelect
            id="validationTooltip04"
            name="subcategory"
            onChange={handleChange}
            value={subcategory}
          >
            <option value="">Subcategory</option>
            {subcategoryData.map((item) => {
              return (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              )
            })}
          </CFormSelect>
        </CCol>
        <CCol md={3} className="position-relative">
          <CFormSelect
            id="validationTooltip04"
            name="Travel Series"
            onChange={handleChangeTravelSeries}
            value={travelSeries}
          >
            <option value="">Travel Series</option>
            {travelSeriesData.map((item) => {
              if (item.subcategory == subcategory) {
                return (
                  <option key={item.id} value={item.title}>
                    {item.title}
                  </option>
                )
              }
            })}
          </CFormSelect>
        </CCol>
        {/*<CCol md={3} className="position-relative">*/}
        {/*  <CFormSelect*/}
        {/*    id="validationTooltip04"*/}
        {/*    name="podcastSeries"*/}
        {/*    onChange={handleChange}*/}
        {/*    value={travelSeries}*/}
        {/*  >*/}
        {/*    <option value="">Travel Series</option>*/}
        {/*    {travelSeriesData.map((item) => {*/}
        {/*      // if (item.subcategory == subcategory) {*/}
        {/*      return (*/}
        {/*        <option key={item.id} value={item.title}>*/}
        {/*          {item.title}*/}
        {/*        </option>*/}
        {/*      )*/}
        {/*      // }*/}
        {/*    })}*/}
        {/*  </CFormSelect>*/}
        {/*</CCol>*/}
      </CRow>

      <br />

      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">TRAVEL SERIES</CTableHeaderCell>
            <CTableHeaderCell scope="col">TITLE</CTableHeaderCell>
            <CTableHeaderCell scope="col">SUBCATEGORY</CTableHeaderCell>
            <CTableHeaderCell scope="col">EPISODE</CTableHeaderCell>
            <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData.map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{data.travelSeriesName}</CTableDataCell>
                <CTableDataCell>{data.title}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color="warning">{data.subcategory ? data.subcategory : '-'}</CBadge>
                </CTableDataCell>
                <CTableDataCell>{data.episode}</CTableDataCell>
                <CTableDataCell>
                  <Link to={`/update/${data.id}`}>
                    <CButton color="success" className="me-md-4" active tabIndex={-1}>
                      Edit
                    </CButton>
                  </Link>
                  {/*
                  <CButton color="danger" className="me-md-1" onClick={() => openDelete(data.id)}>
                    Delete
                  </CButton> */}
                </CTableDataCell>
              </CTableRow>
            )
          })}
        </CTableBody>
      </CTable>

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
    </div>
  )
}

const Page = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>TRAVEL</h3>
          </CCardHeader>
          <CCardBody>{Index()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Page
