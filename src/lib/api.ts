import { Pokemon, PokemonListResponse, CreatePokemonData, UpdatePokemonData, PokemonFilters, PokemonType, Ability } from '@/types/pokemon';

const API_BASE_URL = 'http://localhost:3000';
const API_KEY = 'vsdijbnON1@onacvásc';

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        let errorMessage: string;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new ApiError(response.status, errorMessage);
    }
    return response.json();
};

const getHeaders = (includeAuth: boolean = false) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        headers['x-api-key'] = API_KEY;
    }

    return headers;
};

export const pokemonApi = {
    // Get all pokemons with filters and pagination
    getPokemons: async (filters: PokemonFilters = {}): Promise<PokemonListResponse> => {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.type) params.append('type', filters.type);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.order) params.append('order', filters.order);
        if (filters.abilityIds?.length) {
            filters.abilityIds.forEach(id => params.append('abilityIds', id.toString()));
        }

        const response = await fetch(`${API_BASE_URL}/pokemons?${params}`, {
            headers: getHeaders(),
        });
        return handleResponse<PokemonListResponse>(response);
    },

    // Get pokemon by ID
    getPokemon: async (id: number): Promise<Pokemon> => {
        const response = await fetch(`${API_BASE_URL}/pokemons/${id}`, {
            headers: getHeaders(),
        });
        return handleResponse<Pokemon>(response);
    },

    // Create new pokemon
    createPokemon: async (data: Partial<Pokemon>): Promise<Pokemon> => {
        // Transform data to match backend format
        const createData = {
            name: data.name,
            type: data.type,
            height: data.height,
            weight: data.weight,
            imageUrl: data.imageUrl || undefined,
            abilities: data.abilities || [],
        };

        const response = await fetch(`${API_BASE_URL}/pokemons`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(createData),
        });
        return handleResponse<Pokemon>(response);
    },

    // Update existing pokemon
    updatePokemon: async ({ id, data }: { id: number; data: Partial<Pokemon> }): Promise<Pokemon> => {
        // Transform data to match backend format
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.height !== undefined) updateData.height = data.height;
        if (data.weight !== undefined) updateData.weight = data.weight;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || undefined;
        if (data.abilities !== undefined) updateData.abilities = data.abilities;

        const response = await fetch(`${API_BASE_URL}/pokemons/${id}`, {
            method: 'PATCH',
            headers: getHeaders(true),
            body: JSON.stringify(updateData),
        });
        return handleResponse<Pokemon>(response);
    },

    // Delete pokemon
    deletePokemon: async (id: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/pokemons/${id}`, {
            method: 'DELETE',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            let errorMessage: string;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || `Failed to delete pokemon`;
            } catch {
                errorMessage = `Failed to delete pokemon`;
            }
            throw new ApiError(response.status, errorMessage);
        }
    },
};

export const abilitiesApi = {
    // Get all abilities or filter by IDs
    getAbilities: async (ids?: number[]): Promise<Ability[]> => {
        const params = new URLSearchParams();
        if (ids?.length) {
            params.append('ids', ids.join(','));
        }

        const response = await fetch(`${API_BASE_URL}/abilities?${params}`, {
            headers: getHeaders(),
        });
        return handleResponse<Ability[]>(response);
    },

    // Get ability by ID
    getAbility: async (id: number): Promise<Ability> => {
        const response = await fetch(`${API_BASE_URL}/abilities/${id}`, {
            headers: getHeaders(),
        });
        return handleResponse<Ability>(response);
    },
};