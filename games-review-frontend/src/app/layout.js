'use client';

import Link from 'next/link';
import { AuthProvider, useAuth } from '@/utils/auth';
import './globals.css';

// Navbar component
function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="font-bold text-xl">Games Review Board</Link>
        
        <div className="flex gap-4">
          <Link href="/games">Games</Link>
          
          {isAuthenticated ? (
            <>
              <Link href="/games/add">Add Game</Link>
              <Link href="/dashboard">Dashboard</Link>
              <button onClick={logout}>Logout</button>
              <span>Hi, {user?.username}</span>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Games Review Board</title>
      </head>
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="container mx-auto p-4 flex-grow">{children}</main>
            <footer className="bg-gray-200 p-4 text-center">
              © {new Date().getFullYear()} Games Review Board
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}