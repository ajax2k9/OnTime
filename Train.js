class Cart {
    constructor(train,c_idx,p_idx) {
        this.c_idx = c_idx;
        this.train = train;
        this.p_idx = p_idx
        this.pos = this.train.points[this.p_idx];
        let img = imgs["train_front"]
        this.pg = createGraphics(img.width,img.height)
        this.pg.colorMode(HSL)
        this.pg.tint(this.c_idx * 60,100,50)
        this.pg.image(img,0,0)
    }

    AddItem(name){
        this.item = name
    }

    RemoveItem(){
        this.item = undefined;
    }

    draw(){
        this.pos = this.train.points[this.p_idx];
        let ang = 0
        let pts = this.train.points;
        if(this.p_idx > 0){
            ang = p5.Vector.sub(pts[this.p_idx-1],pts[this.p_idx]).heading()
        } else {
            ang = this.train.dir.heading()
        }
        

        push()
            translate(this.pos.x,this.pos.y)
            rotate(ang)
            image(this.pg,0,0)
        pop()
        if(this.item){
            image(imgs[this.item],this.pos.x,this.pos.y)
        }
    
    }
}

class Train{
    constructor(cart_num,track,c_idx,reverse){
        this.cart_num = cart_num;
        this.carts = []
        this.points = [];
        this.track = track
        this.c_idx = c_idx;
        this.reverse = reverse;
        this.speed = 2;
        this.spacing = 15;
        this.move = false;    
        if(!this.reverse){
            this.index = track.GetLastIndex();
            this.pos = track.GetLastPoint();
            this.dir = createVector(1,0)
        } else {
            this.index = 0;
            this.pos = track.GetFirstPoint();
            this.dir = createVector(-1,0)
        }

        this.addCarts();
    }
    
    Advance(track,end){
        if(this.index == end){
            if(track){
                this.track = track
                this.index = this.reverse?track.GetLastIndex():0
            } else {
                this.reverse != this.reverse
                this.flipPoints()
                return
            }
        }
    }

    CalcSpeed(offset){
        this.p = this.track.points[this.index+offset]
        this.dir = p5.Vector.sub(this.p, this.pos).normalize();
        let d = this.pos.dist(this.p)
        let speed = min(this.speed,d)
        this.pos.add(this.dir.mult(speed));
        
        return d
    }

    FlipTrain(idx){
        this.reverse = !this.reverse
        this.index=idx; 
        this.flipPoints()
    }    


    HandleMove(){
        let t = this.track;
        this.Advance(t.GetLastTrack(),t.GetLastIndex())

        if(this.CalcSpeed(1) < 1){
            if(this.p.station && this.p == this.p.station.points[1]){//stop at station
                if(this.index == t.GetLastIndex() - 1 && !t.GetLastTrack()){
                    this.FlipTrain(t.GetLastIndex())
                    return
                }
                this.move = false
            } 
            this.index++;  
        }
    }

     HandleReverseMove(){
        let t = this.track;
        this.Advance(t.GetFirstTrack(),0)

        if(this.CalcSpeed(-1) < 1){
            if(this.p.station && this.p == this.p.station.points[0]){//stop at station
                if(this.index == 1 && !t.GetFirstTrack()){
                    this.FlipTrain(0)
                    return
                }
                this.move = false
            } 
            this.index--;  
        }
    }

    addCarts(){
        for(let i = 0; i < this.cart_num; i++){
            this.points[i] =p5.Vector.mult(this.dir,i*this.spacing*-1).add(this.pos);
            this.carts.push(new Cart(this,this.c_idx,i))
        }
    }

    calcPoint(max_dist,idx){
        let p0 = this.points[idx - 1] // look at first point
        let p1 = this.p_track.points[this.p_idx]  // set second control point to prev point
        let d = p0.dist(p1)

        if(max_dist > d){
            max_dist -=d
            if(this.p_idx == 0){
                this.p_track = this.p_track.GetFirstTrack()
                this.p_idx = this.p_track.GetLastIndex()
            }

            p0 = this.p_track.points[this.p_idx]
            p1 = this.p_track.points[this.p_idx-1]
            this.p_idx--
        }
       
        return p5.Vector.sub(p1,p0).normalize().mult(max_dist).add(p0)
    }


    calcReversePoint(max_dist,idx){
        let p0 = this.points[idx - 1] // look at first point
        let p1 = this.p_track.points[this.p_idx]  // set second control point to prev point
        let d = p0.dist(p1)

        if(max_dist > d){
            max_dist -=d
            if(this.p_idx == this.p_track.GetLastIndex()){
                this.p_track = this.p_track.GetLastTrack()
                this.p_idx = 0
            }

            p0 = this.p_track.points[this.p_idx]
            p1 = this.p_track.points[this.p_idx+1]
            this.p_idx++
        }
       
        return p5.Vector.sub(p1,p0).normalize().mult(max_dist).add(p0)
    }

    updatePoints(){
        this.points[0] = this.pos;
        this.p_idx = this.index;
        this.p_track = this.track;
       for(let i =1; i < this.cart_num; i++){
        if(this.reverse){
             this.points[i] = this.calcReversePoint(this.spacing,i)
        } else {
            this.points[i] = this.calcPoint(this.spacing,i)
        }
       }
    }
    
    flipPoints(){
        let temp = [...this.points]
        for(let i =0; i < this.points.length; i++){
            this.points[i] = temp [this.points.length-1 - i]
        }

        this.pos = this.points[0]

          if(this.reverse){
            let p = this.track.points[this.index-1]
            this.dir = p5.Vector.sub(p, this.pos).normalize();
        } else {
            let p = this.track.points[this.index+1]
            this.dir = p5.Vector.sub(p, this.pos).normalize();
        }
    }
    doAction(){
        this.move = true;
    }

    HandleStation(station){
        let req = station.req;
        if(req && req.quant < req.maxQuant){
            this.carts.forEach(c=>{
                if(c.item && c.item == req.name && req.quant < req.maxQuant){
                    c.RemoveItem()
                    req.quant++;
                }
            })
        }
        
        let item = station.item;
        if(item && item.quant > 0){
            this.carts.forEach(c=>{
                if(!c.item && item.quant > 0){
                    c.AddItem(item.name)
                    item.quant--;
                }
            })
        }
    }

    draw(){
        if(this.move){
            this.updatePoints()
            if(this.reverse){
                this.HandleReverseMove()
            } else {
                this.HandleMove()
            }
        } else {
            let p = this.track.points[this.index]
            if(p.station){
                this.HandleStation(p.station)
            }
        }
        this.carts.forEach(c=>c.draw())
    }
}