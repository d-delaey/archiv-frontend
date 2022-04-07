<script>
    import ClipGrid from '../../components/ClipGrid.svelte';
    import GridPlaceholder from '../../components/GridPlaceholder.svelte';

    let clips;
    let page = 1;
    let filter = {
        sort_by: 'date',
        direction: '-',
        date_from: null,
        date_to: null
    };

    async function fetchClips(f, p) {
        let params = `?page_size=48&page=${p}&ordering=${f['direction']}${f['sort_by']}`;
        if (f['date_from'] != null && f['date_from'] != '') {
            params += `&date_from=${f['date_from']}`;
        }
        if (f['date_to'] != null && f['date_to'] != '') {
            params += `&date_to=${f['date_to']}`;
        }
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/clips/${params}`);
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
                <h1 class="display-4 fw-bolder pb-3">Alle Clips</h1>
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
                            class="btn btn-secondary dropdown-toggle filter-btn"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                            aria-expanded="false"
                        >
                            Filter
                        </button>
                        <ul
                            class="dropdown-menu dropdown-menu-end filter-menu"
                            aria-labelledby="dropdownMenuButton1"
                        >
                            <li>
                                <div class="dropdown-item mt-2">
                                    <h6>Sortieren nach</h6>
                                    <div class="form-check">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="flexRadioDefault1"
                                            bind:group={filter['sort_by']}
                                            value="date"
                                        />
                                        <label class="form-check-label" for="flexRadioDefault1">
                                            Datum
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="flexRadioDefault2"
                                            bind:group={filter['sort_by']}
                                            value="view_count"
                                        />
                                        <label class="form-check-label" for="flexRadioDefault2">
                                            Aufrufe
                                        </label>
                                    </div>
                                    <div
                                        class="btn-group mt-2"
                                        role="group"
                                        aria-label="Basic radio toggle button group"
                                    >
                                        <input
                                            type="radio"
                                            class="btn-check"
                                            name="btnradio"
                                            id="btnradio1"
                                            autocomplete="off"
                                            bind:group={filter['direction']}
                                            value=""
                                        />
                                        <label class="btn btn-secondary w-50" for="btnradio1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                class="bi bi-arrow-bar-up"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"
                                                />
                                            </svg>
                                            Aufsteigend
                                        </label>
                                        <input
                                            type="radio"
                                            class="btn-check"
                                            name="btnradio"
                                            id="btnradio2"
                                            autocomplete="off"
                                            bind:group={filter['direction']}
                                            value="-"
                                        />
                                        <label class="btn btn-secondary w-50" for="btnradio2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                class="bi bi-arrow-bar-down"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"
                                                />
                                            </svg>
                                            Absteigend
                                        </label>
                                    </div>
                                </div>
                            </li>
                            <li><hr class="dropdown-divider" /></li>
                            <li>
                                <div class="dropdown-item mb-2">
                                    <h6>Datum</h6>
                                    <div>
                                        <label for="date-from">Von:</label>
                                        <input
                                            id="date-from"
                                            type="datetime-local"
                                            name="date-from"
                                            bind:value={filter['date_from']}
                                            max={Date.now()}
                                            class="datetime-local form-control"
                                        />
                                    </div>
                                    <div class="mt-2">
                                        <label for="date-to">Bis:</label>
                                        <input
                                            id="date-to"
                                            type="datetime-local"
                                            name="date-to"
                                            bind:value={filter['date_to']}
                                            class="datetime-local form-control"
                                        />
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            {/if}
        </div>
        {#await fetchClips(filter, page)}
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

    .datetime-local {
        color: var(--main-color);
    }

    ::-webkit-calendar-picker-indicator {
        filter: invert(1);
    }
</style>
