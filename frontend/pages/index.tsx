import type { NextPage } from 'next'
import Head from 'next/head'
import { WalletProvider } from '../components/WalletProvider'
import ECertifyModal from '../components/ECertifyModal'
import { useState } from 'react'

const Home: NextPage = () => {
  const [showECertifyModal, setShowECertifyModal] = useState(false)

  return (
    <WalletProvider>
      <Head>
        <title>Learn.io - Improved Learning</title>
        <meta name="description" content="Decentralized credential verification platform for APEC University" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold">
                    <span className="text-gray-900">Learn</span>
                    <span className="text-blue-500">.io</span>
            </h1>
                  <p className="text-xs text-gray-500 -mt-1">Improved Learning</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-lg mx-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for a course"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white px-4 py-1 rounded text-sm font-medium">
                    GO
                  </button>
                </div>
              </div>

              {/* Header Icons */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5V7a7.5 7.5 0 1 1 15 0v10z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Left Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="p-6">
              {/* User Profile */}
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">S</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Hi Shakir</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explore
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  My Settings
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Course Calendar
                </button>
                <button 
                  onClick={() => setShowECertifyModal(true)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-blue-600 rounded-lg hover:bg-blue-50 border border-blue-200"
                >
                  <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  E-Certify Blockchain
                </button>
              </nav>

              {/* Figma Plus Card */}
              <div className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Figma Plus</span>
                </div>
                <p className="text-sm text-purple-100">by Figma Love</p>
              </div>

              {/* Upgrade Card */}
              <div className="mt-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-900">Upgrade to Pro</h3>
                    <p className="text-sm text-purple-600">Get 1 month free on annual subscription</p>
                    <button className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-purple-700">
                      Upgrade Today!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-4xl">
              {/* User Avatars */}
              <div className="flex -space-x-2 mb-6">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{i}</span>
                  </div>
                ))}
              </div>

              {/* Main Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Personal Learning</h1>
              <p className="text-gray-500 mb-8">Based on your preferences</p>

              {/* Goals Status Card */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-lg font-semibold">Goals Status</h3>
                  </div>
                  <button className="text-purple-200 hover:text-white text-sm font-medium">
                    Manage Goals
                  </button>
                </div>
                <div className="w-full bg-purple-400 rounded-full h-2 mb-2">
                  <div className="bg-white h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
                <p className="text-purple-100 text-sm">80% Complete</p>
              </div>

              {/* Course Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Illustrator Course */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Illustrator Tips & Tricks</h3>
                      <p className="text-gray-600 text-sm mb-3">Master the fundamentals of Adobe Illustrator with practical tips and advanced techniques.</p>
                      <p className="text-gray-900 font-medium">121 people enrolled so far!</p>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1,2,3,4,5].map((i) => (
                        <div key={i} className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs">{i}</span>
                        </div>
                      ))}
                      <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-gray-600 text-xs">+115</span>
                      </div>
                    </div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600">
                      Enroll Today!
                    </button>
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Goals</h4>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Monthly Plan</h4>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Settings</h4>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* My Tutors Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Tutors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Anglea Taylor", role: "Senior PHP Developer", avatar: "AT" },
                    { name: "Mike Johnson", role: "UI/UX Designer", avatar: "MJ" },
                    { name: "Sarah Wilson", role: "Data Scientist", avatar: "SW" }
                  ].map((tutor, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium text-sm">{tutor.avatar}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{tutor.name}</h4>
                          <p className="text-sm text-gray-500">{tutor.role}</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-80 bg-white border-l border-gray-200 p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a course"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white px-3 py-1 rounded text-sm font-medium">
                  GO
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
              <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">New Courses</button>
              <button className="text-gray-500 hover:text-gray-700 pb-2">Library</button>
              <button className="text-gray-500 hover:text-gray-700 pb-2">Categories</button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Price</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Duration</option>
              </select>
            </div>

            {/* Course Cards */}
            <div className="space-y-4 mb-6">
              {/* Master Figma */}
              <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-lg p-4 text-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm opacity-90">42 Hours</p>
                    <p className="text-lg font-bold">$199.00</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">Master Figma</h3>
                <p className="text-sm opacity-90 mb-3">Learn Figma in 30 days.</p>
                <button className="w-full bg-white text-green-600 py-2 rounded-lg font-medium hover:bg-gray-100">
                  Enroll Today!
              </button>
              </div>

              {/* UI With Mikey */}
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-4 text-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm opacity-90">28 Hours</p>
                    <p className="text-lg font-bold">$149.00</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">UI With Mikey</h3>
                <p className="text-sm opacity-90 mb-3">Master UI design principles.</p>
                <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-gray-100">
                  Enroll Today!
              </button>
            </div>
          </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-pink-500 mb-1">19</div>
                <div className="text-sm text-gray-600">New Courses</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-500 mb-1">14</div>
                <div className="text-sm text-gray-600">New Tutors</div>
              </div>
            </div>
          </aside>
          </div>

        {/* E-Certify Modal */}
        <ECertifyModal 
          isOpen={showECertifyModal} 
          onClose={() => setShowECertifyModal(false)} 
        />
      </div>
    </WalletProvider>
  )
}

export default Home




