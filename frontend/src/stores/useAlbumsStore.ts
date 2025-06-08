import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import type { Album } from "@/types/albums";

export const useAlbumStore = defineStore("albumStore", () => {

    const albums = ref<Album[]>([]);
    const isLoading = ref<boolean>(false);
    const error = ref<string | null>(null);

    async function fetchAlbumsByArtists(id: string): Promise<void> {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await axios.get<Album[]>("http://localhost:3000/albums")
            albums.value = response.data.filter(album => album.artistId.toString() == id)
        } catch (err: any) {
            error.value = err.message || "Error al obtener albumes"
        } finally {
            isLoading.value = false
        }
    }

    function resetAlbums(): void {
        albums.value = []
    }

    return {
        albums,
        isLoading,
        error,
        fetchAlbumsByArtists,
        resetAlbums,
    }
})