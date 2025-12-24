class Track {
    constructor(points) {this.points = points;
        this.addpoints(points,0.25);
        this.bpoints = []
        this.bpoints.push(points[0])
        for(let i = 0; i <this.b_idx.length; i++){
            this.constructBeizer(i)
        }
        this.bpoints.push(points[points.length-1])

        this.points = this.bpoints;
    }
    addpoints(points,weight){
        let p_pairs = [];
        this.b_idx = [];
        for(let i = 1; i < points.length-1; i++){
            let p0 = p5.Vector.lerp(points[i],points[i-1],weight); 
            let p1 = p5.Vector.lerp(points[i],points[i+1],weight);
            p_pairs.push([p0,p1])
        }
        
        let idx = 1
        for(let i = 0; i < p_pairs.length; i++){
        this.points.splice(idx,0,p_pairs[i][0])
        idx +=2;
        this.b_idx.push(idx-1);
        this.points.splice(idx,0,p_pairs[i][1])
        idx++;
        }
        
    }
    constructBeizer(b_arr){
        let b_idx = this.b_idx[b_arr]
        let interval = 5;
        let p1 = this.points[b_idx-1]
        let p2 = this.points[b_idx]
        let p3 = this.points[b_idx+1]
        for(let i = 0; i < interval; i++){
            let t = i/interval;
            let x = (1-t)*(1-t)*p1.x + 2*(1-t)*t*p2.x + t*t*p3.x
            let y = (1-t)*(1-t)*p1.y + 2*(1-t)*t*p2.y + t*t*p3.y
          
            this.bpoints.push(createVector(x,y));
        }
    }

    GetFirstPoint(){
        return this.points[0].copy()
    }

    GetLastPoint(){
        return this.points[this.points.length].copy()
    }

    GetPointNum(){
        return this.points.length;
    }

    GetLeg(i){
        return this.points[i].dist(this.points[i+1])
    }

    draw(){
        strokeWeight(2)
         stroke(0)
          for(let i = 0; i < this.points.length-1; i++){
            let p1 = this.points[i];
            let p2 = this.points[i+1];
            line(p1.x,p1.y,p2.x,p2.y)
        }
    }
}