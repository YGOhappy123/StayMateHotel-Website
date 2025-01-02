import { createBrowserRouter } from 'react-router-dom'
import MainRoutes from '@/routes/MainRoutes'
import AuthRoutes from '@/routes/AuthRoutes'
import FragmentRoutes from '@/routes/FragmentRoutes'
import DashboardRoutes from '@/routes/DashboardRoutes'
import ProfileRoutes from '@/routes/ProfileRoutes'

const developmentRoutes = createBrowserRouter([...MainRoutes, ...AuthRoutes, ...ProfileRoutes, ...FragmentRoutes, ...DashboardRoutes])
const testingRoutes = createBrowserRouter([...MainRoutes, ...AuthRoutes, ...ProfileRoutes, ...FragmentRoutes, ...DashboardRoutes])
const productionRoutes = createBrowserRouter([...MainRoutes, ...AuthRoutes, ...ProfileRoutes, ...FragmentRoutes, ...DashboardRoutes])

const getRouter = (environment: 'development' | 'testing' | 'production') => {
    switch (environment) {
        case 'development':
            return developmentRoutes
        case 'testing':
            return testingRoutes
        case 'production':
            return productionRoutes
    }
}

export default getRouter
