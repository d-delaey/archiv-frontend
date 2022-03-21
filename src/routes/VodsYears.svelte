<script>
    // routes
    import { Link } from "svelte-routing";

    // dayjs
    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";
    import "dayjs/locale/de";
    dayjs.extend(relativeTime);
    dayjs.locale("de");

    let vodCount = 0;
    let vods = {};

    async function fetchYears() {
        const response = await fetch("ENV_BASE_URL/api/years/");
        const y = await response.json();
        y.forEach(element => {
            vodCount += element.count;
        });
        return y
    }

    async function fetchVods(y) {
        if (y in vods) {
            return
        }
        const response = await fetch(`ENV_BASE_URL/api/vods/?page_size=500&year=${y}`);
        const year = await response.json();
        vods[y] = year.results;
    }

     function toHHMMSS(duration) {
        const sec_num = parseInt(duration, 10);
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }
</script>

<div class="container">
    <h1 class="display-3 fw-bold pb-3">
        Jahresansicht
        <small class="text-muted">Gesamt: {vodCount}</small>
    </h1>
    <div class="accordion" id="accordionPanelsStayOpenExample">
        {#await fetchYears()}
            <p>Lade Jahre...</p>
        {:then years}
            {#each years as year}
                <div class="accordion-item" on:click={() => fetchVods(year.year)}>
                    <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target='#panelsStayOpen-collapse-{year.year}' aria-expanded="true"
                            aria-controls='panelsStayOpen-collapse-{year.year}'>
                            <span class="fw-bold pe-1">{year.year}</span> ({year.count})
                        </button>
                    </h2>
                    <div id='panelsStayOpen-collapse-{year.year}' class="accordion-collapse collapse"
                        aria-labelledby="panelsStayOpen-headingOne">
                        <div class="accordion-body">
                            <div class="container">
                                {#if vods[year.year]}
                                    {#each vods[year.year] as vod}
                                        <div class="row py-2">
                                            <div class="col-md-auto">
                                                {dayjs(vod.date).format("DD.MM.YYYY")} - {dayjs(vod.date).format("HH:mm")} Uhr
                                            </div>
                                            <div class="col order-first order-md-last fw-bold">
                                                <Link to="/vods/watch/{vod.uuid}" class="emote-title">
                                                    {vod.title}
                                                </Link>
                                            </div>
                                            <div class="col-md-auto order-sm-last">
                                                {toHHMMSS(vod.duration)} h
                                            </div>
                                        </div>
                                        <hr class="my-2 mx-0">
                                    {:else}
                                        <div class="row py-2">
                                            <div class="col-md-auto">
                                                Keine Vods in {year.year}
                                            </div>
                                        </div>
                                    {/each}
                                {:else}
                                    <div class="row py-2">
                                        <div class="col-md-auto">
                                            Lade Vods...
                                        </div>
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
