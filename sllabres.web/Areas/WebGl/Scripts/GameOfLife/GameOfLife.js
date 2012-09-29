test("Live cell with fewer than two neighbours dies", function() {
    liveCellRule = new LiveCellRule();
    equal(liveCellRule.IsAlive(1), false);
});

function LiveCellRule() {
    this.IsAlive = function(neighbours) {
        return false;
    }
}