"use client"

import type React from "react"
import { useState } from "react"
import { WalletProvider } from "./WalletProvider"
import AdminDashboard from "./AdminDashboard"
import StudentWallet from "./StudentWallet"
import VerifierPortal from "./VerifierPortal"
import { Shield, Wallet, CheckCircle, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

interface ECertifyModalProps {
  isOpen: boolean
  onClose: () => void
}

const ECertifyModal: React.FC<ECertifyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"admin" | "student" | "verifier">("admin")

  const tabs = [
    { id: "admin", label: "Admin Dashboard", icon: Shield, description: "Manage credentials and issuers" },
    { id: "student", label: "Student Wallet", icon: Wallet, description: "View your credentials" },
    { id: "verifier", label: "Verify Credentials", icon: CheckCircle, description: "Authenticate credentials" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] border border-gray-200 bg-white p-0 flex flex-col shadow-xl">
        <DialogHeader className="border-b border-gray-200 px-8 py-6 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold text-gray-900">
                E-Certify Blockchain Platform
              </DialogTitle>
              <p className="text-gray-600 text-sm mt-2">
                Decentralized credential verification and management for APEC University
              </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors p-1" aria-label="Close">
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogHeader>

        <div className="border-b border-gray-200 bg-white px-8 py-4">
          <div className="grid grid-cols-3 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group relative px-6 py-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`} />
                    <div className="text-left">
                      <div className={`font-semibold text-sm ${isActive ? "text-white" : "text-gray-900"}`}>
                        {tab.label}
                      </div>
                      <div className={`text-xs mt-0.5 ${isActive ? "text-blue-50" : "text-gray-600"}`}>
                        {tab.description}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto px-8 py-6 bg-white">
          <WalletProvider>
            {activeTab === "admin" && <AdminDashboard />}
            {activeTab === "student" && <StudentWallet />}
            {activeTab === "verifier" && <VerifierPortal />}
          </WalletProvider>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ECertifyModal
