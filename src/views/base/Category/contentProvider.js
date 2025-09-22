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
import { db, storage } from '../../../firebase'
import { db2 } from '../../../firebase'
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
  set,
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
import thumbnailImage from '../../../assets/images/thumbnail.png'
import { useParams } from 'react-router-dom'
import { auth2 } from '../../../firebase'
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'
import { deleteUser, signOut } from 'firebase/auth'
import { useFirebaseApp, useUser } from 'react-firebase-hooks/auth'

const Series = () => {
  const storage = getStorage() //define storage
  const [myData, setMyData] = useState([])
  const [title, setTitle] = useState('')
  const [order, setOrder] = useState(0)
  const [description, setDescription] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedProfilePicture, setSelectedProfilePicture] = useState('')
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [visibleProfilePicture, setVisibleProfilePicture] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [editVisibleProfilePicture, setEditVisibleProfilePicture] = useState(false)
  const [editVisibleBannerImage, setEditVisibleBannerImage] = useState(false)
  const [editId, setEditId] = useState()
  const [editId2, setEditId2] = useState()
  const [progress, setProgress] = useState(0)
  const [validated, setValidated] = useState(false)
  const CollectionRef = collection(db, 'contentProvider')
  const CollectionRef2 = collection(db2, 'users')
  const params = useParams()
  const [selectedUserId, setSelectedUserId] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  //banner Image
  const [visibleBannerImage, setVisibleBannerImage] = useState(false)
  const [bannerImage, setBannerImage] = useState('')
  const [selectedBannerImage, setSelectedBannerImage] = useState('')

  //CPP database
  // const [auth2, setAuth2] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [createdByAdmin, setCreatedByAdmin] = useState(true)
  const [isEmailNotVerified, setIsEmailNotVerified] = useState(false)
  let [delUser, setDelUser] = useState('')

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getContentProvider()
  }, [])

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const validOrder = () => {
    let modifiedValue
    if (order <= 9) {
      modifiedValue = `0${order.replace(/^0+/, '')}`
    } else {
      modifiedValue = order.toString(8)
    }
    return modifiedValue
  }
  const getContentProvider = async () => {
    setLoading(true)
    let q = query(CollectionRef, orderBy('createAt', 'desc'))
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

  const handleProfilePictureUpload = async (e) => {
    setProfilePicture('')
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return

    //const storageRef = ref(storage, `thumbnail/${file.name}`)
    const storageRef = ref(storage, `content_provider/profile_picture`)
    const listResult = await listAll(storageRef)

    const fileExists = listResult.items.some((item) => item.name === file.name)

    if (fileExists) {
      alert('A file with the same name already exists.')
      return
    }
    if (profilePicture && profilePicture !== thumbnailImage) {
      const existingFileRef = ref(storage, profilePicture)
      await deleteObject(existingFileRef)
    }
    const uploadTask = uploadBytesResumable(
      ref(storage, `content_provider/profile_picture/${file.name}`),
      file,
    )
    //const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressData = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgress(progressData)
      },
      (error) => {
        alert(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProfilePicture(downloadURL)
          setProgress(0)
          //setVisible(false)
          setVisibleProfilePicture(false)
          setSelectedProfilePicture(null)
        })
      },
    )
  }

  const handleBannerImageUpload = async (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return

    //const storageRef = ref(storage, `thumbnail/${file.name}`)
    const storageRef = ref(storage, `content_provider/banner_picture`)
    const listResult = await listAll(storageRef)

    const fileExists = listResult.items.some((item) => item.name === file.name)

    if (fileExists) {
      alert('A file with the same name already exists.')
      return
    }
    if (bannerImage && bannerImage !== thumbnailImage) {
      const existingFileRef = ref(storage, bannerImage)
      await deleteObject(existingFileRef)
    }
    const uploadTask = uploadBytesResumable(
      ref(storage, `content_provider/banner_picture/${file.name}`),
      file,
    )
    //const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressData = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgress(progressData)
      },
      (error) => {
        alert(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setBannerImage(downloadURL)
          setProgress(0)
          //setVisible(false)
          setVisibleBannerImage(false)
          setSelectedBannerImage(null)
        })
      },
    )
  }

  // firebase - store data into firebase collection
  const StoreData = async (user) => {
    if (email === '') {
      return alert('please input email address')
    }

    if (password === '') {
      return alert('please input password')
    }

    if (title === '') {
      return alert('please input name')
    }

    if (description === '') {
      return alert('please input description')
    }

    if (!profilePicture) {
      return alert('please upload profile picture')
    }
    setLoading(true)
    const ref = doc(CollectionRef)

    const docData = {
      id: ref.id,
      createAt: Timestamp.fromDate(new Date()),
      profilePicture_url: profilePicture,
      bannerImage_url: bannerImage,
      title: title,
      description: description,
      favourite_user: [],
      email: email,
    }
    await setDoc(ref, docData).then(async () => {
      await saveUserDataToFirestore(user, ref)
      setVisible(false)
      setVisibleProfilePicture(false)
      setVisibleBannerImage(false)
      setProgress(0)
      setSelectedImage(null)
      setSelectedProfilePicture(null)
      setSelectedBannerImage(null)
      getContentProvider()
    })
  }

  // firebase - store data into firebase collection
  // const StoreData2 = async () => {
  //   if (email === '') {
  //     return alert('please input email address')
  //   }
  //
  //   if (password === '') {
  //     return alert('please input password')
  //   }
  //
  //   setLoading(true)
  //   const ref = doc(CollectionRef2)
  //   const docData = {
  //     id: ref.id,
  //     createAt: Timestamp.fromDate(new Date()),
  //     email: email,
  //     password: password,
  //     createdbyAdmin: createdByAdmin,
  //   }
  //   await setDoc(ref, docData).then(() => {
  //     setCreatedByAdmin(false)
  //   })
  // }

  // firebase  - store data into firebase collection
  const UpdateStoreData = async () => {
    if (title === '') {
      return alert('please input name')
    }
    if (description === '') {
      return alert('please input description')
    }
    if (!profilePicture) {
      return alert('please upload profile picture')
    }
    setLoading(true)
    await updateDoc(doc(db, 'contentProvider', editId), {
      profilePicture_url: profilePicture,
      bannerImage_url: bannerImage,
      title: title,
      description: description,
      favourite_user: [],
    }).then(() => {
      //setLoading(false)
      setEditVisible(false)
      setSelectedProfilePicture(null)
      setSelectedBannerImage(null)
      setProgress(0)
      getContentProvider()
    })
  }

  // firebase  - store data into firebase collection
  const UpdateStoreData2 = async () => {
    if (email === '') {
      return alert('please input email')
    }
    if (password === '') {
      return alert('please input pasword')
    }
    setLoading(true)
    await updateDoc(doc(db2, 'user', editId2), {
      email: email,
      password: password,
      createdbyAdmin: createdByAdmin,
    }).then(() => {
      //setLoading(false)
      //setEditVisible(false)
      //setSelectedProfilePicture(null)
      //setSelectedBannerImage(null)
      //setProgress(0)
      //getContentProvider()
      setCreatedByAdmin(true)
    })
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }
  }
  const imageChangeForProfilePicture = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedProfilePicture(URL.createObjectURL(e.target.files[0]))
    }
  }

  const imageChangeForBannerImage = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedBannerImage(URL.createObjectURL(e.target.files[0]))
    }
  }
  // firebase update function
  const update = async () => {
    if (title === '') {
      return alert('please input name')
    }

    if (description === '') {
      return alert('please input description')
    }

    if (!profilePicture) {
      return alert('please upload profile image')
    }
    setLoading(true)
    await updateDoc(doc(db, 'contentProvider', editId), {
      profilePicture_url: profilePicture,
      title: title,
      description: description,
    }).then(() => {
      setEditVisible(false)
      setEditVisibleProfilePicture(false)
      setEditVisibleBannerImage(false)
      setSelectedImage(null)
      setSelectedProfilePicture(null)
      setSelectedBannerImage(null)
      setProgress(0)
      getContentProvider()
    })
  }

  // firebase get data for edit function
  const edit = async (id) => {
    setEditVisible(true)
    setEditVisibleProfilePicture(true)
    setEditVisibleBannerImage(true)
    const docRef = doc(db, 'contentProvider', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let { title, description, profilePicture_url, bannerImage_url } = docSnap.data()
      setProfilePicture(profilePicture_url)
      setBannerImage(bannerImage_url)
      setTitle(title)
      setDescription(description)
      setEditId(id)
    }
  }

  // firebase delete function
  const DeleteProfilePicture = async () => {
    const httpsReference = ref(storage, profilePicture) //get thumbnail url from state
    const desertRef = ref(storage, `content_provider/profile_picture/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        // console.log('success')
      })
      .catch((error) => {
        // console.log('error', error)
      })

    deleteDoc(doc(db, 'contentProvider', editId)).then(() => {
      setEditVisible(false)
      getContentProvider()
    })
  }

  const DeleteBannerImage = async () => {
    const httpsReference = ref(storage, bannerImage) //get thumbnail url from state
    const desertRef = ref(storage, `content_provider/banner_picture/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        // console.log('success')
      })
      .catch((error) => {
        // console.log('error', error)
      })
  }

  const Delete = async () => {
    // deleteUserAccount()
    DeleteBannerImage()
    DeleteProfilePicture()
  }

  const handleClose = () => {
    setVisible(false)
    setSelectedImage(null)
    setSelectedProfilePicture(null)
    setSelectedBannerImage(null)
    setVisibleProfilePicture(false)
    setVisibleBannerImage(false)
    setEditVisible(false)
  }
  const handleCloseForProfilePicture = () => {
    setSelectedImage(null)
    setVisibleProfilePicture(false)
    setSelectedProfilePicture(null)
  }

  const handleCloseForBannerImage = () => {
    setSelectedImage(null)
    setVisibleBannerImage(false)
    setSelectedBannerImage(null)
  }

  const HandleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    registerUser()
    // StoreData2()
    // signup()
    setEditVisible(false)
  }
  const handleClickAddNew = () => {
    setVisible(!visible)
    setProfilePicture('')
    setBannerImage('')
    setEmail('')
    setPassword('')
  }
  const handleUpdate = () => {
    UpdateStoreData()
    // updateRegisterUser()

    // UpdateStoreData2()
  }

  const registerUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth2, email, password)
      const user = userCredential.user
      await StoreData(user)

      console.log('User credential', user)
      console.log('User registered:', user)

      alert('Content Provider created')
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('The entered email address is already in use.')
      }
      if (error.code === 'auth/weak-password') {
        alert('Password should be at least 6 characters')
      } else {
        console.error('Registration error:', error)
        alert(error)
        // alert('An error occurred during registration. Please try again later.')
      }
      console.error('Registration error:', error)
    }
  }

  const saveUserDataToFirestore = async (user, ref) => {
    console.log('inside of the method')
    // const ref = doc(CollectionRef2)
    const docData = {
      id: user.uid,
      contentProvider: ref.id,
      createAt: Timestamp.fromDate(new Date()),
      email: user.email,
      profilePicture_url: profilePicture,
      bannerImage_url: bannerImage,
      title: title,
      userRole: 'USER',
    }
    await setDoc(doc(db2, 'users', user.uid), docData).then((res) => {
      console.log('user created', res)
    })

    //  const usersCollection = db2.collection('users')
    // await usersCollection.doc(user.uid).set({
    //   email: user.email,
    // })
  }

  const updateRegisterUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth2, email, password)
      await UpdateStoreData()
      const user = userCredential.user
      console.log('User credential', user)
      console.log('User registered:', user)
      await saveUserDataToFirestore(user)
      alert('Content Provider created')
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('The entered email address is already in use.')
      }
      if (error.code === 'auth/weak-password') {
        alert('Password should be at least 6 characters')
      } else {
        console.error('Registration error:', error)
        alert(error)
        // alert('An error occurred during registration. Please try again later.')
      }
      console.error('Registration error:', error)
    }
  }

  //   db2
  //     .collection('/users')
  //     .doc(user.uid)
  //     .set({
  //       email: user.email,
  //     })
  //     .then()
  //     .catch((err) => console.log(err))
  // }

  // const deleteUserAccount = async () => {
  //   delUser = auth2.getUserByEmail(email)
  //   //   .then(() => {
  //   //   console.log('email address', delUser)
  //   // })
  //   try {
  //     await deleteUser(delUser)
  //     console.log('User account deleted')
  //     // Optional: Sign out the user after deleting the account
  //     // await signOut(auth2)
  //     // console.log('User signed out')
  //   } catch (error) {
  //     console.error('Error deleting user account:', error)
  //   }
  // }

  if (loading) {
    return <Loading />
  }
  return (
    <>
      <CButton sm={8} onClick={handleClickAddNew}>
        Add New
      </CButton>
      {/* CREATE */}
      <CModal alignment="center" visible={visible} onClose={() => handleClose()}>
        <CModalHeader>
          <CModalTitle>CREATE Content Provider Profile</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={12} className="position-relative">
              <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Upload profile picture
              </CFormLabel>
              <img
                onClick={() => setVisibleProfilePicture(true)}
                width={150}
                className="rounded"
                src={profilePicture ? profilePicture : thumbnailImage}
                alt=""
              />
            </CCol>
          </CRow>
          <CModal
            alignment="center"
            visible={visibleProfilePicture}
            onClose={() => handleCloseForProfilePicture()}
          >
            <CModalHeader>
              <CModalTitle>PROFILE PICTURE</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {selectedProfilePicture ? (
                <CRow className="mb-3">
                  <CImage align="center" rounded src={selectedProfilePicture} />
                </CRow>
              ) : null}

              <form onSubmit={handleProfilePictureUpload}>
                <CRow className="mb-2">
                  <CCol md={12} className="position-relative">
                    <CInputGroup className="mb-1">
                      <CFormInput
                        type="file"
                        id="inputGroupFile04"
                        aria-describedby="inputGroupFileAddon04"
                        aria-label="upload"
                        accept=".webp"
                        onChange={imageChangeForProfilePicture}
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>

                <CRow className="mb-1">
                  <CCol md={12} className="position-relative">
                    <CProgress className="mb-1">
                      <CProgressBar value={progress}>{progress}%</CProgressBar>
                    </CProgress>
                  </CCol>
                </CRow>

                <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                  Upload now
                </CButton>
              </form>
            </CModalBody>
          </CModal>

          <CRow className="mb-3">
            <CCol md={12} className="position-relative">
              <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Upload Banner Image
              </CFormLabel>
              <img
                onClick={() => setVisibleBannerImage(true)}
                width={150}
                className="rounded"
                src={bannerImage ? bannerImage : thumbnailImage}
                alt=""
              />
            </CCol>
          </CRow>
          <CModal
            alignment="center"
            visible={visibleBannerImage}
            onClose={() => handleCloseForBannerImage()}
          >
            <CModalHeader>
              <CModalTitle>Banner Image</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {selectedBannerImage ? (
                <CRow className="mb-3">
                  <CImage align="center" rounded src={selectedBannerImage} />
                </CRow>
              ) : null}

              <form onSubmit={handleBannerImageUpload}>
                <CRow className="mb-2">
                  <CCol md={12} className="position-relative">
                    <CInputGroup className="mb-1">
                      <CFormInput
                        type="file"
                        id="inputGroupFile04"
                        aria-describedby="inputGroupFileAddon04"
                        aria-label="upload"
                        accept=".webp"
                        onChange={imageChangeForBannerImage}
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>

                <CRow className="mb-1">
                  <CCol md={12} className="position-relative">
                    <CProgress className="mb-1">
                      <CProgressBar value={progress}>{progress}%</CProgressBar>
                    </CProgress>
                  </CCol>
                </CRow>

                <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                  Upload now
                </CButton>
              </form>
            </CModalBody>
          </CModal>
          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Content provider name
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="text" onChange={(e) => setTitle(e.target.value)} />
            </CCol>
          </CRow>

          <CForm
            className="row g-3 needs-validation form"
            noValidate
            validated={validated}
            // onSubmit={HandleSubmit}
          >
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Email
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput type="email" onChange={(e) => setEmail(e.target.value)} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Password
              </CFormLabel>
              <CCol sm={8}>
                {/*<CFormInput type="password" onChange={(e) => setPassword(e.target.value)} />*/}
                <div className="input-group">
                  <CFormInput
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </CCol>
              {/*<div>*/}
              {/*  <div className="mb-3">*/}
              {/*    <label htmlFor="inputPassword" className="col-sm-4 col-form-label">*/}
              {/*      Password*/}
              {/*    </label>*/}
              {/*    <div className="col-sm-8">*/}
              {/*      <input*/}
              {/*        type={showPassword ? 'text' : 'password'}*/}
              {/*        value={password}*/}
              {/*        onChange={(e) => setPassword(e.target.value)}*/}
              {/*      />*/}
              {/*    </div>*/}
              {/*    <div className="col-sm-2">*/}
              {/*      <button onClick={toggleShowPassword}>{showPassword ? 'Hide' : 'Show'}</button>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Channel Description
              </CFormLabel>
              <CCol sm={8}>
                <CFormTextarea type="text" onChange={(e) => setDescription(e.target.value)} />
              </CCol>
            </CRow>

            <CCol xs={12} className="position-relative">
              {/*<CButton color="primary" type="submit">*/}
              <CButton color="primary" onClick={HandleSubmit}>
                Upload Now
              </CButton>
            </CCol>
          </CForm>
        </CModalBody>
      </CModal>

      {/* UPDATE*/}
      <CModal alignment="center" visible={editVisible} onClose={() => handleClose()}>
        <CModalHeader>
          <CModalTitle>UPDATE Content Provider Profile</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={12} className="position-relative">
              <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Upload profile picture
              </CFormLabel>
              <img
                onClick={() => setVisibleProfilePicture(true)}
                width={150}
                className="rounded"
                src={profilePicture ? profilePicture : thumbnailImage}
                alt=""
              />
            </CCol>
          </CRow>
          <CModal
            alignment="center"
            visible={visibleProfilePicture}
            onClose={() => handleCloseForProfilePicture()}
          >
            <CModalHeader>
              <CModalTitle>PROFILE PICTURE</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {selectedProfilePicture ? (
                <CRow className="mb-3">
                  <CImage align="center" rounded src={selectedProfilePicture} />
                </CRow>
              ) : null}

              <form onSubmit={handleProfilePictureUpload}>
                <CRow className="mb-2">
                  <CCol md={12} className="position-relative">
                    <CInputGroup className="mb-1">
                      <CFormInput
                        type="file"
                        id="inputGroupFile04"
                        aria-describedby="inputGroupFileAddon04"
                        aria-label="upload"
                        accept=".webp"
                        onChange={imageChangeForProfilePicture}
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>

                <CRow className="mb-1">
                  <CCol md={12} className="position-relative">
                    <CProgress className="mb-1">
                      <CProgressBar value={progress}>{progress}%</CProgressBar>
                    </CProgress>
                  </CCol>
                </CRow>

                <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                  Upload now
                </CButton>
              </form>
            </CModalBody>
          </CModal>
          <CRow className="mb-3">
            <CCol md={12} className="position-relative">
              <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Upload Banner Image
              </CFormLabel>
              <img
                onClick={() => setVisibleBannerImage(true)}
                width={150}
                className="rounded"
                src={bannerImage ? bannerImage : thumbnailImage}
                alt=""
              />
            </CCol>
          </CRow>
          <CModal
            alignment="center"
            visible={visibleBannerImage}
            onClose={() => handleCloseForBannerImage()}
          >
            <CModalHeader>
              <CModalTitle>Banner Image</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {selectedBannerImage ? (
                <CRow className="mb-3">
                  <CImage align="center" rounded src={selectedBannerImage} />
                </CRow>
              ) : null}

              <form onSubmit={handleBannerImageUpload}>
                <CRow className="mb-2">
                  <CCol md={12} className="position-relative">
                    <CInputGroup className="mb-1">
                      <CFormInput
                        type="file"
                        id="inputGroupFile04"
                        aria-describedby="inputGroupFileAddon04"
                        aria-label="upload"
                        accept=".webp"
                        onChange={imageChangeForBannerImage}
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>

                <CRow className="mb-1">
                  <CCol md={12} className="position-relative">
                    <CProgress className="mb-1">
                      <CProgressBar value={progress}>{progress}%</CProgressBar>
                    </CProgress>
                  </CCol>
                </CRow>

                <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                  Upload now
                </CButton>
              </form>
            </CModalBody>
          </CModal>

          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Content provider name
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </CCol>
          </CRow>
          {/*<CRow className="mb-3">*/}
          {/*  <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">*/}
          {/*    Email*/}
          {/*  </CFormLabel>*/}
          {/*  <CCol sm={8}>*/}
          {/*    <CFormInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />*/}
          {/*  </CCol>*/}
          {/*</CRow>*/}
          {/*<CRow className="mb-3">*/}
          {/*  <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">*/}
          {/*    Password*/}
          {/*  </CFormLabel>*/}
          {/*  <CCol sm={8}>*/}
          {/*    <CFormInput*/}
          {/*      type="password"*/}
          {/*      value={password}*/}
          {/*      onChange={(e) => setPassword(e.target.value)}*/}
          {/*    />*/}
          {/*  </CCol>*/}
          {/*</CRow>*/}
          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              Channel Description
            </CFormLabel>
            <CCol sm={8}>
              <CFormTextarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </CCol>
          </CRow>
          <div className="row justify-content-md-center">
            <CCol xs lg={9}>
              <CButton color="primary" variant="outline" onClick={() => handleUpdate()}>
                UPDATE
              </CButton>
            </CCol>
            <CCol>
              <CButton color="danger" onClick={() => Delete()}>
                DELETE
              </CButton>
            </CCol>
          </div>
        </CModalBody>
      </CModal>

      {/* react - Table sub categories list */}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">PROFILE PICTURE</CTableHeaderCell>
            <CTableHeaderCell scope="col">CONTENT PROVIDER NAME</CTableHeaderCell>
            <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData.map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>
                  <img width={100} src={data.profilePicture_url} />
                </CTableDataCell>
                <CTableDataCell>{data.title}</CTableDataCell>
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

const Index = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Content Providers</h2>
          </CCardHeader>
          <CCardBody>{Series()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
