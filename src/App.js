import React, { Suspense, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HashRouter, Route, Routes, json } from 'react-router-dom'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from './firebase'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

export default function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user) // get user from redux
  const role = useSelector((state) => state.role) // get user from redux
  const [userData, setUserData] = useState("")
  const [authUser, authUserData] = useAuthState(auth)
  // var userData = '';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUserData(JSON.parse(localStorage.getItem("user")))
      dispatch({ type: 'user', user: user });
    });

    return () => unsubscribe();
  }, []);
  console.log("user data UseEffect in app.js ====> ", userData)
  console.log("user data UseEffect in app.js ====> ", userData && userData.role)

  return (
    <HashRouter>
      {/* <Suspense fallback={loading}>

        <Routes>
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>

      </Suspense> */}
      <Suspense fallback={loading}>
        {userData && userData.role == 'admin' ? (
          <Routes>
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        ) : (
          <Routes>
            <Route exact path="/login" name="Login" element={<Login />} />
            <Route exact path="/register" name="Register" element={<Register />} />
            <Route path="*" name="login" element={<Login />} />
          </Routes>
        )}
      </Suspense>
    </HashRouter>
  )
}
