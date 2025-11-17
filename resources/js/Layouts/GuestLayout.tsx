import ApplicationLogo from "@/Components/ApplicationLogo";
import type { ReactNode } from "react";

interface GuestLayoutProps {
    children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">

            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl px-8 py-10 border border-gray-100">
                <div className="flex flex-col items-center mb-6">
                    <ApplicationLogo className="w-14 h-14 text-gray-600" />
                </div>

                {children}
            </div>

        </div>
    );
}
