const parseDate = d3.timeParse('%Y-%m-%d');

d3.csv('./data/SafeToSwim_Download.csv').then(data => {
    data.forEach(res => {
        res.Result = +res.OriginalResult;
        res.SampleDate = parseDate(res.SampleDate);
    });
    drawGraph(data);
});

drawGraph = (data) => {
    const margin = { top: 20, right: 10, bottom: 40, left: 50 };
    const options = {
        width: 700 - margin.left - margin.right,
        height: 280 - margin.top - margin.bottom,
        data: data
    };

    // Initialize chart
    const svg = d3.select('#d3-chart').append('svg')
        .attr('id', 'graph')
        .attr('width', options.width + margin.left + margin.right)
        .attr('height', options.height + margin.top + margin.bottom);
    const focus = svg.append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(' + margin.left + ', ' + (margin.top) + ')');
    
    // Initialize tooltip
    d3.select('body').append('div')
        .attr('id', 'tooltipPoint')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Clip path to width of chart element
    svg.append('defs').append('clipPath')
        .attr('id', 'clip')
        .append('rect')
            .attr('width', options.width)
            .attr('height', options.height);

    // Create scales
    const xExtent = d3.extent(options.data, (d,i) => d.SampleDate);
    var yMax = d3.max(options.data, d => d.Result); 
    var yBuffered = Math.ceil(yMax + (yMax / 10));
    const xScale = d3.scaleTime()
        .domain(xExtent)
        .range([0, options.width]);
    const yScale = d3.scaleLinear()
        .domain([0, yBuffered])
        .range([options.height, 0]);

    // Add axes
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5);
    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5);
    focus.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + options.height + ')')
        .style('font-size', '14px')
        .attr('color', '#fff')
        .call(xAxis);
    focus.append('g')
        .attr('class', 'y-axis')
        .style('font-size', '14px')
        .attr('color', '#fff')
        .call(yAxis);

    // Draw points
    var points = focus.append('g')
        .attr('clip-path', 'url(#clip)');
    points.selectAll('.circle')
        .data(options.data)
        .enter().append('circle')
        .attr('class', 'circle')
        .attr('r', 4)
        .attr('cx', d => xScale(d.SampleDate))
        .attr('cy', d => yScale(d.Result))
        .attr('fill', '#FFC0CB')
        .style('opacity', 0.9)
        .on('mouseover', (event, d) => {
            // Change style
            d3.select(event.currentTarget).style('fill', '#fff');
            d3.select(event.currentTarget).attr('r', 8);
            // Show tooltip
            d3.select('#tooltipPoint') 
                .transition()
                .duration(50)
                .style('opacity', 1);
            d3.select('#tooltipPoint')
                .html(() => {
                    const tooltipDate = d3.timeFormat('%b %e, %Y');
                    return '<strong>' + tooltipDate(d.SampleDate) + '</strong><br>' + d['CalculatedResult'].toString() + ' ' + d.Unit;
                })
                .style('left', () => positionTooltipX(event))
                .style('top', () => positionTooltipY(event))
                .style('border-color', '#FFC0CB');
        })
        .on('mouseout', () => {
            d3.select(event.currentTarget).style('fill', '#FFC0CB');
            d3.select(event.currentTarget).attr('r', 4);
            // Hide tooltip
            d3.select('#tooltipPoint') 
                .transition()
                .duration(200)
                .style('opacity', 0);
        })
    points.exit()
        .remove();
}

const positionTooltipX = (e) => {
    var eventPos = e.pageX; // get mouse position
    var divExtent = document.getElementById('d3-chart').offsetWidth; // get width of container holding chart
    var divOffset = document.getElementById('d3-chart').offsetLeft; // get offset of chart container from left (parent container)
    var tooltipExtent = document.getElementById('tooltipPoint').offsetWidth; // get tooltip div width
    // calculate element position within container
    var relativePos = eventPos - divOffset; 
    if (relativePos <= (divExtent / 2)) {
        // if event is in the left half of chart
        return eventPos + 'px';
    } else {
        // if event is in the right half of chart
        return eventPos - tooltipExtent + 'px';
    }
}

const positionTooltipY = (e) => {
    var eventPos = e.pageY; // get mouse position
    var divExtent = document.getElementById('d3-chart').offsetHeight; // get height of container holding chart
    var divOffset = document.getElementById('d3-chart').offsetTop; // get offset of chart container from left (parent container)
    var tooltipExtent = document.getElementById('tooltipPoint').offsetHeight; // get tooltip div height
    // calculate element position within container
    var relativePos = eventPos - divOffset; 
    if (relativePos <= (divExtent / 2)) {
        // if event is in the top half of chart
        return eventPos + 'px';
    } else {
        // if event is in the bottom half of chart
        return eventPos - tooltipExtent + 'px';
    }
}

