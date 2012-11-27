
MetaLayerCharts =  {
    anio:"2005",
	regionsMeasure: "[Region].[All Regions]",
	selectedRegionMeasure : "[Region].[All Regions]",
	departmentMeasure: "[Department].[All Departments]",

	pieChartClicked:function(value){
        alert(value);
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
        alert(value);
		MetaLayerCharts.departmentMeasure = "[Department].[All Departments].[" + value + "]";
		//Dashboards.fireChange("MetaLayerCharts.departmentMeasure",MetaLayerCharts.departmentMeasure);
	},

	Top5PorProcesoPieChart : {
		width: 300,
		height: 200,
		chartType: "PieChart",
		datasetType: "CategoryDataset",
		is3d: "true",
		isStacked: "true",
		includeLegend: "false",
		foregroundAlpha: 0.7,
		queryType: 'sql',
		jndi: constantes.JNDI,
		urlTemplate: "javascript:MetaLayerCharts.pieChartClicked( encode_prepare('{region}') )",
		parameterName: "region",
		title: "First choose region:",
		query: function() { return QueryDocumentosRegistrados.queryTop5PorProceso(MetaLayerCharts.anio);}
	},
		
	chartPorDivision : {
		width: 300,
		height: 250,
		chartType: "BarChart",
		datasetType: "CategoryDataset",
		is3d: "true",
		isStacked: "true",
		includeLegend: "false",
		foregroundAlpha: 0.7,
		queryType: 'sql',
		jndi: constantes.JNDI,
		title: "Analisis por departamento:",
		urlTemplate: "javascript:MetaLayerCharts.barChartClicked(encode_prepare('{department}'))",
		parameterName: "department",
		query: function() { return QueryDocumentosRegistrados.queryPorDivision(MetaLayerCharts.anio);}
	},
    
    selectGerenciaDefinition : {
        queryType: 'sql',
		jndi: constantes.JNDI,
        query: function() { return QueryDocumentosRegistrados.queryGerencia();}
    },
	
	dialChartDefinition : {
		width: 300,
		height: 200,
		chartType: "DialChart",
		queryType: 'mdx',
		is3d: 'true',
		jndi: constantes.JNDISAMPLE,
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
    
    tablaPorRendimientoDefinition: {
        colHeaders: ["Expedientes","Cantidad"],
        colTypes: ['string','numeric'],
        colFormats: [null,'%.0f'],
        colWidths: ['60%',null],
        queryType: 'sql',
        displayLength: 5,
        jndi: constantes.JNDISAMPLE,
        query: function() { return QueryDocumentosRegistrados.tablaPorRendimiento();},
        oLanguage : {
            "sProcessing" : "Ejecutando...",
            "sLengthMenu" : "Mostrar _MENU_ registos",
            "sZeroRecords" : "No se han encontrado resultados",
            "sInfo" : "Mostrando de _START_ al _END_ de _TOTAL_ registos",
            "sInfoEmpty" : "Mostrando 0 de 0 registros",
            "sInfoFiltered" : "(_MAX_ registros filtrados en total)",
            "sInfoPostFix" : "",
            "sSearch" : "Buscar:",
            "sUrl" : "",
                "oPaginate" : {
                "sFirst" : "Primero",
                "sPrevious" : "Anterior",
                "sNext" : "Siguiente",
                "sLast" : "Ultimo"
            }
        }
    }
}