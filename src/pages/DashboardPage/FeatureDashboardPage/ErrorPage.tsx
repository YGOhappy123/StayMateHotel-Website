import { useNavigate } from 'react-router-dom'; 
import Button from '@/components/common/Button'; 
import { FC } from 'react'

interface ErrorPageProps {
    errorMessage?: string;
}

const ErrorPage: FC<ErrorPageProps> = ({ errorMessage }) => {
    const navigate = useNavigate();

    const handleRedirectHome = () => {
        navigate('/'); 
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center max-w-lg p-6 bg-white border rounded-md shadow-lg">
                <h1 className="text-4xl font-semibold text-red-600">Oops! Something went wrong.</h1>
                <p className="mt-4 text-lg text-gray-600">
                    {errorMessage || "An unexpected error occurred. Please try again later."}
                </p>
                <Button
                    text="Go Back to Home"
                    variant="primary"
                    onClick={handleRedirectHome} 
                />
            </div>
        </div>
    );
};

export default ErrorPage;
