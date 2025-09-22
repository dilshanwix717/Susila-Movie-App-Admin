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
  CBadge,
  CFormCheck,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import {
  collection,
  getDoc,
  getDocs,
  query,
  doc,
  setDoc,
  Timestamp,
  deleteDoc,
  updateDoc,
  where,
  orderBy,
} from 'firebase/firestore'
import firebase from 'firebase/app'
import Loading from 'src/components/loading/Loading'
import { deleteObject, ref } from 'firebase/storage'
import { useNavigate, useParams } from 'react-router-dom'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css' // Import the styles
import 'react-date-range/dist/theme/default.css' // Import the theme
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Body = () => {
  const params = useParams()
  const history = useNavigate()
  const [myData, setMyData] = useState([])
  const [loading, setLoading] = useState(false)
  const CollectionRef = collection(db, 'referral')
  // const collectionRef= collection(db, 'agents')
  const [visible, setVisible] = useState(false)
  const [warning, setWarning] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [editId, setEditId] = useState()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filteredDataForDate, setFilteredDataForDate] = useState([])
  const [filteredDateDataa, setfilteredDateDataa] = useState([])
  const [agentNameList, setAgentNameList] = useState([])
  const [csvData, setCsvData] = useState('')

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: 'selection',
  })

  const [selectedStartDate, setSelectedStartDate] = useState(null)
  const [selectedEndDate, setSelectedEndDate] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [startYear, setStartYear] = useState(null)
  const [startMonth, setStartMonth] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endYear, setEndYear] = useState(null)
  const [endMonth, setEndMonth] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [createAtYear, setCreateAtYear] = useState(null)
  const [createAtMonth, setCreateAtMonth] = useState(null)
  const [createAtDate, setCreateAtDate] = useState(null)

  const [dataFilterVisible, setDataFilterVisible] = useState(true)
  const [resetVisible, setResetVisible] = useState(false)

  const [formData, setFormData] = useState({
    code: '',
    usd: '',
    plan: '',
    agent: '',
    bulk: '',
    usedBy: '',
    used: '',
    codeIssued: false,
    // remark:'',
  })

  // const [codeIssued, setCodeIssued] = useState(true)
  // const [formValue, setFormValue] = useState({
  //   agent: '',
  //   plan: '',
  //   status: '',
  // })
  //
  // const { agent, plan, status} = formValue

  // react use form data
  const { code, usd, plan, agent, bulk, usedBy, used, codeIssued } = formData

  function getUUID() {
    let tempRefAgent =
      agent === 'Susila Production'
        ? '2'
        : agent === 'Trico Global Network'
        ? '1'
        : agent === 'Influences'
        ? '3'
        : '4'
    let tempRefPlan =
      plan === 'Monthly' ? '1' : plan === '3 Months' ? '2' : plan === '6 Months' ? '3' : '4'
    console.log('temp ref ===', tempRefAgent + ' ' + tempRefPlan)

    let temRefPin =
      tempRefAgent +
      tempRefPlan +
      'xxxxxx'.replace(/[xy]/g, (c) => {
        const piece = (Math.random() * 6) | 0
        const elem = c === 'x' ? piece : (piece & 0x3) | 0x8
        return elem.toString(6)
      })

    console.log('temp data ===', temRefPin)
    return temRefPin
  }

  const generatePin = () => {
    if (agent === '') {
      return alert('please select an agent')
    }
    if (plan === '') {
      return alert('please select a plan')
    }
    if (bulk === '') {
      return alert('please enter the bulk quantity')
    }
    for (let i = 0; i < bulk; i++) {
      let tempData = getUUID()
      let alreadyGenerated = false
      myData.forEach((element) => {
        if (element.code === tempData) {
          alreadyGenerated = true
          return
        } else {
          alreadyGenerated = false
        }
      })
      if (alreadyGenerated) {
        StoreData(tempData)
      } else {
        StoreData(getUUID())
      }
    }
  }

  // FIREBASE  - GET USER FROM FIRESTORE
  const getReferrals = async () => {
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

  const reset = () => {
    setFormData((preventData) => {
      return {
        ...preventData,
        code: '',
        usd: '',
        plan: '',
        agent: '',
        bulk: '',
        usedBy: '',
        used: '',
        codeIssued: false,
      }
    })
  }

  const FilterFunction = async () => {
    setLoading(true)
    let q = query(CollectionRef, orderBy('createAt', 'desc'))
    // q = query(q, where('agent', '==', agent))
    if (!agent == '') {
      q = query(q, where('agent', '==', agent))
      //console.log('Print q :', q)
    }

    if (!plan == '') {
      q = query(q, where('plan', '==', plan))
      //console.log('Print q :', q)
    }
    if (!used == '') {
      q = query(q, where('used', '==', used === 'true'))
      console.log('Print q :', used)
    }

    const data = await getDocs(q).then(function (data) {
      setFilteredData(
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
  }, [formData])

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getReferrals()
  }, [])

  // firebase - store data into firebase collection
  const StoreData = async (codePin) => {
    setLoading(true)
    const ref = doc(CollectionRef)

    const docData = {
      createAt: Timestamp.fromDate(new Date()),
      id: ref.id,
      code: codePin,
      usd: usd,
      plan: plan,
      agent: agent,
      used: false,
      codeIssued: false,
      remark: remark,
    }
    await setDoc(ref, docData).then(() => {
      setLoading(false)
      setVisible(false)
      getReferrals()
      reset()
    })
  }

  // firebase get data for edit function
  const edit = async (id) => {
    setEditVisible(true)
    getCurrentReferralUser()
    const docRef = doc(db, 'referral', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let { code, usd, plan, agent, usedBy, used, codeIssued } = docSnap.data()

      docSnap.data()
      setFormData((preventData) => {
        return {
          ...preventData,
          code: code,
          usd: usd,
          plan: plan,
          agent: agent,
          usedBy: usedBy,
          used: used,
          codeIssued: codeIssued,
        }
      })
      setEditId(id)
    }
  }

  const getCurrentReferralUser = async () => {
    if (usedBy) {
      const docRef = doc(db, 'users', usedBy)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        let { subscription } = docSnap.data()
        let Today = new Date().valueOf()
        let exDate = subscription[0]['expireDate']

        if (exDate !== undefined) {
          // console.log('today', Today)
          // console.log('exDate', exDate.toMillis())

          let days = exDate.toMillis() - Today

          // const timestamp = 1301090400
          const date = new Date(days * 1000)

          // console.warn('remaing', datevalues)

          const datevalues = [date.getMonth() + 1, date.getDate()]

          console.warn('remaing', date)
        }

        // setFormData((preventData) => {
        //   return {
        //     ...preventData,
        //     code: code,
        //     usd: usd,
        //     plan: plan,
        //     usedBy: usedBy,
        //   }
      }
      // )
    }
  }

  // firebase update function
  const update = async () => {
    setLoading(true)
    await updateDoc(doc(db, 'referral', editId), {
      // code: code,
      // usd: usd,
      // plan: plan,
      // agent: agent,
      // used: used,
      codeIssued: codeIssued,
    }).then(() => {
      setLoading(false)
      setEditVisible(false)
      getReferrals()
      reset()
    })
  }

  // firebase delete function
  const Delete = async () => {
    setWarning(true)
    // setLoading(true)
    // await deleteDoc(doc(db, 'referral', editId)).then(() => {
    //   userUnsubscribe()
    //   setEditVisible(false)
    //   getReferrals()
    // })
  }
  const deleteYes = async () => {
    deleteDoc(doc(db, 'referral', editId)).then(() => {
      setLoading(false)
      setWarning(false)
      setEditVisible(false)
      reset()
    })
  }

  // firebase update function
  const userUnsubscribe = async () => {
    let subscriptionEnable = [
      {
        status: false,
        subscriptionDate: null,
        expireDate: null,
        subscriptionPlan: null,
      },
    ]

    await updateDoc(doc(db, 'users', usedBy), {
      subscription: subscriptionEnable,
    }).then(() => {
      console.log('unsubscribed')
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((preventData) => {
      console.log('name === ', name)
      console.log('value === ', value)
      return { ...preventData, [name]: value }
    })

    if (value === 'Monthly') {
      changePrice('usd', 3)
    }

    if (value === 'Annual') {
      changePrice('usd', 30)
    }
  }
  const handleChangeAgent = (e) => {
    const { name, value } = e.target
    setFormData((preventData) => {
      console.log('name === ', name)
      console.log('value === ', value)
      return { ...preventData, [name]: value }
    })
  }

  const getAgentName= async () =>{
    let q = query(collection(db, 'agents'))
    const data = await getDocs(q).then(function (data) {
      setAgentNameList(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
}
console.log('setAgentNameList  ========>>>', agentNameList);

useEffect(()=> {
    getAgentName()
}, [])
  const handleChangeForAddNew = (e) => {
    const { name, value } = e.target
    setFormData((preventData) => {
      console.log('name === ', name)
      console.log('value === ', value)
      return { ...preventData, [name]: value }
    })

    if (value === 'Monthly') {
      changePrice('usd', 3)
    }

    if (value === 'Annual') {
      changePrice('usd', 30)
    }
  }

  const changePrice = (name, value) => {
    setFormData((preventData) => {
      return { ...preventData, [name]: value }
    })
  }

  const OpenNew = () => {
    reset()
    setVisible(!visible)
  }

  const handleOnClose = () => {
    setVisible(false)
    reset()
  }
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDataa = filteredData.filter((data) =>
    data.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  // const setDateRangeFilter = (startDate, endDate) => {
  //   let filteredDateData = filteredData.filter((element) => {
  //     const createdDate = element.createAt.toDate()
  //     return createdDate >= startDate && createdDate <= endDate
  //   })
  //   setFilteredData(
  //     filteredDateData.map((doc) => ({
  //       ...doc,
  //     })),
  //   )
  //   console.log('created date ===> ', filteredDateDataa)
  // }

  const setDateRangeFilter = (startDate, endDate) => {
    const filteredDateData = filteredData.filter((element) => {
      const createdDate = element.createAt.toDate()
      console.log('createdDate ===>', createdDate)
      return createdDate >= startDate && createdDate <= endDate
    })
    setFilteredData(
      filteredDateData.map((doc) => ({
        ...doc,
      })),
    )
    console.log('created date ===> ', filteredDateDataa)
    setResetVisible(true)
    setDataFilterVisible(false)
  }

  const handleResetVisible = () => {
    setResetVisible(false)
    setDataFilterVisible(true)
    setSelectedStartDate('')
    setSelectedEndDate('')
    setFilteredData([])
    reset()
  }

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleExportClick = () => {
    // Convert data to CSV format
    const header = ['ID', 'CODE', 'AGENT', 'PLAN', '$', 'STATUS','REMARK']
    const rows = filteredData.map(({ id, code, agent, plan, usd, used,remark }) => [
      id,
      code,
      agent,
      plan === 'Monthly'
        ? 'Monthly'
        : plan === '3 Months'
        ? '3 Months'
        : plan === '6 Months'
        ? '6 Months'
        : plan === 'Annual'
        ? 'Annual'
        : '',
      `${usd}USD`,
      used ? 'Used' : '',
      remark,
    ])
    const csvRows = [header, ...rows]
    const csvData = csvRows.map((row) => row.join(',')).join('\n')
    setCsvData(csvData)

    // Download CSV file
    const link = document.createElement('a')
    link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`)
    {
      used == 'true'
        ? link.setAttribute('download', 'UsedPromoCodesTable.csv')
        : link.setAttribute('download', 'PromoCodesTable.csv')
    }
    link.click()
  }

  const handleCheckboxChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      codeIssued: event.target.checked,
    }))
  }

  const handleEditOnClose = () => {
    setEditVisible(false)
    reset()
  }

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date)
    const startGMT = date
    const startDate1 = new Date(startGMT)
    const startMonth1 = startDate1.getMonth()
    const startYear1 = startDate1.getFullYear()
    const startDay1 = startDate1.getDate()
    setStartMonth(startMonth1 + 1)
    setStartYear(startYear1)
    setStartDate(startDay1)
    console.log('start Date ===>', startYear, '-', startMonth, '-', startDate)
  }

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date)
    const endGMT = date
    const endDate1 = new Date(endGMT)
    const endMonth1 = endDate1.getMonth()
    const endYear1 = endDate1.getFullYear()
    const endDay1 = endDate1.getDate()
    setEndMonth(endMonth1 + 1)
    setEndYear(endYear1)
    setEndDate(endDay1)
    console.log('start Date ===>', endYear, '-', endMonth, '-', endDate)
  }

  const [editRemarks, setEditRemarks] = useState({});

  const updateRemark = async (id, newRemark) => {
    setLoading(true);
    setFilteredData((currentData) =>
      currentData.map((data) => {
        if (data.id === id) {
          return { ...data, remark: newRemark };
        }
        return data;
      }),
    );
    // Update the database
    const docRef = doc(CollectionRef, id);
    await updateDoc(docRef, { remark: newRemark });
  
    setLoading(false);
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <br />
      <CRow>
        <CCol md={2}>
          <CFormSelect
            name="agent"
            id="validationTooltip04"
            onChange={handleChangeAgent}
            required
            value={agent}
          >
            <option value="">Select Agent</option>
              {agentNameList.map((item) => {
                return (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                )
              })}
          </CFormSelect>
        </CCol>
        <CCol sm={2}>
          <CFormSelect
            name="plan"
            id="validationTooltip04"
            onChange={handleChange}
            required
            value={plan}
          >
            <option value="">Select Plan</option>
            <option value="Monthly">Monthly</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="Annual">Annual</option>
          </CFormSelect>
        </CCol>
        <CCol sm={2}>
          <CFormSelect
            name="used"
            id="validationTooltip04"
            onChange={handleChange}
            required
            value={used}
          >
            <option value="">Select Status</option>
            <option value="true">Used</option>
            <option value="false">Not used</option>
          </CFormSelect>
        </CCol>
        <CCol md={4} className="position-relative">
          <input
            placeholder={'Search code here'}
            type="text"
            onChange={handleSearch}
            value={searchQuery}
          />
        </CCol>
        <CCol md={2} className="position-relative">
          <CButton color={'primary'} onClick={handleExportClick}>
            Export to CSV
          </CButton>
        </CCol>
      </CRow>
      <br />
      <CRow>
        <CCol sm={2}>
          <DatePicker
            selected={selectedStartDate}
            onChange={handleStartDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select start Date"
          />
        </CCol>
        <CCol sm={3}>
          <DatePicker
            selected={selectedEndDate}
            onChange={handleEndDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select End Date"
          />
        </CCol>
        <CCol sm={3}>
          {dataFilterVisible == true ? (
            <CButton onClick={() => setDateRangeFilter(selectedStartDate, selectedEndDate)}>
              Date Filter
            </CButton>
          ) : (
            <CButton onClick={handleResetVisible}>Reset Filter</CButton>
          )}
        </CCol>
      </CRow>
      <br />
      <CModal alignment="center" visible={warning} onClose={() => setWarning(false)}>
        <CModalHeader>
          <CModalTitle>Warning!</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="staticEmail" className="col-sm-12 col-form-label">
              This code already using
            </CFormLabel>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setWarning(false)}>
            NO
          </CButton>
          <CButton color="primary" onClick={() => deleteYes()}>
            YES! DELETE
          </CButton>
        </CModalFooter>
      </CModal>

      {/* CREATE */}
      <CModal alignment="center" visible={visible} onClose={handleOnClose}>
        <CModalHeader>
          <CModalTitle>CREATE</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CRow className="mb-3">
              <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
                Agent
              </CFormLabel>
              <CCol sm={8}>
                <CFormSelect
                  name="agent"
                  id="validationTooltip04"
                  onChange={handleChange}
                  required
                  // value={agentName}
                  value={agent}
                >
                  <option value="">Select Agent</option>
                  {/* {agentNameList.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    )
                  })} */}
                  {/* <option value="Susila Production">Susila Production</option>
                  <option value="Trico Global Network">Trico Global Network</option>
                  <option value="Influences">Influences</option>
                  <option value="Others">Others</option> */}

                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
                plan
              </CFormLabel>
              <CCol sm={8}>
                <CFormSelect
                  name="plan"
                  id="validationTooltip04"
                  onChange={handleChange}
                  required
                  value={plan}
                >
                  <option value="">Select Plan</option>
                  <option value="Monthly">Monthly</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="Annual">Annual</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              Bulk
            </CFormLabel>
            <CCol sm={6}>
              <CFormInput
                type="number"
                name="bulk"
                id="validationTooltip04"
                onChange={handleChange}
                required
                value={bulk}
              />
            </CCol>

            {/*<CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">*/}
            {/*  CODE*/}
            {/*</CFormLabel>*/}
            {/*<CCol sm={6}>*/}
            {/*  <CFormInput*/}
            {/*    disabled*/}
            {/*    type="text"*/}
            {/*    name="code"*/}
            {/*    id="validationTooltip04"*/}
            {/*    onChange={handleChange}*/}
            {/*    required*/}
            {/*    maxLength={20}*/}
            {/*    value={code}*/}
            {/*  />*/}
            {/*</CCol>*/}
          </CRow>
          <CRow>
            <CCol sm={6}></CCol>
            <CCol sm={6}>
              <CButton padding={15} color="warning" onClick={() => generatePin()}>
                GET
              </CButton>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          {/*<CButton color="primary" onClick={() => StoreData()}>*/}
          {/*  Save*/}
          {/*</CButton>*/}
        </CModalFooter>
      </CModal>

      {/* UPDATE*/}
      <CModal alignment="center" visible={editVisible} onClose={handleEditOnClose}>
        <CModalHeader>
          <CModalTitle>UPDATE</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              CODE
            </CFormLabel>
            <CCol sm={6}>
              <CFormInput
                disabled
                type="text"
                name="code"
                id="validationTooltip04"
                onChange={handleChange}
                required
                value={code}
              />
            </CCol>
            {/*<CCol sm={2}>*/}
            {/*  <CButton color="warning" onClick={() => generatePin()}>*/}
            {/*    GET*/}
            {/*  </CButton>*/}
            {/*</CCol>*/}
          </CRow>
          <CRow>
            <CFormCheck
              onChange={handleCheckboxChange}
              id="flexCheckChecked"
              label="Issued"
              checked={codeIssued}
            />
          </CRow>

          {/*<CRow className="mb-3">*/}
            {/*  <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">*/}
            {/*    plan*/}
            {/*  </CFormLabel>*/}
            {/*  <CCol sm={8}>*/}
            {/*    <CFormSelect*/}
            {/*      name="plan"*/}
            {/*      id="validationTooltip04"*/}
            {/*      onChange={handleChange}*/}
            {/*      required*/}
            {/*      value={plan}*/}
            {/*    >*/}
            {/*      <option value="">Select Plan</option>*/}
            {/*      <option value="Monthly">Monthly</option>*/}
            {/*      <option value="3 Months">3 Months</option>*/}
            {/*      <option value="6 Months">6 Months</option>*/}
            {/*      <option value="Annual">Annual</option>*/}
            {/*    </CFormSelect>*/}
            {/*  </CCol>*/}
          {/*</CRow>*/}
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

      {/* READ */}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">CODE</CTableHeaderCell>
            <CTableHeaderCell scope="col">DATE ISSUED<br/>   </CTableHeaderCell>
            <CTableHeaderCell scope="col">AGENT</CTableHeaderCell>
            <CTableHeaderCell scope="col">PLAN</CTableHeaderCell>
            <CTableHeaderCell scope="col">$</CTableHeaderCell>
            <CTableHeaderCell scope="col">ISSUED</CTableHeaderCell>
            <CTableHeaderCell scope="col">USED DATE</CTableHeaderCell>
            <CTableHeaderCell scope="col">STATUS</CTableHeaderCell>
            <CTableHeaderCell scope="col">REMARK</CTableHeaderCell>
            {/*<CTableHeaderCell scope="col">ACTION</CTableHeaderCell>*/}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredDataa.map((data, index) => {
              const highlightStyle = { backgroundColor: 'lightgreen' };
              const hasRemark = data.remark && data.remark.trim().length > 0;
            return (
              <CTableRow
                key={data.id}
                style={hasRemark ? highlightStyle : null} 
              >
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>
                  <CFormLabel>{data.code}</CFormLabel>
                </CTableDataCell>
                <CTableDataCell>
                  <CFormLabel>{data.createAt ?.toDate().toLocaleDateString()}</CFormLabel>
                </CTableDataCell>
                <CTableDataCell>{data.agent}</CTableDataCell>
                {data.plan == 'Monthly' ? (
                  <>
                    <CTableDataCell>
                      <CBadge color="primary"> {data.plan}</CBadge>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CBadge color="primary"> {data.usd}USD</CBadge>
                    </CTableDataCell>
                  </>
                ) : (
                  <>
                    <CTableDataCell>
                      <CBadge color="warning"> {data.plan}</CBadge>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CBadge color="warning"> {data.usd}USD</CBadge>
                    </CTableDataCell>
                  </>
                )}
                <CTableDataCell>{data.codeIssued && data.codeIssued ? 'Yes' : 'No'}</CTableDataCell>
                <CTableDataCell>
                  <CFormLabel>{data.usedDate && data.usedDate?.toDate().toLocaleDateString()}</CFormLabel>
                </CTableDataCell>
                <CTableDataCell>
                  {data.used ? <CBadge color="danger"> Used</CBadge> : null}
                </CTableDataCell>
                {/* <CTableDataCell>
                  {data.remark  && data.remark ? <CFormLabel>{data.remark}</CFormLabel> : <CFormInput></CFormInput>}
                </CTableDataCell> */}

                <CTableDataCell>
                  {editRemarks[data.id] !== undefined ? (
                    <CFormInput
                      value={editRemarks[data.id]}
                      onChange={(e) => setEditRemarks({ ...editRemarks, [data.id]: e.target.value })}
                      onBlur={() => {
                        updateRemark(data.id, editRemarks[data.id]);
                        setEditRemarks(prev => ({ ...prev, [data.id]: undefined }));
                      }}
                    />
                  ) : (
                    <CFormLabel onClick={() => setEditRemarks({ ...editRemarks, [data.id]: data.remark || '' })}>
                      {data.remark || 'add remark'}
                    </CFormLabel>
                  )}
                </CTableDataCell>
                {/*<CTableDataCell>*/}
                {/*  <CButton*/}
                {/*    color="success"*/}
                {/*    className="me-md-4"*/}
                {/*    active*/}
                {/*    tabIndex={-1}*/}
                {/*    onClick={() => edit(data.id)}*/}
                {/*  >*/}
                {/*    Edit*/}
                {/*  </CButton>*/}
                {/*</CTableDataCell>*/}
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
            <h2>Referral Codes</h2>
          </CCardHeader>
          <CCardBody>{Body()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
