import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useUser, SignOutButton, UserButton } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  Users,
  BarChart3,
  Bell,
  Search,
  Plus,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Menu,
  X,
  LogOut,
  Zap,
  Code,
  Palette,
  FileText,
  Bot,
  Eye,
  MousePointer,
  Timer,
  Star,
} from "lucide-react";

// Sidebar Navigation Items
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
  { icon: FolderOpen, label: "Projects", href: "/dashboard/projects" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Users, label: "Team", href: "/dashboard/team" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

// Stats Data
const statsData = [
  {
    label: "Total Projects",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: FolderOpen,
  },
  {
    label: "Active Users",
    value: "1,429",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Revenue",
    value: "€48.2K",
    change: "+23%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Tasks Completed",
    value: "89%",
    change: "-2%",
    trend: "down",
    icon: CheckCircle2,
  },
];

// Recent Projects
const recentProjects = [
  {
    name: "E-commerce Platform",
    status: "In Progress",
    progress: 75,
    team: 4,
    icon: Code,
  },
  {
    name: "Brand Identity",
    status: "Review",
    progress: 90,
    team: 2,
    icon: Palette,
  },
  {
    name: "Documentation",
    status: "Completed",
    progress: 100,
    team: 3,
    icon: FileText,
  },
  {
    name: "AI Integration",
    status: "In Progress",
    progress: 45,
    team: 5,
    icon: Bot,
  },
];

// Recent Activity
const recentActivity = [
  {
    user: "Marie L.",
    action: "completed task",
    target: "Homepage Design",
    time: "2 min ago",
  },
  {
    user: "Thomas R.",
    action: "commented on",
    target: "API Integration",
    time: "15 min ago",
  },
  {
    user: "Sophie M.",
    action: "uploaded file to",
    target: "Brand Assets",
    time: "1 hour ago",
  },
  {
    user: "Lucas P.",
    action: "created project",
    target: "Mobile App v2",
    time: "3 hours ago",
  },
];

// Quick Actions
const quickActions = [
  { icon: Plus, label: "New Project", color: "bg-white text-black" },
  { icon: Users, label: "Invite Team", color: "bg-white/10 text-white" },
  { icon: Zap, label: "Quick Task", color: "bg-white/10 text-white" },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Use try-catch to handle when outside ClerkProvider
  let isSignedIn = true;
  let isLoaded = true;
  let user: { firstName?: string | null; username?: string | null; primaryEmailAddress?: { emailAddress: string } | null } | null = null;

  try {
    const auth = useAuth();
    const userResult = useUser();
    isSignedIn = auth.isSignedIn ?? false;
    isLoaded = auth.isLoaded;
    user = userResult.user;
  } catch {
    // Not inside ClerkProvider, use defaults for demo
  }

  // Redirect if not signed in (only if Clerk is configured)
  if (isLoaded && !isSignedIn && import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    navigate("/sign-in");
    return null;
  }

  const userName = user?.firstName || user?.username || "User";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "user@aurion.studio";

  return (
    <div className="min-h-screen bg-black text-white font-body">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed top-0 left-0 h-full w-[280px] bg-neutral-950 border-r border-white/10 z-50 lg:translate-x-0 lg:z-30"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link to="/" className="text-xl font-bold">
              aurion<span className="text-xs align-super">®</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      item.active
                        ? "bg-white text-black font-medium"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? (
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    }
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-white/40 truncate">{userEmail}</p>
              </div>
              {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? (
                <SignOutButton>
                  <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4 text-white/40 hover:text-white cursor-pointer" />
                  </button>
                </SignOutButton>
              ) : (
                <Link to="/" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <LogOut className="w-4 h-4 text-white/40 hover:text-white cursor-pointer" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-[280px]">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search projects, tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                New Project
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Welcome back, {userName} 👋
            </h1>
            <p className="text-white/60">
              Here's what's happening with your projects today.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm ${action.color} transition-colors`}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.trend === "up" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Projects</h2>
                <button className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors">
                  View all
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/[0.07] transition-colors cursor-pointer group"
                  >
                    <div className="p-3 bg-white/10 rounded-xl">
                      <project.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium truncate">{project.name}</h3>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full ${
                            project.status === "Completed"
                              ? "bg-green-500/20 text-green-400"
                              : project.status === "Review"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-white/50">
                          {project.progress}%
                        </span>
                        <div className="flex items-center gap-1 text-xs text-white/50">
                          <Users className="w-3.5 h-3.5" />
                          {project.team}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Activity</h2>
                <button className="text-sm text-white/60 hover:text-white transition-colors">
                  See all
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-white/60">{activity.action}</span>{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    5 tasks due today
                  </h3>
                  <p className="text-white/60 text-sm">
                    You have pending tasks that need your attention. Review and
                    complete them to stay on track.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap"
              >
                View Tasks
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
