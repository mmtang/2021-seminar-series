Highcharts.chart('highcharts', {
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    data: {
        csvURL: './data/SafeToSwim_Download_1616466659442.csv'
    },
    xAxis: { 
        type: 'datetime',
        title: {
            enabled: false
        }
    },
    yAxis: { 
        type: 'linear', 
        title: {
            text: unit
        } 
    },
}




const options = {
    title: {
    text: ''
    },
    chart: {
        animation: false,
        spacing: [25, 25, 15, 15],
        type: 'scatter'
    },
    credits: {
        enabled: false
    },
    xAxis: { 
        type: 'datetime',
        title: {
            enabled: false
        }
    },
    yAxis: { 
        type: 'linear', 
        title: {
            text: unit
        } 
    },
    series: {
        data: data.values.map((d) => ({ x: d.SampleDate, y: +d.Result.toFixed(2) })),
        color: '#333333',
        stickyTracking: false
    },
    legend: {
        enabled: false
    },
    tooltip: {
        formatter: function() {
            return  '<b>' + Highcharts.dateFormat('%b %e, %Y', new Date(this.x)) +'</b><br/>' + this.y + ' ' + unit;
        }
    }
};