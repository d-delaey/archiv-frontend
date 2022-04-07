<script>
    import VodGrid from '../../components/VodGrid.svelte';
    import ClipGrid from '../../components/ClipGrid.svelte';
    import { page } from '$app/stores';

    let query = $page.params.query;
    if (!query) {
        query = '';
    }

    async function fetchVods() {
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/vods/?page_size=18&search=${query}`
        );
        const vods = await response.json();
        return vods;
    }

    async function fetchClips() {
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/clips/?page_size=18&search=${query}`
        );
        const clips = await response.json();
        return clips;
    }
</script>

<main class="flex-shrink-0">
    <div class="container">
        {#await fetchVods()}
            <h1 class="display-4 fw-bolder pb-3">Vod Ergebnisse</h1>
            <p>Lade Vods...</p>
        {:then vods}
            <h1 class="display-4 fw-bolder pb-3">
                Vod Ergebnisse <small class="text-muted">{vods.count}</small>
            </h1>
            <VodGrid {vods} />
        {/await}
    </div>
    <div class="container">
        {#await fetchClips()}
            <h1 class="display-4 fw-bolder pb-3">Clip Ergebnisse</h1>
            <p>Lade Clips...</p>
        {:then clips}
            <h1 class="display-4 fw-bolder pb-3">
                Clip Ergebnisse <small class="text-muted">{clips.count}</small>
            </h1>
            <ClipGrid {clips} />
        {/await}
    </div>
</main>
