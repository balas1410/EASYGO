import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EasyGoProvider, useEasyGo } from './context/EasyGoContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import SensorStatus from "./components/SensorStatus";

import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';
import InteractiveMap from './pages/InteractiveMap';
import RoutePlanner from './pages/RoutePlanner';
import FavouritePlaces from './pages/FavouritePlaces';
import RemoteControl from './pages/RemoteControl';
import ObstacleDetection from './pages/ObstacleDetection';
import AIPathDetection from './pages/AIPathDetection';
import AnalyticsReports from './pages/AnalyticsReports';
import SettingsAccessibility from './pages/SettingsAccessibility';
import UserProfile from './pages/UserProfile';
import LiveTracking from './pages/LiveTracking';

function RootRedirect() {
  const { hasSeenSplash, isAuthenticated } = useEasyGo();
  if (!hasSeenSplash) {
    return <Navigate to="/splash" replace />;
  }
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <EasyGoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                  <SensorStatus />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/live-tracking"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <LiveTracking />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interactive-map"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <InteractiveMap />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/route-planner"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <RoutePlanner />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/favourite-places"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <FavouritePlaces />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/remote-control"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <RemoteControl />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/obstacle-detection"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ObstacleDetection />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-path-detection"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AIPathDetection />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics-reports"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AnalyticsReports />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SettingsAccessibility />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <UserProfile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </EasyGoProvider>
  );
}
