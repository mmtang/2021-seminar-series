const sets = [ 
    {sets: ['Data science'], size: 14},
    {sets: ['Web development'], size: 14},
    {sets: ['Data science','Web development'], size: 2}
];

// initialilze
const chart = venn.VennDiagram()
    .width(900)
    .height(450);
const div = d3.select('#venn');
div.datum(sets).call(chart);

const colors = ['#4687b0', '#7dbb96'];

// apply styles
d3.selectAll("#venn .venn-circle path")
    .style("fill-opacity", 0.5)
    .style("fill", (d,i) => {
        return colors[i];
    });
d3.selectAll('#venn text')
    .style('fill', 'white')
    .style('font-size', '0.8em');
d3.selectAll('#venn .venn-intersection')
    .style('fill', '#d1eef1')
    .style('fill-opacity', 0.2);

const tooltip = d3.select('body').append('div')
    .attr('class', 'vennTooltip');

d3.selectAll('#venn .venn-circle')
    .on('mouseenter', function () {
        const node = d3.select(this).transition();
        node.select('path').style('fill-opacity', 0.8);
    })
    .on('mouseleave', function () {
        const node = d3.select(this).transition();
        node.select('path').style('fill-opacity', 0.5);
    });


d3.selectAll('#venn .venn-intersection')
.on('mouseenter', function () {
        const node = d3.select(this).transition();
        node.select('path').style('fill', '#d1eef1')
        node.select('path').style('fill-opacity', 0.5)
        /*
        // Display a tooltip with the current size
        tooltip.transition().duration(100).style("opacity", 0.9);
        tooltip.html('<p class="tooltip-title">Data visualization&nbsp;&nbsp;&&nbsp;&nbspUser interfaces</p><img class="tooltipImage" src="./assets/d3_hex.png">');
        */
    })
    .on('mouseout', function () {
        //tooltip.transition().duration(100).style("opacity", 0);
        const node = d3.select(this).transition();
        node.select('path').style('fill-opacity', 0.2);
    });
