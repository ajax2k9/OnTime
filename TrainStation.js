class TrainStation{
    constructor(c_idx,name,cart_num,points,end){
        this.points = points;
        this.c_idx = c_idx;
        this.name = name
        //TODO add train spawn
        this.track = new Track(this.points);
        this.track.points[1].track = end;
        end.points[0].track = this.track
        tracks.push(this.track)
        trains.push(new Train(cart_num,end,this.c_idx,false))
        this.items = [];
        this.reqs = [];
    }

    addItem(name,quant){
        this.items.push(icons[name],quant)
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
    }
}