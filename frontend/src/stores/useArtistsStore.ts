import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import type { Artist } from "@/types/artists";

export const useArtistsStore = defineStore("artistsStore", () => {

    const artists = ref<Artist[]>([]);
    const isLoading = ref<boolean>(false);
    const error = ref<string | null>(null);

    async function fetchArtists(): Promise<void> {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await axios.get<Artist[]>('http://127.0.0.1:3000/artists');
            artists.value = response.data;
        } catch (err: any) {
            error.value = err.message || "Error al obtener artistas";
        } finally {
            isLoading.value = false;
        }

    }

    function resetArtists(): void {
        artists.value = [];
    }

    return {
        artists,
        isLoading,
        error,
        fetchArtists,
        resetArtists,
    }
});