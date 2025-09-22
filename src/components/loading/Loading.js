import React from 'react'
import ReactLoading from 'react-loading'
import './Loading.css'

export default function ScreenLoading() {
  return (
    <div className="viewLoading">
      <ReactLoading type={'spinningBubbles'} color={'white'} height={'5%'} width={'5%'} />
    </div>
  )
}
