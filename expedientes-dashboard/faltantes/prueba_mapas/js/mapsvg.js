/**
 * mapSvg 5.2.12 - Interactive Map Plugin
 *
 * Author - Roman S. Stepanov
 * http://codecanyon.net/user/Yatek/portfolio
 *
 * Version : 5.2.12
 * Released: October 25, 2012
 *
 * You must purchase Regular or Extended license to use mapSvg plugin.
 * Visit plugin's page @ CodeCanyon: http://codecanyon.net/item/jquery-interactive-svg-map-plugin/1694201
 * Licenses: http://codecanyon.net/licenses/regular_extended
 */

 (function( $ ) {

    var userAgent = navigator.userAgent.toLowerCase();

    // Check for iPad/Iphone/Andriod
    var touchDevice =
        (userAgent.indexOf("ipad") > -1) ||
        (userAgent.indexOf("iphone") > -1) ||
        (userAgent.indexOf("ipod") > -1) ||
        (userAgent.indexOf("android") > -1);

    var scripts = document.getElementsByTagName('script');
    var myScript = scripts[scripts.length - 1].src.split('/');
    myScript.pop();
    var pluginJSURL =  myScript.join('/')+'/';
    myScript.pop();
    var pluginRootURL =  myScript.join('/')+'/';

    var whRatio;
    var isPanning = false;

    var $mapContainer, map, options, showTip, mapTip, mapPopover, R, RMap, RMarks, RLabels, markOptions, svgDefault = {};
    var mouseDownHandler;
    var mapAttrs      = {};

    var scale;
    var _scale = 1; // relative scale starting from current zoom
    var selected_id   = 0;
    var mapData       = {};
    var ref           = {};
    var marks         = [];
    var same_size     = false;
    var _viewBox      = [];
    var viewBox       = [];
    var viewBoxZoom   = [];
    var zoomLevel     = 0;
    var pan           = {};
    var zoom;

    var mouseCoords = $.browser.msie ? function(e){
                return {'x':e.clientX + $('html').scrollLeft(), 'y':e.clientY + $('html').scrollTop()};
            } : function(e){
                return {'x':e.pageX, 'y':e.pageY};
            };

    // This data is needed for lat-lon to x-y conversions
    var CBK = [128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648, 4294967296, 8589934592, 17179869184, 34359738368, 68719476736, 137438953472]
    var CEK = [0.7111111111111111, 1.4222222222222223, 2.8444444444444446, 5.688888888888889, 11.377777777777778, 22.755555555555556, 45.51111111111111, 91.02222222222223, 182.04444444444445, 364.0888888888889, 728.1777777777778, 1456.3555555555556, 2912.711111111111, 5825.422222222222, 11650.844444444445, 23301.68888888889, 46603.37777777778, 93206.75555555556, 186413.51111111112, 372827.02222222224, 745654.0444444445, 1491308.088888889, 2982616.177777778, 5965232.355555556, 11930464.711111112, 23860929.422222223, 47721858.844444446, 95443717.68888889, 190887435.37777779, 381774870.75555557, 763549741.5111111]
    var CFK = [40.74366543152521, 81.48733086305042, 162.97466172610083, 325.94932345220167, 651.8986469044033, 1303.7972938088067, 2607.5945876176133, 5215.189175235227, 10430.378350470453, 20860.756700940907, 41721.51340188181, 83443.02680376363, 166886.05360752725, 333772.1072150545, 667544.214430109, 1335088.428860218, 2670176.857720436, 5340353.715440872, 10680707.430881744, 21361414.86176349, 42722829.72352698, 85445659.44705395, 170891318.8941079, 341782637.7882158, 683565275.5764316, 1367130551.1528633, 2734261102.3057265, 5468522204.611453, 10937044409.222906, 21874088818.445812, 43748177636.891624]

    // Default options
    var defaults = {
        keepSourceStyles    : false,
        loadingText         : 'Loading map...',
        colors              : {base: "#E1F1F1", background: "#eeeeee", hover: "#548eac", selected: "#065A85", stroke: "#7eadc0"},
        regions             : {},
        viewBox             : [],
        cursor              : 'default',
        strokeWidth         : 1.1,
        scale               : 1,
        tooltipsMode        : 'hover',
        tooltips            : {show: 'hover', mode: 'names'},
        onClick             : null,
        mouseOver           : null,
        mouseOut            : null,
        disableAll          : false,
        hideAll             : false,
        marks               : null,
        hover_mode          : 'color',
        selected_mode       : 'color',
        hover_brightness    : 1.3,
        selected_brightness : 3,
        pan                 : false,
        zoom                : false,
        popover             : {width: 'auto', height:  'auto'},
        buttons             : true,
        zoomLimit           : [0,5],
        zoomDelta           : 1.2,
        zoomButtons         : {'show': true, 'location': 'right'}
    };

    // Default mark style
    markOptions = {
            attrs: {
                'cursor': 'pointer',
                'src': pluginRootURL+'/markers/_pin_default.png'
            }
    };


    /** METHODS **/
    var methods = {

        // DESTROY THE PLUGIN
        destroy: function(){
          // TODO
        },
        // GET SCALE VALUE
        getScale: function(){

            // Scale which we consider as 1:1
            var scale1   = svgDefault.width / svgDefault.viewBox[2];
            // Current absolute scale

            var scale2   = options.width / _viewBox[2];
            // Current relative scale
            var s        = 1 - (scale1-scale2);

            return s;
        },
        // GET VIEBOX [x,y,width,height]
        getViewBox : function(){
            return viewBox;
        },
        // SET VIEWBOX
        setViewBox : function(v, animate){

            var d = (v && v.length==4) ? v : svgDefault.viewBox;
            var newViewBox = [parseFloat(d[0]), parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3])];


            viewBox = newViewBox;
            R.setViewBox(viewBox[0], viewBox[1], viewBox[2], viewBox[3], true);
            methods.marksAdjustPosition();
            //methods.mapAdjustStrokes();


            return true;
        },
        // SET VIEWBOX BY SIZE
        viewBoxSetBySize : function(width,height){

            _viewBox = methods.viewBoxGetBySize(width,height);
            viewBox = $.extend([],_viewBox);

            scale    = methods.getScale();

            R.setViewBox(viewBox[0], viewBox[1], viewBox[2], viewBox[3], true);

            methods.marksAdjustPosition();

            return viewBox;
        },
        viewBoxGetBySize : function(width, height){

            var new_ratio = width / height;
            var old_ratio = svgDefault.viewBox[2] / svgDefault.viewBox[2];


            var vb = svgDefault.viewBox;
            var rw = svgDefault.width / vb[2];
            var rh = svgDefault.height / vb[3];

            var maxVBwidth  = width / rw;
            var maxVBheight = height / rh;

            if(new_ratio != old_ratio){
                if(new_ratio > 1){
                    vb[2] = vb[3] * new_ratio;
                }else{
                    vb[3] = vb[2] / new_ratio;
                }
            }

            return vb;
        },
        viewBoxReset : function(){
            methods.setViewBox();
        },
        mapAdjustStrokes : function(){
            var sScale = scale;
            RMap.attr( {'stroke-width': Math.round(mapAttrs.strokes['stroke-width'] / sScale).toFixed(2) } );
        },
        // ZOOM
        zoomIn: function(){
            methods.zoom(1);
        },
        zoomOut: function(){
            methods.zoom(-1);
        },
        zoom : function (delta, x, y){

            // check for zoom limit
            var d = delta > 0 ? 1 : -1;
            var _zoomLevel = zoomLevel;
            _zoomLevel += d;
            if(_zoomLevel > options.zoomLimit[1] || _zoomLevel < options.zoomLimit[0]) return false

            zoomLevel = _zoomLevel;

            var zoom_k = d*options.zoomDelta;
            if (zoom_k < 1) zoom_k = -1/zoom_k;

            var vWidth  = viewBox[2];
            var vHeight = viewBox[3];

            scale  = scale * zoom_k;
            _scale = _scale * zoom_k;

            zoom = _scale/zoom_k;

            var newViewBox = [];

            newViewBox[2]  = _viewBox[2] / _scale;
            newViewBox[3]  = _viewBox[3] / _scale;

            newViewBox[0]  = viewBox[0] + (vWidth - newViewBox[2]) / 2;
            newViewBox[1]  = viewBox[1] + (vHeight - newViewBox[3]) / 2;

            methods.setViewBox(newViewBox, true);
        },
        //  MARK : UPDATE
        markUpdate : function(mark, data){

            if(data.attrs['src']=="")
                delete data.attrs['src'];
            if(data.attrs['href']=="")
                delete data.attrs['href'];

                var img  = new Image();
                img.name = data.attrs.src;
                img.src  = data.attrs.src;
                img.onload = function(){

                    data.width = this.width;
                    data.height = this.height;
                    data.attrs.width = parseFloat(data.width/scale).toFixed(2);
                    data.attrs.height = parseFloat(data.height/scale).toFixed(2);

                    // we don't want href to be active in edit mode
                    //var new_data = $.extend(true, {}, mark.data(), markOptions, data);

                    mark.data(data.data);
                    mark.attr(data.attrs);

                    if(options.editMode && data.attrs.href){
                            delete mark.node.href;
                            mark.data('href',data.attrs.href);
                    }

                };




        },
        // MARK : DELETE
        markDelete: function(mark){
            mark.remove();
        },
        // MARK : ADD
        markAdd : function(opts, create) {
                // Join default mark options with user-defined options
                var mark = $.extend(true, {}, markOptions, opts);

                if (mark.width && mark.height){
                    return methods.markAddFinalStep(mark, create);
                }else{
                    var img = new Image();
                    img.src = mark.attrs.src;
                    img.onload = function(){
                        mark.width = this.width;
                        mark.height = this.height;
                        return methods.markAddFinalStep(mark, create);
                    };
                }
        },
        markAddFinalStep : function(mark, create){
                // We don't need to open a link in edit mode
                var markAttrs = $.extend(true, {}, mark.attrs);

                var width  = parseFloat(mark.width/scale).toFixed(2);
                var height = parseFloat(mark.height/scale).toFixed(2);

                // Get mark's xy OR convert lat/lon to x/y
                var xy = mark.xy ? mark.xy :
                            (mark.attrs.x ? [mark.attrs.x, mark.attrs.y] :
                                (mark.c ? methods.ll2px(mark.c) : false)
                             );
                if(!xy) return false;

                if(create){
                    xy[0] = xy[0]/scale - mark.width/(2*scale);
                    xy[1] = (xy[1]-mark.height)/scale;
                }

                xy[0] = parseFloat(xy[0]).toFixed(2);
                xy[1] = parseInt(xy[1]).toFixed(2);

                if(options.editMode)
                    delete markAttrs.href;

                delete markAttrs.width;
                delete markAttrs.height;


                // Add mark (image)
                var RMark = R.image(mark.attrs.src, xy[0], xy[1], width, height)
                             .attr(markAttrs)
                             .data(mark);

                if(!options.editMode){
                    RMark.mousedown(function(e){
                            if(this.data('popover')){
                                var m = mouseCoords(e);
                                methods.showPopover(m.x, m.y, this.data('popover'));
                            }
                    });
                }

                methods.markEventHandlersSet(options.editMode, RMark);
                RMarks.push(RMark);

                // Call edit window
                if(create)
                    options.marksEditHandler.call(RMark);

                return RMark;

        },
        marksAdjustPosition : function(){

            if(!RMarks || RMarks.length < 1) return false;

            // We want a marker "tip" to be on bottom side (like a pin)
            // But Raphael starts to draw an image from left top corner.
            // At the same time we don't want a mark to be scaled in size when map scales;
            // Mark always should stay the same size.
            // In this case coordinates of bottom point of image will vary with map scaling.
            // So we have to calculate the offset.

            var dx, dy;


            for (var m in RMarks.items){
                var w = RMarks.items[m].data('width');
                var h = RMarks.items[m].data('height');
                dx = w/2 - w/(2*scale);
                dy = h - h/scale;
                RMarks.items[m].attr({width: w/scale, height: h/scale}).transform('t'+dx+','+dy);
            }

        },
        // GET MARK COORDINATES TRANSLATED TO 1:1 SCALE (used when saving new added marks)
        markGetDefaultCoords : function(markX, markY, markWidth, markHeight, mapScale){
            markX = parseFloat(markX);
            markY = parseFloat(markY);
            markWidth = parseFloat(markWidth);
            markHeight = parseFloat(markHeight);
            markX = parseFloat(markX + markWidth/(2*mapScale) - markWidth/2).toFixed(2);
            markY = parseFloat(markY + markHeight/mapScale - markHeight).toFixed(2);
            return [markX, markY];
        },
        // MARK MOVE & EDIT HANDLERS
        markMoveStart : function(){
            // storing original coordinates
            this.data('ox', parseFloat(this.attr('x')));
            this.data('oy', parseFloat(this.attr('y')));
        },
        markMove : function (dx, dy) {
            // move will be called with dx and dy
            dx = dx/scale;
            dy = dy/scale;
            this.attr({x: this.data('ox') + dx, y: this.data('oy') + dy});
        },
        markMoveEnd : function () {
            // if coordinates are same then it was a "click" and we should start editing
            if(this.data('ox') == this.attr('x') && this.data('oy') == this.attr('y')){
               options.marksEditHandler.call(this);
            }
        },
        panStart : function (e){
                if(e.target.id == 'btnZoomIn' || e.target.id == 'btnZoomOut')
                    return false;
                e.preventDefault();
                pan.dx = viewBox[0];
                pan.dy = viewBox[1];
                pan.x  = e.clientX;
                pan.y  = e.clientY;
                $('body').on('mousemove', methods.panMove).on('mouseup', methods.panEnd);
        },
        panMove :  function (e){
                e.preventDefault();
                RMap.attr({'cursor': 'move'});
                $('body').css({'cursor': 'move'});
                var dx = pan.x - e.clientX;
                var dy = pan.y - e.clientY;
                pan.dx = viewBox[0] + dx/scale;
                pan.dy = viewBox[1] + dy/scale;
                R.setViewBox(pan.dx,  pan.dy, viewBox[2], viewBox[3], true);
        },
        panEnd : function (e){
                // Meanwhile regionClickHandler fires on mouseUp also when options.pan == true
                $('body').css({'cursor': 'default'});
                RMap.attr({'cursor': options.cursor});
                viewBox[0] = pan.dx;
                viewBox[1] = pan.dy;
                $('body').off('mousemove', methods.panMove).off('mouseup', methods.panEnd);
        },
        marksHide : function(){
            RMarks.hide();
        },
        marksShow : function(){
            RMarks.show();
        },
        // GET ALL MARKS
        marksGet : function(){
            var _marks = [];
            $.each(RMarks, function(i, m){
                    if(m.attrs){
                    // If mark exist
                        var attrs = $.extend({},m.attrs);
                        if(!m.data('placed')){
                            var xy = methods.markGetDefaultCoords(m.attrs.x, m.attrs.y, m.data('width'), m.data('height'), scale);
                            attrs.x = xy[0];
                            attrs.y = xy[1];
                        }

                        if(m.data('href'))
                            attrs.href = m.data('href');

                        _marks.push({
                            attrs:    attrs,
                            tooltip:  m.data('tooltip'),
                            popover:  m.data('popover'),
                            width:    m.data('width'),
                            height:   m.data('height'),
                            href:     m.data('href'),
                            placed:   true
                        });
                    }
            });
            return _marks;
        },

        // SELECT REGION
        selectRegion :    function(id){
                if(!ref[id] || ref[id].disabled) return false;

                if(selected_id)
                    ref[selected_id].attr(ref[selected_id].default_attr);
                selected_id = id;
                switch (options.selected_mode){
                    case 'color': ref[id].attr(mapAttrs.selected); break;
                    case 'brightness': ref[id].attr({fill: methods.lighten(ref[id].default_attr.fill, options.selected_brightness)}); break;
                    default: null;
                }
        },
        // UNHIGHLIGHT REGION
        unhighlightRegion :   function(id){
                if(ref[id].disabled || selected_id == id) return false;
                ref[id].attr({'fill' : ref[id].default_attr.fill});
        },
        // HIGHLIGHT REGION
        highlightRegion : function(id){
                if(ref[id].disabled || selected_id == id) return false;

                switch (options.hover_mode){
                    case 'color': ref[id].attr(mapAttrs.hover); break;
                    case 'brightness': ref[id].attr({fill: methods.lighten(ref[id].default_attr.fill, options.hover_brightness)}); break;
                    default: null;
                }
        },
        // CONVERT LAT/LON TO X/Y (works only with world_high.svg map!)
        ll2px : function(latlng){

                var lat = latlng[0];
                var lng = latlng[1];

                var zoom = 2;

                var cbk = CBK[zoom];
                var scale = options.width/1024;
                var scale = 1;

                var x = Math.round(cbk + (lng * CEK[zoom]));

                var foo = Math.sin(lat * 3.14159 / 180)
                if (foo < -0.9999)
                    foo = -0.9999;
                else if (foo > 0.9999)
                    foo = 0.9999;

                var y = Math.round(cbk + (0.5 * Math.log((1+foo)/(1-foo)) * (-CFK[zoom])));

                var mapWorld  = [scale*(x-32.5), scale*(y-142)];

                return mapWorld;
       },
       // CHECK IF REGION IS DISABLED
       isRegionDisabled : function (name, svgfill){
            if(options.regions[name]){
                if(options.regions[name].disabled || svgfill == 'none')
                    return true;
                else
                    return false;
            }else if(options.disableAll || svgfill == 'none'){
                return true;
            }else{
                return false;
            }
       },
       regionClickHandler : function(e){

            if(options.pan && (Math.abs(viewBox[0] - pan.dx)>5 || Math.abs(viewBox[1] - pan.dy)>5))
                return false;

            methods.selectRegion(this.name);

            var m = mouseCoords(e);

            if(this.popover)
                methods.showPopover(m.x, m.y, this.popover);

            if(options.onClick)
                return options.onClick.call(this, e, methods);

       },
       addText : function (textObj){
            var styles = methods.getElementStyles(textObj);
            var text = $.map($(textObj).find('tspan'), function(val,i){
                                                                        return $(val).text();
                                                                      });



            var fontSize = parseInt(styles.getPropertyValue('font-size'));
            var delta = text.length > 1 ? -fontSize*text.length/(2*1.5) : fontSize/2;
            text = text.join('\n');

            var x = $(textObj).attr('x');
            var y = $(textObj).attr('y') - delta;

            var t = R.text(x, y, text)
            .attr({
                    'font-size': fontSize,
                    'font-family': styles.getPropertyValue('font-family') +', sans-serif, verdana',
                    'font-weight': styles.getPropertyValue('font-weight'),
                    'fill': styles.getPropertyValue('fill'),
                    'text-anchor': 'start'});

            $(t.node).css({
            	"-webkit-touch-callout": "none",
            	"-webkit-user-select": "none",
                'cursor': 'default',
                'pointer-events': 'none'
            });
       },
       // GET ELEMENT'S STYLES (fill, strokes etc..)
       getElementStyles : function (elem){
            if(!$.browser.msie){
                return elem.style;
            }else{
                var styles = {};
                if($(elem).attr('style')){
                    var def_styles = $(elem).attr('style').split(';');
                    $.each(def_styles, function(i, val){
                        var p = val.split(':');
                        styles[p[0]] = p[1];
                    });
                    styles.getPropertyValue = function(v){
                        return styles[v];
                    };
                }
                return styles;
            }
       },
       // ADD REGION (PARSE SVG DATA)
       regionAdd : function (_item){

            var styles              = methods.getElementStyles(_item);
            var svgfill             = styles.getPropertyValue('fill') || $(_item).attr('fill');
            var name                = $(_item).attr('id');

            ref[name]               = R.path( $(_item).attr('d') );
            ref[name].name          = name;
            ref[name].disabled      = methods.isRegionDisabled(name, svgfill);
            ref[name].default_attr  = {};


            // If keepSourceStyles == true, then use colors from SVG file
            if(methods.parseBoolean(options.keepSourceStyles)){

                ref[name].default_attr['fill']         = svgfill;
                ref[name].default_attr['fill-opacity'] = styles.getPropertyValue('fill-opacity') || $(_item).attr('fill-opacity');
                ref[name].default_attr['stroke']       = styles.getPropertyValue('stroke') ||  $(_item).attr('stroke');
                ref[name].default_attr['stroke-color'] = styles.getPropertyValue('stroke-color') || $(_item).attr('stroke-color');
                ref[name].default_attr['stroke-width'] = styles.getPropertyValue('stroke-width') || $(_item).attr('stroke-width');

                // If stroke is some kind of dashed style, make it simple: - - - - -
                var dash = styles.getPropertyValue('stroke-dasharray')  || $(_item).attr('stroke-dasharray');
                if( dash && dash!='none')
                    ref[name].default_attr['stroke-dasharray'] = '--';
            }else{
                if(svgfill && svgfill != 'none'){
                    ref[name].default_attr = ref[name].disabled && options.colors.disabled ? mapAttrs.disabled : mapAttrs.def
                    $.extend(ref[name].default_attr, mapAttrs.strokes);
                }else{
                    ref[name].default_attr  = {};
                }
            }

            // Set cursor
            if(ref[name].disabled){
                ref[name].default_attr.cursor = 'defalut';
                if(!options.disabledClickable)
                    $(ref[name].node).css({'pointer-events' :'none'});

            }else{
                ref[name].default_attr.cursor = options.cursor;
            }

            if(options.regions[name]){
                // Set attributes (colors, href, etc..)
                if(options.regions[name].attr)
                    ref[name].default_attr = $.extend(true, {}, ref[name].default_attr, options.regions[name].attr);
                // Set tooltip
                if(options.regions[name].tooltip)
                    ref[name].tooltip = options.regions[name].tooltip;
                // Set popover
                if(options.regions[name].popover)
                    ref[name].popover = options.regions[name].popover;
                // Should we select the region now?
                if(options.regions[name].selected)
                    methods.selectRegion(name);
                // Add custom data
                if(options.regions[name].data)
                    ref[name].data(options.regions[name].data);
            }

            ref[name].attr(ref[name].default_attr);
            // Make stroke-wdth always the same:
            $(ref[name].node).css({'vector-effect' : 'non-scaling-stroke'});

            // Add region to Raphael.set()
            RMap.push(ref[name]);
        },

        /** Lighten / Darken color
         *  Taken from http://stackoverflow.com/questions/801406/c-create-a-lighter-darker-color-based-on-a-system-color/801463#801463
         */

        lighten2: function(hexColor, factor){
                var h = (hexColor.charAt(0)=="#") ? hexColor.substring(1,7) : hexColor;
                var hsb = Raphael.rgb2hsb(parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16),parseInt(h.substring(4,6),16));
                hsb.b += .1;
                return Raphael.hsb(hsb);
        },
        lighten: function ( hexColor, factor ){

            if ( factor < 0 ) factor = 0;

            var c = hexColor;
            if ( c.substr(0,1) == "#" )
                c = c.substring(1);

            if ( c.length == 3 || c.length == 6 ){
                var i = c.length / 3;
                var f;  // the relative distance from white

                var r = parseInt( c.substr(0, i ), 16 );
                f = ( factor * r / (256-r) );
                r = Math.floor((256 * f) / (f+1));

                r = r.toString(16);
                if ( r.length == 1 ) r = "0" + r;

                var g = parseInt( c.substr(i, i), 16);
                f = ( factor * g / (256-g) );
                g = Math.floor((256 * f) / (f+1));
                g = g.toString(16);
                if ( g.length == 1 ) g = "0" + g;

                var b = parseInt( c.substr( 2*i, i),16 );
                f = ( factor * b / (256-b) );
                b = Math.floor((256 * f) / (f+1));
                b = b.toString(16);
                if ( b.length == 1 ) b = "0" + b;

                c =  r+g+b;
             }

             return "#" + c;
        },
        setPan : function(on){
            if(on){
                options.pan = true;
                $mapContainer.on('mousedown', methods.panStart);
            }else{
                if(options.pan)
                  $mapContainer.off('mousedown', methods.panStart);
                options.pan = false;
            }
        },
        markAddClickHandler : function(e){
            methods.markAdd({xy: [e.offsetX, e.offsetY]}, true);
        },
        markEventHandlersSet : function(on, mark){

            on = methods.parseBoolean(on);

            if(on){
                if(options.editMode === false)
                    mark.unhover();
                mark.drag(methods.markMove, methods.markMoveStart, methods.markMoveEnd);

            }else{
                if(options.editMode)
                    mark.undrag();

                mark.hover(
                     function(){
                        if(this.data('tooltip')){
                            mapTip.html( this.data('tooltip') );
                            mapTip.show();
                        }
                     },
                     function(){
                        if(this.data('tooltip'))
                            mapTip.hide();
                });

            }
        },
        setMarksEditMode : function(on, mark){

            on = methods.parseBoolean(on);

            if(on){
                RMap.click(methods.markAddClickHandler);
            }else{
                RMap.unclick(methods.markAddClickHandler);
            }

            options.editMode = on;
        },
        setZoom : function (on){
            if(on){
                options.zoom = true;
                $mapContainer.bind('mousewheel.mapsvg',function(event, delta, deltaX, deltaY) {
                    var d = delta > 0 ? 1 : -1;
                    methods.zoom(d, event.offsetX, event.offsetY);
                    return false;
                });

                // Add zoom buttons
                if(options.zoomButtons.show){

                    var buttons = $('<div></div>');

                    var cssBtn = {'border-radius': '3px', 'display': 'block', 'margin-bottom': '7px'};

                    var btnZoomIn = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhElEQVR4nJWTT4rqQBDGf92pSEJWmYfgQpABb+EB1NU8DyBe5M1q5iKStTCDd/AWggElC3EQJAQxbb/NJDH+mccraEh31fdVfR8pBRBF0Uuapn+AX8CZn0MDuyAI3sfj8aeaTqcvWZZ9XFdZazmdTgC4rotS6oYpCILfkmXZ6yNwt9tFKcVyucRxnBuSNE1fNfB0TWCModlsMhwOGQwGdDod8jy/J+dJP9JsjKl9W2vvlZ3lcuyiS57ntY7FvZDgum6Zk0vN7XYbay3GGMIwLItarRbGGEQErTVxHON5XkVQAEaj0b0x6fV6tXsURRwOBxzHQd9F/CPO58o2ARARdrsds9ms9CIMQ/r9PgCLxYL1eo3rulhr2e/3dQkAnueRJElp2vF4LLskScJmsynNK8A1AqjcVUohUqVEBBGpuV+E/j63CV093/sLizIBvoDny1fHcdhut8znc5RSrFar2kQX8aV933+7ZldK0Wg0iOO4BD9YpjcF8L2R/7XOvu+/TyaTz79+UqnWsVHWHAAAAABJRU5ErkJggg==" id="btnZoomIn"/>').on('click', function(e){
                        methods.zoomIn();
                    }).css(cssBtn);

                    var btnZoomOut = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA6klEQVR4nKWTPW6DQBBG3w4RaLXSFs4puAe9fQHEReLKPgYN4gLxQei5RNytFraANNEKKwk29uum+N78SKMA2rbdO+c+gHdgYh0Bvowx57IsL6ppmr33/vNO6E+MMQfx3h+fCQM4544C7J4VADvh/s5rTG/LKoTANK37RIQ0TWMdBSEE8jwnyzLmef437L2n7/soiQLnHEVRPDR313VRIA8lVogTWGup6/pmhSRJAFBKxcAwDFhrfwuSJCGEwDiOqx2VUlF8I1h23ILw2h1EgOsLgqtorU/LI23BGHNSAD8fuemdtdbnqqou39SbTK6RdYDsAAAAAElFTkSuQmCC" id="btnZoomOut"/>').on('click', function(e){
                        methods.zoomOut();
                    }).css(cssBtn);

                    buttons.append(btnZoomOut).append(btnZoomIn)


                    .css({position: 'absolute', top: '15px', width: '16px', cursor: 'pointer'});

                    if(options.zoomButtons.location == 'right')
                        buttons.css({'right': '15px'});
                    else if(options.zoomButtons.location == 'left')
                        buttons.css({'left': '15px'});;

                    $mapContainer.append(buttons);
                }

            }else{
                options.zoom = false;
                $mapContainer.unbind('mousewheel.mapsvg');
            }
        },
        setSize : function( width, height, responsive ){

            options.width      = parseInt(width);
            options.height     = parseInt(height);
            options.responsive = parseInt(responsive);

            if (!options.width && options.height){
            	options.width	= options.height * svgDefault.width / svgDefault.height;
            }else if (options.width && !options.height){
            	options.height	= options.width * svgDefault.height/svgDefault.width;
            }else if (!options.width && !options.height){
                options.width	= svgDefault.width;
                options.height	= svgDefault.height;
                same_size = true;
            }
            whRatio      = options.width / options.height;
            scale        = methods.getScale();

            $mapContainer.height($mapContainer.width() / whRatio);

            if($.browser.msie && $.browser.version<9)
                responsive = false;

            if(responsive){
                $mapContainer.css({
                    'max-width': options.width+'px',
                    'max-height': options.height+'px',
                    'width': 'auto',
                    'height': 'auto',
                    'position': 'relative',
                }).height($mapContainer.width() / whRatio);

                $(window).bind('resize.mapsvg', function(){
                    $mapContainer.height($mapContainer.width() / whRatio);
                });
            }else{
                $mapContainer.css({
                    'width': options.width+'px',
                    'height': options.height+'px',
                    'max-width': 'none',
                    'max-height': 'none',
                    'position': 'relative'
                });
                $(window).unbind('resize.mapsvg');
            }

            return [options.width, options.height];


        },
        setMarks : function (marksArr){
            if(marksArr){
                $.each(marksArr, function(i, mark){

                        methods.markAdd(mark);
                });

                // Adjust markers position according to current scale
                methods.marksAdjustPosition();
            }
        },

        // Show tooltip (this function will be defined later in setTooltip method)
        showTip : function(){},
        showPopover : function(){},
        // Hide tooltip
        hideTip : function (){
            mapTip.hide();
            mapTip.html('');
        },

        // Set tooltip behaviour
        setTooltip : function (mode){

            // Add tooltip container
            $("body").prepend('<div id="map_tooltip"></div>');

            mapTip = $('#map_tooltip');

            mapTip.css({
               'font-weight': 'normal',
               'font-size' : '12px',
               'color': '#000000',
               'position': 'absolute',
               'border-radius' : '4px',
               '-moz-border-radius' : '4px',
               '-webkit-border-radius' : '4px',
               'top': '0',
               'left': '0',
               'z-index': '1000',
               'display': 'none',
               'background-color': 'white',
               'border': '1px solid #eee',
               'padding': '4px 7px'
            });

            if(options.tooltips.show == 'hover'){
                $mapContainer.mousemove(function(e) {
                    $('#map_tooltip').css('left', e.pageX).css('top', e.pageY + 30);
                });
            }

            methods.showTip = (options.tooltipsMode == 'custom' ?
                function (name){
                    if(ref[name].tooltip){
                        mapTip.html(ref[name].tooltip);
                        mapTip.show();
                    }
                }: options.tooltipsMode == 'names' ?
                function (name){
                        if(ref[name].disabled) return false;
                        mapTip.html(name.replace(/_/g, ' '));
                        mapTip.show();
                }: options.tooltipsMode == 'combined' ?
                function (name){
                    if(ref[name].tooltip){
                        mapTip.html(ref[name].tooltip);
                        mapTip.show();
                    }else{
                        if(ref[name].disabled) return false;
                        mapTip.html(name.replace(/_/g, ' '));
                        mapTip.show();
                    }
                }: function(name){null;}
            );

        },
        // Set popover behaviour
        setPopover : function (on){

            if(!on) return false;

            // Add tooltip container
            $("body").prepend('<div id="map_popover"><div id="map_popover_content"></div><div id="map_popover_close">x</div></div>');

            mapPopover = $('#map_popover');

            var popoverClose = mapPopover.find('#map_popover_close');


            mapPopover.css({
               'font-weight': 'normal',
               'font-size' : '12px',
               'color': '#000000',
               'position': 'absolute',
               'border-radius' : '4px',
               '-moz-border-radius' : '4px',
               '-webkit-border-radius' : '4px',
               'top': '0',
               'left': '0',
               'z-index': '1000',
               'width': options.popover.width+(options.popover.width=='auto'? '': 'px'),
               'height': options.popover.height+(options.popover.height=='auto'? '': 'px'),
               'display': 'none',
               'background-color': 'white',
               'border': '1px solid #ccc',
               'padding': '12px',
               '-webkit-box-shadow': '5px 5px 5px 0px rgba(0, 0, 0, 0.2)',
               'box-shadow': '5px 5px 5px 0px rgba(0, 0, 0, 0.2)'

            });

            popoverClose.css({
                'position': 'absolute',
                'top': '0',
                'right' : '5px',
                'cursor': 'pointer',
                'color': '#aaa',
                'z-index' : '1200'

            });



            methods.showPopover = function (x,y, content){
                                    if(content){
                                        mapPopover.find('#map_popover_content').html(content);
                                        var nx = x - mapPopover.outerWidth()/2;
                                        var ny = y - mapPopover.outerHeight() - 7;
                                        if(nx<0) nx = 0;
                                        if(ny<0) ny = 0;
                                        if(nx+mapPopover.outerWidth() > $(window).width()) nx = $(window).width() - mapPopover.outerWidth();
                                        if(ny+mapPopover.outerHeight() > $(window).width()) ny = $(window).height() - mapPopover.outerHeight();
                                        $('#map_popover').css('left', nx).css('top', ny);
                                        mapPopover.show();
                                        //$('body').on('click', methods.popoverOffHandler);
                                    }
                                  };
            methods.hidePopover = function(){
                mapPopover.find('#map_popover_content').html('');
                mapPopover.hide();
                //$('body').off('click', methods.popoverOffHandler);
            };

            popoverClose.on('click', methods.hidePopover);

        },
        popoverOffHandler : function(e){
            if(!$(e.target).closest('#map_popover').length)
                methods.hidePopover();
        },
        parseBoolean : function (string) {
          switch (String(string).toLowerCase()) {
            case "true":
            case "1":
            case "yes":
            case "y":
              return true;
            case "false":
            case "0":
            case "no":
            case "n":
              return false;
            default:
              return undefined;
          }
        },
        mouseOverHandler : function(){},
        mouseOutHandler : function(){},
        mouseDownHandler : function(){},
        // INIT
        init    : function(opts) {

            if(!opts.source) {
                alert('mapSVG Error: Please provide a map URL');
                return false;
            }

            $mapContainer = $(this);



            opts.pan  = methods.parseBoolean(opts.pan);
            opts.zoom = methods.parseBoolean(opts.zoom);
            opts.responsive = methods.parseBoolean(opts.responsive);
            opts.disableAll = methods.parseBoolean(opts.disableAll);

            // Merge width user-defined options
            options = $.extend(true, defaults, opts);

            // Set background

            $mapContainer.css({'background': options.colors.background,
                               'height': '100px'
                              });

            var loading = $('<div>'+options.loadingText+'</div>').css({
                position: 'absolute',
                top:  '50%',
                left: '50%',
                'z-index': 1,
                padding: '10px 15px',
                'border-radius': '10px',
                'border': '1px solid #ccc',
                background: '#eee'
            });

            $mapContainer.append(loading);


            loading.css({
                'margin-left': function () {
                    return -($(this).width() / 2)+'px';
                },
                'margin-top': function () {
                    return -($(this).height() / 2)+'px';
                }
            });




            // Attributes for regions in different states
            mapAttrs = {
                strokes : {
                	stroke:            options.colors.stroke,
                	"stroke-width":    options.strokeWidth,
                	"stroke-linejoin": "round"
                },
                def : {
                	fill: options.colors.base       // Base color
                },
                disabled : {
                	fill: options.colors.disabled   // Disabled color
                },
                hover  : {
                	fill: options.colors.hover      // Hover color
                },
                selected : {
                	fill: options.colors.selected   // Selected color
                }
            };

            // GET the map by ajax request
            $.ajax({
                url:      options.source,
                contentType: "image/svg+xml; charset=utf-8",
                //dataType: (jQuery.browser.msie) ? 'text' : 'xml', // check if IE
                beforeSend: function(x) {
                        if(x && x.overrideMimeType) {
                            x.overrideMimeType("image/svg+xml; charset=utf-8");
                        }
                    },
                success:  function(xmlData){

                    /* ...Do we really need that ActiveXObject?
                       map works fine in IE 7,8,9 without it.

                    if ( typeof xmlData == 'string') {
                        // if IE then use ActiveX
                        data = new ActiveXObject( 'Microsoft.XMLDOM');
                        data.async = false;
                        data.loadXML(xmlData);
                        data = $(data);
                    } else {
                    */
                        data = xmlData;
                    //}

                    // Default width/height/viewBox from SVG
                    var svgTag         = $(data).find('svg');
                    svgDefault.width   = parseFloat(svgTag.attr('width').replace(/px/g,''));
                    svgDefault.height  = parseFloat(svgTag.attr('height').replace(/px/g,''));
                    svgDefault.viewBox = svgTag.attr('viewBox') ? svgTag.attr('viewBox').split(' ') : [0,0, svgDefault.width, svgDefault.height];
                    $.each(svgDefault.viewBox, function(i,v){
                        svgDefault.viewBox[i] = parseInt(v);
                    });
                    _viewBox            = (options.viewBox.length==4) ? options.viewBox : svgDefault.viewBox;

                    // Set size
                    methods.setSize(options.width, options.height, options.responsive);

                    // Attach Raphael to given jQuery element

                    // IE 7&8 doesn't support responsive size so just set width and height in pixels,
                    // for all other browsers set width and height to 100% to fit DIV container

                    if($.browser.msie && $.browser.version < 9)
                        R = Raphael($mapContainer.attr('id'), options.width, options.height);
                    else
                        R = Raphael($mapContainer.attr('id'), '100%', '100%');


                	RMap     = R.set();
                    RMarks   = R.set();

                    // Set viewBox
                    methods.setViewBox(_viewBox);


                    // Render each path in SVG
                    $('path',data).each(function(i, _item){
                        methods.regionAdd(_item);
                    });

                    // Render text elements
                    $('text',data).each(function(i, _item){
                        methods.addText(_item);
                    });

                    // Apply stroke styles to generated map
                    mapAttrs.strokes['stroke-width'] /= scale;
                    //RMap.attr(mapAttrs.strokes);

                    // Set panning
                    methods.setPan(options.pan);

                    // Set zooming by mouswheel
                    methods.setZoom(options.zoom);

                    // If there are markers, put them to the map
                    methods.setMarks(options.marks);
                    methods.setMarksEditMode(options.editMode);

                    // Set tooltips
                    methods.setTooltip(options.tooltips.mode);

                    // Set popovers
                    methods.setPopover(options.popover);

                    //Create event handlers
                    var funcStr = '';

                    /*
                     * Now let's add event handlers.
                     * Please note that we don't need mouseOver / mouseOut on mobile devices (iPad etc..)
                     */
                    if(!touchDevice){
                        // 1. MouseOver
                        funcStr = 'methods.highlightRegion(this.name);';
                        if(options.tooltips.show == 'hover')
                            funcStr += 'methods.showTip(this.name);';
                        if(options.mouseOver)
                            funcStr += 'return options.mouseOver.call(this, e, methods);';

                        methods.mouseOverHandler = new Function('e, methods, options', funcStr);

                        // 2. MouseOut
                        funcStr = '';
                        funcStr += 'methods.unhighlightRegion(this.name);';
                        if(options.tooltips.show == 'hover')
                            funcStr += 'methods.hideTip();';
                        if(options.mouseOut)
                            funcStr += 'return options.mouseOut.call(this, e, methods);';
                        methods.mouseOutHandler = new Function('e, methods, options', funcStr);
                    }

                    // 3. MouseDown
                    funcStr = '';
                    funcStr = 'methods.regionClickHandler.call(this, e);';
                    methods.mouseDownHandler = new Function('e, methods', funcStr);


                    /* EVENTS */
                    if(!touchDevice)
                    	RMap.mouseover( function(e){methods.mouseOverHandler.call(this, e, methods, options);} )
                            .mouseout( function(e){methods.mouseOutHandler.call(this, e, methods, options);} );
                    if(!options.pan)
                        RMap.mousedown( function(e){methods.mouseDownHandler.call(this, e, methods);} );
                    else
                        RMap.mouseup( function(e){methods.mouseDownHandler.call(this, e, methods);} );

                    } // end of AJAX callback
                });// end of AJAX
        loading.hide();
        return methods;

        } // end of init

   }; // end of methods


  /** $.FN **/
  $.fn.mapSvg = function( opts ) {

    if ( methods[opts] ) {
      return methods[opts].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof opts === 'object') {
      return methods.init.apply( this, arguments );
    }else if (!opts){
        return methods;
    } else {
      $.error( 'Method ' +  opts + ' does not exist on mapSvg plugin' );
    }

  }; // end of $.fn.mapSvg

})( jQuery );