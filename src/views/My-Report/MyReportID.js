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
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { db, storage } from '../../firebase'
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
import './MyReportID.css'

const Series = () => {
  const storage = getStorage() //define storage
  const [myData, setMyData] = useState([])
  const [myFilteredData, setMyFilteredData] = useState([])
  const [title, setTitle] = useState('')
  const [profilePicture_url, setProfilePicture_url] = useState('')
  const [loading, setLoading] = useState(true)
  const CollectionRef = collection(db, 'analysis')
  const params = useParams()
  const [contentProvider, setContentProvider] = useState('')
  const [titleForContentProvider, setTitleForContentProvider] = useState('')
  const [contentProviderData, setContentProviderData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [subcategoryData, setSubcategoryData] = useState([])
  const [musicVideoSeriesData, setMusicVideoSeriesData] = useState([])
  const [musicVideoSeries, setMusicVideoSeries] = useState('')
  const [isMusicVideoSeries, setIsMusicVideoSeries] = useState(false)
  const [datee, setDatee] = useState()
  const [csvData, setCsvData] = useState('')
  const [formValue, setFormValue] = useState({
    category: '',
    musicType: '',
    subcategory: '',
    getMusicVideoSeries: '',
    date0: '',
    date1: '',
    date2: '',
    date3: '',
    date4: '',
    date5: '',
    date6: '',
  })
  let [date1, setDate1] = useState()
  let [date2, setDate2] = useState()
  let [date3, setDate3] = useState()
  let [date4, setDate4] = useState()
  let [date5, setDate5] = useState()
  let [date6, setDate6] = useState()
  let [date0, setDate0] = useState()
  let [newMonth, setNewMonth] = useState(new Date().getMonth() + 1)

  const userCollectionRef = collection(db, 'analysis')
  const userCollectionRef2 = collection(db, 'contentProvider')
  let { category, musicType, subcategory } = formValue
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1

  const calculateDate = (monthOffset, setDate) => {
    const yearToDisplay = month - monthOffset <= 0 ? year - 1 : year
    const monthToDisplay =
      month - monthOffset === 0
        ? 12
        : month - monthOffset === -1
        ? 11
        : month - monthOffset === -2
        ? 10
        : month - monthOffset === -3
        ? 9
        : month - monthOffset === -4
        ? 8
        : month - monthOffset
    setDate(`${yearToDisplay}-${monthToDisplay}`)
  }
  useEffect(() => {
    calculateDate(6, setDate6)
    calculateDate(5, setDate5)
    calculateDate(4, setDate4)
    calculateDate(3, setDate3)
    calculateDate(2, setDate2)
    calculateDate(1, setDate1)
    calculateDate(0, setDate0)
  }, [newMonth])

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getData()
    getAnalysis()
    getCategories()
    getContentProvider()
    getSubcategories()
    getMusicVideoSeries()
    getDataForContentProvider()
  }, [])

  const getCategories = async () => {
    let q = query(collection(db, 'category'))
    const data = await getDocs(q).then(function (data) {
      setCategoryData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
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

  const getDataForContentProvider = async () => {
    const docRef = doc(db, 'contentProvider', params.id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let { title, profilePicture_url } = docSnap.data()
      console.log('Document data:', docSnap.data())
      setTitleForContentProvider(title)
      setProfilePicture_url(profilePicture_url)
    }
  }

  // firebase get match data
  const getData = async () => {
    const docRef = doc(db, 'analysis', params.id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let {
        contentProvider,
        title,
        isMusicVideoSeries,
        date1 = docSnap.data()?.data1 ?? null,
        date2 = docSnap.data()?.data2 ?? null,
        date3 = docSnap.data()?.data3 ?? null,
        date4 = docSnap.data()?.data4 ?? null,
        date5 = docSnap.data()?.data5 ?? null,
        date6 = docSnap.data()?.data6 ?? null,
        date0 = docSnap.data()?.data0 ?? null,
      } = docSnap.data()
      console.log('Document data:', docSnap.data())
      setContentProvider(contentProvider)
      setTitle(title)
      setIsMusicVideoSeries(isMusicVideoSeries)
      if (date1 !== null) setDate1(date1)
      if (date2 !== null) setDate2(date2)
      if (date3 !== null) setDate3(date3)
      if (date4 !== null) setDate4(date4)
      if (date5 !== null) setDate5(date5)
      if (date6 !== null) setDate6(date6)
      if (date0 !== null) setDate0(date0)
    }
  }

  const getAnalysis = async () => {
    setLoading(true)
    let q = query(collection(db, 'analysis'))
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
  const getContentProvider = async () => {
    setLoading(true)
    let q = query(CollectionRef, orderBy('createAt', 'desc'))
    const data = await getDocs(q).then(function (data) {
      setContentProviderData(
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
    // const documentRef = doc(CollectionRef, params.id)
    // var qa = query(documentRef)
    let q = query(userCollectionRef)
    if (!params.id == '') {
      q = query(q, where('contentProvider', '==', params.id))
    }

    if (!category == '') {
      q = query(q, where('category', '==', category))
    }
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

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const handleChangeForDate = (event) => {
    console.log('Inside handleChange', event.target.value)
    var DateValue = event.target.value
    console.log('Inside handleChange print date ==>', DateValue)
    setDatee(DateValue)
    // console.log('Inside handleChange print datee ==>', datee.valueOf())
    const { name, value } = event.target
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const handleExportClick = () => {
    if (category != 'Teledrama') {
      const header = ['INDEX', 'ID', 'CATEGORY', 'CONTENT', 'MONTH', 'TOTAL VIEW COUNT PER MONTH']
      const rows = myFilteredData.map((data, index) => [
        index + 1,
        data.id,
        data.category ? data.category : '',
        data.title ? data.title : '',
        data.thisMonth == 0
          ? 'January'
          : data.thisMonth == 1
          ? 'February'
          : data.thisMonth == 2
          ? 'March'
          : data.thisMonth == 3
          ? 'April'
          : data.thisMonth == 4
          ? 'May'
          : data.thisMonth == 5
          ? 'June'
          : data.thisMonth == 6
          ? 'July'
          : data.thisMonth == 7
          ? 'August'
          : data.thisMonth == 8
          ? 'September'
          : data.thisMonth == 9
          ? 'October'
          : data.thisMonth == 10
          ? 'November'
          : 'December',
        data[date0].Total >= 0 ? data[date0].Total : '',
      ])
      const csvRows = [header, ...rows]
      const csvData = csvRows.map((row) => row.join(',')).join('\n')
      setCsvData(csvData)

      // Download CSV file
      const link = document.createElement('a')
      link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`)
      link.setAttribute('download', titleForContentProvider + 'ViewCountReport')
      link.click()
    } else {
      const header = [
        'INDEX',
        'ID',
        'CATEGORY',
        'CONTENT',
        'EPISODE',
        'MONTH',
        'TOTAL VIEW COUNT PER MONTH',
      ]
      const rows = myFilteredData.map((data, index) => [
        index + 1,
        data.id,
        data.category ? data.category : '',
        data.title ? data.title : '',
        data.episode,
        data.thisMonth == 0
          ? 'January'
          : data.thisMonth == 1
          ? 'February'
          : data.thisMonth == 2
          ? 'March'
          : data.thisMonth == 3
          ? 'April'
          : data.thisMonth == 4
          ? 'May'
          : data.thisMonth == 5
          ? 'June'
          : data.thisMonth == 6
          ? 'July'
          : data.thisMonth == 7
          ? 'August'
          : data.thisMonth == 8
          ? 'September'
          : data.thisMonth == 9
          ? 'October'
          : data.thisMonth == 10
          ? 'November'
          : 'December',
        data[date0].Total >= 0 ? data[date0].Total : '',
      ])
      const csvRows = [header, ...rows]
      const csvData = csvRows.map((row) => row.join(',')).join('\n')
      setCsvData(csvData)

      // Download CSV file
      const link = document.createElement('a')
      link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`)
      link.setAttribute('download', titleForContentProvider + 'ViewCountReport')
      link.click()
    }
  }

  if (loading) {
    return <Loading />
  }
  return (
    <>
      <CRow>
        <CCol md={8} className="position-relative">
          <CFormLabel htmlFor="validationTooltip04">
            <b>Content Provider :{titleForContentProvider}</b>
          </CFormLabel>
        </CCol>
        <CCol md={4} className="position-relative">
          <img width={40} height={40} src={profilePicture_url} />
        </CCol>
      </CRow>
      <CRow>
        <CCol md={3} className="position-relative">
          <CFormSelect name="category" onChange={handleChange} value={category}>
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
        {category == 'Music' ? (
          <>
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
          </>
        ) : null}
        <CCol md={3} className="position-relative">
          <CFormSelect onChange={handleChangeForDate} value={datee} name="date">
            <option value="">Last 6 months</option>
            <option value="date1">{date1}</option>
            <option value="date2">{date2}</option>
            <option value="date3">{date3}</option>
            <option value="date4">{date4}</option>
            <option value="date5">{date5}</option>
            <option value="date6">{date6}</option>
            <option value="date0">{date0}</option>
          </CFormSelect>
        </CCol>
      </CRow>
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            {/*<CTableHeaderCell scope="col">CATEGORY</CTableHeaderCell>*/}
            {/*<CTableHeaderCell scope="col">CONTENT PROVIDER</CTableHeaderCell>*/}
            <CTableHeaderCell scope="col">CONTENT</CTableHeaderCell>
            {category == 'Teledrama' ? (
              <CTableHeaderCell scope="col">EPISODE</CTableHeaderCell>
            ) : null}
            {/*<CTableHeaderCell scope="col">CONTENT</CTableHeaderCell>*/}
            <CTableHeaderCell scope="col">VIEW COUNT</CTableHeaderCell>
            {/*<CTableHeaderCell scope="col">VIEW COUNT Month2</CTableHeaderCell>*/}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myFilteredData.map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                {/*<CTableHeaderCell scope="row">{data.category}</CTableHeaderCell>*/}
                {/*<CTableHeaderCell scope="row">{data.contentProvider}</CTableHeaderCell>*/}
                <CTableDataCell>{data.title}</CTableDataCell>
                {category == 'Teledrama' ? <CTableDataCell>{data.episode}</CTableDataCell> : null}
                {datee === 'date0' ? (
                  <>
                    <CTableDataCell>{data[date0].Total}</CTableDataCell>
                    {console.log('inside the datee== date0')}
                  </>
                ) : null}
              </CTableRow>
            )
          })}
        </CTableBody>
      </CTable>
      <CRow>
        <CCol md={8} className="position-relative"></CCol>
        <CCol md={4} className="position-relative">
          <CButton color={'primary'} onClick={handleExportClick}>
            Export to CSV
          </CButton>
        </CCol>
      </CRow>
    </>
  )
}

const Index = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>My Report </h2>
          </CCardHeader>
          <CCardBody>{Series()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
