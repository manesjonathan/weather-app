const canvas = document.querySelector(".chart-canvas")
const context = canvas.getContext("2d");

export function drawChart(datalist) {
    Chart.defaults.global.defaultFontColor = '#fff';

    let options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {
            x: {
                ticks: {
                    color: "red"
                }
            },
            y: {
                ticks: {
                    color: "green"
                }
            },
            xAxes: [{
                gridLines: {
                    display: false,
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false,
                }
            }]
        }
    }
    new Chart(context, {
        type: "line",
        data: {
            labels: datalist.map(data => data[0]),
            datasets: [
                {
                    label: "Average temperature",
                    data: datalist.map(data => data[1].average),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.50,
                    borderWidth: 3
                }
            ],
        },
        options: options,

    });
}