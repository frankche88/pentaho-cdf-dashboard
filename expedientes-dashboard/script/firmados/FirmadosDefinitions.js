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
	postFetchFirmados : function(values) {
		return TableDefinitions.postFetchTable(values, "FIRMADOS");
	},
	postFetchEnumerados : function(values) {
		return TableDefinitions.postFetchTable(values, "ENUMERADOS");
	},
	postFetchEnumeradosFirmados : function(values) {
		return TableDefinitions.postFetchTable(values, "ENUMERADOS Y FIRMADOS");
	},
	enumerados : {
		colHeaders : [ "Unidad", "No Enumerados", "Enumerados", "total" ],
		colTypes : [ 'string', 'numeric', 'numeric', 'numeric' ],
		colFormats : [ null, '%.0f', '%.0f', '%.0f' ],
		colWidths : [ '40%', '20%', '20%', '20%' ],
		queryType : 'sql',
		displayLength : 10,
		filter : false,
		info : false,
		sort : true,
		sortBy : [ [ "0", "asc" ] ],
		lengthChange : false,
		tableStyle : "classic",
		jndi : constants.JNDI,
		query : function() {
			var query = QueryTable.enumerados(parameters);
			// console.log(query);
			return query;
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
			$('#tableEnumeradosTable > tbody:first')
					.append(
							'<tr><td class="column0 string" style="text-width:bold">Total</td><td class="column1 numeric">'
									+ iTotalNoAtendidos
									+ '</td><td class="column2 numeric">'
									+ iTotalAtendidos
									+ '</td><td class="column3 numeric">'
									+ iTotalExpedientes + '</td></tr>');
		}
	},
	firmados : {
		colHeaders : [ "Unidad", "No Firmados", "Firmados", "total" ],
		colTypes : [ 'string', 'numeric', 'numeric', 'numeric' ],
		colFormats : [ null, '%.0f', '%.0f', '%.0f' ],
		colWidths : [ '40%', '20%', '20%', '20%' ],
		queryType : 'sql',
		displayLength : 10,
		filter : false,
		info : false,
		sort : true,
		sortBy : [ [ "0", "asc" ] ],
		lengthChange : false,
		tableStyle : "classic",
		jndi : constants.JNDI,
		query : function() {
			var query = QueryTable.firmados(parameters);
			return query;
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
			$('#tableFirmadosTable > tbody:first')
					.append(
							'<tr><td class="column0 string" style="text-width:bold">Total</td><td class="column1 numeric">'
									+ iTotalNoAtendidos
									+ '</td><td class="column2 numeric">'
									+ iTotalAtendidos
									+ '</td><td class="column3 numeric">'
									+ iTotalExpedientes + '</td></tr>');
		}
	},
	enumeradosFirmados : {
		colHeaders : [ "Unidad", "No Enumerados", "Enumerados", "total" ],
		colTypes : [ 'string', 'numeric', 'numeric', 'numeric' ],
		colFormats : [ null, '%.0f', '%.0f', '%.0f' ],
		colWidths : [ '40%', '20%', '20%', '20%' ],
		queryType : 'sql',
		displayLength : 10,
		filter : false,
		info : false,
		sort : true,
		sortBy : [ [ "0", "asc" ] ],
		lengthChange : false,
		tableStyle : "classic",
		jndi : constants.JNDI,
		query : function() {
			var query = QueryTable.enumeradosFirmados(parameters);
			return query;
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
			$('#tableEnumeradosFirmadosTable > tbody:first')
					.append(
							'<tr><td class="column0 string" style="text-width:bold">Total</td><td class="column1 numeric">'
									+ iTotalNoAtendidos
									+ '</td><td class="column2 numeric">'
									+ iTotalAtendidos
									+ '</td><td class="column3 numeric">'
									+ iTotalExpedientes + '</td></tr>');
		}
	},
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
	postFetchTable : function(values, title) {
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
					if (current[0] == title) {
						atendidos = parseInt(current[2]);
					} else {
						noAtendidos = parseInt(current[2]);
					}
					continue;
				} else {
					if (current[1] == preValue[1]) {
						division = current[1];
						if (current[0] == title) {
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

						if (current[0] == title) {
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
			if (current[0] == title) {
				atendidos = parseInt(current[2]);
			} else {
				noAtendidos = parseInt(current[2]);
			}
			total = noAtendidos + atendidos;
			resultset.push([ division, noAtendidos, atendidos, total ]);

		}
		values.resultset = resultset;
		return values;
	}
}

ChartDefinitions = {

	// Protovis chart
	enumerados : {
		width : 430,
		height : 680,
		title : "Documentos Enumerados",
		orientation : 'horizontal',
		legend : true,
		maxBarSize : 100,
		yAxisSize : 220,
		barSizeRatio : 0.5,
		yAxisPosition : "left",
		yAxisEndLine : true,
		legendPosition : "bottom",
		stacked : true,
		animate : true,
		selectable : false,
		crosstabMode : false,
		seriesInRows : false,
		colors : [ "#30C716", "#FA1111" ],
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
			var query = QueryBarchart.enumerados(parameters);
			// console.log(query);
			return query;
		}
	},
	firmados : {
		width : 440,
		height : 680,
		title : "Documentos Firmados",
		orientation : 'horizontal',
		legend : true,
		barSizeRatio : 0.2,
		yAxisPosition : "left",
		maxBarSize : 100,
		yAxisSize : 220,
		barSizeRatio : 0.5,
		yAxisEndLine : true,
		legendPosition : "bottom",
		stacked : true,
		animate : true,
		selectable : false,
		crosstabMode : false,
		seriesInRows : false,
		colors : [ "#30C716", "#FA1111" ],
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
			var query = QueryBarchart.firmados(parameters);
			return query;
		}
	},
	enumeradosFirmados : {
		width : 430,
		height : 680,
		title : "Documentos Enumerados y Firmados",
		orientation : 'horizontal',
		legend : true,
		yAxisPosition : "left",
		maxBarSize : 100,
		yAxisSize : 220,
		barSizeRatio : 0.5,
		yAxisEndLine : true,
		legendPosition : "bottom",
		stacked : true,
		animate : true,
		selectable : false,
		crosstabMode : false,
		seriesInRows : false,
		colors : [ "#30C716", "#FA1111" ],
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
			var query = QueryBarchart.enumeradosFirmados(parameters);
			// console.log(query);
			return query;
		}
	}

}