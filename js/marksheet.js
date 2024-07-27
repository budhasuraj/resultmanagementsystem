$(document).ready(function() {
    let allPrograms = [];
    let allSemesters = [];
    let allCourses = [];
    let allStudentSemesters = [];
    let allSubjects = [];
    let allMarks = [];
    let lastCourseName = '';  // To track the last selected course name
    let autoIncrementedValue = 1;  // To track the auto-incremented value

    function loadFaculties() {
        $.ajax({
            url: 'http://localhost:8080/faculty',
            type: 'GET',
            success: function(response) {
                const facultySelect = $('#facultyId');
                facultySelect.empty().append('<option value="">Select Faculty</option>');
                response.forEach(faculty => {
                    facultySelect.append(
                        `<option value="${faculty.faculty_id}">${faculty.faculty_id} - ${faculty.faculty_name}</option>`
                    );
                });
                loadPrograms();
                loadSemesters();
            },
            error: function(xhr, status, error) {
                console.error('Error loading faculties:', error);
            }
        });
    }

    function loadPrograms() {
        $.ajax({
            url: 'http://localhost:8080/program',
            type: 'GET',
            success: function(response) {
                allPrograms = response;
                $('#programId').empty().append('<option value="">Select Program</option>');
            },
            error: function(xhr, status, error) {
                console.error('Error loading programs:', error);
            }
        });
    }

    function loadSemesters() {
        $.ajax({
            url: 'http://localhost:8080/semester',
            type: 'GET',
            success: function(response) {
                allSemesters = response;
                $('#semesterId').empty().append('<option value="">Select Semester</option>');
            },
            error: function(xhr, status, error) {
                console.error('Error loading semesters:', error);
            }
        });
    }

    function loadCourses() {
        $.ajax({
            url: 'http://localhost:8080/course',
            type: 'GET',
            success: function(response) {
                allCourses = response;
                $('#courseId').empty().append('<option value="">Select Course</option>');
            },
            error: function(xhr, status, error) {
                console.error('Error loading courses:', error);
            }
        });
    }

    function loadStudentSemesters() {
        $.ajax({
            url: 'http://localhost:8080/studentsemester',
            type: 'GET',
            success: function(response) {
                allStudentSemesters = response;
                $('#studentId').empty().append('<option value="">Select Student</option>');
            },
            error: function(xhr, status, error) {
                console.error('Error loading student-semester data:', error);
            }
        });
    }

    function loadSubjects() {
        $.ajax({
            url: 'http://localhost:8080/subject',
            type: 'GET',
            success: function(response) {
                allSubjects = response;
                $('#subjectId').empty().append('<option value="">Select Subject</option>');
            },
            error: function(xhr, status, error) {
                console.error('Error loading subjects:', error);
            }
        });
    }

    function loadMarks() {
        $.ajax({
            url: 'http://localhost:8080/marks',
            type: 'GET',
            success: function(response) {
                allMarks = response;
            },
            error: function(xhr, status, error) {
                console.error('Error loading marks:', error);
            }
        });
    }

    function updatePrograms(facultyId) {
        const programSelect = $('#programId');
        programSelect.empty().append('<option value="">Select Program</option>');
        
        if (facultyId) {
            const filteredPrograms = allPrograms.filter(program => program.faculty.faculty_id == facultyId);
            if (filteredPrograms.length === 0) {
                programSelect.append('<option value="">No programs available</option>');
            } else {
                filteredPrograms.forEach(program => {
                    programSelect.append(
                        `<option value="${program.program_id}">${program.program_id} - ${program.program_name}</option>`
                    );
                });
            }
        } else {
            programSelect.append('<option value="">Select Program</option>');
        }

        programSelect.prop('disabled', false);
    }

    function updateSemesters() {
        const semesterSelect = $('#semesterId');
        semesterSelect.empty().append('<option value="">Select Semester</option>');

        if (allSemesters.length > 0) {
            allSemesters.forEach(semester => {
                semesterSelect.append(
                    `<option value="${semester.semester_id}">${semester.semester_id} - ${semester.semester}</option>`
                );
            });
        } else {
            semesterSelect.append('<option value="">No semesters available</option>');
        }

        semesterSelect.prop('disabled', false);
    }

    function updateCourses(semesterId) {
        const courseSelect = $('#courseId');
        courseSelect.empty().append('<option value="">Select Course</option>');

        if (semesterId) {
            const filteredCourses = allCourses.filter(course => course.semester.semester_id == semesterId);
            if (filteredCourses.length === 0) {
                courseSelect.append('<option value="">No courses available</option>');
            } else {
                filteredCourses.forEach(course => {
                    courseSelect.append(
                        `<option value="${course.cid}">${course.cid} - ${course.subject.subject_code}</option>`
                    );
                });
            }
        } else {
            courseSelect.append('<option value="">Select Course</option>');
        }

        courseSelect.prop('disabled', false);
    }

    function updateStudents(semesterId) {
        const studentSelect = $('#studentId');
        studentSelect.empty().append('<option value="">Select Student</option>');

        if (semesterId) {
            const filteredStudents = allStudentSemesters.filter(studentSem => studentSem.semester.semester_id == semesterId);
            if (filteredStudents.length === 0) {
                studentSelect.append('<option value="">No students available</option>');
            } else {
                filteredStudents.forEach(studentSem => {
                    studentSelect.append(
                        `<option value="${studentSem.student.sid}">${studentSem.student.sid} - ${studentSem.student.student_name}</option>`
                    );
                });
            }
        } else {
            studentSelect.append('<option value="">Select Student</option>');
        }

        studentSelect.prop('disabled', false);
    }

    function updateSubjects(semesterId) {
        const subjectSelect = $('#subjectId');
        subjectSelect.empty().append('<option value="">Select Subject</option>');

        if (semesterId) {
            const filteredSubjects = allSubjects.filter(subject => {
                return allCourses.some(course => course.semester.semester_id == semesterId && course.subject.sub_id == subject.sub_id);
            });
            if (filteredSubjects.length === 0) {
                subjectSelect.append('<option value="">No subjects available</option>');
            } else {
                filteredSubjects.forEach(subject => {
                    subjectSelect.append(
                        `<option value="${subject.sub_id}">${subject.sub_id} - ${subject.subject_name}</option>`
                    );
                });
            }
        } else {
            subjectSelect.append('<option value="">Select Subject</option>');
        }

        subjectSelect.prop('disabled', false);
    }

    function updateMarks(subjectId) {
        const marksSelect = $('#marksId');
        marksSelect.empty().append('<option value="">Select Marks</option>');

        if (subjectId) {
            const filteredMarks = allMarks.filter(mark => mark.subject.sub_id == subjectId);
            if (filteredMarks.length === 0) {
                marksSelect.append('<option value="">No marks available</option>');
            } else {
                filteredMarks.forEach(mark => {
                    marksSelect.append(
                        `<option value="${mark.mid}">${mark.student.student_name} - ${mark.obtained_marks} - ${mark.remarks}</option>`
                    );
                });
            }
        } else {
            marksSelect.append('<option value="">Select Marks</option>');
        }

        marksSelect.prop('disabled', false);
    }

    function updateStudentName(studentId) {
        const studentNameInput = $('#studentName');
        if (studentId) {
            const selectedStudent = allStudentSemesters.find(studentSem => studentSem.student.sid == studentId);
            if (selectedStudent) {
                studentNameInput.val(selectedStudent.student.student_name);
            } else {
                studentNameInput.val('');
            }
        } else {
            studentNameInput.val('');
        }
    }

    function addTableRow(studentName, courseName, subjectName, marks, total) {
        let remarks = '';
        if (parseFloat(marks) < 45) {
            remarks = 'F';
        }
        else if(parseFloat(marks)>=45){
            remarks = 'P';
        }
        else{
            remarks="AB";
        }
    
        $('#marksheet-table tbody').append(
            `<tr>
                <td>${studentName}</td>
                <td>${courseName}</td>
                <td>${subjectName}</td>
                <td>${marks}</td>
                <td>${remarks}</td>
            </tr>`
        );
        updateTotalMarks();

    }

    $('#facultyId').change(function() {
        const facultyId = $(this).val();
        updatePrograms(facultyId);
    });

    $('#programId').change(function() {
        const programId = $(this).val();
        if (programId) {
            updateSemesters();
        } else {
            $('#semesterId').prop('disabled', true);
        }
    });

    $('#semesterId').change(function() {
        const semesterId = $(this).val();
        if (semesterId) {
            updateCourses(semesterId);
            updateStudents(semesterId);
            updateSubjects(semesterId);
        } else {
            $('#courseId').prop('disabled', true);
            $('#studentId').prop('disabled', true);
            $('#subjectId').prop('disabled', true);
        }
    });

    $('#courseId').change(function() {
        const courseId = $(this).val();
        if (courseId) {
            const selectedCourse = allCourses.find(course => course.cid == courseId);
            if (selectedCourse) {
                lastCourseName = selectedCourse.subject.subject_code;  // Store the last course name
                updateMarks(selectedCourse.subject.sub_id);
            }
        } else {
            $('#marksId').prop('disabled', true);
        }
    });

    $('#marksId').change(function() {
        const marksId = $(this).val();
        if (marksId) {
            const selectedMark = allMarks.find(mark => mark.mid == marksId);
            if (selectedMark) {
                $('#total').val(selectedMark.obtained_marks);
            }
        } else {
            $('#total').val('');
        }
    });

    $('#studentId').change(function() {
        const studentId = $(this).val();
        updateStudentName(studentId);
    });

    $('#marksheet-form').submit(function(event) {
        event.preventDefault();

        const facultyId = $('#facultyId').val();
        const programId = $('#programId').val();
        const semesterId = $('#semesterId').val();
        const studentId = $('#studentId').val();
        const courseId = $('#courseId').val();
        const subjectId = $('#subjectId').val();
        const marksId = $('#marksId').val();
        const total = $('#total').val();

        let courseName = lastCourseName;
        if (!courseId) {
            courseName = `Course-${autoIncrementedValue}`;  // Auto-incremented value
            autoIncrementedValue++;
        }

        addTableRow(
            $('#studentId option:selected').text().split(' - ')[1],  // Student Name
            courseName,
            $('#subjectId option:selected').text().split(' - ')[1],  // Subject Name
            $('#marksId option:selected').text().split(' - ')[1],  // Obtained Marks
            total
        );

        // Keep the form in "Add" mode
        $('#marksheet-form')[0].reset();
        $('#programId').prop('disabled', true);
        $('#semesterId').prop('disabled', true);
        $('#courseId').prop('disabled', false);
        $('#studentId').prop('disabled', true);
        $('#subjectId').prop('disabled', false);
        $('#marksId').prop('disabled', false);
        $('#total').val('');

        $('#saveButton').show();
        $('#updateButton').hide();  // Hide update button
        $('#cancelButton').hide();  // Hide cancel button
        $('#nextButton').show();  // Show next button
    });

    $('#cancelButton').click(function() {
        $('#marksheet-form')[0].reset();
        $('#programId').prop('disabled', true);
        $('#semesterId').prop('disabled', true);
        $('#courseId').prop('disabled', true);
        $('#studentId').prop('disabled', true);
        $('#subjectId').prop('disabled', true);
        $('#marksId').prop('disabled', true);
        $('#total').val('');

        $('#saveButton').show();
        $('#updateButton').hide();
        $('#cancelButton').hide();
        $('#nextButton').hide();
    });

    $('#nextButton').click(function() {
        $('#marksheet-form')[0].reset();
        $('#programId').prop('disabled', false);
        $('#semesterId').prop('disabled', false);
        $('#courseId').prop('disabled', false);
        $('#studentId').prop('disabled', false);
        $('#subjectId').prop('disabled', false);
        $('#marksId').prop('disabled', false);
        $('#total').val('');

        $('#saveButton').show();
        $('#updateButton').hide();
        $('#cancelButton').hide();
        $('#nextButton').show();
    });

    function updateTotalMarks() {
        let totalMarks = 0;
    
        // Iterate over each row in the table to calculate the total marks
        $('#marksheet-table tbody tr').each(function() {
            const marks = parseFloat($(this).find('td:nth-child(4)').text());
            if (!isNaN(marks)) {
                totalMarks += marks;
            }
        });
    
        // Display the total marks in the totalMarks div
        $('#totalMarks').text(`Total Marks: ${totalMarks}`);
    
        // Set the total marks in the total input field
        $('#total').val(totalMarks);
    }

        // Handle exit button click
        $('#exitButton').click(function() {
            $('#facultyName').val(''); // Clear the input field
            if (confirm('Are you sure you want to exit this page?')) {
                window.location.href = 'index.html'; // Redirect to index.html
            }
        });


    

    // Initialize the form
    loadFaculties();
    loadCourses();
    loadStudentSemesters();
    loadSubjects();
    loadMarks();
});
