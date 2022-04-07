<script>
    import { page } from '$app/stores';

    export let updated_time;
</script>

<svelte:head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="description" content="Twtich VOD Archiv von m4xFPS/wubbl0rz" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Wubbl0rz Archiv" />
    <meta property="og:site_name" content="Wubbl0rz Archiv" />
    <meta property="og:description" content="Twtich VOD Archiv von m4xFPS/wubbl0rz" />
    <meta property="og:url" content={$page.url} />
    <meta property="og:updated_time" content={updated_time} />
    <meta property="og:image" content="/img/og.jpg" />
    <meta property="og:image:url" content="/img/og.jpg" />
    <meta property="og:image:secure_url" content="/img/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Wubbl0rz Archiv" />
    <meta name="twitter:title" content="Wubbl0rz Archiv " />
    <meta name="twitter:description" content="Twtich VOD Archiv von m4xFPS/wubbl0rz" />
    <meta name="twitter:image" content="/img/og.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image:alt" content="Wubbl0rz Archiv" />
    <title>Wubbl0rz Archiv</title>
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    <!-- Prevent flashing theme -->
    <script data-cfasync="false">
        if (document) {
            let theme = localStorage.getItem('theme');
            console.log(theme);
            if (theme) {
                document.documentElement.setAttribute('data-theme', theme);
            } else {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            }
        }
    </script>
</svelte:head>
