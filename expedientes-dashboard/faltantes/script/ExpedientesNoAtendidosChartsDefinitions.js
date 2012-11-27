
ChartDefinitions =  {

    postFetch: function(values){
		console.log("postfech:" + values);
		for(var a=1;a<values.metadata.length;a++){
			var current = values.metadata[a];
			current.colType ="Numeric";
		}
		for(var a=0;a<values.resultset.length;a++){
			var current = values.resultset[a];
			current[1] = parseFloat(current[1]);
		}
		console.log(values);
		return values;
	},
    postFetchTable: function(values){
		console.log("postfech:" + values);
        var metadata = [
        {colIndex:0,
        colName:"Unida",
        colType:"String"},
        {colIndex:1,
        colName:"No Atendidos",
        colType:"String"},
        {colIndex:2,
        colName:"Atendidos",
        colType:"String"},
        {colIndex:3,
        colName:"Total",
        colType:"String"}
        ];
        values.metadata = metadata;
		// reconstruir valores
        if(values.resultset.length>0){
            var resultset = [];
            var preValue = values.resultset[0];
            var atendidos = 0;
            var noAtendidos = 0;
            var total = 0;
            var division ="";
            
            for(var a=0;a<values.resultset.length;a++) {
                var current = values.resultset[a];
                
                if(current[0]==preValue[0] && current[1]==preValue[1]) {
                    //quitamos el primero
                    division = current[1];
                    if(current[0]=="ATENDIDO") {
                        atendidos = parseInt(current[2]);
                    }else {
                        noAtendidos = parseInt(current[2]);
                    }
                    continue;
                }else {
                    if(current[1]==preValue[1]) {
                        division = current[1];
                        if(current[0]=="ATENDIDO") {
                            atendidos = parseInt(current[2]);
                        }else {
                            noAtendidos = parseInt(current[2]);
                        }
                    } else {
                        total = noAtendidos + atendidos;
                        resultset.push([division, noAtendidos, atendidos, total]);
                        division = current[1];
                        noAtendidos = 0;
                        atendidos = 0;
                        total = 0;
                        
                        if(current[0]=="ATENDIDO") {
                            atendidos = parseInt(current[2]);
                        }else {
                            noAtendidos = parseInt(current[2]);
                        }
                        
                    }
                    // para la siguiente iteracion
                    preValue = current;
                }
            }
            if(division != preValue[1]){
                division = preValue[1];
                atendidos = 0;
                noAtendidos = 0;
            }
            if(current[0]=="ATENDIDO") {
                atendidos = parseInt(current[2]);
            }else {
                noAtendidos = parseInt(current[2]);
            }
            total = noAtendidos + atendidos;
            resultset.push([division, noAtendidos, atendidos, total]);
            
        }
		console.log(values);
		console.log(resultset);
        values.resultset = resultset;
		return values;
	},


//Protovis chart
    atendidosVsNoChartDefinition: {
		width: 360,
        height: 680,
        title: "Expedientes Atendidos y No Atendidos",
        orientation: 'horizontal',
        legend:true,
        barSizeRatio:0.2,
        maxBarSize:100,
        yAxisPosition: "left",
        yAxisSize: 150,
        yAxisEndLine:  true,
        legendPosition:"right",
        stacked: true, 
        animate:false,
        selectable: true,
        orthoFixedMax: 60,
        crosstabMode: false,
        seriesInRows: false,
        colors: ["#00FF00","#FF0000"],
        extensionPoints: [["barLabel_text",function(d){return ' ' + ((d*100).toFixed(2)) + '%'}]],
        jndi: constants.JNDI,
        queryType: 'sql',
		query: function() { 
            console.log(QueryNoAtendidos.chartAtendidosVsNo(parameters));
            return QueryNoAtendidos.chartAtendidosVsNo(parameters);
        }
    },
    porFlujoAtendidosChartDefinition: {
        width: 360,
		height: 600,
		animate: false,
		title: "Atendidos",
		titlePosition: "top",
		titleSize: 40,
		legend: true,
		legendPosition: "right",
		legendAlign: "right",
		legendDrawLine: false,
		legendDrawMarker: true,
		showTooltips: true,
		legendPadding: 20,
		legendTextAdjust: 4,
		innerGap: 0.8,
		showValues: true,
		colors: ["#bbeeff" ,"#bbffff" ,"#00bbff" ,"#2200ee" ,"#11ddff" ,"#33ddff" ,"#77eeff" ,"#ccddff" ,"#44ccff" ,"#0033ee" ,"#2211ff" ,"#8833ff" ,"#bb88ff" ,"#ccbbff"],
		extensionPoints: [
			["base_fillStyle", "lightgray"],
			["title_fillStyle", "lightblue"],
			["titleLabel_font", "16px sans-serif"],
			["legend_fillStyle", "green"],
			["chart_fillStyle", "#eee"],
            ["titleLabel_font", "12px sans-serif"],
            ["pieLabel_text",function(d, a) {
                    var total = piechartPorFlujoAtendidos.chart.pieChartPanel.sum;
                    return (d/total*100).toFixed(2) + "%";
                }
            ]
		],
        jndi: constants.JNDI,
        queryType: 'sql',
        query: function() {
            console.log(QueryNoAtendidos.flujoAtendidos(parameters));
            return QueryNoAtendidos.flujoAtendidos(parameters);
        }
    },
    porFlujoNoAtendidosChartDefinition: {
        width: 360,
		height: 600,
		animate: false,
		title: "No atendidos",
		titlePosition: "top",
		titleSize: 40,
		legend: true,
		legendPosition: "right",
		legendAlign: "right",
		legendDrawLine: false,
		legendDrawMarker: true,
		showTooltips: true,
		legendPadding: 20,
		legendTextAdjust: 4,
		innerGap: 0.8,
		showValues: true,
		colors: ["#bbeeff" ,"#bbffff" ,"#00bbff" ,"#2200ee" ,"#11ddff" ,"#33ddff" ,"#77eeff" ,"#ccddff" ,"#44ccff" ,"#0033ee" ,"#2211ff" ,"#8833ff" ,"#bb88ff" ,"#ccbbff"],
		extensionPoints: [
			["base_fillStyle", "lightgray"],
			["title_fillStyle", "lightblue"],
			["titleLabel_font", "16px sans-serif"],
			["legend_fillStyle", "green"],
			["chart_fillStyle", "#eee"],
            ["titleLabel_font", "18px sans-serif"],
            ["pieLabel_text",function(d, a) {
                    var total = piechartPorFlujoNoAtendidos.chart.pieChartPanel.sum;
                    return (d/total*100).toFixed(2) + "%";
                }
            ]
		],
        jndi: constants.JNDI,
        queryType: 'sql',
        query: function() { 
            console.log(QueryNoAtendidos.flujoNoatendidos(parameters));
            return QueryNoAtendidos.flujoNoatendidos(parameters);
        }
    },
    atendidosVsNoTableDefinition: {
        colHeaders: ["Unidad","Expedientes no atendidos","Expedientes atendidos", "total"],
        colTypes: ['string','numeric','numeric','numeric'],
        colFormats: [null,'%.0f','%.0f','%.0f'],
        colWidths: ['40%','20%','20%','20%'],
        queryType: 'sql',
        displayLength: 5,
        jndi: constants.JNDI,
        query: function() { 
            console.log(QueryNoAtendidos.tablaAtendidosVsNo(parameters));
            return QueryNoAtendidos.tablaAtendidosVsNo(parameters);
        },
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