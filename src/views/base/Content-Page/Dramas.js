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
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../../firebase'
import { collection, getDocs, where, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import ScreenLoading from 'src/components/loading/Loading'
import { CBadge } from '@coreui/react-pro'

const Index = () => {
  const [myData, setMyData] = useState([])
  const [loading, setLoading] = useState(true)

  // react delete
  const [deleteId, setDeleteId] = useState()
  const [deleteVisible, setDeleteVisible] = useState(false)

  // react store all category data
  const [subcategoryData, setSubcategoryData] = useState([])
  const [seriesData, setSeriesData] = useState([])

  const [formValue, setFormValue] = useState({
    subcategory: '',
    series: '',
    season: '',
    episode: '',
  })
  const userCollectionRef = collection(db, 'content')
  const { subcategory, series, season,episode } = formValue

  const validSeason = () => {
    let modifiedValue
    if (season <= 9) {
      modifiedValue = `0${season}`
    } else {
      modifiedValue = season
    }
    return modifiedValue
  }

  // FIREBASE - GET DATA FROM FIRESTORE
  const getData = async () => {
    setLoading(true)
    let q = query(userCollectionRef, orderBy('createAt', 'desc'))
    q = query(q, where('category', '==', 'Teledrama'))

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

  const FilterFunction = async () => {
    setLoading(true)
    let q = query(userCollectionRef)
    q = query(q, where('category', '==', 'Teledrama'))

    if (!subcategory == '') {
      q = query(q, where('subcategory', '==', subcategory))

    }

    if (!series == '') {
      q = query(q, where('title', '==', series))
      if (season == '')
      q = query(q, orderBy('episode', 'asc'));
    }
    if (!season == '') {
      q = query(q, where('season', '==', validSeason()));
      q = query(q, orderBy('episode', 'asc'));
    }

    // if (!season == '') {
    //   q = query(q, where('season', '==', validSeason()))
    // }
    // if (!episode == '') {
    //   q = query(q, where('episode', '==', parseInt(episode))); // Assuming episode is a number
    // }

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
    getSeries()
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

  const seasonCount = 20

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
            name="series"
            onChange={handleChange}
            value={series}
          >
            <option value="">Series</option>
            {seriesData.map((item) => {
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
        <CCol md={3} className="position-relative">
          <CFormSelect
            id="validationTooltip04"
            name="season"
            onChange={handleChange}
            value={season}
          >
            <option value="">Season</option>
            {[...Array(seasonCount)].map((el, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>

      <br />

      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">SERIES</CTableHeaderCell>
            <CTableHeaderCell scope="col">SUBCATEGORY</CTableHeaderCell>
            <CTableHeaderCell scope="col">SEASON</CTableHeaderCell>
            <CTableHeaderCell scope="col">EPISODE</CTableHeaderCell>
            <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData
          .sort((a, b) => a.episode - b.episode) 
          .map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{data.title}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color="warning">{data.subcategory}</CBadge>
                </CTableDataCell>
                <CTableDataCell>{data.season}</CTableDataCell>

                <CTableDataCell>{data.episode}</CTableDataCell>
                <CTableDataCell>
                  <Link to={`/update/${data.id}`}>
                    <CButton color="success" className="me-md-4" active tabIndex={-1}>
                      Edit
                    </CButton>
                  </Link>

                  {/* <CButton color="danger" className="me-md-1" onClick={() => openDelete(data.id)}>
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
            <h3>
              {/* <CBadge color="success"> */}
              TELEDRAMA
              {/* </CBadge> */}
            </h3>
          </CCardHeader>
          <CCardBody>{Index()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Page
