"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { getAsset, getAssetProof } from "../utils/helius"
import { useConnection } from "@solana/wallet-adapter-react"
import { verifyCredentialOnChain } from "../utils/verification"
import dynamic from "next/dynamic"
import { QrCode, FileText, Zap, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"

const QRScanner = dynamic(() => import("./QRScanner"), { ssr: false })

interface VerificationResult {
  isValid: boolean
  credential?: {
    id: string
    name: string
    student_name: string
    issuer_name: string
    issued_date: string
    type: string
    skill_business: string
    skill_tech: string
  }
  error?: string
}

const DEMO_ASSET_ID = "asset-demo-1"

const VerifierPortal: React.FC = () => {
  const router = useRouter()
  const { connection } = useConnection()
  const [assetId, setAssetId] = useState<string>("")
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  useEffect(() => {
    if (router.query.asset_id) {
      setAssetId(router.query.asset_id as string)
      verifyCredential(router.query.asset_id as string)
    }
  }, [router.query])

  const verifyCredential = async (id: string) => {
    if (!id) return
    setLoading(true)
    setVerificationResult(null)
    try {
      await getAsset(id)
      await getAssetProof(id)
      const result = await verifyCredentialOnChain(id, connection)
      if (result.isValid && result.credential) {
        setVerificationResult({ isValid: true, credential: result.credential })
      } else {
        setVerificationResult({ isValid: false, error: result.error || "Invalid credential" })
      }
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationResult({ isValid: false, error: "Failed to verify credential. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleManualVerification = () => {
    if (assetId.trim()) verifyCredential(assetId.trim())
  }
  const handleQuickVerify = () => {
    setAssetId(DEMO_ASSET_ID)
    verifyCredential(DEMO_ASSET_ID)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">Verify Blockchain Credentials</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Authenticate and validate credentials issued by APEC University
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* QR Code Scanner Card */}
          <div
            className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:shadow transition-all duration-300 cursor-pointer"
            onClick={() => setShowScanner(true)}
          >
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <QrCode className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Scan QR Code</h3>
            <p className="text-gray-600 text-sm mb-4">Use your camera to scan credential QR codes</p>
            <button className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium">
              <span>Open Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Manual Entry Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow transition-all duration-300">
            <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Manual Entry</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="Enter asset ID"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all"
              />
              <button
                onClick={handleManualVerification}
                disabled={!assetId.trim() || loading}
                className="w-full px-4 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Quick Verify Card */}
          <div
            className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:shadow transition-all duration-300 cursor-pointer"
            onClick={handleQuickVerify}
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Verify</h3>
            <p className="text-gray-600 text-sm mb-4">Verify a sample credential instantly</p>
            <button className="inline-flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <span>Verify Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
            </div>
            <p className="text-gray-600 text-lg">Verifying credential...</p>
          </div>
        )}

        {verificationResult && !loading && (
          <div className="mt-8">
            {verificationResult.isValid ? (
              <div className="bg-white rounded-2xl p-8 border border-emerald-200">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-700">VERIFIED</h3>
                    <p className="text-emerald-700/80 text-sm">Credential is authentic and valid</p>
                  </div>
                </div>
                {verificationResult.credential && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-gray-600 text-sm font-medium mb-1">Student Name</div>
                      <div className="text-gray-900 text-lg font-semibold">
                        {verificationResult.credential.student_name}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-gray-600 text-sm font-medium mb-1">Credential</div>
                      <div className="text-gray-900 text-lg font-semibold">{verificationResult.credential.name}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-gray-600 text-sm font-medium mb-1">Type</div>
                      <div className="text-gray-900 text-lg font-semibold">{verificationResult.credential.type}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-gray-600 text-sm font-medium mb-1">Issued Date</div>
                      <div className="text-gray-900 text-lg font-semibold">
                        {new Date(verificationResult.credential.issued_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-gray-600 text-sm font-medium mb-1">Business Skill</div>
                      <div className="text-gray-900 text-lg font-semibold">
                        {verificationResult.credential.skill_business}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-gray-600 text-sm font-medium mb-1">Technical Skill</div>
                      <div className="text-gray-900 text-lg font-semibold">{verificationResult.credential.skill_tech}</div>
                    </div>
                    <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-gray-600 text-sm font-medium mb-1">Issuer</div>
                      <div className="text-gray-900 text-lg font-semibold">
                        {verificationResult.credential.issuer_name}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-red-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-red-700">INVALID CREDENTIAL</h3>
                    <p className="text-red-700/80 text-sm">This credential could not be verified</p>
                  </div>
                </div>
                <p className="text-red-700/80 text-base mt-4">
                  {verificationResult.error || "This credential could not be verified"}
                </p>
              </div>
            )}
          </div>
        )}

        {showScanner && (
          <QRScanner onResult={(txt) => { setShowScanner(false); setAssetId(txt); verifyCredential(txt) }} onClose={() => setShowScanner(false)} />
        )}
      </div>
    </div>
  )
}

export default VerifierPortal
