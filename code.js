var canvas = document.getElementById("myCanvas");
var width = canvas.clientWidth;
var height = canvas.clientHeight;
canvas.width=width;
canvas.height=height;
const ctx = canvas.getContext("2d");
var xterrain = Math.min(Math.max(Math.floor(width/200),3),10);
var yterrain = Math.min(Math.max(Math.floor(height/200),3),5);
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
var river = [[Math.random() * width, -10, true]];
var start = true;
var inflation = 1;
var selected = -1;
var date = 1;
var mx;
var cars = [];
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
const ground = new Image();
ground.src = "media/ground.png";
var groundtxt;
ground.onload=function(){
let matrix1 = new DOMMatrix([1, 0, 0, 1, 0, 0]);
groundtxt=ctx.createPattern(ground, "repeat");
groundtxt.setTransform(matrix1.scale(m*0.5));}
const swampi = new Image();
swampi.src = "media/swamp.png";
var swamptxt;
swampi.onload=function(){
let matrix1 = new DOMMatrix([1, 0, 0, 1, 0, 0]);
swamptxt=ctx.createPattern(swampi, "repeat");
swamptxt.setTransform(matrix1.scale(m*0.5));}
const fieldi = new Image();
fieldi.src = "media/field.png";
var fieldtxt;
fieldi.onload=function(){
let matrix1 = new DOMMatrix([1, 0, 0, 1, 0, 0]);
fieldtxt=ctx.createPattern(fieldi, "repeat");
fieldtxt.setTransform(matrix1.scale(m*0.5));}
const tree1i = new Image();
tree1i.src = "media/trees1.png";
var tree1txt;
tree1i.onload=function(){
let matrix1 = new DOMMatrix([1, 0, 0, 1, 0, 0]);
tree1txt=ctx.createPattern(tree1i, "repeat");
tree1txt.setTransform(matrix1.scale(m*0.5));}
const tree2i = new Image();
tree2i.src = "media/trees2.png";
var tree2txt;
tree2i.onload=function(){
let matrix1 = new DOMMatrix([1, 0, 0, 1, 0, 0]);
tree2txt=ctx.createPattern(tree2i, "repeat");
tree2txt.setTransform(matrix1.scale(m*0.5));}
generateWorld();
setInterval(function () {
    hour++;
    graphics();
    moneyout.innerText = "День " + Math.floor(date) + " Бюджет: " + Math.floor(money) + "k₽"
    if (mode == 4) {
        var waytype = 2;
        var lastwaypoint = ways[ways.length - 1][ways[ways.length - 1].length - 1];
        if (Math.sqrt((mx - lastwaypoint[0]) ** 2 + (my - lastwaypoint[1]) ** 2) > 2 * m) {
            if(isClear([lastwaypoint[0] + parallelx(mx, my, lastwaypoint[0], lastwaypoint[1], 2 * m), lastwaypoint[1] + parallely(mx, my, lastwaypoint[0], lastwaypoint[1], 2 * m)],2)){
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
        }
    }
    var disttoway = 1000;
    if (treesForClear.length > 0) {
        for (var j = 0; j < ways.length; j++) {
            for (var i = 1; i < ways[j].length; i++) {
                disttoway = Math.min(Math.sqrt((treesForClear[0][0] - ways[j][i][0]) ** 2 + (treesForClear[0][1] - ways[j][i][1]) ** 2), disttoway);
            }
        }
        if (disttoway <100) {
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
        } else {
            treesForClear.unshift(treesForClear.pop());
        }
    } else if (mode != 2 & mode != 5) {
        forClear = [];
    }
}, 100);
clearButton.onclick = function () {
    borders.checked = true;
    mode = 2;
    forClear.push([]);
}
fieldButton.onclick = function () {
    borders.checked = true;
    mode = 5;
    field.push([]);
    forClear.push([]);
}
bwButton.onclick = function () {
    borders.checked = true;
    mode = 3;
    ways.push([]);
}
field1Button.onclick=function() {
    mode=6;
}
kfButton.onclick=function(){
    mode=8;
}
tradeButton.onclick=function(){
    mode=10;
}
getkfButton.onclick=function(){
    mode=9;
}
silosButton.onclick=function() {
    borders.checked = true;
    mode=7;
}
ptButton.onclick=function() {
    borders.checked = true;
    mode=11;
}
bButton.onclick = function () {
    borders.checked = true;
    mode = 0;
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
    graphics();
}

canvas.onmouseout = function () {
    selected = -1;
}
canvas.onclick = function (e) {
    mx=canvas.relMouseCoords(e).x;
    my=canvas.relMouseCoords(e).y;
    if (mode == 0) {
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
    if ((mode == 2 || mode == 5)&closeToWay([mx,my],0,50*m)) {
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
    if (mode == 5 &closeToWay([mx,my],0,50*m)) {
        if (terrains[selected][terrains[selected].length - 2]) {
            if (field[field.length - 1].length > 0) {
                if ((mx - field[field.length - 1][0][0]) ** 2 + (my - field[field.length - 1][0][1]) ** 2 < 400 * m ** 2) {
                    money-= calcPolygonArea(field[field.length - 1].concat([field[field.length - 1][0]]))/m**2/10000*15*inflation;
                    field[field.length-1][0].push(date+calcPolygonArea(field[field.length - 1].concat([field[field.length - 1][0]]))/m**2/240000);
                    field[field.length-1][0].push(0);
                    mode = -1;
                } else {
                    field[field.length - 1].push([mx, my]);
                }
            } else {
                field[field.length - 1].push([mx, my]);
            }
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
        if(isClear([mx,my],4*m) & closeToWay([mx,my],0*m,100*m)){
            if(buy(200*inflation)){
            buildings.push([pointToWay([mx,my],5*m)[0],pointToWay([mx,my],5*m)[1],3.5*m,"media/potato.png","kfSklad",[100,0,date+20],rotWay([mx,my])]);
            mode=-1;
            for(var i=0;i<trees.length;i++){
                if((trees[i][0]-mx)**2+(trees[i][1]-my)**2<25*m**2){
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
                    if(buildings[i][4]=="kfSklad" & buildings[i][5][2]<=date){
                        var V=Math.min(buildings[i][5][0]-buildings[i][5][1],vegetables[0]);
                        vegetables[0]-=V;
                        buildings[i][5][1]+=V;
                    }
                }
                if(vegetables[0]>1){
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
        if(isClear([mx,my],25*m) & closeToWay([mx,my],0*m,100*m)){
            if(buy(3000*inflation)){
            buildings.push([pointToWay([mx,my],25*m)[0],pointToWay([mx,my],25*m)[1],20*m,"media/pStation.png","ptstation",[0,0,date+100],rotWay([mx,my])+Math.PI/2]);
            mode=-1;
            for(var i=0;i<trees.length;i++){
                if((trees[i][0]-mx)**2+(trees[i][1]-my)**2<625*m**2){
                    treesForClear.push(trees[i]);
                    trees.splice(i, 1);
                }
            }
            }
        }
    }
}
canvas.onmousedown = function (e) {
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
}
canvas.onmouseup = function () {
    if (mode == 4) {
        mode = -1;
    }
}
canvas.onkeydown = function (evt) {
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
        mode = -1;
    }
}
function graphics() {
    ctx.fillStyle=groundtxt;
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle=swamptxt;
    ctx.globalAlpha = 0.1;
    for (var i = 0; i < swamp.length; i++) {
        ctx.beginPath();
        ctx.arc(swamp[i][0], swamp[i][1], 15 * m, 0, 2 * Math.PI);
        ctx.fill()
    }
    ctx.globalAlpha = 1;
    ctx.filter="blur("+(m/2)+"px)";
    for (var i = 0; i < field.length; i++) {
        if (field[i].length > 0) {
            ctx.beginPath();
            ctx.lineWidth = 3
            ctx.moveTo(field[i][0][0], field[i][0][1]);
            drawway(field[i],0);
            if (i == field.length - 1 & ( mode ==5)) {
                ctx.lineTo(mx, my);
            } else {
                ctx.closePath();
            }
            if(borders.checked){
            ctx.setLineDash([2, 7]);
            ctx.strokeStyle = "#705000";
            ctx.stroke();
            ctx.setLineDash([]);}
                ctx.fillStyle=fieldtxt;
                ctx.fill();
                if(field[i][0][3]==1){
                    ctx.fillStyle="rgba(0,0,0,0.3)";
                    ctx.fill();
                }
                else if(field[i][0][3]==2){
                    ctx.fillStyle="rgba(10,"+(field[i][0][2]-date)+",20,0.4)";
                    ctx.fill();
                }
        }
    }
    ctx.filter="none";
    ctx.beginPath();
    drawway(river,0);
    ctx.lineWidth = 19 * m;
    ctx.strokeStyle="rgba(155,147,142,0.3)";
    ctx.stroke();
    ctx.strokeStyle="rgba(155,147,142,1)";
    ctx.lineWidth = 16 * m;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(river[i][0], river[i][1]);
    for (var i = 1; i < river.length; i++) {
        ctx.strokeStyle = "#230f1a";
        ctx.lineWidth = 10 * m;
        ctx.lineTo(river[i][0], river[i][1]);
        if (!river[i - 1][2]) {
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#200e1c";
            drawway(river.slice(i),0);
            i=river.length-1;
        }
        ctx.stroke();
    }
    for (var j = 0; j < ways.length; j++) {
        if (ways[j].length > 1) {
            if(ways[j][0][4] || borders.checked){
            if (ways[j][0][2] == 1) {
                ctx.beginPath();
                drawway(ways[j],0);
                ctx.strokeStyle="rgba(155,147,142,0.3)";
                ctx.length=16*m
                ctx.stroke();
                ctx.strokeStyle="rgba(155,147,142,0.6)";
                ctx.length=14*m
                ctx.stroke();
                ctx.strokeStyle="#b0a0a0";
                ctx.lineWidth = 8 * m;
                ctx.stroke();
            } else if (ways[j][0][2] == 2) {
                ctx.beginPath();
                ctx.moveTo(ways[j][0][0] + pdx(ways[j][0][0], ways[j][0][1], ways[j][1][0], ways[j][1][1], k * m), ways[j][1][1] + pdy(ways[j][0][0], ways[j][0][1], ways[j][1][0], ways[j][1][1], k* m));
                ctx.strokeStyle = "#705030";
                ctx.lineWidth = 1 * m;
                for(var k=-1.5;k<=1.5;k+=3){
                ctx.beginPath();
                for (var i = 1; i < ways[j].length; i++) {
                    ctx.lineTo(ways[j][i][0] + pdx(ways[j][i - 1][0], ways[j][i - 1][1], ways[j][i][0], ways[j][i][1], k * m), ways[j][i][1] + pdy(ways[j][i - 1][0], ways[j][i - 1][1], ways[j][i][0], ways[j][i][1], k * m));
                    if(!ways[j][i][4] & ctx.getLineDash()!=[[5*m,5*m]]){
                        ctx.stroke();
                        if(borders.checked){
                        ctx.beginPath();
                        ctx.setLineDash([2*m,2*m]);
                        drawway(ways[j].slice(i),k*m);}
                        i=ways[j].length-1;
                    }
                }
                ctx.stroke();
                ctx.setLineDash([]);}
            }
        }
    }
    ctx.setLineDash([]);
    }
    for (var i = 0; i < buildings.length; i++) {
        ctx.save();
        ctx.translate(buildings[i][0],buildings[i][1]);
        ctx.rotate(buildings[i][6]);
        ctx.translate(-buildings[i][2],-buildings[i][2]);
        if(buildings[i][5][2]<=date){
            let building=new Image();
        building.src=buildings[i][3];
        ctx.drawImage(building,0,0,buildings[i][2]*2,buildings[i][2]*2);
        }
        else if(borders.checked){
            ctx.beginPath();
            ctx.rect(0,0,buildings[i][2]*2,buildings[i][2]*2);
            ctx.strokeStyle = "#902000";
            ctx.lineWidth=1;
            ctx.setLineDash([1, 1]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        ctx.restore();
    }
    var alltrees = trees.concat(treesForClear);
    for (var i = alltrees.length - 1; i >= 0; i--) {
        ctx.beginPath();
        ctx.rect(alltrees[i][0] - 3 * alltrees[i][3] * m, alltrees[i][1] - 3 * alltrees[i][3] * m, 6 * alltrees[i][3] * m, 6 * alltrees[i][3] * m);
         if (alltrees[i][2] == 1) {
            ctx.fillStyle=tree1txt;
         }
         else if (alltrees[i][2] == 2) {
            ctx.fillStyle=tree2txt;
         }
         else{
            ctx.fillStyle=tree2txt;
         }

        ctx.fill();

    }
    if (borders.checked) {
        ctx.setLineDash([5, 10]);
        ctx.strokeStyle = "#000000";
        for (var i = 0; i < terrains.length; i++) {
            if (!terrains[i][terrains[i].length - 2]) {
                if (i != selected) {
                    ctx.beginPath();
                    ctx.moveTo(terrains[i][0][0], terrains[i][0][1]);
                    for (var j = 1; j < terrains[i].length - 2; j++) {
                        ctx.lineWidth = 0.5 * m;
                        ctx.lineTo(terrains[i][j][0], terrains[i][j][1]);
                    }
                    ctx.closePath();
                    ctx.fillStyle = "rgba(100,100,100,0.4)";
                    ctx.fill();
                } else if (!start) {
                    ctx.font = "15px Arial";
                    ctx.fillStyle = "rgba(0,0,0,1)";
                    ctx.fillText("цена: " + Math.floor(terrains[i][terrains[i].length - 1] * inflation) + "k₽", mx, my);
                } else {
                    ctx.font = "15px Arial";
                    ctx.fillStyle = "rgba(0,0,0,1)";
                    ctx.fillText("Выберите бесплатный", mx, my);
                    ctx.fillText("участок для освоения", mx, my + 15);
                }
            }
            ctx.stroke();
        }
        ctx.setLineDash([2, 7]);

        for (var i = 0; i < forClear.length; i++) {
            if (forClear[i].length > 0) {
                ctx.beginPath();
                ctx.lineWidth = 3
                ctx.strokeStyle = "#902000";
                ctx.moveTo(forClear[i][0][0], forClear[i][0][1]);
                for (var j = 1; j < forClear[i].length; j++) {
                    ctx.lineTo(forClear[i][j][0], forClear[i][j][1]);
                }
                if (i == forClear.length - 1 & (mode == 2 || mode ==5)) {
                    ctx.lineTo(mx, my);
                } else {
                    ctx.closePath();
                }
                ctx.stroke();
            }
        }
        ctx.setLineDash([]);
        for (var i = 0; i < buildings.length; i++) {
            if(buildings[i][4]=="kfSklad" & buildings[i][5][2]<=date){
                ctx.font = "15px Arial";
                ctx.fillStyle = "rgba(0,0,0,1)";
                ctx.fillText(Math.floor(buildings[i][5][1]/buildings[i][5][0]*100) + "%", buildings[i][0]-buildings[i][2], buildings[i][1]-buildings[i][2]);
            }
        }
    }
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
    if(minin1>0){
        p1=[ways[minin][minin1][0]+pdx(ways[minin][minin1-1][0],ways[minin][minin1-1][1],ways[minin][minin1][0],ways[minin][minin1][1],dist+2*m),ways[minin][minin1][1]+pdy(ways[minin][minin1-1][0],ways[minin][minin1-1][1],ways[minin][minin1][0],ways[minin][minin1][1],dist+2*m)];
        p2=[ways[minin][minin1][0]+pdx(ways[minin][minin1-1][0],ways[minin][minin1-1][1],ways[minin][minin1][0],ways[minin][minin1][1],-dist-2*m),ways[minin][minin1][1]+pdy(ways[minin][minin1-1][0],ways[minin][minin1-1][1],ways[minin][minin1][0],ways[minin][minin1][1],-dist-2*m)];
    }else{
        p1=[ways[minin][minin1][0]+pdx(ways[minin][minin1+1][0],ways[minin][minin1+1][1],ways[minin][minin1][0],ways[minin][minin1][1],dist+2*m),ways[minin][minin1][1]+pdy(ways[minin][minin1+1][0],ways[minin][minin1+1][1],ways[minin][minin1][0],ways[minin][minin1][1],dist+2*m)];
        p2=[ways[minin][minin1][0]+pdx(ways[minin][minin1+1][0],ways[minin][minin1+1][1],ways[minin][minin1][0],ways[minin][minin1][1],-dist-2*m),ways[minin][minin1][1]+pdy(ways[minin][minin1+1][0],ways[minin][minin1+1][1],ways[minin][minin1][0],ways[minin][minin1][1],-dist-2*m)];
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
function isClear(point,radius){
    let clear=false;
    for(var i=0;i<terrains.length;i++){
        if(terrains[i][terrains[i].length-2] & point_in_polygon(point,terrains[i])){
            clear=true;
        }
    }
    for(var i=0;i<swamp.length;i++){
        if((point[0]-swamp[i][0])**2+(point[1]-swamp[i][1])**2<radius**2){
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

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
