function dayChart() {
  var svg = d3.select("#dayChart")
              .append("svg")
              .attr("width", 800)
              .attr("height", 250);
  var margin = {top: 40, right: 80, bottom: 40, left: 50},
  	width = svg.attr("width") - margin.left - margin.right,
  	height = svg.attr("height") - margin.top - margin.bottom,
    x = d3.scaleTime()
          .domain([new Date("January 1, 2013"), new Date("January 1, 2016")])
          .range([0,width]);

  var max = d3.max(dayData, function(d) {
    return d.sum;
  });

  var y = d3.scaleLinear()
               .domain([0, max])
               .rangeRound([height, 5]);

  brush = d3.brushX()
               .extent([[0, 0], [width, height]])
               .on("end brush", brushed);

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," +margin.top + ")")

  gBrush = g.append("g").call(brush);

  var parseDate = d3.timeParse("%m/%d/%Y");

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", -50)
    .attr("dy", "0.9em")
    .attr("fill", "#000")
    .text("311 complaints");

  g.selectAll(".day-bar")
    .data(dayData)
    .enter().append("rect")
      .attr("class", "day-bar")
      .attr("x", function(d, i) {
        return x(parseDate(d.date));
      })
      .attr("y", function(d) { return y(d.sum); })
      .attr("width", width/1095)
      .attr("height", function(d) { return height - y(d.sum); })

  var title = svg.append("g")
  	.attr("class", "title");
  title.append("text")
  	.attr("x", (width/1.80))
  	.attr("y", 30)
  	.attr("text-anchor", "middle")
  	.style("font", "20px sans-serif")
  	.text("311 complaints for homeless concerns in San Francisco by day");


    function brushed() {
      if (d3.event.selection == null) {
        return;
      }
      var extent = d3.event.selection.map(x.invert, x);
      var firstTime = extent[0].getTime();
      var lastTime = extent[1].getTime();
      var incomeYear = extent[0].getFullYear();

      circles.filter(function() {
        var date = parseTime(this.getAttribute('data-time'));
        var time = date.getTime();

        if (firstTime > time || lastTime < time) {
          this.classList.add('non_brushed');
          this.classList.remove('brushed');
        } else {
          this.classList.add('brushed');
          this.classList.remove('non_brushed');
        }
      });
console.log("hingad")
      geo.filter(function() {
        var geo = this.getAttribute('data-geo');

        if (geo in income[incomeYear]) {
          var geoIncome = parseInt(income[incomeYear][geo]);
          if (geoIncome < 20000) {
            this.setAttribute("style", "fill: #ffe6e6;");
          } else if (geoIncome < 30000) {
            this.setAttribute("style", "fill: #ffb3b3;");
          } else if (geoIncome < 40000) {
            this.setAttribute("style", "fill: #ff8080;");
          } else if (geoIncome < 50000) {
            this.setAttribute("style", "fill: #ff4d4d;");
          } else if (geoIncome < 60000) {
            this.setAttribute("style", "fill: #ff1a1a;");
          } else if (geoIncome < 70000) {
            this.setAttribute("style", "fill: #e60000;");
          } else if (geoIncome < 80000) {
            this.setAttribute("style", "fill: #cc0000;");
          } else if (geoIncome < 90000) {
            this.setAttribute("style", "fill: #b30000;");
          } else if (geoIncome < 100000) {
            this.setAttribute("style", "fill: #990000;");
          } else if (geoIncome < 110000) {
            this.setAttribute("style", "fill: #800000;");
          } else if (geoIncome < 120000) {
            this.setAttribute("style", "fill: #660000;");
          } else if (geoIncome < 130000) {
            this.setAttribute("style", "fill: #4d0000;");
          } else if (geoIncome < 140000) {
            this.setAttribute("style", "fill: #330000;");
          } else if (geoIncome < 150000) {
            this.setAttribute("style", "fill: #1a0000;");
          } else if (geoIncome < 160000) {
            this.setAttribute("style", "fill: #000000;");
          }

        } else {
          this.setAttribute("style", "fill: white;");
        }
      })

    }
}

function animateBrush() {
  gBrush.call(brush.move, [0, 2]);
  gBrush.transition()
    .duration(60000)
    .ease(d3.easeLinear)
    .call(brush.move, [800-132, 800-130]);
}
