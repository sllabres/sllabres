function Grid(cells, neighbourhoodWatch) {
    this.update = function(){         
        notifyNeighbours(cells);
        return getReturnSeed(cells);
    }

    var getReturnSeed = function(cells) {
        var returnSeed = new Array();
        
        cells.forEach(function(cell, index) { 
            cell.draw(index);           
            returnSeed.push(cell.checkRule());                        
        });

        return returnSeed;
    }

    var notifyNeighbours = function(cells) {
        cells.forEach(function(cell, index) {
            cell.notifyNeighbours(neighbourhoodWatch.getNeighbours(cells, index));            
       });
    }
}

function DeadCell(cellFactory, rule, drawService) {
    var neighbourCount = 0;

    this.checkRule = function() {        
        if(rule.isAlive(neighbourCount)) {
            return cellFactory.createLiveCell();
        }   
        else {
            return cellFactory.createDeadCell();
        }
    }

    this.notify = function() {       
        neighbourCount++;
    }

    // don't notify neighbours, I'm dead
    // dead code??
    this.notifyNeighbours = function(neighbours) { }    

    this.draw = function(index) {         
        drawService.draw(false, index);
    }      
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

function NeighbourhoodWatch(gridWidth, boundsChecker) {
    this.getNeighbours = function(cells, cellIndex) {
        var neighbours = new Array();        

        var startIndex = cellIndex - gridWidth - 1;
        var endIndex = cellIndex + gridWidth + 1;

        for(var currentIndex = startIndex; currentIndex <= endIndex; currentIndex++) {
                if(currentIndex != cellIndex && cells[currentIndex] != null && isCellWithinBounds(cellIndex, currentIndex)) {
                    neighbours.push(cells[currentIndex]);
                }
        }

        return neighbours;
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