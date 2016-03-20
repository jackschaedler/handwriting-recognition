var THREES = (function() {

var NUMBER_DATA_1 = [{"x":1.44,"y":6.016},{"x":1.5,"y":6.1},{"x":1.5,"y":6.1},{"x":1.7,"y":6.3},{"x":2,"y":6.5},{"x":2.2,"y":6.7},{"x":2.5,"y":6.8},{"x":2.8,"y":6.9},{"x":3,"y":7},{"x":3.2,"y":7},{"x":3.4,"y":7},{"x":3.6,"y":7.1},{"x":3.7,"y":7.1},{"x":3.8,"y":7.1},{"x":3.9,"y":7.1},{"x":4,"y":7},{"x":4.1,"y":7},{"x":4.2,"y":6.9},{"x":4.3,"y":6.8},{"x":4.3,"y":6.8},{"x":4.3,"y":6.7},{"x":4.3,"y":6.4},{"x":4.3,"y":6.2},{"x":4.2,"y":6},{"x":4.1,"y":5.7},{"x":3.9,"y":5.5},{"x":3.8,"y":5.3},{"x":3.6,"y":5.1},{"x":3.5,"y":5},{"x":3.4,"y":4.8},{"x":3.3,"y":4.7},{"x":3.1,"y":4.5},{"x":3,"y":4.4},{"x":2.8,"y":4.3},{"x":2.6,"y":4.2},{"x":2.5,"y":4.1},{"x":2.4,"y":4},{"x":2.3,"y":4},{"x":2.2,"y":3.9},{"x":2.2,"y":3.9},{"x":2.2,"y":3.9},{"x":2.2,"y":3.9},{"x":2.4,"y":3.9},{"x":2.5,"y":3.9},{"x":2.8,"y":3.9},{"x":3.4,"y":3.9},{"x":3.6,"y":3.8},{"x":3.8,"y":3.7},{"x":4.1,"y":3.6},{"x":4.3,"y":3.4},{"x":4.4,"y":3.2},{"x":4.5,"y":3.1},{"x":4.6,"y":2.9},{"x":4.7,"y":2.8},{"x":4.8,"y":2.6},{"x":4.8,"y":2.5},{"x":4.8,"y":2.3},{"x":4.8,"y":2.1},{"x":4.7,"y":1.9},{"x":4.5,"y":1.8},{"x":4.4,"y":1.6},{"x":4.2,"y":1.4},{"x":4,"y":1.2},{"x":3.7,"y":1.1},{"x":3.6,"y":0.9},{"x":3.4,"y":0.7},{"x":3.2,"y":0.6},{"x":2.9,"y":0.6},{"x":2.8,"y":0.5},{"x":2.7,"y":0.5},{"x":2.6,"y":0.5},{"x":2.5,"y":0.5},{"x":2.3,"y":0.5},{"x":2.2,"y":0.5},{"x":2,"y":0.5},{"x":1.9,"y":0.6},{"x":1.8,"y":0.6},{"x":1.7,"y":0.6},{"x":1.6,"y":0.6},{"x":1.4,"y":0.7},{"x":1.4,"y":0.7},{"x":1.3,"y":0.8},{"x":1.3,"y":0.8},{"x":1.3,"y":0.9},{"x":1.2,"y":0.9},{"x":1.2,"y":0.9},{"x":1.1,"y":1},{"x":1.1,"y":1}];
var NUMBER_DATA_2 = [{"x":1.1520000000000001,"y":6.176},{"x":1.2,"y":6.2},{"x":1.2,"y":6.2},{"x":1.2,"y":6.3},{"x":1.4,"y":6.5},{"x":1.8,"y":6.7},{"x":2.2,"y":6.9},{"x":2.6,"y":7},{"x":2.9,"y":7},{"x":3.2,"y":7},{"x":3.4,"y":7},{"x":3.5,"y":6.7},{"x":3.6,"y":6.5},{"x":3.6,"y":6},{"x":3.6,"y":5.7},{"x":3.4,"y":5.2},{"x":3,"y":4.8},{"x":2.7,"y":4.5},{"x":2.6,"y":4.4},{"x":2.4,"y":4.2},{"x":2.4,"y":4.2},{"x":2.4,"y":4.2},{"x":2.7,"y":4.2},{"x":3.2,"y":4.2},{"x":3.9,"y":4.2},{"x":4.6,"y":4},{"x":5.1,"y":3.7},{"x":5.4,"y":3.4},{"x":5.7,"y":3.1},{"x":5.8,"y":2.7},{"x":5.8,"y":2},{"x":5.5,"y":1.6},{"x":5.1,"y":1.2},{"x":4.6,"y":0.8},{"x":4.1,"y":0.7},{"x":3.4,"y":0.7},{"x":2.9,"y":0.7},{"x":2.4,"y":0.9},{"x":2.1,"y":1.1},{"x":1.8,"y":1.2},{"x":1.7,"y":1.3}];
var NUMBER_DATA_3 = [{"x":4.128,"y":6.848},{"x":4.2,"y":6.8},{"x":4.3,"y":6.8},{"x":4.5,"y":6.7},{"x":4.8,"y":6.5},{"x":5.1,"y":6.2},{"x":5.2,"y":6},{"x":5.3,"y":5.7},{"x":5.3,"y":5.3},{"x":5.1,"y":5},{"x":4.4,"y":4.6},{"x":3.9,"y":4.4},{"x":3.4,"y":4.4},{"x":3.2,"y":4.4},{"x":3,"y":4.4},{"x":3,"y":4.4},{"x":3,"y":4.4},{"x":3.1,"y":4.3},{"x":3.6,"y":3.8},{"x":3.8,"y":3.2},{"x":4,"y":2.8},{"x":4.1,"y":2.3},{"x":4.1,"y":1.7},{"x":3.9,"y":1.3},{"x":3.5,"y":1},{"x":3.2,"y":0.8},{"x":2.8,"y":0.6},{"x":2.2,"y":0.6},{"x":1.7,"y":0.9},{"x":1.2,"y":1.2},{"x":1,"y":1.6},{"x":0.9,"y":1.7},{"x":0.8,"y":1.9},{"x":0.8,"y":2.1},{"x":0.8,"y":2.2},{"x":0.8,"y":2.2},{"x":0.8,"y":2.3}];
var NUMBER_DATA_4 = [{"x":1.5679999999999998,"y":5.44},{"x":1.6,"y":5.5},{"x":1.6,"y":5.6},{"x":1.7,"y":6},{"x":1.9,"y":6.3},{"x":2.1,"y":6.6},{"x":2.5,"y":6.8},{"x":2.8,"y":6.9},{"x":3,"y":6.9},{"x":3.2,"y":6.9},{"x":3.3,"y":6.8},{"x":3.5,"y":6.6},{"x":3.5,"y":6.4},{"x":3.5,"y":6.2},{"x":3.2,"y":5.8},{"x":2.7,"y":5.2},{"x":2.3,"y":4.7},{"x":2,"y":4.5},{"x":1.7,"y":4.2},{"x":1.6,"y":4.2},{"x":1.5,"y":4.1},{"x":1.5,"y":4.2},{"x":1.7,"y":4.3},{"x":2.1,"y":4.4},{"x":2.7,"y":4.4},{"x":3.3,"y":4.4},{"x":3.7,"y":4.3},{"x":4.2,"y":4.1},{"x":4.6,"y":3.8},{"x":4.9,"y":3.5},{"x":5.1,"y":3},{"x":5.2,"y":2.4},{"x":4.9,"y":1.6},{"x":4.4,"y":1.1},{"x":3.7,"y":0.7},{"x":3.1,"y":0.5},{"x":2.4,"y":0.4},{"x":1.8,"y":0.6},{"x":1.2,"y":1.1},{"x":0.9,"y":1.5},{"x":0.5,"y":2.4},{"x":0.4,"y":2.8},{"x":0.4,"y":3.1},{"x":0.4,"y":3.3},{"x":0.4,"y":3.5},{"x":0.4,"y":3.6}];
var NUMBER_DATA_5 = [{"x":2.016,"y":7.2},{"x":2,"y":7.2},{"x":2.3,"y":7.2},{"x":2.6,"y":7.2},{"x":2.8,"y":7.1},{"x":3,"y":6.9},{"x":3.2,"y":6.8},{"x":3.2,"y":6.6},{"x":3.3,"y":6.4},{"x":3.3,"y":6.1},{"x":3.2,"y":5.8},{"x":3,"y":5.6},{"x":2.8,"y":5.4},{"x":2.8,"y":5.3},{"x":2.6,"y":5.3},{"x":2.5,"y":5.3},{"x":2.5,"y":5.3},{"x":2.5,"y":5.2},{"x":2.5,"y":5.2},{"x":2.5,"y":5.2},{"x":2.6,"y":5.1},{"x":2.9,"y":4.8},{"x":3.3,"y":4.3},{"x":3.6,"y":3.6},{"x":3.9,"y":3.1},{"x":4.1,"y":2.6},{"x":4.3,"y":2},{"x":4.3,"y":1.7},{"x":4.3,"y":1.5},{"x":4.2,"y":1.2},{"x":4,"y":1},{"x":3.7,"y":0.9},{"x":3.3,"y":0.8},{"x":2.9,"y":0.8},{"x":2.6,"y":0.9},{"x":2.1,"y":1.3},{"x":2,"y":1.5},{"x":1.9,"y":1.7},{"x":1.8,"y":1.8},{"x":1.8,"y":1.9},{"x":1.8,"y":1.9},{"x":1.8,"y":1.9}];
var NUMBER_DATA_6 = [{"x":1.376,"y":6.464},{"x":1.5,"y":6.5},{"x":1.8,"y":6.5},{"x":2.3,"y":6.5},{"x":2.8,"y":6.4},{"x":3.2,"y":6.3},{"x":3.4,"y":6.2},{"x":3.7,"y":6.1},{"x":3.8,"y":6},{"x":3.8,"y":6},{"x":3.8,"y":6},{"x":3.8,"y":5.9},{"x":3.7,"y":5.9},{"x":3.5,"y":5.7},{"x":3.1,"y":5.4},{"x":2.6,"y":4.9},{"x":1.8,"y":4.1},{"x":1.5,"y":3.8},{"x":1.3,"y":3.6},{"x":1.2,"y":3.5},{"x":1.2,"y":3.4},{"x":1.2,"y":3.4},{"x":1.5,"y":3.4},{"x":1.9,"y":3.4},{"x":2.3,"y":3.2},{"x":2.8,"y":3.1},{"x":3.2,"y":2.9},{"x":3.5,"y":2.8},{"x":3.7,"y":2.7},{"x":3.8,"y":2.6},{"x":3.8,"y":2.5},{"x":3.8,"y":2.4},{"x":3.7,"y":2.1},{"x":3.4,"y":1.8},{"x":2.9,"y":1.5},{"x":2.3,"y":1.3},{"x":1.9,"y":1.2},{"x":1.3,"y":1.1},{"x":1.1,"y":1.1},{"x":0.7,"y":1},{"x":0.6,"y":1},{"x":0.6,"y":1}];
var NUMBER_DATA_7 = [{"x":0.6399999999999999,"y":6.88},{"x":0.7,"y":6.9},{"x":0.8,"y":6.9},{"x":1.4,"y":6.9},{"x":1.6,"y":6.9},{"x":1.7,"y":6.8},{"x":1.8,"y":6.8},{"x":1.9,"y":6.6},{"x":2,"y":6.5},{"x":2.1,"y":6.1},{"x":2.1,"y":6},{"x":2.2,"y":5.9},{"x":2.2,"y":5.7},{"x":2.2,"y":5.5},{"x":2.2,"y":5.2},{"x":2.2,"y":5.1},{"x":2.2,"y":4.9},{"x":2.2,"y":4.7},{"x":2.2,"y":4.5},{"x":2.2,"y":4.1},{"x":2.1,"y":3.8},{"x":2,"y":3.6},{"x":1.9,"y":3.4},{"x":1.8,"y":3.4},{"x":1.4,"y":3.3},{"x":1.2,"y":3.3},{"x":1.1,"y":3.3},{"x":0.8,"y":3.4},{"x":0.6,"y":3.6},{"x":0.5,"y":3.8},{"x":0.5,"y":4},{"x":0.5,"y":4.2},{"x":0.6,"y":4.4},{"x":0.6,"y":4.4},{"x":0.9,"y":4.4},{"x":1.2,"y":4.4},{"x":1.4,"y":4.4},{"x":1.6,"y":4.4},{"x":1.8,"y":4.4},{"x":1.9,"y":4.3},{"x":2,"y":4.2},{"x":2.5,"y":3.6},{"x":2.6,"y":3.4},{"x":2.7,"y":3.3},{"x":2.7,"y":3.1},{"x":2.8,"y":2.7},{"x":2.8,"y":2.4},{"x":2.8,"y":2.2},{"x":2.8,"y":2},{"x":2.7,"y":2},{"x":2.5,"y":1.7},{"x":2.3,"y":1.6},{"x":2.1,"y":1.5},{"x":2,"y":1.4},{"x":1.9,"y":1.3},{"x":1.7,"y":1.3},{"x":1.6,"y":1.2},{"x":1.4,"y":1.2},{"x":1.2,"y":1.2},{"x":1.1,"y":1.2},{"x":1,"y":1.1},{"x":1,"y":1.1},{"x":0.9,"y":1.1},{"x":0.9,"y":1.1},{"x":0.9,"y":1.1},{"x":0.9,"y":1.2},{"x":0.8,"y":1.2},{"x":0.8,"y":1.2}];
var NUMBER_DATA_8 = [{"x":0.768,"y":6.912},{"x":0.8,"y":6.9},{"x":1,"y":6.8},{"x":1.3,"y":6.7},{"x":1.8,"y":6.4},{"x":2.3,"y":6.1},{"x":2.8,"y":5.8},{"x":3.8,"y":5.1},{"x":4.1,"y":4.8},{"x":4.3,"y":4.6},{"x":4.5,"y":4.5},{"x":4.5,"y":4.5},{"x":4.6,"y":4.4},{"x":4.6,"y":4.4},{"x":4.6,"y":4.4},{"x":4.5,"y":4.4},{"x":4.3,"y":4.4},{"x":4.1,"y":4.4},{"x":3.8,"y":4.4},{"x":2.9,"y":4.1},{"x":2.6,"y":4},{"x":2.3,"y":3.8},{"x":2,"y":3.8},{"x":1.7,"y":3.7},{"x":1.6,"y":3.7},{"x":1.6,"y":3.6},{"x":1.5,"y":3.6},{"x":1.4,"y":3.6},{"x":1.4,"y":3.6},{"x":1.4,"y":3.6},{"x":1.4,"y":3.6},{"x":1.5,"y":3.6},{"x":1.6,"y":3.6},{"x":1.7,"y":3.6},{"x":1.9,"y":3.5},{"x":2.3,"y":3.4},{"x":2.7,"y":3.1},{"x":3.2,"y":2.9},{"x":3.6,"y":2.8},{"x":4,"y":2.6},{"x":4.2,"y":2.5},{"x":4.4,"y":2.4},{"x":4.5,"y":2.4},{"x":4.5,"y":2.4},{"x":4.5,"y":2.3},{"x":4.5,"y":2.3},{"x":4.5,"y":2.3},{"x":4.3,"y":2.3},{"x":4,"y":2.1},{"x":3.7,"y":2},{"x":3.3,"y":1.9},{"x":2.9,"y":1.7},{"x":2.6,"y":1.6},{"x":2.3,"y":1.5},{"x":1.8,"y":1.3},{"x":1.5,"y":1.2},{"x":1.3,"y":1.2},{"x":1.2,"y":1.2},{"x":1.1,"y":1.2},{"x":1.1,"y":1.1},{"x":1,"y":1.1}];

var datas = [
	NUMBER_DATA_1,
	NUMBER_DATA_2,
	NUMBER_DATA_3,
	NUMBER_DATA_4,
	NUMBER_DATA_5,
	NUMBER_DATA_6,
	NUMBER_DATA_7,
	NUMBER_DATA_8,
];


var grails = [];
var mouse_down_symbols = [];
var mouse_up_symbols = [];
var thinned_paths = [];

var canvasWidth = 90;
var canvasHeight = 90;
var MARGINS = {top: 0, right: 0, bottom: 0, left: 0};

plotWidth = canvasWidth - MARGINS.left - MARGINS.right,
plotHeight = canvasHeight - MARGINS.top - MARGINS.bottom;

var xRange = d3.scale.linear().range([MARGINS.left, plotWidth]);
var yRange = d3.scale.linear().range([plotHeight, MARGINS.top]);

xRange.domain([0, 8]);
yRange.domain([0, 8]);

var connect_the_dots = d3.svg.line()
  .x(function(d) { return xRange(d.x); })
  .y(function(d) { return yRange(d.y); })
  .interpolate("linear");

for (var i = 0; i < datas.length; i++)
{
	grails[i] = new Grail();
	grails[i].SetThinningThreshold(0.2);
	grails[i].SetCharacterCallback(OnCharacter);
	grails[i].SetSkipIdentification(true);
	setupLetter(i);
	updateLetter(i);
}


function OnCharacter(character, justifications) {
}

var isPlaying = false;
var currentPlayingCharacter = 0;
var currentFeedIndex = 0;

function feed() {
	var grail = grails[currentPlayingCharacter];
	var data = datas[currentPlayingCharacter];

	if (currentFeedIndex == 0)
	{
	  grail.OnPenDown(data[currentFeedIndex]);

		mouse_down_symbols[currentPlayingCharacter]
		  	.style("opacity", 1)
		  	.attr("transform", function() {
		    	d = grail.PenDownPos();
		    	return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";});
	  	mouse_up_symbols[currentPlayingCharacter]
	    	.style("opacity", 0);
	}
	else if (currentFeedIndex < data.length - 1)
	{
	  grail.OnPenMove(data[currentFeedIndex]);
	}
	else if (currentFeedIndex == data.length - 1)
	{
	  	grail.OnPenUp(data[currentFeedIndex]);
	  	mouse_up_symbols[currentPlayingCharacter]
	    	.style("opacity", 1)
	    	.attr("transform", function() {
	      		d = grail.PenUpPos();
	      		return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";});

	} else if (currentFeedIndex > data.length) {
		isPlaying = false;
	  	return true;
	}

	updateLetter(currentPlayingCharacter);
	currentFeedIndex++;
}


function playCharacter(i) {
	if (isPlaying) { return; }

	currentPlayingCharacter = i;
	isPlaying = true;

	grails[i].Init();
  	updateLetter(i);

	mouse_up_symbols[i]
	  .style("opacity", 0);

	currentFeedIndex = 0;
	d3.timer(feed, 100);
}

function setupLetter(i)
{
	var vis = d3.select('#threes_' + i);
	vis.on("mousedown", (function(tmp) { return function() { playCharacter(tmp);}; })(i));
	vis.on("touchstart", (function(tmp) { return function() { playCharacter(tmp);}; })(i));

	var grail = grails[i];
	thinned_paths.push(vis.append("path")
	  .attr("stroke", "lightgrey")
	  .attr("stroke-width", 2)
	  .attr("fill", "none"));

	var data = datas[i];
	for (var j = 0; j < data.length; j++)
	{
		if (j == 0)
		{
			grail.OnPenDown(data[j]);
		}
		else if (j < data.length - 1)
		{
			grail.OnPenMove(data[j]);
		}
		else if (j == data.length - 1)
		{
			grail.OnPenUp(data[j]);
		}
	}

	mouse_down_symbols.push(vis.append("path")
	  .attr("fill", "rgb(71, 157, 174)")
	  .attr("stroke", "rgb(71, 157, 174)")
	  .attr("stroke-width", 2)
	  .attr("d", d3.svg.symbol().type("circle").size(15))
	  .attr("transform", function() {
      	d = grail.PenDownPos();
      	return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";}));

	mouse_up_symbols.push(vis.append("path")
	  .attr("fill", "rgb(71, 157, 174)")
	  .attr("stroke", "rgb(71, 157, 174)")
	  .attr("stroke-width", 2)
	  .attr("d", d3.svg.symbol().type("square").size(15))
	  .attr("transform", function() {
      	d = grail.PenUpPos();
      	return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";}));
}

function updateLetter(i)
{
	var vis = d3.select('#threes_' + i);
	var grail = grails[i];

	var thinned_contour_points = vis.selectAll(".thinned_contour_points")
	  .data(grail.ThinnedCurvature());

	thinned_contour_points.enter().append("path")
	  .attr("class", "thinned_contour_points")
	  .attr("fill", "#444")
	  .attr("stroke", "#444")
	  .attr("d", d3.svg.symbol().type("triangle-up").size(7))
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
	  .transition()
	  .style("opacity", 1);

	thinned_contour_points
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

	thinned_paths[i]
	  .attr("d", connect_the_dots(grail.ThinnedData()));

	var corner_points = vis.selectAll(".corners").data(grail.CornerData());

	corner_points.enter().append("path")
	  .attr("class", "corners")
	  .attr("fill", "deeppink")
	  .attr("stroke", "deeppink")
	  .attr("d", d3.svg.symbol().type("cross").size(15))
	  .attr("transform", function(d) {
	    return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";
	    })
	  .style("opacity", 0)
	  .transition()
	  .style("opacity", 1);

	corner_points
	  .attr("transform", function(d) {
	    return "translate(" + xRange(d.x) + "," + yRange(d.y) + ")";
	    });

	corner_points.exit().remove();
}

}) ();



