<script>
    export let obj;
    export let page;

    function range(start, end) {
        return Array(end - start + 1)
            .fill()
            .map((_, idx) => start + idx);
    }

</script>

<nav aria-label="Pagination">
    <ul class="pagination justify-content-center">
        {#if obj.links.previous}
            <li class="page-item">
                <div class="page-link" role="button" on:click={() => (page = 1)}>
                    Erste
                </div>
            </li>
            <li class="page-item pagination-ellipsis text-center">
                <span>&hellip;</span>
            </li>
        {/if}
        {#each range(1, obj.total_pages) as i}
            {#if i <= obj.current_page + 2 && i >= obj.current_page - 2}
                {#if obj.current_page == i}
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
        {#if obj.links.next}
            <li class="page-item pagination-ellipsis text-center">
                <span>&hellip;</span>
            </li>
            <li class="page-item">
                <div
                    class="page-link"
                    role="button"
                    on:click={() => (page = obj.total_pages)}
                >
                    Letzte
                </div>
            </li>
        {/if}
    </ul>
</nav>

<style lang="scss">
    .page-link {
        color: var(--color-main);
        background-color: var(--color-background);

        &:hover {
            color: var(--color-background);
            background-color: var(--color-main);
        }

        &:focus {
            color: var(--color-background);
            background-color: var(--color-main);
            box-shadow: none;
        }
    }

    .page-item {
        &.active .page-link {
            background-color: var(--color-main);
            border-color: var(--color-main);
            color: var(--color-background);
        }
    }
    .pagination-ellipsis {
        width: 35px !important;
    }
</style>
