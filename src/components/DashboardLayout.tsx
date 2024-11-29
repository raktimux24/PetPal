import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarButton } from './SidebarButton';
import { LayoutDashboard, UserCircle, LogOut, Dog } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function DashboardLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 z-50">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
            <Dog className="w-6 h-6" />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col items-center space-y-6">
          <SidebarButton 
            Icon={LayoutDashboard} 
            label="Dashboard" 
            onClick={() => navigate('/dashboard')}
            isActive={location.pathname === '/dashboard'} 
          />
          <SidebarButton 
            Icon={UserCircle} 
            label="Profile" 
            onClick={() => navigate('/dashboard/profile')}
            isActive={location.pathname === '/dashboard/profile'}
          />
        </nav>

        {/* User Section */}
        <div className="mt-auto space-y-6">
          {/* User Avatar */}
          <div className="relative group">
            <button 
              onClick={() => navigate('/dashboard/profile')}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
            >
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </button>
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[9999]">
              {currentUser?.displayName || 'Your Profile'}
            </div>
          </div>

          {/* Sign Out Button */}
          <SidebarButton 
            Icon={LogOut} 
            label="Sign Out" 
            className="mb-6" 
            onClick={handleSignOut}
          />
        </div>
      </aside>
      <main className="ml-20">
        <Outlet />
      </main>
    </div>
  );
}