<script>
    import { page } from '$app/stores';
    import { format, parseISO } from 'date-fns';

    let vodCount = 0;
    let vods = {};

    async function fetchYears() {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/years/`);
        const y = await response.json();
        y.forEach((element) => {
            vodCount += element.count;
        });
        return y;
    }

    async function fetchVods(y) {
        if (y in vods) {
            return;
        }
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/vods/?page_size=500&year=${y}`
        );
        const year = await response.json();
        vods[y] = year.results;
    }

    async function fetchEmotes(provider) {
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/emotes/?page_size=500&provider=${provider}`
        );
        const e = await response.json();
        return e;
    }

    function toHHMMSS(duration) {
        const sec_num = parseInt(duration, 10);
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - hours * 3600) / 60);
        let seconds = sec_num - hours * 3600 - minutes * 60;
        let h = hours < 10 ? '0' + hours : hours;
        let m = minutes < 10 ? '0' + minutes : minutes;
        let s = seconds < 10 ? '0' + seconds : seconds;
        return h + ':' + m + ':' + s;
    }
    async function showEmotesInTitle(title) {
        let emotes = (await fetchEmotes('ffz')).results;
        let newTitle = title;
        let emoteNames = [];
        let emoteLinks = [];

        Object.keys(emotes).map((key) => {
            emoteNames.push(emotes[key].name);
            emoteLinks.push(emotes[key].url);
        });

        for (let i = 0; i < emoteNames.length; i++) {
            let value = emoteNames[i];
            let imgHTML =
                '<img src="' +
                emoteLinks[i] +
                '" alt="' +
                value +
                '" loading="lazy" height="20" data-toggle="tooltip" title=' +
                value +
                '/>';
            newTitle = newTitle.replace(value, imgHTML);
        }

        return newTitle;
    }
</script>

<svelte:head>
    <meta property="og:title" content="Jahresansicht" />
    <meta property="og:url" content={$page.url} />
    <meta property="og:updated_time" content="Jahresansicht" />
    <meta name="twitter:title" content="Jahresansicht" />
    <title>Jahresansicht</title>
</svelte:head>

<div class="container">
    <h1 class="display-4 fw-bold pb-3">
        Jahresansicht
        <small class="text-muted">Gesamt: {vodCount}</small>
    </h1>
    <div class="accordion" id="accordionPanelsStayOpenExample">
        {#await fetchYears()}
            <p>Lade Jahre...</p>
        {:then years}
            {#each years as year}
                <div class="accordion-item" on:mouseenter={() => fetchVods(year.year)}>
                    <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                        <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapse-{year.year}"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapse-{year.year}"
                        >
                            <span class="fw-bold pe-1">{year.year}</span> ({year.count})
                        </button>
                    </h2>
                    <div
                        id="panelsStayOpen-collapse-{year.year}"
                        class="accordion-collapse collapse"
                        aria-labelledby="panelsStayOpen-headingOne"
                    >
                        <div class="accordion-body">
                            <div class="container">
                                {#if vods[year.year]}
                                    {#each vods[year.year] as vod}
                                        <div class="row py-2">
                                            <div class="col-md-auto">
                                                {format(parseISO(vod.date), 'dd.MM.yyyy - HH:mm')} Uhr
                                            </div>
                                            <div class="col order-first order-md-last fw-bold">
                                                <a href="/vods/watch/{vod.uuid}">
                                                    {#await showEmotesInTitle(vod.title)}
                                                        {vod.title}
                                                    {:then newTitle}
                                                        {@html newTitle}
                                                    {/await}
                                                </a>
                                            </div>
                                            <div class="col-md-auto order-sm-last">
                                                {toHHMMSS(vod.duration)} h
                                            </div>
                                        </div>
                                        <hr class="my-2 mx-0" />
                                    {:else}
                                        <div class="row py-2">
                                            <div class="col-md-auto">
                                                Keine Vods in {year.year}
                                            </div>
                                        </div>
                                    {/each}
                                {:else}
                                    <div class="row py-2">
                                        <div class="col-md-auto">Lade Vods...</div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        {/await}
    </div>
</div>

<style lang="scss">
    .accordion-item {
        border-color: var(--color-main);
        color: var(--color-main);
        background-color: var(--color-background);
    }

    .accordion-button {
        color: var(--color-main);
        background-color: var(--color-background);

        &:hover {
            background-color: var(--color-hover);
        }

        &:focus {
            color: inherit;
            box-shadow: none;
        }

        &:not(.collapsed) {
            color: var(--color-background);
            background-color: var(--color-main);
        }

        &::after {
            background-image: var(--accordion-button);
        }

        &:not(.collapsed)::after {
            background-image: var(--accordion-button);
            filter: invert(1);
        }
    }
</style>
