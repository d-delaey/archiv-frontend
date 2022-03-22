<script>
    import Head from '../../components/Head.svelte';
	import Footer from '../../components/Footer.svelte';
    import VodGrid from "../../components/VodGrid.svelte";
    import GridPlaceholder from "../../components/GridPlaceholder.svelte";

    let vods;
    let page = 1;

    async function fetchStats() {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/stats/db/`);
        const s = await response.json();
        return s
    }

    async function fetchVods(p) {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/vods/?page_size=48&page=${p}`);
        const v = await response.json();
        vods = v;
        window.scrollTo(0, 0);
        return v
    }

    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
</script>

{#await fetchStats()}
    <span></span>
{:then statsDB}
    <Head updated_time={statsDB.last_vod_sync} />
{/await}

<main class="flex-shrink-0">
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-md-8">
                <h1 class="display-3 fw-bolder pb-3">
                    Alle Vods
                </h1>
            </div>
            {#if vods}
                <div class="col-xs-12 col-md-4 col-pages">
                    <p class="fs-4 fw-bold mb-2 pb-3">Seite {vods.current_page} von {vods.total_pages}</p>
                </div>
            {/if}
        </div>
        {#await fetchVods(page)}
            <GridPlaceholder count=48 />
        {:then vods}
            <VodGrid vods={vods} />
            <nav aria-label="Pagination">
                <ul class="pagination justify-content-center">
                    {#if vods.links.previous}
                        <li class="page-item">
                            <div class="page-link" role="button" on:click={() => page = 1}>Erste</div>
                        </li>
                        <li class="page-item pagination-ellipsis text-center">
                            <span>&hellip;</span>
                        </li>
                    {/if}
                    {#each range(1, vods.total_pages) as i}
                        {#if i <= vods.current_page+2 && i >= vods.current_page-2}
                            {#if vods.current_page == i}
                                <li class="page-item active">
                                    <div class="page-link" role="button" on:click={() => page = i}>{i}</div>
                                </li>
                            {:else}
                                <li class="page-item">
                                    <div class="page-link" role="button" on:click={() => page = i}>{i}</div>
                                </li>
                            {/if}
                        {/if}
                    {/each}
                    {#if vods.links.next}
                        <li class="page-item pagination-ellipsis text-center">
                            <span>&hellip;</span>
                        </li>
                        <li class="page-item">
                            <div class="page-link" role="button" on:click={() => page = vods.total_pages}>Letzte</div>
                        </li>
                    {/if}
                </ul>
            </nav>
        {/await}
    </div>
</main>
