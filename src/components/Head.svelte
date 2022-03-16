<script>
    export let last_vod_sync
</script>

<svelte:head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">
    <meta name="description" content="Twtich VOD Archiv von m4xFPS/wubbl0rz">
    <meta property="og:locale" content="de_DE">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Wubbl0rz Archiv">
    <meta property="og:site_name" content="Wubbl0rz Archiv">
    <meta property="og:description" content="Twtich VOD Archiv von m4xFPS/wubbl0rz">
    <meta property="og:url" content="{window.location.href}">
    <meta property="og:updated_time" content={last_vod_sync}>
    <meta property="og:image" content="/img/og.jpg">
    <meta property="og:image:url" content="/img/og.jpg">
    <meta property="og:image:secure_url" content="/img/og.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Wubbl0rz Archiv">
    <meta name="twitter:title" content="Wubbl0rz Archiv ">
    <meta name="twitter:description" content="Twtich VOD Archiv von m4xFPS/wubbl0rz">
    <meta name="twitter:image" content="/img/og.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image:alt" content="Wubbl0rz Archiv">
    <title>Wubbl0rz Archiv</title>
    <script data-cfasync="false">
        // Set color mode before anyting else, to prevent flashing screen
        if (localStorage.getItem("dark-mode") == "true") {
            document.documentElement.classList.add("dark-mode");
            let currentModeState = true;
        }
    </script>
    <link rel="shortcut icon" type="image/png" href="/img/wubPog.png" />
</svelte:head>
