class TrainStation{
    constructor(c_idx,name,trk){
        this.points = [trk.GetFirstPoint(),trk.GetLastPoint()];
        trk.SetStation(this)
        this.c_idx = c_idx;
        this.name = name    
        this.track = trk
        this.items = [];
        this.reqs = [];
    }

    addTrain(cart_num,reverse){
        trains.push(new Train(cart_num,this.track,this.c_idx,reverse))
    }

    addItem(name,quant){
        this.items.push(new Item(this.points[0].x,this.points[0].y-30,name,quant))
    }

    draw(){
        let x1 = this.points[0].x - 5
        let x2 = this.points[1].x + 10
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

        this.items.forEach(item=>item.draw())
    }
}
