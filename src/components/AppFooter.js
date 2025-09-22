import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://www.susilaholdings.com/" target="_blank" rel="noopener noreferrer">
          SUSILA INSPIRE
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
