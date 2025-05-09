import React from 'react'
import SlideBar from '../../components/SlideBar'

function CreateSessions() {
  return (
    <div className='font-primary'>
      <SlideBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 ">
      <div className="flex-1 overflow-auto p-4 rounded-sm bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 ">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Session</h1>
            <p className="text-gray-600 dark:text-gray-400">Set up a new learning session with all the necessary details</p>
          </div>
          
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <form className="space-y-6">
              {/* Session Title */}
              <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Session Title *
                </label>
                <input
                  type="text"
                  id="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., Introduction to React Hooks"
                  required
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Describe what participants will learn in this session..."
                ></textarea>
              </div>
              
              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
              </div>
              
              {/* Duration and Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    id="duration"
                    min="15"
                    max="240"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="60"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="capacity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Maximum Participants *
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    min="1"
                    max="100"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="20"
                    required
                  />
                </div>
              </div>
              
              {/* Session Type */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Session Type *
                </label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      id="workshop"
                      type="radio"
                      name="session-type"
                      value="workshop"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      defaultChecked
                    />
                    <label htmlFor="workshop" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Workshop
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="lecture"
                      type="radio"
                      name="session-type"
                      value="lecture"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="lecture" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Lecture
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="discussion"
                      type="radio"
                      name="session-type"
                      value="discussion"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="discussion" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Discussion
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Materials Upload */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="materials">
                  Session Materials
                </label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="materials" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, PPT, DOCX (MAX. 10MB each)
                      </p>
                    </div>
                    <input id="materials" type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  )
}

export default CreateSessions
