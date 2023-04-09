import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './Homepage'
import Chat from './Chat'

const Allroutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/chat" element={<Chat/>}/>
    </Routes>
  )
}

export default Allroutes