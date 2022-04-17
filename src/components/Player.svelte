<script>
    import { onMount, onDestroy } from 'svelte';

    import videojs from 'video.js';
    import 'video.js/dist/video-js.css';
    import 'videojs-seek-buttons';
    import 'videojs-seek-buttons/dist/videojs-seek-buttons.css';
    import 'videojs-thumbnail-sprite';

    export let obj;
    export let type;
    export let time;

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    let player;
    let watched = JSON.parse(localStorage.getItem('watched'));
    if (!watched) {
        watched = {
            vods: {},
            clips: {}
        };
    }
    let playerSettings = JSON.parse(localStorage.getItem('player'));
    if (!playerSettings) {
        playerSettings = {
            volume: 1,
            playbackRate: 1
        };
    }
    let src =
        type === 'vods'
            ? `${BASE_URL}/media/${type}/${obj.filename}-segments/${obj.filename}.m3u8`
            : `${BASE_URL}/media/${type}/${obj.clip_id}-segments/${obj.clip_id}.m3u8`;
    let poster =
        type === 'vods'
            ? `${BASE_URL}/media/${type}/${obj.filename}-lg.jpg`
            : `${BASE_URL}/media/${type}/${obj.clip_id}-lg.jpg`;
    let overlay;
    let overlayMsg = '';
    let timeout;

    onMount(() => {
        let options = {
            controlBar: {
                volumePanel: {
                    inline: false
                }
            },
            playbackRates: playbackRates
        };
        player = videojs('vod', options);
        player.src({
            src: src,
            type: 'application/x-mpegURL'
        });
        player.fluid(true);
        player.seekButtons({
            forward: 30,
            back: 10
        });
        let sprites = [];
        const sprites_horizontal = 6; // defined by default ffmpeg value for tile
        const sprites_vertical = 5; // defined by default ffmpeg value for tile
        const sprites_per_frame = sprites_horizontal * sprites_vertical;
        const interval = 20; // 1 frame each x seconds
        const duration = sprites_horizontal * sprites_vertical * interval;
        for (
            let index = 1;
            index <= Math.ceil(obj.duration / interval / sprites_per_frame);
            index++
        ) {
            const d = {
                url: `${BASE_URL}/media/${type}/${obj.filename}-sprites/${obj.filename}_${index
                    .toString()
                    .padStart(3, '0')}.webp`,
                start: index * duration - duration,
                duration: duration,
                interval: interval,
                width: 160,
                height: 90
            };
            sprites = [...sprites, d];
        }
        console.log(sprites);
        player.thumbnailSprite({
            sprites: sprites
        });
        // Safari has problems with bind:currentTime on the video element and running a function when the var changes. So we use the non svelte way.
        // https://github.com/sveltejs/svelte/issues/6002
        player.on('loadedmetadata', () => {
            player.volume(playerSettings.volume);
            player.muted(playerSettings?.muted);
            player.playbackRate(playerSettings.playbackRate);
            if (time > 0 && time <= obj.duration) {
                player.currentTime(time);
            } else if (watched[type][obj.uuid]) {
                player.currentTime(watched[type][obj.uuid]);
            }
        });
        player.on('timeupdate', () => {
            updateWatched();
        });
        player.on('volumechange', () => {
            updatePlayerSettings();
        });
        player.on('ratechange', () => {
            updatePlayerSettings();
        });
        player.play();

        document.onkeydown = (e) => {
            let searchActive = document.getElementById('searchInput') == document.activeElement;
            if (searchActive) {
                return;
            } else if (e.key === 'f') {
                if (player.isFullscreen()) {
                    player.exitFullscreen();
                } else {
                    player.requestFullscreen();
                }
                return false;
            } else if (e.key === ' ') {
                if (player.paused()) {
                    player.play();
                    showOverlay('Play');
                } else {
                    player.pause();
                    showOverlay('Pause');
                }
                return false;
            } else if (e.key === 'ArrowRight') {
                player.currentTime(player.currentTime() + 30);
                showOverlay('+30 Sekunden');
                return false;
            } else if (e.key === 'ArrowLeft') {
                player.currentTime(player.currentTime() - 10);
                showOverlay('-10 Sekunden');
                return false;
            } else if (e.key === 'ArrowUp') {
                player.volume(player.volume() + 0.05);
                showOverlay(`Lautstärke ${Math.round(player.volume() * 100)}%`);
                return false;
            } else if (e.key === 'ArrowDown') {
                player.volume(player.volume() - 0.05);
                showOverlay(`Lautstärke ${Math.round(player.volume() * 100)}%`);
                return false;
            } else if (e.key === 'm') {
                if (player.muted()) {
                    player.muted(false);
                    showOverlay('Laut');
                } else {
                    player.muted(true);
                    showOverlay('Stumm');
                }
                return false;
            } else if (e.key === ',') {
                let rateIndex = playbackRates.indexOf(player.playbackRate());
                if (rateIndex - 1 >= 0 && rateIndex - 1 <= playbackRates.length - 1) {
                    player.playbackRate(playbackRates[rateIndex - 1]);
                    showOverlay(`Geschwindigkeit ${playbackRates[rateIndex - 1]}x`);
                }
                return false;
            } else if (e.key === '.') {
                let rateIndex = playbackRates.indexOf(player.playbackRate());
                if (rateIndex + 1 >= 0 && rateIndex + 1 <= playbackRates.length - 1) {
                    player.playbackRate(playbackRates[rateIndex + 1]);
                    showOverlay(`Geschwindigkeit ${playbackRates[rateIndex + 1]}x`);
                }
                return false;
            }
        };
    });

    onDestroy(() => {
        player.dispose();
    });

    function updateWatched() {
        if (watched[type][obj.uuid] === undefined) {
            watched[type][obj.uuid] = 0;
            localStorage.setItem('watched', JSON.stringify(watched));
        } else if (Math.floor(player.currentTime()) != Math.floor(watched[type][obj.uuid])) {
            time = Math.round(player.currentTime());
            watched[type][obj.uuid] = time;
            localStorage.setItem('watched', JSON.stringify(watched));
        }
    }

    function updatePlayerSettings() {
        playerSettings.volume = player.volume();
        playerSettings.muted = player.muted();
        playerSettings.playbackRate = player.playbackRate();
        localStorage.setItem('player', JSON.stringify(playerSettings));
    }

    function showOverlay(msg) {
        if (timeout) {
            clearTimeout(timeout);
        }
        overlayMsg = msg;
        overlay.classList.add('vis');
        timeout = setTimeout(() => {
            overlay.classList.remove('vis');
        }, 1000);
    }
</script>

<div>
    <div
        id="overlay"
        class="position-fixed d-flex align-items-center justify-content-center pe-none"
        bind:this={overlay}
    >
        <div class="msg px-3 py-2 rounded">
            {overlayMsg}
        </div>
    </div>
    <video
        id="vod"
        class="video-js vjs-big-play-centered"
        controls
        preload="none"
        width="100%"
        height="100%"
        {poster}
    >
        <p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a web browser
            that
            <a href="https://videojs.com/html5-video-support/" target="_blank"
                >supports HTML5 video</a
            >
        </p>
        <track kind="captions" />
    </video>
</div>

<style lang="scss">
    #overlay {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1030;
        opacity: 0;
        transition: 0.3s;

        &:global(.vis) {
            opacity: 0.9;
        }
    }
</style>
