// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CRow,
//   CCol,
//   CCardHeader,
//   CCard,
//   CCardBody,
//   CBadge,
//   CButton,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CForm,
//   CFormLabel,
//   CFormSelect,
// } from '@coreui/react'
// import React, { useEffect, useState } from 'react'
// import { db } from '../../firebase'
// import {
//   collection,
//   getDocs,
//   query,
//   doc,
//   updateDoc,
//   where,
//   getDoc,
//   Timestamp,
//   setDoc,
// } from 'firebase/firestore'
// import Loading from 'src/components/loading/Loading'
// import data from '@coreui/coreui/js/src/dom/data'
// import { useParams } from 'react-router-dom'
//
// const UserData = () => {
//   const params = useParams()
//   const [myData, setMyData] = useState([])
//   const [currentData, setCurrentData] = useState('')
//   const [loading, setLoading] = useState(true)
//   const CollectionRef = collection(db, 'users')
//   const [infoVisible, setInfoVisible] = useState(false)
//   const [subscriptionDate, setSubscriptionDate] = useState('')
//   const [statusForInfo, setStatusForInfo] = useState('')
//   const [expirationDate, setExpirationDate] = useState('')
//   const [subscriptionPlan, setSubscriptionPlan] = useState('')
//   const [subscription, setSubscription] = useState([])
//   const [nikeName, setNikeName] = useState('')
//   const [status, setStatus] = useState('')
//   // const [formValue, setFormValue] = useState({
//   //   status: '',
//   // })
//   // const { status } = formValue
//
//   // FIREBASE - GET BANNER FROM FIRESTORE
//   const getUser = async () => {
//     setLoading(true)
//     let q = query(CollectionRef)
//     const data = await getDocs(q).then(function (data) {
//       setMyData(
//         data.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id,
//         })),
//       )
//
//       setLoading(false)
//     })
//   }
//
//   const getUserDetails = async (userID) => {
//     console.log('inside of the get details', userID)
//     setInfoVisible(true)
//     const docRef = doc(db, 'users', userID)
//     const docSnap = await getDoc(docRef)
//     if (docSnap.exists()) {
//       //const userData = userDoc.data()
//       let { subscription, nikeName } = docSnap.data()
//       setStatus(subscription[0]['status'])
//       //setExpirationDate(subscription[0]['expirationDate'])
//       //setSubscriptionDate(subscription[0]['subscriptionDate'])
//       setSubscriptionPlan(subscription[0]['subscriptionPlan'])
//       setSubscription(subscription)
//       setNikeName(nikeName)
//       {
//         /*console.log('print subs==>', subscription[0]['subscriptionDate'])
//       console.log(
//         new Intl.DateTimeFormat('en-US', {
//           year: 'numeric',
//           month: '2-digit',
//           day: '2-digit',
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit',
//         }).format(subscription[0]['subscriptionDate']),
//       )
//       Use the status, subscriptionDate, expireDate, and subscriptionPlan values here*/
//       }
//     }
//   }
//
//   // const FilterFunction = async () => {
//   //   setLoading(true)
//   //   let q = query(CollectionRef)
//   //   // q = query(q, where('subscription', '==', subscription))
//   //   if (!status == '') {
//   //     q = query(q, where('status', '==', status))
//   //     console.log('Print q :', q)
//   //   }
//   //   const data = await getDocs(q).then(function (data) {
//   //     setMyData(
//   //       data.docs.map((doc) => ({
//   //         ...doc.data(),
//   //         id: doc.id,
//   //       })),
//   //     )
//   //     setLoading(false)
//   //   })
//   // }
//
//   const removePremiumAccess = async (userID) => {
//     setLoading(true)
//
//     let subscriptionDisable = [
//       {
//         status: false,
//         subscriptionDate: null,
//         expireDate: null,
//         subscriptionPlan: null,
//       },
//     ]
//
//     await updateDoc(doc(db, 'users', userID), {
//       subscription: subscriptionDisable,
//       //subscriptionType: subscriptionType,
//     }).then(() => {
//       getUser()
//       //getUserDetails()
//       setLoading(false)
//     })
//   }
//   // useEffect(() => {
//   //   FilterFunction()
//   // }, [status])
//
//   // REACT JS - USE EFFECT FUNCTION
//   useEffect(() => {
//     getUser()
//     //getUserDetails(params.id)
//   }, [params.id])
//
//   // const handleChange = (event) => {
//   //   const { name, value } = event.target
//   //   setFormValue((prevState) => {
//   //     return {
//   //       ...prevState,
//   //       [name]: value,
//   //     }
//   //   })
//   // }
//
//   // const [searchQuery, setSearchQuery] = useState('')
//   //
//   // const filteredData = myData.filter((data) => {
//   //   { nikename ? data.nikeName.toLowerCase().includes(searchQuery.toLowerCase()) : null }
//   // })
//   //
//   // const handleSearch = (event) => {
//   //   setSearchQuery(event.target.value)
//   // }
//
//   const infoClose = async () => {
//     setInfoVisible(false)
//     setStatus(false)
//     setSubscriptionDate(null)
//     setSubscriptionPlan(null)
//     setExpirationDate(null)
//   }
//
//   const handleInfo = async (userID) => {
//     getUserDetails(userID)
//   }
//
//   const [searchQuery, setSearchQuery] = useState('')
//
//   const filteredDataa = myData.filter(
//     (data) => data.email && data.email.toLowerCase().includes(searchQuery.toLowerCase()),
//   )
//
//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value)
//   }
//
//   if (loading) {
//     return <Loading />
//   }
//
//   return (
//     <>
//       {/* UPDATE */}
//       <CModal alignment="center" visible={infoVisible} onClose={infoClose}>
//         <CModalHeader>
//           <CModalTitle>User Information</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CForm>
//             {/*//{console.log('Subscription date==>', subscriptionDate)}*/}
//             {/*//{console.log('Subscription plan==>', subscriptionPlan)}*/}
//             {console.log('Subscription status==>', status)}
//             {/*<CCol md={4} className="position-relative">*/}
//             {/*  <CFormLabel>Nike Name : {nikeName ? nikeName : phoneNumber} </CFormLabel>*/}
//             {/*</CCol>*/}
//             {/*<CCol md={4} className="position-relative">*/}
//             {/*  <CFormLabel>Email :</CFormLabel>*/}
//             {/*</CCol>*/}
//             <CCol md={8} className="position-relative">
//               <CFormLabel>Subscription status:{status ? 'Premium' : ' Free'}</CFormLabel>
//             </CCol>
//             {status === true ? (
//               <>
//                 <CCol md={8} className="position-relative">
//                   <CFormLabel>
//                     Subscription Date :
//                     {subscriptionDate === ''
//                       ? '  No date'
//                       : new Date(subscription[0]['subscriptionDate'].toDate()).toDateString()}
//                     {/*// : new Intl.DateTimeFormat('en-US', {*/}
//                     {/*//     year: 'numeric',*/}
//                     {/*//     month: '2-digit',*/}
//                     {/*//     day: '2-digit',*/}
//                     {/*//     hour: '2-digit',*/}
//                     {/*//     minute: '2-digit',*/}
//                     {/*//     second: '2-digit',*/}
//                     {/*//   }).format(subscription[0]['subscriptionDate'])}*/}
//                   </CFormLabel>
//                 </CCol>
//                 <CCol md={8} className="position-relative">
//                   <CFormLabel>
//                     Subscription Plan :{subscriptionPlan === '' ? '  No plan' : subscriptionPlan}
//                   </CFormLabel>
//                 </CCol>
//                 <CCol md={8} className="position-relative">
//                   <CFormLabel>
//                     Expire Date :
//                     {expirationDate === ''
//                       ? '  No expire date'
//                       : new Date(subscription[0]['expirationDate'].toDate()).toDateString()}
//                     {/*// : new Intl.DateTimeFormat('en-US', {*/}
//                     {/*//     year: 'numeric',*/}
//                     {/*//     month: '2-digit',*/}
//                     {/*//     day: '2-digit',*/}
//                     {/*//     hour: '2-digit',*/}
//                     {/*//     minute: '2-digit',*/}
//                     {/*//     second: '2-digit',*/}
//                     {/*//   }).format(subscription[0]['expirationDate'])}*/}
//                   </CFormLabel>
//                 </CCol>
//               </>
//             ) : null}
//           </CForm>
//         </CModalBody>
//       </CModal>
//       <CRow>
//         <CCol md={9}></CCol>
//         <CCol md={3} className="position-relative">
//           <input
//             placeholder={'Search email here'}
//             type="text"
//             onChange={handleSearch}
//             value={searchQuery}
//           />
//         </CCol>
//       </CRow>
//       <br />
//       {/* react - Table sub categories list */}
//       <CTable>
//         <CTableHead color="light">
//           <CTableRow>
//             <CTableHeaderCell scope="col">#</CTableHeaderCell>
//             <CTableHeaderCell scope="col">User</CTableHeaderCell>
//             <CTableHeaderCell scope="col">E-mail</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Subscription</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Information</CTableHeaderCell>
//             <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {filteredDataa.map((data, index) => {
//             return (
//               <CTableRow key={data.id}>
//                 <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
//                 {/* <CTableDataCell>
//                   <img
//                     width={50}
//                     height={50}
//                     style={{ borderRadius: 50 }}
//                     src={data.profile}
//                     alt=""
//                   />
//                 </CTableDataCell> */}
//                 <CTableDataCell>{data.nikeName ? data.nikeName : data.phoneNumber}</CTableDataCell>
//                 <CTableDataCell>{data.email}</CTableDataCell>
//
//                 <CTableDataCell>
//                   {data.subscription[0].status ? (
//                     <CBadge color="warning"> Premium</CBadge>
//                   ) : (
//                     <CBadge color="primary">Free</CBadge>
//                   )}
//                 </CTableDataCell>
//                 <CTableDataCell>
//                   {data.subscription[0].status ? (
//                     <CButton
//                       color="success"
//                       className="me-md-1"
//                       onClick={() => handleInfo(data.id)}
//                     >
//                       Info
//                     </CButton>
//                   ) : null}
//                 </CTableDataCell>
//                 <CTableDataCell>
//                   {data.subscription[0].status ? (
//                     <CButton color="danger" size="sm" onClick={() => removePremiumAccess(data.id)}>
//                       Unsubscribe
//                     </CButton>
//                   ) : null}
//                 </CTableDataCell>
//               </CTableRow>
//             )
//           })}
//         </CTableBody>
//       </CTable>
//     </>
//   )
// }
//
// const Index = () => {
//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <h2>USERS</h2>
//           </CCardHeader>
//           <CCardBody>{UserData()}</CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   )
// }
//
// export default Index
