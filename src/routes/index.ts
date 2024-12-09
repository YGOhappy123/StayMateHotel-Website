import { createBrowserRouter } from 'react-router-dom'
import RootRoutes from '@/routes/RootRoutes'
import AuthRoutes from '@/routes/AuthRoutes'
import DashboardRoutes from '@/routes/DashboardRoutes'

const developmentRoutes = createBrowserRouter([...RootRoutes, ...AuthRoutes, ...DashboardRoutes])
const testingRoutes = createBrowserRouter([...RootRoutes, ...AuthRoutes, ...DashboardRoutes])
const productionRoutes = createBrowserRouter([...RootRoutes, ...AuthRoutes, ...DashboardRoutes])

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
