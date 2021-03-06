function Grid(seed, neighbourhoodWatch) {
    cells = seed;

    function update(){
        notifyNeighbours(cells);
        checkRules();
    }

    function checkRules() {
        var newCells = new Array();
        cells.forEach(function(cell, index) { 
            cell.draw(index);           
            newCells.push(cell.checkRule());
        });

        cells = newCells;
    }

    function notifyNeighbours() {
        cells.forEach(function(cell, index) {
            cell.notifyNeighbours(neighbourhoodWatch.getNeighbours(cells, index));            
       });
    }

    function draw() {
        cells.forEach(function(cell, index) { 
            cell.draw(index);
        });
    }

    return {
        update : update,
        notifyNeighbours : notifyNeighbours,
        draw : draw
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

    function checkRule() {
        if (rule.isAlive(neighbourCount)) {
            return cellFactory.createLiveCell();
        }
        else {            
            return cellFactory.createDeadCell();
        }        
    }

    function notify() {        
        neighbourCount++;
    }

    function notifyNeighbours(neighbours) {
        neighbours.forEach(function(neighbour){
            neighbour.notify();
        });
    }

    function draw(index) {        
        drawService.draw(true, index);
    }

    return {
        checkRule : checkRule,
        notify : notify,
        notifyNeighbours : notifyNeighbours,
        draw : draw
    };
}

function LiveCellRule() {
    function isAlive(noNeighbours) {         
        return noNeighbours > 1 && noNeighbours < 4;
    }

    return {
        isAlive : isAlive
    };
}

function DeadCellRule() {
    function isAlive(noNeighbours) {        
        return noNeighbours == 3;
    }

    return {
        isAlive : isAlive
    };
}

function CellFactory(liveCellRule, deadCellRule, drawService) {
    function createLiveCell() {
        return new LiveCell(this, liveCellRule, drawService);
    }

    function createDeadCell() {
        return new DeadCell(this, deadCellRule, drawService);
    }

    return {
        createLiveCell : createLiveCell,
        createDeadCell : createDeadCell
    };
}

function NeighbourhoodWatch(gridWidth) {
    function getNeighbours(cells, cellIndex) {
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

    function getStartIndex(cellIndex) {
        var startIndex = cellIndex - gridWidth - 1;
        
        if(startIndex < 0) {
            startIndex = 0;
        }

        return startIndex;
    }

    function getEndIndex(cellIndex, maxIndex) {
        var endIndex = cellIndex + gridWidth + 1;         

        if(endIndex >= maxIndex) {
            endIndex = maxIndex - 1;
        }

        return endIndex;
    }

    function isCellWithinBounds(cellIndex, currentIndex) {
        var cellX = cellIndex % gridWidth;
        var cellY = Math.floor(cellIndex / gridWidth);
        var currX = currentIndex % gridWidth;   
        var currY = Math.floor(currentIndex / gridWidth);

        var x = cellX - currX;
        var y = cellY - currY;
        
        return (x >= -1 && x <= 1) && (y >= -1 && y <= 1) && (cellIndex != currentIndex);
    }

    return {
        getNeighbours : getNeighbours
    };
}