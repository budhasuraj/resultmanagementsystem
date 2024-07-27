$(document).ready(function() {
    function loadFaculties() {
        $.ajax({
            url: 'http://localhost:8080/faculty',
            type: 'GET',
            success: function(response) {
                const facultySelect = $('#facultyId');
                response.forEach(faculty => {
                    facultySelect.append(
                        `<option value="${faculty.faculty_id}">${faculty.faculty_id} - ${faculty.faculty_name}</option>`
                    );
                });
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
                const programSelect = $('#programId');
                response.forEach(program => {
                    programSelect.append(
                        `<option value="${program.program_id}">${program.program_id} - ${program.program_name}</option>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading programs:', error);
            }
        });
    }

    function loadSubjects() {
        $.ajax({
            url: 'http://localhost:8080/subject',
            type: 'GET',
            success: function(response) {
                const subjectSelect = $('#subjectId');
                response.forEach(subject => {
                    subjectSelect.append(
                        `<option value="${subject.sub_id}">${subject.sub_id} - ${subject.subject_code}</option>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading subjects:', error);
            }
        });
    }

    function loadSemesters() {
        $.ajax({
            url: 'http://localhost:8080/semester',
            type: 'GET',
            success: function(response) {
                const semesterSelect = $('#semesterId');
                response.forEach(semester => {
                    semesterSelect.append(
                        `<option value="${semester.semester_id}">${semester.semester_id} - ${semester.semester}</option>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading semesters:', error);
            }
        });
    }

    function loadTeachers() {
        $.ajax({
            url: 'http://localhost:8080/teacher',
            type: 'GET',
            success: function(response) {
                const teacherSelect = $('#teacherId');
                teacherSelect.empty(); // Clear existing options
                response.forEach(teacher => {
                    teacherSelect.append(
                        `<option value="${teacher.tid}">${teacher.tid} - ${teacher.teacher_code}</option>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading teachers:', error);
            }
        });
    }

    function loadCourses() {
        $.ajax({
            url: 'http://localhost:8080/course',
            type: 'GET',
            success: function(response) {
                const courseTableBody = $('#course-table tbody');
                courseTableBody.empty();
                response.forEach(course => {
                    courseTableBody.append(
                        `<tr data-id="${course.cid}">
                            <td>${course.cid}</td>
                            <td>${course.subject.sub_id} - ${course.subject.subject_code}</td>
                            <td>${course.full_marks}</td>
                            <td>${course.pass_marks}</td>
                            <td>${course.credit_hours}</td>
                            <td>${course.faculty.faculty_id} - ${course.faculty.faculty_name}</td>
                            <td>${course.program.program_id} - ${course.program.program_name}</td>
                            <td>${course.semester.semester_id} - ${course.semester.semester}</td>
                            <td>${course.teacher.tid} - ${course.teacher.teacher_code}</td>
                            <td>
                                <button class="editButton">Edit</button> 
                                <button class="deleteButton">Delete</button>
                            </td>
                        </tr>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading courses:', error);
            }
        });
    }

    function addCourse(course) {
        $.ajax({
            url: 'http://localhost:8080/course',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(course),
            success: function(response) {
                $('#course-table tbody').append(
                    `<tr data-id="${response.cid}">
                        <td>${response.cid}</td>
                        <td>${response.subject.sub_id} - ${response.subject.subject_code}</td>
                        <td>${response.full_marks}</td>
                        <td>${response.pass_marks}</td>
                        <td>${response.credit_hours}</td>
                        <td>${response.faculty.faculty_id} - ${response.faculty.faculty_name}</td>
                        <td>${response.program.program_id} - ${response.program.program_name}</td>
                        <td>${response.semester.semester_id} - ${response.semester.semester}</td>
                        <td>${response.teacher.tid} - ${response.teacher.teacher_code}</td>
                        <td>
                            <button class="editButton">Edit</button> 
                            <button class="deleteButton">Delete</button>
                        </td>
                    </tr>`
                );
                $('#course-form')[0].reset();
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error adding course:', error);
            }
        });
    }

    function updateCourse(courseId, course) {
        $.ajax({
            url: `http://localhost:8080/course/${courseId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(course),
            success: function(response) {
                const row = $('#course-table tbody').find(`tr[data-id="${courseId}"]`);
                row.html(
                    `<td>${response.cid}</td>
                     <td>${response.subject.sub_id} - ${response.subject.subject_code}</td>
                     <td>${response.full_marks}</td>
                     <td>${response.pass_marks}</td>
                     <td>${response.credit_hours}</td>
                     <td>${response.faculty.faculty_id} - ${response.faculty.faculty_name}</td>
                     <td>${response.program.program_id} - ${response.program.program_name}</td>
                     <td>${response.semester.semester_id} - ${response.semester.semester}</td>
                     <td>${response.teacher.tid} - ${response.teacher.teacher_code}</td>
                     <td>
                         <button class="editButton">Edit</button> 
                         <button class="deleteButton">Delete</button>
                     </td>`
                );
                $('#course-form')[0].reset();
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error updating course:', error);
            }
        });
    }

    function deleteCourse(courseId) {
        $.ajax({
            url: `http://localhost:8080/course/${courseId}`,
            type: 'DELETE',
            success: function(response) {
                $('#course-table tbody').find(`tr[data-id="${courseId}"]`).remove();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting course:', error);
            }
        });
    }

    $('#course-form').on('submit', function(event) {
        event.preventDefault();
        
        const course = {
            full_marks: $('#fullMarks').val(),
            pass_marks: $('#passMarks').val(),
            credit_hours: $('#creditHours').val(),
            faculty: {
                faculty_id: $('#facultyId').val()
            },
            program: {
                program_id: $('#programId').val()
            },
            semester: {
                semester_id: $('#semesterId').val()
            },
            subject: {
                sub_id: $('#subjectId').val()
            },
            teacher: {
                tid: $('#teacherId').val()
            }
        };

        if ($('#saveButton').is(':visible')) {
            addCourse(course);
        } else {
            const courseId = $('#courseId').val();
            updateCourse(courseId, course);
        }
    });

    $('#cancelButton').on('click', function() {
        $('#course-form')[0].reset();
        $('#updateButton').hide();
        $('#saveButton').show();
        $('#cancelButton').hide();
    });

    $('#course-table').on('click', '.editButton', function() {
        const row = $(this).closest('tr');
        const courseId = row.data('id');
        $('#courseId').val(courseId);
        const subjectText = row.find('td:eq(1)').text().split(' - ');
        $('#subjectId').val(subjectText[0]);
        $('#fullMarks').val(row.find('td:eq(2)').text());
        $('#passMarks').val(row.find('td:eq(3)').text());
        $('#creditHours').val(row.find('td:eq(4)').text());
        const facultyText = row.find('td:eq(5)').text().split(' - ');
        $('#facultyId').val(facultyText[0]);
        const programText = row.find('td:eq(6)').text().split(' - ');
        $('#programId').val(programText[0]);
        const semesterText = row.find('td:eq(7)').text().split(' - ');
        $('#semesterId').val(semesterText[0]);
        const teacherText = row.find('td:eq(8)').text().split(' - ');
        $('#teacherId').val(teacherText[0]);
        $('#updateButton').show();
        $('#saveButton').hide();
        $('#cancelButton').show();
    });

    $('#course-table').on('click', '.deleteButton', function() {
        const courseId = $(this).closest('tr').data('id');
        deleteCourse(courseId);
    });

    // Handle exit button click
    $('#exitButton').click(function() {
        if (confirm('Are you sure you want to exit this page?')) {
            window.location.href = 'index.html'; // Redirect to index.html
        }
    });

    loadFaculties();
    loadPrograms();
    loadSubjects();
    loadSemesters();
    loadTeachers();
    loadCourses();
});
