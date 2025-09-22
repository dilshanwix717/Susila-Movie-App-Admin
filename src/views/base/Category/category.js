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
  CFormCheck,
  CImage,
  CProgress,
  CProgressBar,
  CInputGroup,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { db, storage } from '../../../firebase'
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
import bannerImageForPrev from '../../../assets/images/thumbnail.png'
import closeIcon from '../../../assets/images/close.png'
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  getStorage,
} from 'firebase/storage'
import { useNavigate, useParams } from 'react-router-dom'

const Category = () => {
  const params = useParams()
  const storage = getStorage() //define storage
  const history = useNavigate()
  const [myData, setMyData] = useState([])
  const [loading, setLoading] = useState(true)
  const CollectionRef = collection(db, 'category')
  const [visible, setVisible] = useState(false)
  const [visibleBannerImage, setVisibleBannerImage] = useState(false)
  const [visibleBannerImageForEdit, setVisibleBannerImageForEdit] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [category, setCategory] = useState('')
  const [isSeries, setIsSeries] = useState(false)
  const [editId, setEditId] = useState()
  const [tags, setTags] = useState([])

  //uploads
  const [bannerImage, setBannerImage] = useState([])
  const [bannerImageForEdit, setBannerImageForEdit] = useState([])
  const [selectedBannerImage, setSelectedBannerImage] = useState()
  const [selectedBannerImageForEdit, setSelectedBannerImageForEdit] = useState()
  const [UploadedBannerImage, setUploadedBannerImage] = useState([])
  const [UploadedBannerImageForEdit, setUploadedBannerImageForEdit] = useState([])
  // const [deleteId, setDeleteId] = useState()
  // const [deleteVisible, setDeleteVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressForEdit, setProgressForEdit] = useState(0)

  const getBannerImagesData = (bannerImageUrl) => {
    var result = []
    console.log('uploaded banner name ==> ', bannerImageUrl)
    bannerImageUrl.forEach((element) => {
      // const httpsReference = ref(storage, element)
      result.push(element)
      console.log('uploaded banner image name ==> 222', element)
    })
    // const httpsReference = storage.refFromURL(audioUrl)
    setUploadedBannerImageForEdit(result)
  }
  const getData = async () => {
    // const docRef = doc(db, 'category', params.id)
    // const docSnap = await getDoc(docRef)
    // if (docSnap.exists()) {
    //   let { category, bannerImage_url } = docSnap.data()
    //   console.log('Document data:', docSnap.data())
    //   setBannerImage(bannerImage_url)
    //   setCategory(category)
    //   getBannerImagesData(bannerImage_url)
    // }
  }
  // FIREBASE - GET USER FROM FIRESTORE
  const getCategory = async () => {
    setLoading(true)
    let q = query(CollectionRef)
    const data = await getDocs(q).then(function (data) {
      setMyData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
      setCategory('')
      setLoading(false)
    })
  }

  // const TagForSearch = () => {
  //   let array = []
  //   for (let i = 0; i < tags.length; i++) {
  //     for (let j = 1; j <= tags[i].length; j++) {
  //       array.push(tags[i].substring(0, j))
  //     }
  //   }
  //   return array
  // }

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getCategory()
    getData()
  }, [])

  // firebase - store data into firebase collection
  const StoreData = async () => {
    console.log('inside of the store data func')
    // let tagsChar = TagForSearch()
    const ref = doc(collection(db, 'category'))

    console.log('BANNER IMAGE', bannerImage)

    // if (bannerImage.length == 0) {
    //   return alert('please upload banner image')
    // }

    if (category === '') {
      return alert('please upload category name')
    }
    setLoading(true)

    const categoryQuery = query(collection(db, 'category'), where('name', '==', category))
    const categoryQuerySnapshot = await getDocs(categoryQuery)

    if (categoryQuerySnapshot.docs.length > 0) {
      setLoading(false)
      return alert('Category with this name already exists.')
    }

    const docData = {
      id: ref.id,
      createAt: Timestamp.fromDate(new Date()),
      name: category,
      subcategory: {},
      bannerImage_url: bannerImage,
      tag_Words: tags,
      isSeries: isSeries,
    }
    console.log('doc Data ==========>', docData)
    await setDoc(ref, docData).then(() => {
      setLoading(false)
      setVisible(false)
      alert('New category created!')
      setVisibleBannerImage(false)
      setVisibleBannerImageForEdit(false)
      getCategory()
      setProgress(0)
      setProgressForEdit(0)
      setSelectedBannerImage(null)
      setVisibleBannerImageForEdit(false)
      setSelectedBannerImageForEdit(null)
      //handleRemoveBannerImage()
    })
  }

  // firebase get data for edit function
  const edit = async (id) => {
    setEditVisible(true)
    const docRef = doc(db, 'category', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let { name, bannerImage_url } = docSnap.data()
      console.log('category images=== ', bannerImage_url)
      setCategory(name)
      setEditId(id)
      if (bannerImage_url != undefined) {
        setUploadedBannerImageForEdit(bannerImage_url)
        getBannerImagesData(bannerImage_url)
      }
    }
  }

  // firebase update function
  const update = async () => {
    setLoading(true)
    await updateDoc(doc(db, 'category', editId), {
      name: category,
      bannerImage_url: UploadedBannerImageForEdit,
      isSeries: isSeries,
    }).then(() => {
      setEditVisible(false)
      setSelectedBannerImage(null)
      setProgress(0)
      setProgressForEdit(0)
      getCategory()
    })
  }

  // const openDelete = (id) => {
  //   setDeleteVisible(true)
  //   setDeleteId(id)
  // }

  // firebase delete function
  const Delete = async () => {
    setLoading(true)
    await deleteDoc(doc(db, 'category', editId)).then(() => {
      setEditVisible(false)
      getCategory()
    })
  }

  //react image upload
  const handleBannerImageUpload = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    // if (bannerImage.length < 5) {
    //   setBannerImages([...bannerImages, file])
    // }
    if (!file) return
    const storageRef = ref(storage, `category/bannerImage/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

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
          setBannerImage([...bannerImage, downloadURL])
          setProgress(0)
          setUploadedBannerImage(...UploadedBannerImage, file.name)
          setVisibleBannerImage(false)
        })
      },
    )
  }
  //react image upload for edit
  const handleBannerImageUploadForEdit = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return
    const storageRef = ref(storage, `category/bannerImage/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressData2 = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgressForEdit(progressData2)
      },
      (error) => {
        alert(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setBannerImageForEdit([...bannerImageForEdit, downloadURL])
          setProgressForEdit(0)
          setUploadedBannerImageForEdit([...UploadedBannerImageForEdit, downloadURL])
          setVisibleBannerImageForEdit(false)
        })
      },
    )
  }

  const reset = () => {
    setBannerImage([])
    setSelectedBannerImage(null)
  }
  const bannerImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedBannerImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  const bannerImageChangeForEdit = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedBannerImageForEdit(URL.createObjectURL(e.target.files[0]))
    }
  }
  const handleClose = () => {
    setVisibleBannerImage(false)
    setSelectedBannerImage(null)
  }

  const handleCloseForEdit = () => {
    setVisibleBannerImageForEdit(false)
    setSelectedBannerImageForEdit(null)
  }

  if (loading) {
    return <Loading />
  }
  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    StoreData(UploadedBannerImage)
  }
  // const handleBannerImageClose = (index) => {
  //   const newBannerImage = [...bannerImage]
  //   newBannerImage.splice(index, 1)
  //   setBannerImage(newBannerImage)
  // }

  const renderList =
    bannerImage.length !== 0
      ? bannerImage.map((value, index) => (
          <CCol key={index} md={4}>
            <img
              // onClick={() => setVisibleBannerImage(true)}
              width={80}
              height={80}
              className="rounded"
              src={bannerImage.length > 0 ? bannerImage[index] : bannerImageForPrev}
              alt=""
            />
            <br></br>
            <CButton color="danger" onClick={() => handleRemoveBannerImage(index)}>
              X
            </CButton>
          </CCol>
        ))
      : null

  const renderListForEdit =
    UploadedBannerImageForEdit !== undefined ? (
      UploadedBannerImageForEdit.map((value, index) => (
        <CCol key={index} md={4}>
          <img
            width={80}
            height={80}
            className="rounded"
            src={
              UploadedBannerImageForEdit.length > 0
                ? UploadedBannerImageForEdit[index]
                : bannerImageForPrev
            }
            alt=""
          />
          <br></br>
          <CButton color="danger" onClick={() => handleRemoveBannerImageForEdit(index)}>
            X
          </CButton>
        </CCol>
      ))
    ) : (
      <CCol md={4}>
        <img
          // onClick={() => setVisibleBannerImage(true)}
          width={80}
          height={80}
          className="rounded"
          src={bannerImageForPrev}
          alt=""
        />
        <br></br>
      </CCol>
    )

  const renderNewList = bannerImage.map((value, index) => (
    <CCol key={index} md={4}>
      <img src={bannerImage[index]} />
    </CCol>
  ))

  // const handleRemoveImage = () => {
  const handleRemoveBannerImage = async (index) => {
    console.log('banner image ====', bannerImage)
    const httpsReference = ref(storage, bannerImage) //get thumbnail url from state
    const desertRef = ref(storage, `category/bannerImage/${httpsReference.name}`) //url to file name get for delete from storage
    console.log('banner image deleted ===', desertRef)
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        setLoading(false)
        console.log('Image deleted successfully')
        // File deleted successfully
        // console.log('success')
      })
      .catch((error) => {
        console.log('error', error)
        // setLoading(false)
        // history(-1)
      })
    const updatedBannerImage = [...bannerImage]
    updatedBannerImage.splice(index, 1)
    setBannerImage(updatedBannerImage)
  }

  // const handleRemoveImage = () => {
  const handleRemoveBannerImageForEdit = async (index) => {
    const httpsReference = ref(storage, UploadedBannerImageForEdit) //get thumbnail url from state
    const desertRef = ref(storage, `category/bannerImage/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        setLoading(false)
        console.log('Image deleted successfully')
        // File deleted successfully
        // console.log('success')
      })
      .catch((error) => {
        console.log('error', error)
        // setLoading(false)
        // history(-1)
      })
    const newBannerImages = [...UploadedBannerImageForEdit]
    newBannerImages.splice(index, 1)
    setUploadedBannerImageForEdit(newBannerImages)
  }

  const removeBannerImages = async () => {
    bannerImage.forEach((element) => {
      const httpsReference = ref(storage, element) //get thumbnail url from state
      const desertRef = ref(storage, `category/bannerImage/${httpsReference.name}`) //url to file name get for delete from storage
      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          setLoading(false)
          console.log('Image deleted successfully')
          // File deleted successfully
          // console.log('success')
        })
        .catch((error) => {
          console.log('error', error)
          // setLoading(false)
          // history(-1)
        })
    })
    setVisible(false)
    // const newRBannerImage = [...bannerImage]
    // newRBannerImage.splice(index, 5)
    // setBannerImage(newRBannerImage)
  }
  const handleVisible = () => {
    setBannerImage([])
    setVisible(true)
  }
  // }
  return (
    <>
      <CButton sm={8} onClick={handleVisible}>
        Add New
      </CButton>
      {/* css modal for add */}
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>New Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              CATEGORY NAME
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput type="text" onChange={(e) => setCategory(e.target.value)} />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={{ span: 8, offset: 4 }}>
              <CFormCheck
                label=" a series"
                onChange={(e) => setIsSeries(e.target.checked)}
                checked={isSeries}
              />
            </CCol>
          </CRow>
          <CRow>
            {renderList}
            {/* {renderNewList} */}
          </CRow>
          <CRow className="row justify-content-md-center">
            {bannerImage.length != 5 ? (
              <CCol md={4}>
                <img
                  onClick={() => setVisibleBannerImage(true)}
                  width={100}
                  className="rounded"
                  src={bannerImageForPrev}
                  alt=""
                />
              </CCol>
            ) : null}
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => removeBannerImages()}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => StoreData()}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* css modal for add */}
      <CModal alignment="center" visible={visibleBannerImage} onClose={() => handleClose()}>
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
                    onChange={bannerImageChange}
                  />
                </CInputGroup>
                {/* {bannerImage.map((selectedBannerImage, index) => (
                  <closeIcon
                    key={index}
                    selectedBannerImage ={selectedBannerImage}
                    onClick={() => handleBannerImageClose(index)}
                  />
                ))} */}
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

      {/* css modal for edit add */}
      <CModal
        alignment="center"
        visible={visibleBannerImageForEdit}
        onClose={() => handleCloseForEdit()}
      >
        <CModalHeader>
          <CModalTitle>Banner Image</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedBannerImageForEdit ? (
            <CRow className="mb-3">
              <CImage align="center" rounded src={selectedBannerImageForEdit} />
            </CRow>
          ) : null}
          <form onSubmit={handleBannerImageUploadForEdit}>
            <CRow className="mb-2">
              <CCol md={12} className="position-relative">
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="file"
                    id="inputGroupFile04"
                    aria-describedby="inputGroupFileAddon04"
                    aria-label="upload"
                    accept=".webp"
                    onChange={bannerImageChangeForEdit}
                  />
                </CInputGroup>
                {/* {bannerImage.map((selectedBannerImage, index) => (
                  <closeIcon
                    key={index}
                    selectedBannerImage ={selectedBannerImage}
                    onClick={() => handleBannerImageClose(index)}
                  />
                ))} */}
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol md={12} className="position-relative">
                <CProgress className="mb-1">
                  <CProgressBar value={progressForEdit}>{progressForEdit}%</CProgressBar>
                </CProgress>
              </CCol>
            </CRow>

            <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
              Upload now
            </CButton>
          </form>
        </CModalBody>
      </CModal>

      {/* css modal for edit */}
      <CModal alignment="center" visible={editVisible} onClose={() => setEditVisible(false)}>
        <CModalHeader>
          <CModalTitle>Update</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
              CATEGORY NAME
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </CCol>
          </CRow>
          {UploadedBannerImageForEdit != undefined ? (
            <>
              <CRow>
                {console.log('inside of the uploaded banner image', UploadedBannerImageForEdit)}
                {/* <CFormLabel>{UploadedBannerImageForEdit}</CFormLabel> */}
                {renderListForEdit}
                {/*{renderNewList}*/}
              </CRow>
            </>
          ) : null}
          <CRow className="row justify-content-md-center">
            {UploadedBannerImageForEdit.length !== 5 ? (
              <CCol md={4}>
                <img
                  onClick={() => setVisibleBannerImageForEdit(true)}
                  width={100}
                  className="rounded"
                  src={bannerImageForPrev}
                  alt=""
                />
              </CCol>
            ) : null}
          </CRow>
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
      {/* react - Table sub categories list */}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">CATEGORY NAME</CTableHeaderCell>
            <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData.map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{data.name}</CTableDataCell>

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
const Validation = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>CATEGORY LIST</h2>
          </CCardHeader>
          <CCardBody>{Category()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Validation
