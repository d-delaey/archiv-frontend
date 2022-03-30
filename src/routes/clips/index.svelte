<script>
    import ClipGrid from '../../components/ClipGrid.svelte';
    import GridPlaceholder from '../../components/GridPlaceholder.svelte';

    let clips;
    let page = 1;

    async function fetchClips(p) {
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/clips/?page_size=48&page=${p}`
        );
        const c = await response.json();
        clips = c;
        window.scrollTo(0, 0);
        return c;
    }

    function range(start, end) {
        return Array(end - start + 1)
            .fill()
            .map((_, idx) => start + idx);
    }
</script>

<main class="flex-shrink-0">
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-md-9">
                <h1 class="display-3 fw-bolder pb-3">Alle Clips</h1>
            </div>
            {#if clips}
                <div class="col-xs-12 col-md-2 col-pages">
                    <p class="fs-4 fw-bold mb-2 pb-3">
                        Seite {clips.current_page} von {clips.total_pages}
                    </p>
                </div>
                <div class="col-xs-12 col-md-1 mb-2 pb-3 col-pages">
                    <div class="dropdown">
                        <button
                            class="btn btn-secondary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Filter
                        </button>
                        <ul
                            class="dropdown-menu dropdown-menu-end"
                            aria-labelledby="dropdownMenuButton1"
                        >
                            <li><div class="dropdown-item">Action</div></li>
                            <li><div class="dropdown-item">Another action</div></li>
                            <li><div class="dropdown-item">Something else here</div></li>
                        </ul>
                    </div>
                </div>
            {/if}
        </div>
        {#await fetchClips(page)}
            <GridPlaceholder count="48" />
        {:then clips}
            <ClipGrid {clips} />
            <nav aria-label="Pagination">
                <ul class="pagination justify-content-center">
                    {#if clips.links.previous}
                        <li class="page-item">
                            <div class="page-link" role="button" on:click={() => (page = 1)}>
                                Erste
                            </div>
                        </li>
                        <li class="page-item pagination-ellipsis text-center">
                            <span>&hellip;</span>
                        </li>
                    {/if}
                    {#each range(1, clips.total_pages) as i}
                        {#if i <= clips.current_page + 2 && i >= clips.current_page - 2}
                            {#if clips.current_page == i}
                                <li class="page-item active">
                                    <div
                                        class="page-link"
                                        role="button"
                                        on:click={() => (page = i)}
                                    >
                                        {i}
                                    </div>
                                </li>
                            {:else}
                                <li class="page-item">
                                    <div
                                        class="page-link"
                                        role="button"
                                        on:click={() => (page = i)}
                                    >
                                        {i}
                                    </div>
                                </li>
                            {/if}
                        {/if}
                    {/each}
                    {#if clips.links.next}
                        <li class="page-item pagination-ellipsis text-center">
                            <span>&hellip;</span>
                        </li>
                        <li class="page-item">
                            <div
                                class="page-link"
                                role="button"
                                on:click={() => (page = clips.total_pages)}
                            >
                                Letzte
                            </div>
                        </li>
                    {/if}
                </ul>
            </nav>
        {/await}
    </div>
</main>

<style lang="scss">
    .page-link {
        color: var(--main-color);
        background-color: var(--bg-color);

        &:hover {
            color: var(--bg-color);
            background-color: var(--main-color);
        }

        &:focus {
            color: var(--bg-color);
            background-color: var(--main-color);
            box-shadow: none;
        }
    }

    .page-item {
        &.active .page-link {
            background-color: var(--main-color);
            border-color: var(--main-color);
            color: var(--bg-color);
        }
    }
    .pagination-ellipsis {
        width: 35px !important;
    }
</style>
