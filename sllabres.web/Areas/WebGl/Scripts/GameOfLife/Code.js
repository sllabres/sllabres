function Grid(cells, gridWidth) {
    this.update = function(){         
        notifyNeighbours(cells);
        return getReturnSeed(cells);
    }

    var getReturnSeed = function(cells) {
        var returnSeed = new Array();
        cells.forEach(function(cell) {            
            returnSeed.push(cell.checkRule());
        });

        return returnSeed;
    }

    var notifyNeighbours = function(cells) {
        cells.forEach(function(cell, index) {
            cell.notifyNeighbours(getNeighbours(cells, index));
       });
    }

    // this code is fucking shit
    var getNeighbours = function(cells, cellIndex) {
        var gridSize = (gridWidth * gridWidth);
        var neighbours = new Array();

        var startIndex = getStartIndex(cellIndex);

        for(var i = startIndex; i < (startIndex + 9); i++) {
            if(isNeighbour(cells, i, cellIndex)) {
                neighbours.push(cells[i]);
            }
        }

        return neighbours;
    }

    var isNeighbour = function(cells, currentIndex, cellIndex) {
        return cells[currentIndex] != null && currentIndex != cellIndex;
    }

    var getStartIndex = function(cellIndex) {
        var startIndex = (cellIndex % gridWidth) >= 1 ? gridWidth + 1 : gridWidth;
        startIndex = (cellIndex - startIndex);
        return startIndex;
    }
}

function DeadCell(cellFactory, rule, drawService) {
    var neighbourCount = 0;

    this.checkRule = function() {        
        if(rule.isAlive(neighbourCount)) {
            console.log("dead cell live cell created: " + neighbourCount);
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