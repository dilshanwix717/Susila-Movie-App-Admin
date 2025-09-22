import React, { useState } from 'react'
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow } from '@coreui/react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { FaRegEyeSlash } from "react-icons/fa"; // Import eye slash icon
import { FaRegEye } from "react-icons/fa6"; // Import eye icon
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'src/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { db } from 'src/firebase'
import { doc, getDoc } from "firebase/firestore"

const Login = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "webAppUsers", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        if (userRole === 'admin') {
          localStorage.setItem("user", JSON.stringify(userData))
          dispatch({ type: 'user', user: user })
          window.location.reload();
        } else {
          toast.error("Login Failed: You do not have admin privileges.");
          return;
        }
      } else {
        toast.error("Login Failed: User does not exist.");
      }
    } catch (error) {
      toast.error("Login Failed: User does not exist."); // Show error notification
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>LOGIN</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter email"
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        required
                      />
                      <CInputGroupText onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />} {/* Dynamic icon for toggle */}
                      </CInputGroupText>
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>

        {/* Toast Notification Container */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </CContainer>
    </div>
  )
}

export default Login
