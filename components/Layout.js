// components/Layout.js - UPDATE THIS (remove html/body)
'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import ModelSidebar from './ModelPortal/ModelSidebar';
import UserSidebar from './UserPortal/UserSidebar';

export default function Layout({ children }) {
  const [userRole, setUserRole] = useState('user');
  const pathname = usePathname();
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role || 'user');
    }
  }, [pathname]);
  
  return (
    <>
      <Navbar />
      
      <div className="flex">
        {userRole === 'model' && pathname?.startsWith('/model') && <ModelSidebar />}
        {userRole === 'user' && pathname?.startsWith('/user') && <UserSidebar />}
        
        <main className={`${
          (userRole === 'model' && pathname?.startsWith('/model')) || 
          (userRole === 'user' && pathname?.startsWith('/user')) 
            ? 'flex-1' 
            : 'w-full'
        } p-4 md:p-6`}>
          {children}
        </main>
      </div>
    </>
  );
}