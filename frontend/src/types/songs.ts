export interface createSong {
    title: string;
    duration: number;
    albumId: number;
}

export interface Song extends createSong {
    id: number;
    audio: string;
}