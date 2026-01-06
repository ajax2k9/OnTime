let clock;
let imgs = {};
let img_names = ["coin","switch","train_front","train_body","person","log","coal","in","out","cog"];
let spacing = 25;
let level;

function preload(){

    img_names.forEach(iname=>{
        loadImage(`assets/${iname}.png`,(img)=>{
            imgs[iname] = img
        })
    })
}

function setup(){
    const canvas = createCanvas(800, 1000);
    imageMode(CENTER)
    colorMode(HSL)
    angleMode(DEGREES)
    // canvas.elt.oncontextmenu = () => false; // Disables the context menu
    clock = new Clock();
    level = new Level();
    level.AddTrack([[-10,0],[-8,0]])
    level.AddTrack([[-8,0],[-6,0]])
    level.weldTracks()
} 

function keyPressed(event){
    if(key == ' '){
        event.preventDefault()
        clock.startClock = !clock.startClock;

    }
}
function mouseReleased(){
    clock.checkCoins();
    level.basket.checkCoins();
    sel_coin = undefined
}

function draw(){

    fill(255)
    background(220,30,60);
    translate(width/2,width/2)
    
    clock.draw()
    level.draw()
}


