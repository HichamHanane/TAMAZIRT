import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import AppLoader from '../AppLoader/AppLoader'

function TouristProtectedRoutes() {
    const location = useLocation()
    const { isAuthenticated, user, isLoading } = useSelector(state => state.auth)

    if (isLoading) return <AppLoader />

    let isAdmin = false
    if (user) {
        if (user.role.toLowerCase() === 'tourist' || user.isAdmin) {
            isAdmin = true
        }
    }

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/" replace state={{ from: location }} />
    }
    return <Outlet />
}

export default TouristProtectedRoutes
