<script>
    import VideoThumbnail from "./VideoThumbnail.svelte";
    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";
    import "dayjs/locale/de";
    dayjs.extend(relativeTime);
    dayjs.locale("de");

    export let clips;

</script>

<div class="row">
    {#each clips.results as clip ,i}
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2 mb-2">
            <div class="card card-rounded h-100">
                <div class="position-relative">
                    <VideoThumbnail type="clips" filename={clip.clip_id} title={clip.title} uuid={clip.uuid} duration={clip.duration} loading={i>7 ? "lazy" : "auto"} />
                </div>
                <div class="card-body">
                    <a href="/clips/watch/{clip.uuid}">
                        <p class="h5 m-0 emote-title">
                            {#if clip.emote_title}
                                {clip.emote_title}
                            {:else}
                                {clip.title}
                            {/if}
                        </p>
                    </a>
                    <p class="card-text text-muted">
                        {dayjs(clip.date).fromNow()}<br>
                        {clip.view_count} Views - {clip.creator}
                    </p>
                </div>
            </div>
        </div>
    {:else}
        <div class="col">
            <img src="/img/modcheck.gif" alt="modcheck" width="110" height="110">
        </div>
    {/each}
</div>
