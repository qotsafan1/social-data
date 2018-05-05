var svgStacked = d3.select("#stackedArea")
        .append("svg")
        .attr("width", 800)
        .attr("height", 500);

function StackedArea() {
  this.margin = {top: 40, right: 80, bottom: 40, left: 50};
  this.width = svgStacked.attr("width") - this.margin.left - this.margin.right;
  this.height = svgStacked.attr("height") - this.margin.top - this.margin.bottom;

  this.parseDate = d3.timeParse('%b');

  this.x = d3.scaleTime()
      .range([0, this.width]);

  this.y = d3.scaleLinear()
      .range([this.height, 0]);

  this.color = d3.scaleOrdinal(d3.schemeCategory20);

  this.xAxis = d3.axisBottom()
      .scale(this.x);

  this.yAxis = d3.axisLeft()
      .scale(this.y);

  this.area = d3.area()
      .x(function(d) {
        return stackedArea.x(d.data.date); })
      .y0(function(d) { return stackedArea.y(d[0]); })
      .y1(function(d) { return stackedArea.y(d[1]); });

  this.stack = d3.stack();

  this.g = svgStacked.append("g").attr("transform", "translate(" + this.margin.left + "," +this.margin.top + ")");

}

var stackedArea = new StackedArea();
console.log(stackedArea);

function updateStackedArea(data) {
  console.log(data)
  stackedArea.color.domain(d3.keys(data[0]).filter(function(key) { return key !== 'date'; }));
  var keys = d3.keys(data[0]).filter(function(key) { return key !== 'date'; });

  var maxDateVal = d3.max(data, function(d){
    var vals = d3.keys(d).map(function(key){ return key !== 'date' ? d[key] : 0 });
    return d3.sum(vals);
  });

  // Set domains for axes
  stackedArea.x.domain(d3.extent(data, function(d) { return d.date; }));
  stackedArea.y.domain([0, maxDateVal])

  stackedArea.stack.keys(keys);

  stackedArea.stack.order(d3.stackOrderNone);
  stackedArea.stack.offset(d3.stackOffsetNone);

  console.log(stackedArea.stack(data));

  var browser = svgStacked.selectAll('.browser')
      .data(stackedArea.stack(data))
    .enter().append('g')
      .attr('class', function(d){ return 'browser ' + d.key; })
      .attr('fill-opacity', 0.5);

  browser.append('path')
      .attr('class', 'area')
      .attr('d', stackedArea.area)
      .style('fill', function(d) { return stackedArea.color(d.key); });
/*
  browser.append('text')
      .datum(function(d) { return d; })
      .attr('transform', function(d) { return 'translate(' + x(data[13].date) + ',' + y(d[13][1]) + ')'; })
      .attr('x', -6)
      .attr('dy', '.35em')
      .style("text-anchor", "start")
      .text(function(d) { return d.key; })
      .attr('fill-opacity', 1);
*/
  svgStacked.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + stackedArea.height + ')')
      .call(stackedArea.xAxis);

  svgStacked.append('g')
      .attr('class', 'y axis')
      .call(stackedArea.yAxis);

  svgStacked.append ("text")
    .attr("x", 0-stackedArea.margin.left)
    .text("Billions of liters")
}
