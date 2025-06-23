import Navbar from '@/components/navbar';
import React from 'react';

import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="h-full max-w-screen flex flex-col items-center justify-center">
            <Navbar />
            {children}
        </div>
    );
}