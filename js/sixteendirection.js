var SIXTEENDIRECTION = (function() {

var vis = d3.select('#sixteendirection');

var canvasWidth = 130;
var canvasHeight = 130;
var MARGINS = {top: 1, right: 1, bottom: 1, left: 1};

plotWidth = canvasWidth - MARGINS.left - MARGINS.right,
plotHeight = canvasHeight - MARGINS.top - MARGINS.bottom;

var xRange = d3.scale.linear().range([MARGINS.left, plotWidth]);
var yRange = d3.scale.linear().range([plotHeight, MARGINS.top]);

xRange.domain([-1, 1]);
yRange.domain([-1, 1]);

vis.append("circle")
  .attr("cx", xRange(0))
  .attr("cy", yRange(0))
  .attr("r", 10)
  .attr("fill", "#ccc")
  .attr("stroke", "none");


vis.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 5)
    .attr("refY", 2)
    .attr("markerWidth", 7)
    .attr("markerHeight", 7)
    .attr("orient", "auto")
    .attr("fill", "#ccc")
    .append("path")
        .attr("d", "M 0,0 V 4 L6,2 Z");


for (var i = 0; i <= 360; i += 22.5)
{
  var transform = "translate(" + xRange(0) + "," + yRange(0) + ") " + "rotate(" + i + ")"
   

  vis.append("line")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", 0)
  .attr("y2", -60)
  .attr("stroke-width", 1.5)
  .attr("stroke", "#ccc")
  .attr("marker-end", "url(#arrowhead)")
  .attr("transform", transform);
}




function update()
{
}

update();

}) ();



