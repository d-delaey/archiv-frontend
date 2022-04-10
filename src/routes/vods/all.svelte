<script>
    import VodGrid from '../../components/VodGrid.svelte';
    import GridPlaceholder from '../../components/GridPlaceholder.svelte';
    import Pagination from '../../components/Pagination.svelte';

    let vods;
    let page = 1;

    async function fetchVods(p) {
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/vods/?page_size=48&page=${p}`
        );
        const v = await response.json();
        vods = v;
        window.scrollTo(0, 0);
        return v;
    }
</script>

<main class="flex-shrink-0">
    <div class="container">
        <div class="row mb-4">
            <div class="col-xs-12 col-md-8">
                <h1 class="display-4 fw-bolder p-0 m-0 align-self-center">Alle Vods</h1>
            </div>
            {#if vods}
                <div class="col-xs-12 col-md-4 col-pages">
                    <p class="fs-4 fw-bold mb-2 pb-3">
                        Seite {vods.current_page} von {vods.total_pages}
                    </p>
                </div>
            {/if}
        </div>
        {#await fetchVods(page)}
            <GridPlaceholder count="48" />
        {:then vods}
            <VodGrid {vods} />
            <Pagination obj={vods} bind:page />
        {/await}
    </div>
</main>
