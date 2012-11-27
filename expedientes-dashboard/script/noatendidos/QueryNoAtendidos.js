
QueryNoAtendidos = {
	//ROUND (ratio_to_report (SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE) * 100, 0) AS PORCENTAJE
    tablaAtendidosVsNo:  function(filtersObject) {
		var filters = this.createFilters(filtersObject);
        var query = " SELECT    ESTADO, NOMBRE, ROUND((CANTIDAD/DECODE(TOTAL,0,1,TOTAL))*100,0) AS PORCENTAJE  " +
                    "        FROM (  " +
                    "         SELECT  ESTADO, NOMBRE ,SUM(CANTIDAD) CANTIDAD, SUM(SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE ) AS TOTAL FROM " +
                    "                 ( SELECT  (CASE EXPE.ESTADO  " +
                    "                         WHEN 'A' THEN 'NO ATENDIDOS'  " +
                    "                         WHEN 'I' THEN 'ATENDIDOS'  " +
                    "                         END ) AS ESTADO,      " +
                    "                                 UNID.NOMBRE, " +
                    "                                 COUNT(DISTINCT EXPE.IDEXPEDIENTE) CANTIDAD  " +
                    "                  FROM EXPEDIENTE EXPE " +
                    "                         INNER JOIN DOCUMENTO DOCU ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE  " +
                    "                         INNER JOIN USUARIO USUA ON  USUA.IDUSUARIO = DOCU.PROPIETARIO " +
                    "                         INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = USUA.IDUNIDAD " +
                    "                         INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
                    "                         INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
                    "                  WHERE   EXPE.ESTADO<>'N' " +
                    "                                 AND DOCU.ESTAENFLUJO = 'S' " +
                    "                                 AND DOCU.ESTADO <> 'N' " +
                                        filters +
                    "                         GROUP BY EXPE.ESTADO,UNID.NOMBRE " +
                    "                 ) " +
                    "                GROUP BY ESTADO, NOMBRE " +
                    "                ORDER BY 1 " +
                    "        ) ";
		console.log(query);	
        return query;
    },
    flujoNoatendidos: function(filtersObject) {		
        var filters = this.createFilters(filtersObject);
		var query = " SELECT    NOMBRE, ATENDIDOS, ROUND((ATENDIDOS/DECODE(TOTAL,0,1,TOTAL))*100,0) AS PORCENTAJE  " +
                    "        FROM (  " +
                    "       SELECT UNID2.NOMBRE, ESTADO, COUNT(DISTINCT IDEXPEDIENTE) ATENDIDOS, SUM(COUNT(IDEXPEDIENTE)) OVER (PARTITION BY ESTADO) TOTAL  " +
                    "                 FROM (  SELECT   " +
                    "                                 (CASE EXPE.ESTADO  " +
                    "                                         WHEN 'A' THEN 'NO ATENDIDOS'  " +
                    "                                         WHEN 'I' THEN 'ATENDIDOS'  " +
                    "                                         END ) AS ESTADO,  " +
                    "                                 DECODE(DOCU.AUTOR,'Mesa de Partes', TRDO.IDUNIDADDESTINATARIO, TRDO.IDUNIDADREMITENTE) AS UNIDADREMITENTE, " +
                    "                                 DECODE(DOCU.AUTOR,'Mesa de Partes', TRDO.DESTINATARIO, TRDO.REMITENTE) AS USUARIOREMITENTE " +
                    "                                 ,EXPE.IDEXPEDIENTE " +
                    "                     FROM EXPEDIENTE EXPE  " +
                    "                               INNER JOIN DOCUMENTO DOCU ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
                    "                               INNER JOIN USUARIO USUA ON  USUA.IDUSUARIO = DOCU.PROPIETARIO " +
                    "                               INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = USUA.IDUNIDAD " +
                    "                               INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
                    "                               INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
                    "                               INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON DOCU.IDDOCUMENTO=TRDO.DOCUMENTO " +
                    "                               INNER JOIN " +
                    "                                 (        SELECT DOC.IDDOCUMENTO, MAX(TRD.NROREGISTRO) AS NROREGISTRO " +
                    "                                                 FROM EXPEDIENTE EXPE1 " +
                    "                                                 INNER JOIN DOCUMENTO DOC ON EXPE1.IDEXPEDIENTE=DOC.EXPEDIENTE " +
                    "                                                 INNER JOIN TRAZABILIDADDOCUMENTO TRD ON DOC.IDDOCUMENTO=TRD.DOCUMENTO " +
                    "                                                 WHERE  DOC.PRINCIPAL='S' " +
                    "                                                 AND EXPE1.ESTADO<>'N' " +
                    "                                                 AND DOC.ESTADO <>'N' " +
                    "                                                 AND TRD.ACCION IN (7, 8, 14, 23, 24) " +
                    "                                                 GROUP BY DOC.IDDOCUMENTO " +
                    "                                 ) RM ON DOCU.IDDOCUMENTO=RM.IDDOCUMENTO AND TRDO.NROREGISTRO=RM.NROREGISTRO " +
                    "                         WHERE   EXPE.ESTADO<>'N' " +
                    "                                 AND DOCU.ESTAENFLUJO = 'S' " +
                    "                                 AND DOCU.ESTADO <> 'N' " +
                    "                                 AND EXPE.ESTADO ='A' " +
                                                       filters+
                    "                         )   INNER JOIN UNIDAD UNID2 ON UNID2.IDUNIDAD = UNIDADREMITENTE  " +
                    "                         GROUP BY UNID2.NOMBRE, ESTADO " +
                    "             )		  ";
        console.log(query);            
		return query;
	},
    flujoAtendidos: function(filtersObject) {	
        var filters = this.createFilters(filtersObject);
		var query = " SELECT    NOMBRE, ATENDIDOS, ROUND((ATENDIDOS/DECODE(TOTAL,0,1,TOTAL))*100,0) AS PORCENTAJE  " +
                    "        FROM (  " +
                    "       SELECT UNID2.NOMBRE,ESTADO, COUNT(DISTINCT IDEXPEDIENTE) ATENDIDOS, SUM(COUNT(IDEXPEDIENTE)) OVER (PARTITION BY ESTADO) TOTAL    " +
                    "                 FROM (  SELECT   " +
                    "                                 (CASE EXPE.ESTADO  " +
                    "                                         WHEN 'A' THEN 'NO ATENDIDOS'  " +
                    "                                         WHEN 'I' THEN 'ATENDIDOS'                                  " +
                    "                                         END ) AS ESTADO,  " +
                    "                                         DECODE(DOCU.AUTOR,'Mesa de Partes', TRDO.IDUNIDADDESTINATARIO, TRDO.IDUNIDADREMITENTE) AS UNIDADREMITENTE, " +
                    "                                 DECODE(DOCU.AUTOR,'Mesa de Partes', TRDO.DESTINATARIO, TRDO.REMITENTE) AS USUARIOREMITENTE " +
                    "                                 ,EXPE.IDEXPEDIENTE " +
                    "                     FROM EXPEDIENTE EXPE  " +
                    "                               INNER JOIN DOCUMENTO DOCU ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
                    "                               INNER JOIN USUARIO USUA ON  USUA.IDUSUARIO = DOCU.PROPIETARIO " +
                    "                               INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = USUA.IDUNIDAD " +
                    "                               INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
                    "                               INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
                    "                               INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON DOCU.IDDOCUMENTO=TRDO.DOCUMENTO " +
                    "                               INNER JOIN " +
                    "                                 (               SELECT DOC.IDDOCUMENTO, MAX(TRD.NROREGISTRO) AS NROREGISTRO " +
                    "                                                 FROM EXPEDIENTE EXP " +
                    "                                                 INNER JOIN DOCUMENTO DOC ON EXP.IDEXPEDIENTE=DOC.EXPEDIENTE " +
                    "                                                 INNER JOIN TRAZABILIDADDOCUMENTO TRD ON DOC.IDDOCUMENTO=TRD.DOCUMENTO " +
                    "                                                 WHERE  DOC.PRINCIPAL='S' " +
                    "                                                 AND DOC.ESTADO <>'N' " +
                    "                                                 AND TRD.ACCION IN (7, 8, 14, 23, 24) " +
                    "                                                 GROUP BY DOC.IDDOCUMENTO " +
                    "                                 ) RM ON DOCU.IDDOCUMENTO=RM.IDDOCUMENTO AND TRDO.NROREGISTRO=RM.NROREGISTRO " +
                    "                         WHERE   EXPE.ESTADO<>'N' " +
                    "                                 AND DOCU.ESTAENFLUJO = 'S' " +
                    "                                 AND DOCU.ESTADO <> 'N' " +
                    "                                 AND EXPE.ESTADO ='I' " +
                                                      filters +
                    "                         ) INNER JOIN UNIDAD UNID2 ON UNID2.IDUNIDAD = UNIDADREMITENTE  " +
                    "                          " +
                    "                         GROUP BY UNID2.NOMBRE, ESTADO " +
                    "                  ) ";
		console.log(query);
        return query;
	},
    chartAtendidosVsNo: function(filtersObject) {
		var filters = this.createFilters(filtersObject);
        var query = " SELECT    NOMBRE, ESTADO, CANTIDAD,TOTAL,ROUND((CANTIDAD/DECODE(TOTAL,0,1,TOTAL))*100,0) AS PORCENTAJE  " +
                    "        FROM (  " +
                    "         SELECT  ESTADO, NOMBRE ,SUM(CANTIDAD) CANTIDAD, SUM(SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE ) AS TOTAL FROM " +
                    "                 ( SELECT  (CASE EXPE.ESTADO  " +
                    "                         WHEN 'A' THEN 'NO ATENDIDOS'  " +
                    "                         WHEN 'I' THEN 'ATENDIDOS'  " +
                    "                         END ) AS ESTADO,      " +
                    "                                 UNID.NOMBRE, " +
                    "                                 COUNT(DISTINCT EXPE.IDEXPEDIENTE) CANTIDAD  " +
                    "                  FROM EXPEDIENTE EXPE " +
                    "                         INNER JOIN DOCUMENTO DOCU ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE  " +
                    "                         INNER JOIN USUARIO USUA ON  USUA.IDUSUARIO = DOCU.PROPIETARIO " +
                    "                         INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = USUA.IDUNIDAD " +
                    "                         INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
                    "                         INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
                    "                  WHERE   EXPE.ESTADO<>'N' " +
                    "                                 AND DOCU.ESTAENFLUJO = 'S' " +
                    "                                 AND DOCU.ESTADO <> 'N' " +
                                        filters +
                    "                         GROUP BY EXPE.ESTADO,UNID.NOMBRE " +
                    "                 ) " +
                    "                GROUP BY ESTADO, NOMBRE " +
                    "                ORDER BY 2 " +
                    "        ) ";

			
        console.log(query);
        return query;
    },
    createFilters : function (filtersObject) {
        var consulta = "";
        //objeto es quien carga toda la informacion proveniente de la interfaz para la consulta para el reporte 
        if(filtersObject){
                //cuando el usuario considera algun parametro 
            if(filtersObject.gerencia && filtersObject.gerencia != -1) {
                consulta += "   AND UNID.IDUNIDAD IN (" +
                            " SELECT UNID.IDUNIDAD FROM UNIDAD UNID " +
                            " WHERE UNID.IDUNIDAD IN (SELECT U.IDUNIDAD FROM UNIDAD U WHERE U.DEPENDENCIA = "+filtersObject.gerencia+" ) "+ 
                   " UNION ALL "+
                  " SELECT UNID1.IDUNIDAD FROM UNIDAD UNID1 WHERE UNID1.IDUNIDAD = "+filtersObject.gerencia+") "; 
                if(filtersObject.unidad && filtersObject.unidad != -1) {
                    consulta = "";
                    consulta += " AND UNID.IDUNIDAD = "+filtersObject.unidad+" ";
                }
            }
            if(filtersObject.usuario && filtersObject.usuario != -1) {
                consulta += " AND DOCU.PROPIETARIO  = "+filtersObject.usuario+" ";
            }
            if(filtersObject.flujo && -1 == $.inArray("-1", filtersObject.flujo)) {
                consulta += " AND PROC.IDPROCESO in ("+filtersObject.flujo+") ";
            }
            if(filtersObject.tipoDocumento && filtersObject.tipoDocumento!= -1) {
                consulta += " AND TIDO.IDTIPODOCUMENTO = "+filtersObject.tipoDocumento+" ";
            }
            if(filtersObject.cliente && filtersObject.cliente!= -1){
                consulta += "AND CLIE.IDCLIENTE = "+filtersObject.cliente+" ";
            }
            if(filtersObject.startDate != "") {
                consulta += " AND EXPE.FECHACREACION BETWEEN TO_DATE ('"+filtersObject.startDate+"'||' 00:00', 'yyyy/mm/dd HH24:Mi:ss') ";
            }
            if(filtersObject.endDate != "") {
                consulta += " AND TO_DATE ('"+filtersObject.endDate+"'||' 23:59:59', 'yyyy/mm/dd HH24:Mi:ss')";
            }
        }
        console.log(consulta);
        return consulta;
    }
}

