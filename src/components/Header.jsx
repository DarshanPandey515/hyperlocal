import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { authUtils } from '../AuthConstants';


export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 text-black ${isScrolled ? 'bg-white/90 backdrop-blur-sm py-2' : 'bg-transparent py-6'
            }`}>
            <nav className="container mx-auto px-6 flex justify-between items-center">
                <Link to={"/"} className="text-2xl font-bold text-black">Hyperlocal</Link>
                <div className="hidden md:flex items-center space-x-8">
                    {['How it works?', 'Community', 'Pricing'].map((item) => (
<<<<<<< HEAD
                        <a key={item} href="#" className="text-black/80 hover:text-black transition-colors">
=======
                        <a key={item} href={`#${item}`} className="text-black/80 hover:text-black transition-colors">
>>>>>>> temp-fix
                            {item}
                        </a>
                    ))}
                    <Link
                        to={"/auth/login"}
                        className="text-black/80 hover:text-black transition-colors">
                        Login
                    </Link>
                    {authUtils.isAuthenticated() ? (
                        <Link
                            to="/dashboard"
                            className="bg-linear-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform"
                        >
                            Dashboard
                        </Link>
                    ) : (
<<<<<<< HEAD
                        <button className="bg-linear-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform">
                            Sign Up
                        </button>
=======
                        <Link 
                        to={"/auth/signup"}
                        className="bg-linear-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform">
                            Sign Up
                        </Link>
>>>>>>> temp-fix
                    )}
                </div>
                <button className="md:hidden text-black">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>
        </header>)
}
