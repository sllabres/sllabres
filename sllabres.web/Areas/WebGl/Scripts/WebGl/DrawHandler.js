function DrawHandler(drawService) {
    this.drawService = drawService;
    this.drawCollection = new Array();

    this.addToQueue = function(drawData) {
        this.drawCollection.push(drawData);
    }

    this.draw = function (){
        while(drawItem=this.drawCollection.shift()){
            this.drawService.draw(drawItem);            
        }
    }
};