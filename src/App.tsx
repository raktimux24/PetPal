import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { PetProvider } from './contexts/PetContext';
import { HealthRecordProvider } from './contexts/HealthRecordContext';
import { RoutineProvider } from './contexts/RoutineContext';
import { ActivityProvider } from './contexts/ActivityContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { BehaviorProvider } from './contexts/BehaviorContext';
import { ExpenseProvider } from './contexts/ExpenseContext';
import AddPet from './pages/AddPet';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PetProfile from './pages/PetProfile';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import Landing from './pages/Landing';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PetProvider>
          <HealthRecordProvider>
            <RoutineProvider>
              <ActivityProvider>
                <NotificationProvider>
                  <BehaviorProvider>
                    <ExpenseProvider>
                      <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route
                          path="/dashboard"
                          element={
                            <PrivateRoute>
                              <DashboardLayout />
                            </PrivateRoute>
                          }
                        >
                          <Route index element={<Dashboard />} />
                          <Route path="add-pet" element={<AddPet />} />
                          <Route path="pet/:id" element={<PetProfile />} />
                          <Route path="profile" element={<Profile />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    </ExpenseProvider>
                  </BehaviorProvider>
                </NotificationProvider>
              </ActivityProvider>
            </RoutineProvider>
          </HealthRecordProvider>
        </PetProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}