class Clock {
    constructor(){
        this.radius = width/2.3
        this.rings = 3
        this.positions = 8;
        this.slots = [];
        this.width = 50
        this.calcSlots();
        this.currPos = 0;
        this.ang = 0;
        this.d_ang = 0;
        this.doAction = false;
        this.startClock = false;
        this.time = 0;
        this.interval = 2;
        this.nextTime = 2;
    }

    calcSlots(){
        for(let r = 0; r < this.rings; r++){
            for(let p = 0; p < this.positions; p++){
                let radius = this.radius -5 * (this.rings-1) + r *10;
                let x = radius * cos(360/this.positions*p); 
                let y = radius * sin(360/this.positions*p);
                
                this.slots.push({p:createVector(x,y),coin:undefined})
            
            }
        }
    }

    checkCoins(){
        if(!sel_coin) return; 
        this.slots.forEach(s=>{
            if(sel_coin && !s.coin){
                if(abs(sel_coin.p.x-s.p.x) < 5 && abs(sel_coin.p.y-s.p.y) < 5 ){
                        s.coin = sel_coin;
                        sel_coin.placed = true
                        sel_coin.p = s.p.copy();
                        sel_coin = undefined
                    }
                }
        })

    }

    clearCoin(coin){
        this.slots.forEach(s=>{
            if(s.coin == coin){
                s.coin = undefined;
            }
        })
    }

    performAction(pos){
       for(let i = pos; i < this.slots.length; i+=this.positions){
        let s = this.slots[i];
        if(s.coin){
            s.coin.doAction();
        }
       }
    }

    drawPointer(){
        push()
            if(abs(this.ang-this.d_ang)>1){
                this.ang = lerp(this.ang,this.d_ang,0.2);
                this.doAction = true;
            } else {
                if(this.doAction){
                    this.performAction(this.currPos)
                    this.doAction = false;
                }
                this.ang =this.d_ang
            }
            rotate(this.ang)
            noStroke()
            fill(255,0,0)
            beginShape();
            vertex(this.radius-this.width/2 + 10,0)
            vertex(this.radius + this.width/2 +5,10)
            vertex(this.radius + this.width/2 +5,-10)
            endShape();
        pop()
    }
    drawFace(){
        noFill()
        strokeWeight(this.width)
        stroke(40,80,30)
        circle(0,10,this.radius*2)
        stroke(40,80,80)
        circle(0,0,this.radius*2)
    }

    drawSlots(){
        noStroke()
        fill(255)
        this.slots.forEach(s=>{            
            circle(s.p.x,s.p.y,5);
        })
    }

    IncrementPos(){
        this.currPos = (this.currPos + 1)%this.positions;
        this.d_ang += 360/this.positions;
    }

    drawRings(){
        noFill()
        stroke(100,50,0)
        strokeWeight(3)
        for(let r = 0; r < this.rings; r++){
            let radius = this.radius -5 * (this.rings-1) + r *10;
            circle(0,0,radius*2)
        }
    }

    draw(){
        if(this.startClock){
        this.time+=1/frameRate();
        if(this.time >= this.nextTime){
            this.IncrementPos();
            this.nextTime+= this.interval
        }
    }
        this.drawFace()
        this.drawRings()
        this.drawSlots()
        this.drawPointer()
        
    }
}