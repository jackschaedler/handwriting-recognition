var CURVATURE = (function() {

var vis = d3.select('#curvature');

var canvasWidth = 200;
var canvasHeight = 200;
var MARGINS = {top: 1, right: 1, bottom: 1, left: 1};

plotWidth = canvasWidth - MARGINS.left - MARGINS.right,
plotHeight = canvasHeight - MARGINS.top - MARGINS.bottom;

var xRange = d3.scale.linear().range([MARGINS.left, plotWidth]);
var yRange = d3.scale.linear().range([plotHeight, MARGINS.top]);

xRange.domain([0, 3]);
yRange.domain([0, 3]);


var xAxis = d3.svg.axis()
  .scale(xRange)
  .tickSize(0, 0)
  .tickValues([0, 1, 2, 3])
  ;

var yAxis = d3.svg.axis()
  .scale(yRange)
  .tickSize(0, 0)
  .tickValues([1, 2, 3])
  .tickFormat(d3.format(',.1f'))
  .orient('left');

var gridAxisX = d3.svg.axis()
  .scale(xRange)
  .tickSize(-plotHeight, 0)
  //.tickValues([0, 1, 2, 3, 4, 5, 6])
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

var data = [{x:1.5, y: 1.5}, {x:2.7, y:2.3}];

var xx = 0.0;

while (xx <= 3.01)
{
  vis.append("line")
  .style("stroke", "#eee")
  .attr("x1", xRange(xx))
  .attr("y1", yRange(3))
  .attr("x2", xRange(xx))
  .attr("y2", yRange(0));
  xx += 0.1;
}

var yy = 0.0;

while (yy < 3.01)
{
  vis.append("line")
  .style("stroke", "#eee")
  .attr("x1", xRange(0))
  .attr("y1", yRange(yy))
  .attr("x2", xRange(3))
  .attr("y2", yRange(yy));
  yy += 0.1;
}

vis.append("line")
  .style("stroke", "black")
  .style("opacity", 0.1)
  .attr("x1", xRange(0))
  .attr("y1", yRange(3))
  .attr("x2", xRange(3))
  .attr("y2", yRange(0));

vis.append("line")
  .style("stroke", "black")
  .style("opacity", 0.1)
  .attr("x1", xRange(0))
  .attr("y1", yRange(0))
  .attr("x2", xRange(3))
  .attr("y2", yRange(3));

vis.append("line")
  .style("stroke", "#eee")
  .attr("x1", xRange(0))
  .attr("y1", yRange(3) - 0.5)
  .attr("x2", xRange(3))
  .attr("y2", yRange(3) - 0.5);

vis.append("line")
  .style("stroke", "#eee")
  .attr("x1", xRange(3) - 0.5)
  .attr("y1", yRange(0))
  .attr("x2", xRange(3) - 0.5)
  .attr("y2", yRange(3));

var raw_path = vis.append("path")
  .attr("stroke", "rgb(81, 167, 184)")
  .attr("stroke-width", 1.5)
  .attr("fill", "none");

var connector_rect = vis.append("rect")
  .attr("fill", "black")
  .style("opacity", 0.09);

var penDown = false;

function reportDot(p)
{
  data[1] = p;
}

function mousePos(e) {
  return {x: xRange.invert(e[0]), y: yRange.invert(e[1])};
}

function mouseDown() {
  penDown = true;
  reportDot(mousePos(d3.mouse(this)));
  update();
}


function mouseUp() {
  penDown = false;
  update();
}


function mouseMove() {
  if (penDown)
  {
    reportDot(mousePos(d3.mouse(this)));
    update();
  }
}

vis.on("mousedown", mouseDown);
vis.on("mouseup", mouseUp);
vis.on("mousemove", mouseMove);
vis.on("touchstart", mouseDown);
vis.on("touchend", mouseUp);
vis.on("touchmove", mouseMove);
vis.on("mouseleave", mouseUp);
vis.on("touchleave", mouseUp);


var arrow = vis.append("path")
  .attr("fill", "#555")
  .attr("stroke", "#555")
  .attr("d", d3.svg.symbol().type("triangle-up").size(25))
  .attr("transform", function(d) {
    return "translate(" + xRange(data[1].x) + "," + yRange(data[1].y) + ") " +
           "rotate(" + 90 + ") " +
           "scale(1, 1.5)";
    });


function updateRect()
{
  var minX = Math.min(data[0].x, data[1].x);
  var maxY = Math.max(data[0].y, data[1].y);
  var maxX = Math.max(data[0].x, data[1].x);
  var minY = Math.min(data[0].y, data[1].y);

  var rectX = xRange(minX);
  var rectY = yRange(maxY);
  var rectWidth = xRange(maxX - minX);
  var rectHeight = Math.abs(yRange(maxY - minY) - yRange(0));

  connector_rect
    .attr("x", rectX)
    .attr("y", rectY)
    .attr("width", rectWidth)
    .attr("height", rectHeight);
}

function update()
{
  var points = vis.selectAll(".raw_points").data(data);

  points.enter().append("circle")
    .attr("class", "raw_points")
    .attr("cx", function(d) { return xRange(d.x); })
    .attr("cy", function(d) { return yRange(d.y); })
    .attr("fill", "rgb(81, 167, 184)")
    .attr("stroke", "none")
    .attr("r", 3.0);

  points
    .attr("cx", function(d) { return xRange(d.x); })
    .attr("cy", function(d) { return yRange(d.y); });

  points.exit().remove();

  updateRect();

  raw_path
      .attr("d", connect_the_dots(data));


  var currentThinned = data[1];
  var penThinned = data[0];

  var diff_x = currentThinned.x - penThinned.x;
  var diff_y = currentThinned.y - penThinned.y;

  var dir = "";
  var info = "";

  if (Math.abs(diff_x) >= Math.abs(diff_y)) {
    if (diff_x >= 0)
    {
      dir = "right";
     info = "Because the rectangle is wider than it is tall and it lies to the right of the previous point, the assigned direction is <b><i>right</i></b>";
    }
    else
    {
     dir = "left";
     info = "Because the rectangle is wider than it is tall and it lies to the left of the previous point, the assigned direction is <b><i>left</i></b>";
    }
  }
  else {
    if (diff_y >= 0)
    {
       dir = "up";
     info = "Because the rectangle is taller than it is wide and it lies above the previous point, the assigned direction is <b><i>up</i></b>";
    }
    else
    {
      dir = "down";
     info = "Because the rectangle is taller than it is wide and it lies below the previous point, the assigned direction is <b><i>down</i></b>";
    }
  }

  var rotation = 0;
  var offsetX = 0;
  var offsetY = -5;
  if (dir == "right") { rotation = 90; offsetX = 5; offsetY = 0}
  if (dir == "down") { rotation = 180; offsetY = 5; offsetX = 0}
  if (dir == "left") { rotation = 270; offsetX = -5; offsetY = 0}

  var midpointX = (data[0].x + data[1].x) / 2.0;
  var midpointY = (data[0].y + data[1].y) / 2.0;

  var transform = "translate(" + (xRange(midpointX) + offsetX) + "," + (yRange(midpointY) + offsetY) + ") " +
             "rotate(" + rotation + ") " +
             "scale(1, 1.5)";
   arrow
    .attr("transform", transform);

  var explanation = d3.select('#curvature_explanation');
  explanation.html(info);
}

update();

}) ();



