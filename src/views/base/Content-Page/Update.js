import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CRow,
  CProgress,
  CProgressBar,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CContainer,
  CBadge,
  CHeaderDivider,
  CFormCheck,
  CImage,
} from '@coreui/react'
import { db, storage } from '../../../firebase'
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  getStorage,
  listAll,
} from 'firebase/storage'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import ScreenLoading from 'src/components/loading/Loading'
import thumbnailImage from '../../../assets/images/thumbnail.png'
import ccImage from '../../../assets/images/caption.png'
import noCC from '../../../assets/images/subtitles.png'
import { useNavigate, useParams } from 'react-router-dom'
import '../../upload/Index.css'
import audioUpload from '../../../assets/images/mp3-upload.png'
import audioUploaded from '../../../assets/images/mp3-uploaded.png'

const ContentData = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const params = useParams()
  const history = useNavigate()
  const storage = getStorage() //define storage
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  let [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [title, setTitle] = useState('')
  // const [youtubeLink, setYoutubeLink] = useState('')
  const [titleForPodcast, setTitleForPodcast] = useState('')
  const [titleForTravel, setTitleForTravel] = useState('')
  const [podcastSeriesName, setPodcastSeriesName] = useState('')
  const [travelSeriesName, setTravelSeriesName] = useState('')
  const [travelSeriesID, setTravelSeriesID] = useState('')
  const [realityShowsSeriesName, setRealityShowsSeriesName] = useState('')
  const [realityShowsSeriesID, setRealityShowsSeriesID] = useState('')
  const [discussionsSeriesName, setDiscussionsSeriesName] = useState('')
  const [webSeriesName, setWebSeriesName] = useState('')
  const [discussionsSeriesID, setDiscussionsSeriesID] = useState('')
  const [webSeriesID, setWebSeriesID] = useState('')
  const [cookerySeriesName, setCookerySeriesName] = useState('')
  const [createSeriesName, setCreateSeriesName] = useState('')
  const [cookerySeriesID, setCookerySeriesID] = useState('')
  const [createSeriesID, setCreateSeriesID] = useState('')
  const [musicType, setMusicType] = useState('')
  const [musicTypeForPrev, setMusicTypeForPrev] = useState('')
  const [season, setSeason] = useState(0)
  const [episode, setEpisode] = useState(0)
  const [description, setDescription] = useState('')
  const [premium, setPremium] = useState(true)
  const [noAdultContent, setNoAdultContent] = useState(true)
  const [tags, setTags] = useState([])
  const [series, setSeriesData] = useState([])
  const [podcastSeries, setPodcastSeriesData] = useState([])
  const [travelSeries, setTravelSeriesData] = useState([])
  const [realityShowsSeries, setRealityShowsSeriesData] = useState([])
  const [discussionsSeries, setDiscusionsSeriesData] = useState([])
  const [webSeries, setDWebSeriesData] = useState([])
  const [cookerySeries, setCookerySeriesData] = useState([])
  const [createSeries, setCreateSeriesData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [subcategoryData, setSubcategoryData] = useState([])
  const [qualityObj, setQualityObj] = useState({ '360p': '', '540p': '', '720p': '', '1080p': '' })
  const [selectedImage, setSelectedImage] = useState()
  const [selectedAudio, setSelectedAudio] = useState()
  const [uploadedAudio, setUploadedAudio] = useState()
  const [selectedMusicAudio, setSelectedMusicAudio] = useState()
  const [uploadedMusicAudio, setUploadedMusicAudio] = useState()
  const [editVisible, setEditVisible] = useState(false)
  const [editId, setEditId] = useState()
  const CollectionRef = collection(db, 'PodcastSeries')
  const CollectionRefForTravel = collection(db, 'Travel')
  const [audio_url, setAudio_url] = useState('')
  const [musicAudio_url, setMusicAudio_url] = useState('')
  const [contentProvider, setContentProvider] = useState('')
  const [contentProviderData, setContentProviderData] = useState([])
  const [contentProviderTitle, setContentProviderTitle] = useState('')
  const [isMusicAlbum, setIsMusicAlbum] = useState(false)
  const [musicAlbumData, setMusicAlbumData] = useState([])
  const [musicAlbum, setMusicAlbum] = useState('')
  const [categoryID, setCategoryID] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [deleteVisible, setDeleteVisible] = useState(false)
  // uploads
  const [progress, setProgress] = useState(0)
  const [thumbnail, setThumbnail] = useState()
  const [subtitle, setSubtitle] = useState('')
  const [visible, setVisible] = useState(false)
  const [visibleSubtitle, setVisibleSubtitle] = useState(false)
  const [audio, setAudio] = useState('')
  const [visibleAudio, setVisibleAudio] = useState(false)
  const [musicAudio, setMusicAudio] = useState('')
  const [visibleMusicAudio, setVisibleMusicAudio] = useState(false)
  const [artists, setArtists] = useState('')
  const [artistsData, setArtistsData] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [selectedCategoryBelongsToSeries, setSelectedCategoryToSeries] = useState('')


  const getAudioData = (audioUrl) => {
    console.log('uploaded audio name ==> ', audioUrl)
    const httpsReference = ref(storage, audioUrl)
    // const httpsReference = storage.refFromURL(audioUrl)
    setUploadedAudio(httpsReference.name)
    console.log('uploaded audio name ==> 222', httpsReference.name)
  }

  const getMusicAudioData = (musicAudioUrl) => {
    console.log('uploaded audio name ==> ', musicAudioUrl)
    const httpsReference = ref(storage, musicAudioUrl)
    // const httpsReference = storage.refFromURL(audioUrl)
    setUploadedMusicAudio(httpsReference.name)
    console.log('uploaded audio name ==> 222', httpsReference.name)
  }

  // firebase get match data
  const getData = async () => {
    const docRef = doc(db, 'content', params.id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let {
        category,
        categoryID,
        description,
        episode,
        premium,
        season,
        subcategory,
        contentProvider,
        contentProviderTitle,
        title,
        artists,
        // youtubeLink,
        cookerySeriesName,
        podcastSeriesName,
        travelSeriesName,
        travelSeriesID,
        realityShowsSeriesName,
        realityShowsSeriesID,
        discussionsSeriesName,
        discussionsSeriesID,
        webSeriesID,
        SeriesName,
        webSeriesName,
        createSeriesName,
        cookerySeriesID,
        createSeriesID,
        video_url,
        musicType,
        tag_Words,
        thumbnail_url,
        subTitle,
        audio_url,
        musicAudio_url,
        noAdultContent,
        isMusicAlbum,
        musicAlbum,
      } = docSnap.data()
      console.log('Document ID data:', docSnap.data())
      // console.log('Document data 2:', video_url)

      setSubtitle(subTitle)
      setCategoryID(categoryID)
      setTags(tag_Words)
      setArtists(artists)
      setVideoUrl(video_url); // Set the single video URL

      // video_url != null
      //   ? setQualityObj(video_url)
      //   : audio_url != null
      //     ? setAudio(audio_url)
      //     : setMusicAudio(musicAudio_url)
      setCategory(category)
      setMusicType(musicType)
      setMusicAlbum(musicAlbum)
      setIsMusicAlbum(isMusicAlbum)
      setMusicAudio_url(musicAudio_url)
      setSubcategory(subcategory)
      setContentProvider(contentProvider)
      setContentProviderTitle(contentProviderTitle)
      setTitle(title)
      setPodcastSeriesName(podcastSeriesName)
      setTravelSeriesName(travelSeriesName)
      setRealityShowsSeriesName(realityShowsSeriesName)
      setTravelSeriesID(travelSeriesID)
      setRealityShowsSeriesID(realityShowsSeriesID)
      setDiscussionsSeriesName(discussionsSeriesName)
      setWebSeriesName(webSeriesName)
      setDiscussionsSeriesID(discussionsSeriesID)
      setWebSeriesID(webSeriesID)
      setCookerySeriesName(cookerySeriesName)
      setCreateSeriesName(SeriesName)
      setCookerySeriesID(cookerySeriesID)
      setCreateSeriesID(createSeriesID)
      // setTitleForPodcast(titleForPodcast)
      setSeason(season == undefined ? 0 : season)
      setEpisode(episode == undefined ? 0 : episode)
      setPremium(!premium)
      setNoAdultContent(!noAdultContent)
      setDescription(description)
      setSelectedImage(thumbnail_url)
      setThumbnail(thumbnail_url)
      // if(youtubeLink != null)setYoutubeLink(youtubeLink)
      //setAudio(audio_url)
      if (video_url === undefined && musicAudio_url === undefined) {
        getAudioData(audio_url)
      } else if (video_url === undefined && audio_url === undefined) {
        getMusicAudioData(musicAudio_url)
      } else console.log('No such document')
    }
  }

  // firebase get super category
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

  const getArtists = async () => {
    let q = query(collection(db, 'artists'))
    const data = await getDocs(q).then(function (data) {
      setArtistsData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  // firebase get podcast series
  const getPodcastSeries = async () => {
    let q = query(collection(db, 'podcastSeries'))
    const data = await getDocs(q).then(function (data) {
      setPodcastSeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  // firebase get travel series
  const getTravelSeries = async () => {
    let q = query(collection(db, 'travelSeries'))
    const data = await getDocs(q).then(function (data) {
      setTravelSeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  const getRealityShowsSeries = async () => {
    let q = query(collection(db, 'realityShowsSeries'))
    const data = await getDocs(q).then(function (data) {
      setRealityShowsSeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  const getDiscussionsSeries = async () => {
    let q = query(collection(db, 'discussionsSeries'))
    const data = await getDocs(q).then(function (data) {
      setDiscusionsSeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }
  // firebase get web series data
  const getWebSeries = async () => {
    let q = query(collection(db, 'webSeries'))
    const data = await getDocs(q).then(function (data) {
      setDWebSeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  const getCookerySeries = async () => {
    let q = query(collection(db, 'cookerySeries'))
    const data = await getDocs(q).then(function (data) {
      setCookerySeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  const getCreateSeries = async () => {
    let q = query(collection(db, 'createSeries'))
    const data = await getDocs(q).then(function (data) {
      setCreateSeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  // firebase get contentProvider series
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
  const getCategory = async () => {
    let q = query(collection(db, 'category'))
    const data = await getDocs(q).then(function (data) {
      setCategoryData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  const getCategoryIsSeries = async () => {
    let q = query(collection(db, 'category'))
    const data = await getDocs(q);
    const categories = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const isSeriesValues = categories.map(category => category.isSeries);
    setSelectedCategoryToSeries(isSeriesValues);
  }

  // firebase get sub category
  const getSubcategoryList = async () => {
    let q = query(collection(db, 'subcategory'))
    const data = await getDocs(q).then(function (data) {
      setSubcategoryData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  // firebase get  musicAlbum
  const getMusicAlbum = async () => {
    let q = query(collection(db, 'musicAlbum'))
    const data = await getDocs(q).then(function (data) {
      setMusicAlbumData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

  useEffect(() => {
    getData()
    getSeries()
    getPodcastSeries()
    getTravelSeries()
    getRealityShowsSeries()
    getDiscussionsSeries()
    getWebSeries()
    getCookerySeries()
    getCreateSeries()
    getContentProvider()
    getCategory()
    getSubcategoryList()
    getArtists()
    getMusicAlbum()
    getCategoryIsSeries()
    setSelectedCategoryToSeries()

  }, [])

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    if (category === 'Music' && musicType === 'Audio') storeDataForMusicAudio(uploadedMusicAudio)
    if (category !== 'Podcast' && musicType !== 'Audio') StoreData()
    if (category === 'Podcast') storeDataForAudio()
  }
  // react - upload media contents
  const handleUpload = async (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return

    //const storageRef = ref(storage, `thumbnail/${file.name}`)
    const storageRef = ref(storage, 'thumbnail')
    const listResult = await listAll(storageRef)
    const fileExists = listResult.items.some((item) => item.name === file.name)

    if (fileExists) {
      alert('A file with the same name already exists.')
      return
    }
    if (thumbnail && thumbnail !== thumbnailImage) {
      const existingFileRef = ref(storage, thumbnail)
      await deleteObject(existingFileRef)
    }
    const uploadTask = uploadBytesResumable(ref(storage, `thumbnail/${file.name}`), file)
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
          setThumbnail(downloadURL)
          setProgress(0)
          setVisible(false)
        })
      },
    )
  }
  const handleUploadSubtitle = (e) => {
    e.preventDefault()
    // const file = e.target[0]?.files[0]
    // if (!file) return
    // const storageRef = ref(storage, `subtitle/${file.name}`)
    // const uploadTask = uploadBytesResumable(storageRef, file)
    //
    // uploadTask.on(
    //   'state_changed',
    //   (snapshot) => {
    //     const progressData = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    //     setProgress(progressData)
    //   },
    //   (error) => {
    //     alert(error)
    //   },
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //       setProgress(0)
    //       setVisibleSubtitle(false)
    //     })
    //   },
    // )
  }
  // const handleImageClick = async () => {
  //   if (thumbnail) {
  //     const storageRef = ref(storage, `thumbnail/${thumbnailName}`)
  //     await deleteObject(storageRef)
  //     setThumbnail(null)
  //   }
  // }

  //react audio file upload

  const handleUploadMusicAudio = async (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]

    if (!file && editVisible) {
      console.log('psh')
      // update(audio)
    }
    if (!file) return
    const storageRef = ref(storage, `audio/music`)
    const listResult = await listAll(storageRef)
    const fileExists = listResult.items.some((item) => item.name === file.name)

    if (fileExists) {
      alert('A file with the same name already exists.')
      return
    }
    const uploadTask = uploadBytesResumable(ref(storage, `audio/music/${file.name}`), file)
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
          setMusicAudio(downloadURL)
          setProgress(0)
          setUploadedMusicAudio(file.name)
          setVisibleMusicAudio(false)
        })
      },
    )
  }

  const handleUploadAudio = async (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]

    if (!file && editVisible) {
      console.log('psh')
      // update(audio)
    }
    if (!file) return
    //const storageRef = ref(storage, `audio/podcast/${file.name}`)
    const storageRef = ref(storage, `audio/podcast`)
    const listResult = await listAll(storageRef)
    const fileExists = listResult.items.some((item) => item.name === file.name)

    if (fileExists) {
      alert('A file with the same name already exists.')
      return
    }

    const uploadTask = uploadBytesResumable(ref(storage, `audio/podcast/${file.name}`), file)
    // const uploadTask = uploadBytesResumable(storageRef, file)

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
          setAudio(downloadURL)
          setProgress(0)
          setUploadedAudio(file.name)
          setVisibleAudio(false)
        })
      },
    )
  }

  const deleteMedia = async (newUrl) => {
    const httpsReference = ref(storage, audio) //get thumbnail url from state
    const desertRef = ref(storage, `audio/podcast/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        setLoading(false)
        history(-1)
        // File deleted successfully
        // console.log('success')
      })
      .catch((error) => {
        console.log('error', error)
        setLoading(false)
        history(-1)
        // Uh-oh, an error occurred!
      })
  }

  const deleteMediaForMusicAudio = async (newUrl) => {
    const httpsReference = ref(storage, audio) //get thumbnail url from state
    const desertRef = ref(storage, `audio/music/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        setLoading(false)
        history(-1)
        // File deleted successfully
        // console.log('success')
      })
      .catch((error) => {
        console.log('error', error)
        setLoading(false)
        history(-1)
        // Uh-oh, an error occurred!
      })
  }
  const audioChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedAudio(URL.createObjectURL(e.target.files[0]))
    }
  }

  const musicAudioChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedMusicAudio(URL.createObjectURL(e.target.files[0]))
    }
  }

  // firebase update function
  const update = async (url) => {
    setLoading(true)
    const selectedCategory = categoryData.find((item) => item.name === category)
    setCategoryID(selectedCategory.id)
    console.log('Category ID ====>', selectedCategory.id)
    await updateDoc(doc(db, 'series', editId), {
      subcategory: subcategory,
      categoryID: selectedCategory.id,
      // order: validOrder(),
      audio_url: url,
      //musicAudio_url: ma_url,
      title: title,
      titleForPodcast: titleForPodcast,
      titleForTravel: title,
      podcastSeriesName: podcastSeriesName,
      travelSeriesName: travelSeriesName,
      description: description,
      // trailer: trailer,
      // episodes: Number(episodes),
    }).then(() => {
      setEditVisible(false)
      setSelectedImage(null)
      setProgress(0)
      getSeries()
    })
  }
  // firebase get data for edit function
  const edit = async (id) => {
    setEditVisible(true)
    const docRef = doc(db, 'series', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      let {
        subcategory,
        order,
        title,
        description,
        episodes,
        trailer,
        thumbnail_url,
        titleForPodcast,
        contentProvider,
        contentProviderTitle,
        podcastSeriesName,
        travelSeriesName,
      } = docSnap.data()
      setSubcategory(subcategory)
      setContentProvider(contentProvider)
      setContentProviderTitle(contentProviderTitle)
      // setOrder(order)
      setAudio(audio_url)
      setTitleForPodcast(titleForPodcast)
      setMusicAudio(musicAudio_url)
      setTitle(title)
      setTravelSeriesName(travelSeriesName)
      // setTrailer(trailer)
      setDescription(description)
      setEditId(id)
      //setEpisodes(episodes)
    }
  }

  const TagForSearch = () => {
    let array = []
    for (let i = 0; i < tags.length; i++) {
      for (let j = 1; j <= tags[i].length; j++) {
        array.push(tags[i].substring(0, j))
      }
    }
    return array
  }

  const validSeason = () => {
    let modifiedValue
    if (season <= 9) {
      modifiedValue = `0${parseInt(season)}`
    } else {
      modifiedValue = `${season}`
    }
    return modifiedValue
  }

  const validEpisode = () => {
    let modifiedValue
    if (episode <= 9) {
      modifiedValue = `0${parseInt(episode)}`
    } else {
      modifiedValue = `${episode}`
    }
    return modifiedValue
  }

  const incrementCount = (state) => {
    if (state == 'season') {
      let value = parseInt(season) + 1
      setSeason(value)
    }

    if (state == 'episode') {
      let value = parseInt(episode) + 1
      setEpisode(value)
    }
  }
  const decrementCount = (state) => {
    if (state == 'season') {
      let value = parseInt(season) - 1
      setSeason(value)
    }

    if (state === 'episode') {
      let value = parseInt(episode) - 1
      setEpisode(value)
    }
  }

  const incrementCountForPodcast = () => {
    let count = parseInt(episode) + 1
    setEpisode(count)
  }

  const incrementCountForTravel = () => {
    let count = parseInt(episode) + 1
    setEpisode(count)
  }

  const incrementCountForRealityShows = () => {
    let count = parseInt(episode) + 1
    setEpisode(count)
  }
  const incrementCountForDiscussions = () => {
    let count = parseInt(episode) + 1
    setEpisode(count)
  }
  const incrementCountForWeb = () => {
    let count = parseInt(episode) + 1
    setEpisode(count)
  }
  const incrementCountForCookery = () => {
    let count = parseInt(episode) + 1
    setEpisode(count)
  }
  const incrementCountForCreate = () => {
    let count = parseInt(episode) + 1
    setEpisode(count)
  }

  const decrementCountForPodcast = () => {
    let count = parseInt(episode) - 1
    setEpisode(count)
  }

  const decrementCountForTravel = () => {
    let count = parseInt(episode) - 1
    setEpisode(count)
  }

  const decrementCountForRealityShows = () => {
    let count = parseInt(episode) - 1
    setEpisode(count)
  }

  const decrementCountForDiscussions = () => {
    let count = parseInt(episode) - 1
    setEpisode(count)
  }
  const decrementCountForWeb = () => {
    let count = parseInt(episode) - 1
    setEpisode(count)
  }
  const decrementCountForCookery = () => {
    let count = parseInt(episode) - 1
    setEpisode(count)
  }
  const decrementCountForCreate = () => {
    let count = parseInt(episode) - 1
    setEpisode(count)
  }

  const storeDataForAudio = async () => {
    const selectedCategory = categoryData.find((item) => item.name === category)
    setCategoryID(selectedCategory.id)
    if (subcategory == '') {
      return alert('please select subcategory')
    }

    if (title == '') {
      return alert('please input title')
    }

    if (description == '') {
      return alert('please input description')
    }

    if (!thumbnail) {
      return alert('please upload thumbnail image')
    }
    if (podcastSeriesName == '') {
      return alert('please select podcast series')
    }
    if (isMusicAlbum == true && musicAlbum == '') {
      return alert('please select music album')
    }
    if (category === 'Music' && artists == []) {
      return alert('please input artist')
    }

    console.log('inside of the audio handle')
    setLoading(true)
    await updateDoc(doc(db, 'content', params.id), {
      createAt: Timestamp.fromDate(new Date()),
      audio_url: audio,
      subcategory: subcategory,
      categoryID: selectedCategory.id,
      contentProvider: contentProvider,
      // order: validOrder(),
      episode: episode,
      musicAlbum: musicAlbum,
      isMusicAlbum: isMusicAlbum,
      artists: artists,
      //title: title,
      title: title,
      // youtubeLink:youtubeLink,
      podcastSeriesName: podcastSeriesName,
      premium: !premium,
      noAdultContent: !noAdultContent,
      thumbnail_url: thumbnail,
      description: description,
      favourite_user: [],
    }).then(() => {
      setLoading(false)
      setVisibleAudio(false)
      setProgress(0)
      setSelectedAudio(null)
      history(-1)
      // getPodcastSeries()
    })
  }
  const storeDataForMusicAudio = async (ma_url) => {
    const selectedCategory = categoryData.find((item) => item.name === category)
    setCategoryID(selectedCategory.id)
    console.log('inside of the audio handle')
    setLoading(true)
    await updateDoc(doc(db, 'content', params.id), {
      createAt: Timestamp.fromDate(new Date()),
      musicAudio_url: ma_url,
      subcategory: subcategory,
      categoryID: selectedCategory.id,
      contentProvider: contentProvider,
      musicAlbum: musicAlbum,
      isMusicAlbum: isMusicAlbum,
      artists: artists,
      // order: validOrder(),
      episode: episode,
      title: title,
      // youtubeLink:youtubeLink,
      musicType: musicType,
      premium: !premium,
      noAdultContent: !noAdultContent,
      thumbnail_url: thumbnail,
      description: description,
      favourite_user: [],
    }).then(() => {
      setLoading(false)
      setVisibleMusicAudio(false)
      setProgress(0)
      setSelectedMusicAudio(null)
      //deleteMediaForMusicAudio()
      // getPodcastSeries()
      history(-1)
    })
  }

  // firebase  - store data into firebase collection
  const StoreData = async () => {
    const selectedCategory = categoryData.find((item) => item.name === category)
    setCategoryID(selectedCategory.id)
    console.log('print categoryID===>', categoryID)
    let tagsChar = TagForSearch()

    if (category === 'Teledrama') {
      if (videoUrl === '') {
        return alert('Please paste video URL');
      }

      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input title')
      }

      if (parseInt(season) <= 0) {
        return alert('please select season')
      }

      if (parseInt(episode) <= 0) {
        return alert('please select episode')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      setLoading(true)

      await updateDoc(doc(db, 'content', params.id), {
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: selectedCategory.id,
        subcategory: subcategory,
        contentProvider: contentProvider,
        title: title,
        // youtubeLink:youtubeLink,
        season: validSeason(),
        episode: validEpisode(),
        premium: !premium,
        noAdultContent: !noAdultContent,
        thumbnail_url: thumbnail,
        video_url: videoUrl,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        audio_url: audio,
      }).then(() => {
        setLoading(false)
        history(-1)
      })

      // if (tags.length == 0) {
      //   return alert('please input tag word for video')
      // } else {
      //
      // }
    } else if (category === 'Podcast') {
      if (audio === '') {
        return alert('please upload Audio')
      }
      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      setLoading(true)

      await updateDoc(doc(db, 'content', params.id), {
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: selectedCategory.id,
        subcategory: subcategory,
        contentProvider: contentProvider,
        title: title,
        // youtubeLink:youtubeLink,
        podcastSeriesName: podcastSeriesName,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        audio_url: audio,
      }).then(() => {
        setLoading(false)
        history(-1)
      })
    } else if (category === 'Travel') {
      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      setLoading(true)

      await updateDoc(doc(db, 'content', params.id), {
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: selectedCategory.id,
        subcategory: subcategory,
        contentProvider: contentProvider,
        title: title,
        // youtubeLink:youtubeLink,
        travelSeriesID: travelSeriesID,
        travelSeriesName: travelSeriesName,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        video_url: qualityObj,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        audio_url: audio,
      }).then(() => {
        setLoading(false)
        history(-1)
      })
    } else if (category === 'Reality Shows') {
      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      setLoading(true)

      await updateDoc(doc(db, 'content', params.id), {
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: selectedCategory.id,
        subcategory: subcategory,
        contentProvider: contentProvider,
        title: title,
        // youtubeLink:youtubeLink,
        realityShowsSeriesID: realityShowsSeriesID,
        realityShowsSeriesName: realityShowsSeriesName,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        video_url: qualityObj,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        audio_url: audio,
      }).then(() => {
        setLoading(false)
        history(-1)
      })
    } else if (category === 'Discussions') {
      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      setLoading(true)

      await updateDoc(doc(db, 'content', params.id), {
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: selectedCategory.id,
        subcategory: subcategory,
        contentProvider: contentProvider,
        title: title,
        // youtubeLink:youtubeLink,
        discussionsSeriesID: discussionsSeriesID,
        discussionsSeriesName: discussionsSeriesName,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        video_url: qualityObj,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        audio_url: audio,
      }).then(() => {
        setLoading(false)
        history(-1)
      })
    }
    else if (category === 'Web Series') {
      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      setLoading(true)

      await updateDoc(doc(db, 'content', params.id), {
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: selectedCategory.id,
        subcategory: subcategory,
        contentProvider: contentProvider,
        title: title,
        webSeriesName: webSeriesName,
        webSeriesID: webSeriesID,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        video_url: videoUrl,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        audio_url: audio,
      }).then(() => {
        setLoading(false)
        history(-1)
      })
    }
    else if (category === 'Cookery') {
      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      setLoading(true)

      await updateDoc(doc(db, 'content', params.id), {
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: selectedCategory.id,
        subcategory: subcategory,
        contentProvider: contentProvider,
        title: title,
        // youtubeLink:youtubeLink,
        cookerySeriesID: cookerySeriesID,
        cookerySeriesName: cookerySeriesName,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        video_url: qualityObj,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        audio_url: audio,
      }).then(() => {
        setLoading(false)
        history(-1)
      })
    }
    else if (category === category && selectedCategoryBelongsToSeries == 'true') {
      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      setLoading(true)

      await updateDoc(doc(db, 'content', params.id), {
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: selectedCategory.id,
        subcategory: subcategory,
        contentProvider: contentProvider,
        title: title,
        // youtubeLink:youtubeLink,
        createSeriesID: createSeriesID,
        SeriesName: createSeriesName,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        video_url: qualityObj,
        premium: !premium,
        // noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        // audio_url: audio,
      }).then(() => {
        setLoading(false)
        history(-1)
      })
    }
    else if (category === 'Music' && musicAudio_url != null) {
      console.log('inside category == music and music type =audio')
      if (musicAudio === '') {
        return alert('please upload Audio Music')
      }
      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }
      if (isMusicAlbum == true && musicAlbum == '') {
        return alert('please select music album')
      }
      if (category === 'Music' && artists == '') {
        return alert('please input artist')
      }

      setLoading(true)

      await updateDoc(doc(db, 'content', params.id), {
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: selectedCategory.id,
        subcategory: subcategory,
        contentProvider: contentProvider,
        musicAlbum: musicAlbum,
        isMusicAlbum: isMusicAlbum,
        artists: artists,
        // podcastSeries: podcastSeries,
        title: title,
        // youtubeLink:youtubeLink,
        musicType: musicType,
        //lang: language,
        // season: validSeason(season),
        //episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        musicAudio_url: musicAudio,
        //audio_url: audio,
      }).then(() => {
        setLoading(false)
        history(-1)
      })
    } else if (category === 'Music' && musicAudio_url == null) {
      if (videoUrl === '') {
        return alert('Please paste video URL');
      }

      if (category == '') {
        return alert('please select category')
      }

      if (title == '') {
        return alert('please input title')
      }

      if (description == '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }
      if (isMusicAlbum == true && musicAlbum == '') {
        return alert('please select music album')
      }
      if (category === 'Music' && artists == '') {
        return alert('please input artist')
      }

      setLoading(true)
      await updateDoc(doc(db, 'content', params.id), {
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: selectedCategory.id,
        subcategory: subcategory,
        contentProvider: contentProvider,
        title: title,
        artists: artists,
        // youtubeLink:youtubeLink,
        premium: !premium,
        noAdultContent: !noAdultContent,
        isMusicAlbum: isMusicAlbum,
        musicAlbum: musicAlbum,
        thumbnail_url: thumbnail,
        video_url: videoUrl,
        // audio_url: audio,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        episode: validEpisode(episode),
        audio_url: audio,
      }).then(() => {
        setLoading(false)
        history(-1)
      })
    } else {
      if (videoUrl === '') {
        return alert('Please paste video URL');
      }

      if (category == '') {
        return alert('please select category')
      }

      if (title == '') {
        return alert('please input title')
      }

      if (description == '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      setLoading(true)
      await updateDoc(doc(db, 'content', params.id), {
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: selectedCategory.id,
        subcategory: subcategory,
        contentProvider: contentProvider,
        title: title,
        premium: !premium,
        noAdultContent: !noAdultContent,
        thumbnail_url: thumbnail,
        video_url: videoUrl,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        episode: validEpisode(episode),
        audio_url: audio,
      }).then(() => {
        setLoading(false)
        history(-1)
      })
    }
  }

  const Delete = async () => {
    const httpsReference = ref(storage, thumbnail) //get thumbnail url from state
    const desertRef = ref(storage, `thumbnail/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => { })
      .catch((error) => {
        console.log('error', error)
      })
    deleteDoc(doc(db, 'content', params.id)).then(() => {
      setLoading(false)
      history(-1)
    })
  }
  const DeletePodcastAudio = async () => {
    const httpsReference = ref(storage, audio)
    const desertRef = ref(storage, `audio/podcast/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => { })
      .catch((error) => {
        console.log('error', error)
      })

    deleteDoc(doc(db, 'content', params.id)).then(() => {
      setLoading(false)
      history(-1)
    })
  }

  const DeleteMusicAudio = async () => {
    const httpsReference = ref(storage, musicAudio) //get thumbnail url from state
    const desertRef = ref(storage, `audio/music/${httpsReference.name}`) //url to file name get for delete from storage
    // Delete the file
    deleteObject(desertRef)
      .then(() => { })
      .catch((error) => {
        console.log('error', error)
      })

    deleteDoc(doc(db, 'content', params.id)).then(() => {
      setLoading(false)
      history(-1)
    })
  }

  // js tag generate
  function handleKeyDown(e) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    e.stopPropagation()
    const value = e.target.value.toLowerCase()
    if (!value.trim()) return
    setTags([...tags, value])
    e.target.value = ''
  }

  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index))
  }

  function qualityArray(quality, url) {
    if (quality == '360p') {
      setQualityObj(() => {
        return { ...qualityObj, '360p': url }
      })
    }

    if (quality == '540p') {
      setQualityObj(() => {
        return { ...qualityObj, '540p': url }
      })
    }

    if (quality == '720p') {
      setQualityObj(() => {
        return { ...qualityObj, '720p': url }
      })
    }

    if (quality == '1080p') {
      setQualityObj(() => {
        return { ...qualityObj, '1080p': url }
      })
    }
  }

  const changeCheckbox = (value) => {
    setPremium(value)
  }

  const changeCheckboxForNoAdultContent = (value) => {
    setNoAdultContent(value)
  }

  const changeCheckboxForMusicAlbum = (value) => {
    setIsMusicAlbum(value)
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleClose = () => {
    setVisible(false)
    setSelectedImage(null)
    setVisibleAudio(false)
    setVisibleMusicAudio(false)
    setSelectedAudio(null)
    setSelectedMusicAudio(null)
    setEditVisible(false)
  }

  function teledramaSubcategory(providerTitle) {
    subcategoryData.forEach((element) => {
      console.log('Print element :', element)
      if (element.name === providerTitle) {
        setSubcategory(element.name)
        //setContentProviderTitle(contentProviderTitle)
      }
    })
  }

  const artistSelection = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value)
    setArtists(selectedValues)
  }

  if (loading) {
    return <ScreenLoading />
  }

  return (
    <>
      <CModal alignment="center" visible={deleteVisible} onClose={() => setDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CCol>
              <CRow>Are you sure you want to Delete {title} ?</CRow>
              <br />
              <CRow>
                <CCol xs={7}></CCol>
                <CCol xs={3} className="position-relative">
                  <CButton color="danger" onClick={() => {
                    if (category == 'Podcast') DeletePodcastAudio()
                    else if (category === 'Music' && musicAudio_url != null) DeleteMusicAudio()
                    else Delete()
                  }}>
                    Yes,Delete
                  </CButton>
                </CCol>
                <CCol xs={2} className="position-relative">
                  <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
                    No
                  </CButton>
                </CCol>
              </CRow>
            </CCol>
          </CForm>
        </CModalBody>
      </CModal>
      <div>
        <CContainer>
          <CRow className="row justify-content-md-center">
            <CCol md={4}>
              <img
                onClick={() => setVisible(true)}
                width={500}
                className="rounded"
                src={thumbnail ? thumbnail : thumbnailImage}
                alt=""
              />
            </CCol>
          </CRow>
          <br></br>
          {/* {category !== 'Podcast' && category !== 'Music' ? (
            <>
              {console.log('audio music type222===> :', musicType)}
              {console.log('inside of the subtile')}
              <CRow>
                <CCol md={4}>
                  <img
                    onClick={() => setVisibleSubtitle(true)}
                    width={80}
                    className="rounded"
                    src={subtitle !== '' ? ccImage : noCC}
                    alt=""
                  />
                  {subtitle !== '' ? (
                    <CBadge color="success">CC UPLOADED</CBadge>
                  ) : (
                    <CBadge color="warning">CC Empty</CBadge>
                  )}
                </CCol>
              </CRow>
            </>
          ) : (
            <>
              <br />
              <br />
            </>
          )} */}
        </CContainer>

        {/* css modal for add */}
        <CModal alignment="center" visible={visible} onClose={() => handleClose()}>
          <CModalHeader>
            <CModalTitle>EDIT THUMBNAIL</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedImage ? (
              <CRow className="mb-3">
                <CImage align="center" rounded src={selectedImage} />
              </CRow>
            ) : null}

            <form onSubmit={handleUpload}>
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

              <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                UPLOAD
              </CButton>
            </form>
          </CModalBody>
        </CModal>

        {/* css modal for add */}
        <CModal
          alignment="center"
          visible={visibleSubtitle}
          onClose={() => setVisibleSubtitle(false)}
        >
          <CModalHeader>
            <CModalTitle>SUBTITLE</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <form onSubmit={handleUploadSubtitle}>
              <CRow className="mb-2">
                <CCol md={12} className="position-relative">
                  <CInputGroup className="mb-1">
                    <CFormInput
                      type="file"
                      id="inputGroupFile04"
                      aria-describedby="inputGroupFileAddon04"
                      aria-label="upload"
                      accept=".vtt"
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
                UPLOAD
              </CButton>
            </form>
          </CModalBody>
        </CModal>

        {/* css modal for add */}
        <CModal alignment="center" visible={visibleAudio} onClose={() => handleClose()}>
          <CModalHeader>
            <CModalTitle>Podcast file</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedAudio ? (
              <CRow className="mb-3">
                <CImage align="center" rounded src={selectedAudio} />
              </CRow>
            ) : null}

            <form onSubmit={handleUploadAudio}>
              <CRow className="mb-2">
                <CCol md={12} className="position-relative">
                  <CInputGroup className="mb-1">
                    <CFormInput
                      type="file"
                      id="inputGroupFile04"
                      aria-describedby="inputGroupFileAddon04"
                      aria-label="upload"
                      accept=".mp3"
                      onChange={audioChange}
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

        {/* css modal for add  audio*/}
        <CModal alignment="center" visible={visibleMusicAudio} onClose={() => handleClose()}>
          <CModalHeader>
            <CModalTitle>Audio Music file</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedMusicAudio ? (
              <CRow className="mb-3">
                <CImage align="center" rounded src={selectedMusicAudio} />
              </CRow>
            ) : null}

            <form onSubmit={handleUploadMusicAudio}>
              <CRow className="mb-2">
                <CCol md={12} className="position-relative">
                  <CInputGroup className="mb-1">
                    <CFormInput
                      type="file"
                      id="inputGroupFile04"
                      aria-describedby="inputGroupFileAddon04"
                      aria-label="upload"
                      accept=".mp3"
                      onChange={musicAudioChange}
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
      </div>
      <CForm
        className="row g-3 needs-validation form"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >



        {category !== 'Podcast' && musicAudio_url == null ? (
          <>
            {/* quality section */}
            <CRow>
              <CCol md={12} className="position-relative">
                <CFormLabel htmlFor="videoUrlInput">Video URL (M3U8)</CFormLabel>
                <CFormInput
                  id="videoUrlInput"
                  required
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <CFormFeedback tooltip invalid>
                  Please input a valid video URL.
                </CFormFeedback>
              </CCol>
            </CRow>
          </>
        ) : null}

        <br />
        <br />
        <br />
        <br />
        {/* ---------------- */}
        {/*<CHeaderDivider/>*/}
        {/*<br/>*/}
        {/*<br/>*/}
        {/*<CRow>*/}
        {/*  <CCol md={2} className="position-relative">*/}
        {/*    <CFormInput id="validationTooltip04" required disabled value="Youtube link"/>*/}
        {/*  </CCol>*/}
        {/*  <CCol md={10} className="position-relative">*/}
        {/*    /!*<CFormLabel htmlFor="validationTooltip04">Youtube link</CFormLabel>*!/*/}
        {/*    <CFormInput*/}
        {/*      onChange={(e) => setYoutubeLink(e.target.value)}*/}
        {/*      id="validationTooltip04"*/}
        {/*      required*/}
        {/*      type="url"*/}
        {/*      value={youtubeLink}*/}
        {/*    />*/}
        {/*    <CFormFeedback tooltip invalid>*/}
        {/*      Please enter youtube link.*/}
        {/*    </CFormFeedback>*/}
        {/*  </CCol>*/}
        {/*</CRow>*/}
        {/*<br/>*/}
        {/*<br/>*/}
        {/*<br/>*/}
        {/*<CHeaderDivider/>*/}
        {/* mui category */}
        {/*<CCol md={4} className="position-relative">*/}
        {/*  <CFormLabel htmlFor="validationTooltip04">Category</CFormLabel>*/}

        {/*  <CFormSelect*/}
        {/*    id="validationTooltip04"*/}
        {/*    onChange={(e) => setCategory(e.target.value)}*/}
        {/*    value={category}*/}
        {/*    required*/}
        {/*  >*/}
        {/*    <option value="">Choose...</option>*/}
        {/*    {categoryData.map((item) => {*/}
        {/*      return (*/}
        {/*        <option key={item.id} value={item.name}>*/}
        {/*          {item.name}*/}
        {/*        </option>*/}
        {/*      )*/}
        {/*    })}*/}
        {/*  </CFormSelect>*/}
        {/*  <CFormFeedback tooltip invalid>*/}
        {/*    Please select Category.*/}
        {/*  </CFormFeedback>*/}
        {/*</CCol>*/}
        {/* mui contentProvider */}
        {category != 'Teledrama' ? (
          <CCol md={4} className="position-relative">
            <CFormLabel>Content Provider</CFormLabel>
            <CInputGroup className="mb-1">
              <CFormSelect
                id="validationTooltip04"
                name="series"
                onChange={(e) => {
                  setContentProvider(e.target.value)
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
        ) : (
          <CCol md={4} className="position-relative">
            <CFormLabel>Content Provider</CFormLabel>
            <CInputGroup className="mb-1">
              <CFormSelect
                id="validationTooltip04"
                name="series"
                onChange={(e) => {
                  setContentProvider(e.target.value)
                  setSubcategory(e.target.value)
                  setContentProviderTitle(e.target.options[e.target.selectedIndex].text)
                  teledramaSubcategory(e.target.options[e.target.selectedIndex].text)
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
        )}

        <CCol md={4} className="position-relative">
          <CFormLabel>Subcategory</CFormLabel>
          <CFormSelect onChange={(e) => setSubcategory(e.target.value)} value={subcategory}>
            <option value="">Choose...</option>
            {subcategoryData.map((item) => {
              if (item.category == category) {
                return (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                )
              }
            })}
          </CFormSelect>
        </CCol>

        {category == 'Teledrama' ? (
          <>
            {/* mui name */}
            <CCol md={4} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">
                {category == 'Teledrama' ? `Series Name` : `Title`}
              </CFormLabel>
              <CFormSelect
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                id="validationTooltip04"
                required
              >
                <option value="">Choose...</option>
                {series.map((item) => {
                  if (item.subcategory == subcategory) {
                    return (
                      <option key={item.id} value={item.title}>
                        {item.title}
                      </option>
                    )
                  }
                })}
              </CFormSelect>
              <CFormFeedback tooltip invalid>
                Please select title.
              </CFormFeedback>
            </CCol>
            {/* mui season */}
            <CCol md={4} className="position-relative">
              <CFormLabel>Season</CFormLabel>

              <div className="number-button">
                <div className="button" onClick={() => decrementCount('season')}>
                  -
                </div>

                <CCol md={3} className="position-relative">
                  <CFormInput onChange={(e) => setSeason(e.target.value)} required value={season} />
                </CCol>

                <div className="button" onClick={() => incrementCount('season')}>
                  +
                </div>
              </div>
            </CCol>
            {/* mui episode */}
            <CCol md={4} className="position-relative">
              <CFormLabel>Episode</CFormLabel>
              <div className="number-button">
                <div className="button" onClick={() => decrementCount('episode')}>
                  -
                </div>

                <CCol md={3} className="position-relative">
                  <CFormInput
                    onChange={(e) => setEpisode(e.target.value)}
                    required
                    value={episode}
                  />
                </CCol>

                <div className="button" onClick={() => incrementCount('episode')}>
                  +
                </div>
              </div>
            </CCol>
          </>
        ) : category == 'Podcast' ? (
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Podcast Series Name</CFormLabel>
            <CFormSelect
              onChange={(e) => setPodcastSeriesName(e.target.value)}
              // onSelect={(e) => setSeriesNextSeasonAndEpisode()}
              id="validationTooltip04"
              value={podcastSeriesName}
              required
            >
              <option value="">Choose...</option>
              {podcastSeries.map((item) => {
                if (item.subcategory === subcategory) {
                  return (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  )
                }
              })}
            </CFormSelect>
            <CFormFeedback tooltip invalid>
              Please select series name.
            </CFormFeedback>
          </CCol>
        ) : category == 'Travel' ? (
          <>
            <CCol md={4} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Travel Series Name</CFormLabel>
              <CFormSelect
                onChange={(e) => setTravelSeriesName(e.target.value)}
                // onSelect={(e) => setSeriesNextSeasonAndEpisode()}
                id="validationTooltip04"
                value={travelSeriesName}
                required
              >
                <option value="">Choose...</option>
                {travelSeries.map((item) => {
                  // if (item.subcategory === subcategory) {
                  return (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  )
                  // }
                })}
              </CFormSelect>
              <CFormFeedback tooltip invalid>
                Please select series name.
              </CFormFeedback>
            </CCol>
          </>
        ) : category == 'Reality Shows' ? (
          <>
            <CCol md={4} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Reality Shows Series Name</CFormLabel>
              <CFormSelect
                onChange={(e) => setRealityShowsSeriesName(e.target.value)}
                // onSelect={(e) => setSeriesNextSeasonAndEpisode()}
                id="validationTooltip04"
                value={realityShowsSeriesName}
                required
              >
                <option value="">Choose...</option>
                {realityShowsSeries.map((item) => {
                  // if (item.subcategory === subcategory) {
                  return (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  )
                  // }
                })}
              </CFormSelect>
              <CFormFeedback tooltip invalid>
                Please select series name.
              </CFormFeedback>
            </CCol>
          </>
        ) : category == 'Discussions' ? (
          <>
            <CCol md={4} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Discussions Series Name</CFormLabel>
              <CFormSelect
                onChange={(e) => setDiscussionsSeriesName(e.target.value)}
                // onSelect={(e) => setSeriesNextSeasonAndEpisode()}
                id="validationTooltip04"
                value={discussionsSeriesName}
                required
              >
                <option value="">Choose...</option>
                {discussionsSeries.map((item) => {
                  // if (item.subcategory === subcategory) {
                  return (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  )
                  // }
                })}
              </CFormSelect>
              <CFormFeedback tooltip invalid>
                Please select series name.
              </CFormFeedback>
            </CCol>
          </>
        ) : category == 'Web Series' ? (
          <>
            <CCol md={4} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Web Series Name</CFormLabel>
              <CFormSelect
                onChange={(e) => setWebSeriesName(e.target.value)}
                // onSelect={(e) => setSeriesNextSeasonAndEpisode()}
                id="validationTooltip04"
                value={webSeriesName}
                required
              >
                <option value="">Choose...</option>
                {webSeries.map((item) => {
                  // if (item.subcategory === subcategory) {
                  return (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  )
                  // }
                })}
              </CFormSelect>
              <CFormFeedback tooltip invalid>
                Please select series name.
              </CFormFeedback>
            </CCol>
          </>
          // ): category == 'Cookery' ? (
        ) : category == 'Cookery' ? (
          <>
            <CCol md={4} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Cookery Series Name</CFormLabel>
              <CFormSelect
                onChange={(e) => setCookerySeriesName(e.target.value)}
                // onSelect={(e) => setSeriesNextSeasonAndEpisode()}
                id="validationTooltip04"
                value={cookerySeriesName}
                required
              >
                <option value="">Choose...</option>
                {cookerySeries.map((item) => {
                  // if (item.subcategory === subcategory) {
                  return (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  )
                  // }
                })}
              </CFormSelect>
              <CFormFeedback tooltip invalid>
                Please select series name.
              </CFormFeedback>
            </CCol>
          </>
        )
          : category == category && selectedCategoryBelongsToSeries == 'true' ? (
            <>
              <CCol md={4} className="position-relative">
                <CFormLabel htmlFor="validationTooltip04">Series Name</CFormLabel>
                <CFormSelect
                  onChange={(e) => setCreateSeriesName(e.target.value)}
                  // onSelect={(e) => setSeriesNextSeasonAndEpisode()}
                  id="validationTooltip04"
                  value={createSeriesName}
                  required
                >
                  <option value="">Choose...</option>
                  {createSeries.map((item) => {
                    // if (item.subcategory === subcategory) {
                    return (
                      <option key={item.id} value={item.SeriesName}>
                        {item.SeriesName}
                      </option>
                    )
                    // }
                  })}
                </CFormSelect>
                <CFormFeedback tooltip invalid>
                  Please select series name.
                </CFormFeedback>
              </CCol>
            </>
          )
            : (
              <CCol md={4} className="position-relative">
                <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
                <CFormInput
                  onChange={(e) => setTitle(e.target.value)}
                  id="validationTooltip04"
                  required
                  type="text"
                  value={title}
                />

                <CFormFeedback tooltip invalid>
                  Please select series name.
                </CFormFeedback>
              </CCol>
            )}
        {/*{category == 'Podcast' ? (*/}
        {/* */}
        {/*  </>*/}
        {/*) : null}*/}

        {category == 'Podcast' ? (
          <>
            <CCol md={4} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
              <CFormInput
                onChange={(e) => setTitle(e.target.value)}
                id="validationTooltip04"
                required
                type="text"
                value={title}
              />
              <CFormFeedback tooltip invalid>
                Please select title.
              </CFormFeedback>
            </CCol>
            {/* mui episode */}
            <CCol md={4} className="position-relative">
              <CFormLabel>Episode</CFormLabel>
              <div className="number-button">
                <div className="button" onClick={() => decrementCountForPodcast()}>
                  -
                </div>
                <CCol md={3} className="position-relative">
                  <CFormInput
                    onChange={(e) => setEpisode(e.target.value)}
                    required
                    value={episode}
                  />
                </CCol>

                <div className="button" onClick={() => incrementCountForPodcast()}>
                  +
                </div>
              </div>
            </CCol>
            <CCol md={12} className="position-relative">
              <CFormLabel>{uploadedAudio}</CFormLabel>
            </CCol>
            {/* mui type */}
            <CCol md={12} className="position-relative">
              <CFormLabel>Insert Audio File</CFormLabel>
              <img
                onClick={() => setVisibleAudio(true)}
                width={50}
                className="rounded"
                src={audio ? audioUploaded : audioUpload}
                alt=""
              />
              {audio !== '' ? (
                <CBadge color="success">Uploaded</CBadge>
              ) : (
                <CBadge color="warning">Empty</CBadge>
              )}
            </CCol>
          </>
        ) : category == 'Travel' ? (
          <>
            <CCol md={5} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
              <CFormInput
                onChange={(e) => setTitle(e.target.value)}
                id="validationTooltip04"
                required
                type="text"
                value={title}
              />
              <CFormFeedback tooltip invalid>
                Please select title.
              </CFormFeedback>
            </CCol>
            {/* mui episode */}
            <CCol md={4} className="position-relative">
              <CFormLabel>Episode</CFormLabel>
              <div className="number-button">
                <div className="button" onClick={() => decrementCountForTravel()}>
                  -
                </div>
                <CCol md={3} className="position-relative">
                  <CFormInput
                    onChange={(e) => setEpisode(e.target.value)}
                    required
                    value={episode}
                  />
                </CCol>
                <div className="button" onClick={() => incrementCountForTravel()}>
                  +
                </div>
              </div>
            </CCol>
          </>
        ) : category == 'Reality Shows' ? (
          <>
            <CCol md={5} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
              <CFormInput
                onChange={(e) => setTitle(e.target.value)}
                id="validationTooltip04"
                required
                type="text"
                value={title}
              />
              <CFormFeedback tooltip invalid>
                Please select title.
              </CFormFeedback>
            </CCol>
            {/* mui episode */}
            <CCol md={4} className="position-relative">
              <CFormLabel>Episode</CFormLabel>
              <div className="number-button">
                <div className="button" onClick={() => decrementCountForRealityShows()}>
                  -
                </div>
                <CCol md={3} className="position-relative">
                  <CFormInput
                    onChange={(e) => setEpisode(e.target.value)}
                    required
                    value={episode}
                  />
                </CCol>
                <div className="button" onClick={() => incrementCountForRealityShows()}>
                  +
                </div>
              </div>
            </CCol>
          </>
        ) : category == 'Discussions' ? (
          <>
            <CCol md={5} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
              <CFormInput
                onChange={(e) => setTitle(e.target.value)}
                id="validationTooltip04"
                required
                type="text"
                value={title}
              />
              <CFormFeedback tooltip invalid>
                Please select title.
              </CFormFeedback>
            </CCol>
            {/* mui episode */}
            <CCol md={4} className="position-relative">
              <CFormLabel>Episode</CFormLabel>
              <div className="number-button">
                <div className="button" onClick={() => decrementCountForDiscussions()}>
                  -
                </div>
                <CCol md={3} className="position-relative">
                  <CFormInput
                    onChange={(e) => setEpisode(e.target.value)}
                    required
                    value={episode}
                  />
                </CCol>
                <div className="button" onClick={() => incrementCountForDiscussions()}>
                  +
                </div>
              </div>
            </CCol>
          </>
        ) : category == 'Web Series' ? (
          <>
            <CCol md={5} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
              <CFormInput
                onChange={(e) => setTitle(e.target.value)}
                id="validationTooltip04"
                required
                type="text"
                value={title}
              />
              <CFormFeedback tooltip invalid>
                Please select title.
              </CFormFeedback>
            </CCol>
            {/* mui episode */}
            <CCol md={4} className="position-relative">
              <CFormLabel>Episode</CFormLabel>
              <div className="number-button">
                <div className="button" onClick={() => decrementCountForDiscussions()}>
                  -
                </div>
                <CCol md={3} className="position-relative">
                  <CFormInput
                    onChange={(e) => setEpisode(e.target.value)}
                    required
                    value={episode}
                  />
                </CCol>
                <div className="button" onClick={() => incrementCountForDiscussions()}>
                  +
                </div>
              </div>
            </CCol>
          </>
        ) : category == 'Cookery' ? (
          <>
            <CCol md={5} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
              <CFormInput
                onChange={(e) => setTitle(e.target.value)}
                id="validationTooltip04"
                required
                type="text"
                value={title}
              />
              <CFormFeedback tooltip invalid>
                Please select title.
              </CFormFeedback>
            </CCol>
            {/* mui episode */}
            <CCol md={4} className="position-relative">
              <CFormLabel>Episode</CFormLabel>
              <div className="number-button">
                <div className="button" onClick={() => decrementCountForCookery()}>
                  -
                </div>
                <CCol md={3} className="position-relative">
                  <CFormInput
                    onChange={(e) => setEpisode(e.target.value)}
                    required
                    value={episode}
                  />
                </CCol>
                <div className="button" onClick={() => incrementCountForCookery()}>
                  +
                </div>
              </div>
            </CCol>
          </>
        )
          : category == category && selectedCategoryBelongsToSeries == 'true' ? (
            <>
              <CCol md={5} className="position-relative">
                <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
                <CFormInput
                  onChange={(e) => setTitle(e.target.value)}
                  id="validationTooltip04"
                  required
                  type="text"
                  value={title}
                />
                <CFormFeedback tooltip invalid>
                  Please select title.
                </CFormFeedback>
              </CCol>
              {/* mui episode */}
              <CCol md={4} className="position-relative">
                <CFormLabel>Episode</CFormLabel>
                <div className="number-button">
                  <div className="button" onClick={() => decrementCountForCreate()}>
                    -
                  </div>
                  <CCol md={3} className="position-relative">
                    <CFormInput
                      onChange={(e) => setEpisode(e.target.value)}
                      required
                      value={episode}
                    />
                  </CCol>
                  <div className="button" onClick={() => incrementCountForCreate()}>
                    +
                  </div>
                </div>
              </CCol>
            </>
          )
            : null}
        {category === 'Music' && musicAudio_url != null ? (
          <>
            {console.log('audio music type===> :', musicType)}
            <CCol md={12} className="position-relative">
              <CFormLabel>{uploadedMusicAudio}</CFormLabel>
            </CCol>
            {/* mui type */}
            <CCol md={12} className="position-relative">
              <CFormLabel>Insert Audio Music File</CFormLabel>
              <img
                onClick={() => setVisibleMusicAudio(true)}
                width={50}
                className="rounded"
                src={musicAudio ? audioUploaded : audioUpload}
                alt=""
              />
              {musicAudio !== '' ? (
                <CBadge color="success">Uploaded</CBadge>
              ) : (
                <CBadge color="warning">Empty</CBadge>
              )}
            </CCol>
          </>
        ) : null}

        {category == 'Music' ? (
          <>
            <CRow>
              <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
                Artist/Artists
              </CFormLabel>
            </CRow>
            <CRow>
              <CCol md={4} className="position-relative">
                <CFormInput value={artists} readOnly />
              </CCol>
            </CRow>
            <CRow>
              {/*<CCol md={4} className="position-relative"></CCol>*/}
              <CCol md={4} className="position-relative">
                <CInputGroup className="mb-1">
                  <CFormSelect
                    id="validationTooltip04"
                    name="artist"
                    onChange={artistSelection}
                    value={artists}
                    multiple
                  >
                    <option value="">Artist</option>
                    {artistsData.map((item) => {
                      return (
                        <option key={item.id} value={item.artistName}>
                          {item.artistName}
                        </option>
                      )
                    })}
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>
            <br />
          </>
        ) : null}

        {category == 'Music' ? (
          <>
            <CFormCheck
              id="flexCheckChecked"
              label="Music Album"
              checked={isMusicAlbum}
              onChange={(e) => changeCheckboxForMusicAlbum(e.target.checked)}
            />
          </>
        ) : null}
        {isMusicAlbum == true ? (
          <>
            {/* mui MusicAlbum */}
            <CCol md={4} className="position-relative">
              <CFormSelect
                id="validationTooltip04"
                onChange={(e) => setMusicAlbum(e.target.value)}
                required
                value={musicAlbum}
              >
                <option value="">Select Music Album</option>
                {musicAlbumData.map((item) => {
                  return (
                    <option key={item.id} value={item.title}>
                      {item.title} {item.artists[0]}
                    </option>
                  )
                })}
              </CFormSelect>
              <CFormFeedback tooltip invalid>
                Please select Category.
              </CFormFeedback>
            </CCol>
          </>
        ) : null}

        {/* mui Description */}
        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="exampleFormControlTextarea1">Description</CFormLabel>
          <CFormTextarea
            onChange={(e) => setDescription(e.target.value)}
            id="exampleFormControlTextarea1"
            rows="4"
            required
            value={description}
          />
          <CFormFeedback tooltip invalid>
            Please input content description.
          </CFormFeedback>
        </CCol>

        <CCol md={4} className="position-relative">
          <CFormLabel htmlFor="validationTooltip04">Content Type</CFormLabel>
          <CFormCheck
            onChange={(e) => changeCheckbox(e.target.checked)}
            id="flexCheckChecked"
            label="Free"
            checked={premium}
          />
        </CCol>
        {category == 'Movies' ? (
          <CRow>
            <CCol>
              <CFormCheck
                onChange={(e) => changeCheckboxForNoAdultContent(e.target.checked)}
                id="flexCheckChecked"
                label="18+"
                checked={noAdultContent}
              />
            </CCol>
          </CRow>
        ) : null}
        <CCol xs={12} className="position-relative">
          <CButton color="primary" type="submit" >
            UPDATE NOW
          </CButton>
        </CCol>
      </CForm>
      <br />
      <CButton
        color="danger"
        onClick={() => { setDeleteVisible(true) }}>
        DELETE
      </CButton>
    </>
  )
}

const Index = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>CONTENT UPDATE</h3>
          </CCardHeader>
          <CCardBody>{ContentData()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
