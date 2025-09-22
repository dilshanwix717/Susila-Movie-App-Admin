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
  CFormLabel,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../../firebase'
import { collection, getDocs, where, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import ScreenLoading from 'src/components/loading/Loading'
import category from '../Category/category'

const Index = () => {
  const [myData, setMyData] = useState([])
  const [loading, setLoading] = useState(true)

  // react delete
  const [deleteId, setDeleteId] = useState()
  const [deleteVisible, setDeleteVisible] = useState(false)

  // react store all category data
  const [subcategoryData, setSubcategoryData] = useState([])
  // const [musicVideoSeries, setMusicVideoSeries] = useState('')
  const [musicVideoSeriesData, setMusicVideoSeriesData] = useState([])

  const [musicsType, setMusicsType] = useState('')

  const [formValue, setFormValue] = useState({
    subcategory: '',
    musicType: '',
    getMusicVideoSeries: '',
  })

  const userCollectionRef = collection(db, 'content')
  const { subcategory, musicType, musicVideoSeries } = formValue

  // FIREBASE - GET DATA FROM FIRESTORE
  const getData = async () => {
    setLoading(true)
    let q = query(userCollectionRef, orderBy('createAt', 'desc'))
    q = query(q, where('category', '==', 'Music'))
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
    q = query(q, where('category', '==', 'Music'))
    const data = await getDocs(q).then(function (data) {
      setSubcategoryData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  const getMusicVideoSeries = async () => {
    setLoading(true)
    let q = query(collection(db, 'musicVideoSeries'))
    const data = await getDocs(q).then(function (data) {
      setMusicVideoSeriesData(
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
    q = query(q, where('category', '==', 'Music'))

    if (!musicType == '') {
      q = query(q, where('musicType', '==', musicType))
      console.log('Print q :', q)
    }

    if (!subcategory == '') {
      q = query(q, where('subcategory', '==', subcategory))
    }
    if (!musicVideoSeries == '') {
      q = query(q, where('musicVideoSeries', '==', musicVideoSeries))
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
    getMusicVideoSeries()
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
          <CFormSelect onChange={handleChange} value={musicType} name="musicType">
            <option value="">MusicType</option>
            <option value="Video"> Video </option>
            <option value="Audio"> Audio </option>
          </CFormSelect>
        </CCol>
        <CCol md={3} className="position-relative">
          <CFormSelect name="subcategory" onChange={handleChange} value={subcategory}>
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
        {musicType == 'Video' ? (
          <CCol md={3} className="position-relative">
            <CFormSelect name="musicVideoSeries" onChange={handleChange} value={musicVideoSeries}>
              <option value="">Music Video Series</option>
              {musicVideoSeriesData.map((item) => {
                return (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                )
              })}
            </CFormSelect>
          </CCol>
        ) : null}
      </CRow>

      <br />

      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Title</CTableHeaderCell>
            <CTableHeaderCell scope="col">Music Type</CTableHeaderCell>
            <CTableHeaderCell scope="col">Subcategory</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData.map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{data.title}</CTableDataCell>
                <CTableDataCell>{data.musicType}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color="warning">{data.subcategory ? data.subcategory : '-'}</CBadge>
                </CTableDataCell>
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
            <h3>MUSIC</h3>
          </CCardHeader>
          <CCardBody>{Index()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Page
