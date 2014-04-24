function console_repeatOn() {
	testId("Repeat ON");
	test("repeat",1,console('repeat'));
}
function console_repeatOff() {
	testId("Repeat OFF");
	test("repeat",0,console('repeat'));
}