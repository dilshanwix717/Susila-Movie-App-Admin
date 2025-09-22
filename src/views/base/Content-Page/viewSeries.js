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
import { Link } from 'react-router-dom'
import { db } from '../../../firebase'
import { collection, getDocs, where, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import ScreenLoading from 'src/components/loading/Loading'

const Index = () => {
  const [myData, setMyData] = useState([])
  const [loading, setLoading] = useState(true)
  // react delete
  const [deleteId, setDeleteId] = useState()
  const [deleteVisible, setDeleteVisible] = useState(false)
  // react store all category data
  const [subcategoryData, setSubcategoryData] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState([])
  const [formValue, setFormValue] = useState({
    subcategory: '',
  })
  const userCollectionRef = collection(db, 'content')
  const { subcategory } = formValue 
  const [seriesNameData, setSeriesNameData] = useState([])
  const [seriesNameText, setSeriesNameText] = useState('')
  const [categoryName, setCategoryName] = useState([])
  const [category, setCategory] = useState('')
  const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [selectedSeriesName, setSelectedSeriesName] = useState('')
  const [selectedCategoryBelongsToSeries, setSelectedCategoryToSeries] = useState('')

   // FIREBASE - GET DATA FROM FIRESTORE

  // const getData = async () => {
  //   setLoading(true)
  //   let q = query(userCollectionRef, orderBy('createAt', 'desc'))
  //   if (selectedCategoryName) {
  //     q = query(q, where('category', '==', selectedCategoryName))
  //       const data = await getDocs(q).then(function (data) {
  //         setMyData(
  //           data.docs.map((doc) => ({
  //             ...doc.data(),
  //             id: doc.id,
  //           })),
  //         )
  //       })
  //   }
  //   setLoading(false)
  // }

  const getData = async () => {
    // setLoading(true)
    let q = query(userCollectionRef, orderBy('createAt', 'desc'))

    if (selectedCategoryName) {
      q = query(q, where('category', '==', selectedCategoryName))
    }
    if (selectedSubcategory) {
      q = query(q, where('subcategory', '==', selectedSubcategory))
    }
    if (selectedSeriesName) {
      q = query(q, where('SeriesName', '==', selectedSeriesName))
      console.log('================= its Working====================')
    }
    try {
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyData(data)
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
    setLoading(false);
  }
  const getCategory = async () => {
    let q = query(collection(db, 'category'))
    const data = await getDocs(q).then(function (data) {
      setCategoryName(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }
  const getSubcategories = async () => {
    if (selectedCategoryName) {
        let q = query(collection(db, 'subcategory'));
        q = query(q, where('category', '==', selectedCategoryName))
        const data = await getDocs(q)
        setSubcategoryData(
          data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        )
      // }
    }
  }

  const getSeriesNameData = async () => {
    if (selectedCategoryName) {
      if (selectedSubcategory) {
        let q = query(collection(db, 'createSeries'))
        q = query(q, where('category', '==', selectedCategoryName))
        const data = await getDocs(q)
            setSeriesNameData(
                data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                })),
            )
      }
    }
  }

  const getCategoryIsSeries = async () => {
    let q = query(collection(db, 'category'))
    const data = await getDocs(q);
    const categories = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    // const isSeriesValues = categories.map(category => category.isSeries);
    // setSelectedCategoryToSeries(isSeriesValues);
  }

const handleChangeCategory = (event) => {
  const { value } = event.target
  setSelectedCategoryName(value)
  setCategory(value)
  setSelectedSubcategory('')
  setSelectedSeriesName('')
  const selectedCategoryToSeries = categoryName.find((item) => item.name === value)
  setSelectedCategoryToSeries(selectedCategoryToSeries.isSeries)
}
const handleChangeSubcategory = (event) => {
  const { value } = event.target
  setSelectedSubcategory(value)
}
const handleChangeSeriesName = (event) => {
  const { value } = event.target
  setSelectedSeriesName(value)
}
useEffect(() => {
  getData()
}, [selectedCategoryName, selectedSubcategory,selectedSeriesName])

useEffect(() => {
  getSubcategories()
}, [selectedCategoryName])

useEffect(() => {
  getSeriesNameData()
}, [selectedCategoryName, selectedSubcategory])

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getData()
    getSubcategories()
    // getSeriesName()
    getSeriesNameData()
    getCategoryIsSeries()
    getCategory()
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
  
  console.log('My Data list ===============>', myData)
  console.log('Category  ===============>', category)
  // console.log('Subcategory Name List ===============>', subcategoryData)
  // console.log('Series Name List ===============>', seriesNameData)
  // console.log('Selected Category Name  ===============>', selectedCategoryName)
  console.log('selectedCategoryBelongsToSeries  ===============>', selectedCategoryBelongsToSeries)

  return (
    <>
      <CRow>
        <CCol md={3} className="position-relative">
          <CFormSelect name="categoryName" onChange={handleChangeCategory} 
            value={selectedCategoryName}
            >
            <option value="">Category </option>
            {categoryName.map((item) => {
              return (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              )
            })}
          </CFormSelect>
        </CCol>
        <CCol md={3} className="position-relative">
          <CFormSelect name="subcategory" onChange={handleChangeSubcategory} value={selectedSubcategory}>
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
          <CFormSelect name="seriesName" onChange={handleChangeSeriesName} value={selectedSeriesName}>
            <option value="">SeriesName</option>
            {seriesNameData.map((item) => {
              return (
                <option key={item.id} value={item.SeriesName
                  }>
                  {item.SeriesName}
                </option>
              )
            })}
          </CFormSelect>
        </CCol>
      </CRow>
      <br />
      {category == selectedCategoryName && selectedCategoryBelongsToSeries  ?(
      // {category == 'Test 2' && selectedCategoryBelongsToSeries =='true'  ?(
        <>
          <CTable>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                <CTableHeaderCell scope="col">Subcategory</CTableHeaderCell>

                <CTableHeaderCell scope="col">Series Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Episode</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {myData.map((data, index) => {
                return (
                  <CTableRow key={data.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{data.title}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="warning">{data.subcategory ? data.subcategory : '-'}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{data.SeriesName}</CTableDataCell>
                    <CTableDataCell>{data.episode}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/update/${data.id}`}>
                        <CButton color="success" className="me-md-4" active tabIndex={-1}>
                          Edit
                        </CButton>
                      </Link>
                    </CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        </>
      ):(
      <>
        <CTable>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Title</CTableHeaderCell>
              <CTableHeaderCell scope="col">Subcategory</CTableHeaderCell>
              <CTableHeaderCell scope="col">Episode</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {myData.map((data, index) => {
              return (
                <CTableRow key={data.id}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{data.title}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="warning">{data.subcategory ? data.subcategory : '-'}</CBadge>
                  </CTableDataCell>
                  {/* <CTableDataCell>{data.SeriesName}</CTableDataCell> */}
                  <CTableDataCell>{data.episode}</CTableDataCell>
                  <CTableDataCell>
                    <Link to={`/update/${data.id}`}>
                      <CButton color="success" className="me-md-4" active tabIndex={-1}>
                        Edit
                      </CButton>
                    </Link>
                  </CTableDataCell>
                </CTableRow>
              )
            })}
          </CTableBody>
        </CTable>
      </>
      )}
  

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
    </>
  )
}

const viewSeries = () => {
  return (
    <>
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>VIEW SERIES</h3>
          </CCardHeader>
          <CCardBody>{Index()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
    </>
  )
}

export default viewSeries
