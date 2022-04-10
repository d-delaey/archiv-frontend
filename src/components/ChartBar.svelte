<script>
    import { onMount } from 'svelte';
    import {
        Chart,
        Legend,
        Tooltip,
        BarElement,
        BarController,
        CategoryScale,
        LinearScale
    } from 'chart.js';
    import { chartColors } from './ChartColors.svelte';
    import { theme } from '../stores';

    Chart.register(Legend, Tooltip, BarElement, BarController, CategoryScale, LinearScale);

    export let data;

    let chartCanvas;
    let chart;
    let colors = chartColors.themes[$theme];
    const chartValues = Array.from([...data.map((x) => x.count)]);
    const chartLabels = Array.from([...data.map((x) => x.month)]);

    theme.subscribe((newTheme) => {
        if (chart) {
            colors = chartColors.themes[newTheme];
            chart.options.scales = {
                y: {
                    ticks: {
                        color: colors?.ticks
                    },
                    grid: {
                        color: colors?.grid
                    }
                },
                x: {
                    ticks: {
                        color: colors?.ticks
                    },
                    grid: {
                        color: colors?.grid
                    }
                }
            };
            chart.update();
        }
    });

    onMount(async () => {
        let ctx = chartCanvas.getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [
                    {
                        backgroundColor: chartColors.backgroundColors,
                        data: chartValues
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: colors?.ticks
                        },
                        grid: {
                            color: colors?.grid
                        }
                    },
                    x: {
                        ticks: {
                            color: colors?.ticks
                        },
                        grid: {
                            color: colors?.grid
                        }
                    }
                }
            }
        });
    });
</script>

<canvas bind:this={chartCanvas} />
