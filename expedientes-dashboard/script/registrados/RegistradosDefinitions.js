   // lenguaje
   Tables = {};
    Tables.oLanguage = {
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

TableDefinitions = {
    postFetchFirmados: function(values){
		return TableDefinitions.postFetchTable(values,"USUARIO FINAL");
	},
    postFetchEnumerados: function(values){
		return TableDefinitions.postFetchTable(values,"USUARIO FINAL");
	},
    postFetchEnumeradosFirmados: function(values){
		return TableDefinitions.postFetchTable(values,"ENUMERADOS");
	},
    registrados: {
        colHeaders: ["Unidad","Mesa de Partes","Usuario Final", "total"],
        colTypes: ['string','numeric','numeric','numeric'],
        colFormats: [null,'%.0f','%.0f','%.0f'],
        colWidths: ['40%','20%','20%','20%'],
        queryType: 'sql',
        displayLength: 10,
		filter: false,
		info: false,
		sort: true,
		sortBy: [["1","desc"]],
		lengthChange: false,
		tableStyle: "classic",
        jndi: constants.JNDI,
        query: function() { 
            var query = RegistradosQuery.tableRegistrados(parameters);
            return query;
        },
        oLanguage : Tables.oLanguage,
        "drawCallback" : function( component){
            var aoData = component.aoData;
             
            var iTotalExpedientes = 0;
            var iTotalAtendidos = 0;
            var iTotalNoAtendidos = 0;
            for ( var i=0 ; i<aoData.length ; i++ ) {
                var rowData = aoData[i]._aData;
                iTotalExpedientes += rowData[3]*1;
                iTotalAtendidos += rowData[2]*1;
                iTotalNoAtendidos += rowData[1]*1;
            }
            $('#tableRegistradosTable > tbody:first').append('<tr><td class="column0 string" style="text-width:bold">Total</td><td class="column1 numeric">' +iTotalNoAtendidos + '</td><td class="column2 numeric">' + iTotalAtendidos+ '</td><td class="column3 numeric">' + iTotalExpedientes+ '</td></tr>');
        }
    },
    enMesaDePartes: {
        colHeaders: ["Flujo de Documentos","Mesa de Partes","Firmados", "total"],
        colTypes: ['string','numeric','numeric','numeric'],
        colFormats: [null,'%.0f','%.0f','%.0f'],
        colWidths: ['40%','20%','20%','20%'],
        queryType: 'sql',
        displayLength: 10,
		filter: false,
		info: false,
		sort: true,
		sortBy: [["1","desc"]],
		lengthChange: false,
		tableStyle: "classic",
        jndi: constants.JNDI,
        query: function() { 
            var query = RegistradosQuery.tableEnMesaDePartes(parameters);
            return query;
        },
        oLanguage : Tables.oLanguage,
        "drawCallback" : function( component){
            var aoData = component.aoData;
             
            var iTotalExpedientes = 0;
            var iTotalAtendidos = 0;
            var iTotalNoAtendidos = 0;
            for ( var i=0 ; i<aoData.length ; i++ ) {
                var rowData = aoData[i]._aData;
                iTotalExpedientes += rowData[3]*1;
                iTotalAtendidos += rowData[2]*1;
                iTotalNoAtendidos += rowData[1]*1;
            }
            $('#tableEnMesaDePartesTable > tbody:first').append('<tr><td class="column0 string" style="text-width:bold">Total</td><td class="column1 numeric">' +iTotalNoAtendidos + '</td><td class="column2 numeric">' + iTotalAtendidos+ '</td><td class="column3 numeric">' + iTotalExpedientes+ '</td></tr>');
        }
    },
    enUsuarioFinal: {
        colHeaders: ["Flujo de Documentos","Mesa de partes","Usuario Final", "total"],
        colTypes: ['string','numeric','numeric','numeric'],
        colFormats: [null,'%.0f','%.0f','%.0f'],
        colWidths: ['40%','20%','20%','20%'],
        queryType: 'sql',
        displayLength: 10,
		filter: false,
		info: false,
		sort: true,
		sortBy: [["1","desc"]],
		lengthChange: false,
		tableStyle: "classic",
        jndi: constants.JNDI,
        query: function() { 
            var query = RegistradosQuery.tableEnUsuarioFinal(parameters);
            return query;
        },
        oLanguage : Tables.oLanguage,
        "drawCallback" : function( component){
            var aoData = component.aoData;
             
            var iTotalExpedientes = 0;
            var iTotalAtendidos = 0;
            var iTotalNoAtendidos = 0;
            for ( var i=0 ; i<aoData.length ; i++ ) {
                var rowData = aoData[i]._aData;
                iTotalExpedientes += rowData[3]*1;
                iTotalAtendidos += rowData[2]*1;
                iTotalNoAtendidos += rowData[1]*1;
            }
            $('#tableEnUsuarioFinalTable > tbody:first').append('<tr><td class="column0 string" style="text-width:bold">Total</td><td class="column1 numeric">' +iTotalNoAtendidos + '</td><td class="column2 numeric">' + iTotalAtendidos+ '</td><td class="column3 numeric">' + iTotalExpedientes+ '</td></tr>');
        }
    },
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
    postFetchTable: function(values, title){
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
                    if(current[0]== title) {
                        atendidos = parseInt(current[2]);
                    }else {
                        noAtendidos = parseInt(current[2]);
                    }
                    continue;
                }else {
                    if(current[1]==preValue[1]) {
                        division = current[1];
                        if(current[0]== title) {
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
                        
                        if(current[0]== title) {
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
            if(current[0]== title) {
                atendidos = parseInt(current[2]);
            }else {
                noAtendidos = parseInt(current[2]);
            }
            total = noAtendidos + atendidos;
            resultset.push([division, noAtendidos, atendidos, total]);
            
        }
        values.resultset = resultset;
		return values;
	}
}


BarChartDefinitions =  {
//Protovis chart
    registrados: {
		width: 430,
        height: 680,
        title: "Documentos Registrados",
        orientation: 'horizontal',
        legend:true,
        barSizeRatio:0.2,
        yAxisPosition: "left",
        maxBarSize : 100,
        yAxisSize: 220,
        barSizeRatio:0.5,
        yAxisEndLine:  true,
        legendPosition:"bottom",
        stacked: true, 
        animate:true,
        selectable: false,
        crosstabMode: false,
        seriesInRows: false,
        colors: ["#FA1111","#30C716"],
        extensionPoints: [["barLabel_text",function(d){return ' ' + d + '%'}],["titleLabel_font","18px sans-serif"],["yAxisRule_lineWidth", 0]],
        jndi: constants.JNDI,
        queryType: 'sql',
		query: function() { 
            var query = RegistradosQuery.chartRegistrados(parameters);
            //console.log(query);
            return query;
        }
    }
}

PieChartDefinitions = {
    enMesaDePartes: {
        width: 420,
		height: 600,
		animate: false,
		title: "Documentos registrados por Mesa de Partes",
		titlePosition: "top",
		titleSize: 40,
		legend: true,
		legendPosition: "bottom",
		legendAlign: "left",
		legendDrawLine: false,
		legendDrawMarker: true,
		showTooltips: true,
		legendPadding: 10,// separacion de texto de la leyenda
		legendTextAdjust: 5,// reducir leyenda
		innerGap: 0.9, // distancia del texto del oie del centro
		showValues: true,
		colors: ["#bbeeff" ,"#bbffff" ,"#00bbff" ,"#2200ee" ,"#11ddff" ,"#33ddff" ,"#77eeff" ,"#ccddff" ,"#44ccff" ,"#0033ee" ,"#2211ff" ,"#8833ff" ,"#bb88ff" ,"#ccbbff"],
		extensionPoints: [
            ["pieLabel_text",function(d, a) {
                    var total = piechartEnMesaDePartes.chart.pieChartPanel.sum;
                    return (d/total*100).toFixed(2) + "%";
                }
            ],["titleLabel_font","18px sans-serif"]
		],
        jndi: constants.JNDI,
        queryType: 'sql',
        query: function() {
            return RegistradosQuery.chartEnMesaDePartes(parameters);
        }
    },
    enUsuarioFinal: {
        width: 440,
		height: 600,
		animate: false,
		title: "Documentos registrados por Usuario Final",
		titlePosition: "top",
		titleSize: 40,
		legend: true,
		legendPosition: "bottom",
		legendAlign: "left",
		legendDrawLine: false,
		legendDrawMarker: true,
		showTooltips: true,
		legendPadding: 10,
		legendTextAdjust: 5,
		innerGap: 0.9,
		showValues: true,
		colors: ["#bbeeff" ,"#bbffff" ,"#00bbff" ,"#2200ee" ,"#11ddff" ,"#33ddff" ,"#77eeff" ,"#ccddff" ,"#44ccff" ,"#0033ee" ,"#2211ff" ,"#8833ff" ,"#bb88ff" ,"#ccbbff"],
		extensionPoints: [
            ["pieLabel_text",function(d, a) {
                    var total = piechartEnUsuarioFinal.chart.pieChartPanel.sum;
                    return (d/total*100).toFixed(2) + "%";
                }
            ],["titleLabel_font","18px sans-serif"]
		],
        jndi: constants.JNDI,
        queryType: 'sql',
        query: function() { 
            return RegistradosQuery.chartEnUsuarioFinal(parameters);
        }
    },
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
	}
}