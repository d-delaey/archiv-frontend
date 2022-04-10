<script>
    import { formatBytes } from '../functions.svelte';
    import StatsBox from '../components/StatsBox.svelte';
    import ChartBar from '../components/ChartBar.svelte';
    import ChartDoughnut from '../components/ChartDoughnut.svelte';
    import ChartLine from '../components/ChartLine.svelte';

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    async function fetchStats() {
        const response = await fetch(`${BASE_URL}/api/stats`);
        const s = await response.json();
        return s;
    }
</script>

<main class="flex-shrink-0">
    <div class="container mb-4">
        <h1 class="display-4 fw-bolder pb-3">Statistiken</h1>
        {#await fetchStats() then stats}
            <section>
                <div class="row">
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Vods"
                            count={stats.count_vods_total}
                            trend={stats.trend_vods}
                            color="1"
                        />
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Clips"
                            count={stats.count_clips_total}
                            trend={stats.trend_clips}
                            color="2"
                        />
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Stunden gestreamt"
                            count={stats.count_h_streamed}
                            trend={stats.trend_h_streamed}
                            color="3"
                        />
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Archivgröße"
                            count={formatBytes(stats.count_size_bytes)}
                            trend={false}
                            color="4"
                        />
                    </div>
                </div>
            </section>
            <section>
                <div class="row">
                    <div class="col-md-8 py-3">
                        <h3 class="display-6 py-3">
                            <strong>Vods pro Monat</strong>
                        </h3>
                        <ChartBar data={stats.vods_per_month} />
                    </div>
                    <div class="col-md-4 py-3">
                        <h3 class="display-6 py-3">
                            <strong>Vods pro Wochentag</strong>
                        </h3>
                        <ChartDoughnut data={stats.vods_per_weekday} />
                    </div>
                </div>
                <div class="row">
                    <div class="col p-3">
                        <h3 class="display-6 py-3">
                            <strong>Streambeginn nach Uhrzeit</strong>
                        </h3>
                        <ChartLine data={stats.start_by_time} />
                    </div>
                </div>
            </section>
            <section>
                <h3 class="display-6 py-3">
                    <strong>Clips pro User</strong>
                </h3>
                <div class="row">
                    <div class="col-md-6">
                        <table class="table">
                            <thead>
                                <th>Name</th>
                                <th>Erstellte Clips</th>
                            </thead>
                            <tbody>
                                <!-- {% for user in most_clips_per_user %}
                                <tr>
                                    <td>{{ user.creator__name }}</td>
                                    <td>{{ user.amount|intcomma }}</td>
                                </tr>
                                {% endfor %} -->
                            </tbody>
                        </table>
                    </div>
                    <div class="col-md-6">
                        <table class="table">
                            <thead>
                                <th>Name</th>
                                <th>Views gesamt</th>
                            </thead>
                            <tbody>
                                <!-- {% for user in most_views_per_user %}
                                <tr>
                                    <td>{{ user.creator__name }}</td>
                                    <td>{{ user.amount|intcomma }}</td>
                                </tr>
                                {% endfor %} -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <section>
                <h3 class="display-6 py-3">
                    <strong>Emotes</strong>
                    <!-- <small>({{ emote_count }})</small> -->
                </h3>
                <h4 class="h4">
                    Twitch
                    <!-- <small>({{ all_twitch_emotes|length }})</small> -->
                </h4>
                <div class="row">
                    <!-- {% for emote in all_twitch_emotes %}
                        <div class="col-auto p-1">
                            <img src="{{ emote.url }}" alt="{{ emote.name }}" loading="lazy" height="60" data-toggle="tooltip" title="{{ emote.name }}">
                        </div>
                    {% endfor %} -->
                </div>
                <h4 class="h4 pt-4">
                    BetterTTV
                    <!-- <small>({{ all_bttv_emotes|length }})</small> -->
                </h4>
                <div class="row">
                    <!-- {% for emote in all_bttv_emotes %}
                        <div class="col-auto p-1">
                            <img src="{{ emote.url }}" alt="{{ emote.name }}" loading="lazy" height="60" data-toggle="tooltip" title="{{ emote.name }}">
                        </div>
                    {% endfor %} -->
                </div>
                <h4 class="h4 pt-4">
                    FrankerFaceZ
                    <!-- <small>({{ all_ffz_emotes|length }})</small> -->
                </h4>
                <div class="row">
                    <!-- {% for emote in all_ffz_emotes %}
                        <div class="col-auto p-1">
                            <img src="{{ emote.url }}" alt="{{ emote.name }}" loading="lazy" height="60" data-toggle="tooltip" title="{{ emote.name }}">
                        </div>
                    {% endfor %} -->
                </div>
            </section>
        {/await}
    </div>
</main>
