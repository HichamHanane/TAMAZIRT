import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Cookies from 'js-cookie'
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
import UserProfile from './components/Profile/UserProfile/UserProfile'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './feature/AuthSlice'
import api from './utils/api/axios'
import AppLoader from './components/AppLoader/AppLoader'
import AdminProtectedRoutes from './components/ProtectedRoutes/AdminProtectedRoutes'
import GuideDashboardLayout from './Layouts/GuideDashboardLayout/GuideDashboardLayout'
import GuideDashboardHome from './components/NavigatorDashboard/GuideDashboardHome/GuideDashboardHome'
import GuideProfilePage from './components/NavigatorDashboard/GuideProfilePage/GuideProfilePage'

function App() {

  const { isLoading, error } = useSelector(state => state.auth);
  const [authInitializing, setAuthInitializing] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const token = Cookies.get('authToken')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      dispatch(fetchUser())
        .catch((error) => console.log('Error while fetching the user :', error))
        .finally(() => setAuthInitializing(false))
    }
    else {
      setAuthInitializing(false)
    }
  }, [dispatch])

  if (isLoading || authInitializing) {
    return (
      <AppLoader />
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/application-form" element={<NavigatorApplication />} />

        {/* admin dashboard */}
        <Route element={<AdminProtectedRoutes />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardStatistic />} />
            <Route path="navigators" element={<NavigatorsManagement />} />
            <Route path="tourists" element={<TouristManagement />} />
            <Route path="settings" element={<UserProfile />} />
          </Route>
        </Route>

        {/* navigator dashboard */}

        <Route path="/guide" element={<GuideDashboardLayout />}>
          <Route index element={<GuideDashboardHome />} />
          <Route path="dashboard" element={<GuideDashboardHome />} />
          <Route path="profile" element={<GuideProfilePage />} />
          {/* Add other guide-specific pages here (Trip Requests, Reviews, Calendar) */}
          {/* <Route path="trip-requests" element={<TripRequestsPage />} /> */}
          {/* <Route path="reviews" element={<ReviewsPage />} /> */}
          {/* <Route path="calendar" element={<GuideCalendarPage />} /> */}
        </Route>
        <Route path="dashboard/navigator/profile" element={<Test />} />

        <Route path="/terms" element={<TermsPolicyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
