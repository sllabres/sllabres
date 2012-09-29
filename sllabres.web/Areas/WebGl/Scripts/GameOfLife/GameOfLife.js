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
    this.isAlive = function() {
        return this.returnValue;
    }
}

module("Live Cell");
var cellFactoryFake = new CellFactoryFake();
var ruleFake = new RuleFake();
var liveCell = new LiveCell(cellFactoryFake, ruleFake);

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
});

test("Live cell creates dead cell when cell rule returns false", function() {
    ruleFake.returnValue = false;
    cellFactoryFake.cellCreated = false;
    liveCell.update(new Array());
    equal(cellFactoryFake.cellCreated, true);
});

test("Live cell does not create dead when cell rule returns true", function() {
    ruleFake.returnValue = true;
    cellFactoryFake.cellCreated = false;
    liveCell.update(new Array());
    equal(cellFactoryFake.cellCreated, false);
});

module("Dead Cell");
var deadCell = new DeadCell(cellFactoryFake, ruleFake);
test("Dead cell creates live cell when rule returns true", function() {   
    ruleFake.returnValue = true;     
    cellFactoryFake.cellCreated = false;
    deadCell.update(new Array());
    equal(cellFactoryFake.cellCreated, true);
});

test("Dead cell does not create live cell when rule returns false", function() {
    ruleFake.returnValue = false;
    cellFactoryFake.cellCreated = false;
    deadCell.update(new Array());
    equal(cellFactoryFake.cellCreated, false);
});


function DeadCell(cellFactoryFake, ruleFake) {
    this.update = function() {
        if(ruleFake.isAlive()) {
            cellFactoryFake.createCell();
        }   
    }
}

function LiveCell(deadCellFactory, rule) {
    this.update = function(neighbours) {
        notifyNeighbours(neighbours);

        if (!rule.isAlive()) {
            deadCellFactory.createCell();
        }
    }

    var notifyNeighbours = function(neighbours) {
        for (var i = 0; i < neighbours.length; i++) {
            neighbours[i].notify();
        }
    }
}

function LiveCellRule() {
    this.isAlive = function(neighbours) {
        return neighbours > 1 && neighbours < 4;
    }
}

function DeadCellRule() {
    this.isAlive = function(neighbours) {
        return neighbours === 3;
    }
}