var Course = require('../models/course');
var Student = require('../models/student');
var User = require('../models/user');

module.exports = function(apiRouter) {
	apiRouter.route('/courses')

		//Get a collection of courses
		.get(function (req, res) {
			var courseQuery = 
			Course.find().
			populate('assignments students').
			exec(function (err, courses) {
				if (err)
					res.send(err);
				else{
					res.json(courses);
				}
			});
		})

		//Create a new course
		.post(function (req, res) {
			var newCourse = new Course();

			newCourse.name = req.body.name;
			newCourse.courseNum = req.body.courseNum;
			newCourse.dateCreated = Date.now();
			newCourse.dateModified = Date.now();
			newCourse.semesters = [];
			newCourse.assignments = [];
			newCourse.students = [];
			newCourse.comments.push(req.body.comments || []);

			//Populate students
			if (req.body.studentsIn != []) {
				newCourse.students = req.body.studentsIn;
			}  

			//Save to DB
			newCourse.save(function (err, newCourse) {
				if (err)
					res.send(err);
				else
					res.json(newCourse);
			});
		});

	//Operations for existing courses
	apiRouter.route('/courses/:course_id')

		//Get a course by Id
		.get(function (req, res) {
			Course.findById({_id: req.params.course_id})
			.populate('students assignments')
			.exec(function (err, course) {
				if (err)
					res.send(err);
				else{
					res.json(course);
				}
			})
		})

		//Update course
		.put(function (req, res) {
			Course.update(
				{"_id": req.params.course_id},
				{
					"name": req.body.name,
					"courseNum": req.body.courseNum,
					"students": req.body.students
				},
				{"upsert": "true"},
				function (err, course) {
					if (err)
						res.send(err);
					else{
						res.json(course);
					}
				});
		})

		//Delete an existing course
		.delete(function (req, res) {
			Course.findByIdAndRemove(req.params.course_id, function (err, delCourse) {
				console.log(delCourse);
				if (err)
					res.send(err);
				delCourse.remove();
			}).then(function() {
				Course.find(function (err, courses) {
					res.json({ message: 'Course deleted' });
				});
			});
		});

	//Calls for populating fields
	apiRouter.route('/courses/:course_id/students')
		//Get students in a course
		.get(function (req, res) {
			Course.findById({_id: req.params.course_id})
			.populate('students')
			.exec(function (err, sCourse) {
				if (err)
					res.send(err);
				else{
					res.json(sCourse.students);
				};
			});
		})
		//Post student to course
		.put(function (req, res) {
			debugger;
			if (req.body == '{}')
				console.log("No student ids were found in request body");
			else{			
				console.log(req.body.student_id);
				Course.update(
					{"_id": req.params.course_id},
					{$push: {"students": req.body.student_id}},
					{"upsert":"true"},
					function (err, course) {
						if (err)
							res.send(err);
						else
							console.log(course);
							res.json(course);
					});
				};
		});

	apiRouter.route('/courses/:course_id/assignments/:assignment_id')

		//Post assignments to course
		.put(function (req, res) {
			var ObjectId = require('mongoose').Types.ObjectId; 
			console.log(req.params.course_id);
			console.log(req.params.assignment_id);
			// if (req.body == '{}')
			// 	console.log("No assignments in request body");
			// else{
				Course.update(
					{_id: new ObjectId(req.params.course_id)},
					{$addToSet: {"assignments": req.params.assignment_id}},
					{upsert: true},
					function (err, course) {
						if (err)
							res.send(err);
						else{
							res.json(course);
						}
					}
				);
			// }
		});

	apiRouter.route('/courses/:course_id/antiStudents')
		.get(function (req, res) {
			Student.find({courses: {$ne: req.params.course_id}}, function (err, students) {
				if (err)
					res.send(err);
				else{
					res.json(students);
				}
			});
		});
}