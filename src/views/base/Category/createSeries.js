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
} from '@coreui/react'
import React, { useEffect, useState , prevState} from 'react'
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
import {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
    getStorage,
} from 'firebase/storage'
import { reload } from 'firebase/auth'
  
const createSeries = () => {
    const storage = getStorage() //define storage
    const [validated, setValidated] = useState(false)
    const [myData, setMyData] = useState([])
    const [title, setTitle] = useState('')
    const [name, setName] = useState('')
    const [order, setOrder] = useState(0)
    const [description, setDescription] = useState('')
    const [trailer, setTrailer] = useState('')
    const [thumbnail_url, setThumbnail_url] = useState('')
    const [selectedImage, setSelectedImage] = useState('')
    const [subcategoryData, setSubcategoryData] = useState([])
    const [loading, setLoading] = useState(true)
    const CollectionRef = collection(db, 'createSeries')
    const [visible, setVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState()
    const [editId, setEditId] = useState()
    const [progress, setProgress] = useState(0)
    const [episodes, setEpisodes] = useState()
    const [hide, setHide] = useState(false)
    const [displayFeaturedContent, setDisplayFeaturedContent] = useState('')
    const [featuredContent, setFeaturedContent] = useState(false)
    const [contentProvider, setContentProvider] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [contentProviderData, setContentProviderData] = useState([])
    const [categoryNameData, setCategoryNameData] = useState([])
    const [contentProviderTitle, setContentProviderTitle] = useState('')
    const [seriesNameTitle, setSeriesNameTitle] = useState('')
    const [uploadNow, setUploadNow] = useState(false)
    const [contentProviderError, setContentProviderError] = useState(false);
    const [seriesNameError, setSeriesNameError] = useState(false);
    const [titleError, setTitleError] = useState(false)
    const [categoryNameText, setCategoryNameText] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedCategoryName, setSelectedCategoryName] = useState('')
    const [createSeries, setCreateSeriesData] = useState([])
    const [selectedCategoryData, setSelectedCategoryData] = useState([])
    const [categoryID, setCategoryID] = useState('')

    // FIREBASE - GET USER FROM FIRESTORE
    const getSeries = async () => {
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

    const getSubcategory = async () => {
        let q = query(collection(db, 'subcategory'))
        // q = query(q, where('category', '==', 'Web Series'))
        const data = await getDocs(q).then(function (data) {
        setSubcategoryData(
            data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            })),
        )
        })
    }
    // firebase get Category
    const getCategoryName = async () => {
        let q = query(collection(db, 'category'))
        const data = await getDocs(q).then(function (data) {
            setCategoryName(
                data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                })),
            )
        })
    }

    // firebase get categoryNameData
    const getSeriesData = async () => {
        let q = query(collection(db, 'category'))
        const data = await getDocs(q).then(function (data) {
            setCategoryNameData(
                data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                })),
            )
        })
    }    
    // firebase get contentProvider
    const getContentProvider = async () => {
        let q = query(collection(db, 'contentProvider'))
        const data = await getDocs(q).then(function (data) {
            setContentProviderData(
                data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                })),
            )
        })
    }

    // firebase - store data into firebase collection
    const uploadMedia = (e) => {
        e.preventDefault()
        setUploadNow(true)
        const file = e.target[0]?.files[0]

        // // when update if no change in thumbnail
        if (!file && editVisible) {
        // console.log('psh')
        update(thumbnail_url)
        setUploadNow(false)
        }

        if (!contentProvider) {
            setContentProviderError(true);
        return;
        }
        // if (!seriesName) {
        //     setSeriesNameError(true);
        // return;
        // }
        if (!title) {
        setTitleError(true);
        return;
        }

        if (!file) return
        const storageRef = ref(storage, `createSeries_thumbnail/${file.name}`)
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
        const desertRef = ref(storage, `createSeries_thumbnail/${httpsReference.name}`) //url to file name get for delete from storage
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
        })
    }

    // firebase - store data into firebase collection
    const storeData = async (url) => {
        if (featuredContent === true && displayFeaturedContent === '') {
        return alert('please choose featured content display option')
        }
        if (!subcategory) {
        return alert('please select valid subcategory')
        }
        setLoading(true)
        const ref = doc(CollectionRef)
        const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        thumbnail_url: url,
        trailer: trailer,
        subcategory: contentProviderTitle,
        contentProvider: contentProvider,
        SeriesName: title,
        category: categoryNameText, 
        description: description,
        favourite_user: [],
        }
        await setDoc(ref, docData).then(() => {
        setVisible(false)
        setProgress(0)
        setSelectedImage(null)
        setHide(false)
        setFeaturedContent(false)
        setDisplayFeaturedContent('')
        getSeries()
        })
    }

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setSelectedImage(URL.createObjectURL(e.target.files[0]))
        }
    }
    
    // firebase update function
    const update = async (url) => {
    if (featuredContent === true && displayFeaturedContent === '') {
        return alert('please choose featured content display option')
    }
    setLoading(true)
    await updateDoc(doc(db, 'createSeries', editId), {
        subcategory: subcategory,
        contentProvider: contentProvider,
        thumbnail_url: url,
        SeriesName: title,
        description: description,
        // seriesName: seriesName,
        // category: seriesNameText,
        trailer: trailer,
    }).then(() => {
        setHide(false)
        setFeaturedContent(false)
        setDisplayFeaturedContent('')
        setEditVisible(false)
        setSelectedImage(null)
        setProgress(0)
        getSeries()
        // console.log('Print subcategory ===>', subcategory)
    })
    }

    // firebase get data for edit function
    const edit = async (id) => {
    setEditVisible(true)
    const docRef = doc(db, 'createSeries', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        let {
        subcategory,
        contentProvider,
        // category,
        contentProviderTitle,
        SeriesName,
        description,
        trailer,
        thumbnail_url,
        } = docSnap.data()
        setSubcategory(subcategory)
        setContentProvider(contentProvider)
        // setSeriesName(category)
        setContentProviderTitle(contentProviderTitle)
        setThumbnail_url(thumbnail_url)
        setTitle(SeriesName)
        setTrailer(trailer)
        setDescription(description)
        setEditId(id)
    }
    }

    // firebase delete function
    const Delete = async () => {
    const httpsReference = ref(storage, thumbnail_url) //get thumbnail url from state
    const desertRef = ref(storage, `createSeries_thumbnail/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
        .then(() => {
        // File deleted successfully
        // console.log('success')
        })
        .catch((error) => {
        // console.log('error', error)
        })

    deleteDoc(doc(db, 'createSeries', editId)).then(() => {
        setEditVisible(false)
        getSeries()
    })
    }

    const handleClose = () => {
        setContentProvider('')
        setCategoryName('')
        setTitle('')
        setVisible(false)
        setSelectedImage(null)
        setHide(false)
        setFeaturedContent(false)
        setDisplayFeaturedContent('')
        setEditVisible(false)
    }

    function teledramaSubcategory(providerTitle) {
        subcategoryData.forEach((element) => {
            // console.log('Print element :', element)
            if (element.name === providerTitle) {
            setSubcategory(element.name)
            }
        })
    }

    const handleAddNew = () => {
    setContentProvider('')
    setCategoryName('')
    setVisible(!visible)
    }

    // REACT JS - USE EFFECT FUNCTION
    useEffect(() => {
        getSeries()
        getSubcategory()
        getContentProvider()
        getCategoryName()
        getSeriesData()
        getCreateSeries()
        setTitle()
        setSelectedCategory()
        setCategoryID()
    }, [])

    const getCreateSeries = async (categoryNameText) => {
        if (!categoryNameText) {
          setCreateSeriesData([])
          return;
        }
        let q = query(collection(db, 'category'), where('category', '==', categoryNameText))
      
        const querySnapshot = await getDocs(q)
        const categoryData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
      
        setCreateSeriesData(categoryData)
    }
    useEffect(() => {
        if (categoryNameText) {
          getCreateSeries(categoryNameText);
        }
      }, [categoryNameText])

    if (loading) {
        return <Loading/>
    }
    
    console.log('categoryName ==================>>>>>>>',categoryName)

  return (
    <>
        <CButton sm={8} onClick={handleAddNew}>
            Add New
        </CButton>

        {/* CREATE */}
        <CModal alignment="center" visible={visible} onClose={() => handleClose()}>
            <CModalHeader>
            <CModalTitle>Create Series</CModalTitle>
            </CModalHeader>
            <CModalBody>
            <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
                Content Provider
                </CFormLabel>
                <CCol md={8} className="position-relative">
                <CInputGroup className="mb-1">
                    <CFormSelect
                    id="validationTooltip04"
                    name="series"
                    onChange={(e) => {
                        setContentProvider(prevState =>e.target.value)
                        setSubcategory(prevState =>e.target.value)
                        setContentProviderTitle(e.target.options[e.target.selectedIndex].text)
                        console.log('testing content provider sub:', e.target.value)
                    }}
                    value={contentProvider} required
                    >
                    <option value="">Choose..</option>
                    {contentProviderData.map((item) => {
                        return (
                        <option key={item.id} value={item.id}>
                            {item.title}
                        </option>
                        )
                    })}
                    </CFormSelect>
                </CInputGroup>
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
                     Category
                </CFormLabel>
                <CCol md={8} className="position-relative">
                <CInputGroup className="mb-1">
                    <CFormSelect
                    id="validationTooltip04"
                    name="seriesName"
                    onChange={(e) => {
                        setCategoryName(e.target.value)
                        const selectedIndex = e.target.options.selectedIndex
                        const selectedText = e.target.options[selectedIndex].text
                        setCategoryNameText(selectedText)
                        const selectedId = e.target.value
                        const selectedCategoryObj = categoryNameData.find((item) => item.id === selectedId)
                        setSelectedCategory(selectedCategoryObj.isSeries)
                        setSelectedCategoryName(selectedCategoryObj.name)
                    }}
                    value={categoryName} required
                    >
                    <option value="">Choose..</option>
                    {categoryNameData.map((item) => {
                        return ( 
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                        )
                    })}
                    </CFormSelect>
                </CInputGroup>
                </CCol>
            </CRow>
            {selectedCategoryName == categoryNameText  && selectedCategory ? (
                <>
                    {/* <CRow className="mb-3">
                        <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                            Series Title
                        </CFormLabel>
                        <CCol sm={8}>
                            <CFormInput type="text" onChange={(e) => setTitle(e.target.value)} required/>
                        </CCol>
                    </CRow> */}
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="validationTooltip05" className="col-sm-4 col-form-label">Series Name</CFormLabel>
                        <CCol md={8} className="position-relative">
                            <CFormInput
                            type="text"
                            id="validationTooltip04"
                            name='SeriesName'
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            >
                            </CFormInput>
                        </CCol>
                    </CRow>
                </>
            ):null}
            <CRow className="mb-3">
                <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Description
                </CFormLabel>
                <CCol sm={8}>
                <CFormTextarea type="text" onChange={(e) => setDescription(e.target.value)} />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Trailer URL
                </CFormLabel>
                <CCol sm={8}>
                <CFormInput type="text" onChange={(e) => setTrailer(e.target.value)} />
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
                        name="MasterImage"
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

        {/* UPDATE*/}
        <CModal alignment="center" visible={editVisible} onClose={() => handleClose()}>
            <CModalHeader>
            <CModalTitle>UPDATE SERIES</CModalTitle>
            </CModalHeader>
            <CModalBody>
            <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
                Content Provider
                </CFormLabel>
                <CCol md={8} className="position-relative">
                <CInputGroup className="mb-1">
                    <CFormSelect
                    id="validationTooltip04"
                    name="series"
                    onChange={(e) => {
                        setContentProvider(e.target.value)
                        setSubcategory(e.target.value)
                        setContentProviderTitle(e.target.options[e.target.selectedIndex].text)
                        teledramaSubcategory(e.target.options[e.target.selectedIndex].text)
                        console.log('testing content provider sub:', contentProvider)
                    }}
                    value={contentProvider}
                    >
                    <option value="">Choose..</option>
                    {contentProviderData.map((item) => {
                        return (
                        <option key={item.id} value={item.id}>
                            {item.title}
                        </option>
                        )
                    })}
                    </CFormSelect>
                </CInputGroup>
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                 Series Name
                </CFormLabel>
                <CCol sm={8}>
                <CFormInput type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </CCol>
            </CRow>
            {/* <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
                  Category
                </CFormLabel>
                <CCol md={8} className="position-relative">
                <CInputGroup className="mb-1">
                    <CFormSelect
                    id="validationTooltip04"
                    name="seriesName"
                    onChange={(e) => {
                        setSeriesName(e.target.value)
                        // setSubcategory(e.target.value)
                        // setSeriesNameTitle(e.target.options[e.target.selectedIndex].text)
                        // teledramaSubcategory(e.target.options[e.target.selectedIndex].text)
                        // console.log('testing content provider sub:', subcategory)
                    }}
                    value={seriesName}
                    >
                    <option value="">Choose..</option>
                    {categoryNameData.map((item) => {
                        return (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                        )
                    })}
                    </CFormSelect>
                </CInputGroup>
                </CCol>
            </CRow> */}
            <CRow className="mb-3">
                <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Description
                </CFormLabel>
                <CCol sm={8}>
                <CFormTextarea
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Trailer
                </CFormLabel>
                <CCol sm={8}>
                <CFormInput
                    type="text"
                    value={trailer}
                    onChange={(e) => setTrailer(e.target.value)}
                />
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
                        name="MasterImage"
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
                <CTableHeaderCell scope="col">THUMBNAIL</CTableHeaderCell>
                <CTableHeaderCell scope="col">SERIES NAME</CTableHeaderCell>
                {/* <CTableHeaderCell scope="col">CATEGORY</CTableHeaderCell> */}
                <CTableHeaderCell scope="col">C PROVIDER</CTableHeaderCell>
                <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
            </CTableRow>
            </CTableHead>
            <CTableBody>
             {myData.map((data, index) => {
                return (
                    <CTableRow key={data.id}>
                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                        <CTableDataCell>
                        <img width={100} height={60} src={data.thumbnail_url} />
                        </CTableDataCell>
                        <CTableDataCell>{data.SeriesName}</CTableDataCell>
                        {/* <CTableDataCell>{data.category}</CTableDataCell> */}
                        <CTableDataCell>
                        <CBadge color="success">{data.subcategory}</CBadge>
                        </CTableDataCell>
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
                <h2> CREATE SERIES </h2>
                </CCardHeader>
                <CCardBody>{createSeries()}</CCardBody>
            </CCard>
            </CCol>
        </CRow>
    )
}

export default Index
