import React from 'react'
import { Outlet } from 'react-router-dom'

export default function SandBox() {
  return (
    <div>SandBox
      <Outlet/>
    </div>
  )
}
