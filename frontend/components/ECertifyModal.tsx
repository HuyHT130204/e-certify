import React, { useState } from 'react'
import { WalletProvider } from './WalletProvider'
import AdminDashboard from './AdminDashboard'
import StudentWallet from './StudentWallet'
import VerifierPortal from './VerifierPortal'
import { ClientOnly } from './ClientOnly'

interface ECertifyModalProps {
  isOpen: boolean
  onClose: () => void
}

const ECertifyModal: React.FC<ECertifyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'student' | 'verifier'>('admin')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">E-Certify Blockchain Platform</h2>
            <p className="text-gray-600">Decentralized credential verification for APEC University</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 p-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Admin Dashboard
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'student'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Student Wallet
          </button>
          <button
            onClick={() => setActiveTab('verifier')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'verifier'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Verify Credentials
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <WalletProvider>
            {activeTab === 'admin' && <AdminDashboard />}
            {activeTab === 'student' && <StudentWallet />}
            {activeTab === 'verifier' && <VerifierPortal />}
          </WalletProvider>
        </div>
      </div>
    </div>
  )
}

export default ECertifyModal

