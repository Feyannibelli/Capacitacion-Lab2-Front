import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonList } from '@/hooks/usePokemon';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PokemonFilters } from '@/components/pokemon/PokemonFilter';
import { LoadingGrid, LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, AlertCircle, Grid, List } from 'lucide-react';
import { Pokemon, PokemonType } from '@/types/pokemon';
import { useSearchParams } from 'react-router-dom';

export function HomePage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get filters from URL parameters
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [type, setType] = useState(searchParams.get('type') || '');
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
    const [viewMode, setViewMode] = useState<'grid' | 'list'>((searchParams.get('view') as 'grid' | 'list') || 'grid');
    const [sortBy, setSortBy] = useState<'id' | 'name' | 'type'>((searchParams.get('sortBy') as 'id' | 'name' | 'type') || 'id');
    const [order, setOrder] = useState<'asc' | 'desc'>((searchParams.get('order') as 'asc' | 'desc') || 'asc');
    const limit = 12;

    const {
        data,
        isLoading,
        error,
        isFetching,
    } = usePokemonList({
        search: search || undefined,
        type: type as PokemonType || undefined,
        page,
        limit,
        sortBy,
        order,
    });

    const pokemon = data?.items || [];
    const totalPages = data?.totalPages || 1;
    const total = data?.total || 0;

    // Update URL parameters when filters change
    const updateSearchParams = (updates: Record<string, string | null>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });
        setSearchParams(newParams);
    };

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
        setPage(1);
        updateSearchParams({ search: newSearch || null, page: '1' });
    };

    const handleTypeChange = (newType: string) => {
        setType(newType === 'all' ? '' : newType);
        setPage(1);
        updateSearchParams({ type: newType === 'all' ? null : newType, page: '1' });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        updateSearchParams({ page: newPage.toString() });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (newSortBy: 'id' | 'name' | 'type') => {
        setSortBy(newSortBy);
        updateSearchParams({ sortBy: newSortBy });
    };

    const handleOrderChange = (newOrder: 'asc' | 'desc') => {
        setOrder(newOrder);
        updateSearchParams({ order: newOrder });
    };

    const handleViewModeChange = (newViewMode: 'grid' | 'list') => {
        setViewMode(newViewMode);
        updateSearchParams({ view: newViewMode });
    };

    const handlePokemonView = (pokemon: Pokemon) => {
        navigate(`/pokemon/${pokemon.id}`);
    };

    const handlePokemonEdit = (pokemon: Pokemon) => {
        navigate(`/pokemon/${pokemon.id}/edit`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
                            <h1 className="text-4xl font-bold text-white">Pokédex</h1>
                            <p className="text-red-100 mt-2">Loading your Pokémon collection...</p>
                        </div>
                        <div className="p-8">
                            <LoadingGrid />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && pokemon.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
                            <h1 className="text-4xl font-bold text-white">Pokédex</h1>
                        </div>
                        <div className="p-8">
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Failed to load Pokémon data. Please check your internet connection and try again.
                                    {error instanceof Error && ` Error: ${error.message}`}
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div>
                                <h1 className="text-4xl font-bold text-white">Pokédex</h1>
                                <p className="text-red-100 mt-2">
                                    {isFetching ? (
                                        <span className="flex items-center gap-2">
                                            <LoadingSpinner size="sm" />
                                            Loading...
                                        </span>
                                    ) : (
                                        `Discover ${total} amazing Pokémon`
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* Sort Controls */}
                                <div className="flex items-center gap-2">
                                    <span className="text-red-100 text-sm">Sort by:</span>
                                    <div className="flex rounded-lg bg-white/10 p-1">
                                        <button
                                            onClick={() => handleSortChange('id')}
                                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                                sortBy === 'id'
                                                    ? 'bg-white text-red-600'
                                                    : 'text-red-100 hover:text-white'
                                            }`}
                                        >
                                            Number
                                        </button>
                                        <button
                                            onClick={() => handleSortChange('name')}
                                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                                sortBy === 'name'
                                                    ? 'bg-white text-red-600'
                                                    : 'text-red-100 hover:text-white'
                                            }`}
                                        >
                                            Name
                                        </button>
                                        <button
                                            onClick={() => handleSortChange('type')}
                                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                                sortBy === 'type'
                                                    ? 'bg-white text-red-600'
                                                    : 'text-red-100 hover:text-white'
                                            }`}
                                        >
                                            Type
                                        </button>
                                    </div>
                                </div>

                                {/* Order Controls */}
                                <div className="flex rounded-lg bg-white/10 p-1">
                                    <button
                                        onClick={() => handleOrderChange('asc')}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                            order === 'asc'
                                                ? 'bg-white text-red-600'
                                                : 'text-red-100 hover:text-white'
                                        }`}
                                    >
                                        ↑ ASC
                                    </button>
                                    <button
                                        onClick={() => handleOrderChange('desc')}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                            order === 'desc'
                                                ? 'bg-white text-red-600'
                                                : 'text-red-100 hover:text-white'
                                        }`}
                                    >
                                        ↓ DESC
                                    </button>
                                </div>

                                {/* View Mode Toggle */}
                                <div className="flex rounded-lg bg-white/10 p-1">
                                    <button
                                        onClick={() => handleViewModeChange('grid')}
                                        className={`p-2 rounded transition-colors ${
                                            viewMode === 'grid'
                                                ? 'bg-white text-red-600'
                                                : 'text-red-100 hover:text-white'
                                        }`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleViewModeChange('list')}
                                        className={`p-2 rounded transition-colors ${
                                            viewMode === 'list'
                                                ? 'bg-white text-red-600'
                                                : 'text-red-100 hover:text-white'
                                        }`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-8 border-b border-gray-100">
                        <PokemonFilters
                            search={search}
                            type={type}
                            onSearchChange={handleSearchChange}
                            onTypeChange={handleTypeChange}
                        />
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {pokemon.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-gray-300 mb-6">
                                    <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-700 mb-3">No Pokémon found</h3>
                                <p className="text-gray-500 text-lg">
                                    Try adjusting your search or filter criteria.
                                </p>
                            </div>
                        ) : (
                            <>
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {pokemon.map((poke) => (
                                            <PokemonCard
                                                key={poke.id}
                                                pokemon={poke}
                                                onView={handlePokemonView}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pokemon.map((poke) => (
                                            <div key={poke.id} className="bg-gray-50 rounded-xl p-6 flex items-center gap-6 hover:bg-gray-100 transition-colors">
                                                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shadow-sm">
                                                    <img
                                                        src={poke.imageUrl || `https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=${poke.name.charAt(0)}`}
                                                        alt={poke.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <h3 className="text-xl font-bold capitalize">{poke.name}</h3>
                                                        <span className="text-sm text-gray-500">#{poke.id.toString().padStart(3, '0')}</span>
                                                    </div>
                                                    <div className="flex gap-2 mb-2">
                                                        <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-blue-500 capitalize">
                                                            {poke.type.toLowerCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-4 text-sm text-gray-600">
                                                        <span>{poke.height}m</span>
                                                        <span>{poke.weight}kg</span>
                                                        <span>{poke.abilities.length} abilities</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handlePokemonView(poke)}>
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 pt-12 mt-12 border-t border-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page <= 1}
                                            className="hover:bg-red-50 hover:border-red-200"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Previous
                                        </Button>

                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (page >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = page - 2 + i;
                                                }

                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={page === pageNum ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={
                                                            page === pageNum
                                                                ? 'bg-red-600 hover:bg-red-700'
                                                                : 'hover:bg-red-50 hover:border-red-200'
                                                        }
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                );
                                            })}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page >= totalPages}
                                            className="hover:bg-red-50 hover:border-red-200"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                )}

                                <div className="text-center text-sm text-gray-500 pt-6">
                                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}