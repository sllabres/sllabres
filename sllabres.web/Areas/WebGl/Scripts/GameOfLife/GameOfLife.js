test("Live cell with fewer than two neighbours dies", function() {
    liveCellRule = new LiveCellRule();
    equal(liveCellRule.isAlive(1), false);
});

test("Live cell with two neighbours lives", function() {
    liveCellRule = new LiveCellRule();
    equal(liveCellRule.isAlive(2), true);
});

test("Live cell with three neighbours lives", function() {
    liveCellRule = new LiveCellRule();
    equal(liveCellRule.isAlive(3), true);
});

test("Live cell with more than three neighbours dies", function() {
    liveCellRule = new LiveCellRule();
    equal(liveCellRule.isAlive(4), false);
});

test("Dead cell with three neighbours lives", function() {
    deadCellRule = new DeadCellRule();
    equal(deadCellRule.isAlive(3), true);
});

test("Dead cell with two neighbours stays dead", function() {
    deadCellRule = new DeadCellRule();
    equal(deadCellRule.isAlive(2), false);
});

test("Live cell notifies neighbours", function() {
    this.notify = function() {        
        notified = true;
    }

    var cell = new LiveCell(this);
    this.notified = false;
    equal(notified, true);
});

function LiveCell(neighbours) {    
    neighbours.notify();
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