import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEasyGo } from '../context/EasyGoContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, currentUser } = useEasyGo();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && currentUser?.role !== 'admin') {
    return (
      <div className="p-8 max-w-xl mx-auto mt-12 rounded-2xl bg-white dark:bg-slate-900 border border-red-500/30 text-center shadow-lg">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
          Administrator Role Required
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          System-wide usage reports are restricted to authorized administrators so regular users never see other users&apos; personal records. You can switch to the Admin Demo role in your User Profile to inspect this view.
        </p>
      </div>
    );
  }

  return children;
}
