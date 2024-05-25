var canvas = document.getElementById("myCanvas");
var width = canvas.clientWidth;
var height = canvas.clientHeight;
canvas.width=width;
canvas.height=height;
const ctx = canvas.getContext("2d");
var xterrain = Math.min(Math.max(Math.floor(width/300),3),10);
var yterrain = Math.min(Math.max(Math.floor(height/300),3),5);
var S = xterrain * yterrain;
var m = Math.sqrt(width * height / S / 10000);
var money = 1500;
var moneyout = document.getElementById("text");
var borders = document.getElementById("border");
var clearButton = document.getElementById("clear");
var bwButton = document.getElementById("addway");
var fieldButton = document.getElementById("addfield");
var field1Button = document.getElementById("000");
var kfButton = document.getElementById("kf");
var tradeButton = document.getElementById("skladtrade19");
var getkfButton = document.getElementById("getkf");
var silosButton = document.getElementById("siloss");
var ptButton = document.getElementById("addptstation");
borders.checked = true;
var swamp = [];
var terrains = [];
var ways;
var trees = [];
let rx=Math.random() * width;
var sand = [[rx, -10]];
var river = [[rx, -10, true]];
var start = true;
var inflation = 1;
var selected = -1;
var date = 1;
var mx;
var  field=[];
var vegetables=[0,0,0];
var forClear = [];
let treesForClear = [];
var mode = 0;
var my;
var bButton = document.getElementById("buy");
var cubature = 0;
var hour=0;
var buildings=[];
ctx.lineCap = "round";
ctx.font=(0.05*width)+"px Courier new";
ctx.fillStyle="white";
ctx.fillText("Loading textures...",0.2*width,(0.05*width));
ctx.miterLimit=1;
var ofx=0;
var ofy=0;
var res=1;
var lastTouchDistance = 0;
const textures = {
    "ground" : { src: "media/ground.png", pattern: null,img:null},
    "swamp" : { src: "media/swamp.png", pattern: null ,img:null},
    "field": { src: "media/field.png", pattern: null ,img:null},
    "tree1": { src: "media/trees1.png", pattern: null ,img:null},
    "tree2": { src: "media/trees2.png", pattern: null ,img:null},
    "pStation" : { src: "media/pStation.png", pattern: null , img: null },
    "potato" : { src: "media/potato.png", pattern: null , img: null }
};
function loadTextures(callback) {
    const entries = Object.entries(textures);
    let loadedCount = 0;

    entries.forEach(([key, texture]) => {
        const img = new Image();
        img.src = texture.src;
        img.onload = () => {
            const matrix = new DOMMatrix([1, 0, 0, 1, 0, 0]);
            texture.img=img;
            texture.pattern = ctx.createPattern(img, "repeat");
            texture.pattern.setTransform(matrix.scale(m * 0.5));
            loadedCount++;
            if (loadedCount === entries.length && callback) {
                callback();
            }
        };
    });
}
loadTextures(() => {
    // Код, который будет выполнен после загрузки всех текстур
    console.log("Все текстуры загружены");

generateWorld();

ctx.font=(10*m)+"px Courier new";
setInterval(function () {
    hour++;
    moneyout.innerText = "День " + Math.floor(date) + " Бюджет: " + Math.floor(money) + "k₽"
    if (mode == 4) {
        graphics();
        var waytype = 2;
        var lastwaypoint = ways[ways.length - 1][ways[ways.length - 1].length - 1];
        if (Math.sqrt((mx - lastwaypoint[0]) ** 2 + (my - lastwaypoint[1]) ** 2) > 2 * m) {
            if(isClear([lastwaypoint[0] + parallelx(mx, my, lastwaypoint[0], lastwaypoint[1], 2 * m), lastwaypoint[1] + parallely(mx, my, lastwaypoint[0], lastwaypoint[1], 2 * m)],2,checkfield=false)){
                if(buy(3.4*inflation)){ways[ways.length - 1].push([lastwaypoint[0] + parallelx(mx, my, lastwaypoint[0], lastwaypoint[1], 2 * m), lastwaypoint[1] + parallely(mx, my, lastwaypoint[0], lastwaypoint[1], 2 * m), waytype, true, false]);}
                 else{mode=-1;}
            }
        }
    }
    if(hour>22){
        hour=-1;
        date++;
        inflation *= 0.9999 + Math.random() * 0.00016;
        for(var i=0;i<ways.length;i++){
            for(var j=0;j<ways[i].length;j++){
                if(!ways[i][j][4]){
                    ways[i][j][4]=true;
                    j=ways[i].length-1;
                    i=ways.length-1;
                }
            }
        }
        if (date % 7 == 0) {
            money -= cubature * 0.4 * inflation;
            cubature = 0;
            buildings.forEach(building => {
                if(building[3]=="pStation" & building[7]<date){
                    money+=building[5][0]*inflation*(Math.random()+0.5);
                };
            });
        }
        graphics();
    }
    if (treesForClear.length > 0) {

            var V = (0.75 * treesForClear[0][3]) ** 3 * Math.PI;
            // if (treesForClear[0][2] == 2) {
            //     money += V * 3.3 * inflation;
            // } else if (treesForClear[0][2] == 1) {
            //     money += V * 3.6 * inflation;
            // } else {
            //     money += V * 4 * inflation;
            // }
            cubature+=V;
            treesForClear.splice(0, 1);
    } else if (mode != 2 & mode != 5) {
        forClear = [];
    }
}, 30);

clearButton.onmousedown = function () {
    clearrubbish()
    borders.checked = true;
    mode = 2;
    forClear.push([]);
}
document.getElementById("checker").onmousedown = function () {
    borders.checked = !borders.checked;
}
fieldButton.onmousedown = function () {
    clearrubbish()
    borders.checked = true;
    mode = 5;
    if(field.length==0){
    field.push([]);}
    else if(field[field.length-1].length>0){    field.push([]);}
    forClear.push([]);
}
bwButton.onmousedown = function () {
    clearrubbish()
    borders.checked = true;
    mode = 3;
    ways.push([]);
}
field1Button.onmousedown=function() {
    clearrubbish()
    mode=6;
}
kfButton.onmousedown=function(){
    clearrubbish()
    mode=8;
}
tradeButton.onmousedown=function(){
    clearrubbish()
    mode=10;
}
getkfButton.onmousedown=function(){
    clearrubbish()
    mode=9;
}
silosButton.onmousedown=function() {
    clearrubbish()
    borders.checked = true;
    mode=7;
}
document.getElementById("cancel").onmousedown=function(){
    if (mode == 2 || mode == 5) {
        forClear.splice(forClear.length - 1, 1);
    }
    if (mode == 5) {
        field.splice(forClear.length - 1, 1);
    }
    clearrubbish()
    mode = -1;
}
ptButton.onmousedown=function() {
    clearrubbish()
    borders.checked = true;
    mode=11;
}
bButton.onmousedown = function () {
    clearrubbish()
    borders.checked = true;
    mode = 0;
}
canvas.onwheel=function(e){

    let k=0.9;
    let delta=k**(e.deltaY/100)
    if(res*delta<5){
        ofx+=(mx-mx*delta)*res;
        ofy+=(my-my*delta)*res;
        ctx.translate(+(mx-mx*delta),+(my-my*delta));
        res*=delta;
        ctx.scale(delta,delta);
    }
    if(res<1){
        ctx.scale(1/res,1/res);
        res=1;
    }
    if(ofx>0){
        ctx.translate(-ofx/res,0);
        ofx=0;
    }
        if(ofy>0){
        ctx.translate(0,-ofy/res);
        ofy=0;
    }
    if(ofx<width*(1-res)){
        ctx.translate((width*(1/res-1)-ofx/res),0);
        ofx=width*(1-res);
    }
    if(ofy<height*(1-res)){
        ctx.translate(0,(height*(1/res-1)-ofy/res));
        ofy=height*(1-res);
    }
    graphics();
}
canvas.onmousemove = function (e) {
    mx=canvas.relMouseCoords(e).x;
    my=canvas.relMouseCoords(e).y;
    for (var i = 0; i < terrains.length; i++) {
        var terrain = terrains[i].slice();
        terrain.splice(terrain.length - 1, 1);
        terrain.splice(terrain.length - 1, 1);
        if (point_in_polygon([mx, my], terrain)) {
            selected = i;
        }
    }
    if(is_touch_enabled() & mode!=3 & mode!=4){
        if (e.touches.length === 2) {
            e.preventDefault();
    
            let touch1 = e.touches[0];
            let touch2 = e.touches[1];
    
            let currentTouchDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
    
            if (lastTouchDistance) {
                let k = 0.9;
                let delta = k ** ((currentTouchDistance - lastTouchDistance) / 100);
                
                if (res * delta < 5) {
                    let mx = (touch1.clientX + touch2.clientX) / 2;
                    let my = (touch1.clientY + touch2.clientY) / 2;
                    
                    ofx += (mx - mx * delta) * res;
                    ofy += (my - my * delta) * res;
                    ctx.translate(mx - mx * delta, my - my * delta);
                    res *= delta;
                    ctx.scale(delta, delta);
                }
    
                if (res < 1) {
                    ctx.scale(1 / res, 1 / res);
                    res = 1;
                }
    
                if (ofx > 0) {
                    ctx.translate(-ofx / res, 0);
                    ofx = 0;
                }
                if (ofy > 0) {
                    ctx.translate(0, -ofy / res);
                    ofy = 0;
                }
                if (ofx < width * (1 - res)) {
                    ctx.translate((width * (1 / res - 1) - ofx / res), 0);
                    ofx = width * (1 - res);
                }
                if (ofy < height * (1 - res)) {
                    ctx.translate(0, (height * (1 / res - 1) - ofy / res));
                    ofy = height * (1 - res);
                }
                
                graphics();
            }
    
            lastTouchDistance = currentTouchDistance;
        }
    }
    graphics();
}
canvas.onmouseout = function () {
    selected = -1;
}
canvas.onclick = function (e) {
    graphics();
    mx=canvas.relMouseCoords(e).x;
    my=canvas.relMouseCoords(e).y;
    if (mode == 0 & !terrains[selected][terrains[selected].length - 2]) {
        if (confirm("Вы точно хотите приобрести этот участок?")) {
            if (money >= terrains[selected][terrains[selected].length - 1] || start) {
                terrains[selected][terrains[selected].length - 2] = true;
                if (!start) {
                    money -= terrains[selected][terrains[selected].length - 1];
                }
                start = false;
            } else {
                alert("Недостаточно средств!")
            }
        }
        mode = -1;
    }
    if ((mode == 2 || mode == 5)&closeToWay([mx,my],0,50*m) & isClear([mx,my],1*m)) {
        if (terrains[selected][terrains[selected].length - 2]) {
            if (forClear[forClear.length - 1].length > 0) {
                if ((mx - forClear[forClear.length - 1][0][0]) ** 2 + (my - forClear[forClear.length - 1][0][1]) ** 2 < 100 * m ** 2) {
                        for (var i = trees.length - 1; i >= 0; i--) {
                        for (var j = 0; j < forClear.length; j++) {
                            if (point_in_polygon(trees[i], forClear[j])) {
                                treesForClear.push(trees[i]);
                                trees.splice(i, 1);
                                j = 0;
                            }
                        }
                    }
                    if(mode == 2){
                    mode = -1;}
                } else {
                    forClear[forClear.length - 1].push([mx, my]);
                }
            } else {
                forClear[forClear.length - 1].push([mx, my]);
            }
        }



    }
    if (mode == 5 &closeToWay([mx,my],0,50*m) & isClear([mx,my],1*m)) {
            if (field[field.length - 1].length > 0) {
                if ((mx - field[field.length - 1][0][0]) ** 2 + (my - field[field.length - 1][0][1]) ** 2 < 400 * m ** 2 & field[field.length - 1].length > 2) {
                    money-= calcPolygonArea(field[field.length - 1].concat([field[field.length - 1][0]]))/m**2/10000*15*inflation;
                    field[field.length-1][0].push(date+calcPolygonArea(field[field.length - 1].concat([field[field.length - 1][0]]))/m**2/240000);
                    field[field.length-1][0].push(0);
                    mode = -1;
                    for(var i=field.length-2;i>=0;i--){
                        if(pgIn(field[i],field[field.length - 1])){
                            field.splice(i,1);
                        }
                        else if(isIntersect(field[i],field[field.length - 1])){
                            field.splice(field.length - 1,1);
                            i=0;
                            alert("Поле пересекает другое поле!");
                        }
                    }
                    clearrubbish()
                    
                } else {
                    field[field.length - 1].push([mx, my]);
                }
            } else {
                field[field.length - 1].push([mx, my]);
            }


    }
    if(mode==6){
        for(var i=0; i<field.length;i++){
            if(point_in_polygon([mx,my],field[i]) & field[i][0][3]==0){
                if(buy(calcPolygonArea(field[field.length - 1])/m**2/10000*0.4*inflation)){
                field[i][0][3]=1;}
                i=field.length-1;
                mode=-1;
            }
        }
    }
    if(mode==7){
        if(isClear(pointToWay([mx,my],5*m),4*m,checkfield=false) & closeToWay([mx,my],0*m,50*m)){
            if(buy(200*inflation)){
            buildings.push([pointToWay([mx,my],5*m)[0],pointToWay([mx,my],5*m)[1],3.5*m,"potato","kfSklad",[100,0],rotWay([mx,my]),date+20,20]);
            mode=-1;
            for(var i=trees.length-1;i>=0;i--){
                if((trees[i][0]-pointToWay([mx,my],5*m)[0])**2+(trees[i][1]-pointToWay([mx,my],5*m)[1])**2<16*m**2){
                    treesForClear.push(trees[i]);
                    trees.splice(i, 1);
                }
            }
            }
        }
    }
    if(mode==8){
        for(var i=0; i<field.length;i++){
            if(point_in_polygon([mx,my],field[i]) & field[i][0][3]==1){
                if(buy(calcPolygonArea(field[field.length - 1])/m**2/10000*3*inflation)){
                field[i][0][3]=2;
                field[i][0][2]=date+100;}
                i=field.length-1;
                mode=-1;
            }
        }
    }
    if(mode==9){
        for(var i=0; i<field.length;i++){
            if(point_in_polygon([mx,my],field[i]) & field[i][0][3]==2 & date>field[i][0][2]){
                if(buy(calcPolygonArea(field[field.length - 1].concat([]))/m**2/10000*5*inflation)){
                field[i][0][3]=0;
                field[i][0][2]=0;
                vegetables[0]+=calcPolygonArea(field[field.length - 1].concat([]))/m**2/10000*30;}
                i=field.length-1;
                mode=-1;
                for (var i = 0; i < buildings.length; i++) {
                    if(buildings[i][4]=="kfSklad" & buildings[i][7]<=date){
                        var V=Math.min(buildings[i][5][0]-buildings[i][5][1],vegetables[0]);
                        vegetables[0]-=V;
                        buildings[i][5][1]+=V;
                    }
                }
                if(vegetables[0]>=1){
                    alert("Пропало "+Math.floor(vegetables[0])+" тонн урожаая. Стройте больше складов, чтобы избежать потерь в дальнейшем.");
                }
                vegetables[0]=0;
            }
        }
    }
    if(mode==10){
        for (var i = 0; i < buildings.length; i++) {
            if(buildings[i][4]=="kfSklad" & (buildings[i][0]-mx)**2+(buildings[i][1]-my)**2<=buildings[i][2]**2){
                if(confirm("Продать "+ Math.floor(buildings[i][5][1])+ " тонн картофеля за " + Math.floor(buildings[i][5][1]*6*inflation) +" k₽?")){
                money+=buildings[i][5][1]*6*inflation;
                buildings[i][5][1]=0;}
            }
        }
    }
    if(mode==11){
        if(isClear(pointToWay([mx,my],25*m),25*m) & closeToWay([mx,my],0*m,50*m)){
            if(buy(3000*inflation)){
            buildings.push([pointToWay([mx,my],25*m)[0],pointToWay([mx,my],25*m)[1],20*m,"pStation","ptstation",[70],rotWay([mx,my])+Math.PI/2,date+100,100]);
            mode=-1;
            for(var i=trees.length-1;i>=0;i--){
                if((trees[i][0]-pointToWay([mx,my],25*m)[0])**2+(trees[i][1]-pointToWay([mx,my],25*m)[1])**2<625*m**2){
                    treesForClear.push(trees[i]);
                    trees.splice(i, 1);
                }
            }
            }
        }
    }
}
canvas.onmousedown = function (e) {
    mx=canvas.relMouseCoords(e).x;
    my=canvas.relMouseCoords(e).y;
    if (mode == 3) {
        var waytype = 2;
        var isway = false;
        var n1 = -1;
        var n2 = -1;
        for (i = 0; i < ways.length; i++) {
            for (j = 0; j < ways[i].length; j++) {
                if ((ways[i][j][0] - mx) ** 2 + (ways[i][j][1] - my) ** 2 < 100 * m ** 2) {
                    n1 = i;
                    n2 = j;
                    isway = true;
                }
            }
        }
        if (isway) {
            ways[ways.length - 1].push([ways[n1][n2][0], ways[n1][n2][1], waytype, true, false]);
            mode = 4;
        }
    }
    graphics();
}
canvas.onmouseup = function (e) {
    if (mode == 4) {
        mode = -1;
    }else if(is_touch_enabled()){
        if (e.touches.length < 2) {
            lastTouchDistance = 0;
        }
    }
    graphics();
}
canvas.ontouchmove=canvas.onmousemove;
canvas.ontouchstart=canvas.onmousedown;
canvas.ontouchend=canvas.onmouseup;
document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        if (mode == 2 || mode == 5) {
            forClear.splice(forClear.length - 1, 1);
        }
        if (mode == 5) {
            field.splice(forClear.length - 1, 1);
        }
        clearrubbish()
        mode = -1;
    }
}
});
function graphics() {
    ctx.fillStyle = textures["ground"].pattern;
    ctx.fillRect(0, 0, width, height);
    drawSwamps();
    drawFields();
    drawRiver();
    drawWays();
    drawBuildings();
    drawTrees();
    if (borders.checked) {
        drawBorders();
        drawForClear();
    }
    if(mode==11|| mode==2){
    drawtoWay(50*m);
    greenFields("",green="rgba(255,0,0,0.6)");
    redBuildings();}
    if(mode==5){
        drawtoWay(50*m);
        greenFields("",green="rgba(255,0,0,0.6)");
        redBuildings();
    }
    if(mode==7){
    drawtoWay(10*m);
    redBuildings();
    }
    if(mode==3 ||mode==4){
    drawtoWay(50*m,green="rgba(255,255,0,0.1)");
    drawtoWay(5*m);
    redBuildings();}
    if(mode==6){
        greenFields(md=0,green="rgba(0,255,0,0.3)");}
    if(mode==9){
        greenFields(md=2,green="rgba(0,255,0,0.3)",dat=true);}
    if(mode==8){
        greenFields(md=1,green="rgba(0,255,0,0.3)");}
    if(mode==10){
        redBuildings(red="rgba(0,255,0,0.3)",type="kfSklad");}
    
}

function drawSwamps() {
    ctx.fillStyle = textures["swamp"].pattern;
    ctx.globalAlpha = 0.1;
    swamp.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.rect(x-7.5 * m, y-7.5 * m, 15 * m,15 * m);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

}

function drawFields() {
    field.forEach((f, i) => {
        if (f.length > 0) {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.moveTo(f[0][0], f[0][1]);
            drawway(f, 0);
            if (i === field.length - 1 && mode === 5) {
                ctx.lineTo(mx, my);
            } else {
                ctx.closePath();
            }
            ctx.fillStyle = textures["field"].pattern;
            ctx.fill();
            ctx.lineWidth=2*m;
            ctx.strokeStyle = "rgba(175,147,142,0.4)";
            ctx.stroke();
            if (f[0][3] === 1) {
                ctx.lineWidth=1*m;
                ctx.fillStyle = "rgba(0,0,0,0.3)";
                ctx.strokeStyle = "rgba(0,0,0,0.3)";
                ctx.stroke();
                ctx.fill();
            } else if (f[0][3] === 2) {
                ctx.lineWidth=1*m;
                ctx.fillStyle = "rgba(10," + (f[0][2] - date) + ",20,0.4)";
                ctx.strokeStyle = "rgba(10," + (f[0][2] - date) + ",20,0.4)";
                ctx.stroke();
                ctx.fill();
            }
            if (borders.checked) {
                ctx.setLineDash([2, 7]);
                ctx.strokeStyle = "#705000";
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    });
}

function greenFields(md="", green="rgba(0,255,0,0.3)",dat=false) {
    field.forEach((f) => {
        if (f.length > 0) {
            if(((f[0][2]<date & f[0][2]!=undefined) || !dat) & (f[0][3]==md || md==="")){
            ctx.beginPath();
            ctx.lineWidth = 3;
            drawway(f, 0);
            ctx.fillStyle =green;
            ctx.fill();}
        }
    });
}
function drawRiver() {
    ctx.beginPath();
    drawway(sand, 0);
    ctx.lineWidth = 20 * m;
    ctx.strokeStyle = "rgba(175,147,142,0.3)";
    ctx.stroke();
    ctx.lineWidth = 19.5 * m;
    ctx.strokeStyle = "rgba(175,147,142,0.4)";
    ctx.stroke();
    ctx.strokeStyle = "rgba(175,147,142,1)";
    ctx.lineWidth = 17 * m;
    ctx.stroke();
    ctx.lineWidth = 15 * m;
    ctx.strokeStyle = "rgba(60,45,40,0.3)";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(river[0][0], river[0][1]);
    for (let i = 1; i < river.length; i++) {
        ctx.strokeStyle = "#152730";
        ctx.lineWidth = 10 * m;
        ctx.lineTo(river[i][0], river[i][1]);
        if (!river[i - 1][2]) {
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#200e1c";
            drawway(river.slice(i), 0);
            i = river.length - 1;
        }
        ctx.stroke();
    }
}

function drawWays() {
    ways.forEach(way => {
        if (way.length > 1 && (way[0][4] || borders.checked)) {
            ctx.beginPath();
            drawway(way, 0);
            if (way[0][2] === 1) {
                drawWayType1();
            } else if (way[0][2] === 2) {
                drawWayType2(way);
            }
        }
    });
}
function drawtoWay(r, green="rgba(0,255,0,0.3)") {
    ctx.beginPath();
    ctx.lineWidth=r*2;
    ctx.strokeStyle=green;

    ways.forEach(way => {
        if (way.length > 1) {
            drawway(way, 0);
        }

    });
    ctx.stroke();
    ctx.lineWidth=4*m;
    ctx.strokeStyle="rgba(255,255,0,1)";
    ctx.stroke();
}

function drawWayType1() {
    ctx.strokeStyle = "rgba(175,147,142,0.3)";
    ctx.lineWidth = 16 * m;
    ctx.stroke();
    ctx.strokeStyle = "rgba(175,147,142,0.6)";
    ctx.lineWidth = 14 * m;
    ctx.stroke();
    ctx.strokeStyle = "#a09090";
    ctx.lineWidth = 8 * m;
    ctx.stroke();
}

function drawWayType2(way) {
    ctx.strokeStyle = "rgba(155,127,122,0.9)";
    ctx.lineWidth = 1 * m;
    for (let k = -1.5; k <= 1.5; k += 3) {
        ctx.beginPath();
        ctx.moveTo(way[0][0] + pdx(way[0][0], way[0][1], way[1][0], way[1][1], k * m), way[1][1] + pdy(way[0][0], way[0][1], way[1][0], way[1][1], k * m));
        for (let i = 1; i < way.length; i++) {
            ctx.lineTo(way[i][0] + pdx(way[i - 1][0], way[i - 1][1], way[i][0], way[i][1], k * m), way[i][1] + pdy(way[i - 1][0], way[i - 1][1], way[i][0], way[i][1], k * m));
            if (!way[i][4] && ctx.getLineDash() != [[5 * m, 5 * m]]) {
                ctx.stroke();
                if (borders.checked) {
                    ctx.beginPath();
                    ctx.setLineDash([2 * m, 2 * m]);
                    drawway(way.slice(i), k * m);
                }
                i = way.length - 1;
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function drawBuildings() {
    buildings.forEach(building => {
        ctx.save();
        ctx.translate(building[0], building[1]);
        ctx.rotate(building[6]);
        ctx.translate(-building[2], -building[2]);
        if (building[7] <= date) {
            ctx.drawImage(textures[building[3]].img, 0, 0, building[2] * 2, building[2] * 2);
        } else if (borders.checked) {
            ctx.beginPath();
            ctx.rect(0, 0, building[2] * 2, building[2] * 2);
            ctx.strokeStyle = "#902000";
            ctx.lineWidth = 1;
            ctx.setLineDash([1, 1]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        ctx.rotate(-building[6]);
        if(borders.checked){
            if (building[4] === "kfSklad" && building[7] <= date) {
                ctx.fillStyle = "rgba(0,0,0,1)";
                ctx.fillText(Math.floor(building[5][1] / building[5][0] * 100) + "%", -building[2] , building[2] );
            }
            if(building[7]>date){
                ctx.fillStyle = "rgba(0,0,0,1)";
                ctx.fillText(Math.floor((building[8]-building[7]+date) / building[8] * 100) + "%", -building[2] ,building[2] );
            }
        }
        ctx.restore();
    });
}
function redBuildings(red="rgba(255,0,0,0.6)",type="") {
    
    buildings.forEach(building => {
        if(type=="" || building[4]==type){
        ctx.save();
        ctx.beginPath();
        ctx.translate(building[0], building[1]);
        ctx.rotate(building[6]);
        ctx.translate(-building[2], -building[2]);
        ctx.rect(0, 0, building[2] * 2, building[2] * 2);
        ctx.fillStyle=red;
        ctx.fill();
        ctx.restore();}
    });
    if(type==""){
    ctx.beginPath();
    swamp.forEach(swam => {
        ctx.rect(swam[0]-7.5*m, swam[1]-7.5*m, 15*m, 15*m);
        ctx.fillStyle=red;
    });
    ctx.fill();}
}

function drawTrees() {
    const alltrees = trees.concat(treesForClear);
    let treetype=-1;
    ctx.beginPath();
    alltrees.forEach(tree => {
        if(tree[2] != treetype){
        if (tree[2] === 1) {
            ctx.fillStyle = textures["tree1"].pattern;
        } else {
            ctx.fillStyle = textures["tree2"].pattern;
        }
        ctx.fill();
        ctx.beginPath();
    }
        ctx.rect(tree[0] - 3 * tree[3] * m, tree[1] - 3 * tree[3] * m, 6 * tree[3] * m, 6 * tree[3] * m);
    });
    ctx.fill();
}

function drawBorders() {
    ctx.setLineDash([5, 10]);
    ctx.strokeStyle = "#000000";
    terrains.forEach((terrain, i) => {
        if (!terrain[terrain.length - 2]) {
            ctx.beginPath();
            ctx.moveTo(terrain[0][0], terrain[0][1]);
            for (let j = 1; j < terrain.length - 2; j++) {
                ctx.lineWidth = 0.5 * m;
                ctx.lineTo(terrain[j][0], terrain[j][1]);
            }
            ctx.closePath();
            ctx.fillStyle = i === selected ? "rgba(100,100,100,0)" : "rgba(0,0,0,0.4)";
            ctx.fill();

        }
        ctx.stroke();
        if(i==selected & mode==0){
            ctx.fillStyle = "rgba(0,0,0,1)";
            var message = !start ? "цена: " + Math.floor(terrains[selected][terrains[selected].length - 1] * inflation) + "k₽" : "Выберите бесплатный";
            ctx.fillText(message, mx, my);
            message = !start ? "" : "участок для освоения";
            ctx.fillText(message, mx, my+10*m);
        }
    });
    ctx.setLineDash([]);

}

function drawForClear() {
    ctx.setLineDash([5,5]);
    forClear.forEach((clear, i) => {
        if (clear.length > 0) {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#902000";
            drawway(clear,0);
            if (i == forClear.length - 1 && (mode === 2 || mode === 5)) {
                ctx.lineTo(mx, my);
            } else {
                ctx.closePath();
            }
            ctx.stroke();
        }
    });
    ctx.setLineDash([]);
}
               




function generateWorld() {
    ways = [[[-10*m, (1 + Math.random()) * height / 3, 1, false,true]]];
    var speedy = (Math.random() - 0.5) * 16 * m;
    var speedx = Math.random() * 4 * m + 4 * m;
    var swampx;
    var swampy;
    var isway = true;
    let type1 = Math.random()**10;
    let type3 = Math.random()**10;
    let type2 = Math.random()**10;
    for (var i = 0; i < xterrain; i++) {
        for (var j = 0; j < yterrain; j++) {
            terrains.push([[i / (xterrain) * width, j / (yterrain) * height],
            [(i + 1) / (xterrain) * width, j / (yterrain) * height],
            [(i + 1) / (xterrain) * width, (j + 1) / (yterrain) * height],
            [i / (xterrain) * width, (1 + j) / (yterrain) * height], false, Math.random() * 200 + 800])
        }
    }
    while (ways[0][ways[0].length - 1][0] <= width+20*m & ways[0][ways[0].length - 1][0] >= -20*m & ways[0][ways[0].length - 1][1]+20*m <= height+20*m & ways[0][ways[0].length - 1][1] >= -20*m) {
        ways[0].push([ways[0][ways[0].length - 1][0] + speedx, ways[0][ways[0].length - 1][1] + speedy, 1, false, true]);
        speedx += (Math.random() - 0.5) * 0.1 * m;
        speedy += (Math.random() - 0.5) * 0.1 * m;
    }
    speedx = (Math.random() - 0.5) * 20 * m;
    speedy = Math.random() * 2 * m+ 5*m;
    while (river[river.length - 1][0] <= width+20*m & river[river.length - 1][0] >= -20*m & river[river.length - 1][1] <= height+20*m & river[river.length - 1][1] >= -20*m || river.length < 100) {
        sand.push([river[river.length - 1][0] + speedx+Math.cbrt(Math.random()-0.5)*m, river[river.length - 1][1] + speedy+Math.cbrt(Math.random()-0.5)*m]);
        river.push([river[river.length - 1][0] + speedx, river[river.length - 1][1] + speedy, true]);
        speedx += (Math.random() - 0.5) * 1.5 * m;
        speedy += (Math.random() - 0.5) * 1.5 * m;
        if (river[river.length - 1][1] < 0) {
            speedy += 0.1 * m;
        }
        if (river[river.length - 1][0] < 0) {
            speedx += 0.1 * m;
        }
        if (river[river.length - 1][0] > width) {
            speedx -= 0.1 * m;
        }
    }
    while (isway) {
        swampx = Math.random() * width;
        swampy = Math.random() * height;
        isway = false;
        for (j = 0; j < ways[0].length; j++) {
            if (Math.sqrt((ways[0][j][0] - swampx) ** 2 + (ways[0][j][1] - swampy) ** 2) < 100 * m) {
                isway = true;
            }
        }
    }
    swamp = [[swampx, swampy]];
    for (var i = 1; i < 10*S; i++) {
        swampx = swamp[i - 1][0] + (Math.random() - 0.5) * 25 * m;
        swampy = swamp[i - 1][1] + (Math.random() - 0.5) * 25 * m;
        if (Math.random() > 0.99) {
            isway = true;
            while (isway) {
                swampx = Math.random() * width;
                swampy = Math.random() * height;
                isway = false;
                for (j = 0; j < ways[0].length; j++) {
                    if (Math.sqrt((ways[0][j][0] - swampx) ** 2 + (ways[0][j][1] - swampy) ** 2) < 100 * m) {
                        isway = true;
                    }
                }
            }
        }
        swamp.push([swampx, swampy]);
    }
    var treex = Math.random() * width;
    var treey = Math.random() * height;
    for (var i = 1; i < 150* S; i++) {
        var type;
        var isswamp = true;
        while (isswamp) {
            isswamp = false;
            treex =treex+Math.cbrt(Math.random()-0.5) * m * 7;
            treey =treey+ Math.cbrt(Math.random()-0.5) * m * 7;
            if(treex<0 || treey<0 || treex>width ||treey>height){
                treex = Math.random() * width;
                treey = Math.random() * height;
                type1 = Math.random()**10;
                type3 = Math.random()**10;
                type2 = Math.random()**10;
            }
            for (j = 0; j < river.length; j++) {
                if (Math.sqrt((river[j][0] - treex) ** 2 + (river[j][1] - treey) ** 2) < 6 * m) {
                    isswamp = true;
                }
            }
            for (j = 0; j < ways[0].length; j++) {
                if (Math.sqrt((ways[0][j][0] - treex) ** 2 + (ways[0][j][1] - treey) ** 2) < 8 * m) {
                    isswamp = true;
                }
            }
            i
        }
        for (j = 0; j < swamp.length; j++) {
            if (Math.sqrt((swamp[j][0] - treex) ** 2 + (swamp[j][1] - treey) ** 2) < 15 * m) {
                isswamp = true;
            }
        }
        if (type1 * Math.random() > type2 * Math.random() & type1 * Math.random() > type3 * Math.random()) {
            type = 1;
        } else if (type2 * Math.random() > type3 * Math.random()) {
            type = 2;
        } else {
            type = 3;
        }
        if (isswamp) {
            trees.push([treex, treey, type, Math.random() * 0.3 + 0.2]);
        } else {
            trees.push([treex, treey, type, Math.random() * 0.6 + 0.4]);
        }
    }
}
function point_in_polygon(point, polygon) {
    const num_vertices = polygon.length;
    const x = point[0];
    const y = point[1];
    let inside = false;

    let p1 = polygon[0];
    let p2;

    for (let i = 1; i <= num_vertices; i++) {
        p2 = polygon[i % num_vertices];

        if (y > Math.min(p1[1], p2[1])) {
            if (y <= Math.max(p1[1], p2[1])) {
                if (x <= Math.max(p1[0], p2[0])) {
                    const x_intersection = ((y - p1[1]) * (p2[0] - p1[0])) / (p2[1] - p1[1]) + p1[0];

                    if (p1[0] === p2[0] || x <= x_intersection) {
                        inside = !inside;
                    }
                }
            }
        }

        p1 = p2;
    }

    return inside;
}
function parallely(x, y, x2, y2, r) {
    return (y - y2) / Math.sqrt((y - y2) ** 2 + (x - x2) ** 2) * r;
}
function parallelx(x, y, x2, y2, r) {
    return (x - x2) / Math.sqrt((y - y2) ** 2 + (x - x2) ** 2) * r;
}
function pdx(x, y, x2, y2, r) {
    if ((y - y2) != 0) {
        var angle = Math.atan((x - x2) / (y - y2));
    } else {
        angle = 0;
    }
    return Math.sin(angle + 90) * r;
}
function pdy(x, y, x2, y2, r) {
    if ((y - y2) != 0) {
        var angle = Math.atan((x - x2) / (y - y2));
    } else {
        angle = 0;
    }
    return Math.cos(angle + 90) * r;
}
function drawway(points,x){
    if(points.length>1){
ctx.moveTo(points[0][0]+pdx(points[0][0],points[0][1],points[1][0],points[1][1],x),points[0][1]+pdy(points[0][0],points[0][1],points[1][0],points[1][1],x));
for(var i=1;i<points.length;i++){
    ctx.lineTo(points[i][0]+pdx(points[i-1][0],points[i-1][1],points[i][0],points[i][1],x),points[i][1]+pdy(points[i-1][0],points[i-1][1],points[i][0],points[i][1],x));
}}
else if((points.length>0)){
    ctx.moveTo(points[0][0],points[0][1]);
}
}
function closeToWay(point,min,max){
    var close=false;
    for(var i=0;i<ways.length;i++){
        for(var j=0;j<ways[i].length;j++){
        if(ways[i][j][4] & (ways[i][j][0]-point[0])**2+(ways[i][j][1]-point[1])**2<(max)**2){
            close=true;
        }
        }
    }
    for(var i=0;i<ways.length;i++){
        for(var j=0;j<ways[i].length;j++){
        if((ways[i][j][0]-point[0])**2+(ways[i][j][1]-point[1])**2<(min+2*m)**2){
            close=false;
        }
        }
    }
    return close;
}
function pointToWay(point,dist){
    var minim=10000000;
    var minin=-1;
    var minin1=-1;
    let diam=0;
    dist=Math.abs(dist);
    for(var i=0;i<ways.length;i++){
        for(var j=0;j<ways[i].length;j++){
            if(ways[i][j][4] & Math.sqrt((ways[i][j][0]-point[0])**2+(ways[i][j][1]-point[1])**2)<minim){
             minim=Math.sqrt((ways[i][j][0]-point[0])**2+(ways[i][j][1]-point[1])**2);
             minin1=j;
             minin=i;
            }
        }
    }
    if(ways[minin][minin1][2]==1){
        diam=6*m;
    }else{diam=2*m;}
    if(minin1>0){
        p1=[ways[minin][minin1][0]+pdx(ways[minin][minin1-1][0],ways[minin][minin1-1][1],ways[minin][minin1][0],ways[minin][minin1][1],dist+2*m),ways[minin][minin1][1]+pdy(ways[minin][minin1-1][0],ways[minin][minin1-1][1],ways[minin][minin1][0],ways[minin][minin1][1],dist+diam)];
        p2=[ways[minin][minin1][0]+pdx(ways[minin][minin1-1][0],ways[minin][minin1-1][1],ways[minin][minin1][0],ways[minin][minin1][1],-dist-2*m),ways[minin][minin1][1]+pdy(ways[minin][minin1-1][0],ways[minin][minin1-1][1],ways[minin][minin1][0],ways[minin][minin1][1],-dist-diam)];
    }else{
        p1=[ways[minin][minin1][0]+pdx(ways[minin][minin1+1][0],ways[minin][minin1+1][1],ways[minin][minin1][0],ways[minin][minin1][1],dist+2*m),ways[minin][minin1][1]+pdy(ways[minin][minin1+1][0],ways[minin][minin1+1][1],ways[minin][minin1][0],ways[minin][minin1][1],dist+diam)];
        p2=[ways[minin][minin1][0]+pdx(ways[minin][minin1+1][0],ways[minin][minin1+1][1],ways[minin][minin1][0],ways[minin][minin1][1],-dist-2*m),ways[minin][minin1][1]+pdy(ways[minin][minin1+1][0],ways[minin][minin1+1][1],ways[minin][minin1][0],ways[minin][minin1][1],-dist-diam)];
    }
    if((p2[0]-point[0])**2+(p2[1]-point[1])**2>(p1[0]-point[0])**2+(p1[1]-point[1])**2){
        return p1;
    }else{
    return p2;}
}
function rotWay(point){
    var minim=10000000;
    var minin=-1;
    var minin1=-1;
    for(var i=0;i<ways.length;i++){
        for(var j=0;j<ways[i].length;j++){
            if(ways[i][j][4] & Math.sqrt((ways[i][j][0]-point[0])**2+(ways[i][j][1]-point[1])**2)<minim){
             minim=Math.sqrt((ways[i][j][0]-point[0])**2+(ways[i][j][1]-point[1])**2);
             minin1=j;
             minin=i;
            }
        }
    }
    if(minin1>0){
        return Math.sin(-(ways[minin][minin1-1][1]-ways[minin][minin1][1])/Math.sqrt((ways[minin][minin1-1][0]-ways[minin][minin1][0])**2+(ways[minin][minin1-1][1]-ways[minin][minin1][1])**2));
    }
    else{
        return Math.sin(-(ways[minin][minin1][1]-ways[minin][minin1+1][1])/Math.sqrt((ways[minin][minin1+1][0]-ways[minin][minin1][0])**2+(ways[minin][minin1+1][1]-ways[minin][minin1][1])**2));
    }

}
function calcPolygonArea(vertices) {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
      var addX = vertices[i][0];
      var addY = vertices[i == vertices.length - 1 ? 0 : i + 1][1];
      var subX = vertices[i == vertices.length - 1 ? 0 : i + 1][0];
      var subY = vertices[i][1];

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
}
function isClear(point,radius,checkfield=true){
    let clear=false;
    for(var i=0;i<terrains.length;i++){
        if(terrains[i][terrains[i].length-2] & point_in_polygon(point,terrains[i])){
            clear=true;
        }
    }
    if(checkfield){
    for(var i=0;i<field.length;i++){
        if(!(mode==5 & i==field.length-1)){
        if(field[i].length>2){
        if(point_in_polygon(point,field[i])){
            clear=false;
        }}
    }
    }}
    for(var i=0;i<swamp.length;i++){
        if((point[0]-swamp[i][0])**2+(point[1]-swamp[i][1])**2<(radius+7.5*m)**2){
        clear=false;
        }
    }
    for(var i=0;i<buildings.length;i++){
        if((point[0]-buildings[i][0])**2+(point[1]-buildings[i][1])**2<(radius+buildings[i][2])**2){
        clear=false;
        }
    }
    return clear;
}
function buy(price){
    let canBuy=false;
    if(money>price){
        money-=price;
        canBuy=true;
    }else{alert("недостаточно средств")}
    return canBuy;
}
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)
if(event.touches==undefined){
    canvasX = event.clientX- totalOffsetX;
    canvasY = event.clientY - totalOffsetY;}else{
        canvasX = event.touches[0].clientX - totalOffsetX;
        canvasY = event.touches[0].clientY - totalOffsetY;
    }

    canvasX-=ofx;
    canvasY-=ofy;
    canvasX/=res;
    canvasY/=res;
    return {x:canvasX, y:canvasY}
}
function is_touch_enabled() {
    return ( 'ontouchstart' in window ) || 
           ( navigator.maxTouchPoints > 0 ) || 
           ( navigator.msMaxTouchPoints > 0 );
}
function pgIn(small,big){
    var cont=true;
    for(var i=0;i<small.length;i++){
        if(!point_in_polygon([small[i][0],small[i][1]],big)){
            cont=false;
        }
    }
    return cont;
}
function clearrubbish(){
    if(field.length>0){
        if(field[field.length-1].length<3){
            field.splice(field.length-1,1);
        }
    }
    if(ways.length>0){
        if(ways[ways.length-1].length<3){
            ways.splice(ways.length-1,1);
        }
    }
}
function isIntersect(small,big){
    for(var i=0;i<small.length-1;i++){
        for(var j=0;j<big.length-1;j++){
            if(hasIntersection(small[i][0],small[i][1],small[i+1][0],small[i+1][1],big[j][0],big[j][1],big[j+1][0],big[j+1][1])){
                return true;
            }
        }
    }
    for(var j=0;j<big.length-1;j++){
            if(hasIntersection(small[0][0],small[0][1],small[small.length-1][0],small[small.length-1][1],big[j][0],big[j][1],big[j+1][0],big[j+1][1])){
                return true;
            }
    }
    for(var i=0;i<small.length-1;i++){
            if(hasIntersection(small[i][0],small[i][1],small[i+1][0],small[i+1][1],big[0][0],big[0][1],big[big.length-1][0],big[big.length-1][1])){
                return true;
            }
    }
    return false;
}
function RotationDirection(p1x, p1y, p2x, p2y, p3x, p3y) {
    if (((p3y - p1y) * (p2x - p1x)) > ((p2y - p1y) * (p3x - p1x)))
      return 1;
    else if (((p3y - p1y) * (p2x - p1x)) == ((p2y - p1y) * (p3x - p1x)))
      return 0;
    
    return -1;
  }
  
  function containsSegment(x1, y1, x2, y2, sx, sy) {
    if (x1 < x2 && x1 < sx && sx < x2) return true;
    else if (x2 < x1 && x2 < sx && sx < x1) return true;
    else if (y1 < y2 && y1 < sy && sy < y2) return true;
    else if (y2 < y1 && y2 < sy && sy < y1) return true;
    else if (x1 == sx && y1 == sy || x2 == sx && y2 == sy) return true;
    return false;
  }
  
  function hasIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    var f1 = RotationDirection(x1, y1, x2, y2, x4, y4);
    var f2 = RotationDirection(x1, y1, x2, y2, x3, y3);
    var f3 = RotationDirection(x1, y1, x3, y3, x4, y4);
    var f4 = RotationDirection(x2, y2, x3, y3, x4, y4);
    
    // If the faces rotate opposite directions, they intersect.
    var intersect = f1 != f2 && f3 != f4;
    
    // If the segments are on the same line, we have to check for overlap.
    if (f1 == 0 && f2 == 0 && f3 == 0 && f4 == 0) {
      intersect = containsSegment(x1, y1, x2, y2, x3, y3) || containsSegment(x1, y1, x2, y2, x4, y4) ||
      containsSegment(x3, y3, x4, y4, x1, y1) || containsSegment(x3, y3, x4, y4, x2, y2);
    }
    
    return intersect;
  }
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
