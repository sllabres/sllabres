///<reference path="..scripts/TypeScript/HelloWorld.ts"/>

/*global module, equal, test*/
(function () {
	"use strict";
	module("Test");
	test("Test", function() {
		var student = new Student();
		equal(student.fullname, "Hello world!");
	});
}());