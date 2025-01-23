"use client"
import SideBar from '@/components/common/SideBar';
import Dashboard from '@/components/dashboard/Dashboard';
import React from 'react'

const page = () => {
  return (
    <div>
      <SideBar />
        <Dashboard />
    </div>
  )
}

export default page;