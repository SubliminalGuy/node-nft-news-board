var mongoose = require('mongoose');

var Schema = mongoose.Schema

var AuthorSchema = new Schema(
    {
        first_name: {type: String, required: true, maxLength: 100},
        last_name: {type: String, required: true, maxLength: 100},
        username: {type: String, required: true, maxLength: 100},
        email: {type: String, required: true, maxLength: 100},
        password: {type: String, required: true, maxLength: 100},
        avatarUrl: {type: String, required: true, maxLength: 150},
        memberstatus: {type: String, required: true, enum: ["Newbie", "Member", "Admin"], default: "Newbie"}
    }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case
var fullname = '';
if (this.first_name && this.family_name) {
    fullname = this.first_name + ' ' + this.last_name
}
if (!this.first_name || !this.family_name) {
fullname = '';
}
return fullname;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);
