if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("a group of tests", function(){
      it("should have ShareJSConnector defined", function(){
        chai.assert(ShareJSConnector);
      });
    });
  });
}
