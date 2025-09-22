// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CButton,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormLabel,
//   CFormInput,
//   CFormSelect,
//   CRow,
//   CCol,
//   CCardHeader,
//   CCard,
//   CCardBody,
//   CBadge,
//   CInputGroup,
//   CFormCheck,
// } from '@coreui/react'
// import React, { useEffect, useState } from 'react'
// import { db } from '../../firebase'
// import {
//   addDoc,
//   collection,
//   getDoc,
//   getDocs,
//   where,
//   query,
//   orderBy,
//   doc,
//   setDoc,
//   Timestamp,
//   deleteDoc,
//   updateDoc,
// } from 'firebase/firestore'
// import Loading from 'src/components/loading/Loading'
// import { getMessaging, getToken } from 'firebase/messaging'
//
// const Notification = () => {
//   const [myData, setMyData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const CollectionRef = collection(db, 'Notification')
//   const [visible, setVisible] = useState(false)
//   const [formData, setFormData] = useState({
//     title: '',
//     body: '',
//   })
//   const [adminEmail, setAdminEmail] = useState('')
//   const [adminPassword, setAdminPassword] = useState('')
//   const [createAdminForSL, setCreateAdminForSL] = useState(false)
//   const [createAdminForCPP, setCreateAdminForCPP] = useState(false)
//
//   // react use form data
//   const { title, body } = formData
//
//   // FIREBASE  - GET USER FROM FIRESTORE
//   const getNotifications = async () => {
//     setLoading(true)
//     let q = query(CollectionRef)
//     const data = await getDocs(q).then(function (data) {
//       setMyData(
//         data.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id,
//         })),
//       )
//       setLoading(false)
//     })
//   }
//
//   // REACT JS - USE EFFECT FUNCTION
//   useEffect(() => {
//     getNotifications()
//   }, [])
//
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((preventData) => {
//       return { ...preventData, [name]: value }
//     })
//   }
//
//   const OpenNew = () => {
//     setVisible(!visible)
//   }
//
//   const changeCheckboxForHide = (value) => {
//     // setHide(value)
//   }
//
//   if (loading) {
//     return <Loading />
//   }
//
//   return (
//     <>
//       <CButton sm={8} onClick={() => OpenNew()}>
//         Add New Admin
//       </CButton>
//       {/* css modal for add */}
//       <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
//         <CModalHeader>
//           <CModalTitle>Add New Admin</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CRow className="mb-3">
//             <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
//               Email
//             </CFormLabel>
//             <CCol sm={8}>
//               <CFormInput
//                 type="email"
//                 name="email"
//                 id="validationTooltip04"
//                 onChange={handleChange}
//                 required
//                 value={adminEmail}
//               />
//             </CCol>
//           </CRow>
//
//           <CRow className="mb-3">
//             <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
//               Password
//             </CFormLabel>
//             <CCol sm={8}>
//               <CFormInput
//                 type="password"
//                 name="password"
//                 id="validationTooltip04"
//                 onChange={handleChange}
//                 value={adminPassword}
//                 required
//               />
//             </CCol>
//           </CRow>
//           <CRow>
//             <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
//               Create Admin
//             </CFormLabel>
//           </CRow>
//           <CRow>
//             <CCol md={4} className="position-relative"></CCol>
//             <CCol md={8} className="position-relative">
//               <CFormCheck
//                 id="flexCheckChecked"
//                 checked={createAdminForSL}
//                 onChange={(e) => changeCheckboxForHide(e.target.checked)}
//                 label="Susila Life Admin Panel"
//               />
//               <CFormCheck
//                 id="flexCheckChecked"
//                 checked={createAdminForCPP}
//                 onChange={(e) => changeCheckboxForHide(e.target.checked)}
//                 label="Content Provider Portal"
//               />
//               <br />
//             </CCol>
//           </CRow>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="primary" onClick={() => setVisible(false)}>
//             Save
//           </CButton>
//           <CButton color="secondary" onClick={() => setVisible(false)}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//
//       {/* react - Table sub categories list */}
//       <CTable>
//         <CTableHead color="light">
//           <CTableRow>
//             <CTableHeaderCell scope="col">INDEX</CTableHeaderCell>
//             <CTableHeaderCell scope="col">PROFILE PICTURE</CTableHeaderCell>
//             <CTableHeaderCell scope="col">ADMIN NAME</CTableHeaderCell>
//             <CTableHeaderCell scope="col">EMAIL</CTableHeaderCell>
//             <CTableHeaderCell scope="col">ROLE</CTableHeaderCell>
//             <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {myData.map((data, index) => {
//             return (
//               <CTableRow key={data.id}>
//                 <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
//                 <CBadge color="success"> {data.title}%</CBadge>
//                 <CTableDataCell>{data.body}</CTableDataCell>
//               </CTableRow>
//             )
//           })}
//         </CTableBody>
//       </CTable>
//     </>
//   )
// }
//
// const Validation = () => {
//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <h2>Admin Management</h2>
//           </CCardHeader>
//           <CCardBody>{Notification()}</CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   )
// }
//
// export default Validation
