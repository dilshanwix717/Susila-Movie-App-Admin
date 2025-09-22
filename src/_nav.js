import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCloudUpload,
  cilPuzzle,
  cilVideo,
  cilMovie,
  cilMusicNote,
  cilImage,
  cilCamera,
  cilHappy,
  cilUserPlus,
  cilPizza,
  cilSearch,
  cilCameraRoll,
  cilSmile,
  cilFile,
  cilMediaPlay,
  cilNewspaper,
  cilHeadphones, cilBeachAccess,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'SUSILA LIFE',
    to: '/dashboard',
    badge: {
      color: 'info',
      text: 'ADMIN',
    },
  },

  {
    component: CNavItem,
    name: 'Upload',
    to: '/upload',
    icon: <CIcon icon={cilCloudUpload} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Live events',
    to: '/live',
    icon: <CIcon icon={cilVideo} customClassName="nav-icon" />,
  },

  // {
  //   component: CNavTitle,
  //   name: 'Category',
  // },
  {
    component: CNavItem,
    name: 'Television Series',
    to: '/television-series',
    icon: <CIcon icon={cilCameraRoll} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Movies',
    to: '/movies',
    icon: <CIcon icon={cilMovie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Music',
    to: '/music',
    icon: <CIcon icon={cilMusicNote} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Travel',
    to: '/travel',
    icon: <CIcon icon={cilCamera} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Podcast',
    to: '/podcast',
    icon: <CIcon icon={cilVideo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Cookery',
    to: '/cookery',
    icon: <CIcon icon={cilPizza} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Business',
    to: '/business',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Comedy',
    to: '/comedy',
    icon: <CIcon icon={cilSmile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Documentary',
    to: '/documentary',
    icon: <CIcon icon={cilMediaPlay} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'OTHERS',
    to: '/base',
    icon: <CIcon icon={cilVideo} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Discussions',
        to: '/list/discussions',
      },
      {
        component: CNavItem,
        name: 'Web Series',
        to: '/list/web-series',
      },
      {
        component: CNavItem,
        name: 'View Series',
        to: '/list/view-series',
      },

      {
        component: CNavItem,
        name: 'Reality Shows',
        to: '/list/realityShows',
      },
      {
        component: CNavItem,
        name: 'Stage Drama',
        to: '/list/stageDrama',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'New',
  },
  {
    component: CNavGroup,
    name: 'CREATE',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Category',
        to: '/list/category',
      },

      {
        component: CNavItem,
        name: 'Subcategory',
        to: '/list/subcategory',
      },

      {
        component: CNavItem,
        name: 'Teleseries',
        to: '/list/series',
      },
      {
        component: CNavItem,
        name: 'Shorts',
        to: '/list/shorts',
      },
      {
        component: CNavItem,
        name: 'Podcast Series',
        to: '/list/podcastSeries',
      },
      // {
      //   component: CNavItem,
      //   name: 'Music Video Series',
      //   to: '/list/musicVideoSeries',
      // },
      {
        component: CNavItem,
        name: 'Content Provider',
        to: '/list/contentProvider',
      },
      {
        component: CNavItem,
        name: 'Travel Series',
        to: '/list/travelSeries',
      },
      {
        component: CNavItem,
        name: 'Cookery Series',
        to: '/list/cookerySeries',
      },
      {
        component: CNavItem,
        name: 'Reality Shows Series',
        to: '/list/realityShowsSeries',
      },
      {
        component: CNavItem,
        name: 'Discussions Series',
        to: '/list/discussionsSeries',
      },
      {
        component: CNavItem,
        name: 'Web Series',
        to: '/list/webSeries',
      },
      {
        component: CNavItem,
        name: 'Create Series',
        to: '/list/createSeries',
      },
      {
        component: CNavItem,
        name: 'Artists',
        to: '/list/artists',
      },
      {
        component: CNavItem,
        name: 'Music Album',
        to: '/list/musicAlbum',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Banner / Ads',
    to: '/images',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Home Banner',
        to: '/images/banner',
      },
      {
        component: CNavItem,
        name: 'Ads',
        to: '/images/ads',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Referral',
    to: '/referral',
    icon: <CIcon icon={cilHappy} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Referral Code',
        to: '/referral/referral-list',
      },
      {
        component: CNavItem,
        name: 'Agents',
        to: '/referral/referral-list/agents',
      },
    ],
  },

  // {
  //   component: CNavItem,
  //   name: 'Users',
  //   to: '/users',
  //   icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Support',
    to: '/support',
    icon: <CIcon icon={cilHeadphones} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Subscription',
    to: '/subscription',
    icon: <CIcon icon={cilBeachAccess} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'My Report',
    to: '/myReport',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Push Notification',
    to: '/notification/send',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Admin Management',
  //   to: '/superAdmin',
  //   icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  // },

  // React other categories
  // {
  //   component: CNavItem,
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Icons',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Notifications',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Toasts',
  //       to: '/notifications/toasts',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },

  // // react page components
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
]

export default _nav
