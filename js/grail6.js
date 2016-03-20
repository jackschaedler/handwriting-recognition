var GRAIL6 = (function() {

var vis = d3.select('#grail6');
var grail = new Grail();
grail.SetThinningThreshold(0.2);
grail.SetSkipIdentification(true);



function onClear()
{
  gridvis.selectAll(".thinned_contour_points").remove();
  gridvis.selectAll(".gridlines").remove();
  gridvis.selectAll(".corners").remove();
  gridvis.selectAll(".gridindices").remove();
  gridvis
    .style("opacity", 0);

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

  mouse_down_symbol
    .style("opacity", 1)
    .attr("transform", function() {
      d = grail.PenDownPos();
      return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";});
  mouse_up_symbol
    .style("opacity", 0);

  update();
}


function mouseUp() {
  grail.OnPenUp(mousePos(d3.mouse(this)));

  mouse_up_symbol
    .style("opacity", 1)
    .attr("transform", function() {
      d = grail.PenUpPos();
      return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";});

  gridStroke();
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

var extent_rect = vis.append("svg:rect")
  .attr("stroke", "darkgrey")
  .attr("fill", "none")
  .style("stroke-dasharray", ("3, 3"));

var mouse_down_symbol = vis.append("path")
  .attr("fill", "rgb(71, 157, 174)")
  .attr("stroke", "rgb(71, 157, 174)")
  .attr("stroke-width", 2)
  .style("opacity", 0)
  .attr("d", d3.svg.symbol().type("circle").size(25));

var mouse_up_symbol = vis.append("path")
  .attr("fill", "rgb(71, 157, 174)")
  .attr("stroke", "rgb(71, 157, 174)")
  .attr("stroke-width", 2)
  .style("opacity", 0)
  .attr("d", d3.svg.symbol().type("square").size(25));


var gridvis = d3.select('#grail6B');
  gridvis
    .style("opacity", 0);

var gridCanvasWidth = 240;
var gridCanvasHeight = 240;

plotWidth = gridCanvasWidth - MARGINS.left - MARGINS.right,
plotHeight = gridCanvasHeight - MARGINS.top - MARGINS.bottom;

var xGridRange = d3.scale.linear().range([MARGINS.left, gridCanvasWidth]);
var yGridRange = d3.scale.linear().range([gridCanvasHeight, MARGINS.top]);

xGridRange.domain([0, 1]);
yGridRange.domain([0, 1]);

var gridvisFocus = gridvis.append("circle")
  .attr("fill", "grey")
  .attr("stroke", "none")
  .attr("r", 10)
  .attr("cx", 10)
  .attr("cy", 10)
  .style("opacity", 0.0);

var xGridAxis = d3.svg.axis()
  .scale(xGridRange)
  .tickFormat(d3.format("d"))
  .tickValues([])
  .tickSize(0, 0);

var yGridAxis = d3.svg.axis()
  .scale(yGridRange)
  .tickFormat(d3.format("d"))
  .tickSize(0, 0)
  .tickValues([])
  .orient('left');

var gridAxisGX = gridvis.append('svg:g')
  .attr('class', 'axis')
  .attr('transform', 'translate(0,' + (gridCanvasHeight) + ')')
  .style("opacity", 0.3)
  .call(xGridAxis);

var gridAxisGY = gridvis.append('svg:g')
  .attr('class', 'axis')
  .attr('transform', 'translate(' + xGridRange(0) + ',0)')
  .style("opacity", 0.3)
  .call(yGridAxis);

var thinned_grid_path = gridvis.append("path")
  .attr("stroke", "lightgrey")
  .attr("stroke-width", 2)
  .attr("fill", "none");

var mouse_down_grid_symbol = gridvis.append("path")
  .attr("fill", "rgb(71, 157, 174)")
  .attr("stroke", "rgb(71, 157, 174)")
  .attr("stroke-width", 2)
  .attr("d", d3.svg.symbol().type("circle").size(25))
  ;

var mouse_up_grid_symbol = gridvis.append("path")
  .attr("fill", "rgb(71, 157, 174)")
  .attr("stroke", "rgb(71, 157, 174)")
  .attr("stroke-width", 2)
  .attr("d", d3.svg.symbol().type("square").size(25))
  ;


var widthText = gridvis.append("text")
  .attr("text-anchor", "end")
  .attr("x", gridCanvasWidth - 2)
  .attr("y", 265)
  .attr("font-size", 12)
  .attr("font-weight", "bold")
  .attr("stroke", "none")
  .attr("fill", "black")
  .text("");

var heightText = gridvis.append("text")
  .attr("text-anchor", "end")
  .attr("x", gridCanvasWidth - 2)
  .attr("y", 280)
  .attr("font-size", 12)
  .attr("font-weight", "bold")
  .attr("stroke", "none")
  .attr("fill", "black")
  .text("");

var aspectRatioText = gridvis.append("text")
  .attr("text-anchor", "end")
  .attr("x", gridCanvasWidth - 2)
  .attr("y", 295)
  .attr("font-size", 12)
  .attr("font-weight", "bold")
  .attr("stroke", "none")
  .attr("fill", "black")
  .text("");


function pulse(thing) {
  thing.transition().duration(250)
    .attr("stroke-width", "5")
  .transition().duration(250)
    .attr("stroke-width", "2")
    .each("end", function() { pulse(thing); });
}

function loopFocus()
{
  gridvisFocus
    .transition()
    .attr("r", 15)
    .transition()
    .attr("r", 20)
    .each("end", loopFocus);
}

loopFocus();


function focusOn(pos) {
  gridvisFocus
    .attr("cx", xGridRange(pos.x))
    .attr("cy", yGridRange(pos.y))
    .style("opacity", 0.2);
}

function hideFocus() {
  gridvisFocus
    .style("opacity", 0.0);
}


var startPosition = gridvis.append("text")
  .attr("text-anchor", "begin")
  .attr("x", 0)
  .attr("y", 280)
  .attr("font-size", 12)
  .attr("font-weight", "bold")
  .attr("stroke", "none")
  .attr("fill", "rgb(71, 157, 174)")
  .text("")
  .on("mouseover", function() { focusOn(grail.PenDownPos());} )
  .on("mouseout", function() {hideFocus();} )
  ;

var endPosition = gridvis.append("text")
  .attr("text-anchor", "begin")
  .attr("x", 0)
  .attr("y", 295)
  .attr("font-size", 12)
  .attr("font-weight", "bold")
  .attr("stroke", "none")
  .attr("fill", "rgb(71, 157, 174)")
  .text("")
  .on("mouseover", function() { focusOn(grail.PenUpPos());} )
  .on("mouseout", function() {hideFocus();} )
  ;

var centerText = gridvis.append("text")
  .attr("text-anchor", "begin")
  .attr("x", 0)
  .attr("y", 265)
  .attr("font-size", 12)
  .attr("font-weight", "bold")
  .attr("stroke", "none")
  .attr("fill", "grey")
  .text("");

var directionText = gridvis.append("text")
  .attr("text-anchor", "begin")
  .attr("x", 0)
  .attr("y", 310)
  .attr("font-size", 12)
  .attr("font-weight", "bold")
  .attr("stroke", "none")
  .attr("fill", "black")
  .text("");

var cornerText = gridvis.append("text")
  .attr("text-anchor", "begin")
  .attr("x", 0)
  .attr("y", 325)
  .attr("font-size", 12)
  .attr("font-weight", "bold")
  .attr("stroke", "none")
  .attr("fill", "deeppink")
  .text("Corner Positions: 1 3 5 3");


var connect_the_grid_dots = d3.svg.line()
  .x(function(d) { return xGridRange(d.x); })
  .y(function(d) { return yGridRange(d.y); })
  .interpolate("linear");

var directionToSymbol = {
  "up": "▲ ",
  "down": "▼ ",
  "right": "▶",
  "left": "◀"
}


function nthDirection(n) {
  return gridvis.selectAll(".thinned_contour_points").filter(function (d,i) {return i == n;});
}


function gridStroke()
{
  gridvis.style("opacity", 1);
  gridvis.selectAll(".contour_points_description").remove();

  var strokeDescriptions = grail.StrokeDescriptions();
  var strokeDescription = strokeDescriptions[0];

  var ContainingRect = grail.ContainingRect();

  var strokeLeft = ContainingRect.x0;
  var strokeRight = ContainingRect.x1;
  var strokeTop = ContainingRect.y0;
  var strokeBottom = ContainingRect.y1;

  var strokeHeight = strokeDescription.height;
  var strokeWidth = strokeDescription.width;
  var aspectRatio = strokeDescription.aspectRatio;

  widthText.text("Width: " + strokeWidth.toFixed(2));
  heightText.text("Height: " + strokeHeight.toFixed(2));
  aspectRatioText.text("Aspect Ratio: " + aspectRatio.toFixed(2));
  startPosition.text("Stroke Start: " + strokeDescription.penDown);
  endPosition.text("Stroke End: " + strokeDescription.penUp);
  centerText.text("Center: (" + strokeDescription.center.x.toFixed(2) + ", " + strokeDescription.center.y.toFixed(2) + ")")

  gridvis.selectAll(".contour_points_description").data(strokeDescription.directions)
    .enter()
    .append("path")
      .attr("class", "contour_points_description")
      .attr("fill", "black")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", d3.svg.symbol().type("triangle-up").size(14))
      .attr("transform", function(d, i) {
        var rotation = 0;
        if (d.dir == "right") { rotation = 90; }
        if (d.dir == "down") { rotation = 180; }
        if (d.dir == "left") { rotation = 270; }
        return "translate(" + (67 + (i * 15)) + "," + 307 + ") " +
               "rotate(" + rotation + ") " +
               "scale(1, 1.5)";
        })
      .on("mouseover", function(d, i) { focusOn(d.point);} )
      .on("mouseout", function() {hideFocus();} )
      ;

  directionText.text("Directions: ");

  var cornerPos = "None";

  if (strokeDescription.corners.length > 0) {
    cornerPos = "";
    for (var i = 0; i < strokeDescription.corners.length; i++) {
      if (i > 0) { cornerPos += ","; }
      cornerPos += strokeDescription.corners[i];
    }
  }

  cornerText.text("Corners: " + cornerPos);


  if (strokeWidth > strokeHeight)
  {
    xGridRange.domain([strokeLeft, strokeRight]);
    yGridRange.domain([strokeBottom, strokeBottom + strokeWidth]);
  }
  else
  {
    yGridRange.domain([strokeBottom, strokeTop]);
    xGridRange.domain([strokeLeft, strokeLeft + strokeHeight]);
  }

  var divX = strokeWidth / 4;
  var divY = strokeHeight / 4;

  gridvis.selectAll(".gridlines").remove();

  for (var i = 1; i < 5; i++)
  {
    gridvis.append("line")
      .attr("class", "gridlines")
      .style("stroke", "lightgrey")
      .attr("x1", xGridRange(strokeLeft + (divX * i)))
      .attr("y1", yGridRange(strokeBottom))
      .attr("x2", xGridRange(strokeLeft + (divX * i)))
      .attr("y2", yGridRange(strokeTop))
      .style("stroke-dasharray", ("3, 3"))
      ;

    gridvis.append("line")
      .attr("class", "gridlines")
      .style("stroke", "lightgrey")
      .attr("x1", xGridRange(strokeLeft))
      .attr("y1", yGridRange(strokeBottom + (divY * i)))
      .attr("x2", xGridRange(strokeRight))
      .attr("y2", yGridRange(strokeBottom + (divY * i)))
      .style("stroke-dasharray", ("3, 3"))
      ;
  }

  var num = 0;
  for (var i = 0; i < 4; i++)
  {
    for (var j = 0; j < 4; j++)
    {
      gridvis.append('text')
        .attr("class", "gridindices")
        .attr("text-anchor", "end")
        .attr("x", xGridRange(strokeRight - (divX * j)) - 4)
        .attr("y", yGridRange(strokeTop - (divY * i)) + 12)
        .attr("stroke", "none")
        .attr("fill", "#999")
        .attr("font-size", 10)
        .attr("font-weight", "bold")
        .text(num);

      num++;
    }
  }

  xGridAxis.scale(xGridRange);
  yGridAxis.scale(yGridRange);

  gridAxisGX.call(xGridAxis);
  gridAxisGY.call(yGridAxis);


  var thinned_contour_points = gridvis.selectAll(".thinned_contour_points").data(grail.ThinnedCurvature());

  thinned_contour_points.enter().append("path")
      .attr("class", "thinned_contour_points")
      .attr("fill", "#444")
      .attr("stroke", "#444")
      .attr("d", d3.svg.symbol().type("triangle-up").size(14))
      .attr("transform", function(d) {
        var rotation = 0;
        if (d.dir == "right") { rotation = 90; }
        if (d.dir == "down") { rotation = 180; }
        if (d.dir == "left") { rotation = 270; }
        return "translate(" + xGridRange(d.point.x) + "," + yGridRange(d.point.y) + ") " +
               "rotate(" + rotation + ") " +
               "scale(1, 1.5)";
        });

  thinned_contour_points.exit().remove();

  thinned_grid_path
      .attr("d", connect_the_grid_dots(grail.ThinnedData()));

  var corner_points = gridvis.selectAll(".corners").data(grail.CornerData());

  corner_points.enter().append("path")
      .attr("class", "corners")
      .attr("fill", "deeppink")
      .attr("stroke", "deeppink")
      .attr("d", d3.svg.symbol().type("cross").size(25))
      .attr("transform", function(d) {
        return "translate(" + xGridRange(d.x) + "," + yGridRange(d.y) + ")";
        });

  corner_points.exit().remove();

  mouse_down_grid_symbol
    .attr("transform", function() {
      d = grail.PenDownPos();
      return "translate(" + xGridRange(d.x) + "," + yGridRange(d.y) + ")";
      });

  mouse_up_grid_symbol
    .attr("transform", function() {
      d = grail.PenUpPos();
      return "translate(" + xGridRange(d.x) + "," + yGridRange(d.y) + ")";
      });
}


////////////////////////////////////////////////////////////////////////////


function update()
{

  if (grail.IsPenDown())
  {
    var ContainingRect = grail.ContainingRect();

    extent_rect
      .attr("x", xRange(ContainingRect.x0))
      .attr("y", yRange(ContainingRect.y0))
      .attr("height", yRange(ContainingRect.y1) - yRange(ContainingRect.y0))
      .attr("width", xRange(ContainingRect.x1) - xRange(ContainingRect.x0));
  }


  var thinned_contour_points = vis.selectAll(".thinned_contour_points")
    .data(grail.ThinnedCurvature());

  thinned_contour_points.enter().append("path")
      .attr("class", "thinned_contour_points")
      .attr("fill", "#444")
      .attr("stroke", "#444")
      .attr("d", d3.svg.symbol().type("triangle-up").size(14))
      .attr("transform", function(d) {
        var rotation = 0;
        if (d.dir == "right") { rotation = 90; }
        if (d.dir == "down") { rotation = 180; }
        if (d.dir == "left") { rotation = 270; }
        return "translate(" + xRange(d.point.x) + "," + yRange(d.point.y) + ") " +
               "rotate(" + rotation + ") " +
               "scale(1, 1.5)";
        });

  thinned_contour_points.exit().remove();

  thinned_path
      .attr("d", connect_the_dots(grail.ThinnedData()));

  var corner_points = vis.selectAll(".corners").data(grail.CornerData());

  corner_points.enter().append("path")
      .attr("class", "corners")
      .attr("fill", "deeppink")
      .attr("stroke", "deeppink")
      .attr("d", d3.svg.symbol().type("cross").size(25))
      .attr("transform", function(d) {
        return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";
        })
      .style("opacity", 0)
      .transition().duration(200).style("opacity", 1);;

  corner_points.exit().remove();
}

var helpIcon = d3.select('#feature_wrapper').append("span")
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



