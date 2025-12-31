class Item{
    constructor(x,y,name,quant,maxQuant){
        this.x = x
        this.y = y
        this.name = name
        this.icon = imgs[name]
        this.quant = quant
        if(maxQuant){
            this.maxQuant = maxQuant
        } else {
            this.maxQuant = 5
        }
    }
    draw(){
         for(let i = 0; i < this.quant; i++){
                image(imgs[this.name],this.x-5*i,this.y)
            }
    }
}