function Grid(cells, neighbourhoodWatch) {
    function update(){
        notifyNeighbours(cells);
        return getReturnSeed(cells);
    }

    function getReturnSeed() {
        var returnSeed = new Array();
        
        cells.forEach(function(cell, index) { 
            cell.draw(index);           
            returnSeed.push(cell.checkRule());                        
        });

        return returnSeed;
    }

    function notifyNeighbours() {
        cells.forEach(function(cell, index) {
            cell.notifyNeighbours(neighbourhoodWatch.getNeighbours(cells, index));            
       });
    }

    return {
        update : update,
        getReturnSeed : getReturnSeed,
        notifyNeighbours : notifyNeighbours
    };
}

function DeadCell(cellFactory, rule, drawService) {
    var neighbourCount = 0;

    function checkRule() {        
        if(rule.isAlive(neighbourCount)) {
            return cellFactory.createLiveCell();
        }   
        else {
            return cellFactory.createDeadCell();
        }
    }

    function notify() {       
        neighbourCount++;
    }

    // don't notify neighbours, I'm dead
    // dead code??
    function notifyNeighbours(neighbours) { }    

    function draw(index) {         
        drawService.draw(false, index);
    } 

    return {
        checkRule : checkRule,
        notify : notify,
        notifyNeighbours : notifyNeighbours,
        draw : draw
    };  
}

function LiveCell(cellFactory, rule, drawService) {
    var neighbourCount = 0;

    this.checkRule = function() {
        if (rule.isAlive(neighbourCount)) {
            return cellFactory.createLiveCell();
        }
        else {            
            return cellFactory.createDeadCell();
        }        
    }

    this.notify = function() {        
        neighbourCount++;
    }

    this.notifyNeighbours = function(neighbours) {
        neighbours.forEach(function(neighbour){
            neighbour.notify();
        });
    }

    this.draw = function(index) {        
        drawService.draw(true, index);
    }
}

function LiveCellRule() {
    this.isAlive = function(noNeighbours) {         
        return noNeighbours > 1 && noNeighbours < 4;
    }
}

function DeadCellRule() {
    this.isAlive = function(noNeighbours) {        
        return noNeighbours == 3;
    }
}

function CellFactory(liveCellRule, deadCellRule, drawService) {
    this.createLiveCell = function() {
        return new LiveCell(this, liveCellRule, drawService);
    }

    this.createDeadCell = function() {
        return new DeadCell(this, deadCellRule, drawService);
    }
}

function NeighbourhoodWatch(gridWidth) {
    this.getNeighbours = function(cells, cellIndex) {
        var neighbours = new Array();

        var startIndex = getStartIndex(cellIndex);
        var endIndex = getEndIndex(cellIndex, cells.length);

        for(var currentIndex = startIndex; currentIndex <= endIndex; currentIndex++) {
                if(isCellWithinBounds(cellIndex, currentIndex)) {
                    neighbours.push(cells[currentIndex]);
                }
        }

        return neighbours;
    }

    var getStartIndex = function(cellIndex) {
        var startIndex = cellIndex - gridWidth - 1;
        
        if(startIndex < 0) {
            startIndex = 0;
        }

        return startIndex;
    }

    var getEndIndex = function(cellIndex, maxIndex) {
        var endIndex = cellIndex + gridWidth + 1;         

        if(endIndex >= maxIndex) {
            endIndex = maxIndex - 1;
        }

        return endIndex;
    }

    var isCellWithinBounds = function(cellIndex, currentIndex) {
        var cellX = cellIndex % gridWidth;
        var cellY = Math.floor(cellIndex / gridWidth);
        var currX = currentIndex % gridWidth;   
        var currY = Math.floor(currentIndex / gridWidth);

        var x = cellX - currX;
        var y = cellY - currY;
        
        return (x >= -1 && x <= 1) && (y >= -1 && y <= 1) && (cellIndex != currentIndex);
    }
}