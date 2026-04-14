// found from https://www.chartjs.org/docs/latest/samples/other-charts/radar.html 
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip
);

export default function RadarChart({ song }) {
    const safe = (v) => v ?? 0;
    console.log(song);
    const data = {
        labels: ['Energy', 'Danceability', 'Valence', 'Acousticness', 'Speechiness', 'Liveness'],
        datasets: [
            {
                data: [
                    safe(song.energy),
                    safe(song.danceability),
                    safe(song.valence),
                    safe(song.acousticness),
                    safe(song.speechiness),
                    safe(song.liveness)
                ],
                backgroundColor: 'rgba(142, 68, 173, 0.2)',
                borderColor: '#8e44ad'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                min: 0,
                max: 100,   
                ticks: {
                    stepSize: 20
                }
            }
        }
    };

    return <Radar data={data} options={options} />;
}