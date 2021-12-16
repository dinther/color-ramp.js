class ColorStop{
    #position = 0;
    #color = '#fff';
    #onChange = null;
    constructor(onChange, position=0, color='#fff'){
        if (typeof(onChange)!='function') throw new Error('Value for onChange must be a function')
        this.#onChange = onChange;
        if (typeof(position)!='number') throw new Error('Value for position must be a number between 0 and 1')
        let p = Math.max(0,Math.min(1,position));
        this.#position = position;
        if (typeof(color)!='string') throw new Error('Value for color must be a color in CSS format');
        this.#color = color;
    }

    #handleonChange(){
        if (this.#onChange != null) this.#onChange(this);
    }

    get position(){
        return this.#position;
    }

    set position(value){
        if (typeof(value)!='number') throw new Error('Value for position must be a number between 0 and 1')
        let v = Math.max(0,Math.min(1,value));
        if (v != this.#position){
            this.#position = v;
            this.#handleonChange();
        }
    }

    get color(){
        return this.#color;
    }

    set color(value){
        if (typeof(value)!='string') throw new Error('Value for color must be a color in CSS format');
        if (value != this.#color){
            this.#color = value;
            this.#handleonChange();
        }
    }
}

class ColorRamp {
    #can;
    #numColors = 100;
    #repeat = 1;
    #ctx;
    #colorList;
    #colorStops;
    #onChange = null;
    constructor(onChange = null){
        if (typeof(onChange)!='function' && onChange!= null) throw new Error('Value for onChange must be a function')
        this.#onChange = onChange;
        this.#can = document.createElement('canvas');
        this.#can.width = this.#numColors;
        this.#can.height = 1;
        this.#ctx = this.#can.getContext('2d');
        this.#colorStops = [];
        this.#colorList = [];
    }

    #updateColorList(){
        this.#colorStops.sort((a,b)=>a.position - b.position);
        let grad = this.#ctx.createLinearGradient(0,0,this.#numColors,1);
        for (let i=0; i< this.#colorStops.length; i++){
            grad.addColorStop(this.#colorStops[i].position, this.#colorStops[i].color);    
        }
        this.#ctx.fillStyle = grad;
        this.#ctx.fillRect(0,0,this.#numColors,1)
        this.#colorList = this.#ctx.getImageData(0,0,this.#numColors,1).data;
        this.#handleonChange();
    }

    #handleonChange(){
        if (this.#onChange != null) this.#onChange(this);
    }

    addColorStop(position=0, color='#fff'){
        let colorStop = new ColorStop(()=>{
            this.#updateColorList();
        }, position, color);
        this.#colorStops.push(colorStop);
        this.#updateColorList();
        return colorStop;
    }

    delColorStop(index){
        if (index < this.#colorStops.length)
        this.#colorStops.splice(index);
        this.#updateColorList();
    }

    getColor(pos){
        let p = (Math.floor(pos * (this.#numColors - 1) * this.#repeat)%this.#numColors)*4;
        if (p < this.#colorList.length - 3){
            return [this.#colorList[p], this.#colorList[p + 1],this.#colorList[p + 2]];
        } else {
            return [0, 0, 0];
        }
    }

    getCSSColor(pos){
        let color = this.getColor(pos);
        return 'rgb('+color[0]+','+color[1]+','+color[2]+')';
    }

    asCSSGradient(){
        let css = 'linear-gradient(90deg, ';
        for (let r = 0; r< this.#repeat; r++){
            for(let i=0; i<this.#colorStops.length; i++){
                let colorStop = this.#colorStops[i];
                css += colorStop.color + ' ' + ((colorStop.position / this.#repeat) + (r/3)) * 100 + '%, ';
            }
        }
        css = css.replace(/,\s*$/, "") + ')';
        return css;   
    }    

    get canvas(){
        return this.#can;
    }

    get colorStops(){
        return this.#colorStops;
    }

    get colorList(){
        return this.#colorList;
    }

    get repeat(){
        return this.#repeat;
    }

    set repeat(value){
        this.#repeat = value;
        this.#handleonChange();
    }
}