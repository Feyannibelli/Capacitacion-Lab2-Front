import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pokemonApi, abilitiesApi } from '@/lib/api';
import { PokemonFilters, CreatePokemonData, UpdatePokemonData } from '@/types/pokemon';
import { toast } from '@/hooks/use-toast';

export const usePokemonList = (filters: PokemonFilters) => {
    return useQuery({
        queryKey: ['pokemon', 'list', filters],
        queryFn: () => pokemonApi.getPokemons(filters),
        placeholderData: (previousData) => previousData,
    });
};

export const usePokemon = (id: number) => {
    return useQuery({
        queryKey: ['pokemon', id],
        queryFn: () => pokemonApi.getPokemon(id),
        enabled: !!id,
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
    });
};

export const useCreatePokemon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePokemonData) => pokemonApi.createPokemon(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pokemon', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['abilities'] });
            toast({
                title: "Success",
                description: "Pokémon created successfully!",
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
        mutationFn: (data: UpdatePokemonData) => pokemonApi.updatePokemon(data),
        onSuccess: (updatedPokemon) => {
            queryClient.setQueryData(['pokemon', updatedPokemon.id], updatedPokemon);
            queryClient.invalidateQueries({ queryKey: ['pokemon', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['abilities'] });
            toast({
                title: "Success",
                description: "Pokémon updated successfully!",
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
            queryClient.removeQueries({ queryKey: ['pokemon', deletedId] });
            queryClient.invalidateQueries({ queryKey: ['pokemon', 'list'] });
            toast({
                title: "Success",
                description: "Pokémon deleted successfully!",
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