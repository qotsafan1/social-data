function geoGraph() {
  var svg = d3.select("#geoGraph")
              .append("svg")
              .attr("width", 800)
              .attr("height", 500);
  var margin = {top: 40, right: 80, bottom: 40, left: 50},
  	width = svg.attr("width") - margin.left - margin.right,
  	height = svg.attr("height") - margin.top - margin.bottom,
  	g = svg.append("g").attr("transform", "translate(" + margin.left + "," +margin.top + ")"),
    x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

  //Define map projection
  var projection = d3.geoMercator()
               .translate([width, height/2])
               .scale(180000)
               .center([-122.381, 37.770]);

  var path = d3.geoPath().projection(projection);

  var xScale = d3.scaleBand()
            .domain(d3.range(24))
            .rangeRound([0, width/2])
            .padding(0.1);
  var yScale;

  d3.csv("income.csv", function(incomeData) {
    for (var i in incomeData) {
      if (!("year" in incomeData[i])) {
        continue;
      }

      var year = incomeData[i]["year"];
      if (!(year in income)) {
        income[year] = [];
      }

      var geo = incomeData[i]["geo"].substring('14000US'.length);
      income[year][geo] = incomeData[i]["income"];
    }
    console.log(income)
  });
  //Load in GeoJSON data
  d3.json("geo_data.json", function(json) {
    //Bind data and create one path per GeoJSON feature
    console.log(json)
    geo = svg.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("class", "geo")
       .attr("data-geo", function(d) {         
         return d.properties.GEOID;
       })
       .attr("d", path);
       //.style("fill", function(d, i) {
        //  return boroColor[i];
       //});
    circles = svg.selectAll("circle")
     .data(circleData)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
       return projection([d.Longitude, d.Latitude])[0];
     })
     .attr("cy", function(d) {
       return projection([d.Longitude, d.Latitude])[1];
     })
     .attr("r", 2.5)
     .attr("class", "brushed")
     .attr("data-time", function(d) {
       return d.Opened;
     });

     gBrush.call(brush.move, [200, 400]);
  });
}
