// lenguaje
Tables = {
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

PiechartDefinitions = {
	postFetch : function(values) {
		console.log("postfech:" + values);
		for ( var a = 1; a < values.metadata.length; a++) {
			var current = values.metadata[a];
			current.colType = "Numeric";
		}
		for ( var a = 0; a < values.resultset.length; a++) {
			var current = values.resultset[a];
			current[1] = parseFloat(current[1]);
		}
		console.log(values);
		return values;
	},
	remitenteAtendidos : {
		width : 420,
		height : 600,
		animate : false,
		title : "Expedientes atendidos por remitente",
		titlePosition : "top",
		titleSize : 40,
		legend : true,
		legendPosition : "bottom",
		legendAlign : "left",
		legendDrawLine : false,
		legendDrawMarker : true,
		showTooltips : true,
		legendPadding : 10,// separacion de texto de la leyenda
		legendTextAdjust : 5,// reducir leyenda
		innerGap : 0.9, // distancia del texto del pie del centro
		showValues : true,
		colors : [ "#bbeeff", "#bbffff", "#00bbff", "#2200ee", "#11ddff",
				"#33ddff", "#77eeff", "#ccddff", "#44ccff", "#0033ee",
				"#2211ff", "#8833ff", "#bb88ff", "#ccbbff" ],
		extensionPoints : [ [ "pieLabel_text", function(d, a) {
			var total = piechartPorFlujoAtendidos.chart.pieChartPanel.sum;
			return (d / total * 100).toFixed(2) + "%";
		} ], [ "titleLabel_font", "18px sans-serif" ] ],
		jndi : constants.JNDI,
		queryType : 'sql',
		query : function() {
			return QueryPiechart.porRemitenteAtendidos(parameters);
		}
	},
	remitenteNoAtendidos : {
		width : 440,
		height : 600,
		animate : false,
		title : "Expedientes no atendidos por remitente",
		titlePosition : "top",
		titleSize : 40,
		legend : true,
		legendPosition : "bottom",
		legendAlign : "left",
		legendDrawLine : false,
		legendDrawMarker : true,
		showTooltips : true,
		legendPadding : 10,
		legendTextAdjust : 5,
		innerGap : 0.9,
		showValues : true,
		colors : [ "#bbeeff", "#bbffff", "#00bbff", "#2200ee", "#11ddff",
				"#33ddff", "#77eeff", "#ccddff", "#44ccff", "#0033ee",
				"#2211ff", "#8833ff", "#bb88ff", "#ccbbff" ],
		extensionPoints : [ [ "pieLabel_text", function(d, a) {
			var total = piechartPorFlujoNoAtendidos.chart.pieChartPanel.sum;
			return (d / total * 100).toFixed(2) + "%";
		} ], [ "titleLabel_font", "18px sans-serif" ] ],
		jndi : constants.JNDI,
		queryType : 'sql',
		query : function() {
			return QueryPiechart.porRemitenteNoAtendidos(parameters);
		}
	}
	
}
barchartDefinitions = {
	atendidosVsNoatendidos : {
		width : 400,
		height : 680,
		title : "Expedientes Atendidos y No Atendidos",
		orientation : 'horizontal',
		legend : true,
		barSizeRatio : 0.5,
		yAxisPosition : "left",
		yAxisSize : 220,
		yAxisEndLine : true,
		legendPosition : "bottom",
		stacked : true,
		animate : true,
		selectable : false,
		crosstabMode : false,
		seriesInRows : false,
		colors : [ "#FA1111", "#30C716" ],
		extensionPoints : [ [ "barLabel_text", function(d) {
			return ' ' + d + '%'
		} ], [ "titleLabel_font", "18px sans-serif" ],
				[ "yAxisRule_lineWidth", 0 ], [ "bar_fillStyle", function(s) {
					var serie = this.datum().elem.series.value;
					return barcharColor.colorSelector(serie);
				} ], [ "legendDot_fillStyle", function(serie) {
					return barcharColor.colorSelector(serie);
				} ], [ "legendDot_strokeStyle", function(serie) {
					return barcharColor.colorSelector(serie);
				} ] ],
		jndi : constants.JNDI,
		queryType : 'sql',
		query : function() {
			return QueryBarchart.atendidosVsNoAtendidos(parameters);
		}
	}
}
postFetchDefinitions = {

	postFetch : function(values) {
		console.log("postfech:" + values);
		for ( var a = 1; a < values.metadata.length; a++) {
			var current = values.metadata[a];
			current.colType = "Numeric";
		}
		for ( var a = 0; a < values.resultset.length; a++) {
			var current = values.resultset[a];
			current[1] = parseFloat(current[1]);
		}
		console.log(values);
		return values;
	},
	tableAtendidosVsNoAtendidos : function(values) {
		console.log("postfech:" + values);
		var metadata = [ {
			colIndex : 0,
			colName : "Unida",
			colType : "String"
		}, {
			colIndex : 1,
			colName : "No Atendidos",
			colType : "String"
		}, {
			colIndex : 2,
			colName : "Atendidos",
			colType : "String"
		}, {
			colIndex : 3,
			colName : "Total",
			colType : "String"
		} ];
		values.metadata = metadata;
		// reconstruir valores
		if (values.resultset.length > 0) {
			var resultset = [];
			var preValue = values.resultset[0];
			var atendidos = 0;
			var noAtendidos = 0;
			var total = 0;
			var division = "";

			for ( var a = 0; a < values.resultset.length; a++) {
				var current = values.resultset[a];

				if (current[0] == preValue[0] && current[1] == preValue[1]) {
					// quitamos el primero
					division = current[1];
					if (current[0] == "ATENDIDOS") {
						atendidos = parseInt(current[2]);
					} else {
						noAtendidos = parseInt(current[2]);
					}
					continue;
				} else {
					if (current[1] == preValue[1]) {
						division = current[1];
						if (current[0] == "ATENDIDOS") {
							atendidos = parseInt(current[2]);
						} else {
							noAtendidos = parseInt(current[2]);
						}
					} else {
						total = noAtendidos + atendidos;
						resultset.push([ division, noAtendidos, atendidos,
								total ]);
						division = current[1];
						noAtendidos = 0;
						atendidos = 0;
						total = 0;

						if (current[0] == "ATENDIDOS") {
							atendidos = parseInt(current[2]);
						} else {
							noAtendidos = parseInt(current[2]);
						}

					}
					// para la siguiente iteracion
					preValue = current;
				}
			}
			if (division != preValue[1]) {
				division = preValue[1];
				atendidos = 0;
				noAtendidos = 0;
			}
			if (current[0] == "ATENDIDOS") {
				atendidos = parseInt(current[2]);
			} else {
				noAtendidos = parseInt(current[2]);
			}
			total = noAtendidos + atendidos;
			resultset.push([ division, noAtendidos, atendidos, total ]);

		}
		console.log(values);
		console.log(resultset);
		values.resultset = resultset;
		return values;
	},
	
}

TableDefinition = {
	atendidosVsNoAtendidos : {
		colHeaders : [ "Unidad", "Expedientes no atendidos",
				"Expedientes atendidos", "total" ],
		colTypes : [ 'string', 'numeric', 'numeric', 'numeric' ],
		colFormats : [ null, '%.0f', '%.0f', '%.0f' ],
		colWidths : [ '40%', '20%', '20%', '20%' ],
		queryType : 'sql',
		displayLength : 10,
		paginationType : "two_button",
		filter : false,
		info : false,
		sort : true,
		sortBy : [ [ "1", "desc" ] ],
		lengthChange : false,
		tableStyle : "classic",
		jndi : constants.JNDI,
		query : function() {
			return QueryTable.atendidosVsNoAtendidos(parameters);
		},
		oLanguage : Tables.oLanguage,
		"drawCallback" : function(component) {
			var aoData = component.aoData;

			var iTotalExpedientes = 0;
			var iTotalAtendidos = 0;
			var iTotalNoAtendidos = 0;
			for ( var i = 0; i < aoData.length; i++) {
				var rowData = aoData[i]._aData;
				iTotalExpedientes += rowData[3] * 1;
				iTotalAtendidos += rowData[2] * 1;
				iTotalNoAtendidos += rowData[1] * 1;
			}
			$('#tableAtendidosVsNoAtendidosTable > tbody:first')
					.append(
							'<tr><td class="column0 string" style="text-width:bold">Total</td><td class="column1 numeric">'
									+ iTotalNoAtendidos
									+ '</td><td class="column2 numeric">'
									+ iTotalAtendidos
									+ '</td><td class="column3 numeric">'
									+ iTotalExpedientes + '</td></tr>');
		}
	},
	porRemitenteAtendidos : {
		colHeaders : [ "Remitente", "Expedientes atendidos" ],
		colTypes : [ 'string', 'numeric' ],
		colFormats : [ null, '%.0f' ],
		colWidths : [ '60%', '40%' ],
		queryType : 'sql',
		displayLength : 10,
		paginationType : "two_button",
		filter : false,
		info : false,
		sort : true,
		sortBy : [ [ "1", "desc" ] ],
		lengthChange : false,
		tableStyle : "classic",
		jndi : constants.JNDI,
		query : function() {
			return QueryTable.porRemitenteAtendidos(parameters);
		},
		oLanguage : Tables.oLanguage,
		"drawCallback" : function(component) {
			var aoData = component.aoData;

			var iTotalExpedientes = 0;
			for ( var i = 0; i < aoData.length; i++) {
				var rowData = aoData[i]._aData;
				iTotalExpedientes += rowData[1] * 1;
			}
			$('#tablePorFlujoAtendidosTable > tbody:first')
					.append(
							'<tr><td class="column0 string" style="text-width:bold">Total</td><td class="column1 numeric">'
									+ iTotalExpedientes + '</td></tr>');
		}
	},
	porRemitenteNoAtendidos : {
		colHeaders : [ "Remitente", "Expedientes no atendidos" ],
		colTypes : [ 'string', 'numeric' ],
		colFormats : [ null, '%.0f' ],
		colWidths : [ '60%', '40%' ],
		queryType : 'sql',
		displayLength : 10,
		paginationType : "two_button",
		filter : false,
		info : false,
		sort : true,
		sortBy : [ [ "1", "desc" ] ],
		lengthChange : false,
		tableStyle : "classic",
		jndi : constants.JNDI,
		query : function() {
			return QueryTable.porRemitenteNoAtendidos(parameters);
		},
		oLanguage : Tables.oLanguage,
		"drawCallback" : function(component) {
			var aoData = component.aoData;

			var iTotalExpedientes = 0;
			for ( var i = 0; i < aoData.length; i++) {
				var rowData = aoData[i]._aData;
				iTotalExpedientes += rowData[1] * 1;
			}
			$('#tablePorFlujoNoAtendidosTable > tbody:first')
					.append(
							'<tr><td class="column0 string" style="text-width:bold">Total</td><td class="column1 numeric">'
									+ iTotalExpedientes + '</td></tr>');
		}
	}
}
