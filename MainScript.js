let tracks =[];
let clock;
let basket;
let imgs = {};
let switches;
let spacing = 25;
let bgColor;
let trains = [];

function preload(){
    loadImage("assets/coin.png",(img)=>{
        imgs["train"] = img
    })

    loadImage("assets/switch.png",(img)=>{
        imgs["switch"] = img
    })

     loadImage("assets/train_front.png",(img)=>{
        imgs["train_front"] = img
    })

     loadImage("assets/train_body.png",(img)=>{
        imgs["train_body"] = img
    })

}


function setup(){
    const canvas = createCanvas(800, 1000);
    imageMode(CENTER)
    colorMode(HSL)
    angleMode(DEGREES)
    canvas.elt.oncontextmenu = () => false; // Disables the context menu

   tracks.push(new Track([
    vec(-7,0),
    vec(-5,0)
   ]));

   tracks.push(new Track([
    vec(-5,0),
    vec(-4,-1),
    vec(-2,-1),
    vec(-1,0)
   ]));  
   
   
   tracks.push(new Track([
    vec(-5,0),
    vec(-1,0)
   ])); 
   
   tracks.push(new Track([
    vec(-1,0),
    vec(2,0)
   ]));

   switches = new SwitchGroup(1);
   switches.addSwitch(tracks[0],tracks[1],tracks[2],false)
   switches.addSwitch(tracks[3],tracks[1],tracks[2],true)

   clock = new Clock();
   basket = new CoinBasket();
   station = new TrainStation(0,"Guss",4 ,[vec(-9,0),vec(-7,0)],tracks[0])
   basket.addCoin(trains[0],imgs["train"])
   basket.addCoin(trains[0],imgs["train"])
   basket.addCoin(trains[0],imgs["train"])
   basket.addCoin(switches,imgs["switch"])
} 
function keyPressed(event){
    if(key == ' '){
        event.preventDefault()
        clock.IncrementPos()
    }

    if(key == 'r'){
        for(let i =0; i < 2; i++){

        }
        noLoop()
    }
}
function mouseReleased(){
    clock.checkCoins();
    basket.checkCoins();
    sel_coin = undefined
}

function draw(){
    fill(255)
    background(220,30,60);
    translate(width/2,width/2)
    clock.draw()
    basket.draw()
    

    station.draw();
   
    tracks.forEach(t => {
       t.draw() 
    });
    trains.forEach(t=>t.draw())
    basket.drawCoins();
    switches.draw()
}

function vec(x,y){
    return createVector(x,y).mult(spacing)
}

