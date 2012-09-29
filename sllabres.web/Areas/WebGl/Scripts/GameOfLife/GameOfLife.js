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
    this.isAlive = function(neighbours) {
        return this.returnValue;
    }
}

module("Live Cell");
var cellFactoryFake = new CellFactoryFake();
var ruleFake = new RuleFake();
var liveCell = new LiveCell(cellFactoryFake, ruleFake);

/*
test("Live cell notifies neighbour", function() {
    var neighbourFake = new NeighbourFake();
    var neighbours = new Array(neighbourFake);    
    liveCell.update(neighbours);
    equal(neighbourFake.notifyCount, 1);
});

test("Live cell notifies two neighours", function() {
    var neighbourFake = new NeighbourFake();
    var neighbours = new Array(neighbourFake, neighbourFake);
    liveCell.update(neighbours);
    equal(neighbourFake.notifyCount, 2);
});*/

test("Live cell creates dead cell when cell rule returns false", function() {
    ruleFake.returnValue = false;
    cellFactoryFake.cellCreated = false;
    liveCell.update(new Array());
    equal(cellFactoryFake.cellCreated, true);
});

module("Dead Cell");
var deadCell = new DeadCell(cellFactoryFake, ruleFake);
test("Dead cell creates live cell when rule returns true", function() {   
    ruleFake.returnValue = true;     
    cellFactoryFake.cellCreated = false;
    deadCell.update(new Array());
    equal(cellFactoryFake.cellCreated, true);
});

module("Grid");
var fakeCell = new FakeCell();

function FakeCell() {    
    this.updateCount = 0; 
    this.noNeighbours = 0;   

    this.update = function(neighbours) {        
        this.updateCount++;
        this.noNeighbours = neighbours.length;
    }
}

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
    fakeCell.noNeighbours = 0;
    var fakeCells = new Array(fakeCell);
    var grid = new Grid(fakeCells);
    grid.update();
    equal(fakeCell.noNeighbours, 1);
})

test("Updating grid updates cell with two neighbours", function() {
    fakeCell.noNeighbours = 0;
    var fakeCells = new Array(fakeCell, fakeCell);
    var grid = new Grid(fakeCells);
    grid.update();
    equal(fakeCell.noNeighbours, 2);
})

function Grid(cells) {
    this.update = function(){  
            for (var i = 0; i < cells.length; i++) {
                cells[i].update(cells);
            }
    }
}

function DeadCell(cellFactoryFake, ruleFake) {
    this.update = function(neighbours) {
        if(ruleFake.isAlive(neighbours.length)) {
            cellFactoryFake.createCell();
        }   
    }
}

function LiveCell(cellFactory, rule) {
    this.update = function(neighbours) {
        //notifyNeighbours(neighbours);

        if (!rule.isAlive(neighbours.length)) {
            cellFactory.createCell();
        }
    }

    /*var notifyNeighbours = function(neighbours) {
        for (var i = 0; i < neighbours.length; i++) {
            neighbours[i].notify();
        }
    }*/
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