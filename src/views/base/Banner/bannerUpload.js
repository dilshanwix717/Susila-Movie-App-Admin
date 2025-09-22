import {
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal,
  CModalHeader, CModalTitle, CModalBody, CFormInput, CRow, CCol, CCardHeader, CCard, CCardBody,
  CProgressBar, CProgress, CInputGroup, CFormSelect, CImage, CFormLabel, CFormFeedback, CFormTextarea
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { db, storage } from '../../../firebase';
import {
  collection, getDocs, query, doc, setDoc, Timestamp, deleteDoc, updateDoc, getDoc, where
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from 'src/components/loading/Loading';

const Banner = () => {
  const [myData, setMyData] = useState([])
  const [contentData, setContentData] = useState([])
  const [contentDataForTitles, setContentDataForTitles] = useState([])
  const [seriesData, setSeriesData] = useState([])
  const [webSeriesData, setWebSeriesData] = useState([])
  const [loading, setLoading] = useState(true)
  const CollectionRef = collection(db, 'banner')
  // const DataCollectionRef = collection(db, 'WebSeries')
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [seriesId, setSeriesId] = useState('')
  const [contentId, setContentId] = useState('')
  const [deviceVersion, setDeviceVersion] = useState()
  const [banner_video, setBanner_video] = useState('')
  const [selectedImage, setSelectedImage] = useState()
  const [editVisible, setEditVisible] = useState(false)
  const [thumbnail_url, setThumbnail_url] = useState('')
  const [editId, setEditId] = useState('')
  const [categoryData, setCategoryData] = useState([])
  const [uploadNow, setUploadNow] = useState(false)
  const [title, setTitle] = useState('')
  const [id, setId] = useState('')
  const [description, setDescription] = useState('')

  const [formValue, setFormValue] = useState({
    category: '',
  })
  const userCollectionRef = collection(db, 'content')
  const { category } = formValue
  const [selectedCategory, setSelectedCategory] = useState(null)

  // FIREBASE  - GET BANNER FROM FIRESTORE
  const getBanner = async () => {
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

  const getCategory = async () => {
    let q = query(collection(db, 'category'))
    const data = await getDocs(q).then(function (data) {
      setCategoryData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
      setLoading(false)
    })
  }

  // firebase get series
  const getSeries = async () => {
    let q = query(collection(db, 'series'))
    const data = await getDocs(q).then(function (data) {
      setSeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  // firebase get Webseries
  const getWebSeries = async () => {
    let q = query(collection(db, 'webSeries'))
    const data = await getDocs(q).then(function (data) {
      setWebSeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  const getContent = async () => {
    let q = query(collection(db, 'content'))
    const data = await getDocs(q).then(function (data) {
      setContentData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
      setLoading(false)
    })
  }

  const FilterFunction = async () => {
    setLoading(true)
    let q = query(userCollectionRef)
    // q = query(q, where('category')
    if (!category == '') {
      q = query(q, where('category', '==', category))
    }
    // if (!title == '') {
    //   q = query(q, where('title', '==', title))
    // }
    console.log('print category===>', category)
    console.log('print title===>', title)

    const data = await getDocs(q).then(function (data) {
      setContentData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
      setLoading(false)
    })
  }

  const handleChange = (event) => {
    // console.log('item title =', title)
    const { name, value } = event.target
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }


  const handleChangeForTitle = (event) => {
    console.log('item title ===>', event.target.value)
    setContentId(event.target.key)
    setTitle(event.target.value)
    console.log('print key==>', event.target.key)
    // const { name, value } = event.target
    // setFormValue((prevState) => {
    //   return {
    //     ...prevState,
    //     [name]: value,
    //   }
    // })
  }

  useEffect(() => {
    FilterFunction()
  }, [formValue])

  // REACT JS - USE EFFECT FUNCTION
  useEffect(() => {
    getBanner()
    getCategory()
    getSeries()
    getContent()
    getWebSeries()
    //getDataForContent()
    //getData()
  }, [])

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }
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
    const storageRef = ref(storage, `banner/${file.name}`)
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
    const httpsReference = ref(storage, thumbnail_url)
    const desertRef = ref(storage, `banner/${httpsReference.name}`)
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        update(newUrl)
      })
      .catch((error) => {
        console.log('error', error)
        update(newUrl)
      })
  }

  const reset = () => {
    setVisible(false)
    setEditVisible(false)
    setSelectedImage(null)
    setSeriesId(null)
    setBanner_video(null)
    setDeviceVersion(null)
    setProgress(0)
    setFormValue({ category: '', title: '' })
    setContentId(null)
    setTitle('')
    setId('')
    setDescription('')
    getContent()
    getCategory()
    getBanner()
  }

  const storeData = async (url) => {
    const docData = {
      createAt: Timestamp.fromDate(new Date()),
      category: category,
      content_ID: category === 'Teledrama' ? seriesId : category === 'Web Series' ? seriesId : contentId,
      deviceVersion: deviceVersion,
      banner_url: url,
      banner_video: banner_video,
      title: title,
      description: description ? description : '',
    }
    const ref = doc(CollectionRef)
    await setDoc(ref, docData).then(() => {
      reset()
    })
  }

  // firebase update function
  const update = async (url) => {
    setLoading(true)
    await updateDoc(doc(db, 'banner', editId), {
      category: category,
      content_ID: category === 'Teledrama' ? seriesId : category === 'Web Series' ? seriesId : contentId,
      // series_ID: seriesId,
      deviceVersion: deviceVersion,
      banner_url: url,
      banner_video: banner_video,
      title: title,
      description: description ? description : ''
    }).then(() => {
      reset()
    })
  }

  // firebase get data for edit function
  const edit = async (id) => {
    setEditVisible(true)
    const docRef = doc(db, 'banner', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let { banner_url, banner_video, content_ID, deviceVersion, category, title, description } = docSnap.data()
      setThumbnail_url(banner_url)
      setBanner_video(banner_video)
      if (category == 'Teledrama') setSeriesId(content_ID)
      if (category == 'Web Series') setSeriesId(content_ID)
      if (category != 'Teledrama') setContentId(content_ID)
      setDeviceVersion(deviceVersion)
      //setCategory(category)
      setEditId(id)
      setTitle(title)
      setDescription(description)
      setFormValue({ category: category })
      // setTitle(title)
    }
  }

  // firebase delete function
  const Delete = async () => {
    const httpsReference = ref(storage, thumbnail_url)
    const desertRef = ref(storage, `banner/${httpsReference.name}`)
    // Delete the file
    deleteObject(desertRef)
      .then(() => { })
      .catch((error) => {
        console.log('error', error)
      })

    deleteDoc(doc(db, 'banner', editId)).then(() => {
      reset()
    })
  }
  

  const onclickAddNew = () => {
    setFormValue({ category: '', title: '' })
    setVisible(!visible)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <CButton sm={8} onClick={onclickAddNew}>
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
                <CFormSelect
                  id="validationTooltip04"
                  onChange={(e) => {
                    setDeviceVersion(e.target.value)
                  }}
                  value={deviceVersion}
                >
                  <option value="">Banner Type</option>
                  <option value="portrait">For Mobile Screen</option>
                  <option value="landscape">From Big Screen</option>
                </CFormSelect>
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow className="mb-2">
            {/* mui category */}
            <CCol md={12} className="position-relative">
              <CFormSelect
                id="validationTooltip04"
                name="category"
                onChange={handleChange}
                value={category}
              >
                <option value="">Category</option>
                {categoryData.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  )
                })}
              </CFormSelect>
            </CCol>
          </CRow>
          {category == 'Teledrama' ? (
            <CRow className="mb-2">
              <CCol md={12} className="position-relative">
                <CInputGroup className="mb-1">
                  <CFormSelect
                    id="validationTooltip04"
                    name="series"
                    onChange={(e) => {
                      const selectedItem = JSON.parse(e.target.value);
                      setSeriesId(selectedItem.id);
                      setTitle(selectedItem.title);
                      console.log('Selected Series ID:', selectedItem.id);
                      console.log('Selected Title:', selectedItem.title);
                    }}
                    value={JSON.stringify({ id: seriesId, title })}
                  >
                    <option value="">Series</option>
                    {seriesData.map((item) => (
                      <option key={item.id} value={JSON.stringify({ id: item.id, title: item.title })}>
                        {item.title}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>
          ) : category == 'Web Series' ? (
            <CRow className="mb-2">
              <CCol md={12} className="position-relative">
                <CInputGroup className="mb-1">
                  <CFormSelect
                    id="validationTooltip04"
                    name="series"
                    onChange={(e) => {
                      const selectedItem = JSON.parse(e.target.value);
                      setSeriesId(selectedItem.id);
                      setTitle(selectedItem.title);
                      console.log('Selected Series ID:', selectedItem.id);
                      console.log('Selected Title:', selectedItem.title);
                    }}
                    value={JSON.stringify({ id: seriesId, title })}
                  >
                    <option value="">Series</option>
                    {webSeriesData.map((item) => (
                      <option key={item.id} value={JSON.stringify({ id: item.id, title: item.title })}>
                        {item.title}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>
          )
            : (
              <CRow className="mb-2">
                <CCol md={12} className="position-relative">
                  <CInputGroup className="mb-1">
                    <CFormSelect
                      id="validationTooltip04"
                      name="title"
                      onChange={(e) => {
                        const selectedItem = JSON.parse(e.target.value);
                        setTitle(selectedItem.title);
                        setId(selectedItem.id);
                        console.log('Selected Title:', selectedItem.title);
                        console.log('Selected ID:', selectedItem.id);
                      }}
                      value={JSON.stringify({ title, id })}
                    >
                      <option value="">Title</option>
                      {contentData
                        .filter(item => item.category === category)
                        .map(filteredItem => (
                          <option key={filteredItem.id} value={JSON.stringify({ title: filteredItem.title, id: filteredItem.id })}>
                            {filteredItem.title}
                          </option>
                        ))
                      }
                    </CFormSelect>
                  </CInputGroup>
                </CCol>
              </CRow>
            )}
          <CRow className="mb-3">
            <CCol sm={12}>
              <CFormTextarea type="text" onChange={(e) => setDescription(e.target.value)} placeholder={"description"} />
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol md={12} className="position-relative">
              <CInputGroup className="mb-1">
                <CFormInput
                  type="text"
                  aria-describedby="inputGroupFileAddon04"
                  aria-label="upload"
                  placeholder="Banner video URL"
                  value={banner_video}
                  onChange={(e) => {
                    setBanner_video(e.target.value)
                  }}
                />
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
      <CModal alignment="center" visible={editVisible} onClose={() => setEditVisible(false)}>
        <CModalHeader>
          <CModalTitle>UPDATE</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-2">
            <CCol md={12} className="position-relative">
              <CInputGroup className="mb-1">
                <CFormSelect
                  id="validationTooltip04"
                  onChange={(e) => {
                    setDeviceVersion(e.target.value)
                  }}
                  value={deviceVersion}
                >
                  <option value="">Banner Type</option>
                  <option value="portrait">For Mobile Screen</option>
                  <option value="landscape">From Big Screen</option>
                </CFormSelect>
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow className="mb-2">
            {/* mui category */}
            <CCol md={12} className="position-relative">
              <CFormSelect
                id="validationTooltip04"
                name="category"
                onChange={handleChange}
                value={category}
              >
                <option value="">Category</option>
                {categoryData.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  )
                })}
              </CFormSelect>
            </CCol>
          </CRow>

          {category == 'Teledrama' ? (
            <CRow className="mb-2">
              <CCol md={12} className="position-relative">
                <CInputGroup className="mb-1">
                  <CFormSelect
                    id="validationTooltip04"
                    name="series"
                    onChange={(e) => {
                      const selectedItem = JSON.parse(e.target.value);
                      setSeriesId(selectedItem.id);
                      setTitle(selectedItem.title);
                      console.log('printing title===>', title)
                      console.log('printing contentId===>', contentId)
                    }}
                    value={JSON.stringify({ id: seriesId, title })}
                  >
                    <option value="">Series</option>
                    {seriesData.map((item) => {
                      return (
                        <option key={item.id} value={JSON.stringify({ id: item.id, title: item.title })}>
                          {item.title}
                        </option>
                      );
                    })}
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>
          ) :
            category == 'Web Series' ? (
              <CRow className="mb-2">
                <CCol md={12} className="position-relative">
                  <CInputGroup className="mb-1">
                    <CFormSelect
                      id="validationTooltip04"
                      name="series"
                      onChange={(e) => {
                        const selectedItem = JSON.parse(e.target.value);
                        setSeriesId(selectedItem.id);
                        setTitle(selectedItem.title);
                        console.log('printing title===>', title)
                        console.log('printing contentId===>', contentId)
                      }}
                      value={JSON.stringify({ id: seriesId, title })}
                    >
                      <option value="">Series</option>
                      {webSeriesData.map((item) => {
                        return (
                          <option key={item.id} value={JSON.stringify({ id: item.id, title: item.title })}>
                            {item.title}
                          </option>
                        );
                      })}
                    </CFormSelect>

                  </CInputGroup>
                </CCol>
              </CRow>
            ) :
              (
                <CRow className="mb-2">
                  <CCol md={12} className="position-relative">
                    <CInputGroup className="mb-1">
                      <CFormSelect
                        id="validationTooltip04"
                        name="title"
                        onChange={(e) => {
                          const selectedItem = JSON.parse(e.target.value);
                          setTitle(selectedItem.title);
                          setContentId(selectedItem.id);
                          console.log('printing title===>', title)
                          console.log('printing contentId===>', contentId)
                        }}
                        value={JSON.stringify({ title, id })}
                      >
                        <option value="">Title</option>
                        {contentData
                          .filter(item => item.category === category)
                          .map((item) => (
                            <option key={item.id} value={JSON.stringify({ title: item.title, id: item.id })}>
                              {item.title}
                            </option>
                          ))}
                      </CFormSelect>


                    </CInputGroup>
                  </CCol>
                </CRow>
              )}
          <CRow className="mb-3">
            <CCol sm={12}>
              <CFormTextarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={"description"}
              />
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol md={12} className="position-relative">
              <CInputGroup className="mb-1">
                <CFormInput
                  type="text"
                  aria-describedby="inputGroupFileAddon04"
                  aria-label="upload"
                  placeholder="Banner video URL"
                  value={banner_video}
                  onChange={(e) => {
                    setBanner_video(e.target.value)
                  }}
                />
              </CInputGroup>
            </CCol>
          </CRow>
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
            <CTableHeaderCell scope="col">Screen Type</CTableHeaderCell>
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

                <CTableHeaderCell scope="row">{data.deviceVersion}</CTableHeaderCell>

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
            <h2>BANNER</h2>
          </CCardHeader>
          <CCardBody>{Banner()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
