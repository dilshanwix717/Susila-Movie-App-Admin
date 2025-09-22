import React from 'react'
import createSeries from './views/base/Category/createSeries'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Upload = React.lazy(() => import('./views/upload/Index'))
const Dramas = React.lazy(() => import('./views/base/Content-Page/Dramas'))
const Films = React.lazy(() => import('./views/base/Content-Page/Films'))
const Musics = React.lazy(() => import('./views/base/Content-Page/Musics'))
const Travels = React.lazy(() => import('./views/base/Content-Page/Travels'))
const Podcast = React.lazy(() => import('./views/base/Content-Page/Podcast'))
const Update = React.lazy(() => import('./views/base/Content-Page/Update'))
const Cookery = React.lazy(() => import('./views/base/Content-Page/Cooking'))
const Others = React.lazy(() => import('./views/base/Content-Page/Others'))
const Comedy = React.lazy(() => import('./views/base/Content-Page/Comedy'))
const Documentary = React.lazy(() => import('./views/base/Content-Page/Documentary'))
const WebSeries = React.lazy(() => import('./views/base/Content-Page/Web'))
const ViewSeries = React.lazy(() => import('./views/base/Content-Page/viewSeries'))
const Business = React.lazy(() => import('./views/base/Content-Page/Business'))

// Base
const category = React.lazy(() => import('./views/base/Category/category'))
const subcategory = React.lazy(() => import('./views/base/Category/subcategory'))
const series = React.lazy(() => import('./views/base/Category/series'))
const shorts = React.lazy(() => import('./views/base/Category/shorts'))
const podcastSeries = React.lazy(() => import('./views/base/Category/podcastSeries'))
const contentProvider = React.lazy(() => import('./views/base/Category/contentProvider'))
const musicVideoSeries = React.lazy(() => import('./views/base/Category/musicVideoSeries'))
const travelSeries = React.lazy(() => import('./views/base/Category/travelSeries'))
const cookerySeries = React.lazy(() => import('./views/base/Category/cookerySeries'))
const realityShowsSeries = React.lazy(() => import('./views/base/Category/realityShowsSeries'))
const discussionsSeries = React.lazy(() => import('./views/base/Category/discussionsSeries'))
const webSeries = React.lazy(() => import('./views/base/Category/webSeries'))
const CreateSeries = React.lazy(() => import('./views/base/Category/createSeries'))
const artists = React.lazy(() => import('./views/base/Category/artists'))
const musicAlbum = React.lazy(() => import('./views/base/Category/musicAlbum'))

const discussions = React.lazy(() => import('./views/base/Content-Page/Discussions'))
const realityShows = React.lazy(() => import('./views/base/Content-Page/Reality Shows'))
const stageDrama = React.lazy(() => import('./views/base/Content-Page/Stage Drama'))

// Referral
const Referral = React.lazy(() => import('./views/base/Referral/Index'))
const Agent = React.lazy(() => import('./views/base/Referral/Agents'))
const Support = React.lazy(() => import('./views/base/Support/Support'))
const Subscription = React.lazy(() => import('./views/base/Subscription/Subscription'))


// Live
//const Referral = React.lazy(() => import('./views/base/Referral/Index'))
const Live = React.lazy(() => import('./views/base/Live/Live'))


// Referral
const NotificationPage = React.lazy(() => import('./views/base/Notification/Index'))

// Image Upload for add / banner
const Banner = React.lazy(() => import('./views/base/Banner/bannerUpload'))

// Image Upload for add / banner
const AdsUpload = React.lazy(() => import('./views/base/Ads/adsUpload'))

// Image Upload for add / banner
// const users = React.lazy(() => import('./views/users/Index'))
// const superAdmin = React.lazy(() => import('./views/SuperAdmin/superAdmin'))


const MyReport = React.lazy(() => import('./views/My-Report/MyReport'))
const MyReportID = React.lazy(() => import('./views/My-Report/MyReportID'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  // react home page
  { path: '/dashboard', name: 'Dashboard', element: Upload },
  { path: '/television-series', name: 'Television Series', element: Dramas, exact: true },
  { path: '/movies', name: 'Movies', element: Films, exact: true },
  { path: '/music', name: 'Music Videos', element: Musics, exact: true },
  { path: '/travel', name: 'Travel Sri Lanka Videos', element: Travels, exact: true },
  { path: '/podcast', name: 'Podcast', element: Podcast, exact: true },
  { path: '/cookery', name: 'Cookery', element: Cookery, exact: true },
  // { path: '/others', name: 'Others', element: Others, exact: true },
  { path: '/comedy', name: 'Comedy', element: Comedy, exact: true },
  { path: '/documentary', name: 'Documentary', element: Documentary, exact: true },
  { path: '/business', name: 'Business', element: Business, exact: true },
  { path: '/update/:id', name: 'update', element: Update, exact: true },
  { path: '/upload', name: 'Upload', element: Upload },

  // react - router category section
  { path: '/list/category', name: 'Category', element: category },
  { path: '/list/subcategory', name: 'Subcategory', element: subcategory },
  { path: '/list/series', name: 'Television Series', element: series },
  { path: '/list/shorts', name: 'Shorts', element: shorts },
  { path: '/list/podcastSeries', name: 'Podcast Series', element: podcastSeries },
  { path: '/list/contentProvider', name: 'Content Provider', element: contentProvider },
  // { path: '/list/musicVideoSeries', name: 'Music Video Series', element: musicVideoSeries },
  { path: '/list/travelSeries', name: 'Travel Series', element: travelSeries },
  { path: '/list/cookerySeries', name: 'Cookery Series', element: cookerySeries },
  { path: '/list/realityShowsSeries', name: 'Reality Shows Series', element: realityShowsSeries },
  { path: '/list/discussionsSeries', name: 'Discussions Series', element: discussionsSeries },
  { path: '/list/webSeries', name: 'Web Series', element: webSeries },
  { path: '/list/createSeries', name: 'Create Series', element: CreateSeries },
  { path: '/list/artists', name: 'Artists', element: artists },
  { path: '/list/musicAlbum', name: 'Music Album', element: musicAlbum },

  { path: '/list/others', name: 'Others', element: Others },
  { path: '/list/discussions', name: 'Discussions', element: discussions },
  { path: '/list/web-series', name: 'Web Series', element: WebSeries },
  { path: '/list/view-series', name: 'View Series', element: ViewSeries },
  { path: '/list/realityShows', name: 'Reality Shows', element: realityShows },
  { path: '/list/stageDrama', name: 'Stage Drama', element: stageDrama },

  // React - Referral section
  { path: '/referral/referral-list', name: 'Referral', element: Referral },
  { path: '/referral/referral-list/agents', name: 'Agents', element: Agent },

  // React - Support section
  { path: '/support', name: 'Support', element: Support },

  // React - Subscription section
  { path: '/subscription', name: 'Subscription', element: Subscription },

  // react - notification section
  { path: '/notification/send', name: 'Notification', element: NotificationPage },
  { path: '/images/banner', name: 'Banners', element: Banner },

  // react - Ads  section
  { path: '/images/ads', name: 'Ads', element: AdsUpload },

  // react - Users list  section
  // { path: '/users', name: 'Users', element: users },

  //react - super Admin section
  // { path: '/superAdmin', name: 'SuperAdmin', element: superAdmin },

  { path: '/myReport', name: 'My Report', element: MyReport },
  { path: '/myReportID/:id', name: 'My Report ID', element: MyReportID, exact: true },


  // React - Live section
  { path: '/live', name: 'Live', element: Live },
]

export default routes
