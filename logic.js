var color = 255;
var cnvHeight = 500;
var cnvWidth = 500;
var shapeWidth = 40;
var shapeHeight = 40;
var cnv;
var circles = new Array();
var triangles = new Array();
var manualCircles = 0;
var url = "img/bikini.jpg"
$(document).ready(function(){
	cnv = new fabric.Canvas('canvas');
	var cv = document.getElementById("c2");
	$("#c2").css('background-image', 'url('+url+')');
	var ctx = cv.getContext("2d");
	showFace();
	

	$('#go').click(function(){
		var start = new Date().getTime();
		var face = cnv.item(0);
		rest();
		placeFace(face.getHeight(), face.getLeft(), face.getTop());
		var end = new Date().getTime();
		var time = end - start;
		console.log('Execution time: ' + time);
		draw(ctx);
	});
	$('#circle').click(function(){
		var crc = new fabric.Circle({ top: 100, left: 100, radius: 50, fill: '#f55' });
		circles.push(crc);
		cnv.add(crc);
		manualCircles++;
	});
	$('#triangle').click(function(){
		var tr = new fabric.Triangle({ width: shapeWidth, height: shapeHeight, top: cnvHeight/3, left: (cnvWidth/6)*2, fill: '#f55' });
		triangles.push(tr);
		cnv.add(tr);
	});
});



function draw(c){
	
	for (var i = manualCircles; i < circles.length; i++) {
		clearCircle(circles[i].getLeft() + circles[i].getHeight()/2, circles[i].getTop() + circles[i].getHeight()/2, circles[i].getHeight()/2, c);
	}
	c.fillStyle = 'rgba('+color+',0,0,1)';
	c.globalCompositeOperation = 'xor';
	c.fillRect(0,0, cnvWidth, cnvHeight);
};

//method that clears a circle at given position and with given radius
function clearCircle(x,y,r,c){
	var g = c.createRadialGradient(x, y, r, x, y, 0);
	g.addColorStop(0, 'rgba(0,0,0,0)');
	g.addColorStop(0, 'rgba('+color+',0,0,1)');
	c.fillStyle = g;
	c.beginPath();
	c.arc(x, y, r, 0, Math.PI*2, true);
	c.closePath();
	c.fill();
};

function showFace(){
	fabric.Image.fromURL('img/derpina.png', function(oImg) {
		cnv.add(oImg);
	});

	
	
	cnv.setBackgroundImage(url, cnv.renderAll.bind(cnv));
};

function placeFace(h, x, y){ //ansiktet
	addCircle(x,y,h/2);
}

function rest(){	
	var r = cnvWidth/4;
	var step = 1;
	var x = 0-r;
	var y = 0-r;
	while(r > 10){
		while(y + r < cnvHeight){
			if(x + r > cnvWidth){
				 y += step;
				 x = 0-r;
			}
			else{
				if(!triangleCollision(x,y,r) && !circleCollision(x,y,r)){
					addCircle(x,y,r);
					x += 2*r;
				}
				else{
					x += step;
				}
			}
		}
		x = 0;
		y = 0;
		r = r *0.8 - 5;
	}
}

function triangleCollision(crcX, crcY, cR){
	for (var j = 0; j < triangles.length; j++) {
		var tr = triangles[j];
		var bound = tr.getBoundingRect();
		if(rectangleCollision(crcY, crcY+2*cR, crcX, crcX+2*cR, bound.top, bound.top+bound.height, bound.left, bound.left+bound.width)){
			var aX = tr.oCoords.tl.x + tr.getWidth()/2;
			var aY = tr.oCoords.tl.y;

			var bX = tr.oCoords.bl.x;
			var bY = tr.oCoords.bl.y;

			var cX = tr.oCoords.br.x;
			var cY = tr.oCoords.br.y;

			var slope = (aY-bY)/(aX-bX)*-1;

			var xLen = tr.getWidth();
			var compareY = bY;
			var resolution = 20; //Must be an even number!
			for(var i = 0; i < resolution+1;  i++){
				var x = i*(xLen/resolution);
				if(aY > bY){
					x = x*-1;
				}
				var compareX = bX + x;
				if(distance(compareX, compareY, crcX+cR, crcY+cR) < cR || centreInsideTriangle(crcX, crcY, cR, tr)){
					//console.log("triangle hit");
					return true;
					
				}
				else if(distance(compareX, bY, crcX+cR, crcY+cR) < cR || centreInsideTriangle(crcX, crcY, cR, tr)){
					return true;
				}			
				if(i == resolution/2){
					slope = slope*-1;
				}
				compareY -= (xLen/resolution)*slope;
			}
		}
	}
	return false;
}

function centreInsideTriangle(crcX, crcY, cR, tr){
	var aX = tr.oCoords.tl.x + ((tr.oCoords.tr.x - tr.oCoords.tl.x)/2);
	var aY = tr.oCoords.tl.y;

	var bX = tr.oCoords.bl.x;
	var bY = tr.oCoords.bl.y;

	var cX = tr.oCoords.br.x;
	var cY = tr.oCoords.br.y;

	var ccX = crcX + cR;
	var ccY = crcY + cR;

	if (fAB(aX, aY, bX, bY, ccX, ccY)*fBC(bX, bY, cX, cY, ccX, ccY)>0 && fBC(bX, bY, cX, cY, ccX, ccY)*fCA(aX, aY, cX, cY, ccX, ccY)>0) {
	   return true;
	}
	else {
	   return false;
	}
	function fAB(aX, aY, bX, bY, ccX, ccY) {
		return (eval((ccY-aY)*
		(bX-aX) -
		(ccX-aX)*
		(bY-aY)))
	}
	function fBC(bX, bY, cX, cY, ccX, ccY) {
		return (eval((ccY-bY)*
		(cX-bX) -
		(ccX-bX)*
		(cY-bY)))
	}
	function fCA(aX, aY, cX, cY, ccX, ccY) {
		return (eval((ccY-cY)*
		(aX-cX) -
		(ccX-cX)*
		(aY-cY)))
	}
}

function circleCollision(x, y, r){
	for(var i = 0; i < circles.length; i++){
		var c1 = circles[i];
		if(rectangleCollision(y, y+2*r, x, x+2*r, c1.getTop(), c1.getTop()+c1.getHeight(), c1.getLeft(), c1.getLeft()+c1.getWidth())){
			var x1 = c1.getLeft()+(c1.getWidth()/2);
			var y1 = c1.getTop()+(c1.getHeight()/2);
			var r1 = c1.getWidth()/2;

			var x2 = x + r;
			var y2 = y + r;
			var r2 = r;
			

			if(distance(x1, y1, x2, y2) < (r1 + r2)){
				return true;			
			}
		}
	}
	return false; //RÖR DU DÖR DU
}


//returns true if collision is detected.
function rectangleCollision(t1, b1, l1, r1, t2, b2, l2, r2){
	if(b1 < t2 || t1 > b2 || l1 > r2 || r1 < l2){
		return false;
	}
	return true;
}

function addCircle(x,y,r){
	var circle = new fabric.Circle({ top: y, left: x, radius: r, fill: 'green' });
	cnv.add(circle);
	circles.push(circle);
}

function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
}