class Level {
    constructor(name) {
        this.name = name
        this.trains = [];
        this.tracks = [];
        this.stations = [];
        this.basket = new CoinBasket();
        this.switchgroups = [
            new SwitchGroup(0),
            new SwitchGroup(1),
            new SwitchGroup(2)
        ]
        this.rings = 1;
        this.positons = 4;
    }



    AddStation(idx,name,t_idx,p1,p2,input,output,crafting){
        let stn = new TrainStation(idx,name,this.tracks[t_idx],p1,p2)
        
        if(crafting){
            stn.setRecipe(input,output)
        } else {
            if(input){
                stn.addItem(input)
            }
            if(output){
                stn.addReq(output)
            }
        }
        this.stations.push(stn)
    }

    AddTrack(track){
        this.tracks.push(track)
    }

    AddTrain(t_idx,c_idx,cart_num,reverse){
        this.trains.push(new Train(cart_num,this.tracks[t_idx],c_idx,reverse))
    }

    AddSwitch(idx,trk1,trk2,trk3,merge){
        this.switchgroups[idx].addSwitch(
            this.tracks[trk1],
            this.tracks[trk2],
            this.tracks[trk3],
            merge)
    }

    AddCoin(idx,type){
        if(type == "train"){
            this.basket.addCoin(this.trains[idx],imgs["train"])
        } else {
            this.basket.addCoin(this.switchgroups[idx],imgs["coin"])
        }
    }

    draw(){
        this.basket.draw()

        this.stations.forEach(s=>s.draw());
        this.tracks.forEach(t => {
           t.draw() 
        });

        this.switchgroups.forEach(sg=>sg.draw())
        this.trains.forEach(t=>t.draw())
        this.basket.drawCoins();
    }

    weldTracks(trk1,trk2){
        trk1.SetLastTrack(trk2)
        trk2.SetFirstTrack(trk1)
    }

    weldAllTracks(){
        this.tracks.forEach(t1=>{
            if(!t1.GetFirstTrack() || !t1.GetLastTrack()){
                this.tracks.forEach(t2=>{
                    if(t2.points[0].dist(t1.GetLastPoint())<spacing){
                        this.weldTracks(t1,t2)
                    }
                    if(t1.points[0].dist(t2.GetLastPoint())<spacing){
                        this.weldTracks(t2,t1)
                    }
                })
            }
        })
    }
}