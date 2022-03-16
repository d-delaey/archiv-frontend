<script>
    import VideoThumbnail from "./VideoThumbnail.svelte";
    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";
    import "dayjs/locale/de";
    dayjs.extend(relativeTime);
    dayjs.locale("de");

    export let vods;

</script>

<div class="row">
    {#each vods.results as vod}
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2 mb-2">
            <div class="card card-rounded h-100">
                <div class="position-relative">
                    <VideoThumbnail type="vods" filename={vod.filename} title={vod.title} uuid={vod.uuid} duration={vod.duration} />
                </div>
                <div class="card-body">
                    <a href="/vods/watch/{vod.uuid}">
                        <p class="h5 m-0 emote-title">
                            {#if vod.emote_title}
                                {vod.emote_title}
                            {:else}
                                {vod.title}
                            {/if}
                        </p>
                    </a>
                    <p class="card-text text-muted">
                        {dayjs(vod.date).fromNow()}, {dayjs(vod.date).format("HH:mm")} Uhr
                    </p>
                </div>
            </div>
        </div>
    {:else}
        <div class="col">
            <img src="/img/modcheck.gif" alt="modcheck">
        </div>
    {/each}
</div>
