"use client"

import type { NextPage } from "next"
import Head from "next/head"
import { WalletProvider } from "../components/WalletProvider"
import ECertifyModal from "../components/ECertifyModal"
import { useState } from "react"
import {
  Zap,
  BookOpen,
  Award,
  Settings,
  Calendar,
  Shield,
  Bell,
  TrendingUp,
  Clock,
  Users2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Target,
} from "lucide-react"

const Home: NextPage = () => {
  const [showECertifyModal, setShowECertifyModal] = useState(false)

  return (
    <WalletProvider>
      <Head>
        <title>Learn.io - Futuristic Learning Platform</title>
        <meta name="description" content="Next-generation decentralized credential verification for APEC University" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-md bg-background/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">Learn.io</h1>
                  <p className="text-xs text-text-tertiary">Future of Learning</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-lg mx-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses, skills, credentials..."
                    className="input-field w-full"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300">
                    Search
                  </button>
                </div>
              </div>

              {/* Header Icons */}
              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-surface-light rounded-lg transition-colors duration-300">
                  <Bell className="w-5 h-5 text-text-secondary" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
                </button>
                <button className="p-2 hover:bg-surface-light rounded-lg transition-colors duration-300">
                  <Settings className="w-5 h-5 text-text-secondary" />
                </button>
                <button className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
                  S
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="app-shell">
          <div className="flex">
          {/* Left Sidebar */}
          <aside className="w-64 border-r border-border/50 min-h-screen p-6">
            {/* User Profile */}
            <div className="flex items-center gap-3 mb-8 p-4 rounded-lg bg-surface border border-border/50">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-semibold">
                S
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Hi Shakir</p>
                <p className="text-xs text-text-tertiary">Student</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 mb-8">
              {[
                { icon: BookOpen, label: "Explore", active: false },
                { icon: Award, label: "Dashboard", active: true },
                { icon: Settings, label: "My Settings", active: false },
                { icon: Calendar, label: "Course Calendar", active: false },
              ].map((item, i) => (
                <button
                  key={i}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    item.active
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "text-text-secondary hover:bg-surface-light"
                  }`}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* E-Certify Button */}
            <button
              onClick={() => setShowECertifyModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 mb-6"
            >
              <Shield className="w-5 h-5" />
              <span>E-Certify</span>
            </button>

            {/* Premium Card */}
            <div className="bg-primary/5 border border-primary/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-sm text-text">Upgrade to Pro</h3>
              </div>
              <p className="text-xs text-text-tertiary mb-3">Unlock premium features and exclusive content</p>
              <button className="w-full bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300">
                Upgrade Now
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-6xl">
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold text-accent">Welcome Back</span>
                </div>
                <h2 className="text-5xl font-bold mb-3 text-balance text-text">Your Personal Learning Journey</h2>
                <p className="text-lg text-text-secondary max-w-2xl">
                  Personalized courses based on your learning goals and progress. Continue where you left off or explore
                  new skills.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                {[
                  { label: "Courses Enrolled", value: "24", icon: BookOpen, color: "from-primary" },
                  { label: "Certificates", value: "12", icon: Award, color: "from-accent" },
                  { label: "Study Hours", value: "156", icon: Clock, color: "from-success" },
                  { label: "Study Groups", value: "5", icon: Users2, color: "from-warning" },
                ].map((stat, i) => (
                  <div key={i} className="card group hover:shadow-lg hover:shadow-primary/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-text-tertiary text-sm mb-2 font-medium">{stat.label}</p>
                        <p className="text-4xl font-bold text-text">{stat.value}</p>
                      </div>
                      <div className={`w-14 h-14 bg-surface-light rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-7 h-7" />
                      </div>
                    </div>
                    <div className="w-full bg-surface-light rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card-interactive mb-12 bg-primary/5 border-primary/20 overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary">Featured Course</span>
                    </div>
                    <h3 className="text-3xl font-bold text-text mb-3">Advanced UI/UX Design</h3>
                    <p className="text-text-secondary mb-6 max-w-xl">
                      Master modern design principles with hands-on projects and real-world applications. Learn from
                      industry experts and build a professional portfolio.
                    </p>
                    <div className="flex items-center gap-6 mb-6">
                      <div>
                        <p className="text-xs text-text-tertiary mb-1">Students Enrolled</p>
                        <p className="text-lg font-bold text-text">2,847</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary mb-1">Course Duration</p>
                        <p className="text-lg font-bold text-text">42 Hours</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary mb-1">Price</p>
                        <p className="text-lg font-bold text-primary">$199</p>
                      </div>
                    </div>
                    <button className="btn-primary flex items-center gap-2 group/btn">
                      Enroll Now
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <div className="w-48 h-48 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-primary/30" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-border/50">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-primary rounded-full border-2 border-background flex items-center justify-center text-white text-xs font-semibold"
                      >
                        {i}
                      </div>
                    ))}
                    <div className="w-8 h-8 bg-surface-light rounded-full border-2 border-background flex items-center justify-center text-text-tertiary text-xs font-semibold">
                      +2.8k
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-3 h-3 bg-primary rounded-full opacity-60"></div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-bold text-text mb-2">Recommended For You</h3>
                    <p className="text-text-secondary">Personalized course suggestions based on your interests</p>
                  </div>
                  <button className="text-primary hover:text-primary-light text-sm font-semibold transition-colors flex items-center gap-1 group">
                    View All
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Web Development",
                      duration: "42 Hours",
                      price: "$199",
                      students: "2.3k",
                      color: "from-primary",
                      description: "Learn modern web development with React and Next.js",
                    },
                    {
                      title: "Data Science",
                      duration: "56 Hours",
                      price: "$249",
                      students: "1.8k",
                      color: "from-accent",
                      description: "Master data analysis and machine learning fundamentals",
                    },
                    {
                      title: "Mobile Apps",
                      duration: "38 Hours",
                      price: "$179",
                      students: "1.5k",
                      color: "from-success",
                      description: "Build native mobile applications for iOS and Android",
                    },
                  ].map((course, i) => (
                    <div key={i} className="card-interactive group flex flex-col">
                      <div className={`w-full h-40 bg-surface-light rounded-lg mb-4`}></div>
                      <h4 className="font-bold text-lg text-text mb-2">{course.title}</h4>
                      <p className="text-sm text-text-secondary mb-4 flex-1">{course.description}</p>
                      <div className="flex justify-between items-center text-sm text-text-tertiary mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className="font-semibold text-primary">{course.price}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xs text-text-tertiary">{course.students} students</span>
                        <button className="btn-secondary text-sm">Explore</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-80 border-l border-border/50 p-6">
            {/* Search */}
            <div className="mb-6">
              <input type="text" placeholder="Quick search..." className="input-field w-full" />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border/50">
              <button className="pb-3 px-1 border-b-2 border-primary text-primary font-semibold text-sm">
                Trending
              </button>
              <button className="pb-3 px-1 text-text-tertiary hover:text-text-secondary font-semibold text-sm transition-colors">
                Popular
              </button>
              <button className="pb-3 px-1 text-text-tertiary hover:text-text-secondary font-semibold text-sm transition-colors">
                New
              </button>
            </div>

            {/* Featured Courses */}
            <div className="space-y-4 mb-8">
              {[
                { title: "Master Figma", hours: "42 Hours", price: "$199", bg: "bg-emerald-600" },
                { title: "UI Design Pro", hours: "28 Hours", price: "$149", bg: "bg-primary" },
              ].map((course, i) => (
                <div
                  key={i}
                  className={`${course.bg} rounded-lg p-4 text-white card-interactive`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm opacity-80">{course.hours}</p>
                      <p className="text-lg font-bold">{course.price}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{course.title}</h4>
                  <button className="w-full bg-white text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Enroll
                  </button>
                </div>
              ))}
            </div>

            {/* Learning Insights */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-text">Learning Insights</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-text-secondary font-medium">Completion Rate</span>
                    <span className="text-sm font-bold text-primary">80%</span>
                  </div>
                  <div className="w-full bg-surface-light rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-text-secondary font-medium">Consistency</span>
                    <span className="text-sm font-bold text-accent">92%</span>
                  </div>
                  <div className="w-full bg-surface-light rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
        </div>

        {/* E-Certify Modal */}
        <ECertifyModal isOpen={showECertifyModal} onClose={() => setShowECertifyModal(false)} />
      </div>
    </WalletProvider>
  )
}

export default Home
