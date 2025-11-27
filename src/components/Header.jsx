import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, loading } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <header className={`fixed w-full z-50 transition-all duration-300 text-black ${isScrolled ? 'bg-white/90 backdrop-blur-sm py-2' : 'bg-transparent py-6'
                }`}>
                <nav className="container mx-auto px-6 flex justify-between items-center">
                    <Link to={"/"} className="text-2xl font-bold text-black">Hyperlocal</Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['How it works?', 'Community', 'Pricing'].map((item) => (
                            <a key={item} href="#" className="text-black/80 hover:text-black transition-colors">
                                {item}
                            </a>
                        ))}

                        {loading ? (
                            <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                        ) : user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-black/80 hover:text-black transition-colors"
                                >
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/auth/login"
                                    className="text-black/80 hover:text-black transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/auth/signup"
                                    className="bg-linear-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-black"
                        onClick={toggleMobileMenu}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </nav>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200">
                        <div className="container mx-auto px-6 py-4 space-y-4">
                            {['How it works?', 'Community', 'Pricing'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="block text-black/80 hover:text-black transition-colors py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item}
                                </a>
                            ))}

                            {loading ? (
                                <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
                            ) : user ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="block text-black/80 hover:text-black transition-colors py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <div className="flex items-center gap-2 py-2">
                                        <div className="w-8 h-8 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-black/80">
                                            Hi, {user.username}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/auth/login"
                                        className="block text-black/80 hover:text-black transition-colors py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/auth/signup"
                                        className="block bg-linear-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full font-medium text-center hover:scale-105 transition-transform"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Signup
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}