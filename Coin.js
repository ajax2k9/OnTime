let sel_coin;
class Coin {
    constructor(obj,icon) {
        this.obj = obj;
        this.p = createVector();
        this.inSlot = false;
        this.placed = false;
        
        this.coin1 = createGraphics(icon.width,icon.height)
        this.coin1.colorMode(HSL)
        this.coin1.tint(this.obj.c_idx * 60,100,50)
        this.coin1.image(icon,0,0)

        this.coin2 = this.coin1.get(0,0,icon.width,icon.height/1.75)
    }

    doAction(){
        this.obj.doAction();
    }
    HandleMouse(){
        if(!sel_coin && this.p.dist(createVector(mouseX-width/2,mouseY-width/2)) < 20){
            sel_coin = this;
            this.inSlot = false
            this.placed = false;
            clock.clearCoin(this)
        }

        if(sel_coin == this){
            this.p.x = mouseX-width/2
            this.p.y = mouseY-width/2
        }
    }

    draw(){

        if(mouseIsPressed && mouseButton == LEFT){
            this.HandleMouse()
        }

        if(this.inSlot){
            image(this.coin2,this.p.x,this.p.y-this.coin2.height/2+2)
        } else {
            image(this.coin1,this.p.x,this.p.y)
        }
    }
}

class CoinBasket {
    constructor(parameters) {
        this.slots = []

        this.s_w = 5;
        this.s_h = 4;
        this.w = 300;
        this.h = 100;
        this.x = -this.w/2;
        this.y = height/2-70
        this.createSlots();
    }

    addCoin(mover,icon){
        let c = new Coin(mover,icon);
        for(let i =0; i < this.slots.length; i++){
            if(!this.slots[i].coin){
                c.p = this.slots[i].p.copy();
                c.inSlot = true
                this.slots[i].coin = c;
                return;
            }
        }
    }

    checkCoins(){
        this.slots.forEach(s=>{
            if(!s.coin || s.coin.placed) return
            s.coin.p = s.p.copy();
            s.coin.inSlot = true
        })
    }
    
    createSlots(){
        this.slots = [];
        let sp_x = (this.w)/this.s_w;
        let sp_y = (this.h)/this.s_h;
        for(let i = 0; i <this.s_w; i++){
            for(let j = 0; j <this.s_h; j++){
                let x = sp_x*(i-(this.s_w-1)/2);
                let y = sp_y*(j-(this.s_h-1)/2)+this.y+this.h/2 
                this.slots.push({p:createVector(x,y),coin:undefined})
            }
        }
    }
    drawCoins(){
        this.slots.forEach(s=>{
             if(s.coin)s.coin.draw()
        })   
        noTint();
    }

    draw(){
        rectMode(CORNER)
        fill(30,80,70)
        rect(this.x,this.y,this.w,this.h)
        fill(30,50,50)
        rect(this.x,this.y+this.h,this.w,this.h/4)

        rectMode(CENTER)
        noStroke()
        fill(0)
        this.slots.forEach(s=>{
             rect(s.p.x,s.p.y,40,5)
        })     
    }
}