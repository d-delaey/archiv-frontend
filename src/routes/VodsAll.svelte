<script>
    import VodGrid from "../components/VodGrid.svelte";

    let vods;

    async function fetchVods(p) {
        const response = await fetch(`ENV_BASE_DIR/api/vods/?page_size=36&page=${p}`);
        const v = await response.json();
        return v
    }

    function refreshVods(p) {
        fetchVods(p).then((v) => {
            vods = v;
        })
        window.scrollTo(0, 0);
    }

    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
</script>

<main class="flex-shrink-0">
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-md-8">
                <h1 class="display-3 fw-bolder pb-3">
                    Kürzliche Vods
                </h1>
            </div>
            {#if vods}
                <div class="col-xs-12 col-md-4 col-pages">
                   <p class="fs-4 fw-bold mb-2 pb-3">Seite {vods.current_page} von {vods.total_pages}</p>
                </div>
            {/if}
        </div>

        {#if vods}
            <VodGrid vods={vods} />
            <nav aria-label="Pagination">
                <ul class="pagination justify-content-center">
                    {#if vods.links.previous}
                        <li class="page-item">
                            <div class="page-link" role="button" on:click={() => refreshVods(1)}>Erste</div>
                        </li>
                        <li class="page-item pagination-ellipsis text-center">
                            <span>&hellip;</span>
                        </li>
                    {/if}
                    {#each range(1, vods.total_pages) as i}
                        {#if i <= vods.current_page+2 && i >= vods.current_page-2}
                            {#if vods.current_page == i}
                                <li class="page-item active">
                                    <div class="page-link" role="button" on:click={() => refreshVods(i)}>{i}</div>
                                </li>
                            {:else}
                                <li class="page-item">
                                    <div class="page-link" role="button" on:click={() => refreshVods(i)}>{i}</div>
                                </li>
                            {/if}
                        {/if}
                    {/each}
                    {#if vods.links.next}
                        <li class="page-item pagination-ellipsis text-center">
                            <span>&hellip;</span>
                        </li>
                        <li class="page-item">
                            <div class="page-link" role="button" on:click={() => refreshVods(vods.total_pages)}>Letzte</div>
                        </li>
                    {/if}
                </ul>
            </nav>
        {:else}
            {refreshVods(1)}
        {/if}
    </div>
</main>
