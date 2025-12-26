class Item{
    constructor(x,y,name,quant,req){
        this.x = x
        this.y = y
        this.name = name
        this.icon = imgs[name]
        this.quant = quant
        this.req = req;
    }

    draw(){
        image(this.icon,this.x,this.y)
        if(this.req){
            text(this.quant +"/"+this.req,this.x+10,this.y+10)
        } else {
            text(this.quant,this.x+10,this.y+10)
        }
    }
}