import React, { useState } from 'react';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { adminApi, AdminUser } from './services/adminApi';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    return adminApi.getStoredAdminUser();
  });

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    adminApi.clearToken();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard adminUser={currentUser} onLogout={handleLogout} />;
};

export default App;
