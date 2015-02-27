this.Documents = new Meteor.Collection("documents")
#debugger
console.log "hey"

Meteor.methods
  deleteDocument: (id) ->
    Documents.remove(id)
    ShareJS.model.delete(id) unless @isSimulation # ignore error
