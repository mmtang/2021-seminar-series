const parseDate = d3.timeParse('%Y-%m-%d');

d3.csv('./data/SafeToSwim_Download.csv').then(data => {
    data.forEach(res => {
        res.Result = +res.OriginalResult;
        res.SampleDate = parseDate(res.SampleDate);
    });
    drawGraph(data);
});

drawGraph = (data) => {
    const margin = { top: 10, right: 30, bottom: 100, left: 45 };
    const options = {
        width: 640 - margin.top - margin.bottom,
        height: 320 - margin.left - margin.right,
        data: data
    };

    // Initialize chart
    const svg = d3.select('#d3-chart').append('svg')
        .attr('id', 'graph')
        .attr('width', options.width + margin.top + margin.bottom)
        .attr('height', options.height + margin.left + margin.right);
    const focus = svg.append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(' + margin.left + ', ' + (margin.top) + ')');

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
        .attr('r', 6)
        .attr('cx', d => xScale(d.SampleDate))
        .attr('cy', d => yScale(d.Result))
        .attr('fill', 'pink')
        .style('opacity', 0.8)
    points.exit()
        .remove();

}