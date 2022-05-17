import subMonths from 'date-fns/subMonths/index.js';

// fetch vods and clips
async function fetchVods(args) {
    let parameters = '?';
    parameters += 'page_size=' + args.page_size;
    parameters += args.page ? '&page=' + args.page : '';
    parameters += args.year ? '&year=' + args.year : '';

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/vods/${parameters}`);
    const vods = await response.json();
    return vods;
}

async function fetchClips(page_size = 12) {
    const response = await fetch(
        `${
            import.meta.env.VITE_BASE_URL
        }/clips/?page_size=${page_size}&ordering=-view_count&date_from=${subMonths(
            Date.now(),
            1
        ).toISOString()}`
    );
    const clips = await response.json();
    return clips;
}

async function fetchStats() {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/stats`);
    const s = await response.json();
    return s;
}

async function fetchEmotes(provider) {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/emotes/?page_size=500&provider=${provider}`);
    const e = await response.json();
    return e;
}

async function fetchYears() {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/years/`);
    const years = await response.json();
    return years;
}

export {
    fetchVods,
    fetchClips,
    fetchStats,
    fetchEmotes,
    fetchYears

}