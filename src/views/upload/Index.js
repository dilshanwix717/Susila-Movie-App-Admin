import React, { useEffect, useState } from 'react';
import {
  CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput,
  CFormFeedback, CFormLabel, CFormSelect, CFormTextarea, CInputGroup,
  CRow, CProgress, CProgressBar, CModal, CModalBody, CModalHeader,
  CModalTitle, CContainer, CBadge, CHeaderDivider, CFormCheck, CImage
} from '@coreui/react';
import { db, storage } from '../../firebase';
import { ref, getDownloadURL, uploadBytesResumable, listAll } from 'firebase/storage';
import { collection, doc, getDocs, query, setDoc, Timestamp, where } from 'firebase/firestore';

import './Index.css';
import ScreenLoading from 'src/components/loading/Loading';
import thumbnailImage from '../../assets/images/thumbnail.png';
import ccImage from '../../assets/images/caption.png';
import noCC from '../../assets/images/subtitles.png';


const ContentData = () => {
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')
  const [musicAlbum, setMusicAlbum] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [language, setLanguage] = useState('')
  const [musicType, setMusicType] = useState('')
  const [title, setTitle] = useState('')
  const [podcastSeriesName, setPodcastSeriesName] = useState('')
  const [travelSeriesName, setTravelSeriesName] = useState('')
  const [realityShowsSeriesName, setRealityShowsSeriesName] = useState('')
  const [discussionsSeriesName, setDiscussionsSeriesName] = useState('')
  const [webSeriesName, setWebSeriesName] = useState('')
  const [cookerySeriesName, setCookerySeriesName] = useState('')
  const [createSeriesName, setCreateSeriesName] = useState('')
  const [titleForPodcast, setTitleForPodcast] = useState('')
  const [titleForTravel, setTitleForTravel] = useState('')
  const [titleForStageDrama, setTitleForStageDrama] = useState('')
  const [titleForRealityShows, setTitleForRealityShows] = useState('')
  const [titleForDiscussions, setTitleForDiscussions] = useState('')
  const [titleForWeb, setTitleForWeb] = useState('')
  // const [youtubeLink, setYoutubeLink] = useState('')
  const [titleForCookery, setTitleForCookery] = useState('')
  const [titleForCreate, setTitleForCreate] = useState('')
  const [titleForMusicVideo, setTitleForMusicVideo] = useState('')
  const [season, setSeason] = useState(0)
  const [episode, setEpisode] = useState(1)
  const [description, setDescription] = useState('')
  const [premium, setPremium] = useState(false)
  const [isMusicAlbum, setIsMusicAlbum] = useState(false)
  const [noAdultContent, setNoAdultContent] = useState(false)
  const [tags, setTags] = useState([])
  const [series, setSeriesData] = useState([])
  const [contentProvider, setContentProvider] = useState('')
  const [podcastSeries, setPodcastSeriesData] = useState([])
  const [travelSeries, setTravelSeriesData] = useState([])
  const [stageDramaSeries, setStageDramaSeriesData] = useState([])
  const [realityShowsSeries, setRealityShowsSeriesData] = useState([])
  const [discussionsSeries, setDiscussionsSeriesData] = useState([])
  const [webSeries, setWebSeriesData] = useState([])
  const [cookerySeries, setCookerySeriesData] = useState([])
  const [createSeries, setCreateSeriesData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [musicAlbumData, setMusicAlbumData] = useState([])
  const [subcategoryData, setSubcategoryData] = useState([])
  const [contentProviderData, setContentProviderData] = useState([])
  // const [categoryData, setCategoryData] = useState([])
  const [qualityObj, setQualityObj] = useState({ '360p': '', '540p': '', '720p': '', '1080p': '' })
  const [selectedImage, setSelectedImage] = useState()
  const [selectedAudio, setSelectedAudio] = useState()
  const [uploadedAudio, setUploadedAudio] = useState()
  const [uploadedMusicAudio, setUploadedMusicAudio] = useState()
  const [selectedMusicAudio, setSelectedMusicAudio] = useState()
  const [seasonsNumber, setSeasonsNumber] = useState(1)
  const [nextSeason, setNextSeason] = useState('i')
  const [numberOfEpisodes, setNumberOfEpisodes] = useState(0)
  const [nextEpisode, setNextEpisode] = useState('i')
  const [episodeForPodcast, setEpisodeForPodcast] = useState(1)
  const [episodeForTravel, setEpisodeForTravel] = useState(1)
  const [episodeForStageDrama, setEpisodeForStageDrama] = useState(1)
  const [episodeForRealityShows, setEpisodeForRealityShows] = useState(1)
  const [episodeForDiscussions, setEpisodeForDiscussions] = useState(1)
  const [episodeForWeb, setEpisodeForWeb] = useState(1)
  const [episodeForCookery, setEpisodeForCookery] = useState(1)
  const [episodeForCreate, setEpisodeForCreate] = useState(1)
  const [contentProviderTitle, setContentProviderTitle] = useState('')
  const [categoryID, setCategoryID] = useState('')
  const [discussionsSeriesID, setDiscussionsSeriesID] = useState('')
  const [webSeriesID, setWebSeriesID] = useState('')
  const [travelSeriesID, setTravelSeriesID] = useState('')
  const [stageDramaSeriesID, setStageDramaSeriesID] = useState('')
  const [realityShowsSeriesID, setRealityShowsSeriesID] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [cookerySeriesID, setCookerySeriesID] = useState('')
  const [createSeriesID, setCreateSeriesID] = useState('')
  const [selectCategoryName, setSelectCategoryName] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCategoryBelongsToSeries, setSelectedCategoryToSeries] = useState('')
  // State for single video URL
  const [videoUrl, setVideoUrl] = useState('');


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

  // firebase get podcast category
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

  // firebase get travel category
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
      setDiscussionsSeriesData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      )
    })
  }

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

  const getCreateSeries = async (selectedCategory) => {
    if (!selectedCategory) {
      setCreateSeriesData([])
      return;
    }
    let q = query(collection(db, 'createSeries'), where('category', '==', selectedCategory))

    const querySnapshot = await getDocs(q)
    const seriesData = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));

    setCreateSeriesData(seriesData)
  }

  useEffect(() => {
    if (selectedCategory) {
      getCreateSeries(selectedCategory);
    }
  }, [selectedCategory])

  const getSelectCategoryName = async () => {
    let q = query(collection(db, 'category'))
    const data = await getDocs(q).then(function (data) {
      setSelectCategoryName(
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

  const setPodcastSeriesEpisode = async () => {
    let podcastSeriesQuery = query(collection(db, 'content'))

    podcastSeriesQuery = query(
      podcastSeriesQuery,
      where('podcastSeriesName', '==', podcastSeriesName),
    )
    //
    await getDocs(podcastSeriesQuery).then(async function (data) {
      const newData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      // console.log('new data podcast ===>', newData)
      let currentPodcastEpisode = 0
      let nextPodcastEpisode = 0
      let modifiedPodcastEpisode = ''
      // setEpisodeCount ( newData[0].episodes)
      // setEpisodeForPodcast(currentEpisodeNum + 1)
      if (newData.length === 0) {
        setEpisodeForPodcast(1)
        await StoreData(null, episodeForPodcast)
      } else {
        for (const el of newData.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))) {
          console.log('inside of the for loop', el)
          currentPodcastEpisode = el.episode
          nextPodcastEpisode = currentPodcastEpisode + 1
          setEpisodeForPodcast(nextPodcastEpisode)
        }
        await StoreData(null, nextPodcastEpisode)
      }
    })
  }

  const setTravelSeriesEpisode = async () => {
    let travelSeriesQuery = query(collection(db, 'content'))

    travelSeriesQuery = query(travelSeriesQuery, where('travelSeriesName', '==', travelSeriesName))
    //
    await getDocs(travelSeriesQuery).then(async function (data) {
      const newData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      console.log('new data travel ===>', newData)
      let currentTravelEpisode = 0
      let nextTravelEpisode = 0
      let modifiedTravelEpisode = ''
      // setEpisodeCount ( newData[0].episodes)
      // setEpisodeForPodcast(currentEpisodeNum + 1)
      if (newData.length === 0) {
        setEpisodeForTravel(1)
        await StoreData(null, episodeForTravel)
      } else {
        for (const el of newData.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))) {
          console.log('inside of the for loop', el)
          currentTravelEpisode = parseInt(el.episode)
          nextTravelEpisode = currentTravelEpisode + 1
          setEpisodeForTravel(nextTravelEpisode)
        }
        await StoreData(null, nextTravelEpisode)
      }
    })
  }

  const setRealityShowsSeriesEpisode = async () => {
    let realityShowsSeriesQuery = query(collection(db, 'content'))

    realityShowsSeriesQuery = query(
      realityShowsSeriesQuery,
      where('realityShowsSeriesName', '==', realityShowsSeriesName),
    )
    //
    await getDocs(realityShowsSeriesQuery).then(async function (data) {
      const newData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      console.log('new data realityShows ===>', newData)
      let currentRealityShowsEpisode = 0
      let nextRealityShowsEpisode = 0
      let modifiedRealityShowsEpisode = ''
      // setEpisodeCount ( newData[0].episodes)
      // setEpisodeForPodcast(currentEpisodeNum + 1)
      if (newData.length === 0) {
        setEpisodeForRealityShows(1)
        await StoreData(null, episodeForRealityShows)
      } else {
        for (const el of newData.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))) {
          console.log('inside of the for loop', el)
          currentRealityShowsEpisode = parseInt(el.episode)
          nextRealityShowsEpisode = currentRealityShowsEpisode + 1
          setEpisodeForRealityShows(nextRealityShowsEpisode)
        }
        await StoreData(null, nextRealityShowsEpisode)
      }
    })
  }


  const setWebSeriesEpisode = async () => {
    console.log('Web series Loggin next ===>')

    let webSeriesQuery = query(collection(db, 'content'))

    webSeriesQuery = query(
      webSeriesQuery,
      where('webSeriesName', '==', webSeriesName),
    )
    await getDocs(webSeriesQuery).then(async function (data) {
      const newData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      console.log('new data Web ===>', newData)
      let currentWebEpisode = 0
      let nextWebEpisode = 0
      let modifiedWebEpisode = ''
      if (newData.length === 0) {
        setEpisodeForWeb(1)
        await StoreData(null, episodeForWeb)
      } else {
        for (const el of newData.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))) {
          console.log('inside of the for loop Web Series', el)
          currentWebEpisode = parseInt(el.episode)
          nextWebEpisode = currentWebEpisode + 1
          setEpisodeForWeb(nextWebEpisode)
        }
        await StoreData(null, nextWebEpisode)
      }
    })
  }

  const setDiscussionsSeriesEpisode = async () => {
    let discussionsSeriesQuery = query(collection(db, 'content'))

    discussionsSeriesQuery = query(
      discussionsSeriesQuery,
      where('discussionsSeriesName', '==', discussionsSeriesName),
    )
    await getDocs(discussionsSeriesQuery).then(async function (data) {
      const newData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      console.log('new data Discussions ===>', newData)
      let currentDiscussionsEpisode = 0
      let nextDiscussionsEpisode = 0
      let modifiedDiscussionsEpisode = ''
      // setEpisodeCount ( newData[0].episodes)
      // setEpisodeForPodcast(currentEpisodeNum + 1)
      if (newData.length === 0) {
        setEpisodeForDiscussions(1)
        await StoreData(null, episodeForDiscussions)
      } else {
        for (const el of newData.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))) {
          console.log('inside of the for loop', el)
          currentDiscussionsEpisode = parseInt(el.episode)
          nextDiscussionsEpisode = currentDiscussionsEpisode + 1
          setEpisodeForDiscussions(nextDiscussionsEpisode)
        }
        await StoreData(null, nextDiscussionsEpisode)
      }
    })
  }

  const setSeriesEpisode = async () => {
    console.log('lOGINN CREATE SERIES')
    let createSeriesQuery = query(collection(db, 'content'))

    createSeriesQuery = query(
      createSeriesQuery,
      where('SeriesName', '==', createSeriesName),
    )
    await getDocs(createSeriesQuery).then(async function (data) {
      const newData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      console.log('new data Create series ===>', newData)
      let currentCreateEpisode = 0
      let nextCreateEpisode = 0
      let modifiedCreateEpisode = ''
      // setEpisodeCount ( newData[0].episodes)
      // setEpisodeForPodcast(currentEpisodeNum + 1)
      if (newData.length === 0) {
        setEpisodeForCreate(1)
        await StoreData(null, episodeForCreate)
      } else {
        for (const el of newData.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))) {
          console.log('inside of the for loop', el)
          currentCreateEpisode = parseInt(el.episode)
          nextCreateEpisode = currentCreateEpisode + 1
          setEpisodeForCreate(nextCreateEpisode)
        }
        await StoreData(null, nextCreateEpisode)
      }
    })
  }

  const setCookerySeriesEpisode = async () => {
    let cookerySeriesQuery = query(collection(db, 'content'))

    cookerySeriesQuery = query(
      cookerySeriesQuery,
      where('cookerySeriesName', '==', cookerySeriesName),
    )
    await getDocs(cookerySeriesQuery).then(async function (data) {
      const newData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      console.log('new data cookery ===>', newData)
      let currentCookeryEpisode = 0
      let nextCookeryEpisode = 0
      let modifiedCookeryEpisode = ''
      // setEpisodeCount ( newData[0].episodes)
      // setEpisodeForPodcast(currentEpisodeNum + 1)
      if (newData.length === 0) {
        setEpisodeForCookery(1)
        await StoreData(null, episodeForCookery)
      } else {
        for (const el of newData.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))) {
          console.log('inside of the for loop', el)
          currentCookeryEpisode = parseInt(el.episode)
          nextCookeryEpisode = currentCookeryEpisode + 1
          setEpisodeForCookery(nextCookeryEpisode)
        }
        await StoreData(null, nextCookeryEpisode)
      }
    })
  }

  const setSeriesNextSeasonAndEpisode = async () => {
    let seasonsQuery = query(collection(db, 'content'))
    let seriesQuery = query(collection(db, 'series'))
    seriesQuery = query(seriesQuery, where('title', '==', title))
    seasonsQuery = query(seasonsQuery, where('title', '==', title))

    await getDocs(seriesQuery).then(async function (data) {
      const newData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setNumberOfEpisodes(newData[0].episodes)
      await getDocs(seasonsQuery).then(async function (data2) {
        const newData2 = data2.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        console.log(newData2)
        let currentSeason = 0
        let modifiedSeason = ''
        let modifiedEpisode = ''
        let currentEpisode = 0
        let numberOfEpisodes = newData[0].episodes

        if (newData2.length === 0) {
          console.log('inside of the newdata 2 length 0')
          setSeasonsNumber(1)
          setEpisode(1)
          await StoreData(1, 1)
        } else {
          for (const el of newData2.sort((a, b) => parseInt(a.episode) - parseInt(b.episode))) {
            console.log('====>>>', el)

            if (parseInt(el.episode) < numberOfEpisodes) {
              currentEpisode = parseInt(el.episode)
              currentSeason = parseInt(el.season)
              modifiedEpisode = currentEpisode + 1
              setEpisode(modifiedEpisode)
              console.log('episode mod if ==', modifiedEpisode)
              console.log('number of episodes ==', newData[0].episodes)

              modifiedSeason = currentSeason
              setSeasonsNumber(modifiedSeason)
              console.log('season mod else ==', modifiedSeason)
              console.log('number of episodes ==', numberOfEpisodes)
            } else if (parseInt(el.episode) === numberOfEpisodes) {
              currentEpisode = parseInt(el.episode)
              currentSeason = parseInt(el.season)
              modifiedEpisode = currentEpisode + 1
              numberOfEpisodes = newData[0].episodes
              console.log('episode mod if ==', modifiedEpisode)
              modifiedSeason = currentSeason + 1
              numberOfEpisodes = modifiedSeason * numberOfEpisodes
              console.log('number of episodes ==', numberOfEpisodes)
              setSeasonsNumber(modifiedSeason)
              console.log('season mod if ==', modifiedSeason)
            } else {
              currentEpisode = parseInt(el.episode)
              currentSeason = parseInt(el.season)
              modifiedEpisode = currentEpisode + 1
              setEpisode(modifiedEpisode)
              console.log('episode mod if ==', modifiedEpisode)
              console.log('number of episodes ==', newData[0].episodes)

              modifiedSeason = currentSeason
              setSeasonsNumber(modifiedSeason)
              console.log('season mod if ==', modifiedSeason)
              console.log('number of episodes ==', numberOfEpisodes)
            }
          }
          await StoreData(modifiedSeason, modifiedEpisode)
        }
      })
    })
  }


  const setSeasonValue = (value) => {
    setSeasonsNumber(value)
  }

  const setEpisodeValue = (value) => {
    setEpisode(value)
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

  useEffect(() => {
    getSeries()
    getCategory()
    getSubcategoryList()
    //getContentProviderList()
    getPodcastSeries()
    getTravelSeries()
    setSelectedCategory()
    setSelectedCategoryToSeries()
    getSelectCategoryName()
    getRealityShowsSeries()
    getDiscussionsSeries()
    getCookerySeries()
    getCreateSeries()
    getContentProvider()
    getArtists()
    getMusicAlbum()
    getWebSeries()
  }, [])

  const HandleSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
      return;
    }   // change 1 

    // Validate the single video URL
    if (videoUrl === '') {
      return alert('Please upload the video URL');
    }

    if (category === 'Teledrama') {
      setSeriesNextSeasonAndEpisode()
    } else if (category === 'Podcast') {
      setPodcastSeriesEpisode()
    } else if (category === 'Travel') {
      setTravelSeriesEpisode()
      console.log('Inside travel series episode')
    } else if (category === 'Cookery') {
      setCookerySeriesEpisode()
      console.log('Inside cookery series episode')
    } else if (category === selectedCategory) {
      setWebSeriesEpisode()
      console.log('Inside Web series episode')
    } else if (category === 'Discussions') {
      setDiscussionsSeriesEpisode()
      console.log('Inside discussions series episode')
    } else if (category === 'Web Series') {
      setSeriesEpisode()
      console.log('Inside create series episode')
    } else if (category === 'Reality Shows') {
    } else if (category === 'Discussions') {
      setDiscussionsSeriesEpisode()
      console.log('Inside discussions series episode')
    } else if (category === 'Web Series') {
      setWebEpisode()
      console.log('Inside discussions series episode')
    } else if (category === 'Reality Shows') {
      setRealityShowsSeriesEpisode()
      console.log('Inside reality shows series episode')
    } else if (category === selectedCategory) {
      setSeriesEpisode()
      console.log('Inside series episode')
    } else {
      StoreData(1, 1)
    }
    form.reset()
    setValidated(false)
  }
  //react image upload
  const handleThumbnailUpload = async (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return

    //const storageRef = ref(storage, `thumbnail/${file.name}`)
    const storageRef = ref(storage, `thumbnail`)
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
  //react audio file upload

  const handleUploadAudio = async (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return

    //const storageRef = ref(storage, `audio/podcast/${file.name}`)

    const storageRef = ref(storage, 'audio/podcast')

    const listResult = await listAll(storageRef)

    const fileExists = listResult.items.some((item) => item.name === file.name)

    if (fileExists) {
      alert('A file with the same name already exists.')
      return
    }
    const uploadTask = uploadBytesResumable(ref(storage, `audio/podcast/${file.name}`), file)
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
          setAudio(downloadURL)
          setProgress(0)
          setUploadedAudio(file.name)
          setVisibleAudio(false)
        })
      },
    )
  }

  const handleUploadMusicAudio = async (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return

    const storageRef = ref(storage, 'audio/music')

    const listResult = await listAll(storageRef)

    const fileExists = listResult.items.some((item) => item.name === file.name)

    if (fileExists) {
      alert('A file with the same name already exists.')
      return
    }

    // Continue with upload if the file is not a duplicate
    const uploadTask = uploadBytesResumable(ref(storage, `audio/music/${file.name}`), file)

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


  //react subtitle upload
  const handleUploadSubtitle = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return
    const storageRef = ref(storage, `subtitle/${file.name}`)
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
          setSubtitle(downloadURL)
          setProgress(0)
          setVisibleSubtitle(false)
        })
      },
    )
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

  const validSeason = (season) => {
    console.log('inside of the validation season')
    let modifiedValue
    if (season <= 9) {
      modifiedValue = `0${season}`
      console.log('inside of the validation season if', season)
      setNextSeason(modifiedValue)
      console.log('inside of the validation season if modified', modifiedValue)
    } else {
      modifiedValue = `${season}`
      console.log('inside of the validation season else', modifiedValue)
      setNextSeason(modifiedValue)
    }
    return modifiedValue
  }

  const validEpisode = (episodeNum) => {
    console.log('inside of the validation episode')
    let modifiedValue
    if (episodeNum <= 9) {
      modifiedValue = `0${episodeNum}`
      console.log('inside of the validation episode if', episodeNum)
      setNextEpisode(modifiedValue)
      console.log('inside of the validation episode if modified', modifiedValue)
    } else {
      modifiedValue = `${episodeNum}`
      console.log('inside of the validation episode else', modifiedValue)
      setNextEpisode(modifiedValue)
    }
    return modifiedValue
  }

  const StoreData = async (season, episode) => {
    console.log('inside of the store data func')
    let tagsChar = TagForSearch()
    const ref = doc(collection(db, 'content'))

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

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }
      if (contentProviderTitle === '') {
        return alert('please input subcategory')
      }
      if (contentProvider === '') {
        return alert('please input contentProvider')
      }

      setLoading(true)
      console.log('data ===> ', episode)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: categoryID,
        subcategory: contentProviderTitle,
        contentProvider: contentProvider,
        // podcastSeries: podcastSeries,
        title: title,
        // youtubeLink:youtubeLink,
        lang: language,
        season: validSeason(season),
        episode: validEpisode(episode),
        premium: !premium,
        noAdultContent: !noAdultContent,
        thumbnail_url: thumbnail,
        //video_url: qualityObj,
        video_url: videoUrl, // Use the single video URL
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        subTitle: subtitle,
      }
      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })
      // }
    } else if (category === 'Podcast') {
      if (audio === '') {
        return alert('please upload Audio')
      }
      if (category === '') {
        return alert('please select category')
      }

      if (podcastSeriesName === '') {
        return alert('please input title')
      }
      if (titleForPodcast === '') {
        return alert('please input Podcast title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }

      if (subcategory === '') {
        return alert('please input subcategory')
      }
      if (contentProvider === '') {
        return alert('please input contentProvider')
      }

      setLoading(true)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: categoryID,
        subcategory: subcategory,
        contentProvider: contentProvider,
        // podcastSeries: podcastSeries,
        podcastSeriesName: podcastSeriesName,
        title: titleForPodcast,
        // youtubeLink:youtubeLink,
        lang: language,
        // season: validSeason(season),
        // episode: validEpisode(episode),
        episode: validEpisode(episode),
        //episodeForPodcast: episodeForPodcast,
        thumbnail_url: thumbnail,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        audio_url: audio,
      }

      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })
    } else if (category === 'Travel') {
      if (
        qualityObj['360p'] === '' &&
        qualityObj['540p'] === '' &&
        qualityObj['720p'] === '' &&
        qualityObj['1080p'] === ''
      ) {
        return alert('please upload video')
      }

      if (category === '') {
        return alert('please select category')
      }

      if (travelSeriesName === '') {
        return alert('please input title')
      }
      if (titleForTravel === '') {
        return alert('please input  title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }
      if (subcategory === '') {
        return alert('please input subcategory')
      }
      if (contentProvider === '') {
        return alert('please input contentProvider')
      }
      setLoading(true)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: categoryID,
        subcategory: subcategory,
        contentProvider: contentProvider,
        // podcastSeries: podcastSeries,
        travelSeriesName: travelSeriesName,
        travelSeriesID: travelSeriesID,
        title: titleForTravel,
        // youtubeLink:youtubeLink,
        lang: language,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        video_url: qualityObj,
      }

      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })
    } else if (category === 'Reality Shows') {
      if (videoUrl === '') {
        return alert('Please paste video URL');
      }

      if (category === '') {
        return alert('please select category')
      }

      if (realityShowsSeriesName === '') {
        return alert(' reality shows series name')
      }
      if (titleForRealityShows === '') {
        return alert('please input title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }
      if (subcategory === '') {
        return alert('please input subcategory')
      }
      if (contentProvider === '') {
        return alert('please input contentProvider')
      }
      setLoading(true)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: categoryID,
        subcategory: subcategory,
        contentProvider: contentProvider,
        // podcastSeries: podcastSeries,
        realityShowsSeriesName: realityShowsSeriesName,
        realityShowsSeriesID: realityShowsSeriesID,
        title: titleForRealityShows,
        // youtubeLink:youtubeLink,
        lang: language,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        //video_url: qualityObj,
        video_url: videoUrl, // Use the single video URL
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
      }
      // console.log('Reality show docData===========>>>>', docData);
      // return;

      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })
    } else if (category === 'Discussions') {
      if (videoUrl === '') {
        return alert('Please paste video URL');
      }

      if (category === '') {
        return alert('please select category')
      }

      if (discussionsSeriesName === '') {
        return alert('please input title')
      }
      if (titleForDiscussions === '') {
        return alert('please input  title')
      }
      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }
      if (subcategory === '') {
        return alert('please input subcategory')
      }
      if (contentProvider === '') {
        return alert('please input contentProvider')
      }
      setLoading(true)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: categoryID,
        subcategory: subcategory,
        contentProvider: contentProvider,
        discussionsSeriesName: discussionsSeriesName,
        discussionsSeriesID: discussionsSeriesID,
        title: titleForDiscussions,
        lang: language,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        video_url: videoUrl, // Use the single video URL
        //video_url: qualityObj,
      }

      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })
    } else if (category === 'Web Series') {
      if (videoUrl === '') {
        return alert('Please paste video URL');
      }

      if (category === '') {
        return alert('please select category')
      }

      if (webSeriesName === '') {
        return alert('please input title')
      }
      if (titleForWeb === '') {
        return alert('please input  title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }
      if (subcategory === '') {
        return alert('please input subcategory')
      }
      if (contentProvider === '') {
        return alert('please input contentProvider')
      }
      setLoading(true)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: categoryID,
        subcategory: subcategory,
        contentProvider: contentProvider,
        webSeriesName: webSeriesName,
        webSeriesID: webSeriesID,
        title: titleForWeb,
        // youtubeLink:youtubeLink,
        lang: language,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        video_url: videoUrl, // Use the single video URL
        //video_url: qualityObj,
      }
      console.log('Web Series docData================>>>>', docData);
      // return;
      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })
    } else if (category === 'Cookery') {
      if (videoUrl === '') {
        return alert('Please paste video URL');
      }

      if (category === '') {
        return alert('please select category')
      }

      if (subcategory === '') {
        return alert('please input subcategory')
      }
      if (contentProvider === '') {
        return alert('please input contentProvider')
      }

      if (cookerySeriesName === '') {
        return alert('please input title')
      }
      if (titleForCookery === '') {
        return alert('please input  title')
      }
      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }
      setLoading(true)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: categoryID,
        subcategory: subcategory,
        contentProvider: contentProvider,
        cookerySeriesName: cookerySeriesName,
        cookerySeriesID: cookerySeriesID,
        title: titleForCookery,
        lang: language,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        video_url: videoUrl, // Use the single video URL
        //video_url: qualityObj,
      }

      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })
    } else if (musicType === 'Audio') {
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
      if (subcategory === '') {
        return alert('please input subcategory')
      }
      if (contentProvider === '') {
        return alert('please input contentProvider')
      }
      if (isMusicAlbum == true && musicAlbum == '') {
        return alert('please select music album')
      }
      if (category === 'Music' && artists == '') {
        return alert('please input artist')
      }
      setLoading(true)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: categoryID,
        subcategory: subcategory,
        contentProvider: contentProvider,
        title: title,
        musicAlbum: musicAlbum,
        isMusicAlbum: isMusicAlbum,
        artists: artists,
        // youtubeLink:youtubeLink,
        musicType: musicType,
        lang: language,
        episode: episode,
        thumbnail_url: thumbnail,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        musicAudio_url: musicAudio,
      }

      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })

    } else if (category === selectedCategory && selectedCategoryBelongsToSeries) {
      // if (isSeries== 'true') {
      if (videoUrl === '') {
        return alert('Please paste video URL');
      }

      if (category === '') {
        return alert('please select category')
      }
      if (contentProvider === '') {
        return alert('please input contentProvider')
      }

      if (subcategory === '') {
        return alert('please input subcategory')
      }

      if (createSeriesName === '') {
        return alert('please input title')
      }
      if (titleForCreate === '') {
        return alert('please input  title')
      }

      if (description === '') {
        return alert('please input description')
      }

      if (!thumbnail) {
        return alert('please upload thumbnail image')
      }
      setLoading(true)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: categoryID,
        contentProvider: contentProvider,
        subcategory: subcategory, //check this 
        SeriesName: createSeriesName,
        createSeriesID: createSeriesID,
        title: titleForCreate,
        // youtubeLink:youtubeLink,
        lang: language,
        episode: validEpisode(episode),
        thumbnail_url: thumbnail,
        premium: !premium,
        noAdultContent: !noAdultContent,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        video_url: videoUrl, // Use the single video URL
        //video_url: qualityObj,
      }

      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })
      // } 
    } else {
      if (videoUrl === '') {
        return alert('Please paste video URL');
      }

      if (category === '') {
        return alert('please select category')
      }

      if (title === '') {
        return alert('please input ================================ title')
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
      if (subcategory === '') {
        return alert('please input subcategory')
      }
      if (contentProvider === '') {
        return alert('please input contentProvider')
      }
      if (category === 'Music' && artists == '') {
        return alert('please input artist')
      }

      // if (tags.length === 0) {
      //   return alert('please input tag word for video')
      // } else {
      setLoading(true)
      const docData = {
        id: ref.id,
        createAt: Timestamp.fromDate(new Date()),
        category: category,
        categoryID: categoryID,
        subcategory: subcategory,
        musicAlbum: musicAlbum,
        artists: category == 'Music' ? artists : null,
        contentProvider: contentProvider,
        titleForMusicVideo: titleForMusicVideo,
        // podcastSeries: podcastSeries,
        title: title,
        // youtubeLink:youtubeLink,
        lang: language,
        premium: !premium,
        isMusicAlbum: isMusicAlbum,
        noAdultContent: !noAdultContent,
        thumbnail_url: thumbnail,
        video_url: videoUrl, // Use the single video URL
        //video_url: qualityObj,
        description: description,
        views: [],
        keywords: tagsChar,
        tag_Words: tags,
        subtitle: subtitle,
        episode: validEpisode(episode),
        musicType: musicType,
      }
      await setDoc(ref, docData).then(() => {
        alert('Content has been uploaded!')
        reset()
      })
      // }
    }
  }

  const reset = () => {
    setValidated(false)
    setLanguage('')
    setNextSeason('')
    setNextEpisode('')
    setLoading(false)
    setCategory('')
    setCategoryID('')
    setSubcategory('')
    setMusicAlbum('')
    setContentProvider('')
    // setPodcastSeries('')
    setTitle('')
    // setYoutubeLink('')
    setTitleForPodcast('')
    setTitleForCreate('')
    setTitleForTravel('')
    setTitleForRealityShows('')
    setTitleForDiscussions('')
    setTitleForWeb('')
    setTitleForMusicVideo('')
    setPodcastSeriesName('')
    setTravelSeriesName('')
    setTravelSeriesID('')
    setRealityShowsSeriesName('')
    setRealityShowsSeriesID('')
    setDiscussionsSeriesName('')
    setWebSeriesName('')
    setDiscussionsSeriesID('')
    setWebSeriesID('')
    setCookerySeriesName('')
    setCookerySeriesID('')
    setSeason(0)
    setSeasonsNumber('')
    setEpisode(0)
    setDescription('')
    setPremium(false)
    setIsMusicAlbum(false)
    setNoAdultContent(false)
    setTags([])
    setThumbnail('')
    setSubtitle('')
    setSelectedImage(null)
    setQualityObj({
      '360p': '',
      '540p': '',
      '720p': '',
      '1080p': '',
    })
    setAudio('')
    setSelectedAudio(null)
    setMusicAudio('')
    setSelectedMusicAudio(null)
    setUploadedMusicAudio('')
    setSelectedCategory('')
    // reload()
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
  const changeCheckboxForMusicAlbum = (value) => {
    setIsMusicAlbum(value)
  }

  const changeCheckboxForNoAdultContent = (value) => {
    setNoAdultContent(value)
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]))
    }
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
  const handleClose = () => {
    setVisible(false)
    setSelectedImage(null)
    setVisibleAudio(false)
    setSelectedAudio(null)
    setVisibleMusicAudio(false)
    setSelectedMusicAudio(null)
  }
  function teledramaSubcategory(providerTitle) {
    subcategoryData.forEach((element) => {
      console.log('Print element :', element)
      if (element.name === providerTitle) {
        setSubcategory(element.name)
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



      {/* mui category */}
      <CCol md={4} className="position-relative">
        <CFormLabel htmlFor="validationTooltip04">Category</CFormLabel>

        <CFormSelect
          id="validationTooltip04"
          onChange={(e) => {
            setCategory(e.target.value)
            setSelectedCategory(e.target.value)
            const selectedCategory = categoryData.find((item) => item.name === e.target.value)
            const selectedCategoryToSeries = categoryData.find((item) => item.name === e.target.value)
            setCategoryID(selectedCategory.id)
            setSelectedCategoryToSeries(selectedCategoryToSeries.isSeries)
            // console.log('Main Category ID ====>', selectedCategory)
          }}
          value={selectedCategory} // after add
          required
        >
          <option value="">Choose...</option>
          {categoryData.map((item) => {
            return (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            )
          })}
        </CFormSelect>
        <CFormFeedback tooltip invalid>
          Please select Category.
        </CFormFeedback>
      </CCol>

      {category == 'Music' ? (
        <>
          {/* mui subcategory */}
          <CCol md={4} className="position-relative">
            <CFormLabel>Music Type</CFormLabel>
            <CFormSelect onChange={(e) => setMusicType(e.target.value)}>
              <option value="">Choose...</option>
              <option value="Video"> Video </option>
              <option value="Audio"> Audio </option>
            </CFormSelect>
          </CCol>
        </>
      ) : null}
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
                setSubcategory(e.target.value)
                console.log("Content 10000000", contentProvider);
                setContentProviderTitle(e.target.options[e.target.selectedIndex].text)
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
                console.log('testing content provider sub:', subcategory)
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
      {category != 'Teledrama' ? (
        <>
          {/* mui subcategory */}
          <CCol md={4} className="position-relative">
            <CFormLabel>Subcategory</CFormLabel>
            <CFormSelect onChange={(e) => setSubcategory(e.target.value)}>
              <option value="">Choose...</option>
              {subcategoryData.map((item) => {
                if (item.category === category) {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  )
                }
              })}
            </CFormSelect>
          </CCol>
        </>
      ) : null}
      {/* mui subcategory */}
      <CCol md={4} className="position-relative">
        <CFormLabel>Language</CFormLabel>
        <CFormSelect onChange={(e) => setLanguage(e.target.value)}>
          <option value="">Choose...</option>
          <option value="sinhala"> Sinhalese </option>
          <option value="tamil"> Tamil </option>
          <option value="english"> English </option>
        </CFormSelect>
      </CCol>
      {/* series name list */}
      {category == 'Teledrama' ? (
        <>
          {/* mui name */}
          {
            <CCol md={4} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">
                {category === 'Teledrama' ? `Series Name` : `Title`}
              </CFormLabel>
              <CFormSelect
                onChange={(e) => setTitle(e.target.value)}
                // onSelect={(e) => setSeriesNextSeasonAndEpisode()}
                id="validationTooltip04"
                required
              >
                <option value="">Choose...</option>
                {series.map((item) => {
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
                Please select title.
              </CFormFeedback>
            </CCol>
          }
        </>
      ) : category == 'Podcast' ? (
        <>
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Podcast Series Name</CFormLabel>
            <CFormSelect
              onChange={(e) => setPodcastSeriesName(e.target.value)}
              // onSelect={(e) => setSeriesNextSeasonAndEpisode()}
              id="validationTooltip04"
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
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
            <CFormInput
              onChange={(e) => setTitleForPodcast(e.target.value)}
              id="validationTooltip04"
              required
              type="text"
            />
            <CFormFeedback tooltip invalid>
              Please select title.
            </CFormFeedback>
          </CCol>
        </>
      ) : category == 'Travel' ? (
        <>
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Travel Series Name</CFormLabel>
            <CFormSelect
              onChange={(e) => {
                setTravelSeriesName(e.target.value)
                const selectedTravelSeries = travelSeries.find(
                  (item) => item.title === e.target.value,
                )
                if (selectedTravelSeries) {
                  setTravelSeriesID(selectedTravelSeries.id)
                  console.log('Category ID ====>', selectedTravelSeries.id)
                } else {
                  console.log('Selected travel series not found.')
                  setTravelSeriesID('')
                }
              }}
              id="validationTooltip04"
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
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
            <CFormInput
              onChange={(e) => setTitleForTravel(e.target.value)}
              id="validationTooltip04"
              required
              type="text"
            />
            <CFormFeedback tooltip invalid>
              Please select title.
            </CFormFeedback>
          </CCol>
        </>
      ) : category == 'Reality Shows' ? (
        <>
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Reality Shows Series Name</CFormLabel>
            <CFormSelect
              onChange={(e) => {
                setRealityShowsSeriesName(e.target.value)
                const selectedRealityShowsSeries = realityShowsSeries.find(
                  (item) => item.title === e.target.value,
                )
                if (selectedRealityShowsSeries) {
                  setRealityShowsSeriesID(selectedRealityShowsSeries.id)
                  console.log('Category ID ====>', selectedRealityShowsSeries.id)
                } else {
                  console.log('Selected RealityShows series not found.')
                  setRealityShowsSeriesID('')
                }
              }}
              id="validationTooltip04"
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
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
            <CFormInput
              onChange={(e) => setTitleForRealityShows(e.target.value)}
              id="validationTooltip04"
              required
              type="text"
            />
            <CFormFeedback tooltip invalid>
              Please select title.
            </CFormFeedback>
          </CCol>
        </>
      ) : category == 'Discussions' ? (
        <>
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Discussions Series Name</CFormLabel>
            <CFormSelect
              onChange={(e) => {
                setDiscussionsSeriesName(e.target.value)
                const selectedDiscussionsSeries = discussionsSeries.find(
                  (item) => item.title === e.target.value,
                )
                if (selectedDiscussionsSeries) {
                  setDiscussionsSeriesID(selectedDiscussionsSeries.id)
                  console.log('Category ID ====>', selectedDiscussionsSeries.id)
                } else {
                  console.log('Selected Discussions series not found.')
                  setDiscussionsSeriesID('')
                }
              }}
              id="validationTooltip04"
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
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
            <CFormInput
              onChange={(e) => setTitleForDiscussions(e.target.value)}
              id="validationTooltip04"
              required
              type="text"
            />
            <CFormFeedback tooltip invalid>
              Please select title.
            </CFormFeedback>
          </CCol>
        </>
      ) : category == 'Web Series' ? (
        <>
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Web Series Name</CFormLabel>
            <CFormSelect
              onChange={(e) => {
                setWebSeriesName(e.target.value)
                const selectedWebSeries = webSeries.find(
                  (item) => item.title === e.target.value,
                )
                if (selectedWebSeries) {
                  setWebSeriesID(selectedWebSeries.id)
                  // console.log('Category ID ====>', selectedWebSeries.id)
                  setWebSeriesName(selectedWebSeries.title)
                  console.log('Series ID ====>', selectedWebSeries.id)
                  console.log('WEB SERIES NAME ====>', selectedWebSeries.title)
                } else {
                  // console.log('Selected Web series not found.')
                  setWebSeriesID('')
                }
              }}
              id="validationTooltip04"
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
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
            <CFormInput
              onChange={(e) => setTitleForWeb(e.target.value)}
              id="validationTooltip04"
              required
              type="text"
            />
            <CFormFeedback tooltip invalid>
              Please select title.
            </CFormFeedback>
          </CCol>
        </>
      ) : category == 'Cookery' ? (
        <>
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Cookery Series Name</CFormLabel>
            <CFormSelect
              onChange={(e) => {
                setCookerySeriesName(e.target.value)
                const selectedCookerySeries = cookerySeries.find(
                  (item) => item.title === e.target.value,
                )
                if (selectedCookerySeries) {
                  setCookerySeriesID(selectedCookerySeries.id)
                  console.log('Category ID ====>', selectedCookerySeries.id)
                } else {
                  console.log('Selected cookery series not found.')
                  setCookerySeriesID('')
                }
              }}
              id="validationTooltip04"
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
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Title</CFormLabel>
            <CFormInput
              onChange={(e) => setTitleForCookery(e.target.value)}
              id="validationTooltip04"
              required
              type="text"
            />
            <CFormFeedback tooltip invalid>
              Please select title.
            </CFormFeedback>
          </CCol>
        </>
      ) : category == selectedCategory && selectedCategoryBelongsToSeries ? (
        <>
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Series Name </CFormLabel>
            <CFormSelect
              onChange={(e) => {
                setCreateSeriesName(e.target.value)
                const selectedCreateSeries = createSeries.find(
                  (item) => item.SeriesName === e.target.value,
                )
                if (selectedCreateSeries) {
                  setCreateSeriesID(selectedCreateSeries.id)
                  console.log('Series ID ====>', selectedCreateSeries.id)
                } else {
                  console.log('Selected Create series not found.')
                  setCreateSeriesID('')
                }
              }}
              id="validationTooltip04"
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
          <CCol md={4} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">Title </CFormLabel>
            <CFormInput
              onChange={(e) => setTitleForCreate(e.target.value)}
              id="validationTooltip04"
              required
              type="text"
            />
            <CFormFeedback tooltip invalid>
              Please select title.
            </CFormFeedback>
          </CCol>
        </>
      ) : (
        <CCol md={4} className="position-relative">
          <CFormLabel htmlFor="validationTooltip04">Title </CFormLabel>
          <CFormInput
            onChange={(e) => setTitle(e.target.value)}
            id="validationTooltip04"
            required
            type="text"
          />

          <CFormFeedback tooltip invalid>
            Please select title.
          </CFormFeedback>
        </CCol>
      )}

      {category == 'Music' ? (
        <>
          {/* react tag words */}
          {/*<CCol md={4} className="position-relative">*/}
          {/*<CFormLabel htmlFor="validationTooltip04">Artist</CFormLabel>*/}
          {/*<div className="tags-input-container">*/}
          {/*  {tags.map((tag, index) => (*/}
          {/*    <div className="tag-item" key={index}>*/}
          {/*      <span className="text">{tag}</span>*/}
          {/*      <span className="close" onClick={() => removeTag(index)}>*/}
          {/*        &times;*/}
          {/*      </span>*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*  <input*/}
          {/*    onKeyDown={handleKeyDown}*/}
          {/*    type="text"*/}
          {/*    className="tags-input"*/}
          {/*    placeholder="Type artist name and enter "*/}
          {/*  />*/}
          {/*</div>*/}
          {/*</CCol>*/}
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
      {/*{category == 'Teledrama' ? }*/}
      <div>
        {/* css modal for add */}
        <CModal alignment="center" visible={visible} onClose={() => handleClose()}>
          <CModalHeader>
            <CModalTitle>THUMBNAIL</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedImage ? (
              <CRow className="mb-3">
                <CImage align="center" rounded src={selectedImage} />
              </CRow>
            ) : null}

            <form onSubmit={handleThumbnailUpload}>
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
                Upload now
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

        {/* css modal for add music audio*/}
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

        {category == 'Podcast' ? (
          <>
            <CContainer>
              <CRow className="row justify-content-md-center">
                <CCol md={4}>
                  <img
                    onClick={() => setVisible(true)}
                    width={200}
                    className="rounded"
                    src={thumbnail ? thumbnail : thumbnailImage}
                    alt=""
                  />
                </CCol>
              </CRow>
            </CContainer>
            <CCol md={12} className="position-relative">
              <br />
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
            <br />
            <br />
          </>
        ) : category == 'Music' && musicType == 'Audio' ? (
          <>
            <CContainer>
              <CRow className="row justify-content-md-center">
                <CCol md={4}>
                  <img
                    onClick={() => setVisible(true)}
                    width={200}
                    className="rounded"
                    src={thumbnail ? thumbnail : thumbnailImage}
                    alt=""
                  />
                </CCol>
              </CRow>
            </CContainer>

            {/* mui type */}
            <CCol md={12} className="position-relative">
              <br />
              <CFormLabel>{uploadedMusicAudio}</CFormLabel>
            </CCol>
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
            <br />
            <br />
          </>
        ) : (
          <>
            <CContainer>
              <CRow className="row justify-content-md-center">
                <CCol md={4}>
                  <img
                    onClick={() => setVisible(true)}
                    width={200}
                    className="rounded"
                    src={thumbnail ? thumbnail : thumbnailImage}
                    alt=""
                  />
                </CCol>
              </CRow>

            </CContainer>
            {/* css modal for subtitle */}
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
                  <CButton
                    type="submit"
                    color="primary"
                    variant="outline"
                    id="inputGroupFileAddon04"
                  >
                    Upload now
                  </CButton>
                </form>
              </CModalBody>
            </CModal>

            {/* quality section */}
            {/* Rendering the input for video URL */}
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
            <br />

          </>
        )}
      </div>
      <br />

      <CForm
        className="row g-3 needs-validation form"
        noValidate
        validated={validated}
        onSubmit={HandleSubmit}
      >
        {/* mui Description */}
        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="exampleFormControlTextarea1">Description</CFormLabel>
          <CFormTextarea
            onChange={(e) => setDescription(e.target.value)}
            id="exampleFormControlTextarea1"
            rows="4"
            required
          ></CFormTextarea>
          <CFormFeedback tooltip invalid>
            Please input content description.
          </CFormFeedback>
        </CCol>


        {/* mui type */}
        <CCol md={4} className="position-relative">
          <CFormLabel htmlFor="validationTooltip04">Content Type</CFormLabel>

          <CFormCheck
            id="flexCheckChecked"
            label="Free"
            checked={premium}
            onChange={(e) => changeCheckbox(e.target.checked)}
          />
          {category == 'Movies' ? (
            <CFormCheck
              id="flexCheckChecked"
              label="18+"
              checked={noAdultContent}
              onChange={(e) => changeCheckboxForNoAdultContent(e.target.checked)}
            />
          ) : null}
        </CCol>

        <CCol xs={12} className="position-relative">
          <CButton color="primary" type="submit">
            Upload Now
          </CButton>
        </CCol>
      </CForm>
    </>
  )
}

const Index = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>CONTENT UPLOAD</h3>
          </CCardHeader>
          <CCardBody>{ContentData()}</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
