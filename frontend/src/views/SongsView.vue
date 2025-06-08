<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSongStore } from '@/stores/useSongsStore';
import SongForm from '@/components/SongForm.vue';
import type { Song } from '@/types/songs';
import { formatTime } from '@/utils/TimeFormat';
import { useAuthStore } from '@/stores/useAuthStore';

const songStore = useSongStore();
const props = defineProps<{ id: string }>()
const authStore = useAuthStore()

onMounted(() => {
    songStore.fetchSongsByAlbum(props.id);
    songStore.fetchAlbumById(props.id);
})

function changeSong(song: Song) {
    if (authStore.isAuthenticated && authStore.user && authStore.user.role == 'admin') {
        selectSong.value = song;
        showDialog.value = true;
    }

}

const showDialog = ref(false);
const selectSong = ref<Song | undefined>(undefined);

function onSongUpdate(song: Song | undefined) {
    selectSong.value = song;
}
</script>

<template>
    <v-row align="center" style="height: 150px" no-gutters>
        <v-col>
            <v-card class="mx-auto" max-width="400" color="primary">

                <v-card-title>{{ songStore.album?.title }}</v-card-title>

                <v-img :src="songStore.album?.image" height="200" cover></v-img>

                <v-card-text>
                    <div>{{ songStore.album?.year }}</div>
                </v-card-text>
            </v-card>
        </v-col>

        <v-col>
            <v-list width="80%" class="rounded-lg">
                <v-list-item v-if="authStore.isAuthenticated && authStore.user && authStore.user.role == 'admin'"
                    height="80%">

                    <v-btn @click="showDialog = true" color="primary">{{ $t('buttonNewSong') }}</v-btn>

                </v-list-item>

                <v-list-item v-for="(item, i) in songStore.songs" :key="i" :value="item" rounded="shaped"
                    @click="changeSong(item)">
                    <template v-slot:prepend>
                        <v-icon color="primary" icon="mdi-music-note"></v-icon>
                    </template>


                    <v-list-item-title v-text="item.title"></v-list-item-title>
            
                    <v-list-item-subtitle v-text="formatTime(item.duration)"></v-list-item-subtitle>
                    <template v-slot:append>
                        <audio :src="item.audio" controls></audio>
                    </template>
                </v-list-item>
            </v-list>

        </v-col>
    </v-row>

    <SongForm v-model="showDialog" :album-id="props.id" :song="selectSong" @update:song="onSongUpdate" />

</template>

<style scoped></style>
