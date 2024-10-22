import { createBrowserRouter } from 'react-router-dom'
import RootRoutes from '@/routes/rootRoutes'

const developmentRoutes = createBrowserRouter([...RootRoutes])
const testingRoutes = createBrowserRouter([...RootRoutes])
const productionRoutes = createBrowserRouter([...RootRoutes])

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
