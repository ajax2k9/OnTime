let tracks =[];
let clock;
let basket;
let imgs = {};
let img_names = ["coin","switch","train_front","train_body","person","log","coal"];
let switches;
let spacing = 25;
let bgColor;
let trains = [];
let stations = []
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
    canvas.elt.oncontextmenu = () => false; // Disables the context menu

   tracks.push(new Track([vec(-6,0),vec(-5,0)]));

   tracks.push(new Track([
    vec(-5,0),
    vec(-4,-1),
    vec(-2,-1),
    vec(-1,0)
   ]));  
   
   
   tracks.push(new Track([vec(-5,0),vec(-1,0)])); 
   tracks.push(new Track([vec(-1,0),vec(2,0)]));
   tracks.push(new Track([vec(-8,0),vec(-6,0)]));
   tracks.push(new Track([vec(2,0),vec(4,0)]));

   weldTracks(tracks[4],tracks[0])
   weldTracks(tracks[3],tracks[5])
   switches = new SwitchGroup(1);
   switches.addSwitch(tracks[0],tracks[1],tracks[2],false)
   switches.addSwitch(tracks[3],tracks[1],tracks[2],true)

   clock = new Clock();
   basket = new CoinBasket();
   let station = new TrainStation(0,"Guss",tracks[4])
   station.addItem("person",5)
   station.addTrain(3,false)
   stations.push(station)

   station = new TrainStation(1,"Doug",tracks[5])
   stations.push(station)

   basket.addCoin(trains[0],imgs["coin"])
   basket.addCoin(trains[0],imgs["coin"])
   basket.addCoin(trains[0],imgs["coin"])
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

    stations.forEach(s=>s.draw());
   
    tracks.forEach(t => {
       t.draw() 
    });

    switches.draw()
    trains.forEach(t=>t.draw())
    basket.drawCoins();
}

function weldTracks(trk1,trk2){
    trk1.SetLastTrack(trk2)
    trk2.SetFirstTrack(trk1)
}

function vec(x,y){
    return createVector(x,y).mult(spacing)
}

