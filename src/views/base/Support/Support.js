import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CCardHeader,
  CCard,
  CCardBody,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormLabel,
  CFormSelect,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import {
  collection,
  getDocs,
  query,
  doc,
  updateDoc,
  Timestamp,
  where,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import Loading from 'src/components/loading/Loading'
import data from '@coreui/coreui/js/src/dom/data'
import { useParams } from 'react-router-dom'
import { left } from 'core-js/internals/array-reduce'

const UserData = () => {
  const params = useParams()
  const [currentData, setCurrentData] = useState('')
  const [loading, setLoading] = useState(true)
  const CollectionRef = collection(db, 'users')
  const [pullDetailsVisible, setPullDetailsVisible] = useState(false)
  const [warningVisible, setWarningVisible] = useState(false)
  const [subscriptionDate, setSubscriptionDate] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [subscriptionPlan, setSubscriptionPlan] = useState('')
  const [subscription, setSubscription] = useState([])
  const [nikeName, setNikeName] = useState('')
  const [status, setStatus] = useState('')
  const [plan, setPlan] = useState('')
  const [formValue, setFormValue] = useState({
    subscription: '',
    used: '',
  })
  const [formData, setFormData] = useState({
    subscription: '',
  })
  const [selectedSubscription, setSelectedSubscription] = useState('')
  const [phoneNumberQuery, setPhoneNumberQuery] = useState('')
  const [selectedUserSubscriptionStatus, setSelectedUserSubscriptionStatus] = useState(false)
  const [selectedUserSubscriptionPlan, setSelectedUserSubscriptionPlan] = useState('')
  const [selectedUserSubscriptionDate, setSelectedUserSubscriptionDate] = useState('')
  const [selectedUserExpirationDate, setSelectedUserExpirationDate] = useState('')
  const [selectedUserID, setSelectedUserID] = useState('')
  const [showTable, setShowTable] = useState(false)
  const [unsubscribeButtonVisible, setUnsubscribeButtonVisible] = useState(true)
  const [myData, setMyData] = useState([])
  const [csvData, setCsvData] = useState('')

  // FIREBASE - GET BANNER FROM FIRESTORE
  const getUser = async () => {
    setLoading(true)
    let q = query(CollectionRef)
    const data = await getDocs(q).then(function (data) {
      setMyData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          subscriptionPlan: doc.data().subscription?.subscriptionPlan,
          status: doc.data().subscription?.status,
        })),
      )

      setLoading(false)
    })
  }

  const removePremiumAccess = async (userID) => {
    setLoading(true)
    const subscriptionDateTimestamp = Timestamp.fromDate(new Date(selectedUserSubscriptionDate))
    const expirationDateTimestamp = Timestamp.fromDate(new Date(selectedUserExpirationDate))

    let subscriptionDisable = [
      {
        status: false,
        subscriptionDate: subscriptionDateTimestamp,
        expirationDate: expirationDateTimestamp,
        subscriptionPlan: selectedUserSubscriptionPlan,
      },
    ]

    await updateDoc(doc(db, 'users', userID), {
      subscription: subscriptionDisable,
    }).then(() => {
      alert('User Unsubscribed')
      setLoading(false)
      setWarningVisible(false)
      getUser()
      setUnsubscribeButtonVisible(false)
    })
  }

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getUser()
    // getUserData()
  }, [params.id])

  const pullDetailsClose = async () => {
    setPullDetailsVisible(false)
  }

  const [searchQuery, setSearchQuery] = useState('')

  // const filteredDataa = myData.filter(
  //   (data) =>
  //     (data.email || data.phoneNumber) &&
  //     data.email?.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //     (selectedSubscription === '' ||
  //       data.subscription[0].status === (selectedSubscription === 'Premium')) &&
  //     (phoneNumberQuery === '' ||
  //       data.phoneNumber?.toLowerCase().includes(phoneNumberQuery.toLowerCase())),
  // )

  // const filteredDataa = myData.filter(
  //   (data) =>
  //     phoneNumberQuery === '' ||
  //     data.phoneNumber?.toLowerCase().includes(phoneNumberQuery.toLowerCase()),
  // )

  // const filteredDataa = myData.filter(
  //   (data) =>
  //     (data.email ||
  //     data.phoneNumber) ||
  //     (data.email?.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //       (selectedSubscription === '' ||
  //         data.subscription[0].status) ||
  //       (phoneNumberQuery === '' ||
  //         data.phoneNumber?.toLowerCase().includes(phoneNumberQuery.toLowerCase()))),
  // )

  //
  // const filteredDataa = myData.filter((data) => {
  //   // data.email?.toLowerCase().includes(searchQuery.toLowerCase())
  //   (data.email !== "")
  // });

  // const filteredDataa = myData.filter(
  //   (data) =>
  //     ((data.email || data.phoneNumber) && searchQuery !== "") ||
  //     data.email?.toLowerCase().includes(searchQuery.toLowerCase())
  //     // &&
  //     // (selectedSubscription === '' ||
  //     //   data.subscription[0].status === (selectedSubscription === 'Premium')) &&
  //     // (phoneNumberQuery === '' ||
  //     //   data.phoneNumber?.toLowerCase().includes(phoneNumberQuery.toLowerCase())),
  // )

  // const filteredDataa = myData.filter((data)=> {
  //   if(selectedSubscription == 'Free' && data.subscription && data.subscription[0].status == false){
  //     return data
  //   }
  //   if (searchQuery !== ""){
  //     return data.email?.toLowerCase().includes(searchQuery.toLowerCase());
  //   }else if (phoneNumberQuery !== "") {
  //     return data.phoneNumber?.toLowerCase().includes(phoneNumberQuery.toLowerCase());
  //   }else {
  //     return  data;
  //   }
  //
  // })

  const filteredDataa = myData.filter((data) => {
    const matchesSearchQuery = searchQuery !== "" && data.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhoneNumberQuery = phoneNumberQuery !== "" && data.phoneNumber?.toLowerCase().includes(phoneNumberQuery.toLowerCase());
    const matchesSelectedSubscription = selectedSubscription === 'Free' && data.subscription && !data.subscription[0].status;
    const matchesSelectedSubscription2 = selectedSubscription === 'Premium' && data.subscription && data.subscription[0].status;
    const matchesSelectedSubscription3 = selectedSubscription === '';

    // if (matchesSearchQuery && matchesSelectedSubscription2 ) {
    //   return true;
    // }

    if (matchesSearchQuery || matchesPhoneNumberQuery && matchesSearchQuery || matchesPhoneNumberQuery || matchesSelectedSubscription || matchesSelectedSubscription2 ) {
      return true;
    }
    return false;
  });
  // const filteredDataa = myData.filter(
  //   (data) =>
  //     (data.email || data.phoneNumber) &&
  //     data.email?.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //     (selectedSubscription === '' ||
  //       data.subscription[0].status === (selectedSubscription === 'Premium')) &&
  //     (phoneNumberQuery === '' ||
  //       data.phoneNumber?.toLowerCase().includes(phoneNumberQuery.toLowerCase())),
  // )
  useEffect(() => {
    console.log('users log for myData 2 ====> ', myData)
    if (searchQuery != '') {
      setShowTable(true)
    } else if (phoneNumberQuery != '') {
      setShowTable(true)
    } else {
      setShowTable(false)
    }
  }, [filteredDataa])

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }
  const handleExportClick = () => {
    // Convert data to CSV format
    const header = ['E-mail','Phone No', 'Joined Date','Subscription Start Date','Subscription End Date', 'Country', 'Subcription', 'Subscription Plane']
    const rows = filteredDataa.map(({ phoneNumber,email,createdDate, country, subscription, subscriptionPlan}) => [
      email || 'N/A',
      phoneNumber || 'N/A',
      createdDate || 'N/A',
      formatDate(subscription[0].expirationDate ),
      formatDate(subscription[0].expirationDate) ,
      country || 'N/A',
      subscription && subscription[0] && subscription[0].status ? 'Premium' : 'Free',
      subscription[0].subscriptionPlan,
    ])
    const csvRows = [header, ...rows]
    const csvData = csvRows.map((row) => row.map(cell => cell === null ? '' : cell).join(',')).join('\n')
    setCsvData(csvData)
    // Download CSV file
    const link = document.createElement('a')
    link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`)
    console.log(csvData);
    link.click()
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString.seconds * 1000 + dateString.nanoseconds / 1000000);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
  }

  const [searchQuery2, setSearchQuery2] = useState('')

  const handlePhoneSearch = (event) => {
    setPhoneNumberQuery(event.target.value)
  }

  const handleUnsubscribe = () => {
    setWarningVisible(true)
  }

  const warningClose = async () => {
    setWarningVisible(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    setSelectedSubscription(value)
  }

  const showPullDetails = (userID, status, subscriptionPlan, subscriptionDate, expirationDate) => {
    console.log('show result===>', subscriptionPlan)
    console.log('show result===>', subscriptionDate)
    setSelectedUserSubscriptionStatus(status)
    setSelectedUserSubscriptionPlan(subscriptionPlan)
    setSelectedUserSubscriptionDate(subscriptionDate)
    setSelectedUserExpirationDate(expirationDate)
    setSelectedUserID(userID)
    setPullDetailsVisible(true)
    setUnsubscribeButtonVisible(true)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <CRow>
        <CCol md={11} className="position-relative">
          {/*<CButton color="primary">Search User</CButton>*/}
          <p style={{ fontSize: 20, textAlign: 'right' }}>
            <b>Total users : {myData.length}</b>
          </p>
        </CCol>
        {/*<CCol md={2} className="position-relative">*/}
        {/*  <CButton color="secondary">Messages</CButton>*/}
        {/*</CCol>*/}
      </CRow>
      <CRow>
        <CCol md={11} className="position-relative">
          {/*<CButton color="primary">Search User</CButton>*/}
          <p style={{ fontSize: 20, textAlign: 'right' }}>
            <b>Total {selectedSubscription} subscription : {filteredDataa.length}</b>
          </p>
        </CCol>
        {/*<CCol md={2} className="position-relative">*/}
        {/*  <CButton color="secondary">Messages</CButton>*/}
        {/*</CCol>*/}
      </CRow>
      <br />
      <CRow>
        <CCol md={4} className="position-relative">
          Email :
          <input
            placeholder={'Search email here'}
            type="text"
            onChange={handleSearch}
            value={searchQuery}
          />
        </CCol>
        <br />
        <CCol md={4} className="position-relative">
          Phone No :
          <input
            placeholder={'Search phone no. here'}
            type="text"
            onChange={handlePhoneSearch}
            value={phoneNumberQuery}
          />
        </CCol>
        <CCol sm={2}>
          <CFormSelect
            name="plan"
            id="validationTooltip04"
            onChange={handleChange}
            required
            value={selectedSubscription}
          >
            <option value="">Subscription</option>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </CFormSelect>
        </CCol>
        <CCol md={2} className="position-relative">
          <CButton color={'primary'} onClick={handleExportClick}>
            Export to CSV
          </CButton>
        </CCol>
      </CRow>
      <br />
      <CModal alignment="center" visible={pullDetailsVisible} onClose={pullDetailsClose}>
        <CModalHeader>
          <CModalTitle>Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CCol>
              <CRow>Subscription Plan :{selectedUserSubscriptionPlan}</CRow>
              <CRow>Subscription Date :{selectedUserSubscriptionDate}</CRow>
              <CRow>Expiration Date :{selectedUserExpirationDate}</CRow>
              <CRow>Promocode :</CRow>
              <br />
              <center>
                <CRow>
                  <CCol xs={12} className="position-relative">
                    {unsubscribeButtonVisible ? (
                      <CButton color="danger" onClick={() => setWarningVisible(true)}>
                        Unsubscribe
                      </CButton>
                    ) : null}
                  </CCol>
                </CRow>
              </center>
            </CCol>
          </CForm>
        </CModalBody>
      </CModal>
      <CModal alignment="center" visible={warningVisible} onClose={warningClose}>
        <CModalHeader>
          <CModalTitle>Warning</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CCol>
              <CRow>Are you sure you want to unsubscribe ?</CRow>
              <br />
              <CRow>
                <CCol xs={4} className="position-relative">
                  <CButton color="danger" onClick={() => removePremiumAccess(selectedUserID)}>
                    Yes,Unsubscribe
                  </CButton>
                </CCol>
                <CCol xs={4} className="position-relative">
                  <CButton color="secondary" onClick={() => setWarningVisible(false)}>
                    No
                  </CButton>
                </CCol>
              </CRow>
            </CCol>
          </CForm>
        </CModalBody>
      </CModal>

      {/* react - Table sub categories list */}
      {/*{showTable && (*/}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            {/*<CTableHeaderCell scope="col">User</CTableHeaderCell>*/}
            {/*<CTableHeaderCell scope="col">E-mail</CTableHeaderCell>*/}
            <CTableHeaderCell scope="col">E-mail/Phone No.</CTableHeaderCell>
            <CTableHeaderCell scope="col">Joined Date </CTableHeaderCell>
            <CTableHeaderCell scope="col">Subscription Start Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Subscription End Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Country</CTableHeaderCell>
            <CTableHeaderCell scope="col">Subscription</CTableHeaderCell>
            <CTableHeaderCell scope="col">Subscription Plan</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {/* {filteredDataa.map((data, index) => {
            const phoneNumber = data.phoneNumber != null ? data.phoneNumber : '-' */}
            
          {filteredDataa
            .slice()
            .sort((a,b) => b.createdDate - a.createdDate)
            .map((data, index) =>{
              const phoneNumber = data.phoneNumber != null ? data.phoneNumber : '-';

            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                {/*<CTableDataCell>{data.nikeName ? data.nikeName : data.phoneNumber}</CTableDataCell>*/}
                {/*<CTableDataCell>{data.email}</CTableDataCell>*/}
                <CTableDataCell>
                  {data.phoneNumber ? data.phoneNumber : data.email}
                </CTableDataCell>
                {phoneNumber != '-'
                  ? console.log('Phone Number===>', data.phoneNumber)
                  : console.log('Phone Number===> null')}
                  <CTableDataCell>
                  <CFormLabel>
                    {data.createdDate ? data.createdDate.toDate().toLocaleDateString() : 'N/A'}
                  </CFormLabel>
                </CTableDataCell>
                {/* <CTableDataCell>
                  {data.subscription && data.subscription[0].subscriptionDate
                    ? data.subscription[0].subscriptionDate?.toDate().toLocaleDateString()
                    : '-'}
                </CTableDataCell> */}
                <CTableDataCell>
                    {data.subscription && data.subscription.length > 0 ? (
                          data.subscription
                            .map(sub => sub.subscriptionDate?.toDate())
                            .filter(date => date instanceof Date && !isNaN(date.getTime()))
                            .sort((a, b) => b - a)
                            .map(date => date.toLocaleDateString())
                            .join(', ')
                        ) : (
                          '-'
                    )}
                </CTableDataCell>
                <CTableDataCell>
                  {data.subscription && data.subscription[0].expirationDate
                    ? data.subscription[0].expirationDate?.toDate().toLocaleDateString()
                    : '-'}
                </CTableDataCell>
                <CTableDataCell>{data.country ? data.country : 'N/A'}</CTableDataCell>
                <CTableDataCell>
                  {data.subscription && data.subscription[0].status ? (
                    <CBadge color="warning"> Premium</CBadge>
                  ) : (
                    <CBadge color="primary">Free</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {data.subscription && data.subscription[0].status ? data.subscription[0].subscriptionPlan : '-'}
                </CTableDataCell>
                <CTableDataCell>
                  {data.subscription && data.subscription[0].status ? (
                    <CButton
                      color="success"
                      size="sm"
                      onClick={() =>
                        showPullDetails(
                          data.id,
                          data.subscription[0].status,
                          // data.subscription[0].subscriptionPlan,
                          new Date(data.subscription[0].subscriptionDate.toDate()).toDateString(),
                          new Date(data.subscription[0].expirationDate.toDate()).toDateString(),
                        )
                      }
                    >
                      Pull details
                    </CButton>
                  ) : null}
                </CTableDataCell>
                {/*<CTableDataCell>*/}
                {/*  {data.subscription[0].status ? (*/}
                {/*    <CButton color="danger" size="sm" onClick={() => removePremiumAccess(data.id)}>*/}
                {/*      Unsubscribe*/}
                {/*    </CButton>*/}
                {/*  ) : null}*/}
                {/*</CTableDataCell>*/}
              </CTableRow>
            )
            
          })}  
          {/* })} */}
        </CTableBody>
      </CTable>
      {/*)}*/}
    </>
  )
}

const Index = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>SUPPORT</h2>
          </CCardHeader>
          <CCardBody>{UserData()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
