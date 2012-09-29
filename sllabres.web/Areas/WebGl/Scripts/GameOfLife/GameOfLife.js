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

function DeadCellFactoryFake() {
    this.cellCreated = false;
    this.createDeadCell = function() {
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
var deadCellFactoryFake = new DeadCellFactoryFake();
var ruleFake = new RuleFake();
var liveCell = new LiveCell(deadCellFactoryFake, ruleFake);

test("Live cell notifies neighbour", function() {
    var neighbourFake = new NeighbourFake();
    neighbours = new Array(neighbourFake);    
    liveCell.update(neighbours);
    equal(neighbourFake.notifyCount, 1);
});

test("Live cell notifies two neighours", function() {
    var neighbourFake = new NeighbourFake();
    neighbours = new Array(neighbourFake, neighbourFake);
    liveCell.update(neighbours);
    equal(neighbourFake.notifyCount, 2);
});

test("Live cell creates dead cell when cell rule returns false", function() {
    ruleFake.returnValue = false;
    deadCellFactoryFake.cellCreated = false;
    liveCell.update(new Array());
    equal(deadCellFactoryFake.cellCreated, true);
});

test("Live cell does not create dead when cell rule returns true", function() {
    ruleFake.returnValue = true;
    deadCellFactoryFake.cellCreated = false;
    liveCell.update(new Array());
    equal(deadCellFactoryFake.cellCreated, false);
});

module("Dead Cell");
test("Dead cell creates live cell when it has 3 neighbours", function() {
    equal(liveCellFactoryFake.cellCreated, true);
});

function LiveCell(deadCellFactory, rule) {
    this.update = function(neighbours) {
        notifyNeighbours(neighbours);

        if (!rule.isAlive()) {
            deadCellFactory.createDeadCell();
        }
    }

    var notifyNeighbours = function(neighbours) {
        for (i = 0; i < neighbours.length; i++) {
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