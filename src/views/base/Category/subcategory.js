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
  CBadge,
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
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'

const Subcategory = () => {
  const [myData, setMyData] = useState([])
  const [loading, setLoading] = useState(false)
  const [categoryData, setCategoryData] = useState([])
  const CollectionRef = collection(db, 'subcategory')
  const [visible, setVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [category, setCategory] = useState()
  const [subcategory, setSubcategory] = useState()
  const [editId, setEditId] = useState()
  const [formValue, setFormValue] = useState({
    categoryName: '',
    category: '',
    subcategory: '',
  })

  const { categoryName } = formValue
  // FIREBASE - GET USER FROM FIRESTORE
  const getData = async () => {
    setLoading(true)
    let q = query(CollectionRef)

    if (!category == '') {
      q = query(q, where('category', '==', categoryName))
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

  const getCategory = async () => {
    let q = query(collection(db, 'category'))
    const data = await getDocs(q).then(function (data) {
      setCategoryData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
      setCategory('')
    })
  }

  const FilterFunction = async () => {
    setLoading(true)
    let q = query(collection(db, 'subcategory'))
    if (categoryName != '') {
      q = query(q, where('category', '==', categoryName))
    }
    await getDocs(q).then(function (data) {
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
    getData()
    getCategory()
  }, [])

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    FilterFunction()
  }, [formValue])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  // firebase - store data into firebase collection
  const StoreData = (e) => {
    setLoading(true)
    const ref = doc(CollectionRef)
    const docData = {
      createAt: Timestamp.fromDate(new Date()),
      id: ref.id,
      category: category,
      name: subcategory,
    }
    setDoc(ref, docData).then(() => {
      setVisible(false)
      getData()
    })
  }

  // firebase get data for edit function
  const edit = async (id) => {
    setEditVisible(true)
    const docRef = doc(db, 'subcategory', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let { category, name } = docSnap.data()
      setCategory(category)
      setSubcategory(name)
      setEditId(id)
    }
  }

  // firebase update function
  const update = async () => {
    setLoading(true)
    await updateDoc(doc(db, 'subcategory', editId), {
      category: category,
      name: subcategory,
    }).then(() => {
      setEditVisible(false)
      getData()
    })
  }

  // firebase delete function
  const Delete = async () => {
    setLoading(true)
    await deleteDoc(doc(db, 'subcategory', editId)).then(() => {
      setEditVisible(false)
      getData()
    })
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <CRow>
        <CCol md={3} className="position-relative">
          <CFormSelect
            id="validationTooltip04"
            name="categoryName"
            onChange={handleChange}
            value={categoryName}
          >
            <option value="">Category</option>
            {categoryData.map((item) => {
              return (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              )
            })}
          </CFormSelect>
        </CCol>
      </CRow>

      <br />

      <CButton sm={8} onClick={() => setVisible(!visible)}>
        Add New
      </CButton>
      {/* css modal for add */}
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>New Subcategory</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              Main category
            </CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                id="validationTooltip04"
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option defaultValue="">Choose...</option>
                {categoryData.map((item) => {
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
              subcategory Name
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="text" onChange={(e) => setSubcategory(e.target.value)} />
            </CCol>
          </CRow>
        </CModalBody>

        <CModalFooter>
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
              Main category
            </CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                id="validationTooltip04"
                onChange={(e) => setCategory(e.target.value)}
                required
                value={category}
              >
                <option value="">Choose...</option>
                {categoryData.map((item) => {
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
              subcategory name
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
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
            <CTableHeaderCell scope="col">NAME</CTableHeaderCell>
            <CTableHeaderCell scope="col">CATEGORY</CTableHeaderCell>
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
                  <CBadge color="success">{data.category}</CBadge>
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

const Validation = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>SUBCATEGORY LIST</h2>
          </CCardHeader>
          <CCardBody>{Subcategory()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Validation
