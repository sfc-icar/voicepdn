class motion{
    constructor( name, flame, play_flag){
        this.name = name;
        this.flame = flame;
        this.play_flag = play_flag;
    }
    play_motion(){
        document.getElementById(this.name).play;
        document.getElementById(this.flame).style.display = "block"
        this.play_flag = true; 
    }
    hide_motion(){
        document.getElementById(this.flame).style.display = "none"
    }
}
class chieri{
    constructor()
}
