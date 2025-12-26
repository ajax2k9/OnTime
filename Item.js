class Item{
    constructor(x,y,name,quant){
        this.x = x
        this.y = y
        this.name = name
        this.icon = imgs[name]
        this.quant = quant
    }

    draw(){
        textAlign(LEFT)
        image(this.icon,this.x,this.y)
        text(this.quant,this.x+5,this.y+10)
    }
}