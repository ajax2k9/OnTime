class Track {
    constructor(points) {
        this.points = points;
        this.color = color(0)
    }
   

    GetFirstPoint(){
        return this.points[0].copy()
    }

    GetLastPoint(){
        return this.points[this.points.length-1].copy()
    }

    GetFirstTrack(){
        return this.points[0].track;
    }

    SetFirstTrack(track){
        this.points[0].track = track;
    }

    GetLastTrack(){
        return this.points[this.points.length -1].track;
    }

    SetLastTrack(track){
        this.points[this.points.length - 1].track = track;
    }

    GetPointNum(){
        return this.points.length;
    }

    GetLeg(i){
        return this.points[i].dist(this.points[i+1])
    }

    draw(){
        strokeWeight(2)
         stroke(this.color)
          for(let i = 0; i < this.points.length-1; i++){
            let p1 = this.points[i];
            let p2 = this.points[i+1];
            line(p1.x,p1.y,p2.x,p2.y)
        }
    }
}

class SwitchGroup{
    constructor(c_idx){
        this.c_idx = c_idx;
        this.switches = []
    }

    addSwitch(trackIn,track1,track2,merge){
        this.switches.push(new Switch(trackIn,track1,track2,merge,this.c_idx))
    }

    doAction(){
        this.switches.forEach(s=>s.SwitchTracks())
    }

    draw(){
        this.switches.forEach(s=>s.draw())
    }
}

class Switch{
    constructor(trackIn,track1,track2,merge,c_idx){
        this.in = trackIn
        this.out1 = track1
        this.out2 = track2
        this.currTrack = track1
        this.flip = false;
        this.merge = merge;
        this.c_idx = c_idx;
        this.SetTrack()
        
        
    }

    SwitchTracks(){
        this.flip = !this.flip;
        this.currTrack = this.flip?this.out2:this.out1;
        this.SetTrack();
    }

    SetTrack(){
        if(this.merge){
            this.out1.SetLastTrack(this.in)
            this.out2.SetLastTrack(this.in)
            this.in.SetFirstTrack(this.currTrack)

        } else {
            this.currTrack.SetFirstTrack(this.in)
            this.in.SetLastTrack(this.currTrack);
        }

        this.calcPoints();
    }

    calcPoints(){
        this.p0 = this.currTrack.GetFirstPoint();
        this.p1 = this.in.GetFirstPoint();
        this.p2 = this.currTrack.points[1].copy()
        if(this.merge){
            this.p0 = this.currTrack.GetLastPoint();
            this.p1 = this.in.GetLastPoint();
            this.p2 = this.currTrack.points[this.currTrack.points.length-2].copy()
        }
        
        this.p1.sub(this.p0).normalize().mult(spacing/4).add(this.p0)
        this.p2.sub(this.p0).normalize().mult(spacing/4).add(this.p0)
    }

    draw(){
        stroke(this.c_idx*60,100,50);
        line(this.p0.x,this.p0.y,this.p1.x,this.p1.y)
        line(this.p0.x,this.p0.y,this.p2.x,this.p2.y)
    }
}