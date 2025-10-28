import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Search, Users, Target, Star } from "lucide-react";
import { FileEdit, MessageCircle, Image, CalendarCheck } from "lucide-react";
<<<<<<< HEAD

=======
import { Link } from 'react-router-dom';
>>>>>>> temp-fix

const Landing = () => {

    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const titles = [
        "Learn Local",
        "Teach Local",
        "Skill Swap",
        "Talent Nearby"
    ];

    useEffect(() => {
<<<<<<< HEAD
        const typeSpeed = isDeleting ? 40 : 60;
        const pauseTime = 2000;
=======
        const typeSpeed = isDeleting ? 50 : 60;
        const pauseTime = 1000;
>>>>>>> temp-fix

        if (isPaused) {
            const pauseTimer = setTimeout(() => {
                setIsPaused(false);
                if (isDeleting) {
                    setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
                }
                setIsDeleting(!isDeleting);
            }, pauseTime);
            return () => clearTimeout(pauseTimer);
        }

        const timer = setTimeout(() => {
            if (isDeleting) {
                setCurrentText(currentText.slice(0, -1));
                if (currentText === '') {
                    setIsPaused(true);
                }
            } else {
                const currentTitle = titles[currentTitleIndex];
                setCurrentText(currentTitle.slice(0, currentText.length + 1));
                if (currentText === currentTitle) {
                    setIsPaused(true);
                }
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, isPaused, currentTitleIndex, titles]);

    return (
        <>
            <Header />
            <div className="min-h-screen text-black bg-white">

                <section className="relative py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-400/5 via-black to-black"></div>
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                <span className="text-yellow-400 text-sm font-medium">Join 10,000+ community members</span>
                            </div>

                            <div className="min-h-[280px] md:min-h-80 lg:min-h-[360px] flex items-center justify-center">
                                <div>
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                        <span className="block text-gray-900">
                                            {currentText}
                                            <span className="inline-block w-1 h-16 md:h-20 lg:h-24 animate-pulse"></span>
                                        </span>
                                        <span className="block bg-linear-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                            Right Beside You.
                                        </span>
                                    </h1>

                                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-gray-600">
                                        Connect with people in your neighborhood who teach, learn, and share what they love.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
<<<<<<< HEAD
                                <button className="bg-linear-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-yellow-500/25 flex items-center gap-2 cursor-pointer">
=======
                                <Link 
                                to={"/auth/login"}
                                className="bg-linear-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-yellow-500/25 flex items-center gap-2 cursor-pointer">
>>>>>>> temp-fix
                                    Get Started
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
<<<<<<< HEAD
                                </button>
                                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer">
=======
                                </Link>
                                <Link 
                                to={"/auth/signup"}
                                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer">
>>>>>>> temp-fix
                                    Become a Teacher
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
<<<<<<< HEAD
                                </button>
=======
                                </Link>
>>>>>>> temp-fix
                            </div>

                            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-200">
                                {[
                                    { number: '50+', label: 'Skills' },
                                    { number: '1k+', label: 'Neighborhoods' },
                                    { number: '10k+', label: 'Members' }
                                ].map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                                        <div className="text-gray-600 text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

<<<<<<< HEAD
                <section className="py-20">
                    <div className="container mx-auto px-6">
=======
                <section className="py-20" >
                    <div className="container mx-auto px-6" id='how-it-work'>
>>>>>>> temp-fix
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                How Hyperlocal Works
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                From discovery to mastery - your journey to learning and teaching starts here
                            </p>
                        </div>

                        <div className="max-w-6xl mx-auto">
                            <div className="relative">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-yellow-400 to-yellow-500 transform -translate-y-1/2 hidden lg:block"></div>

                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
                                    {[
                                        {
                                            step: "01",
                                            icon: Search,
                                            title: "Discover",
                                            description: "Browse skills available in your neighborhood",
                                            features: ["Local search", "Skill categories", "Distance filter"]
                                        },
                                        {
                                            step: "02",
                                            icon: Users,
                                            title: "Connect",
                                            description: "Find the perfect teacher or student match",
                                            features: ["Profile matching", "Direct messaging", "Schedule sessions"]
                                        },
                                        {
                                            step: "03",
                                            icon: Target,
                                            title: "Learn & Teach",
                                            description: "Engage in skill-sharing sessions with others",
                                            features: ["Flexible timing", "Progress tracking", "Community support"]
                                        },
                                        {
                                            step: "04",
                                            icon: Star,
                                            title: "Grow Together",
                                            description: "Build lasting community connections",
                                            features: ["Skill badges", "Community events", "Ongoing learning"]
                                        }
                                    ].map((step, index) => (
                                        <div key={index} className="relative">
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black text-sm font-bold z-10">
                                                {step.step}
                                            </div>

                                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group hover:border-yellow-300">
                                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <step.icon className="w-7 h-7" />

                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                                    {step.description}
                                                </p>
                                                <ul className="space-y-2">
                                                    {step.features.map((feature, featureIndex) => (
                                                        <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                                                            <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

<<<<<<< HEAD
                <section className="py-20">
=======
                <section className="py-20" id='Community' >
>>>>>>> temp-fix
                    <div className="container mx-auto px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                        Your Neighborhood's<br />
                                        <span className="bg-linear-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                            Social Learning Hub
                                        </span>
                                    </h2>
                                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                        Share your learning journey, connect with local experts, and build meaningful relationships through our community feed.
                                    </p>

                                    <div className="space-y-6">
                                        {[

                                            {
                                                icon: FileEdit,
                                                title: "Share Your Progress",
                                                description: "Post updates, ask questions, and showcase your skill development journey"
                                            },
                                            {
                                                icon: MessageCircle,
                                                title: "Real-time Discussions",
                                                description: "Engage in meaningful conversations with learners and teachers in your area"
                                            },
                                            {
                                                icon: Image,
                                                title: "Media Sharing",
                                                description: "Share photos, videos, and documents to enhance learning experiences"
                                            },
                                            {
                                                icon: CalendarCheck,
                                                title: "Event Creation",
                                                description: "Organize local workshops, meetups, and learning sessions"
                                            }

                                        ].map((feature, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="text-2xl mt-1">
                                                    <feature.icon className="w-6 h-6 " />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                                                    <p className="text-gray-600">{feature.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 transform transition-transform duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                                DP
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Darshan Pandey</h4>
                                                <p className="text-sm text-gray-500">Teaching Guitar • 0.5km away</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-gray-700 mb-3">
                                                Just finished an amazing guitar session with SJR! 🎸 She's making great progress with chord transitions.
                                                So proud of our local talent!
                                            </p>
                                            <div className="flex gap-2 mb-3">
                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">#GuitarLessons</span>
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">#LocalTalent</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
                                            <div className="flex items-center gap-4">
                                                <button className="flex items-center gap-1 hover:text-yellow-500">
                                                    ❤️ 12 likes
                                                </button>
                                                <button className="flex items-center gap-1 hover:text-yellow-500">
                                                    💬 3 comments
                                                </button>
                                            </div>
                                            <span>2 hours ago</span>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 transform transition-transform duration-300 mt-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-linear-to-r from-slate-400 to-slate-500 rounded-full flex items-center justify-center text-white font-bold">
                                                SJR
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Samarth Jung Rana</h4>
                                                <p className="text-sm text-gray-500">Learning Guitar</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-gray-700 mb-3">
                                                Looking for guitar classes in the area! Any recommendations? 👩‍🍳
                                            </p>
                                            <div className="flex gap-2 mb-3">
                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">#GuitarLessons</span>
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">#LocalTalent</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
                                            <div className="flex items-center gap-4">
                                                <button className="flex items-center gap-1 hover:text-yellow-500">
                                                    ❤️ 12 likes
                                                </button>
                                                <button className="flex items-center gap-1 hover:text-yellow-500">
                                                    💬 3 comments
                                                </button>
                                            </div>
                                            <span>2 hours ago</span>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </section>

<<<<<<< HEAD
                <section className="py-20">
=======
                <section className="py-20" id='Pricing' >
>>>>>>> temp-fix
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Transparent Pricing
                            </h2>
                            <p className="text-4xl font-bold md:text-5xl text-gray-600 max-w-2xl mx-auto">
                                <span className='bg-linear-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent'>
                                    that works best for you
                                </span>
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[

                                    {
                                        name: "Learner",
                                        description: "For anyone looking to discover and learn new skills nearby",
                                        price: "Free",
                                        period: "forever",
                                        popular: false,
                                        features: [
                                            "Browse local skill listings",
                                            "Use basic search filters",
                                            "Message up to 3 people per month",
                                            "Join open community events",
                                            "Bookmark favorite mentors"
                                        ],
                                        cta: "Start Exploring",
                                        color: "gray"
                                    },
                                    {
                                        name: "Sharer",
                                        description: "For skilled individuals who want to share and connect locally",
                                        price: "₹199",
                                        period: "per month",
                                        popular: true,
                                        features: [
                                            "Unlimited learner connections",
                                            "Enhanced profile visibility",
                                            "Schedule and manage sessions",
                                            "Accept requests directly",
                                            "Access to verified learner profiles",
                                            "Priority listing in local results"
                                        ],
                                        cta: "Start Sharing",
                                        color: "yellow"
                                    },
                                    {
                                        name: "Community Plus",
                                        description: "For local organizers or groups who want to host and grow skill communities",
                                        price: "₹499",
                                        period: "per month",
                                        popular: false,
                                        features: [
                                            "Everything in Sharer plan",
                                            "Host group sessions or meetups",
                                            "Manage multiple listings",
                                            "Access insights and analytics",
                                            "Custom event pages",
                                            "Community growth dashboard"
                                        ],
                                        cta: "Upgrade Now",
                                        color: "black"
                                    }

                                ].map((plan, index) => (
                                    <div key={index} className={`relative rounded-2xl border-2 transition-all duration-300    ${plan.popular
                                        ? 'border-yellow-400 bg-white shadow-xl'
                                        : 'border-gray-200 bg-white shadow-sm'
                                        }`}>
                                        {plan.popular && (
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                                                Most Popular
                                            </div>
                                        )}

                                        <div className="p-8">
                                            <div className="text-center mb-6">
                                                <h3 className={`text-2xl font-bold ${plan.color === 'yellow' ? 'text-yellow-600' :
                                                    plan.color === 'black' ? 'text-gray-900' : 'text-gray-700'
                                                    }`}>
                                                    {plan.name}
                                                </h3>
                                                <p className="text-gray-600 mt-2 text-sm">
                                                    {plan.description}
                                                </p>
                                            </div>

                                            <div className="text-center mb-6">
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                                    {plan.period !== "forever" && (
                                                        <span className="text-gray-600">/{plan.period}</span>
                                                    )}
                                                </div>
                                                {plan.period === "forever" && (
                                                    <span className="text-gray-600 text-sm">No credit card required</span>
                                                )}
                                            </div>

                                            <ul className="space-y-4 mb-8">
                                                {plan.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                                                        <svg className="w-5 h-5 text-green-500 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>

                                            <button className={`w-full py-3 px-6 rounded-lg cursor-pointer font-bold transition-all ${plan.popular
                                                ? 'bg-linear-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg'
                                                : plan.color === 'black'
                                                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}>
                                                {plan.cta}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="my-20">
                    <div className="bg-linear-to-r from-yellow-400/10 to-yellow-500/10 rounded-2xl p-18 border border-yellow-400/20 max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-6xl font-bold text-center">
                            Start Connecting, Start Learning<br />
                            <span className="bg-linear-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                All Within Your Neighborhood.
                            </span>
                        </h2>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Landing;