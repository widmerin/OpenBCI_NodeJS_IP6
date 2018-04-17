/**
 * plot data with d3js
 */
var data = null;

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

loadJSON(function (response) {
    // Parse JSON string into object
    data = JSON.parse(response);
});

//tweak data
data.forEach(function (d) {
    d.datetime = parseDateTime(d.timestamp);
    d.channel2 = d.channelData[1] * 1000000;
});

// set the dimensions of the canvas
var margin = { top: 60, right: 60, bottom: 60, left: 60 },
    width = 900 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// set the ranges/scales
var minDate = data[0].datetime;     
var size = Object.keys(data).length;   
var maxDate = data[size-1].datetime; 
//console.log(minDate);

//x Axis Scale by data[]_count
var x = d3.scaleLinear()
        .domain([0,size-1])
        .range([0, width]);

var minCh2 = 10000;        
var maxCh2 = 0; 
data.forEach(function (d) {
    if(maxCh2<d.channel2){
        maxCh2=d.channel2;
    }
    if(minCh2>d.channel2){
        minCh2=d.channel2;
    }
});

// y Axis Scale by Channel 2 values min - max
var y = d3.scaleLinear()
         .domain([minCh2,maxCh2])
         .range([height, 0]);

// define the axis
var xAxis = d3.axisBottom(x).ticks(10);
var yAxis = d3.axisLeft(y).ticks(10);

// add the SVG element
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// y-axis
svg.append("g")
    .call(yAxis);

// y-axis Label
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("EEG Volts");
    
// x-axis
svg.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis)

// x-axis Label
svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom -5) + ")")
    .style("text-anchor", "middle")
    .text("Samples 250Hz");

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d._count); })
    .y(function(d) { return y(d.channel2); });

// Add the valueline path.
svg.append("path")
  .data([data])
  .attr("class", "line")
  .attr("d", valueline);

// get human readable time
function parseDateTime(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    var millisec = a.getMilliseconds() < 10 ? '00' + a.getMilliseconds() : a.getMilliseconds() < 100 ? '0' + a.getMilliseconds() : a.getMilliseconds();;
    var time = hour + ':' + min + ':' + sec + ':' + millisec;
    return time;
}
