var JAGGIES = (function() {

var vis = d3.select('#jaggies');

var canvasWidth = 700;
var canvasHeight = 140;
var MARGINS = {top: 10, right: 10, bottom: 10, left: 10};

plotWidth = canvasWidth - MARGINS.left - MARGINS.right,
plotHeight = canvasHeight - MARGINS.top - MARGINS.bottom;

var xRange = d3.scale.linear().range([MARGINS.left, plotWidth]);
var yRange = d3.scale.linear().range([plotHeight, MARGINS.top]);

xRange.domain([0, 3]);
yRange.domain([0, 0.5]);


var xAxis = d3.svg.axis()
  .scale(xRange)
  .tickSize(0, 0)
  //.tickValues([0, 1, 2, 3, 4, 5, 6])
  ;

var yAxis = d3.svg.axis()
  .scale(yRange)
  .tickSize(0, 0)
  .tickValues([0.1, .2, .3, .4, .5])
  .tickFormat(d3.format(',.1f'))
  .orient('left');

var gridAxisX = d3.svg.axis()
  .scale(xRange)
  .tickSize(-plotHeight, 0)
  .tickValues([0, 1, 2, 3, 4, 5, 6])
  .orient('bottom')
  .tickFormat("");

var gridAxisY = d3.svg.axis()
  .scale(yRange)
  .tickSize(-plotWidth, 0)
  .tickValues([.5])
  .orient('left')
  .tickFormat("");

vis.append('svg:g')
  .attr('class', 'axis')
  .attr('transform', 'translate(0,' + (plotHeight) + ')')
  .style("opacity", 0.3)
  .call(xAxis);

vis.append('svg:g')
  .attr('class', 'axis')
  .attr('transform', 'translate(' + xRange(0) + ',0)')
  .style("opacity", 0.3)
  .call(yAxis);

var connect_the_dots = d3.svg.line()
  .x(function(d) { return xRange(d.x); })
  .y(function(d) { return yRange(d.y); })
  .interpolate("linear");


var strokeButton = d3.select('#jaggies_wrapper').insert("button", ":first-child")
  .text("Draw")
  .style("position", "absolute")
  .style("top", 0)
  .style("left", 580)
  .style("height", 25)
  .on("click", function () { handleStroke(); });

var snapButton = d3.select('#jaggies_wrapper').insert("button", ":first-child")
  .text("Snap")
  .style("position", "absolute")
  .style("top", 0)
  .style("left", 638)
  .style("height", 25)
  .on("click", function () { quantize(); });

var xx = 0.0;

while (xx < 3.1)
{
  vis.append("line")
  .style("stroke", "#eee")
  .attr("x1", xRange(xx) + 0.5)
  .attr("y1", yRange(0.5) + 0.5)
  .attr("x2", xRange(xx) + 0.5)
  .attr("y2", yRange(0) + 0.5);
  xx += 0.1;
}

var yy = 0.0;

while (yy < 0.51)
{
  vis.append("line")
  .style("stroke", "#eee")
  .attr("x1", xRange(0) + 0.5)
  .attr("y1", yRange(yy) + 0.5)
  .attr("x2", xRange(3) + 0.5)
  .attr("y2", yRange(yy) + 0.5);
  yy += 0.1;
}

var raw_path = vis.append("path")
  .attr("stroke", "lightgrey")
  .attr("stroke-width", 1.5)
  .attr("fill", "none");

var jaggy_path = vis.append("path")
  .attr("stroke", "lightgrey")
  .attr("stroke-width", 1.5)
  .attr("fill", "none");

var raw_data = [];
var jaggy_data = [];

var i = 0;
var pause = 0;

function handleStroke()
{
  if (phase != "pre") { return; }
  phase = "running";
  updateButtons();
  reset();
  d3.timer(addpoint, 0);
}

function addpoint()
{
  pause++;
  if (pause < 2)
  {
    return;
  }
  if (i > 25)
  {
    phase = "snap"
    updateButtons();
    return true;
  }

  pause = 0;

  var xpos = i/25 * 3.0;
  var ypos = Math.sin(i/2) / 4.6 + 0.25;

  raw_data.push({x: xpos, y: ypos});
  jaggy_data.push({x: Math.round(xpos * 10) / 10, y: Math.round(ypos * 10) / 10});
  i++;
  update();
}


var phase = "pre"
function updateButtons()
{
  if (phase === "pre")
  {
    strokeButton.attr("class", "active");
    snapButton.attr("class", "disabled");
  }
  if (phase === "snap")
  {
    strokeButton.attr("class", "disabled");
    snapButton.attr("class", "active");
  }
  if (phase == "running")
  {
    strokeButton.attr("class", "disabled");
    snapButton.attr("class", "disabled");
  }
}

updateButtons();

function end()
{
  phase = "pre";
  updateButtons();
}

function quantize()
{
  if (phase != "snap")
  {
    return;
  }
  phase = "running";
  updateButtons();

  var points = vis.selectAll(".raw_points").data(raw_data);
  points.transition()
    .duration(500)
    .delay(300)
    .attr("cx", function(d) { return xRange(Math.round(d.x * 10) / 10); })
    .attr("cy", function(d) { return yRange(Math.round(d.y * 10) / 10); })
    .ease("elastic")

  raw_path
    .transition()
    .duration(800)
    .style("opacity", 0.0)
    .each("end", end);

  jaggy_path
    .style("opacity", 0.0)
    .attr("d", connect_the_dots(jaggy_data))
    .transition()
    .duration(800)
    .style("opacity", 1.0);
}

function update()
{
  var points = vis.selectAll(".raw_points").data(raw_data);

  points.enter().append("circle")
      .attr("class", "raw_points")
      .attr("cx", function(d) { return xRange(d.x); })
      .attr("cy", function(d) { return yRange(d.y); })
      .attr("fill", "#777")
      .attr("stroke", "none")
      .attr("r", 3.0);

  points
    .attr("cx", function(d) { return xRange(d.x); })
    .attr("cy", function(d) { return yRange(d.y); });

  points.exit().remove();

  raw_path
      .style("opacity", 1.0)
      .attr("d", connect_the_dots(raw_data));
}

function reset() {
  raw_data = [];
  jaggy_data = [];
  i = 0;
  pause = 0;

  raw_path
      .attr("d", connect_the_dots(raw_data));

  jaggy_path
      .attr("d", connect_the_dots(jaggy_data));
}


}) ();



