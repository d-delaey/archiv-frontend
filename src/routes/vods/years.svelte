<script>
	import { format, parseISO } from 'date-fns';

    let vodCount = 0;
    let vods = {};

    async function fetchYears() {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/years/`);
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
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/vods/?page_size=500&year=${y}`);
        const year = await response.json();
        vods[y] = year.results;
    }

     function toHHMMSS(duration) {
        const sec_num = parseInt(duration, 10);
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);
        let h = hours<10 ? "0"+hours : hours;
        let m = minutes<10 ? "0"+minutes : minutes;
        let s = seconds<10 ? "0"+seconds : seconds;
        return h+':'+m+':'+s;
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
                                                {format(parseISO(vod.date), "dd.MM.yyyy - HH:mm")} Uhr
                                            </div>
                                            <div class="col order-first order-md-last fw-bold">
                                                <a href="/vods/watch/{vod.uuid}" class="emote-title">
                                                    {vod.title}
                                                </a>
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
