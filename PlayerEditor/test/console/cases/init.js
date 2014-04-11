function console_init() {
	testId("Init test");
	testSubId("Caret");
	test("CaretHidden",0,console('carethidden'));
	test("caretblink",0,console('caretblink'));
	test("caretx",0,console('caretx'));
	test("carety",0,console('carety'));
	test("oldcaretx",0,console('oldcaretx'));
	test("oldcarety",0,console('oldcarety'));
	test("linewrap",false,console('linewrap'));
	testSubId(" Deferred rendering variables");
	test("delaycnt",0,console('delaycnt'));
	test("deferscroll",8,console('deferscroll'));
	testSubId("Playing variables");
	test("step",0,console('step'));
	test("paused",1,console('paused'));
	test("finished",0,console('finished'));
	test("repeat",0,console('repeat'));
	test("fastforward",0,console('fastforward'));
	test("windtarget",-1,console('windtarget'));
	test("playafterwind",0,console('playafterwind'));
	testSubId("Timesteps");
	test("timesteps",null,console('timesteps'));
}
