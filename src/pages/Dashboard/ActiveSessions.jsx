import React from 'react'
import SlideBar from '../../components/SlideBar'

function ActiveSessions() {
  return (
    <div className='font-primary'>
      <SlideBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 ">
            <h1 className='font-medium'>Active Sessions</h1>
        </div>
    </div>
    </div>
  )
}

export default ActiveSessions
