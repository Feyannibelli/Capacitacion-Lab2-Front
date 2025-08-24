export interface Pokemon {
    id: number;
    name: string;
    type: string[];
    height: number;
    weight: number;
    imageUrl: string;
    abilities: string[];
    moves: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface PokemonListResponse {
    pokemon: Pokemon[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PokemonFilters {
    search: string;
    type: string;
    page: number;
    limit: number;
}

export interface CreatePokemonData {
    name: string;
    type: string[];
    height: number;
    weight: number;
    imageUrl: string;
    abilities: string[];
    moves: string[];
}

export interface UpdatePokemonData extends CreatePokemonData {
    id: number;
}