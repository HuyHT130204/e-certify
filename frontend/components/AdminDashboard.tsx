"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { ClientOnly } from "./ClientOnly"
import { getIssuer, registerIssuer, getBatches, createBatch, mintCredentials } from "../utils/mock-api"
import { Upload, Plus, CheckCircle, Building2, FileStack, Zap } from "lucide-react"

interface IssuerData {
  authority: string
  name: string
  logo_uri: string
  website: string
}

interface CredentialBatch {
  id: string
  name: string
  maxDepth: number
  maxBufferSize: number
  createdAt: Date
}

const AdminDashboard: React.FC = () => {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [issuerData, setIssuerData] = useState<IssuerData | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [credentialBatches, setCredentialBatches] = useState<CredentialBatch[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"register" | "batches" | "issue">("register")

  useEffect(() => {
    if (publicKey) {
      bootstrap()
    }
  }, [publicKey])

  const bootstrap = async () => {
    try {
      const issuer = await getIssuer()
      if (issuer) {
        setIsRegistered(true)
        setIssuerData({
          authority: issuer.authority,
          name: issuer.name,
          logo_uri: issuer.logo_uri,
          website: issuer.website,
        })
      }
      const batches = await getBatches()
      setCredentialBatches(batches.map((b) => ({ ...b, createdAt: new Date(b.createdAt) })))
    } catch (e) {
      console.error("Bootstrap error", e)
    }
  }

  const registerIssuerAction = async () => {
    if (!publicKey) return
    setLoading(true)
    try {
      const payload = {
        authority: publicKey.toString(),
        name: "APEC University",
        logo_uri: "https://apecgroup.net/logo.png",
        website: "https://apecgroup.net",
      }
      const resp = await registerIssuer(payload)
      if (resp?.ok) {
        setIsRegistered(true)
        setIssuerData(payload)
        alert("Issuer registered successfully!")
      } else {
        alert("Register failed")
      }
    } catch (e) {
      console.error(e)
      alert("Error registering issuer")
    } finally {
      setLoading(false)
    }
  }

  const createCredentialBatch = async () => {
    setLoading(true)
    try {
      const resp = await createBatch({ name: "K2025 Dual-Degree", maxDepth: 20, maxBufferSize: 64 })
      if (resp?.ok) {
        const batch = resp.batch
        setCredentialBatches((prev) => [...prev, { ...batch, createdAt: new Date(batch.createdAt) }])
        alert("Credential batch created!")
      } else {
        alert("Failed to create batch")
      }
    } catch (e) {
      console.error(e)
      alert("Error creating batch")
    } finally {
      setLoading(false)
    }
  }

  const issueCredentials = async (csvFile: File) => {
    setLoading(true)
    try {
      const csvText = await csvFile.text()
      const lines = csvText.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim())
      const walletIndex = headers.findIndex((h) => h.toLowerCase().includes("wallet"))
      const nameIndex = headers.findIndex((h) => h.toLowerCase().includes("name"))
      const idIndex = headers.findIndex((h) => h.toLowerCase().includes("id"))
      if (walletIndex === -1 || nameIndex === -1 || idIndex === -1) {
        throw new Error("CSV must contain columns: wallet_address, student_name, student_internal_id")
      }
      const students = lines
        .slice(1)
        .map((line) => {
          const values = line.split(",").map((v) => v.trim())
          return { wallet: values[walletIndex], name: values[nameIndex], internalId: values[idIndex] }
        })
        .filter((s) => s.wallet && s.name && s.internalId)
      if (students.length === 0) throw new Error("No valid student data found in CSV")

      const resp = await mintCredentials({ students })
      const success = resp?.results?.filter((r: any) => r.success).length || 0
      const fails = resp?.results?.filter((r: any) => !r.success).length || 0
      alert(`Mint results: success=${success}, failed=${fails}`)
    } catch (e) {
      console.error(e)
      alert(e instanceof Error ? e.message : "Error issuing credentials")
    } finally {
      setLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="max-w-md w-full bg-surface border border-border/50 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">Admin Dashboard</h2>
          <p className="text-text-secondary mb-6">
            Connect your wallet to access admin features and manage credentials
          </p>
          <ClientOnly>
            <WalletMultiButton />
          </ClientOnly>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text mb-2">Admin Dashboard</h2>
          <p className="text-text-secondary">Manage issuer registration, credential batches, and student credentials</p>
        </div>
        <ClientOnly>
          <WalletMultiButton />
        </ClientOnly>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-border/50 overflow-x-auto no-scrollbar">
        {[
          { id: "register", label: "Register Issuer", icon: Building2 },
          { id: "batches", label: "Credential Batches", icon: FileStack },
          { id: "issue", label: "Issue Credentials", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all duration-300 border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-tertiary hover:text-text-secondary"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === "register" && (
        <div>
          {!isRegistered ? (
            <div className="card min-h-[220px] flex flex-col justify-center">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-text mb-3">Register APEC University</h3>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  Register your institution to start issuing blockchain credentials and managing student achievements
                </p>
                <button onClick={registerIssuerAction} disabled={loading} className="btn-primary">
                  {loading ? "Registering..." : "Register Issuer"}
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-success mb-1">Issuer Registered</h3>
                  <p className="text-text-secondary">Your institution is ready to issue credentials</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface border border-border/50 rounded-lg p-4 min-h-[88px]">
                  <p className="text-text-tertiary text-sm font-medium mb-1">Institution Name</p>
                  <p className="text-lg font-semibold text-text">{issuerData?.name}</p>
                </div>
                <div className="bg-surface border border-border/50 rounded-lg p-4 min-h-[88px]">
                  <p className="text-text-tertiary text-sm font-medium mb-1">Website</p>
                  <p className="text-lg font-semibold text-text">{issuerData?.website}</p>
                </div>
                <div className="md:col-span-2 bg-surface border border-border/50 rounded-lg p-4">
                  <p className="text-text-tertiary text-sm font-medium mb-1">Authority Address</p>
                  <p className="text-sm font-mono text-text break-all">{issuerData?.authority}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "batches" && (
        <div>
            <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-text mb-1">Credential Batches</h3>
              <p className="text-text-secondary">Manage credential batches for different programs</p>
            </div>
            <button onClick={createCredentialBatch} disabled={loading} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Batch
            </button>
          </div>

          {credentialBatches.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
                <FileStack className="w-8 h-8 text-text-tertiary" />
              </div>
              <p className="text-text-secondary mb-4">No credential batches created yet</p>
              <button onClick={createCredentialBatch} className="btn-secondary">
                Create Your First Batch
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {credentialBatches.map((batch) => (
                <div key={batch.id} className="card hover:shadow-lg hover:shadow-primary/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileStack className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-bold text-lg text-text line-clamp-1">{batch.name}</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-text-tertiary text-sm font-medium mb-1">Max Depth</p>
                          <p className="text-base font-semibold text-text">{batch.maxDepth}</p>
                        </div>
                        <div>
                          <p className="text-text-tertiary text-sm font-medium mb-1">Buffer Size</p>
                          <p className="text-base font-semibold text-text">{batch.maxBufferSize}</p>
                        </div>
                        <div>
                          <p className="text-text-tertiary text-sm font-medium mb-1">Created</p>
                          <p className="text-base font-semibold text-text">{batch.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="badge bg-success/10 text-success border border-success/30 shrink-0">Ready</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "issue" && (
        <div>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-text mb-2">Issue Credentials</h3>
            <p className="text-text-secondary">Upload a CSV file to mint credentials for multiple students</p>
          </div>

          <div className="card">
            <label htmlFor="csv-upload" className="cursor-pointer block">
              <div className="border-2 border-dashed border-border/50 rounded-lg p-12 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-text mb-2">Upload CSV File</h4>
                <p className="text-text-secondary mb-4">Drag and drop your CSV file or click to browse</p>
                <p className="text-sm text-text-tertiary">
                  CSV must contain: <span className="font-mono text-primary">student_wallet_address</span>,{" "}
                  <span className="font-mono text-primary">student_name</span>,{" "}
                  <span className="font-mono text-primary">student_internal_id</span>
                </p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) issueCredentials(file)
                }}
                className="hidden"
                id="csv-upload"
              />
            </label>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileStack className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text">CSV Format</h4>
              </div>
              <p className="text-sm text-text-secondary">
                Ensure your CSV file has the correct headers and student data in the proper format
              </p>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <h4 className="font-semibold text-text">Validation</h4>
              </div>
              <p className="text-sm text-text-secondary">
                All student records are validated before credentials are minted on the blockchain
              </p>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-success" />
                </div>
                <h4 className="font-semibold text-text">Instant Minting</h4>
              </div>
              <p className="text-sm text-text-secondary">
                Credentials are instantly minted and available for students to view and share
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
