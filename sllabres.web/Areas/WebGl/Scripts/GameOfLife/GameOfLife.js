function NeighbourFake() {    
    this.notifyCount = 0;
    this.notify = function() {        
        this.notifyCount++;
    }
}

function CellFactoryFake() {
    this.cellCreated = false;
    this.createCell = function() {
        this.cellCreated = true;
    }
}

function RuleFake() {    
    this.returnValue = true;
    this.neighbourCount = 0;
    this.isAlive = function(neighbours) {
        this.neighbourCount = neighbours;
        return this.returnValue;
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
var liveCell = new LiveCell(cellFactoryFake, ruleFake);


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

test("Live cell creates dead cell when cell rule returns false", function() {    
    ruleFake.returnValue = false;
    cellFactoryFake.cellCreated = false;
    liveCell.checkRule();
    equal(cellFactoryFake.cellCreated, true);
});

test("When notified twice live cell queries rule with two neighbours", function() {
    liveCell = new LiveCell(cellFactoryFake, ruleFake);
    ruleFake.neighbourCount = 0;
    liveCell.notify();
    liveCell.notify();
    liveCell.checkRule();
    equal(ruleFake.neighbourCount, 2);
})

test("When notified once live cell queries rule with one neighbour", function() {
    liveCell = new LiveCell(cellFactoryFake, ruleFake);
    ruleFake.neighbourCount = 0;
    liveCell.notify();
    liveCell.checkRule();
    equal(ruleFake.neighbourCount, 1);
});

module("Dead Cell");
var deadCell = new DeadCell(cellFactoryFake, ruleFake);
test("Dead cell creates live cell when rule returns true", function() {   
    ruleFake.returnValue = true;     
    cellFactoryFake.cellCreated = false;
    deadCell.checkRule();
    equal(cellFactoryFake.cellCreated, true);
});

test("Dead cell notify queries rule with one neighbour", function() {    
    deadCell = new DeadCell(cellFactoryFake, ruleFake);
    deadCell.notify();
    deadCell.checkRule();    
    equal(ruleFake.neighbourCount, 1);
});

test("Dead cell notify called twice queries rule with two neighbours", function() {    
    deadCell = new DeadCell(cellFactoryFake, ruleFake);
    deadCell.notify();
    deadCell.notify();
    deadCell.checkRule();    
    equal(ruleFake.neighbourCount, 2);
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

function FakeCell() {    
    this.updateCount = 0;   
    this.neighbourCount = 0;

    this.notifyNeighbours = function(neighbours) {        
        this.updateCount++;

        if(neighbours != null) {
            this.neighbourCount = neighbours.length;
        }
    }
}

function Grid(cells, gridWidth) {
    var gridSize = (gridWidth * gridWidth);
    this.update = function(){ 
        cells.forEach(function(cell, index) {
            cell.notifyNeighbours(getNeighbours(cells, index));
        });
    }

    var getNeighbours = function(cells, rowIndex) {
        var neighbours = new Array();

        var startIndex = (rowIndex % gridWidth) >= 1 ? gridWidth + 1 : gridWidth;
        startIndex = (rowIndex - startIndex);

        for(var i = startIndex; i < gridSize; i++) {
            if(cells[i] != null && i != rowIndex) {
                neighbours.push(cells[i]);
            }
        }

        return neighbours;
    }
}

function DeadCell(cellFactoryFake, ruleFake) {
    var neighbourCount = 0;

    this.checkRule = function() {
        if(ruleFake.isAlive(neighbourCount)) {
            cellFactoryFake.createCell();
        }   
    }

    this.notify = function() {
        neighbourCount++;
    }

    this.notifyNeighbours = function(neighbours) {
        // don't notify neighbours, I'm dead
    }   
}

function LiveCell(cellFactory, rule) {
    var neighbourCount = 0;

    this.checkRule = function() {
        if (!rule.isAlive(neighbourCount)) {
            cellFactory.createCell();
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