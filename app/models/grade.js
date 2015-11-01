//Class variables
var Student = require('./student');
var Course = require('./course');
var Assignment = require('./assignment');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

//Grade schema
var gradeSchema = new Schema({
	dateCreated: {
		type: Date,
		required: true,
		default: Date.now()
	},
	dateModified: {
		type: Date
	},
	points: {
		type: Number,
		required: true,
		default: 0
	},
	assignment: {
		type: ObjectId,
		ref: 'Assignment'
	},
	student: {
		type: ObjectId,
		ref: 'Student'
	},
	comments: [{
		type: String
	}]
});

//Middleware

//Change the DateModified on update
gradeSchema.pre('save', function (next) {
	var graded = this;
	graded.dateModified = Date.now();

	next();
});

//Export the model
var Grade = mongoose.model('Grade', gradeSchema);
module.exports = Grade;