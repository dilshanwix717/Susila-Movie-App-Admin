import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from 'src/firebase' // Import Firestore
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify' // Import Toastify
import 'react-toastify/dist/ReactToastify.css' // Import Toastify CSS
import { doc, setDoc } from "firebase/firestore" // Import Firestore functions

const Register = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (repeatPassword === password) {
      try {
        // Create user with email and password
        const result = await createUserWithEmailAndPassword(auth, email, password)
        const user = result.user

        // Dispatch user info to Redux
        dispatch({ type: 'user', user: user })

        // Add user data to Firestore
        const userDocRef = doc(db, "webAppUsers", user.uid) // Create reference to Firestore document
        await setDoc(userDocRef, {
          uid: user.uid,
          email: email,
          role: 'user', // Add user role as "user"
        })

        // Show success notification and redirect after a delay
        toast.success('Registration successful! Redirecting to login page...')
        setTimeout(() => {
          navigate('/login') // Redirect to login after 3 seconds
        }, 3000)
      } catch (error) {
        console.log(error)
        toast.error(error.message) // Show error notification
      }
    } else {
      toast.error('Passwords do not match') // Show error notification for password mismatch
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      autoComplete="email"
                      required // Add required attribute
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      required // Add required attribute
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      required // Add required attribute
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Toast Notification Container */}
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </CContainer>
    </div>
  )
}

export default Register
