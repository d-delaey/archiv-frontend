<script>
    import VodGrid from '../../components/VodGrid.svelte';
    import ClipGrid from '../../components/ClipGrid.svelte';
    import GridPlaceholder from '../../components/GridPlaceholder.svelte';
    import Pagination from '../../components/Pagination.svelte';
    import { page } from '$app/stores';

    let vodsPage = 1;
    let clipsPage = 1;
    let pageSize = 18;
    let query;

    page.subscribe(() => {
        query = $page.params.query;
    });

    async function fetchSearch(type, page, q) {
        const response = await fetch(
            `${
                import.meta.env.VITE_BASE_URL
            }/${type}/?page_size=${pageSize}&page=${page}&search=${q}`
        );
        const resp = await response.json();
        return resp;
    }
</script>

<main class="flex-shrink-0">
    <div class="container">
        {#await fetchSearch('vods', vodsPage, query)}
            <div class="row mb-4">
                <div class="col-xs-12 col-md-7">
                    <h1 class="display-4 fw-bolder p-0 m-0 align-self-center">Vod Ergebnisse</h1>
                </div>
            </div>
            <GridPlaceholder count="12" />
        {:then vods}
            <div class="row mb-4">
                <div class="col-auto">
                    <h1 class="display-4 fw-bolder p-0 m-0 align-self-center">Vod Ergebnisse</h1>
                </div>
                <div class="col-xs-12 col-md-5 ms-auto col-pages">
                    <p class="fs-4 fw-bold p-0 m-0 align-self-center">
                        {vods.count > 1 ? 'Ergebnisse' : 'Ergebnis'}
                        {(vodsPage - 1) * pageSize + 1} - {(vodsPage - 1) * pageSize +
                            vods.results.length} von {vods.count}
                    </p>
                </div>
            </div>
            <VodGrid {vods} />
            <Pagination obj={vods} bind:page={vodsPage} />
        {/await}
    </div>
    <div class="container">
        {#await fetchSearch('clips', clipsPage, query)}
            <div class="row mb-4">
                <div class="col-xs-12 col-md-7">
                    <h1 class="display-4 fw-bolder p-0 m-0 align-self-center">Clip Ergebnisse</h1>
                </div>
            </div>
            <GridPlaceholder count="12" />
        {:then clips}
            <div class="row mb-4">
                <div class="col-auto">
                    <h1 class="display-4 fw-bolder p-0 m-0 align-self-center">Clip Ergebnisse</h1>
                </div>
                <div class="col-xs-12 col-md-5 ms-auto col-pages">
                    <p class="fs-4 fw-bold p-0 m-0 align-self-center">
                        {clips.count > 1 ? 'Ergebnisse' : 'Ergebnis'}
                        {(clipsPage - 1) * pageSize + 1} - {(clipsPage - 1) * pageSize +
                            clips.results.length} von {clips.count}
                    </p>
                </div>
            </div>
            <ClipGrid {clips} />
            <Pagination obj={clips} bind:page={clipsPage} />
        {/await}
    </div>
</main>
