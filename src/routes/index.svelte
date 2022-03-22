<script>
	// components
    import VodGrid from "../components/VodGrid.svelte";
    import ClipGrid from "../components/ClipGrid.svelte";

    // fetch vods and clips
    async function fetchVods() {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/vods/?page_size=18`);
        const vods = await response.json();
        return vods
    }

    async function fetchClips() {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/clips/?page_size=18&sort=view_count`);
        const clips = await response.json();
        return clips
    }
</script>

<main class="flex-shrink-0">
    <div class="container">
        <h1 class="display-3 fw-bolder pb-3">
            Kürzliche Vods
        </h1>
        {#await fetchVods()}
            <p>Lade Vods...</p>
        {:then vods}
            <VodGrid vods={vods} />
        {/await}
    </div>
    <div class="container">
        <h1 class="display-3 fw-bolder pb-3">
            Top Clips
        </h1>
        {#await fetchClips()}
            <p>Lade Clips...</p>
        {:then clips}
            <ClipGrid clips={clips} />
        {/await}
    </div>
</main>
