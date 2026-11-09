import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  RadioTower,
  Route,
  Heart,
  Gamepad2,
  Radar,
  Sparkles,
  BarChart3,
  Settings,
  User,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldAlert,
  Wifi,
  Menu,
  X
} from 'lucide-react';
import EasyGoLogo from '../components/EasyGoLogo';
import { useEasyGo } from '../context/EasyGoContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
  { path: '/interactive-map', label: 'Interactive Map', icon: Map },
  { path: '/live-tracking', label: 'Live GPS Tracking', icon: RadioTower },
  { path: '/route-planner', label: 'Route Planner', icon: Route },
  { path: '/favourite-places', label: 'Favourite Places', icon: Heart },
  { path: '/remote-control', label: 'Wheelchair Remote', icon: Gamepad2 },
  { path: '/obstacle-detection', label: 'Ultrasonic Sensor', icon: Radar },
  { path: '/ai-path-detection', label: 'AI Path Analysis', icon: Sparkles },
  { path: '/analytics-reports', label: 'Analytics & Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings & Access', icon: Settings },
  { path: '/profile', label: 'User Profile', icon: User }
];

export default function MainLayout({ children }) {
  const {
    currentUser,
    connectionMode,
    setConnectionMode,
    notifications,
    setNotifications,
    settings,
    setSettings,
    logout,
    recordUsageEvent
  } = useEasyGo();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const [nowString, setNowString] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setNowString(
        d.toLocaleString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 15000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const handleQuickJump = (e) => {
    e.preventDefault();
    const q = quickQuery.trim().toLowerCase();
    if (!q) return;
    const matched = NAV_ITEMS.find((item) => item.label.toLowerCase().includes(q));
    if (matched) {
      navigate(matched.path);
      setQuickQuery('');
    } else {
      navigate('/interactive-map');
      setQuickQuery('');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F7FB] dark:bg-[#0B1220] text-slate-900 dark:text-slate-100">
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden lg:flex flex-col justify-between border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0F172A] transition-all duration-200 no-print ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80">
            <EasyGoLogo size={34} showText={!sidebarCollapsed} />
            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle sidebar width"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="p-3 space-y-1" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => recordUsageEvent('Module Access', item.label, 'Navigated')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80">
          {!sidebarCollapsed && (
            <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-1.5 font-semibold mb-1">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{connectionMode} Active</span>
              </div>
              <p className="leading-relaxed opacity-90">
                Simulated ESP32 ultrasonic &amp; route telemetry clearly labeled. No camera hardware used.
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur sticky top-0 z-30 no-print">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <form onSubmit={handleQuickJump} className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Quick jump (e.g. Map, Sensor, Remote)..."
                className="pl-9 pr-3 py-1.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-cyan-400 w-64"
              />
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Date & Time */}
            <span className="hidden xl:inline-block text-xs font-medium text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {nowString}
            </span>

            {/* System Connection Mode Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
              <Wifi className="w-3.5 h-3.5" />
              <select
                aria-label="System connection status mode"
                value={connectionMode}
                onChange={(e) => setConnectionMode(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="Demo Mode" className="bg-slate-900 text-white">Status: Demo Mode</option>
                <option value="Online" className="bg-slate-900 text-white">Status: Online (API Probe)</option>
                <option value="Connecting" className="bg-slate-900 text-white">Status: Connecting...</option>
                <option value="Offline" className="bg-slate-900 text-white">Status: Offline</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle light or dark theme"
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((o) => !o);
                  setProfileOpen(false);
                }}
                className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm">System Notifications ({unreadCount} unread)</h3>
                    <button
                      type="button"
                      onClick={() =>
                        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                      }
                      className="text-xs text-blue-600 dark:text-cyan-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() =>
                            setNotifications((prev) =>
                              prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                            )
                          }
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                            n.read
                              ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                              : 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-0.5">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((o) => !o);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-teal-400 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold truncate max-w-[110px]">
                  {currentUser?.name || 'Demo User'}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-3 z-50 text-xs">
                  <div className="pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                    <p className="font-bold text-sm">{currentUser?.name}</p>
                    <p className="text-slate-500 truncate">{currentUser?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-teal-500/15 text-teal-600 dark:text-teal-300 font-semibold uppercase text-[10px]">
                      Role: {currentUser?.role || 'user'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  >
                    User Profile &amp; Preferences
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  >
                    Accessibility Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 font-semibold mt-1"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1 no-print">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Icon className="w-4 h-4 text-cyan-500" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
