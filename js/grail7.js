var GRAIL7 = (function() {

var vis = d3.select('#grail7');
var grail = new Grail();
grail.SetThinningThreshold(0.15);
grail.SetCharacterCallback(OnCharacter);


function OnCharacter(character, justifications) {
  var justification = justifications.join(" ");
  var body = "<span style='font-family: Inconsolata; display: block; font-size:100'>" + character + "</span>";

  var idHolder = d3.select('#single_stroke_identification');
  idHolder.html(justification + body);
  idHolder.style("opacity", 1);
}

function UpdatePossibilities(possibilities) {
  var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
  var numbers = ["1","2","3","4","5","6","7","8","9"];

  var html = "";
  for (var i = 0; i < alphabet.length; i++)
  {
    var letter = alphabet[i];
    if (possibilities[letter] == "match")
    {
      html += "<span style='color: #000; float:left'>" + letter + "</span>";
    }
    else if (possibilities[letter] === true)
    {
      html += "<span style='color: #777; float:left'>" + letter + "</span>";
    }
    else
    {
      html += "<span style='color: #DDD; float: left'>" + letter + "</span>";
    }
  }

  html += "<br/><br/><br/><br/>"

  for (var i = 0; i < numbers.length; i++)
  {
    var letter = numbers[i];
    if (possibilities[letter] == "match")
    {
      html += "<span style='color: #000; float:left'>" + letter + "</span>";
    }
    else if (possibilities[letter] === true)
    {
      html += "<span style='color: #777; float:left'>" + letter + "</span>";
    }
    else
    {
      html += "<span style='color: #DDD; float: left'>" + letter + "</span>";
    }
  }

  var body = "<div style='font-family: Inconsolata; font-size:60; width: 300px; text-align: center; line-height: 75%'>" + html + "</div>";
  var idHolder = d3.select('#single_stroke_identification');
  idHolder.html(body);
  idHolder.style("opacity", 1);
}

UpdatePossibilities({});


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

  mouse_down_symbol
    .style("opacity", 1)
    .attr("transform", function() {
      d = grail.PenDownPos();
      return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";});
  mouse_up_symbol
    .style("opacity", 0);

  if (grail.IsPenDown())
  {
    UpdatePossibilities(grail.CurrentStrokePossibilities());
  }

  update();
}


function mouseUp() {
  grail.OnPenUp(mousePos(d3.mouse(this)));

  mouse_up_symbol
    .style("opacity", 1)
    .attr("transform", function() {
      d = grail.PenUpPos();
      return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";});

  update();
}


function mouseMove() {
  grail.OnPenMove(mousePos(d3.mouse(this)));

  if (grail.IsPenDown())
  {
    UpdatePossibilities(grail.CurrentStrokePossibilities());
  }

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
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .style("stroke-opacity", 0.2)
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
      .attr("fill", "black")
      .attr("stroke", "black")
      .attr("d", d3.svg.symbol().type("triangle-up").size(14))
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
      .transition().duration(200).style("opacity", 1);;

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


// var dump = d3.select('#single_stroke_wrapper').insert("button", ":first-child")
//   .text("Dump")
//   .style("position", "absolute")
//   .style("top", 8)
//   .style("left", 559)
//   .style("height", 25)
//   .on("click", function () { console.log(JSON.stringify(grail.RawData())); });

var helpIcon = d3.select('#single_stroke_wrapper').append("span")
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



