var GRAIL3 = (function() {

var vis = d3.select('#grail3');
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
  vis.selectAll(".contour_points").data(grail.RawCurvature()).remove();
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

var connect_the_dots = d3.svg.line()
  .x(function(d) { return xRange(d.x); })
  .y(function(d) { return yRange(d.y); })
  .interpolate("linear");


var thinned_path = vis.append("path")
      .attr("stroke", "lightgrey")
      .attr("stroke-width", 2)
      .attr("fill", "none");


function update()
{
  var contour_points = vis.selectAll(".contour_points").data(grail.RawCurvature());

  contour_points.enter().append("path")
      .attr("class", "contour_points")
      .attr("fill", "#444")
      .attr("stroke", "#444")
      .attr("d", d3.svg.symbol().type("triangle-up").size(8))
      .attr("transform", function(d) {
        var rotation = 0;
        if (d.dir == "right") { rotation = 90; }
        if (d.dir == "down") { rotation = 180; }
        if (d.dir == "left") { rotation = 270; }
        return "translate(" + xRange(d.point.x) + "," + yRange(d.point.y) + ") " +
               "rotate(" + rotation + ") " +
               "scale(1, 1.5)";
        })
      .style("opacity", 0)
      .transition().duration(200).style("opacity", 1.0);;

  contour_points.exit().remove();

  thinned_path
      .attr("d", connect_the_dots(grail.ThinnedData()));
}

var helpIcon = d3.select('#curvature_wrapper').append("span")
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


}) ();



