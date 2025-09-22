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
  CInputGroup,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'
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
import { getMessaging, getToken } from 'firebase/messaging'
import counties from 'src/JSON/countries'

const Notification = () => {
  const [myData, setMyData] = useState([])
  const [loading, setLoading] = useState(true)
  const CollectionRef = collection(db, 'Notification')
  const [visible, setVisible] = useState(false)
  const [country, setCountry] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  })

  // react use form data
  const { title, body } = formData

  // FIREBASE  - GET USER FROM FIRESTORE
  const getNotifications = async () => {
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
        title: '',
        body: '',
      }
    })
    setCountry([])
  }

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getNotifications()
  }, [])

  // firebase - store data into firebase collection
  const SendNotification = async () => {
    // const registrationTokens = [
    //   'fUTivrbs_BAY9V3V1XRwrA:APA91bHE9HVSXGkBEYaSN_UU4ZsONn8y1Bu2Mm39ds9jn1EBYzaTInxkrqCMz5jqao72ytDX8eotud7-lR0WhJzN3uon3i7juSNbLC_XaDSGoNQLZV3Gjye8lR3NlFmji1-D52psqB3f',
    //   'e8uYpPyrvMTYK3Q3OwPLTE:APA91bEUjJR5dRxlVd524WDf-Jnx8cC3XcpGqLENRw1y0g9UPXpE2j_YgqOPqBVdDRQFEY5mlxEgX36zZybBO09QwE8B_Jxu0SHE6T-So47b--Ef8ewRuZULOpFPcncvZ2-HGkpJjF-c',
    //   'f8_4pQhHxyYq-0Uw2uPWa3:APA91bGUxD_EGiYKvoxT4zIRaFZZFQ1f_lRezmx0pRkyxIcBRFqB_-3B1CUx6Ntxsw97cRSKsHLL2-cAqjVWtPNFjP-7jmbakpVo7Xp1uWO8CQ_l15cdk7wJ4mT4g-7MI8AzPqBe2hvm',
    // ]
    // const message = {
    //   data: { score: '850', time: '2:45' },
    //   tokens: registrationTokens,
    // }
    // getMessaging()
    //   .sendMulticast(message)
    //   .then((response) => {
    //     console.log(response.successCount + ' messages were sent successfully').catch((error) => {
    //       console.log('Error sending message:', error)
    //     })
    //   })
    // These registration tokens come from the client FCM SDKs.
    // const registrationTokens = [
    // 'fUTivrbs_BAY9V3V1XRwrA:APA91bHE9HVSXGkBEYaSN_UU4ZsONn8y1Bu2Mm39ds9jn1EBYzaTInxkrqCMz5jqao72ytDX8eotud7-lR0WhJzN3uon3i7juSNbLC_XaDSGoNQLZV3Gjye8lR3NlFmji1-D52psqB3f',
    // 'e8uYpPyrvMTYK3Q3OwPLTE:APA91bEUjJR5dRxlVd524WDf-Jnx8cC3XcpGqLENRw1y0g9UPXpE2j_YgqOPqBVdDRQFEY5mlxEgX36zZybBO09QwE8B_Jxu0SHE6T-So47b--Ef8ewRuZULOpFPcncvZ2-HGkpJjF-c',
    // 'f8_4pQhHxyYq-0Uw2uPWa3:APA91bGUxD_EGiYKvoxT4zIRaFZZFQ1f_lRezmx0pRkyxIcBRFqB_-3B1CUx6Ntxsw97cRSKsHLL2-cAqjVWtPNFjP-7jmbakpVo7Xp1uWO8CQ_l15cdk7wJ4mT4g-7MI8AzPqBe2hvm',
    // ]
    // // The topic name can be optionally prefixed with "/topics/".
    // const topic = 'highScores'
    // const message = {
    //   data: {
    //     score: '850',
    //     time: '2:45',
    //   },
    //   topic: topic,
    // }
    // // Send a message to devices subscribed to the provided topic.
    // getMessaging()
    //   .send(message)
    //   .then((response) => {
    //     // Response is a message ID string.
    //     console.log('Successfully sent message:', response)
    //   })
    //   .catch((error) => {
    //     console.log('Error sending message:', error)
    //   })
    // // Get registration token. Initially this makes a network call, once retrieved
    // // subsequent calls to getToken will return from cache.
    // const messaging = getMessaging()
    // getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' })
    //   .then((currentToken) => {
    //     if (currentToken) {
    //       // Send the token to your server and update the UI if necessary
    //       // ...
    //     } else {
    //       // Show permission request UI
    //       console.log('No registration token available. Request permission to generate one.')
    //       // ...
    //     }
    //   })
    //   .catch((err) => {
    //     console.log('An error occurred while retrieving token. ', err)
    //     // ...
    //   })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((preventData) => {
      return { ...preventData, [name]: value }
    })
  }

  const OpenNew = () => {
    reset()
    setVisible(!visible)
  }

  const countrySelection = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value)
    setCountry(selectedValues)
  }
  if (loading) {
    return <Loading />
  }

  return (
    <>
      <CButton sm={8} onClick={() => OpenNew()}>
        New Push Notification
      </CButton>
      {/* css modal for add */}
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>New Push Notification</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              TITLE
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="text"
                name="title"
                id="validationTooltip04"
                onChange={handleChange}
                required
                value={title}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              BODY
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="text"
                name="body"
                id="validationTooltip04"
                onChange={handleChange}
                value={body}
                required
              />
            </CCol>
          </CRow>
          <CRow>
            <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
              COUNTRIES
            </CFormLabel>
            <CCol md={8} className="position-relative">
              <CFormInput value={country} readOnly />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={4} className="position-relative"></CCol>
            <CCol md={8} className="position-relative">
              <CInputGroup className="mb-1">
                <CFormSelect
                  id="validationTooltip04"
                  name="country"
                  onChange={countrySelection}
                  value={country}
                  multiple
                >
                  <option value="">Country</option>
                  {counties.map((item) => {
                    return (
                      <option key={item.code} value={item.name}>
                        {item.name}
                      </option>
                    )
                  })}
                </CFormSelect>
              </CInputGroup>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => SendNotification()}>
            Send Now
          </CButton>
        </CModalFooter>
      </CModal>

      {/* react - Table sub categories list */}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">TITLE</CTableHeaderCell>
            <CTableHeaderCell scope="col">BODY</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData.map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CBadge color="success"> {data.title}%</CBadge>
                <CTableDataCell>{data.body}</CTableDataCell>
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
            <h2>Send Push Notification</h2>
          </CCardHeader>
          <CCardBody>{Notification()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Validation
