var TITLEW = (function() {

var demoW = [{"x":0.352,"y":2.496},{"x":0.352,"y":2.432},{"x":0.352,"y":2.336},{"x":0.352,"y":2.144},{"x":0.352,"y":1.824},{"x":0.352,"y":1.6},{"x":0.384,"y":1.3760000000000001},{"x":0.416,"y":1.184},{"x":0.512,"y":0.96},{"x":0.5439999999999999,"y":0.8},{"x":0.5760000000000001,"y":0.64},{"x":0.672,"y":0.48},{"x":0.672,"y":0.41600000000000004},{"x":0.672,"y":0.384},{"x":0.672,"y":0.41600000000000004},{"x":0.672,"y":0.448},{"x":0.704,"y":0.608},{"x":0.768,"y":0.768},{"x":0.832,"y":0.928},{"x":0.96,"y":1.12},{"x":1.056,"y":1.28},{"x":1.1199999999999999,"y":1.44},{"x":1.216,"y":1.568},{"x":1.2799999999999998,"y":1.6320000000000001},{"x":1.3119999999999998,"y":1.696},{"x":1.344,"y":1.696},{"x":1.344,"y":1.6},{"x":1.376,"y":1.504},{"x":1.44,"y":1.312},{"x":1.504,"y":1.1520000000000001},{"x":1.6,"y":0.96},{"x":1.6319999999999997,"y":0.864},{"x":1.7279999999999998,"y":0.736},{"x":1.76,"y":0.672},{"x":1.76,"y":0.608},{"x":1.7919999999999998,"y":0.5760000000000001},{"x":1.8239999999999998,"y":0.5760000000000001},{"x":1.8239999999999998,"y":0.544},{"x":1.856,"y":0.544},{"x":1.856,"y":0.512},{"x":1.888,"y":0.512},{"x":1.888,"y":0.48},{"x":1.888,"y":0.48},{"x":1.888,"y":0.448},{"x":1.92,"y":0.448},{"x":1.92,"y":0.512},{"x":1.952,"y":0.608},{"x":1.984,"y":0.736},{"x":2.048,"y":0.928},{"x":2.08,"y":1.056},{"x":2.112,"y":1.184},{"x":2.144,"y":1.344},{"x":2.1759999999999997,"y":1.504},{"x":2.208,"y":1.6320000000000001},{"x":2.272,"y":1.76},{"x":2.3040000000000003,"y":1.92},{"x":2.336,"y":2.016},{"x":2.368,"y":2.08},{"x":2.368,"y":2.144},{"x":2.4,"y":2.208},{"x":2.4,"y":2.2720000000000002},{"x":2.432,"y":2.3040000000000003},{"x":2.432,"y":2.336},{"x":2.432,"y":2.4},{"x":2.432,"y":2.432},{"x":2.464,"y":2.432},{"x":2.464,"y":2.464},{"x":2.464,"y":2.496},{"x":2.464,"y":2.528}];


var demoList = [demoW];


var vis = d3.select('#titlew');
var grail = new Grail();
grail.SetThinningThreshold(0.1);
grail.SetSkipIdentification(true);
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


var canvasWidth = 30;
var canvasHeight = 30;
var MARGINS = {top: 2, right: 2, bottom: 2, left: 2};

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
  .attr("stroke", "white")
  .attr("stroke-width", 2.5)
  .style("stroke-opacity", 1.0)
  .attr("fill", "none");


function update()
{
  thinned_path
      .attr("d", connect_the_dots(grail.ThinnedData()));
}

var currentDemo = 0;
var currentIndex = 0;

function feed() {
  if (currentIndex == 0)
  {
    grail.OnPenDown(demoList[0][currentIndex]);
  }
  else if (currentIndex < demoList[0].length - 1)
  {
    grail.OnPenMove(demoList[0][currentIndex]);
  }
  else if (currentIndex == demoList[0].length - 1)
  {
    grail.OnPenUp(demoList[0][currentIndex]);
  } else if (currentIndex > demoList[0].length * 4) {
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

d3.timer(feed, 100);

}) ();



