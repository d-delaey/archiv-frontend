<script>
    import { onMount } from 'svelte';
    import {
        Chart,
        Legend,
        Tooltip,
        LineElement,
        PointElement,
        LineController,
        CategoryScale,
        LinearScale
    } from 'chart.js';
    import { chartColors } from './ChartColors.svelte';
    import { theme } from '../stores';

    Chart.register(
        Legend,
        Tooltip,
        LineElement,
        PointElement,
        LineController,
        CategoryScale,
        LinearScale
    );

    export let data;

    let chartCanvas;
    let chart;
    let colors = chartColors.themes[$theme];
    const chartValues = Array.from([...data.map((x) => x.count)]);
    const chartLabels = Array.from([...data.map((x) => x.hour)]);

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
                    title: {
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
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [
                    {
                        data: chartValues,
                        borderColor: '#F28E2B',
                        tension: 0.4
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                interaction: {
                    intersect: false
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
                        title: {
                            display: true,
                            text: 'Uhrzeit',
                            color: colors?.ticks,
                            font: {
                                size: 16
                            }
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

<style lang="scss">
    canvas {
        max-height: 300px;
    }
</style>
