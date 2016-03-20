var GRAIL5 = (function() {

var vis = d3.select('#grail5');
var grail = new Grail();
grail.SetThinningThreshold(0.2);
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
  vis.selectAll(".thinned_contour_points").data(grail.ThinnedCurvature()).remove();
  vis.selectAll(".corners").data(grail.CornerData()).remove();
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
  thinned_path
      .attr("d", connect_the_dots(grail.ThinnedData()));

  var corner_points = vis.selectAll(".corners").data(grail.CornerData());

  corner_points.enter().append("path")
      .attr("class", "corners")
      .attr("fill", "deeppink")
      .attr("stroke", "deeppink")
      .attr("d", d3.svg.symbol().type("cross").size(30))
      .attr("transform", function(d) {
        return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";
        });

  corner_points.exit().remove();

  var direction_points = vis.selectAll(".direction_points").data(grail.DirectionData());

  direction_points.enter().append("path")
      .attr("class", "direction_points")
      .attr("fill", "grey")
      .attr("stroke", "grey")
      .attr("d", d3.svg.symbol().type("triangle-up").size(15))
      .on("mouseover", function (d,i) {console.log(d); })
      .attr("transform", function(d, i) {
        var rotation = 90 - d;
        return "translate(" + xRange(grail.ThinnedData()[i].x) + "," + yRange(grail.ThinnedData()[i].y) + ") " +
               "rotate(" + rotation + ") " +
               "scale(0.5, 1.0)";
        });

  direction_points.exit().remove();
}



function poll()
{
  if (!CORNER_TANGLE)
  {
    return;
  }

  var NEW_CORNER_THRESH = CORNER_TANGLE.getValue("corner_threshold");

  if (NEW_CORNER_THRESH != grail.CornerDegreeThreshold())
  {
    clearVis();
    grail.SetCornerDegreeThreshold(NEW_CORNER_THRESH);
    update();
  }
}


var helpIcon = d3.select('#corner_wrapper').append("span")
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



