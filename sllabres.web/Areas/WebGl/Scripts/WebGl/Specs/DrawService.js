describe("DrawService", function() {
    var fakeGl;
    var drawService;
    var fakeDrawData;
    var fakeShaderService;        
    var fakeMat4;
    var fakeMatrix;

    beforeEach(function() {
        fakeGl = {};
        fakeDrawData = {};
        fakeDrawData.vertexPositionBuffer = "vertexPositionBuffer";        
        fakeShaderService = {};
        fakeShaderService.vertexPositionAttribute = "vertexPositionAttribute";                
        fakeGl.ARRAY_BUFFER = "ARRAY_BUFFER";
        fakeMat4 = {};
        fakeMatrix = "fakeMatrix";
        fakeDrawData.itemSize = 3;

        fakeMat4.perspective = jasmine.createSpy("perspective");
        fakeMat4.identity = jasmine.createSpy("identity");
        fakeMat4.translate = jasmine.createSpy("translate");
        fakeMat4.set = jasmine.createSpy("set");
        fakeMat4.rotate = jasmine.createSpy("rotate");
        fakeMat4.create = jasmine.createSpy("create").andReturn(fakeMatrix);
        fakeGl.uniformMatrix4fv = jasmine.createSpy("uniformMatrix4fv");
        fakeGl.drawArrays = jasmine.createSpy("drawArrays");        
        fakeGl.clear = jasmine.createSpy("clear");
        fakeGl.viewport = jasmine.createSpy("viewport");
        fakeGl.enable = jasmine.createSpy("enable");
        fakeGl.clearColor = jasmine.createSpy("clearColor");
        fakeGl.bindBuffer = jasmine.createSpy("bindBuffer");
        fakeGl.vertexAttribPointer = jasmine.createSpy("vertexAttribPointer");
        drawService = new DrawService(fakeGl, fakeShaderService, fakeMat4);
    });

    describe("Drawing", function() {        
        it("draws when draw data is passed", function() {                
            fakeDrawData.mode = 4;
            fakeDrawData.count = 3;        
            drawService.draw(fakeDrawData);;
            expect(fakeGl.drawArrays).toHaveBeenCalledWith(fakeDrawData.mode, 0, fakeDrawData.count);
        });

        it("sets projection matrix uniform", function() {        
            fakeShaderService.projectionMatrixUniform = "pMatrix";
            drawService.draw(fakeDrawData);
            expect(fakeGl.uniformMatrix4fv).toHaveBeenCalledWith(fakeShaderService.projectionMatrixUniform, false, fakeMatrix);
        });

        it("sets model view matrix uniform", function() {        
            fakeShaderService.modelViewMatrixUniform = "mvMatrix";
            drawService.draw(fakeDrawData);
            expect(fakeGl.uniformMatrix4fv).toHaveBeenCalledWith(fakeShaderService.modelViewMatrixUniform, false, fakeMatrix);
        });

        it("calls gl clear with '1' ", function() {
            fakeGl.COLOR_BUFFER_BIT = 1;
            fakeGl.DEPTH_BUFFER_BIT = 1;
            drawService.setView();
            expect(fakeGl.clear).toHaveBeenCalledWith(1);
        });

        it("sets viewport with height and width of 500", function() {
            drawService.setView();
            expect(fakeGl.viewport).toHaveBeenCalledWith(0, 0, 500, 500);
        });

        it("applies perspective to projection matrix", function() {
            drawService.setView();
            expect(fakeMat4.perspective).toHaveBeenCalledWith(45, 1, 0.1, 100.0, fakeMatrix);
        });

        it("sets model view identity", function() {
            drawService.draw(fakeDrawData);
            expect(fakeMat4.identity).toHaveBeenCalledWith(fakeMatrix);
        });

        it("translates model view matrix", function() {
            fakeDrawData.x = -1.5;
            fakeDrawData.y = 0.0;
            fakeDrawData.z = -7.0;
            drawService.draw(fakeDrawData);
            expect(fakeMat4.translate).toHaveBeenCalledWith(fakeMatrix, [-1.5, 0.0, -7.0]);
        });

        it("translates model view matrix to coordinates -1.0, 1.0, -6.0", function() {
            fakeDrawData.x = -1.0;
            fakeDrawData.y = 1.0;
            fakeDrawData.z = -6.0;
            drawService.draw(fakeDrawData);
            expect(fakeMat4.translate).toHaveBeenCalledWith(fakeMatrix, [fakeDrawData.x, fakeDrawData.y, fakeDrawData.z]);
        });

        it("binds buffer", function() {
            drawService.draw(fakeDrawData);
            expect(fakeGl.bindBuffer).toHaveBeenCalledWith(fakeGl.ARRAY_BUFFER, fakeDrawData.vertexPositionBuffer);
        });

        it("sets vertex attribute pointer", function() {
            drawService.draw(fakeDrawData);
            expect(fakeGl.vertexAttribPointer).toHaveBeenCalledWith(fakeShaderService.vertexPositionAttribute, 3, fakeGl.FLOAT, false, 0, 0);
        });

        it("sets item size as 2 from draw data", function() {
            fakeDrawData.itemSize = 2;
            drawService.draw(fakeDrawData);
            expect(fakeGl.vertexAttribPointer).toHaveBeenCalledWith(fakeShaderService.vertexPositionAttribute, 2, fakeGl.FLOAT, false, 0, 0);
        });

        it("sets model view matrix to new object", function () {
            drawService.draw(fakeDrawData);
            expect(fakeMat4.create).toHaveBeenCalled();
            expect(fakeMat4.set).toHaveBeenCalled();
        });

        it("rolls object 1 radian", function() {
            fakeDrawData.roll = 1;
            drawService.draw(fakeDrawData);
            expect(fakeMat4.rotate).toHaveBeenCalledWith(fakeMatrix, fakeDrawData.roll, [0,1,0]);
        });

        it("rolls object 2 radians", function() {
            fakeDrawData.roll = 2;
            drawService.draw(fakeDrawData);
            expect(fakeMat4.rotate).toHaveBeenCalledWith(fakeMatrix, fakeDrawData.roll, [0,1,0]);
        });

        it("pitches object 1 radian", function() {
            fakeDrawData.pitch = 90;
            drawService.draw(fakeDrawData);
            expect(fakeMat4.rotate).toHaveBeenCalledWith(fakeMatrix, fakeDrawData.pitch, [1,0,0]);
        });

        it("pitches object 2 radians", function() {
            fakeDrawData.pitch = 2;
            drawService.draw(fakeDrawData);
            expect(fakeMat4.rotate).toHaveBeenCalledWith(fakeMatrix, fakeDrawData.pitch, [1,0,0]);
        });

        it("apply yaw on object 1 radian", function() {
            fakeDrawData.yaw = 1;
            drawService.draw(fakeDrawData);
            expect(fakeMat4.rotate).toHaveBeenCalledWith(fakeMatrix, fakeDrawData.yaw, [0,0,1]);
        });

        it("apply yaw object 2 radians", function() {
            fakeDrawData.yaw = 2;
            drawService.draw(fakeDrawData);
            expect(fakeMat4.rotate).toHaveBeenCalledWith(fakeMatrix, fakeDrawData.yaw, [0,0,1]);
        });
    });

    describe("Initialising", function() {
        it("enables depth testing", function() {
            fakeGl.DEPTH_TEST = 100;
            drawService.initialise();
            expect(fakeGl.enable).toHaveBeenCalledWith(fakeGl.DEPTH_TEST);
        });

        it("clears colour to black", function() {
            drawService.initialise();
            expect(fakeGl.clearColor).toHaveBeenCalledWith(0.0, 0.0, 0.0, 1.0);
        });
    });  
});