function barChart() {
  var svg = d3.select("#barChart")
              .append("svg")
              .attr("width", 800)
              .attr("height", 500);
  var margin = {top: 40, right: 80, bottom: 40, left: 50},
  	width = svg.attr("width") - margin.left - margin.right,
  	height = svg.attr("height") - margin.top - margin.bottom,
  	g = svg.append("g").attr("transform", "translate(" + margin.left + "," +margin.top + ")"),
    x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

  x.domain(barData.map(function(d) { return d.year; }));
  y.domain([0, d3.max(barData, function(d) { return d.sum; })]);

  // Define the div for the tooltip
  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", -170)
    .attr("dy", "0.9em")
    .attr("fill", "#000")
    .text("311 complaints");

  g.append("g")
    .append("text")
    .attr("y", height+35)
    .attr("x", width/2)
    .attr("fill", "#000")
    .style("font-size", "12px")
    .text("Year");


  g.selectAll(".bar")
    .data(barData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y(d.sum); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.sum); })
      .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.sum)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0)
        });;

  var title = svg.append("g")
  	.attr("class", "title");
  title.append("text")
  	.attr("x", (width/1.80))
  	.attr("y", 30)
  	.attr("text-anchor", "middle")
  	.style("font", "20px sans-serif")
  	.text("311 complaints for homeless concerns in San Francisco by year");
}
