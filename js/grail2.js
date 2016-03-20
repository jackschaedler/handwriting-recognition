var GRAIL2 = (function() {

var vis = d3.select('#grail2');
var grail = new Grail();
grail.SetSkipIdentification(true);



function onClear()
{
  grail.Init();
  update();
}

function mousePos(e) {
  return {x: xRange.invert(e[0]), y: yRange.invert(e[1])};
}

function mouseDown() {
  helpText.transition().duration(300).style('opacity', 0).remove();
  helpIcon.transition().duration(300).style('opacity', 0).remove();
  onClear();
  grail.OnPenDown(mousePos(d3.mouse(this)));
  update();
}


function mouseUp() {
  grail.OnPenUp();
  update();
}


function mouseMove() {
  grail.OnPenMove(mousePos(d3.mouse(this)));
  update();
}


function clearVis() {
  vis.selectAll(".thinned_points").data(grail.ThinnedData()).remove();
  vis.selectAll(".thinned_points_halos").data(grail.ThinnedData()).remove();
  vis.selectAll(".raw_points").data(grail.RawData()).remove();
}


vis.on("mousedown", mouseDown);
vis.on("mouseup", mouseUp);
vis.on("mousemove", mouseMove);
vis.on("touchstart", mouseDown);
vis.on("touchend", mouseUp);
vis.on("touchmove", mouseMove);
vis.on("mouseleave", mouseUp);
vis.on("touchleave", mouseUp);


var canvasWidth = 350;
var canvasHeight = 350;
var MARGINS = {top: 10, right: 10, bottom: 10, left: 10};

plotWidth = canvasWidth - MARGINS.left - MARGINS.right,
plotHeight = canvasHeight - MARGINS.top - MARGINS.bottom;

var xRange = d3.scale.linear().range([MARGINS.left, plotWidth]);
var yRange = d3.scale.linear().range([plotHeight, MARGINS.top]);

xRange.domain([0, 8]);
yRange.domain([0, 8]);


var xAxis = d3.svg.axis()
  .scale(xRange)
  .tickSize(0, 0)
  .tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

var yAxis = d3.svg.axis()
  .scale(yRange)
  .tickSize(0, 0)
  .tickValues([1, 2, 3, 4, 5, 6, 7, 8])
  .orient('left');

var gridAxisX = d3.svg.axis()
  .scale(xRange)
  .tickSize(-plotHeight, 0)
  .tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8])
  .orient('bottom')
  .tickFormat("");

var gridAxisY = d3.svg.axis()
  .scale(yRange)
  .tickSize(-plotWidth, 0)
  .tickValues([1, 2, 3, 4, 5, 6, 7, 8])
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

vis.append("line")
  .style("stroke", "black")
  .style("opacity", 0.3)
  .attr("x1", xRange(0))
  .attr("y1", yRange(8) + 0.5)
  .attr("x2", xRange(8))
  .attr("y2", yRange(8) + 0.5);

vis.append("line")
  .style("stroke", "black")
  .style("opacity", 0.3)
  .attr("x1", xRange(8) + 0.5)
  .attr("y1", yRange(8))
  .attr("x2", xRange(8) + 0.5)
  .attr("y2", yRange(0));


var background = vis.append("g");

var connect_the_dots = d3.svg.line()
  .x(function(d) { return xRange(d.x); })
  .y(function(d) { return yRange(d.y); })
  .interpolate("linear");


var raw_path = background.append("path")
      .attr("stroke", "rgb(231, 237, 254)")
      .attr("stroke-width", 2)
      .attr("fill", "none");

var thinned_path = vis.append("path")
      .attr("stroke", "darkgrey")
      .attr("stroke-width", 2)
      .attr("fill", "none");


var rawDotCount = vis.append("text")
  .attr("text-anchor", "end")
  .attr("x", xRange(7.8))
  .attr("y", yRange(0.58))
  .attr("font-size", 12)
  .attr("font-weight", "normal")
  .attr("stroke", "none")
  .attr("fill", "rgb(71, 157, 174)")
  .text("");

var thinnedDotCount = vis.append("text")
  .attr("text-anchor", "end")
  .attr("x", xRange(7.8))
  .attr("y", yRange(0.2))
  .attr("font-size", 12)
  .attr("font-weight", "normal")
  .attr("stroke", "none")
  .attr("fill", "black")
  .text("");


var halo = vis.append("rect")
  .attr("fill", "red")
  .attr("stroke", "none")
  .style('opacity', 0.1);


function update()
{
  var points = background.selectAll(".raw_points").data(grail.SmoothData());

  points.enter().append("circle")
      .attr("class", "raw_points")
      .attr("cx", function(d) { return xRange(d.x); })
      .attr("cy", function(d) { return yRange(d.y); })
      .attr("fill", "rgb(141, 207, 224)")
      .attr("stroke", "none")
      .attr("r", 2.0);

  points.exit().remove();

  raw_path
      .attr("d", connect_the_dots(grail.SmoothData()));

  var thresh = grail.ThinningThreshold();
  var thinnedPoints = grail.ThinnedData().length;
  var lastThinned = grail.ThinnedData()[thinnedPoints - 1];

  if (thinnedPoints > 0)
  {
    halo
      .attr("x", xRange(lastThinned.x - thresh))
      .attr("y", yRange(lastThinned.y + thresh))
      .attr("width", xRange(thresh * 2) - xRange(0))
      .attr("height", xRange(thresh * 2) - xRange(0))
      .attr("r", xRange(grail.ThinningThreshold()));
  }

  var thinned_points = vis.selectAll(".thinned_points").data(grail.ThinnedData());

  thinned_points.enter().append("circle")
      .attr("class", "thinned_points")
      .attr("cx", function(d) { return xRange(d.x); })
      .attr("cy", function(d) { return yRange(d.y); })
      .attr("fill", "black")
      .attr("stroke", "black")
      .attr("r", 2.8);

  thinned_points.exit().remove();

  thinned_path
      .attr("d", connect_the_dots(grail.ThinnedData()));

  rawDotCount
    .text("Smoothed Points: " + grail.RawData().length);

  thinnedDotCount
    .text("Thinned Points: " + grail.ThinnedData().length);
}


function poll()
{
  if (!THINNING_TANGLE)
  {
    return;
  }

  var NEW_THIN_THRESH = THINNING_TANGLE.getValue("thinning_threshold");

  if (NEW_THIN_THRESH != grail.ThinningThreshold())
  {
    clearVis();
    grail.SetThinningThreshold(NEW_THIN_THRESH);
    update();
  }
}

var helpIcon = d3.select('#thin_wrapper').append("span")
  .attr("class", "icon-pen bigicon")
  .style("pointer-events", "none")
  .style("font-size", 50)
  .style("position", "absolute")
  .style("top", canvasHeight / 2 - 25)
  .style("right", canvasWidth / 2 - 25)
  .style("opacity", 0.3);

var helpText = vis.append("text")
  .attr("text-anchor", "middle")
  .style("pointer-events", "none")
  .attr("x", canvasWidth / 2)
  .attr("y", canvasHeight / 2 + 35)
  .attr("font-size", 12)
  .attr("font-weight", "normal")
  .attr("stroke", "none")
  .attr("fill", "black")
  .style("opacity", 0.6)
  .text("Click and drag to start drawing");

d3.timer(poll, 100);

}) ();



