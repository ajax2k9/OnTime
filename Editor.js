class Editor{
    constructor(){
        this.createMainMenu()
        this.createTrainMenu()
        this.drawTrack = true
        this.active = true;
        this.m_x = 0;
        this.m_y = 0;
    }

    createMainMenu(){
        this.div = createDiv()
        this.div.position(820,10)
        this.Stnbutton = createButton("Add Station")
        this.Trkbutton = createButton("Add Track")
        this.Swtchbutton = createButton("Add Switch")
        this.Trnbutton = createButton("Add Train")
        this.Stnbutton.parent(this.div)
        this.Trkbutton.parent(this.div)
        this.Swtchbutton.parent(this.div)
        this.Trnbutton.parent(this.div)
    }

    createTrainMenu(){
        this.trainDiv = createDiv()
        this.trainDiv.position(820,50)
        // sub div1
        let div1 = createDiv().addClass("trainDiv").parent(this.trainDiv)
        
        createP("Carts").parent(div1)
        this.cartbox = createSelect(false).parent(div1)
        for(let i = 1; i <=5; i++)this.cartbox.option(i)
    
        createP("Type").parent(div1)
        this.trnIndxbox = createSelect(false).parent(div1)
        for(let i = 0; i <=4; i++)this.trnIndxbox.option(i)
        
        createP("Track").parent(div1)
        this.trainTrackBox = createSelect().parent(div1)

        // sub div2
        let div2 = createDiv().addClass("trainDiv").parent(this.trainDiv)
        
        createP("Start Point").parent(div2)
        this.trainTrackPtBox = createSelect().parent(div2)

        this.trainRev = createCheckbox(" Reverse").parent(div2)

        this.trainOk = createButton("OK").parent(this.trainDiv)
    }

    HandleClick(){
        if(this.drawTrack){
            if(mouseButton == LEFT){
                this.addTrackPoint()
            }
            if(mouseButton == RIGHT){
                this.closeTrack()
            }
        }
    }

    drawGrid(){
        push()
        beginClip({ invert: false })
            circle(0,0,width-150)
        endClip()
        
        stroke(100)
        strokeWeight(2)
        
        line(0,-height/2,0,height/2)
        line(-width/2,0,width/2,0)
        strokeWeight(1)
        let segs = width/spacing

        for(let i = 1; i<segs/2; i++){
            line(-width/2,i*spacing,width/2,i*spacing)
            line(-width/2,-i*spacing,width/2,-i*spacing)
            line(i*spacing,-width/2,i*spacing,width/2)
            line(-i*spacing,-width/2,-i*spacing,width/2)
        }
        pop()
    }

    addTrackPoint(){
        this.currPt = createVector(this.m_x,this.m_y)
        if(!this.currTrack){
            this.currTrack = new Track([this.currPt.copy()])
            level.AddTrack(this.currTrack)
        } else {
            this.currTrack.AddPoint(this.currPt.copy())
        }
    }

    closeTrack(){
        this.trainTrackBox.option(level.tracks.length-1)
        this.currTrack = undefined
        this.currPt = undefined
    }

    draw(){
        if(!this.active)return
        
        this.drawGrid()
        
        if(!this.drawTrack) return
        
        if(dist(width/2,width/2,mouseX,mouseY)>width-150) return

        noStroke()
        fill(0)
        
        this.m_x = round((mouseX-width/2)/spacing)*spacing
        this.m_y = round((mouseY-width/2)/spacing)*spacing
        let v = createVector(this.m_x,this.m_y)
        if(this.currPt){
            let diff = p5.Vector.sub(v,this.currPt)
            diff.setHeading(round(diff.heading()/45)*45)
            
            v = diff.add(this.currPt)
            v.x = round(v.x/spacing)*spacing
            v.y = round(v.y/spacing)*spacing
            stroke(0,100,50)
            line(this.currPt.x,this.currPt.y,v.x,v.y)
            this.m_x = v.x
            this.m_y = v.y
        }
        

        circle(v.x,v.y,10)
        

    }
}