import { writable } from 'svelte/store';

export const clipFilter = writable({
    sort_by: 'date',
    direction: '-',
    date_from: null,
    date_to: null
});

export const theme = writable(localStorage.getItem('theme'));
