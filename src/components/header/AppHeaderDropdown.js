import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar2 from './../../assets/images/avatars/2.jpg'
import { auth } from 'src/firebase'
import { signOut } from 'firebase/auth'
import { useDispatch } from 'react-redux'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const logout = () => {
    localStorage.clear()
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        dispatch({ type: 'user', user: null }) //clear local redux
        window.location.href="/"
      })
      .catch((error) => {
        alert(error)
        // An error happened.
      })
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar2} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>

        <CDropdownItem
          href="#"
          onClick={() => {
            logout()
          }}
        >
          <CIcon icon={cilLockLocked} className="me-2" />
          sign out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
