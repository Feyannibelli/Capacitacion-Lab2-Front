import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Home, Zap } from 'lucide-react';

export function Header() {
    const location = useLocation();

    return (
        <header className="bg-white shadow-lg border-b-4 border-red-500">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link
                        to="/"
                        className="flex items-center gap-3 text-2xl font-black text-gray-900 hover:text-red-600 transition-colors group"
                    >
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                            </div>
                        </div>
                        <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                            Pokédex
                        </span>
                    </Link>

                    <nav className="flex items-center gap-4">
                        <Button
                            variant={location.pathname === '/' ? 'default' : 'ghost'}
                            size="lg"
                            asChild
                            className={
                                location.pathname === '/'
                                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }
                        >
                            <Link to="/" className="flex items-center gap-2 px-6">
                                <Home className="w-5 h-5" />
                                <span className="font-semibold">Home</span>
                            </Link>
                        </Button>

                        <Button
                            variant={location.pathname === '/create' ? 'default' : 'outline'}
                            size="lg"
                            asChild
                            className={
                                location.pathname === '/create'
                                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                                    : 'text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400'
                            }
                        >
                            <Link to="/create" className="flex items-center gap-2 px-6">
                                <PlusCircle className="w-5 h-5" />
                                <span className="font-semibold">Add Pokémon</span>
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
