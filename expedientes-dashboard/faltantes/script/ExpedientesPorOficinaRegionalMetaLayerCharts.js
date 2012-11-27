

var MetaLayerCharts =  {

	regionsMeasure: "[Region].[All Regions]",
	selectedRegionMeasure : "[Region].[All Regions]",
	departmentMeasure: "[Department].[All Departments]",

	pieChartClicked:function(value){
		if(value == "All Regions"){
			MetaLayerCharts.regionsMeasure = "[Region].[All Regions].Children";
			Dashboards.fireChange("MetaLayerCharts.regionsMeasure",MetaLayerCharts.regionsMeasure);
		}
		else
		{
			MetaLayerCharts.selectedRegionMeasure = "[Region].[All Regions].["+ value + "]";
			Dashboards.fireChange("MetaLayerCharts.selectedRegionMeasure",MetaLayerCharts.selectedRegionMeasure);
		}
	},
	
	barChartClicked:function(value){
	
		MetaLayerCharts.departmentMeasure = "[Department].[All Departments].[" + value + "]";
		Dashboards.fireChange("MetaLayerCharts.departmentMeasure",MetaLayerCharts.departmentMeasure);
	},

	pieChartDefinition : {
		width: 300,
		height: 200,
		chartType: "PieChart",
		datasetType: "CategoryDataset",
		is3d: "true",
		isStacked: "true",
		includeLegend: "false",
		foregroundAlpha: 0.7,
		queryType: 'mdx',
		jndi: "SampleData",
		catalog: "solution:steel-wheels/analysis/SampleData.mondrian.xml",
		urlTemplate: "javascript:MetaLayerCharts.pieChartClicked( encode_prepare('{region}') )",
		parameterName: "region",
		title: "First choose region:",
		query: function(){
		
		var query = "with member [Measures].[Variance Percent] as '([Measures].[Variance] / [Measures].[Budget])',"+ 
			" format_string = IIf(((([Measures].[Variance] / [Measures].[Budget]) * 100.0) > 2.0), \"|#.00%|style='green'\","+ 
            " IIf(((([Measures].[Variance] / [Measures].[Budget]) * 100.0) < 0.0), \"|#.00%|style='red'\", \"#.00%\"))" +
			" select NON EMPTY {[Measures].[Actual], [Measures].[Budget], [Measures].[Variance], [Measures].[Variance Percent]} ON COLUMNS," +
			" NON EMPTY ( " + MetaLayerCharts.regionsMeasure + " ) ON ROWS " +
			" from [Quadrant Analysis]";
			
			return query;
		}
	},
		
		barChartDefinition : {
		width: 300,
		height: 250,
		chartType: "BarChart",
		datasetType: "CategoryDataset",
		is3d: "true",
		isStacked: "true",
		includeLegend: "false",
		foregroundAlpha: 0.7,
		queryType: 'mdx',
		jndi: "SampleData",
		catalog: "solution:steel-wheels/analysis/SampleData.mondrian.xml",
		title: "Then analyse departments:",
		urlTemplate: "javascript:MetaLayerCharts.barChartClicked(encode_prepare('{department}'))",
		parameterName: "department",
		query: function(){
		
		var query = "with member [Measures].[Variance Percent] as '([Measures].[Variance] / [Measures].[Budget])',"+ 
			" format_string = IIf(((([Measures].[Variance] / [Measures].[Budget]) * 100.0) > 2.0), \"|#.00%|style='green'\","+ 
            " IIf(((([Measures].[Variance] / [Measures].[Budget]) * 100.0) < 0.0), \"|#.00%|style='red'\", \"#.00%\"))" +
			" select NON EMPTY {[Measures].[Actual], [Measures].[Budget], [Measures].[Variance], [Measures].[Variance Percent]} ON COLUMNS," +
			" NON EMPTY ([Department].[All Departments].Children ) ON ROWS " +
			" from [Quadrant Analysis]" +
			" where (" + MetaLayerCharts.selectedRegionMeasure + ")";
			
			return query;
		}
	},
	
	dialChartDefinition : {
		width: 300,
		height: 200,
		chartType: "DialChart",
		queryType: 'mdx',
		is3d: 'true',
		jndi: "SampleData",
		title: "Check current budget",
		catalog: "solution:steel-wheels/analysis/SampleData.mondrian.xml",
		//colors: ["#F16C3A","#FFFF00","#B0D837"],
		intervals: [7000000,70000000,150000000],
		includeLegend: true,
		
		query: function(){
			
			var query =  " select NON EMPTY [Measures].[Budget] ON COLUMNS," +
			" NON EMPTY (" + MetaLayerCharts.departmentMeasure + " ) ON ROWS " +
			" from [Quadrant Analysis]";
			
			return query;
		}
	},
    mapMarkerClick: function(idMarker){
        console.log(idMarker);
    }
};

// creando los ping del mapa
MetaLayerCharts.Marks = [];

    var data = [{name:"tumbes",x:120,y:186},{name:"piura",x:125,y:250},{name:"lambayeque",x:151,y:310},{name:"la libertad",x:233,y:400},{name:"cajamarca",x:209,y:334},{name:"amazonas",x:239,y:248},{name:"san martin",x:299,y:358},{name:"loreto",x:397,y:220},{name:"ancash",x:258,y:457},{name:"huanuco",x:328,y:459},{name:"ucayali",x:474,y:482},{name:"pasco",x:385,y:504},{name:"junin",x:384,y:566},{name:"madre de dios",x:606,y:599},{name:"huancavelica",x:397,y:634},{name:"ayacucho",x:433,y:677},{name:"apurimac",x:492,y:701},{name:"cuzco",x:525,y:637},{name:"puno",x:637,y:716},{name:"arequipa",x:513,y:779},{name:"moquegua",x:594,y:823},{name:"tacna",x:619,y:876},{name:"ica",x:365,y:714},{name:"lima provincias",x:301,y:547},{name:"lima",x:314,y:616},{name:"callao",x:299,y:610}];
    
    for (var m in data){
        var mark = {
            xy: [data[m].x, data[m].y], // x-y coodinates - works for all maps, including World Map
            tooltip: 'Oficina Regional ' + data[m].name,
            attrs: {
                href: 'javascript:MetaLayerCharts.mapMarkerClick( "' + data[m].name + '")',            // link
                src:  'resources/markers/_pin_default.png',     // image for marker
            }
        };
        MetaLayerCharts.Marks.push(mark);
    }