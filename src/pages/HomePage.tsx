import { useQueryState } from 'nuqs';
import { usePokemonList } from '@/hooks/usePokemon';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PokemonFilters } from '@/components/pokemon/PokemonFilter';
import { LoadingGrid, LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { mockPokemon } from '@/lib/api';

export function HomePage() {
    const [search, setSearch] = useQueryState('search', { defaultValue: '' });
    const [type, setType] = useQueryState('type', { defaultValue: '' });
    const [page, setPage] = useQueryState('page', { defaultValue: 1, parse: Number, serialize: String });
    const limit = 12;

    const {
        data,
        isLoading,
        error,
        isFetching,
    } = usePokemonList({
        search,
        type,
        page,
        limit,
    });

    // For development: use mock data when API is not available
    const pokemon = data?.pokemon || mockPokemon;
    const totalPages = data?.totalPages || Math.ceil(mockPokemon.length / limit);
    const total = data?.total || mockPokemon.length;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Pokédex</h1>
                </div>
                <PokemonFilters
                    search={search}
                    type={type}
                    onSearchChange={setSearch}
                    onTypeChange={setType}
                />
                <LoadingGrid />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Pokédex</h1>
                </div>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load Pokémon data. Using demo data instead.
                        {error instanceof Error && ` Error: ${error.message}`}
                    </AlertDescription>
                </Alert>
                <PokemonFilters
                    search={search}
                    type={type}
                    onSearchChange={setSearch}
                    onTypeChange={setType}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {mockPokemon.map((pokemon) => (
                        <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))}
                </div>
            </div>
        );
    }

    const filteredPokemon = pokemon.filter(p => {
        const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = !type || p.type.includes(type);
        return matchesSearch && matchesType;
    });

    const paginatedPokemon = filteredPokemon.slice((page - 1) * limit, page * limit);
    const calculatedTotalPages = Math.ceil(filteredPokemon.length / limit);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Pokédex</h1>
                    <p className="text-gray-600 mt-1">
                        {isFetching ? (
                            <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Loading...
              </span>
                        ) : (
                            `Found ${filteredPokemon.length} Pokémon`
                        )}
                    </p>
                </div>
            </div>

            <PokemonFilters
                search={search}
                type={type}
                onSearchChange={setSearch}
                onTypeChange={setType}
            />

            {filteredPokemon.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Pokémon found</h3>
                    <p className="text-gray-600">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedPokemon.map((pokemon) => (
                            <PokemonCard key={pokemon.id} pokemon={pokemon} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {calculatedTotalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </Button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, calculatedTotalPages) }, (_, i) => {
                                    let pageNum;
                                    if (calculatedTotalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (page <= 3) {
                                        pageNum = i + 1;
                                    } else if (page >= calculatedTotalPages - 2) {
                                        pageNum = calculatedTotalPages - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={page === pageNum ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
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
                                disabled={page >= calculatedTotalPages}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    )}

                    <div className="text-center text-sm text-gray-500 pt-4">
                        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, filteredPokemon.length)} of {filteredPokemon.length} results
                    </div>
                </>
            )}
        </div>
    );
}