<script>
    // components
    import VodGrid from '../components/VodGrid.svelte';
    import ClipGrid from '../components/ClipGrid.svelte';
    import GridPlaceholder from '../components/GridPlaceholder.svelte';
    import subMonths from 'date-fns/subMonths/index.js';

    // fetch vods and clips
    async function fetchVods() {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/vods/?page_size=12`);
        const vods = await response.json();
        return vods;
    }

    async function fetchClips() {
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/clips/?page_size=12&ordering=-view_count&date_from=${subMonths(Date.now(), 1).toISOString()}`
        );
        const clips = await response.json();
        return clips;
    }
</script>

<main class="flex-shrink-0">
    <div class="container">
        <h1 class="display-3 fw-bolder pb-3"><a href="/vods/all" class="text-decoration-none">Kürzliche Vods</a></h1>
        {#await fetchVods()}
            <GridPlaceholder count="12" />
        {:then vods}
            <VodGrid {vods} />
        {/await}
    </div>
    <div class="container">
        <h1 class="display-3 fw-bolder pb-3"><a href="/clips" class="text-decoration-none">Top Clips letzter Monat</a></h1>
        {#await fetchClips()}
            <GridPlaceholder count="12" />
        {:then clips}
            <ClipGrid {clips} />
        {/await}
    </div>
</main>
