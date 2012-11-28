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
	expedientesAtendidos : {
		colHeaders : [ "Unidad", "No Atendidos", "Atendidos", "total" ],
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
			var query = QueryTable.expedientesAtendidos(parameters);
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
			$('#tableExpedientesAtendidosTable > tbody:first')
					.append(
							'<tr><td class="column0 string" style="text-width:bold">Total</td><td class="column1 numeric">'
									+ iTotalNoAtendidos
									+ '</td><td class="column2 numeric">'
									+ iTotalAtendidos
									+ '</td><td class="column3 numeric">'
									+ iTotalExpedientes + '</td></tr>');
		}
	},
	documentosRegistrados : {
		colHeaders : [ "Unidad", "Mesa de Partes", "Usuario Final", "total" ],
		colTypes : [ 'string', 'numeric', 'numeric', 'numeric' ],
		colFormats : [ null, '%.0f', '%.0f', '%.0f' ],
		colWidths : [ '40%', '20%', '20%', '20%' ],
		queryType : 'sql',
		displayLength : 10,
		filter : false,
		info : false,
		paginate : false,
		sort : true,
		sortBy : [ [ "0", "asc" ] ],
		lengthChange : false,
		tableStyle : "classic",
		jndi : constants.JNDI,
		query : function() {
			var query = QueryTable.documentosRegistrados(parameters);
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
			$('#tableDocumentosRegistradosTable > tbody:first')
					.append(
							'<tr><td class="column0 string" style="text-width:bold">Total</td><td class="column1 numeric">'
									+ iTotalNoAtendidos
									+ '</td><td class="column2 numeric">'
									+ iTotalAtendidos
									+ '</td><td class="column3 numeric">'
									+ iTotalExpedientes + '</td></tr>');
		}
	},
	postExpedientesAtendidos : function(values) {
		return TableDefinitions.postFetchTable(values, "ATENDIDO");
	},
	postDocumentosRegistrados : function(values) {
		return TableDefinitions.postFetchTable(values, "MESA DE PARTES");
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

PiechartDefinitions =  {
	// Protovis chart
	expedientesAtendidos : {
		width : 300,
		height : 200,
		animate : false,
		title : "Expedientes atendidos y no atendidos",
		titlePosition : "top",
		titleSize : 40,
		legend : true,
		legendPosition : "right",
		legendAlign : "right",
		legendDrawLine : false,
		legendDrawMarker : true,
		showTooltips : true,
		legendPadding : 10,
		legendTextAdjust : 7,
		innerGap : 0.7,
		showValues : true,
		colors : [ "#bbeeff", "#bbffff", "#00bbff", "#2200ee", "#11ddff",
				"#33ddff", "#77eeff", "#ccddff", "#44ccff", "#0033ee",
				"#2211ff", "#8833ff", "#bb88ff", "#ccbbff" ],
		extensionPoints : [ [ "pieLabel_text", function(d, a) {
			var total = piechartExpedientesAtendidos.chart.pieChartPanel.sum;
			return (d / total * 100).toFixed(2) + "%";
		} ] ],
		jndi : constants.JNDI,
		queryType : 'sql',
		query : function() {
			return QueryPiechart.expedientesAtendidos(parameters);
		}
	},
	documentosRegistrados : {
		width : 300,
		height : 200,
		animate : false,
		title : "Documentos registrados",
		titlePosition : "top",
		titleSize : 40,
		legend : true,
		legendPosition : "right",
		legendAlign : "right",
		legendDrawLine : false,
		legendDrawMarker : true,
		showTooltips : true,
		legendPadding : 10,
		legendTextAdjust : 6,
		innerGap : 0.7,
		showValues : true,
		colors : [ "#bbeeff", "#bbffff", "#00bbff", "#2200ee", "#11ddff",
				"#33ddff", "#77eeff", "#ccddff", "#44ccff", "#0033ee",
				"#2211ff", "#8833ff", "#bb88ff", "#ccbbff" ],
		extensionPoints : [ [ "pieLabel_text", function(d, a) {
			var total = piechartDocumentosRegistrados.chart.pieChartPanel.sum;
			return (d / total * 100).toFixed(2) + "%";
		} ] ],
		jndi : constants.JNDI,
		queryType : 'sql',
		query : function() {
			return QueryPiechart.expedientesRegistrados(parameters);
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
	}
}

// creando los ping del mapa
MapDefinitions = {};
MapDefinitions.Marks = [];
MapDefinitions.nombreOficina = "";
MapDefinitions.mapMarkerClick = function(codigo, nombre) {
	MapDefinitions.nombreOficina = nombre;
	$('#charts').show();
	Dashboards.fireChange("parameters.unidad", codigo);
};
var data = [ {
	name : "OFICINA DELEGADA CHIMBOTE",
	codigo : 244,
	x : 244,
	y : 485
}, {
	name : "OFICINA DELEGADA CHOTA",
	codigo : 282,
	x : 209,
	y : 334
}, {
	name : "OFICINA DELEGADA JAEN",
	codigo : 243,
	x : 196,
	y : 273
}, {
	name : "OFICINA DELEGADA JULIACA",
	codigo : 246,
	x : 636,
	y : 768
}, {
	name : "OFICINA DELEGADA LA MERCED",
	codigo : 247,
	x : 397,
	y : 557
}, {
	name : "OFICINA DELEGADA QUILLABAMBA",
	codigo : 281,
	x : 492,
	y : 661
}, {
	name : "OFICINA REGIONAL ABANCAY",
	codigo : 203,
	x : 492,
	y : 701
}, {
	name : "OFICINA REGIONAL AMAZONAS",
	codigo : 230,
	x : 239,
	y : 248
}, {
	name : "OFICINA REGIONAL AREQUIPA",
	codigo : 83,
	x : 513,
	y : 779
}, {
	name : "OFICINA REGIONAL AYACUCHO",
	codigo : 85,
	x : 433,
	y : 677
}, {
	name : "OFICINA REGIONAL CAJAMARCA",
	codigo : 86,
	x : 226,
	y : 356
}, {
	name : "OFICINA REGIONAL CHANCHAMAYO",
	codigo : 234,
	x : 399,
	y : 548
}, {
	name : "OFICINA REGIONAL CHICLAYO",
	codigo : 73,
	x : 151,
	y : 310
}, {
	name : "OFICINA REGIONAL CUSCO",
	codigo : 69,
	x : 525,
	y : 637
}, {
	name : "OFICINA REGIONAL HUANCAVELICA",
	codigo : 200,
	x : 397,
	y : 634
}, {
	name : "OFICINA REGIONAL HUANCAYO",
	codigo : 74,
	x : 397,
	y : 588
}, {
	name : "OFICINA REGIONAL HUANUCO",
	codigo : 75,
	x : 328,
	y : 459
}, {
	name : "OFICINA REGIONAL HUARAZ",
	codigo : 76,
	x : 258,
	y : 457
}, {
	name : "OFICINA REGIONAL ICA",
	codigo : 77,
	x : 365,
	y : 714
}, {
	name : "OFICINA REGIONAL IQUITOS",
	codigo : 78,
	x : 397,
	y : 220
}, {
	name : "OFICINA REGIONAL LA OROYA",
	codigo : 81,
	x : 361,
	y : 573
}, {
	name : "OFICINA REGIONAL MADRE DE DIOS",
	codigo : 80,
	x : 606,
	y : 599
}, {
	name : "OFICINA REGIONAL MOQUEGUA",
	codigo : 209,
	x : 594,
	y : 823
}, {
	name : "OFICINA REGIONAL PASCO",
	codigo : 201,
	x : 385,
	y : 504
}, {
	name : "OFICINA REGIONAL PIURA",
	codigo : 70,
	x : 125,
	y : 250
}, {
	name : "OFICINA REGIONAL PUCALLPA",
	codigo : 79,
	x : 474,
	y : 482
}, {
	name : "OFICINA REGIONAL PUNO",
	codigo : 82,
	x : 638,
	y : 808
}, {
	name : "OFICINA REGIONAL SAN MARTIN",
	codigo : 248,
	x : 299,
	y : 358
}, {
	name : "OFICINA REGIONAL TACNA",
	codigo : 84,
	x : 619,
	y : 876
}, {
	name : "OFICINA REGIONAL TARAPOTO",
	codigo : 199,
	x : 357,
	y : 281
}, {
	name : "OFICINA REGIONAL TRUJILLO",
	codigo : 31,
	x : 233,
	y : 400
}, {
	name : "OFICINA REGIONAL TUMBES",
	codigo : 202,
	x : 120,
	y : 186
} ];

for ( var m in data) {
	var mark = {
		xy : [ data[m].x, data[m].y ], // x-y coodinates - works for all maps,
										// including World Map
		tooltip : data[m].name,
		attrs : {
			href : 'javascript:MapDefinitions.mapMarkerClick(' + data[m].codigo
					+ ', "' + data[m].name + '")', // link
			src : 'resources/markers/_pin_default.png', // image for marker
		}
	};
	MapDefinitions.Marks.push(mark);
}