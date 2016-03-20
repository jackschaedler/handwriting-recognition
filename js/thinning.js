var THINNING = (function() {

var vis = d3.select('#thinning');

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


// var raw_path = vis.append("path")
//   .attr("stroke", "Black")
//   .attr("stroke-width", 2)
//   .style("stroke-opacity", 0.3)
//   .attr("fill", "none");

// var jaggy_path = vis.append("path")
//   .attr("stroke", "Grey")
//   .attr("stroke-width", 2)
//   .style("stroke-opacity", 0.2)
//   .attr("fill", "none");

var thinButton = d3.select('#thinning_wrapper').insert("button", ":first-child")
  .text("Thin a Little")
  .style("position", "absolute")
  .style("top", 0)
  .style("left", 515)
  .style("height", 25)
  .on("click", function () { halo_radius = 0.1; doit(); });

var thinLotsButton = d3.select('#thinning_wrapper').insert("button", ":first-child")
  .text("Thin a Lot")
  .style("position", "absolute")
  .style("top", 0)
  .style("left", 610)
  .style("height", 25)
  .on("click", function () { halo_radius = 0.29; doit(); });

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

var halo = vis.append("rect")
  .attr("fill", "#fdd")
  .attr("stroke", "none"); 


var isPlaying = false;

var data = [];
var thinned = [];

var halo_radius = 0.10;
var halo_radius_px = xRange(halo_radius) - xRange(0);

var circles = [];


function createPoints()
{
  for (var i = 0; i < circles.length; i++)
  {
    circles[i].remove();
  }

  circles = [];
  data = [];
  thinned = [];

  for (var i = 0; i < 100; i++)
  {
    var xpos = i/100 * 3.0;
    var ypos = Math.sin(i/10) / 6 + 0.25;

    var isthinned = false;

    if (thinned.length == 0)
    {
      isthinned = false;
      thinned.push({x: xpos, y: ypos});
    }
    else
    {
      var lastThinned = thinned[thinned.length - 1];
      var deltaX = Math.abs(xpos - lastThinned.x);
      var deltaY = Math.abs(ypos - lastThinned.y);

      if (deltaX >= halo_radius || deltaY >= halo_radius)
      {
        isthinned = false;
        thinned.push({x: xpos, y: ypos});
      }
      else
      {
        isthinned = true;
      }
    }

    data.push({x: xpos, y: ypos, thinned: isthinned})

    circles.push(vis.append("circle")
        .attr("d", data[data.length - 1])
        .attr("cx", function(d) { return xRange(xpos); })
        .attr("cy", function(d) { return yRange(ypos); })
        .attr("fill", "#777")
        .attr("stroke", "none")
        .attr("r", 2.3)); 
  }
}

createPoints();

function doit()
{
  if (isPlaying)
  {
    return;
  }

  createPoints();
  halo_radius_px = xRange(halo_radius) - xRange(0);
  play();
}


function updateButtons()
{
  thinButton.attr("class", isPlaying ? "disabled" : "active");
  thinLotsButton.attr("class", isPlaying ? "disabled" : "active");
}

function reset()
{
  currentIndex = 0;
}

function play()
{
  reset();
  isPlaying = true;
  updateButtons();
  thinNextPoint();
}

function done()
{
  isPlaying = false;
  updateButtons();
}

var currentIndex = 0;
function thinNextPoint()
{
  if (currentIndex >= 99)
  {
    done();
    return;
  }

  halo
    .attr("x", function(d) { return xRange(data[currentIndex].x); })
    .attr("y", function(d) { return yRange(data[currentIndex].y); })
    .attr("width", 0)
    .attr("height", 0)
    .transition()
    .duration(500)
    .attr("x", xRange(data[currentIndex].x) - halo_radius_px)
    .attr("y", yRange(data[currentIndex].y) - halo_radius_px)
    .attr("width", 2 * halo_radius_px)
    .attr("height", 2 * halo_radius_px)
    .transition()
    .delay(1200)
    .duration(200)
    .each("end", thinNextPoint);

  while(data[++currentIndex].thinned)
  {
    circles[currentIndex]
      .transition()
      .delay(800)
      .duration(500)
      .style("opacity", 0.0);

    if (currentIndex == 99)
    {
      return;
    }
  }

}

}) ();



