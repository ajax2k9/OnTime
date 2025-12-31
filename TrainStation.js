class TrainStation{
    constructor(c_idx,name,trk,p1,p2){
        if(!p1 || !p2){
            p1 = 0;
            p2 = trk.GetPointNum()-1;
        }
        this.points = [trk.points[p1],trk.points[p2]];
        trk.SetStation(this,p1,p2)
        this.c_idx = c_idx;
        this.name = name    
        this.track = trk
        this.cycles = 1/2;
        this.nextTime = interval/this.cycles;
        this.crafting = false;
        this.cogAng = 0;
    }

    setRecipe(input,output){
        this.crafting = true;
        this.addReq(input,0)
        this.addItem(output,0)
        this.recipe={"in":input,"out":output}
    }

    addTrain(cart_num,reverse){
        trains.push(new Train(cart_num,this.track,this.c_idx,reverse))
    }

    addItem(name,quant){
        this.item = new Item(this.points[1].x+2,this.points[0].y-33,name,quant)
    }

    addReq(name,quant){
        this.req = new Item(this.points[1].x+2,this.points[0].y+24,name,quant)
    }

    HandleProcess(){
        if(this.crafting){
            if(this.req.quant > 0 && this.item.quant < this.item.maxQuant){
                this.req.quant--;
                this.item.quant++;
            }
            return
        }
        
        if(this.item && this.item.quant < this.item.maxQuant){
            this.item.quant++;
        }
        if(this.req && this.req.quant > 0){
            this.req.quant--;
        }
    }

    draw(){
        if(startClock){
            if(time >this.nextTime){
                this.HandleProcess();
                this.nextTime += interval/this.cycles
            }
        } 
        let x1 = this.points[0].x - 5
        let x2 = this.points[1].x + 5
        let y1 = this.points[0].y - 20
        let y2 = this.points[1].y + 10

        rectMode(CORNERS)
        noStroke()
        fill(this.c_idx*60,100,50)
        rect(x1-2,y1-2,x1+10,y2+2)
        rect(x2+2,y1-2,x2-10,y2+2)
        fill(this.c_idx*60,100,20)
        rect(x1,y1,x2,y2)
        fill(0,100,100)
        textAlign(CENTER)
        text(this.name,(x1+x2)/2,y1+10)
        
        strokeWeight(1)
        fill(0,0,100)
          
        if(this.item){
            rect(x1,y1-3,x2,y1-25,5)
            image(imgs[this.item.name],x1-7,y1-14)  
            this.item.draw()
            if(this.crafting){
                push()
                    translate(x1+8,y1-14)
                    rotate(this.cogAng)
                    image(imgs["cog"],0,0)
                pop()
            }  else {
                 image(imgs["in"],x1+8,y1-14)
            } 
        } 

        if(this.req){
            rect(x1,y2+3,x2,y2+25,5)
            image(imgs[this.req.name],x1-7,y2+14)
            this.req.draw()
             if(this.crafting){
                if(this.req.quant > 0)this.cogAng+=2
                push()
                    translate(x1+8,y2+14)
                    rotate(this.cogAng)
                    image(imgs["cog"],0,0)
                pop()
            }  else {
                 image(imgs["out"],x1+8,y2+14)
            } 
        }
    }
}
