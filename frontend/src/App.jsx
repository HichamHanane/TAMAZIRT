import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import TermsPolicyPage from './pages/TermsPolicyPage/TermsPolicyPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import Test from './pages/test'
import NavigatorApplication from './components/Applications/NavigatorApplication/ApplicationForm'
import DashboardLayout from './pages/DashboardLayout/DashboardLayout'
import DashboardStatistic from './components/Dashboard/DashboardStatistic'
import NavigatorsManagement from './components/Navigators/AllNavigators/NavigatorsManagement'
import TouristManagement from './components/Tourists/TouristManagement/TouristManagement'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/application-form" element={<NavigatorApplication />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardStatistic />} />
          <Route path="navigators" element={<NavigatorsManagement />} />
          <Route path="tourists" element={<TouristManagement />} />
          {/* <Route path="dashboard" element={<DashboardContent />} /> */}
          {/* <Route path="users" element={<UsersManagement />} /> */}
          {/* <Route path="settings" element={<SettingsPage />} /> */}
          {/* Ajoutez d'autres routes ici si nécessaire */}
        </Route>

        <Route path="/terms" element={<TermsPolicyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
