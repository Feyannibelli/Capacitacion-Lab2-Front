import { Pokemon, PokemonListResponse, PokemonFilters, Ability } from '@/types/pokemon';

const API_BASE_URL = 'http://localhost:3000';
const API_KEY = 'vsdijbnON1@onacvásc';

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    console.log(`API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
        let errorMessage: string;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
            console.error('API Error Response:', errorData);
        } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new ApiError(response.status, errorMessage);
    }

    const data = await response.json();
    console.log('API Success Response:', data);
    return data;
};

const getHeaders = (includeAuth: boolean = false) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (includeAuth) {
        headers['x-api-key'] = API_KEY;
        console.log('Adding API key to headers');
    }

    return headers;
};

export const pokemonApi = {
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

        const url = `${API_BASE_URL}/pokemons?${params}`;
        console.log('Fetching pokemons from:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });
            return handleResponse<PokemonListResponse>(response);
        } catch (error) {
            console.error('Error fetching pokemons:', error);
            throw error;
        }
    },

    getPokemon: async (id: number): Promise<Pokemon> => {
        const url = `${API_BASE_URL}/pokemons/${id}`;
        console.log('Fetching pokemon from:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });
            return handleResponse<Pokemon>(response);
        } catch (error) {
            console.error('Error fetching pokemon:', error);
            throw error;
        }
    },

    createPokemon: async (data: Partial<Pokemon>): Promise<Pokemon> => {
        const createData = {
            name: data.name,
            type: data.type,
            height: data.height,
            weight: data.weight,
            imageUrl: data.imageUrl || undefined,
            abilities: data.abilities?.map(pa => pa.ability.name) || [],
        };

        console.log('Creating pokemon with data:', createData);

        try {
            const response = await fetch(`${API_BASE_URL}/pokemons`, {
                method: 'POST',
                headers: getHeaders(true),
                body: JSON.stringify(createData),
            });
            return handleResponse<Pokemon>(response);
        } catch (error) {
            console.error('Error creating pokemon:', error);
            throw error;
        }
    },

    updatePokemon: async ({ id, data }: { id: number; data: Partial<Pokemon> }): Promise<Pokemon> => {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.height !== undefined) updateData.height = data.height;
        if (data.weight !== undefined) updateData.weight = data.weight;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || undefined;
        if (data.abilities !== undefined) {
            updateData.abilities = data.abilities.map(pa => pa.ability.name);
        }

        console.log('Updating pokemon with data:', updateData);

        try {
            const response = await fetch(`${API_BASE_URL}/pokemons/${id}`, {
                method: 'PATCH',
                headers: getHeaders(true),
                body: JSON.stringify(updateData),
            });
            return handleResponse<Pokemon>(response);
        } catch (error) {
            console.error('Error updating pokemon:', error);
            throw error;
        }
    },

    deletePokemon: async (id: number): Promise<void> => {
        console.log('Deleting pokemon:', id);

        try {
            const response = await fetch(`${API_BASE_URL}/pokemons/${id}`, {
                method: 'DELETE',
                headers: getHeaders(true),
            });

            if (!response.ok) {
                let errorMessage: string;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || `Failed to delete pokemon`;
                    console.error('Delete error:', errorData);
                } catch {
                    errorMessage = `Failed to delete pokemon`;
                }
                throw new ApiError(response.status, errorMessage);
            }

            console.log('Pokemon deleted successfully');
        } catch (error) {
            console.error('Error deleting pokemon:', error);
            throw error;
        }
    },
};

export const abilitiesApi = {
    getAbilities: async (ids?: number[]): Promise<Ability[]> => {
        const params = new URLSearchParams();
        if (ids?.length) {
            params.append('ids', ids.join(','));
        }

        const url = `${API_BASE_URL}/abilities?${params}`;
        console.log('Fetching abilities from:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });
            return handleResponse<Ability[]>(response);
        } catch (error) {
            console.error('Error fetching abilities:', error);
            throw error;
        }
    },

    getAbility: async (id: number): Promise<Ability> => {
        const url = `${API_BASE_URL}/abilities/${id}`;
        console.log('Fetching ability from:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });
            return handleResponse<Ability>(response);
        } catch (error) {
            console.error('Error fetching ability:', error);
            throw error;
        }
    },
};