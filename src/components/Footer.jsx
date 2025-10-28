import React from 'react'
<<<<<<< HEAD
=======
import { Github } from 'lucide-react'
>>>>>>> temp-fix

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-800 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="text-2xl font-bold text-black mb-4">Hyperlocal</div>
                        <p className="text-black/60 leading-relaxed">
                            Rebuilding community learning by connecting people within the same neighborhood to teach, learn, and share skills.
                        </p>
                    </div>

                    <div className="md:ml-auto">
<<<<<<< HEAD
                        <h4 className="font-bold text-black mb-4">Quick Links</h4>
                        <div className="space-y-2">
                            {['Features', 'Pricing', 'Contact', 'Privacy Policy'].map((link) => (
                                <a key={link} href="#" className="block text-black/60 hover:text-yellow-400 transition-colors">
                                    {link}
                                </a>
                            ))}
=======
                        <div className="space-y-2">
                            <h4 className="font-bold text-black mb-4">
                                <a href="https://github.com/DarshanPandey515/hyperlocal" target='_blank'>
                                    <Github />
                                </a>
                            </h4>

>>>>>>> temp-fix
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-black/40">
                    © 2025 Hyperlocal. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
