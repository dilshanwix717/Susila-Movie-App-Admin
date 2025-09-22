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
  CFormInput,
  CRow,
  CCol,
  CCardHeader,
  CCard,
  CCardBody,
  CProgressBar,
  CProgress,
  CInputGroup,
  CFormSelect,
  CImage,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { db, storage } from '../../../firebase'
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  Timestamp,
  deleteDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore'
import Loading from 'src/components/loading/Loading'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import counties from 'src/JSON/countries'

const Ads = () => {
  const [myData, setMyData] = useState([])
  const [loading, setLoading] = useState(true)
  const CollectionRef = collection(db, 'ads')
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [name, setName] = useState('')
  const [country, setCountry] = useState([])
  const [selectedImage, setSelectedImage] = useState()
  const [editVisible, setEditVisible] = useState(false)
  const [thumbnail_url, setThumbnail_url] = useState('')
  const [editId, setEditId] = useState('')
  const [uploadNow, setUploadNow] = useState(false)

  // FIREBASE - GET BANNER FROM FIRESTORE
  const getAds = async () => {
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

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getAds()
  }, [])

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  const countrySelection = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value)
    setCountry(selectedValues)
  }

  // firebase - store data into firebase collection
  const uploadMedia = (e) => {
    setUploadNow(true)
    e.preventDefault()
    const file = e.target[0]?.files[0]

    // when update if no change in thumbnail
    if (!file && editVisible) {
      // console.log('psh')
      update(thumbnail_url)
      setUploadNow(false)
    }

    if (!file) return
    const storageRef = ref(storage, `ads/${file.name}`)
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
          if (editVisible) {
            // if update delete old media/image
            deleteMedia(downloadURL)
            setUploadNow(false)
          } else {
            // store new data
            storeData(downloadURL)
            setUploadNow(false)
          }
        })
      },
    )
  }

  const deleteMedia = async (newUrl) => {
    const httpsReference = ref(storage, thumbnail_url) //get thumbnail url from state
    const desertRef = ref(storage, `ads/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        // console.log('success')
        update(newUrl)
      })
      .catch((error) => {
        console.log('error', error)
        update(newUrl)
        // Uh-oh, an error occurred!
      })
  }

  const reset = () => {
    setEditVisible(false)
    setVisible(false)
    setSelectedImage(null)
    setProgress(0)
    setCountry([])
    getAds()
  }

  const handleOnclose = () => {
    setEditVisible(false)
    setCountry([])
  }

  const storeData = async (url) => {
    const docData = {
      createAt: Timestamp.fromDate(new Date()),
      banner_url: url,
      name: name,
      country: country,
    }
    const ref = doc(CollectionRef)
    await setDoc(ref, docData).then(() => {
      reset()
    })
  }

  // firebase update function
  const update = async (url) => {
    setLoading(true)
    await updateDoc(doc(db, 'ads', editId), {
      banner_url: url,
      name: name,
      country: country,
    }).then(() => {
      reset()
    })
  }

  // firebase get data for edit function
  const edit = async (id) => {
    console.log('country array ===>', country)
    setEditVisible(true)
    const docRef = doc(db, 'ads', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let { banner_url, name, country } = docSnap.data()
      setThumbnail_url(banner_url)
      setName(name)
      setCountry(country)
      setEditId(id)
    }
  }

  // firebase delete function
  const Delete = async () => {
    const httpsReference = ref(storage, thumbnail_url) //get thumbnail url from state
    const desertRef = ref(storage, `ads/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => {})
      .catch((error) => {
        console.log('error', error)
      })

    deleteDoc(doc(db, 'ads', editId)).then(() => {
      reset()
    })
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <CButton sm={8} onClick={() => setVisible(!visible)}>
        Add New
      </CButton>
      {/* CREATE */}
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>CREATE</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-2">
            <CCol md={12} className="position-relative">
              <CInputGroup className="mb-1">
                <CFormInput
                  type="text"
                  aria-describedby="inputGroupFileAddon04"
                  aria-label="upload"
                  placeholder="Name"
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          {/*<CRow className="mb-2">*/}
          {/*  <CCol md={12} className="position-relative">*/}
          {/*    <CInputGroup className="mb-1">*/}
          {/*      <CFormSelect*/}
          {/*        id="validationTooltip04"*/}
          {/*        name="country"*/}
          {/*        onChange={(e) => {*/}
          {/*          setCountry(e.target.value)*/}
          {/*        }}*/}
          {/*        value={country}*/}
          {/*      >*/}
          {/*        <option value="">Country</option>*/}
          {/*        {counties.map((item) => {*/}
          {/*          return (*/}
          {/*            <option key={item.code} value={item.name}>*/}
          {/*              {item.name}*/}
          {/*            </option>*/}
          {/*          )*/}
          {/*        })}*/}
          {/*      </CFormSelect>*/}
          {/*    </CInputGroup>*/}
          {/*  </CCol>*/}
          {/*</CRow>*/}

          <CRow>
            <CCol md={12} className="position-relative">
              <CFormInput value={country} readOnly />
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol md={12} className="position-relative">
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

          {selectedImage ? (
            <CRow className="mb-3">
              <CImage align="center" rounded src={selectedImage} />
            </CRow>
          ) : null}

          <form onSubmit={uploadMedia}>
            <CRow className="mb-2">
              <CCol md={12} className="position-relative">
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="file"
                    id="inputGroupFile04"
                    aria-describedby="inputGroupFileAddon04"
                    aria-label="upload"
                    accept=".webp"
                    onChange={imageChange}
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
            {uploadNow == false ? (
              <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                Upload now
              </CButton>
            ) : null}
          </form>
        </CModalBody>
      </CModal>

      {/* UPDATE */}
      <CModal alignment="center" visible={editVisible} onClose={handleOnclose}>
        <CModalHeader>
          <CModalTitle>UPDATE</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-2">
            <CCol md={12} className="position-relative">
              <CInputGroup className="mb-1">
                <CFormInput
                  type="text"
                  aria-describedby="inputGroupFileAddon04"
                  aria-label="upload"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={12} className="position-relative">
              <CFormInput value={country} readOnly />
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol md={12} className="position-relative">
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

          {/*<CRow className="mb-2">*/}
          {/*  <CCol md={12} className="position-relative">*/}
          {/*    <CInputGroup className="mb-1">*/}
          {/*      <CFormSelect*/}
          {/*        id="validationTooltip04"*/}
          {/*        name="country"*/}
          {/*        onChange={(e) => {*/}
          {/*          setCountry(e.target.value)*/}
          {/*        }}*/}
          {/*        value={country}*/}
          {/*      >*/}
          {/*        <option value="">Country</option>*/}
          {/*        {counties.map((item) => {*/}
          {/*          return (*/}
          {/*            <option key={item.code} value={item.name}>*/}
          {/*              {item.name}*/}
          {/*            </option>*/}
          {/*          )*/}
          {/*        })}*/}
          {/*      </CFormSelect>*/}
          {/*    </CInputGroup>*/}
          {/*  </CCol>*/}
          {/*</CRow>*/}

          {selectedImage ? (
            <CRow className="mb-3">
              <CImage align="center" rounded src={selectedImage} />
            </CRow>
          ) : (
            <CRow className="mb-3">
              <CImage align="center" rounded src={thumbnail_url} />
            </CRow>
          )}

          <form onSubmit={uploadMedia}>
            <CRow className="mb-2">
              <CCol md={12} className="position-relative">
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="file"
                    id="inputGroupFile04"
                    aria-describedby="inputGroupFileAddon04"
                    aria-label="upload"
                    accept=".webp"
                    onChange={imageChange}
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

            <div className="row justify-content-md-center">
              <CCol xs lg={9}>
                <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                  UPDATE
                </CButton>
              </CCol>

              <CCol>
                <CButton color="danger" onClick={() => Delete()}>
                  DELETE
                </CButton>
              </CCol>
            </div>
          </form>
        </CModalBody>
      </CModal>

      {/* react - Table sub categories list */}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">IMG</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Country</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {myData.map((data, index) => {
            return (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>
                  <img width={200} src={data.banner_url} />
                </CTableDataCell>
                <CTableDataCell>{data.name}</CTableDataCell>
                <CTableDataCell>{data.country}</CTableDataCell>

                <CTableDataCell>
                  <CButton color="success" className="me-md-1" onClick={() => edit(data.id)}>
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
            <h2>ADS</h2>
          </CCardHeader>
          <CCardBody>{Ads()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
