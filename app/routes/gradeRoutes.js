var Course = require('../models/course');
var Student = require('../models/student');
var User = require('../models/user');
var Grade = require('../models/grade');
var Assignment = require('../models/assignment');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = function(apiRouter) {
	// apiRouter.route('/assignments/:assignment_id/grades')

	// 	//Get a collection of courses
	// 	.get(function (req, res) {
	// 		var courseQuery = 
	// 		Course.find().
	// 		populate('assignments students').
	// 		exec(function (err, courses) {
	// 			if (err)
	// 				res.send(err);
	// 			else{
	// 				res.json(courses);
	// 			}
	// 		});
	// 	});

	//apiRouter.route('/student/:student_id/assignment/:assignment_id/grade')
	apiRouter.route('/:student_id/:assignment_id/grade')
		//Create a new assignment
		.post(function (req, res) {
			var newGrade = new Grade();

			newGrade.student = req.params.student_id;
			newGrade.assignment = req.params.assignment_id;
			newGrade.points = req.body.score;
			newGrade.comments.push(req.body.comment);

			//Save to DB
			newGrade.save(function (err, newGrade) {
				if (err)
					res.send(err);
				else{
					res.json(newGrade);
				}
			});
		});

	//Get a list of grades for an assignment
	apiRouter.route('/assignments/:assignment_id/grades')
		.get(function (req, res) {
			Grade.find({assignment: req.params.assignment_id})
			.populate('student assignment')
			.exec(function (err, grades) {
				if (err)
					res.send(err);
				else{
					res.json(grades);
				}
			});
		});
}