d3.csv('./data/SafeToSwim_Download.csv').then(data => {
    const unit = data[0].Unit;
    const seriesData = data.map(d => {
        return { 
            x: parseDate(d.SampleDate), 
            y: +d.OriginalResult 
        };
    });
    const sorted = seriesData.sort((a, b) => b.SampleDate - a.SampleDate);
    drawHGraph(sorted, unit);
});

drawHGraph = (data, unit) => {
    Highcharts.setOptions({
        lang: {
          thousandsSep: ','
        }
      });

    Highcharts.chart('highcharts', {
        chart: {
            zoomType: 'x',
            width: 700,
            height: 250,
            backgroundColor: 'transparent',
            animation: false
        },
        title: {
            text: ''
        },
        xAxis: { 
            type: 'datetime',
            gridLineColor: '#fff',
            labels: {
                style: {
                    color: '#fff',
                    fontSize: '14px'
                }
            },
            title: {
                enabled: false
            }
        },
        yAxis: { 
            type: 'linear', 
            lineColor: '#fff',
            lineWidth: 1,
            gridLineColor: 'transparent',
            tickLength: 10,
            tickWidth: 1,
            labels: {
                style: {
                    color: '#fff',
                    fontSize: '14px'
                },
                format: '{value::,.0f}'
            },
            title: {
                enabled: false
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                marker: {
                    radius: 6
                }
            }
        },
        series: [{
            type: 'scatter',
            data: data,
            stickyTracking: true,
            color: '#FFC0CB'
        }],
        tooltip: {
            formatter: function() {
                return  '<b>' + Highcharts.dateFormat('%b %e, %Y', new Date(this.x)) +'</b><br/>' + this.y + ' ' + unit;
            }
        },
        credits: {
            enabled: false
        }
    });
}
