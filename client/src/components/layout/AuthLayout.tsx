import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-[#191919] flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <Outlet />
            </div>
        </div>
    );
}
