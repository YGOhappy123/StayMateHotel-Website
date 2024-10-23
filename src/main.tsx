import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'
import { store } from '@/store'
import getRouter from '@/routes'

const persistor = persistStore(store)
const queryClient = new QueryClient()
const environment = import.meta.env.VITE_NODE_ENV as 'development' | 'testing' | 'production'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={getRouter(environment)} />
                </QueryClientProvider>
            </PersistGate>
            <ToastContainer />
        </ReduxProvider>
    </StrictMode>
)
