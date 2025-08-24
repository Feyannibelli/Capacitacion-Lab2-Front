import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Home, Zap } from 'lucide-react';

export function Header() {
    const location = useLocation();

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        Pokédex
                    </Link>

                    <nav className="flex items-center gap-4">
                        <Button
                            variant={location.pathname === '/' ? 'default' : 'ghost'}
                            size="sm"
                            asChild
                        >
                            <Link to="/" className="flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                        </Button>

                        <Button
                            variant={location.pathname === '/create' ? 'default' : 'outline'}
                            size="sm"
                            asChild
                        >
                            <Link to="/create" className="flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" />
                                Add Pokémon
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
}