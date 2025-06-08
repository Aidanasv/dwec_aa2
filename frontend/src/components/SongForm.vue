<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSongStore } from '@/stores/useSongsStore'
import { defineProps, defineEmits } from 'vue'
import type { Song } from '@/types/songs';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n()

const props = defineProps<{ modelValue: boolean, albumId: string, song: Song | undefined }>()
const emit = defineEmits(['update:modelValue', 'update:song'])


function closeDialog() {
    emit('update:modelValue', false)
    emit('update:song', undefined)
    idSong.value = undefined
    title.value = ''
    duration.value = ''

}

const idSong = ref<string | undefined>(undefined);
const title = ref("");
const url = ref("")


const titleRules = [
    (value: string | any[]) => {
        if (value?.length >= 3) return true
        return t('alertTitle')
    },
]

const duration = ref(props.song?.duration.toString())
const durationRules = [
    (value: string) => {
        if (!/[^0-9]/.test(value)) return true
        return t('alertDuration')
    },
]

watch(() => props.song, (newSong) => {
    idSong.value = newSong?.id.toString() || undefined
    title.value = newSong?.title || ''
    duration.value = newSong?.duration.toString() || ''
    url.value = newSong?.audio || ''
}, { immediate: true })

const songStore = useSongStore();

async function deleteSongs(song: Song) {
    songStore.deleteSongs(song)
    closeDialog()

}

async function submit() {
    if (title.value && duration.value) {
        if (idSong.value == undefined) {
            await songStore.addSongs({
                title: title.value,
                duration: parseInt(duration.value),
                albumId: parseInt(props.albumId),
            })
        } else {
            await songStore.updateSongs({
                id: parseInt(idSong.value),
                title: title.value,
                duration: parseInt(duration.value),
                albumId: parseInt(props.albumId),
                audio: url.value,
            })
        }


 
        alert('Canción registrada 🎵')
        closeDialog();
    }
}


</script>

<template>

    <v-dialog v-model="props.modelValue" max-width="500">

        <template v-slot:default="{ isActive }">
            <v-card :title="$t('songForm')">
                <v-form fast-fail @submit.prevent="submit">
                    <v-card-item>
                        <v-text-field v-model="title" :rules="titleRules" :label="$t('titleSong')"></v-text-field>

                        <v-text-field v-model="duration" :rules="durationRules" :label="$t('duration')"></v-text-field>
                    </v-card-item>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn :text="$t('close')" @click="closeDialog"></v-btn>
                        <v-btn :text="$t('delete')" color="error" v-if="props.song" @click="deleteSongs(props.song)"></v-btn>
                        <v-btn type="submit" color="success">
                            {{ idSong !== undefined && idSong !== null ? $t('update') : $t('save')}}
                        </v-btn>

                    </v-card-actions>

                </v-form>
            </v-card>
        </template>

    </v-dialog>

</template>
