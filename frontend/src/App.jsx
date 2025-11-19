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
import GuideRequestsPage from './components/NavigatorDashboard/GuideRequestsPage/GuideRequestsPage'
import GuideReviewsPage from './components/NavigatorDashboard/GuideReviewsPage/GuideReviewsPage'
import GuideProtectedRoutes from './components/ProtectedRoutes/GuideProtectedRoutes'
import TouristDashboardLayout from './Layouts/TouristDashboardLayout/TouristDashboardLayout'
import TouristProfilePage from './components/TouristDashboard/TouristProfilePage/TouristProfilePage'
import TouristRequestsPage from './components/TouristDashboard/TouristRequestsPage/TouristRequestsPage'
import TouristProtectedRoutes from './components/ProtectedRoutes/TouristProductedRoutes'
import ExploreNavigators from './pages/guides/GuidesPage'
import GuideListing from './pages/guides/GuidesPage'
import GuidesPage from './pages/guides/GuidesPage'
import MyReviewsPage from './components/TouristDashboard/MyReviewsPage/MyReviewsPage'

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
        <Route path="/guides" element={<GuidesPage />} />

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
        <Route element={<GuideProtectedRoutes />} >
          <Route path="/guide" element={<GuideDashboardLayout />}>
            <Route index element={<GuideProfilePage />} />
            <Route path="dashboard" element={<GuideProfilePage />} />
            <Route path="profile" element={<GuideProfilePage />} />
            <Route path="requests" element={<GuideRequestsPage />} />
            <Route path="reviews" element={<GuideReviewsPage />} />
          </Route>
        </Route>

        {/* Tourist dashboard */}
        <Route element={<TouristProtectedRoutes />}>
          <Route path='/tourist' element={<TouristDashboardLayout />}>
            <Route index element={<TouristProfilePage />} />
            <Route path="profile" element={<TouristProfilePage />} />
            <Route path="requests" element={<TouristRequestsPage />} />
            <Route path="reviews" element={<MyReviewsPage />} />

          </Route>
        </Route>

        {/* <Route path="dashboard/navigator/profile" element={<Test />} /> */}
        <Route path="/terms" element={<TermsPolicyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
