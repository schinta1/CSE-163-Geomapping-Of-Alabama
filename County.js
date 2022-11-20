var toggleBorders = false;
var width = 960,
    height = 600;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

function update(toggle) {
    if (toggleBorders) {
        toggleBorders = false;
    } else {
        toggleBorders = true;
    }
    
    svg.selectAll("*").remove();

    var g = svg.append("g");

    var color = d3.scaleThreshold()
        .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
        .range(d3.schemeOrRd[9]);

    var x = d3.scaleSqrt()
        .domain([0, 4500])
        .rangeRound([440, 950]);

    g.append("g")
        .attr("class", "key")
        .attr("transform", "translate(0,40)");

    g.selectAll("rect")
      .data(color.range().map(function(d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
      .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) { return x(d[0]); }) // RANSKATAL
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function(d) { return color(d[0]); });

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -10)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Population per square mile");

    g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickValues(color.domain()))
        .attr("transform", "translate(-400,20)")
      .select(".domain")
        .remove();

    function findDensity(data, name) {
        var adder = " County";
        var checker = name.concat(adder);

        for (var i = 0; i < data.length; i++) {
            if (data[i].county === checker) {
                return data[i].density;
            }
        }

        return -1;
    }


d3.json("Alabama.json", function(error, al) { 
    d3.csv("Counties.csv", function(error,data){
      if (error) throw error;
      console.log(al);
      if (error) throw error;
      console.log(data);
      function mouseover (d) {
            tooltip
                .style("opacity", 1);
        }
        function mouseon (d) {
            console.log(d);
            tooltip
                .html("County Name: " + d.properties.NAME + " Country<br>Population Density: " + findDensity(data, d.properties.NAME));
        }
        function mouseout (d) {
            tooltip
              .style("opacity", 0);
        }

      var counties = topojson.feature(al, al.objects.cb_2015_alabama_county_20m);

      var projection = d3.geoAlbersUsa()
                         .scale(3500)
                         .translate([width/64, height/64 ]);
      var path = d3.geoPath().projection(projection);


      g.append("g")
          .attr("class", "counties")
          .selectAll("path")
          .data(topojson.feature(al, al.objects.cb_2015_alabama_county_20m).features)
          .enter().append("path")
            .attr("fill", function(d) { return color(findDensity(data, d.properties.NAME)); })
            .attr("d", path)
            .on("mouseover", function(d) {mouseover(d);})
            .on("mousemove", function(d) {mouseon(d);})
            .on("mouseout", function(d) {mouseout(d);});

            if (toggleBorders){
                g.append("path")
                   .attr("class", "county-borders")
                   .datum(topojson.mesh(al,al.objects.cb_2015_alabama_county_20m, function(a,b){return a!= b}))
                   .attr("d", path)
        
    
            }
        }); // csv
    }); // json
}

//defining tooltip same code as last assignment
 var tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");
        
update();