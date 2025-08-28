import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pokemonApi, abilitiesApi } from '@/lib/api';
import { PokemonFilters, Pokemon } from '@/types/pokemon';
import { toast } from '@/hooks/use-toast';

export interface ExtendedPokemonFilters extends PokemonFilters {
    limit?: number;
    sortBy?: 'id' | 'name' | 'type';
    order?: 'asc' | 'desc';
}

export const usePokemonList = (filters: ExtendedPokemonFilters) => {
    return useQuery({
        queryKey: ['pokemon', 'list', filters],
        queryFn: () => pokemonApi.getPokemons(filters),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000, // 30 seconds
    });
};

export const usePokemon = (id: number) => {
    return useQuery({
        queryKey: ['pokemon', id],
        queryFn: () => pokemonApi.getPokemon(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useAbilities = (ids?: number[]) => {
    return useQuery({
        queryKey: ['abilities', ids],
        queryFn: () => abilitiesApi.getAbilities(ids),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useAbility = (id: number) => {
    return useQuery({
        queryKey: ['ability', id],
        queryFn: () => abilitiesApi.getAbility(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useCreatePokemon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Pokemon>) => pokemonApi.createPokemon(data),
        onSuccess: (newPokemon) => {
            // Invalidate and refetch pokemon list
            queryClient.invalidateQueries({ queryKey: ['pokemon', 'list'] });

            // Add the new pokemon to cache
            queryClient.setQueryData(['pokemon', newPokemon.id], newPokemon);

            // Invalidate abilities as new ones might have been created
            queryClient.invalidateQueries({ queryKey: ['abilities'] });

            toast({
                title: "Success",
                description: `${newPokemon.name} has been created successfully!`,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to create Pokémon",
                variant: "destructive",
            });
        },
    });
};

export const useUpdatePokemon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Pokemon> }) =>
            pokemonApi.updatePokemon({ id, data }),
        onSuccess: (updatedPokemon) => {
            // Update the specific pokemon in cache
            queryClient.setQueryData(['pokemon', updatedPokemon.id], updatedPokemon);

            // Invalidate pokemon list to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['pokemon', 'list'] });

            // Invalidate abilities as they might have changed
            queryClient.invalidateQueries({ queryKey: ['abilities'] });

            toast({
                title: "Success",
                description: `${updatedPokemon.name} has been updated successfully!`,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update Pokémon",
                variant: "destructive",
            });
        },
    });
};

export const useDeletePokemon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => pokemonApi.deletePokemon(id),
        onSuccess: (_, deletedId) => {
            // Remove the pokemon from cache
            queryClient.removeQueries({ queryKey: ['pokemon', deletedId] });

            // Invalidate pokemon list
            queryClient.invalidateQueries({ queryKey: ['pokemon', 'list'] });

            toast({
                title: "Success",
                description: "Pokémon has been deleted successfully!",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete Pokémon",
                variant: "destructive",
            });
        },
    });
};