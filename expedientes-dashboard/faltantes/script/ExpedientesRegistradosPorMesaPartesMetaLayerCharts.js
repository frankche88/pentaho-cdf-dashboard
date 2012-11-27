
MetaLayerCharts =  {

	pieChartClicked:function(value){
        console.log(value);
	},
	
	chartPorDivisionClicked:function(value){
        console.log(value);
		//MetaLayerCharts.departmentMeasure = "[Department].[All Departments].[" + value + "]";
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
		title: "Top por proceso:",
		query: function() { return QueryNoAtendidos.queryTop5PorProceso(parametrosNoAtendidos.division, parametrosNoAtendidos.startDate, parametrosNoAtendidos.endDate);}
	},
    
    Top5PorUsuarioPieChart : {
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
		title: "Top por usuario:",
		query: function() { return QueryNoAtendidos.queryTop5PorUsuario(parametrosNoAtendidos.division, parametrosNoAtendidos.startDate, parametrosNoAtendidos.endDate);}
	},
		
	chartPorDivision : {
		width: 340,
		chartType: "BarChart",
		datasetType: "CategoryDataset",
        orientation:"horizontal",
		is3d: "true",
		isStacked: "true",
		includeLegend: "false",
		foregroundAlpha: 0.7,
		queryType: 'sql',
		jndi: constantes.JNDI,
		title: "Expedientes no atendidos por division:",
		urlTemplate: "javascript:MetaLayerCharts.chartPorDivisionClicked(encode_prepare('{department}'))",
		parameterName: "department",
		query: function() { 
            console.log(QueryNoAtendidos.queryPorDivision(parametrosNoAtendidos.division, parametrosNoAtendidos.startDate, parametrosNoAtendidos.endDate));
            return QueryNoAtendidos.queryPorDivision(parametrosNoAtendidos.division, parametrosNoAtendidos.startDate, parametrosNoAtendidos.endDate);
        }
	},
    
    selectGerenciaDefinition : {
        queryType: 'sql',
		jndi: constantes.JNDI,
        query: function() { return QueryNoAtendidos.queryGerencia();}
    },
    tablaPorRendimientoDefinition: {
        colHeaders: ["Customers","Sales"],
        colTypes: ['string','numeric'],
        colFormats: [null,'%.0f'],
        colWidths: ['60%',null],
        queryType: 'sql',
        displayLength: 5,
        jndi: constantes.JNDISAMPLE,
        query: function() { return QueryNoAtendidos.tablaPorRendimiento();},
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