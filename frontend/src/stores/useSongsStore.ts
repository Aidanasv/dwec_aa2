import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import type { createSong, Song } from "@/types/songs";
import { id } from "vuetify/locale";
import type { Album } from "@/types/albums";

export const useSongStore = defineStore("songStore", () => {

    const songs = ref<Song[]>([]);
    const album = ref<Album>();
    const isloading = ref<boolean>(false);
    const error = ref<string | null>(null);

    async function fetchSongsByAlbum(id: string): Promise<void> {
        isloading.value = true;
        error.value = null;

        try {
            const response = await axios.get<Song[]>("http://localhost:3000/songs")
            songs.value = response.data.filter(song => song.albumId.toString() == id)
        } catch (err: any) {
            error.value = err.message || "Error al obtener canciones";
        } finally {
            isloading.value = false;
        }  
    }

    async function fetchAlbumById(id: string) {
        isloading.value = true;
        error. value = null;

        try{
            const response = await axios.get<Album>(`http://127.0.0.1:3000/albums/${id}`)
            album.value = response.data
        } catch (err: any) {
            error.value = err.message || "Error al obtener albúm";
        } finally {
            isloading.value = false;
        }
    
    }

    async function addSongs(song: createSong) {
        isloading.value = true;
        error.value = null;

        try {
            const response = await axios.post<Song>("http://localhost:3000/songs", song)
        }catch (err: any) {
            error.value = err.message || "Error al añadir canciones"
        } finally {
            isloading.value = false;
            fetchSongsByAlbum(song.albumId.toString());
        }        
    }

    async function deleteSongs(song: Song) {
        isloading.value = true;
        error.value = null;

        try{
            const response = await axios.delete<Song>(`http://localhost:3000/songs/${song.id}`)
        } catch (err: any) {
            error.value = err.message || "Error al eliminar canción"
        } finally {
            isloading.value = false;
            fetchSongsByAlbum(song.albumId.toString());
        }
    }

    async function updateSongs(song:Song) {
        isloading.value = true;
        error.value = null;

        try {
            const response = await axios.put<Song>(`http://localhost:3000/songs/${song.id}`, song)
        }catch (err: any) {
            error.value = err.message || "Error al modificar canción"
        } finally {
            isloading.value = false;
            fetchSongsByAlbum(song.albumId.toString());
        }
        
    }

    function resetSongs(): void {
        songs.value = []
    }

    return {
        songs,
        album,
        isloading,
        error,
        fetchSongsByAlbum,
        fetchAlbumById,
        resetSongs,
        addSongs,
        deleteSongs,
        updateSongs,
    }
})