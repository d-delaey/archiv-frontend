<script>
    // components
    import VodGrid from '@components/VodGrid.svelte';
    import ClipGrid from '@components/ClipGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import { page } from '$app/stores';
    import { fetchClips, fetchVods } from '@/api.js';
</script>

<svelte:head>
    <meta property="og:title" content="Wubbl0rz Archiv" />
    <meta property="og:url" content={$page.url} />
    <meta property="og:updated_time" content="Wubbl0rz Archiv" />
    <meta name="twitter:title" content="Wubbl0rz Archiv" />
    <title>Wubbl0rz Archiv</title>
</svelte:head>

<main class="flex-shrink-0">
    <div class="container">
        <h1 class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center">
            <a href="/vods/all" class="text-decoration-none">Kürzliche Vods</a>
        </h1>
        {#await fetchVods({ page_size: 12 })}
            <GridPlaceholder count="12" />
        {:then vods}
            <VodGrid {vods} />
        {/await}
    </div>
    <div class="container">
        <h1 class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center">
            <a href="/clips" class="text-decoration-none">Top Clips letzter Monat</a>
        </h1>
        {#await fetchClips({ page_size: 12 })}
            <GridPlaceholder count="12" />
        {:then clips}
            <ClipGrid {clips} />
        {/await}
    </div>
</main>
