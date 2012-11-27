	// ROUND (ratio_to_report (SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE) * 100,
	// 0) AS PORCENTAJE

//definicion de query de las tablas
QueryTable = {
	documentosRegistrados : function(filtersObject) {
		var filters = QueryFilters.createFilters(filtersObject, "DOCU");
		var query = " SELECT  ENTRADA, NOMBRE, CANTIDAD, ROUND((CANTIDAD/TOTAL)*100,0) AS PORCENTAJE  "
				+ "          FROM (         "
				+ "                 SELECT  ENTRADA, NOMBRE ,SUM(SUBTOTAL) CANTIDAD, SUM(SUM(SUBTOTAL)) OVER (PARTITION BY NOMBRE ) AS TOTAL FROM "
				+ "                 ( "
				+ "                  SELECT NOMBRE, ENTRADA,SUM(SUBTOTAL) SUBTOTAL FROM( "
				+ "                  SELECT    UNID.NOMBRE, "
				+ "                                     DECODE(DOCU.AUTOR,'Mesa de Partes','MESA DE PARTES','USUARIO FINAL') AS ENTRADA, "
				+ "                                     COUNT(DISTINCT DOCU.IDDOCUMENTO) SUBTOTAL "
				+ "                      FROM DOCUMENTO DOCU "
				+ "                              INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE "
				+ "                              INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO "
				+ "                              INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO "
				+ "                              INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 "
				+ "                              INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  "
				+ "                              INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE "
				+ "                              INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE "
				+ "                         WHERE DOCU.ESTAENFLUJO = 'S' "
				+ "                          AND DOCU.ESTADO <> 'N' "
				+ "                          AND EXPE.ESTADO <>'N' "
				+ "                          AND DOCU.ESTADO IS NOT NULL "
				+ "                          AND UNID.IDUNIDAD IN ( "
				+ "                                         SELECT UNID2.IDUNIDAD FROM UNIDAD UNID2  "
				+ "                                                 WHERE UNID2.IDUNIDAD IN (SELECT U.IDUNIDAD FROM UNIDAD U WHERE U.DEPENDENCIA = 48 )  "
				+ "                                          )  "
				+ filters
				+ "                           GROUP BY UNID.NOMBRE,DOCU.AUTOR "
				+ "                            )                     "
				+ "                           GROUP BY NOMBRE,ENTRADA "
				+ "                    ) "
				+ "                   GROUP BY NOMBRE, ENTRADA  "
				+ "                   ORDER BY NOMBRE       " + " ) ";
		console.log("tableExpedientesRegistrados: " + query);
		return query;
	},
	expedientesAtendidos : function(filtersObject) {
		var filters = QueryFilters.createFilters(filtersObject, "EXPE");
		var query = " SELECT  NOMBRE, ESTADO, CANTIDAD,ROUND((CANTIDAD/DECODE(TOTAL,0,1,TOTAL))*100,0) AS PORCENTAJE  "
				+ "  FROM ( "
				+ "   SELECT  NOMBRE, ESTADO, "
				+ "                         SUM(SUBTOTAL) CANTIDAD "
				+ "                         , SUM(SUM(SUBTOTAL)) OVER (PARTITION BY NOMBRE) AS TOTAL  "
				+ "                  FROM ( "
				+ "   SELECT "
				+ "         (CASE EXPE.ESTADO WHEN 'A' THEN 'NO ATENDIDOS' WHEN 'I' THEN 'ATENDIDOS' END ) AS ESTADO, "
				+ "                 UNID.NOMBRE, "
				+ "                 COUNT(DISTINCT EXPE.IDEXPEDIENTE) SUBTOTAL                 "
				+ "        FROM EXPEDIENTE EXPE "
				+ "                 INNER JOIN DOCUMENTO DOCU ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE "
				+ " 		INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = EXPE.IDEXPEDIENTE "
				+ " 		INNER JOIN USUARIO USUA ON  UNID.IDUNIDAD = USUA.IDUNIDAD  "
				+ " 		INNER JOIN DOCUMENTO DOCU on USUA.IDUSUARIO =  DOCU.PROPIETARIO "
				+ "                 INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO "
				+ "                 INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE "
				+ "         WHERE EXPE.ESTADO<>'N' "
				+ "                 AND DOCU.ESTAENFLUJO = 'S' "
				+ "                 AND DOCU.ESTADO <> 'N' "
				+ "                 AND EXPE.ESTADO IS NOT NULL "
				+ "                 AND UNID.IDUNIDAD IN ( "
				+ "                         SELECT UNID.IDUNIDAD FROM UNIDAD UNID  "
				+ "                         WHERE UNID.IDUNIDAD IN (SELECT U.IDUNIDAD FROM UNIDAD U WHERE U.DEPENDENCIA = 48 ) "
				+ "                         )  "
				+ filters
				+ "         GROUP BY UNID.NOMBRE,EXPE.ESTADO "
				+ "            "
				+ "         )GROUP BY NOMBRE, ESTADO " + "  ) ";
		console.log("tableExpedientesAtendidos: " + query);
		return query;
	}
}

//definicion de query de los barchart
QueryBarchart = {
		
}

//definicion de query de los pie chart
QueryPiechart = {
	expedientesAtendidos : function(filtersObject) {
		var filters = QueryFilters.createFilters(filtersObject, "EXPE");
		var query = " SELECT  ESTADO, "
				+ "                         SUM(SUBTOTAL) CANTIDAD "
				+ "                  FROM ( "
				+ "   SELECT "
				+ "         (CASE EXPE.ESTADO WHEN 'A' THEN 'NO ATENDIDOS' WHEN 'I' THEN 'ATENDIDOS' END ) AS ESTADO, "
				+ "                 UNID.NOMBRE, "
				+ "                 COUNT(DISTINCT EXPE.IDEXPEDIENTE) SUBTOTAL "
				+ "        FROM EXPEDIENTE EXPE "
				+ "                 INNER JOIN DOCUMENTO DOCU ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE "
				+ " 		INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = EXPE.IDEXPEDIENTE "
				+ " 		INNER JOIN USUARIO USUA ON  UNID.IDUNIDAD = USUA.IDUNIDAD  "
				+ " 		INNER JOIN DOCUMENTO DOCU on USUA.IDUSUARIO =  DOCU.PROPIETARIO "
				+ "                 INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO "
				+ "                 INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE "
				+ "         WHERE EXPE.ESTADO<>'N' "
				+ "                 AND DOCU.ESTAENFLUJO = 'S' "
				+ "                 AND DOCU.ESTADO <> 'N' "
				+ "                 AND EXPE.ESTADO IS NOT NULL "
				+ "                 AND UNID.IDUNIDAD IN ( "
				+ "                         SELECT UNID.IDUNIDAD FROM UNIDAD UNID  "
				+ "                         WHERE UNID.IDUNIDAD IN (SELECT U.IDUNIDAD FROM UNIDAD U WHERE U.DEPENDENCIA = 48 ) "
				+ "                         )  " + filters
				+ "         GROUP BY UNID.NOMBRE,EXPE.ESTADO           "
				+ "         )GROUP BY 2 desc";
		console.log("piechartExpedientesAtendidos: " + query);
		return query;
	},
	documentosRegistrados : function(filtersObject) {
		var filters = QueryFilters.createFilters(filtersObject, "DOCU");
		var query = " SELECT ENTRADA, SUM(SUBTOTAL) SUBTOTAL FROM( "
				+ " 	SELECT    UNID.NOMBRE, "
				+ " 					DECODE(DOCU.AUTOR,'Mesa de Partes','MESA DE PARTES','USUARIO FINAL') AS ENTRADA, "
				+ " 					COUNT(DISTINCT DOCU.IDDOCUMENTO) SUBTOTAL "
				+ " 	 FROM DOCUMENTO DOCU "
				+ " 			 INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE "
				+ " 			 INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO "
				+ " 			 INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO "
				+ " 			 INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 "
				+ " 			 INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  "
				+ " 			 INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE "
				+ " 			 INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE "
				+ " 		WHERE DOCU.ESTAENFLUJO = 'S' "
				+ " 		 AND DOCU.ESTADO <> 'N' "
				+ " 		 AND EXPE.ESTADO <>'N' "
				+ " 		 AND DOCU.ESTADO IS NOT NULL "
				+ " 		 AND UNID.IDUNIDAD IN ( "
				+ " 						SELECT UNID2.IDUNIDAD FROM UNIDAD UNID2  "
				+ " 								WHERE UNID2.IDUNIDAD IN (SELECT U.IDUNIDAD FROM UNIDAD U WHERE U.DEPENDENCIA = 48 )  "
				+ " 						 )  " + filters
				+ " 		  GROUP BY UNID.NOMBRE,DOCU.AUTOR "
				+ " 	)                     " + " GROUP BY 2 desc ";
		console.log("piechart documentosRegistrados: " + query);
		return query;
	}
}
// generacion de filtros
QueryFilters = {
	createFilters : function(filtersObject, objFecha) {
		var consulta = "";
		// objeto es quien carga toda la informacion proveniente de la interfaz
		// para la consulta para el reporte
		if (filtersObject) {
			// cuando el usuario considera algun parametro
			if (filtersObject.gerencia && filtersObject.gerencia != -1) {
				consulta += "   AND UNID.IDUNIDAD IN ("
						+ " SELECT UNID.IDUNIDAD FROM UNIDAD UNID "
						+ " WHERE UNID.IDUNIDAD IN (SELECT U.IDUNIDAD FROM UNIDAD U WHERE U.DEPENDENCIA = "
						+ filtersObject.gerencia
						+ " ) "
						+ " UNION ALL "
						+ " SELECT UNID1.IDUNIDAD FROM UNIDAD UNID1 WHERE UNID1.IDUNIDAD = "
						+ filtersObject.gerencia + ") ";
				if (filtersObject.unidad && filtersObject.unidad != -1) {
					consulta = "";
					consulta += " AND UNID.IDUNIDAD = " + filtersObject.unidad
							+ " ";
				}
			}
			if (filtersObject.usuario && filtersObject.usuario != -1) {
				consulta += " AND DOCU.PROPIETARIO  = " + filtersObject.usuario
						+ " ";
			}
			if (filtersObject.flujo
					&& -1 == $.inArray("-1", filtersObject.flujo)) {
				consulta += " AND PROC.IDPROCESO in (" + filtersObject.flujo
						+ ") ";
			}
			if (filtersObject.tipoDocumento
					&& filtersObject.tipoDocumento != -1) {
				consulta += " AND TIDO.IDTIPODOCUMENTO = "
						+ filtersObject.tipoDocumento + " ";
			}
			if (filtersObject.cliente && filtersObject.cliente != -1) {
				consulta += "AND CLIE.IDCLIENTE = " + filtersObject.cliente
						+ " ";
			}
			if (filtersObject.startDate != "") {
				consulta += " AND " + objFecha
						+ ".FECHACREACION BETWEEN TO_DATE ('"
						+ filtersObject.startDate
						+ "'||' 00:00', 'yyyy/mm/dd HH24:Mi:ss') ";
			}
			if (filtersObject.endDate != "") {
				consulta += " AND TO_DATE ('" + filtersObject.endDate
						+ "'||' 23:59:59', 'yyyy/mm/dd HH24:Mi:ss')";
			}
		}
		console.log(consulta);
		return consulta;
	}
}

