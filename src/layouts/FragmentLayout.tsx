import { Outlet } from 'react-router-dom'

const FragmentLayout = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <main>
                <Outlet />
            </main>
        </div>
    )
}
export default FragmentLayout
