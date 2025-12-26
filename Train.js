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
            this.index = track.GetPointNum()-1;
            this.pos = track.GetLastPoint();
            this.dir = createVector(1,0)
        } else {
            this.index = 0;
            this.pos = track.GetFirstPoint();
            this.dir = createVector(-1,0)
        }

        this.addCarts();
    }

     HandleMove(){
        if(this.index < this.track.GetPointNum()-1){

            let p = this.track.points[this.index+1]
            this.dir = p5.Vector.sub(p, this.pos).normalize();
            let d = this.pos.dist(p)
            let speed = min(this.speed,d)
            this.pos.add(this.dir.mult(speed)); 
            
            if( d < 1){
                this.index++;
            }
        } else if(this.track.GetLastTrack()){
            let t = this.track.GetLastTrack();
            this.track = t;
            this.index = 0;
        } else {
            this.pos = this.track.GetLastPoint()
            this.move = false;
            this.reverse = !this.reverse;
            this.flipPoints()
        }
    }

    addCarts(){
        for(let i = 0; i < this.cart_num; i++){
            this.points[i] =p5.Vector.mult(this.dir,i*this.spacing*-1).add(this.pos);
            this.carts.push(new Cart(this,this.c_idx,i))
        }
    }

    calcPoint(d,idx){
        let d1 = this.pos.dist(this.track.points[idx])
        let t = this.track;
        let p0 = this.pos
        let p1 = t.points[idx]

        while(d > d1){
            d -= d1
            if(idx == 0){
                t = t.GetFirstTrack();
                if(!t)break;
                idx = t.GetPointNum() -1   
            } 

            if(t){
                d1 = t.GetLeg(idx - 1)
            } else {
                break;
            }
            p0 = t.points[idx]
            p1 = t.points[idx - 1]
            idx--;
        }
        
        return p5.Vector.sub(p1,p0).normalize().mult(d).add(p0)
    }

     calcReversePoint(d,idx){
        let d1 = this.pos.dist(this.track.points[idx])
        let t = this.track;
        let p0 = this.pos
        let p1 = t.points[idx]


        while(d > d1){
            d -= d1
            if(idx == t.GetPointNum()-1){
                t = t.GetLastTrack()
            
                if(!t)break;
                idx = 0
            } 

            if(t){
                d1 = t.GetLeg(idx)
            } else {
                break;
            }
            p0 = t.points[idx]
            p1 = t.points[idx + 1]
            idx++;
        }
        
        return p5.Vector.sub(p1,p0).normalize().mult(d).add(p0)
    }

    updatePoints(){
        this.points[0] = this.pos;
       
       for(let i =1; i < this.cart_num; i++){
        if(this.reverse){
             this.points[i] = this.calcReversePoint(this.spacing*i,this.index)
        } else {
            this.points[i] = this.calcPoint(this.spacing*i,this.index)
        }
       }
    }
    
    HandleReverseMove(){
        if(this.index  > 0){
            let p = this.track.points[this.index-1]
            this.dir = p5.Vector.sub(p, this.pos).normalize();
            let d = this.pos.dist(p)
            let speed = min(this.speed,d)
            this.pos.add(this.dir.mult(speed)); 
            if( d < 4){
                this.index--;
            }
        } else if(this.track.GetFirstTrack()){
            let t = this.track.GetFirstTrack();
            this.track = t;
            this.index = t.points.length -1;
        } else {
            this.pos = this.track.GetFirstPoint()
            this.move = false;
            this.reverse = !this.reverse;
            this.flipPoints()
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
        if(req && req.quant > 0){
            this.carts.forEach(c=>{
                if(c.item && c.item == req.name && req.quant > 0){
                    c.RemoveItem()
                    req.quant--;
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