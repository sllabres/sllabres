describe("DrawHandler", function() {
    it("calls drawService with fakeDrawData", function() {
        var fakeDrawService = {};   
        var fakeDrawData = "fakeDrawData";
        fakeDrawService.draw = jasmine.createSpy("draw");
        var drawHandler = new DrawHandler(fakeDrawService);
        drawHandler.addToQueue(fakeDrawData);
        drawHandler.draw();
        expect(fakeDrawService.draw).toHaveBeenCalledWith(fakeDrawData);
    });

    it("calls drawService when multiple draw data items are set", function() {
        var fakeDrawService = {};   
        var fakeDrawDataOne = "fakeDrawDataOne";
        var fakeDrawDataTwo = "fakeDrawDataTwo";
        fakeDrawService.draw = jasmine.createSpy("draw");
        var drawHandler = new DrawHandler(fakeDrawService);
        drawHandler.addToQueue(fakeDrawDataOne);
        drawHandler.addToQueue(fakeDrawDataTwo);
        drawHandler.draw();
        expect(fakeDrawService.draw).toHaveBeenCalledWith(fakeDrawDataOne);
        expect(fakeDrawService.draw).toHaveBeenCalledWith(fakeDrawDataTwo);
    });
});