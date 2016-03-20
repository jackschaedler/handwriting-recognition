var ONE_CHAR = (function() {

var vis = d3.select('#demo');
var grail = new Grail();
grail.SetThinningThreshold(0.2);
grail.SetStrokeMode("single");


grail.SetCharacterCallback(OnCharacter);


function OnCharacter(character, justifications) {
}


function onClear()
{
  grail.Init();
  update();
}


function clearVis() {
  vis.selectAll(".thinned_contour_points").data(grail.ThinnedCurvature()).remove();
  vis.selectAll(".corners").data(grail.CornerData()).remove();
}


var canvasWidth = 90;
var canvasHeight = 90;
var MARGINS = {top: 20, right: 20, bottom: 20, left: 20};

plotWidth = canvasWidth - MARGINS.left - MARGINS.right,
plotHeight = canvasHeight - MARGINS.top - MARGINS.bottom;

var xRange = d3.scale.linear().range([MARGINS.left, plotWidth]);
var yRange = d3.scale.linear().range([plotHeight, MARGINS.top]);

xRange.domain([0, 3]);
yRange.domain([0, 3]);


var connect_the_dots = d3.svg.line()
  .x(function(d) { return xRange(d.x); })
  .y(function(d) { return yRange(d.y); })
  .interpolate("linear");


var thinned_path = vis.append("path")
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .style("stroke-opacity", 0.2)
  .attr("fill", "none");

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

var currentDemo = 0;
var currentIndex = 0;

function feed() {
  var demo = demoList[currentDemo];

  if (currentIndex == 0)
  {
    grail.OnPenDown(demo[currentIndex]);

    mouse_down_symbol
      .style("opacity", 1)
      .attr("transform", function() {
        d = grail.PenDownPos();
        return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";});
    mouse_up_symbol
      .style("opacity", 0);
  }
  else if (currentIndex < demo.length - 1)
  {
    grail.OnPenMove(demo[currentIndex]);
  }
  else if (currentIndex == demo.length - 1)
  {
    grail.OnPenUp(demo[currentIndex]);
    mouse_up_symbol
      .style("opacity", 1)
      .attr("transform", function() {
        d = grail.PenUpPos();
        return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";});
  } else if (currentIndex > demo.length * 3) {
    currentIndex = 0;
    currentDemo++;
    if (currentDemo == demoList.length)
    {
      currentDemo = 0;
    }
    onClear();

    return;
  }

  update();
  currentIndex++;
}

setInterval(feed, 10);

}) ();



