var aoff=0;
var inc = 0;
var xloc = 0;
var yloc = 0;
var xfilt = 0;
var yfilt = 0;
var n1mult = 0;
var n2mult = 0;
var xchange = 0;
var ychange = 0;
var numLines = 22;
var next = 0;
var r = 50;		//center radius
var rmax = 0;
var red = 0;
var l = 0;
var retract = 0;
var mode = 0;
var numRadiators = 50;
var wavesArray = [];
var tx;
var ty;

function setup(){
 createCanvas(windowWidth,windowHeight);
 colorMode(HSB);
 stroke(100,0,255);
 //stroke(255);
 background(0);
 	wh = windowHeight;
	ww = windowWidth;
	rmax = (ww<wh)*ww+(ww>wh)*wh
  l = rmax/2.3;   //line length
}

function draw(){
	if (mode == 0) {
  update();
	red += rectifier((abs(xchange)+abs(ychange)-red)) - .1;
	if(red < 0) {red = 0;}
	stroke(map(abs(xchange)+abs(ychange),0,20,200,0),map(abs(xchange)+abs(ychange),0,20,0,200),100);
	if (retract) {
		if ( l > r + 20) {
			l -= 10;
		} else {
			retract = 0;
		}
	} else {
		if ( l < rmax/2.3 ) {
			l += (rmax/2.3-l)/l+0.3;
		}
	}
	if(r > l) {
		noStroke();
		next = .06; 
}
	if(r > rmax/1.8) {
		change();
	}
  //background(0)
  var n = 0;   //noise variable
  var a = 0;
  //draw 45 lines at 45 angles to avoid noticible aliasing
  for (var i=0; i<numLines; i++){
   a = radians(360/numLines*i);   //calculate the radian angle from center
   n = noise(inc*n1mult,noise(i)*10*n2mult)-.5;
   var angle = n+a+aoff;
   line( width/2+r*cos(a),height/2+r*sin(a),width/2+l*cos(angle),height/2+l*sin(angle));
	if((abs(mouseX-xfilt)<5)&&(abs(mouseY-yfilt)<5)){
		stroke(100,200,200,.005);
		//fill(100,200,200,.005);
		for (var h=10;h<(20);h++){
			stroke(100,200,200,.0001*(20-h));
			ellipse(xfilt,yfilt, h,h);
		}
		//fill(0,0,0);
		//stroke(0,0,0);
		ellipse(xfilt,yfilt,9,9);
		stroke(map(abs(xchange)+abs(ychange),0,20,200,0),map(abs(xchange)+abs(ychange),0,20,0,200),100);
		noFill();
	}
	ellipse(xfilt, yfilt, 10,10);
  	}
	}
	if (mode == 1){
    for (var i = 0; i < numRadiators; i++) {
        wavesArray[i].update();
        wavesArray[i].checkBounds();
				wavesArray[i].draw();
		}
		mode = 1;
	}

}

function update(){

	if(next) {
		r += 1.5;
	}
  //interpolate noise scalars
  xchange = mouseX-xloc;
  ychange = mouseY-yloc;

  xfilt += (mouseX-xfilt)/50;
	yfilt += (mouseY-yfilt)/50;
	var magMouse = sqrt(sq(xfilt-width/2)+sq(yfilt-height/2));
  n1mult = map(magMouse,50,rmax/2,0,.5);
	n2mult = map(magMouse,rmax/2.3-50,rmax*sqrt(2),0,1);
	if(n2mult < 0) {
		n2mult=0;
	}
	if(n1mult < 0) {
		n1mult=0;
	}
  //advance angle offsets
  inc += .01;
  aoff =.5*sin(inc);
  //delays and alpha fills
  //delay(10);
	noStroke();
  fill(200,0,map(r,50,rmax/2.3,0,100),0.04+next);
  rect(0,0,width,height);
	xloc = mouseX;
	yloc = mouseY;
}

function mouseClicked() {
	if ((abs(mouseX - width/2)<50)&&(abs(mouseY - height/2)<50)) {
		next = .001;
		//location.assign("http://where.ismuff.in");
	}
	if ((abs(mouseX - xfilt)< 5 ) && (abs(mouseY - yfilt) < 5)) {
		retract = 1;
		inc = 0;
	}
	else {
		red = 0;
	}
}

function change() {
		mode = 1;
		colorMode(RGB);
    noFill();
    strokeWeight(3);
    for (var i = 0; i < numRadiators; i++) {
        wavesArray[i] = new Radiator(i*3);
		}
}

function leave() {
	location.assign("http://what.ismuff.in");
	delay(100);
}

function rectifier(s) {
	if (s > 0) {
		return s;
	} else {
		return s;
	}
}

function Radiator(r) {
    this.location = createVector(width/2,height/2);
    this.radius = r;
    this.lineColor = 0;
} 

Radiator.prototype.update = function() {
        this.radius += 3;
        this.location.x = mouseX;
        this.location.y = mouseY;
        this.lineColor = map(sin(radians(this.radius+400*sin(radians(millis()/20))-7*(millis())/100.)),-1.,1.,0.,255.);
}
    
Radiator.prototype.draw = function() {
        stroke(this.lineColor);
        ellipse(this.location.x,this.location.y,this.radius,this.radius);
}
    
Radiator.prototype.checkBounds = function() {
        if (this.radius > height) {
            this.radius = 0;
        }
}

function touchStarted() {
	
	return false;
}

function touchMoved() {
	tx = touches[0].x;
	ty = touches[0].y;
	return false;
}

function touchEnded() {
	ellipse(tx,ty,20,20);
	if ((abs(tx - width/2)<50)&&(abs(ty - height/2)<50)) {
		next = .001;
		//location.assign("http://where.ismuff.in");
	}
	if ((abs(tx - xfilt)< 5 ) && (abs(ty - yfilt) < 5)) {
		retract = 1;
		inc = 0;
	}
	else {
		red = 0;
	}
	return false;
}
