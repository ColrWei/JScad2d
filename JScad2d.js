/*\
        Function for 2D cad drawing
        
        
        
        Author: Thierry Bénard
        Date: 16 Sep 2014


\*/


// --------------------------------------------------
// object descriptor: Point
// --------------------------------------------------
function Point(x, y, r) {
    "use strict";
    this.x = x;
    this.y = y;
    this.r = r;
}



//---------------------------------------------------------------------------------------
// Calculator parser: string --> value
// Replace a string formula with value of formula result
//---------------------------------------------------------------------------------------
function mathEval(exp) {
    "use strict";
    var reg = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig,
        valid = true;

    // Detect valid JS identifier names and replace them
    exp = exp.replace(reg, function ($0) {
        // If the name is a direct member of Math, allow
        if (Math.hasOwnProperty($0)) {
            return "Math." + $0;
        } else {
        // Otherwise the expression is invalid
            valid = false;
        }
    });

    // Don't eval if our replace function flagged as invalid
    if (!valid) {
        return "Invalid arithmetic expression";
    } else {
        try { return eval(exp); } catch (e) { return "Invalid arithmetic expression"; }
    }
}

// ------------------------------------------------
// function: do de-parametrization
// replace all parameters by the right number value
// input : objet = the Object json file
// ------------------------------------------------
function doDeparam(objet) {
    "use strict";
    
    var i,
        param = [],
        propr,
        noview,
        noshape,
        noline,
        noprop,
        reg,
        currshapes,
        currlines;
    
    // place all object parameters in a table
    // check if Parameters in object exist before
    
    for (propr in objet.Parameters) {
        if (objet.Parameters.hasOwnProperty(propr)) {
            param.push(propr);
        }
    }
    
    // Attention le remplacement ne fonctionne pas toujours
    // quand le nom d'un paramètre est inclu dans le nom d'un autre

    // 1st replace string (parameter) by number (value)
    // all views
    for (noview = 0; noview <= objet.Views.length - 1; noview += 1) {
        currshapes = objet.Views[noview].Shapes;
        // all shapes of current view
        for (noshape = 0; noshape <= currshapes.length - 1; noshape += 1) {
            // all points of current shape of current view
	        for (i = 0; i <= currshapes[noshape].Points.length - 1; i += 1) {
		        if (typeof currshapes[noshape].Points[i].x === 'string' || currshapes[noshape].Points[i].x instanceof String) {
			        for (noprop = 0; noprop <= param.length - 1; noprop += 1) {
				        reg = new RegExp(param[noprop], "g");
				        currshapes[noshape].Points[i].x = currshapes[noshape].Points[i].x.replace(reg, " " + objet.Parameters[param[noprop]]);
                    } // for
		        } // if
		        if (typeof currshapes[noshape].Points[i].y === 'string' || currshapes[noshape].Points[i].y instanceof String) {
			        for (noprop = 0; noprop <= param.length - 1; noprop += 1) {
				        reg = new RegExp(param[noprop], "g");
				        currshapes[noshape].Points[i].y = currshapes[noshape].Points[i].y.replace(reg, " " + objet.Parameters[param[noprop]]);
			        } // for
		        } // if
		        if (typeof currshapes[noshape].Points[i].r === 'string' || currshapes[noshape].Points[i].r instanceof String) {
			        for (noprop = 0; noprop <= param.length - 1; noprop += 1) {
				        reg = new RegExp(param[noprop], "g");
				        currshapes[noshape].Points[i].r = currshapes[noshape].Points[i].r.replace(reg, " " + objet.Parameters[param[noprop]]);
			        } // for
		        } // if
	        } // for
        } // for
        
        // First check if Views include Lines
        if (typeof objet.Views[noview].Lines !== "undefined") {
            currlines = objet.Views[noview].Lines;
            for (noline = 0; noline <= currlines.length - 1; noline += 1) {
                // Check if string to deparametrized is realyy a string
                // if not it is a number so nothing to do
                if (typeof currlines[noline].Start.x === 'string' || currlines[noline].Start.x instanceof String) {
			        for (noprop = 0; noprop <= param.length - 1; noprop += 1) {
				        reg = new RegExp(param[noprop], "g");
				        currlines[noline].Start.x = currlines[noline].Start.x.replace(reg, " " + objet.Parameters[param[noprop]]);
                    } // for
		        } // if 
                if (typeof currlines[noline].Start.y === 'string' || currlines[noline].Start.y instanceof String) {
			        for (noprop = 0; noprop <= param.length - 1; noprop += 1) {
				        reg = new RegExp(param[noprop], "g");
				        currlines[noline].Start.y = currlines[noline].Start.y.replace(reg, " " + objet.Parameters[param[noprop]]);
                    } // for
		        } // if 
                if (typeof currlines[noline].End.x === 'string' || currlines[noline].End.x instanceof String) {
			        for (noprop = 0; noprop <= param.length - 1; noprop += 1) {
				        reg = new RegExp(param[noprop], "g");
				        currlines[noline].End.x = currlines[noline].End.x.replace(reg, " " + objet.Parameters[param[noprop]]);
                    } // for
		        } // if 
                if (typeof currlines[noline].End.y === 'string' || currlines[noline].End.y instanceof String) {
			        for (noprop = 0; noprop <= param.length - 1; noprop += 1) {
				        reg = new RegExp(param[noprop], "g");
				        currlines[noline].End.y = currlines[noline].End.y.replace(reg, " " + objet.Parameters[param[noprop]]);
                    } // for
		        } // if 
            } // for no line
        }
        
    } // for
    
    // 2nd evaluate formula
    for (noview = 0; noview <= objet.Views.length - 1; noview += 1) {
        currshapes = objet.Views[noview].Shapes;
        for (noshape = 0; noshape <= currshapes.length - 1; noshape += 1) {
	        for (i = 0; i <= currshapes[noshape].Points.length - 1; i += 1) {
                currshapes[noshape].Points[i].x = mathEval("(" + currshapes[noshape].Points[i].x + ")");
                currshapes[noshape].Points[i].y = mathEval("(" + currshapes[noshape].Points[i].y + ")");
                
                if (currshapes[noshape].Points[i].r !== null) {
                    currshapes[noshape].Points[i].r = mathEval("(" + currshapes[noshape].Points[i].r + ")");
                } // if
            } // for
        } // for
    } // for
    
    return objet;
}


// --------------------------------------------------
// Function
// Return the length of string in pixels
// --------------------------------------------------
function getWidthString(the_text_that_you_want_to_measure, fontsize, fontname) {
	"use strict";
    
    var c,
        ctx,
        metric;
	c = document.createElement('canvas'); // Create a dummy canvas (render invisible with css)

    ctx = c.getContext('2d'); // Get the context of the dummy canvas
	// Set the context.font to the font that you are using
	ctx.font = fontsize + 'px' + fontname;
	// Measure the string 
	metric = ctx.measureText(the_text_that_you_want_to_measure);
	return metric.width;
}



// ------------------------------------------------
// function: Draw Lines
// draw a a line
// input : objet = the Object json file
// ------------------------------------------------
function drawLine(svgelem, objet) {
    "use strict";
    
    var noview,
        noline,
        currview,
        scale,
        myLine,
        myLineStyle = [];
    
    myLineStyle = ['center line', 'dashed'];
    
    scale = objet.Header.Scale;

    for (noview = 0; noview <= objet.Views.length - 1; noview += 1) {
        currview = objet.Views[noview];
        if (typeof objet.Views[noview].Lines !== "undefined") {  // Checking mandatory if not bug !!!!
	        for (noline = 0; noline <= currview.Lines.length - 1; noline += 1) {

                myLine = document.createElementNS("http://www.w3.org/2000/svg", "line");

                myLine.setAttribute("x1", scale * (currview.Header.Origine.x + currview.Lines[noline].Start.x));
                myLine.setAttribute("y1", scale * (currview.Header.Origine.y - currview.Lines[noline].Start.y));
    
                myLine.setAttribute("x2", scale * (currview.Header.Origine.x + currview.Lines[noline].End.x));
                myLine.setAttribute("y2", scale * (currview.Header.Origine.y - currview.Lines[noline].End.y));
                
                // Define line style:
                // center line: Done
                // dashet line: To do
                if (currview.Lines[noline].Stroke === myLineStyle[0]) {
                    myLine.setAttribute("stroke", "#999");
                    myLine.setAttribute("stroke-dasharray", "25,6,8,6");
                } else if (currview.Lines[noline].Stroke === myLineStyle[1]) {
                    myLine.setAttribute("stroke", "#000");
                    myLine.setAttribute("stroke-dasharray", "8,6");
                } else {
                    myLine.setAttribute("stroke", "#000");
                }
                myLine.setAttribute("stroke-width", 0.75);
                
                svgelem.getElementById("lines").appendChild(myLine);
            } // for
        } //if
    } // for

    return 0;
}


// -----------------------------------------------------------------
// Name: Shape
// Result: SVG form
// Som debug print are included: squeleton, center of fillet
// -----------------------------------------------------------------
function Shape() {
    "use strict";
	var i,
	    ttexte,                    // variable texte à retourner
	    pts = arguments[1],        // points du squelette de la forme pleine
	    scale = arguments[2],      // échelle de l'affichage
	    ori = arguments[3],        // origine du dessin
        texture = arguments[4],     // texture
        noview = arguments[5],      // view # for hatch pattern
        affichage = arguments[6],   // 1: affiche, 0: n'affiche pas
        format = arguments[7],      // format

        p = [],                     // number of previous point
        s = [],                     // number of next point
        
        angle = [],                 // angle value at each point
        ax,
        ay,
        bx,
        by,
    
        l = [],                     // Length between point and start & end point of fillet
    
        pr = [],
        su = [],
        m,
        n,
        kappa = 0.5522847498;
    
	// p is number of previous point
    // s is number of next point
	for (i = 0; i <= pts.length - 1; i += 1) {
		p[i] = (i - 1 + pts.length) % pts.length;
		s[i] = (i + 1) % pts.length;
	}
	
    // Find angle at each point
    for (i = 0; i <= pts.length - 1; i += 1) {
	    ax = pts[p[i]].x - pts[i].x;
	    ay = pts[p[i]].y - pts[i].y;
	    bx = pts[s[i]].x - pts[i].x;
	    by = pts[s[i]].y - pts[i].y;
        // arccosinus du produit scalaire sur le produit des normes
	    angle[i] = Math.acos((ax * bx + ay * by) /
                   (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by)));
    }

	// Calcul de la longueur (pour positionner les 2 pts "précédent" et "suivant")
	for (i = 0; i <= pts.length - 1; i += 1) {
        // do only if radius exist
		if (pts[i].r !== null) {
			l[i] = pts[i].r / Math.tan(angle[i] / 2.0);
		}
	}

	// Calcul des coordonnées des points "précédent" et "suivant".
    // Ce sont les points qui débutent et ferment le 'fillet'
    // (x2, y2) = current point, (x1, y1) = previous or next point
    
    // Division of line segment
    // co-ordinates of the point R are ((mx2 + nx1)/(m + n), (my 2 + ny1)/(m + n))
    // the point R divides the line-segment internally in a given ratio m : n
    
    // For fillet (circle) ratio is find from kappa parameter

	for (i = 0; i <= pts.length - 1; i += 1) {
		if (pts[i].r !== null) {
			// calcul sur précédent
			ax = pts[p[i]].x - pts[i].x;
			ay = pts[p[i]].y - pts[i].y;
			
			n = l[i];
			m = Math.sqrt(ax * ax + ay * ay) - n;
			
			pr[2 * i] = new Point((m * pts[i].x + n * pts[p[i]].x) / (m + n),
                                  (m * pts[i].y + n * pts[p[i]].y) / (m + n), null);
			
			n = l[i] - pts[i].r * kappa;
			m = Math.sqrt(ax * ax + ay * ay) - n;
			pr[2 * i + 1] = new Point((m * pts[i].x + n * pts[p[i]].x) / (m + n),
                                      (m * pts[i].y + n * pts[p[i]].y) / (m + n), null);
            
			// calcul sur suivant
			bx = pts[s[i]].x - pts[i].x;
			by = pts[s[i]].y - pts[i].y;
			
			n = l[i];
			m = Math.sqrt(bx * bx + by * by) - n;
			su[2 * i] = new Point((m * pts[i].x + n * pts[s[i]].x) / (m + n),
                                  (m * pts[i].y + n * pts[s[i]].y) / (m + n), null);
			
			n = l[i] - pts[i].r * kappa;
			m = Math.sqrt(bx * bx + by * by) - n;
			su[2 * i + 1] = new Point((m * pts[i].x + n * pts[s[i]].x) / (m + n),
                                      (m * pts[i].y + n * pts[s[i]].y) / (m + n), null);
		}
	}

	if (affichage === 1) {
		// courbe d'origine sans les fillet pour le debug
		ttexte = "<path d=\"M";
		for (i = 0; i <= pts.length - 1; i += 1) {
			ttexte += " " + (scale * (ori.x + pts[i].x)) + " " + (scale * (ori.y - pts[i].y)) + " L";
		}
		ttexte = ttexte.substring(0, ttexte.length - 2);
		ttexte += "z\" fill=\"white\" stroke=\"red\" stroke-width=\"1\" />";
	}
      
    // courbe avec les fillet
    ttexte += "<g><path d=\"M";
    for (i = 0; i <= pts.length - 1; i += 1) {
		if (pts[i].r !== null) {
			ttexte += (scale * (ori.x + pr[2 * i].x)) + "," +
                      (scale * (ori.y - pr[2 * i].y)) + " C" +
                      (scale * (ori.x + pr[2 * i + 1].x)) + "," +
                      (scale * (ori.y - pr[2 * i + 1].y)) + " " +
                      (scale * (ori.x + su[2 * i + 1].x)) + "," +
                      (scale * (ori.y - su[2 * i + 1].y)) + " " +
                      (scale * (ori.x + su[2 * i].x)) + "," +
                      (scale * (ori.y - su[2 * i].y)) + " L";
		} else {
			ttexte += (scale * (ori.x + pts[i].x)) + "," + (scale * (ori.y - pts[i].y)) + " L";
		}
    }
      
    ttexte = ttexte.substring(0, ttexte.length - 2);
	
	// texture de la forme
	if (texture === "hatch") {
		ttexte += "z\" fill=\"url(#diagonalHatch" + "View" + noview + ")\" stroke=\"black\" stroke-width=\"2\" /></g>";
	} else {
		ttexte += "z\" fill=\"white\" stroke=\"black\" stroke-width=\"2\" /></g>";
	}
	
    // Print key points of shape (squeleton)
	if (affichage === 1) {
		// Affiche les numéros de chaque point
		for (i = 0; i <= pts.length - 1; i += 1) {
			ttexte += "<text x=\"" + (scale * (ori.x + pts[i].x)) + "\"" +
                           " y=\"" + (scale * (ori.y - pts[i].y)) + "\"" +
                           " font-size=\"" + format.font_size + "\" fill=\"red\">" + i + "</text>";
		}
	}
	
	// Print key points of fillet (squeleton)
	if (affichage === 2) {
        for (i = 0; i <= pts.length - 1; i += 1) {
		    if (pts[i].r !== null) {
			    ttexte += "<circle cx=\"" + (scale * (ori.x + pr[2 * i].x)) + "\"" +
                                 " cy=\"" + (scale * (ori.y - pr[2 * i].y)) + "\"" +
                                 " r=\"6\" stroke=\"black\" stroke-width=\"0\" fill=\"yellow\"/>";
			    ttexte += "<circle cx=\"" + (scale * (ori.x + pr[2 * i + 1].x)) + "\"" +
                                 " cy=\"" + (scale * (ori.y - pr[2 * i + 1].y)) + "\"" +
                                 " r=\"6\" stroke=\"black\" stroke-width=\"0\" fill=\"green\"/>";
			    ttexte += "<circle cx=\"" + (scale * (ori.x + su[2 * i].x)) + "\"" +
                                 " cy=\"" + (scale * (ori.y - su[2 * i].y)) + "\"" +
                                 " r=\"6\" stroke=\"black\" stroke-width=\"0\" fill=\"yellow\"/>";
			    ttexte += "<circle cx=\"" + (scale * (ori.x + su[2 * i + 1].x)) + "\"" +
                                 " cy=\"" + (scale * (ori.y - su[2 * i + 1].y)) + "\"" +
                                 " r=\"6\" stroke=\"black\" stroke-width=\"0\" fill=\"green\"/>";
		    }
	    }
	}

	// Print center of fillet (in red)
	if (affichage === 1) {
        var ma, ca, mb, cb,
            x0, x1, y0, y1;
	    for (i = 0; i <= pts.length - 1; i += 1) {
		    if (pts[i].r !== null) {
			    // rotation du point de base autour du point de départ du congé de 90°
			    // 1. changement de repère
			    x1 = pts[i].x - pr[2 * i].x;
			    y1 = pts[i].y - pr[2 * i].y;
			    // 2. rotation de 90°
			    x0 = -y1;
			    y0 = x1;
			    // 3. changement de repère inverse
			    x0 = x0 + pr[2 * i].x;
			    y0 = y0 + pr[2 * i].y;

			    x1 = pr[2 * i].x;
			    y1 = pr[2 * i].y;

			    // Calcul des paramètres de la droite
			    ma = (y1 - y0) / (x1 - x0);
			    ca = (x1 * y0 - x0 * y1) / (x1 - x0);
		
			    // rotation du point de base autour du point de départ du congé de 90°
			    // 1. changement de repèe
			    x1 = pts[i].x - su[2 * i].x;
			    y1 = pts[i].y - su[2 * i].y;
			    // 2. rotation de 90°
			    x0 = -y1;
			    y0 = x1;
			    // 3. changement de repère inverse
			    x0 = x0 + su[2 * i].x;
			    y0 = y0 + su[2 * i].y;
			
			    x1 = su[2 * i].x;
			    y1 = su[2 * i].y;
			    // Calcul des paramètres de la droite
			    mb = (y1 - y0) / (x1 - x0);
			    cb = (x1 * y0 - x0 * y1) / (x1 - x0);
			
			    // prise en compte des droites verticales m = infini ou -infini
			    if (ma === "Infinity" || ma === "-Infinity") {
				    x0 = pr[2 * i].x;
				    y0 = mb * x0 + cb;
			    } else if (mb === "Infinity" || mb === "-Infinity") {
				    x0 = su[2 * i].x;
				    y0 = ma * x0 + ca;
			    } else {
				    x0 = (cb - ca) / (ma - mb);
				    y0 = ma * x0 + ca;
			    }
			
			    ttexte += "<circle cx=\"" + (scale * (ori.x + x0)) +
                               "\" cy=\"" + (scale * (ori.y - y0)) +
                               "\" r=\"4\" stroke-width=\"0\" fill=\"red\"/>";
		    }
	    }
	}
	
	return ttexte;
}


//--------------------------------------------------------------------------------------------
// Draw dimension
// input:
//         objet: all data in object form
//         dim  : objet of no of dimension to draw
//--------------------------------------------------------------------------------------------
function drawDimension(theSvgElement, objet, dim) {
    "use strict";
	var eloignement = 5,            // length in pixel between shape and attach line
        longueur = dim.FreeSpace,   // length in pixel between dimension line and shape

        PtStart = objet.Views[dim.PtStart.View].Shapes[dim.PtStart.Shape].Points[dim.PtStart.Point],
        PtEnd = objet.Views[dim.PtEnd.View].Shapes[dim.PtEnd.Shape].Points[dim.PtEnd.Point],
        Ori = objet.Views[dim.PtStart.View].Header.Origine,
        scale = objet.Header.Scale,
        
        maxy,
        maxx,                 // needed to dimension location
        stringtoprint,              // text to print
        prefix,                     // value to print before dimension value (R or diameter symbol)
        sens,                       // side to draw dimension up or down / left or right
    
        line1,
        line2,
        line3,
        line4,
        text1,
        textheight = 8;

    switch (dim.Sens) {
    case "top":
        sens = 1;
        break;
    case "bottom":
        sens = -1;
        break;
    case "left":
        sens = -1;
        break;
    case "right":
        sens = 1;
        break;
    } // switch
    
    // Add a prefix (ie diamter symbol or R for radius) to dimension
    prefix = "";
    if (typeof dim.Prefix !== "undefined") {
        if (dim.Prefix === "diameter") {
            prefix = "\u2300" + " ";
        } else if (dim.Prefix === "radius") {
            prefix = "R" + " ";
        } else {
            prefix = "";
        }
    }
	

	if (dim.Direction === "vertical") {
        
        // text
		stringtoprint = prefix + Math.abs((PtEnd.y - PtStart.y));
    
	    // 1st calculate the max between starting point and ending point of dimension
	    maxx = Math.max(scale * PtStart.x + sens * longueur, scale * PtEnd.x + sens * longueur);

	    // lignes d'attache (Start side)
	    line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line1.setAttribute("x1", scale * (Ori.x + PtStart.x) + sens * eloignement);
        line1.setAttribute("y1", scale * (Ori.y - PtStart.y));
        line1.setAttribute("x2", scale * (Ori.x) + maxx);
        line1.setAttribute("y2", scale * (Ori.y - PtStart.y));
        line1.setAttribute("stroke", objet.Format.Dimensions_color);
        theSvgElement.getElementById("dimension").appendChild(line1);

	    // lignes d'attache (End side)
	    line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line2.setAttribute("x1", scale * (Ori.x + PtEnd.x) + sens * eloignement);
        line2.setAttribute("y1", scale * (Ori.y - PtEnd.y));
        line2.setAttribute("x2", scale * (Ori.x) + maxx);
        line2.setAttribute("y2", scale * (Ori.y - PtEnd.y));
        line2.setAttribute("stroke", objet.Format.Dimensions_color);
        theSvgElement.getElementById("dimension").appendChild(line2);

		// Global line start
	    line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line3.setAttribute("x1", scale * (Ori.x) + (maxx - sens * eloignement));
        line3.setAttribute("y1", scale * (Ori.y - PtStart.y));
        line3.setAttribute("x2", scale * (Ori.x) + (maxx - sens * eloignement));
        line3.setAttribute("y2", scale * (Ori.y - PtStart.y - 0.5 * (PtEnd.y - PtStart.y)) - 1 * textheight);
        line3.setAttribute("stroke", objet.Format.Dimensions_color);
	    line3.setAttribute('marker-start', 'url(#markerArrowStart)');
	    //line3.setAttribute('marker-end', 'url(#markerArrowEnd)');
        theSvgElement.getElementById("dimension").appendChild(line3);
        
		// Global line end
	    line4 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line4.setAttribute("x1", scale * (Ori.x) + (maxx - sens * eloignement));
        line4.setAttribute("y1", scale * (Ori.y - PtStart.y - 0.5 * (PtEnd.y - PtStart.y)) + 1 * textheight);
        line4.setAttribute("x2", scale * (Ori.x) + (maxx - sens * eloignement));
        line4.setAttribute("y2", scale * (Ori.y - PtEnd.y));
        line4.setAttribute("stroke", objet.Format.Dimensions_color);
	    //line4.setAttribute('marker-start', 'url(#markerArrowStart)');
	    line4.setAttribute('marker-end', 'url(#markerArrowEnd)');
        theSvgElement.getElementById("dimension").appendChild(line4);

		// text
	    text1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
	    // need some special formula to take into account the height of font
	    text1.setAttribute("x", scale * Ori.x + (maxx - sens * eloignement) -  0.5 * objet.Format.font_size * (0.35146 / 25.4) * 96);
	    text1.setAttribute("text-anchor", "middle");
	    text1.setAttribute("style", "writing-mode: tb;");
	    text1.setAttribute("y", scale * (Ori.y - (PtStart.y + PtEnd.y) / 2));
	    text1.setAttribute("fill", objet.Format.Dimensions_color);
	    text1.setAttribute("font-size", objet.Format.font_size);
	    text1.textContent = stringtoprint;
	    theSvgElement.getElementById("dimension").appendChild(text1);
		
	} else if (dim.Direction === "horizontal") {
        
        // text
		stringtoprint = prefix + Math.abs(PtEnd.x - PtStart.x);
        
		maxy = Math.max(scale * PtStart.y + sens * longueur, scale * PtEnd.y + sens * longueur);

	    // lignes d'attache (Start side)
	    line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line1.setAttribute("x1", scale * (Ori.x + PtStart.x));
        line1.setAttribute("y1", scale * (Ori.y - PtStart.y) - sens * eloignement);
        line1.setAttribute("x2", scale * (Ori.x + PtStart.x));
        line1.setAttribute("y2", scale * (Ori.y) - maxy);
        line1.setAttribute("stroke", objet.Format.Dimensions_color);
        theSvgElement.getElementById("dimension").appendChild(line1);

	    // lignes d'attache (End side)
	    line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line2.setAttribute("x1", scale * (Ori.x + PtEnd.x));
        line2.setAttribute("y1", scale * (Ori.y - PtEnd.y) - sens * eloignement);
        line2.setAttribute("x2", scale * (Ori.x + PtEnd.x));
        line2.setAttribute("y2", scale * (Ori.y) - maxy);
        line2.setAttribute("stroke", objet.Format.Dimensions_color);
        theSvgElement.getElementById("dimension").appendChild(line2);
		
		// Global line start
	    line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line3.setAttribute("x1", scale * (Ori.x + PtStart.x));
        line3.setAttribute("y1", scale * (Ori.y) - (maxy - sens * eloignement));
        line3.setAttribute("x2", scale * (Ori.x + PtStart.x + 0.5 * (PtEnd.x - PtStart.x)) - 0.5 * getWidthString(stringtoprint, objet.Format.font_size, "Helvetica"));
        line3.setAttribute("y2", scale * (Ori.y) - (maxy - sens * eloignement));
        line3.setAttribute("stroke", objet.Format.Dimensions_color);
	    line3.setAttribute('marker-start', 'url(#markerArrowStart)');
	    //line3.setAttribute('marker-end', 'url(#markerArrowEnd)');
        theSvgElement.getElementById("dimension").appendChild(line3);
        
		// Global line end
	    line4 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line4.setAttribute("x1", scale * (Ori.x + PtStart.x + 0.5 * (PtEnd.x - PtStart.x)) + 0.5 * getWidthString(stringtoprint, objet.Format.font_size, "Helvetica"));
        line4.setAttribute("y1", scale * (Ori.y) - (maxy - sens * eloignement));
        line4.setAttribute("x2", scale * (Ori.x + PtEnd.x));
        line4.setAttribute("y2", scale * (Ori.y) - (maxy - sens * eloignement));
        line4.setAttribute("stroke", objet.Format.Dimensions_color);
	    //line4.setAttribute('marker-start', 'url(#markerArrowStart)');
	    line4.setAttribute('marker-end', 'url(#markerArrowEnd)');
        theSvgElement.getElementById("dimension").appendChild(line4);

        // text
	    text1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
	    text1.setAttribute("x", scale * (Ori.x + (PtStart.x + PtEnd.x) / 2));
	    text1.setAttribute("text-anchor", "middle");
        // we have to find a formula to determine the paramter 4 in function of font and font size
        text1.setAttribute("y", scale * (Ori.y) - (maxy - sens * eloignement - 0.5 * textheight));
	    text1.setAttribute("fill", objet.Format.Dimensions_color);
        text1.setAttribute("background-color", "#ffff00");
	    text1.setAttribute("font-size", objet.Format.font_size);
	    text1.textContent = stringtoprint;
	    theSvgElement.getElementById("dimension").appendChild(text1);

	} // else if


	return 0;
}



	
