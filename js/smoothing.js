var SMOOTHING = (function() {

var vis = d3.select('#smoothing');

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

var raw_path = vis.append("path")
  .attr("stroke", "rgb(71, 157, 174)")
  .attr("stroke-width", 1.5)
  .style("stroke-opacity", 0.3)
  .attr("fill", "none");

var smoothed_path = vis.append("path")
  .attr("stroke", "lightgrey")
  .style("opacity", 0.0)
  .attr("stroke-width", 1.5)
  .attr("fill", "none");


var smoothButton75 = d3.select('#smoothing_wrapper').insert("button", ":first-child")
  .text("75%")
  .style("position", "absolute")
  .style("top", 0)
  .style("left", 640)
  .style("height", 25)
  .on("click", function () { smoothing = 0.75; startSmoothing(); });

var smoothButton50 = d3.select('#smoothing_wrapper').insert("button", ":first-child")
  .text("50%")
  .style("position", "absolute")
  .style("top", 0)
  .style("left", 640 - 52)
  .style("height", 25)
  .on("click", function () { smoothing = 0.5; startSmoothing(); });

var smoothButton25 = d3.select('#smoothing_wrapper').insert("button", ":first-child")
  .text("25%")
  .style("position", "absolute")
  .style("top", 0)
  .style("left", 640 - 104)
  .style("height", 25)
  .on("click", function () { smoothing = 0.25; startSmoothing(); });

d3.select('#smoothing_wrapper').insert("span", ":first-child")
  .text("Smoothing: ")
  .style("position", "absolute")
  .style("top", 10)
  .style("left", 630 - 160)
  .style("font-family", "Lato")
  .style("font-size", "13px");


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

var circles = [];
var raw_circles = [];

var raw_data = [];
var smoothed_data = [];
var isPlaying = false;

function addpoints()
{
  for (var i = 0; i < 26; i++)
  {
    var xpos = i/25 * 3.0;
    var ypos = Math.sin(i/2) / 4.6 + 0.25;

    var snappedx = Math.round(xpos * 10) / 10;
    var snappedy = Math.round(ypos * 10) / 10;

    raw_data.push({x: snappedx, y: snappedy});

    circles.push(vis.append("circle")
      .attr("class", "raw_points")
      .attr("cx", function(d) { return xRange(snappedx); })
      .attr("cy", function(d) { return yRange(snappedy); })
      .attr("fill", "#777")
      .attr("stroke", "#777")
      .style("opacity", i == 0 ? 1.0 : 0.0)
      .attr("r", 3.0))

    raw_circles.push(vis.append("circle")
      .attr("cx", function(d) { return xRange(snappedx); })
      .attr("cy", function(d) { return yRange(snappedy); })
      .attr("fill", "rgb(81, 177, 194)")
      .attr("stroke", "none")
      .style("opacity", i == 0 ? 0 : 1.0)
      .attr("r", 3.0));
  }

  raw_path
    .attr("d", connect_the_dots(raw_data));

  smoothed_path
    .attr("d", connect_the_dots(raw_data));
}

addpoints();

var smoothing = 0.75;
smoothed_data.push(raw_data[0]);

var sLine = vis.append("line")
  .style("stroke", "#666")
  .attr("stroke-width", 1.5)
  .attr("x1", xRange(0))
  .attr("y1", yRange(0))
  .attr("x2", xRange(0))
  .attr("y2", yRange(0));

var currIndex = 1;

function startSmoothing()
{
  if (isPlaying)
  {
    return;
  }

  for (var i = 1; i < circles.length; i++)
  {
    circles[i]
      .transition()
      .duration(300)
      .attr("cx", xRange(raw_data[i].x))
      .attr("cy", yRange(raw_data[i].y))
      .style("opacity", 0.0);

    raw_circles[i]
      .transition()
      .duration(300)
      .attr("cx", xRange(raw_data[i].x))
      .attr("cy", yRange(raw_data[i].y))
      .style("opacity", 1.0);
  }

  smoothed_data = [raw_data[0]];
  smoothed_path
    .attr("d", connect_the_dots(smoothed_data))
    .transition()
    .duration(300)
    .style("opacity", 1.0)
    .each("end", smoothNextPoint);

  raw_path
    .style("opacity", 1.0)
    .attr("d", connect_the_dots(raw_data));

  sLine
    .style("opacity", 0.0);

  currIndex = 1;

  isPlaying = true;
}

function smoothNextPoint()
{
  if (currIndex == 26)
  {
    isPlaying = false;
    updateButtons();
    smoothed_path
      .style("opacity", 1.0)
      .attr("d", connect_the_dots(smoothed_data));
    sLine.transition()
      .style("opacity", 0.0);
    return;
  }

  updateButtons();

  var i = currIndex;
  var prevSx = smoothed_data[i-1].x;
  var prevSy = smoothed_data[i-1].y;
  var Rx = raw_data[i].x;
  var Ry = raw_data[i].y;
  var smoothedx = (smoothing * prevSx) + ((1-smoothing) * Rx);
  var smoothedy = (smoothing * prevSy) + ((1-smoothing) * Ry);
  smoothed_data.push({x: smoothedx, y: smoothedy});

  sLine
    .style("opacity", 1.0)
    .attr("x1", xRange(Rx))
    .attr("y1", yRange(Ry))
    .attr("x2", xRange(Rx))
    .attr("y2", yRange(Ry))
    .transition()
    .attr("x1", xRange(prevSx))
    .attr("y1", yRange(prevSy))
    .attr("x2", xRange(Rx))
    .attr("y2", yRange(Ry));

  circles[i].transition()
    .duration(500)
    .delay(300)
    .style("opacity", 1.0)
    .transition()
    .duration(300)
    .attr("cx", xRange(smoothedx))
    .attr("cy", yRange(smoothedy))
    .transition()
    .duration(300)
    .each("end", smoothNextPoint);

  raw_circles[i].transition()
    .duration(500)
    .delay(300)
    .style("opacity", 0.3);

  currIndex++;
}

function updateButtons()
{
  smoothButton75.attr("class", isPlaying ? "disabled" : "active");
  smoothButton50.attr("class", isPlaying ? "disabled" : "active");
  smoothButton25.attr("class", isPlaying ? "disabled" : "active");
}


}) ();



