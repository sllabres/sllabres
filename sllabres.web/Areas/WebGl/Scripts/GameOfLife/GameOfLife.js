function NeighbourFake() {    
    this.notifyCount = 0;
    this.notify = function() {        
        this.notifyCount++;
    }
}

function CellFactoryFake() {
    this.deadCellToReturn;
    this.liveCellToReturn;   

    this.createDeadCell = function() {
        return this.deadCellToReturn;
    }

    this.createLiveCell = function() {
        return this.liveCellToReturn;
    }
}

function RuleFake() {    
    this.returnValue = true;
    this.neighbourCount = 0;
    this.isAlive = function(neighboursCount) {
        this.neighbourCount = neighboursCount;
        return this.returnValue;
    }
}

function FakeCell() {    
    this.updateCount = 0;   
    this.neighbourCount = 0;   
    this.ruleCheck = false; 
    this.returnCell;

    this.notifyNeighbours = function(neighbours) {        
        this.updateCount++;

        if(neighbours != null) {
            this.neighbourCount = neighbours.length;
        }
    }

    this.checkRule = function(neighbours) {
        this.ruleCheck = true;
        return this.returnCell;
    }
}

function DrawServiceFake() {
    this.drawCalled = false;    
    this.cellIndex = 0;
    this.isAliveCell = false;
    this.draw = function(isAliveCell, index) {
        this.cellIndex = index;
        this.isAliveCell = isAliveCell;
        this.drawCalled = true;
    }
}

module("Live Cell Rules");
var liveCellRule = new LiveCellRule();
test("Live cell with fewer than two neighbours dies", function() {    
    equal(liveCellRule.isAlive(1), false);
});

test("Live cell with two neighbours lives", function() {    
    equal(liveCellRule.isAlive(2), true);
});

test("Live cell with three neighbours lives", function() {    
    equal(liveCellRule.isAlive(3), true);
});

test("Live cell with more than three neighbours dies", function() {    
    equal(liveCellRule.isAlive(4), false);
});

module("Dead Cell Rules");
var deadCellRule = new DeadCellRule();
test("Dead cell with three neighbours lives", function() {    
    equal(deadCellRule.isAlive(3), true);
});

test("Dead cell with two neighbours stays dead", function() {    
    equal(deadCellRule.isAlive(2), false);
});


module("Live Cell");
var cellFactoryFake = new CellFactoryFake();
var ruleFake = new RuleFake();
var drawServiceFake = new DrawServiceFake();
var liveCell = new LiveCell(cellFactoryFake, ruleFake, drawServiceFake);


test("Live cell notifies one neighbour", function() {
    this.neighbourCount = 0;
    var neighbourFake = new NeighbourFake();
    var neighbours = new Array(neighbourFake);    
    liveCell.notifyNeighbours(neighbours);
    equal(neighbourFake.notifyCount, 1);
});

test("Live cell notifies two neighours", function() {
    var neighbourFake = new NeighbourFake();
    var neighbours = new Array(neighbourFake, neighbourFake);    
    liveCell.notifyNeighbours(neighbours);    
    equal(neighbourFake.notifyCount, 2);
});

test("When notified twice live cell queries rule with two neighbours", function() {
    liveCell = new LiveCell(cellFactoryFake, ruleFake, drawServiceFake);
    ruleFake.neighbourCount = 0;
    liveCell.notify();
    liveCell.notify();
    liveCell.checkRule();
    equal(ruleFake.neighbourCount, 2);
})

test("When notified once live cell queries rule with one neighbour", function() {
    liveCell = new LiveCell(cellFactoryFake, ruleFake, drawServiceFake);
    ruleFake.neighbourCount = 0;
    liveCell.notify();
    liveCell.checkRule();
    equal(ruleFake.neighbourCount, 1);
});

test("cell returns dead cell when it has one neighbours", function() {   
    var localDeadCell = new FakeCell();
    cellFactoryFake.deadCellToReturn = localDeadCell;
    ruleFake.returnValue = false;
    var returnedCell = liveCell.checkRule();
    strictEqual(returnedCell, localDeadCell);
});

test("Cell returns live cell when it has two neighbours", function() {
    var localLiveCell = new FakeCell();
    cellFactoryFake.liveCellToReturn = localLiveCell;
    ruleFake.returnValue = true;
    var returnedCell = liveCell.checkRule();
    strictEqual(returnedCell, localLiveCell);
});

test("Drawing cell draw calls drawService draw", function() {
    liveCell.draw();
    equal(drawServiceFake.drawCalled, true);
});

test("Drawing cell draw calls drawService draw with index", function() {
    var cellIndex = 1;
    liveCell.draw(cellIndex);
    equal(drawServiceFake.cellIndex, cellIndex);
});

test("Drawing cell draw calls drawService draw with status", function() {
    var aliveCell = true;
    liveCell.draw(0);
    equal(drawServiceFake.isAliveCell, aliveCell);
});

module("Dead Cell");
var deadCell = new DeadCell(cellFactoryFake, ruleFake, drawServiceFake);
test("Dead cell notify queries rule with one neighbour", function() {    
    deadCell = new DeadCell(cellFactoryFake, ruleFake);
    deadCell.notify();
    deadCell.checkRule();    
    equal(ruleFake.neighbourCount, 1);
});

test("Dead cell notify called twice queries rule with two neighbours", function() {    
    deadCell = new DeadCell(cellFactoryFake, ruleFake, drawServiceFake);
    deadCell.notify();
    deadCell.notify();
    deadCell.checkRule();
    equal(ruleFake.neighbourCount, 2);
});

test("Dead cell returns dead cell when it has two neighbours", function() {   
    var localDeadCell = new FakeCell();
    cellFactoryFake.deadCellToReturn = localDeadCell;
    ruleFake.returnValue = false;
    var returnedCell = deadCell.checkRule();
    strictEqual(returnedCell, localDeadCell);
});

test("Dead cell returns live cell when it has three neighbours", function() {
    var localLiveCell = new FakeCell();
    cellFactoryFake.liveCellToReturn = localLiveCell;
    ruleFake.returnValue = true;
    var returnedCell = deadCell.checkRule();
    strictEqual(returnedCell, localLiveCell);
});

test("Drawing dead cell draw calls drawService draw", function() {    
    deadCell.draw();
    equal(drawServiceFake.drawCalled, true);
});


test("Drawing cell draw calls drawService draw with index", function() {    
    var cellIndex = 2;
    deadCell.draw(cellIndex);
    equal(drawServiceFake.cellIndex, cellIndex);
});

test("Drawing cell draw calls drawService draw with status", function() {
    drawServiceFake.isAliveCell = false;
    var aliveCell = false;
    deadCell.draw(0);
    equal(drawServiceFake.isAliveCell, aliveCell);
});

module("Grid");
var fakeCell = new FakeCell();

test("Updating grid updates cell", function() {        
    fakeCell.updateCount = 0;
    var fakeCells = new Array(fakeCell);
    var grid = new Grid(fakeCells);
    grid.update();
    equal(fakeCell.updateCount, 1)
});

test("Updating grid updates multiple cells", function() {    
    fakeCell.updateCount = 0;    
    var fakeCells = new Array(fakeCell, fakeCell);
    var grid = new Grid(fakeCells);
    grid.update();
    equal(fakeCell.updateCount, 2);
});

test("Updating grid updates one cell with one neighbour", function() {
    fakeCell.updateCount = 0;
    var fakeCells = new Array(fakeCell);
    var grid = new Grid(fakeCells);
    grid.update();
    equal(fakeCell.updateCount, 1);
});

test("Updating grid updates cell with two neighbours", function() {    
    fakeCell.updateCount = 0;
    var fakeCells = new Array(fakeCell, fakeCell);
    var grid = new Grid(fakeCells);
    grid.update();
    equal(fakeCell.updateCount, 2);
});

// Missing class? Neighbour finder?
// Grid is perhaps doing too much
test("Cell has update called with no neighbours", function() {
    fakeCell.updateCount = 0;
    fakeCell.neighbourCount = 0;
    var fakeCells = new Array(fakeCell);
    var grid = new Grid(fakeCells);
    grid.update();
    equal(fakeCell.neighbourCount, 0);
});

// x x
// x x

test("CellA has update called with one neighbour", function() {   
    var fakeCellA = new FakeCell(), fakeCellB = new FakeCell();
    var fakeCells = new Array(fakeCellA, fakeCellB);
    var gridWidth = 2;
    var grid = new Grid(fakeCells, gridWidth);
    grid.update();
    equal(fakeCellA.neighbourCount, 1);    
});

// x x x
test("CellB has updated called with two neighbours", function() {
    var fakeCellA = new FakeCell(), fakeCellB = new FakeCell();
    var fakeCells = new Array(fakeCellA, fakeCellB, fakeCellA);
    var gridWidth = 3;
    var grid = new Grid(fakeCells, gridWidth);
    grid.update();
    equal(fakeCellB.neighbourCount, 2); 
});

// x x x
// x x x
// x x x
test("CellB has 8 neighbours", function() {
    var fakeCellA = new FakeCell(), fakeCellB = new FakeCell();

    var fakeCells = new Array(fakeCellA, fakeCellA, fakeCellA, 
                              fakeCellA, fakeCellB, fakeCellA, 
                              fakeCellA, fakeCellA, fakeCellA);

    var gridWidth = 3;
    
    var grid = new Grid(fakeCells, gridWidth);

    grid.update();
    equal(fakeCellB.neighbourCount, 8);
});

test("Checks rule for cell", function() {
    var fakeCell = new FakeCell();
    var fakeCells = new Array(fakeCell);
    var gridWidth = 1;    
    var grid = new Grid(fakeCells, gridWidth);
    grid.update();
    equal(fakeCell.ruleCheck, true);
});

test("Grid update returns new cell seed", function() {
    fakeCell = new FakeCell();
    var testCell = new FakeCell();
    fakeCell.returnCell = testCell;
    var gridWidth = 1;
    var grid = new Grid(new Array(fakeCell), gridWidth);

    var returnSeed = grid.update();

    strictEqual(returnSeed[0], testCell);
});

test("Grid update returns two cells in seed", function() {
    fakeCell = new FakeCell();
    var testCell = new FakeCell();
    fakeCell.returnCell = testCell;

    var gridWidth = 1;
    var grid = new Grid(new Array(fakeCell, fakeCell), gridWidth);

    equal(grid.update().length, 2)
});

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

    var getNeighbours = function(cells, cellIndex) {
        var gridSize = (gridWidth * gridWidth);
        var neighbours = new Array();

        var startIndex = getStartIndex(cellIndex);

        for(var i = startIndex; i < gridSize; i++) {
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

function DeadCell(cellFactory, ruleFake, drawService) {
    var neighbourCount = 0;

    this.checkRule = function() {        
        if(ruleFake.isAlive(neighbourCount)) {            
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
        return noNeighbours === 3;
    }
}

function CellFactory(liveCellRule, deadCellRule) {
    this.createLiveCell = function() {
        return new LiveCell(this, liveCellRule);
    }

    this.createDeadCell = function() {
        return new DeadCell(this, deadCellRule);
    }
}