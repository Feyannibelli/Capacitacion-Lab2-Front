import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Home, Zap } from 'lucide-react';

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 text-xl font-bold text-gray-900 hover:text-red-600 transition-colors"
                    >
                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <span className="hidden sm:block">Pokédex</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                isActive('/') && location.pathname === '/'
                                    ? 'bg-red-50 text-red-600 border border-red-200'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden sm:block">Home</span>
                        </Link>

                        <Button
                            onClick={() => navigate('/create')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            <span className="hidden sm:block">Add Pokémon</span>
                            <span className="block sm:hidden">Add</span>
                        </Button>
                    </div>
                </div>

                {/* Breadcrumb */}
                {location.pathname !== '/' && (
                    <div className="pb-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Link
                                to="/"
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Home
                            </Link>
                            <span className="text-gray-300">/</span>

                            {location.pathname === '/create' && (
                                <span className="text-gray-900 font-medium">Create Pokémon</span>
                            )}

                            {location.pathname.match(/^\/pokemon\/\d+$/) && (
                                <span className="text-gray-900 font-medium">Pokémon Details</span>
                            )}

                            {location.pathname.match(/^\/pokemon\/\d+\/edit$/) && (
                                <>
                                    <Link
                                        to={location.pathname.replace('/edit', '')}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        Pokémon Details
                                    </Link>
                                    <span className="text-gray-300">/</span>
                                    <span className="text-gray-900 font-medium">Edit</span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}