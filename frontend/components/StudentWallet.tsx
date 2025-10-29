"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import QRCode from "react-qr-code"
import { getAssetsByOwner, filterAssetsByIssuer, parseCredentialMetadata } from "../utils/helius"
import { ClientOnly } from "./ClientOnly"
import Modal from "./Modal"
import { Share2, QrCode, Award, Calendar, Building2, Code2, Briefcase } from "lucide-react"

interface Credential {
  id: string
  name: string
  type: string
  skill_business: string
  skill_tech: string
  issuer_name: string
  issued_date: string
  uri: string
  image: string
  student_name: string
  student_id: string
}

const DEMO_OWNER = "DEMO_OWNER_PUBLIC_KEY"

const StudentWallet: React.FC = () => {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null)
  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const APEC_ISSUER_ADDRESS = "ECertifyProgram111111111111111111111111111111111"

  useEffect(() => {
    if (publicKey) {
      fetchCredentials(publicKey.toString())
    }
  }, [publicKey])

  const fetchCredentials = async (owner: string) => {
    setLoading(true)
    try {
      const response = await getAssetsByOwner(owner)
      if (!response || !response.items) {
        setCredentials([])
        return
      }
      const apecCredentials = filterAssetsByIssuer(response.items, APEC_ISSUER_ADDRESS)
      const credentialList = apecCredentials
        .map((asset) => {
          const metadata = parseCredentialMetadata(asset)
          if (!metadata) return null
          return {
            id: asset.id,
            name: metadata.name,
            type: metadata.credential_type,
            skill_business: metadata.skill_business,
            skill_tech: metadata.skill_tech,
            issuer_name: metadata.issuer_name,
            issued_date: metadata.issued_at.split("T")[0],
            uri: asset.content?.json_uri || "",
            image:
              (asset.content as any)?.files?.[0]?.uri ||
              (asset.content as any)?.metadata?.image ||
              "/api/placeholder/300/200",
            student_name: "Student Name",
            student_id: metadata.student_id,
          }
        })
        .filter((c): c is Credential => c !== null)
      setCredentials(credentialList)
    } catch (e) {
      console.error(e)
      setCredentials([])
    } finally {
      setLoading(false)
    }
  }

  const generateShareLink = (credential: Credential) => `https://verify.ecertify.app?asset_id=${credential.id}`

  const getCredentialTypeColor = (type: string) => {
    switch (type) {
      case "Technical Skill":
        return "bg-primary/10 text-primary border-primary/30"
      case "Business Skill":
        return "bg-success/10 text-success border-success/30"
      case "Dual Degree Module":
        return "bg-accent/10 text-accent border-accent/30"
      default:
        return "bg-surface-light text-text-secondary border-border/50"
    }
  }

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case "Technical Skill":
        return Code2
      case "Business Skill":
        return Briefcase
      case "Dual Degree Module":
        return Award
      default:
        return Award
    }
  }

  const LoadButton = (
    <button onClick={() => fetchCredentials(DEMO_OWNER)} className="btn-secondary text-sm">
      Load Demo
    </button>
  )

  if (!publicKey) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="max-w-md w-full bg-surface border border-border/50 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">Student Wallet</h2>
          <p className="text-text-secondary mb-6">Connect your wallet to view and manage your credentials</p>
          <ClientOnly>
            <div className="flex flex-col gap-3">
              <WalletMultiButton />
              {LoadButton}
            </div>
          </ClientOnly>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text mb-2">My Credentials</h2>
          <p className="text-text-secondary">View and share your verified blockchain credentials</p>
        </div>
        <ClientOnly>
          <div className="flex items-center gap-3">
            <WalletMultiButton />
            {LoadButton}
          </div>
        </ClientOnly>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading your credentials...</p>
        </div>
      ) : credentials.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-text-tertiary" />
          </div>
          <h3 className="text-xl font-bold text-text mb-2">No Credentials Yet</h3>
          <p className="text-text-secondary mb-6">
            Your verified credentials will appear here once you complete courses and earn achievements
          </p>
          <button onClick={() => fetchCredentials(DEMO_OWNER)} className="btn-primary">
            Load Demo Credentials
          </button>
        </div>
      ) : (
        <>
          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {credentials.map((credential) => {
              const TypeIcon = getCredentialIcon(credential.type)
              return (
                <button
                  key={credential.id}
                  onClick={() => setSelectedCredential(credential)}
                  className="card-interactive group text-left overflow-hidden"
                >
                  {/* Image */}
                  <div className="mb-4 rounded-lg overflow-hidden aspect-video bg-surface-light relative">
                    <img
                      src={credential.image || "/placeholder.svg"}
                      alt={credential.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg line-clamp-2 text-text mb-2">{credential.name}</h3>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getCredentialTypeColor(credential.type)}`}
                      >
                        <TypeIcon className="w-3 h-3" />
                        {credential.type}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between text-sm">
                    <span className="text-text-tertiary">{new Date(credential.issued_date).toLocaleDateString()}</span>
                    <span className="text-text-secondary font-medium">{credential.issuer_name}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-text-tertiary text-sm">Total Credentials</p>
                  <p className="text-2xl font-bold text-text">{credentials.length}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-text-tertiary text-sm">Issuers</p>
                  <p className="text-2xl font-bold text-text">{new Set(credentials.map((c) => c.issuer_name)).size}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-text-tertiary text-sm">Latest</p>
                  <p className="text-2xl font-bold text-text">
                    {credentials.length > 0
                      ? new Date(credentials[0].issued_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Credential Detail Modal */}
      {selectedCredential && (
        <Modal
          isOpen={!!selectedCredential}
          title={selectedCredential.name}
          onClose={() => {
            setSelectedCredential(null)
            setShowQR(false)
          }}
          footer={
            <div className="flex flex-col md:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowQR(!showQR)}
                className="btn-secondary flex items-center gap-2 justify-center"
              >
                <QrCode className="w-4 h-4" />
                {showQR ? "Hide QR" : "Show QR"}
              </button>
              <button
                onClick={() => {
                  const link = generateShareLink(selectedCredential)
                  navigator.clipboard.writeText(link)
                  alert("Link copied to clipboard!")
                }}
                className="btn-primary flex items-center gap-2 justify-center"
              >
                <Share2 className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Image and QR */}
            <div>
              <div className="rounded-lg overflow-hidden bg-surface-light aspect-video mb-4">
                <img
                  src={selectedCredential.image || "/placeholder.svg"}
                  alt={selectedCredential.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {showQR && (
                <div className="p-4 border border-border/50 rounded-lg flex items-center justify-center bg-surface-light">
                  <QRCode
                    value={generateShareLink(selectedCredential)}
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4">
              <div>
                <p className="text-text-tertiary text-sm font-medium mb-1">Credential Type</p>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${getCredentialTypeColor(selectedCredential.type)}`}
                >
                  {getCredentialIcon(selectedCredential.type) &&
                    (() => {
                      const Icon = getCredentialIcon(selectedCredential.type)
                      return <Icon className="w-4 h-4" />
                    })()}
                  {selectedCredential.type}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface border border-border/50 rounded-lg p-3">
                  <p className="text-text-tertiary text-xs font-medium mb-1">Issued Date</p>
                  <p className="font-semibold text-text">
                    {new Date(selectedCredential.issued_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-surface border border-border/50 rounded-lg p-3">
                  <p className="text-text-tertiary text-xs font-medium mb-1">Student ID</p>
                  <p className="font-semibold text-text">{selectedCredential.student_id || "N/A"}</p>
                </div>
              </div>

              <div className="bg-surface border border-border/50 rounded-lg p-3">
                <p className="text-text-tertiary text-xs font-medium mb-1">Business Skill</p>
                <p className="font-semibold text-text">{selectedCredential.skill_business}</p>
              </div>

              <div className="bg-surface border border-border/50 rounded-lg p-3">
                <p className="text-text-tertiary text-xs font-medium mb-1">Technical Skill</p>
                <p className="font-semibold text-text">{selectedCredential.skill_tech}</p>
              </div>

              <div className="bg-surface border border-border/50 rounded-lg p-3">
                <p className="text-text-tertiary text-xs font-medium mb-1">Issuer</p>
                <p className="font-semibold text-text">{selectedCredential.issuer_name}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default StudentWallet
