var mongoose = require('mongoose');

var Schema = mongoose.Schema

var MessageSchema = new Schema(
    {
        title: {type: String, required: true, maxLength: 100},
        message: {type: String, require: true, maxLength: 500},
        timeStamp: {type: Date},
        author: {type: Schema.Types.ObjectId, ref: 'Author'}
    }
);

MessageSchema
.virtual('publishDate')
.get(() => {
    var publish_String = ""
    publish_String = this.timeStamp.getDate().toString();
    publish_String += "."
    publish_String += this.timeStamp.getMonth().toString();
    publish_String += "."
    publish_String += this.timeStamp.getFullYear().toString();
    return publish_String

})

module.exports = mongoose.model("Message", MessageSchema)