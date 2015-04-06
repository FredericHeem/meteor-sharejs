if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("Server initialization", function(){
      it("should have a Meteor version defined", function(){
        chai.assert(Meteor.release);
      });
      it("should have ShareJS.model defined", function(){
          //chai.assert(ShareJS.model);
          //var share = new 
      });
    });
  });
}
