<script>
    // routes
    import { Router, Route, Link } from "svelte-routing";
    import Home from "./routes/Home.svelte";
    import VodsAll from "./routes/VodsAll.svelte";
    import VodsYears from "./routes/VodsYears.svelte";
    import VodsWatch from "./routes/VodsWatch.svelte";
    import ClipsAll from "./routes/ClipsAll.svelte";
    import ClipsTop30 from "./routes/ClipsTop30.svelte";
    import ClipsWatch from "./routes/ClipsWatch.svelte";
    import Stats from "./routes/Stats.svelte";
    import Search from "./routes/Search.svelte";

    // components
    import Head from "./components/Head.svelte";
    import Footer from "./components/Footer.svelte";

    // bootstrap js
    import "bootstrap/js/dist/base-component";
    import "bootstrap/js/dist/button";
    import "bootstrap/js/dist/dropdown";

    // dayjs
    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";
    import "dayjs/locale/de";
    dayjs.extend(relativeTime);
    dayjs.locale("de");

    // exports
    export let url = "";

    // vars
    let emotes;
    let statsDB;
    let vods;
    let clips;
    let query = "";
    let showResults = false;
    let searchFocus = -1;

    // parallel api fetch: https://dmitripavlutin.com/javascript-fetch-async-await/#5-parallel-fetch-requests
    async function fetchApi() {
        const [emoteResponse, statsResponse] = await Promise.all([
            fetch("ENV_BASE_DIR/api/emotes/?page_size=500"),
            fetch("ENV_BASE_DIR/api/stats/db/")
        ]);
        const e = await emoteResponse.json();
        const s = await statsResponse.json();
        return [e, s]
    }

    fetchApi().then(([e, s]) => {
        emotes = e;
        statsDB = s;
    })

    // handle search
    async function fetchSearch() {
        const [vodsResponse, clipsResponse] = await Promise.all([
            fetch(`ENV_BASE_DIR/api/vods/?page_size=4&title=${query}`),
            fetch(`ENV_BASE_DIR/api/clips/?page_size=4&title=${query}`)
        ]);
        const v = await vodsResponse.json();
        const c = await clipsResponse.json();
        return [v, c]
    }

    function search() {
        if (query.length < 3) {
            return
        }
        showResults = true;
        fetchSearch().then(([v, c]) => {
            vods = v;
            clips = c;
        })
    }

    search()

    // close seach results when clicking somewhere else on the page
    document.addEventListener("click", function(e) {
        const searchInput = document.querySelector("#searchInput");
        const searchResults = document.querySelector("#searchResults");
        if (e.target != searchInput && e.target != searchResults) {
            showResults = false;
        }
    })

    // keyboard navigation for search results
    function handleResultsList(e) {
        let resultItems = document.querySelectorAll(".result-item");
        if (e.keyCode == 40) {
            searchFocus++;
            addActive(resultItems);
        } else if (e.keyCode == 38) {
            searchFocus--;
            addActive(resultItems);
        } else if (e.keyCode == 13) {
            if (searchFocus > -1) {
                if (resultItems) resultItems[searchFocus].click();
            }
        }
    }

    function addActive(resultItems) {
        if (!resultItems) return false;
        removeActive(resultItems);
        if (searchFocus >= resultItems.length) searchFocus = 0;
        if (searchFocus < 0) searchFocus = (resultItems.length - 1);
        resultItems[searchFocus].classList.add("result-item-active");
    }

    function removeActive(resultItems) {
        for (let i = 0; i < resultItems.length; i++) {
            resultItems[i].classList.remove("result-item-active");
        }
    }
</script>

<Head last_vod_sync={statsDB?.last_vod_sync}/>

<Router url={url}>
    <header>
        <nav class="navbar navbar-expand-lg border-bottom sticky-top mb-4">
            <div class="container-fluid">
                <Link to="/" class="navbar-brand ps-3">
                    <img src="/favicon.ico" width="50" height="50" class="rounded-circle" alt="wubPog">
                </Link>
                <button class="navbar-toggler me-3" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle fs-5" id="navbarVodsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Vods
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarVodsDropdown">
                                <li><Link to="vods/all" class="dropdown-item">Alle Vods</Link></li>
                                <li><Link to="vods/years" class="dropdown-item">Jahresansicht</Link></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle fs-5" id="navbarClipsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Clips
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarClipsDropdown">
                                <Link to="clips/all" class="dropdown-item">Alle Clips</Link>
                                <Link to="clips/top30" class="dropdown-item">Top 30 Tage</Link>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <Link to="stats" class="nav-link fs-5">Stats</Link>
                        </li>
                    </ul>
                    <div class="d-flex input-group w-25 me-2" autocomplete="off">
                        <input id="searchInput" class="form-control rounded-0 rounded-start" type="search" placeholder="Suche /" aria-label="Suche" name="q" bind:value={query} on:input={() => search()} on:focus={() => showResults = true} on:keydown={(e) => handleResultsList(e)} required>
                        <a class="btn btn-outline-secondary rounded-0 rounded-end" type="button" href="/search/{query}">Suche</a>
                        <div id="searchResults" class="{showResults ? '' : 'd-none'} rounded">
                            {#if (vods?.results.length) && (query?.length > 2)}
                                <h5 class="p-2">Vod Ergebnisse: {vods.count}</h5>
                                <div id="result-items-vods">
                                    {#each vods.results as vod}
                                        <div class="result-item" on:click={() => window.location.href = `/vods/watch/${vod.uuid}`} on:mouseenter={(e) => e.target.classList.add("result-item-active")} on:mouseleave={(e) => e.target.classList.remove("result-item-active")}>
                                            <div class="fw-bold">{vod.title}</div>
                                            <div class="text-muted">{dayjs(vod.date).fromNow()}, {dayjs(vod.date).format("HH:mm")} Uhr</div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                            {#if clips?.results.length && (query?.length > 2)}
                                <h5 class="p-2">Clip Ergebnisse: {clips.count}</h5>
                                <div id="result-items-clips">
                                    {#each clips?.results as clip}
                                        <div class="result-item" on:click={() => window.location.href = `/clips/watch/${clip.uuid}`} on:mouseenter={(e) => e.target.classList.add("result-item-active")} on:mouseleave={(e) => e.target.classList.remove("result-item-active")}>
                                            <div class="fw-bold">{clip.title}</div>
                                            <div class="text-muted">{dayjs(clip.date).fromNow()}, von {clip.creator}, {clip.view_count} Views</div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                            {#if (vods?.results.length === 0) && (clips?.results.length === 0) || (query?.length <= 2)}
                                <div class="p-2">Keine Ergebnisse</div>
                            {/if}
                        </div>
                    </div>
                    <div class="dropdown me-2">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownTheme" data-bs-toggle="dropdown" aria-expanded="false">
                            Theme
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownTheme">
                            <li><div class="dropdown-item">Dark</div></li>
                            <li><div class="dropdown-item">Light</div></li>
                            <li><div class="dropdown-item">System</div></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </header>
    <Route path="vods/all" component="{VodsAll}" />
    <Route path="vods/years" component="{VodsYears}" />
    <Route path="vods/watch/:uuid" component="{VodsWatch}" />
    <Route path="clips/all" component="{ClipsAll}" />
    <Route path="clips/top30" component="{ClipsTop30}" />
    <Route path="clips/watch/:uuid" component="{ClipsWatch}" />
    <Route path="stats" component="{Stats}" />
    <Route path="search/:query" component="{Search}" />
    <Route path="/"><Home /></Route>
</Router>

<Footer last_vod_sync={statsDB?.last_vod_sync} last_emote_sync={statsDB?.last_emote_sync}/>

<style lang="scss" global>
    @import "./main.scss";

    :global(.result-item-active) {
        background-color: var(--hover-color);
    }
    #searchResults {
        position: absolute;
        z-index: 1000;
        background-color: var(--bg-color);
        border: 1px solid var(--main-color);
        top: 0;
        margin-top: 37px;
        width: 100%;

        h5 {
            margin: 0;
            background-color: var(--main-color);
            color: var(--bg-color);
        }

        .result-item {
            padding: 0.5em;

            &:not(:last-child) {
                border-bottom: 1px solid var(--accent-color);
            }
        }
    }
</style>
