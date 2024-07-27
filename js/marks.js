$(document).ready(function() {
    // Load students into the dropdown
    function loadStudents() {
        $.ajax({
            url: 'http://localhost:8080/student',
            type: 'GET',
            success: function(response) {
                const studentSelect = $('#studentId');
                studentSelect.empty(); // Clear existing options
                response.forEach(student => {
                    studentSelect.append(
                        `<option value="${student.sid}">${student.sid} - ${student.student_name}</option>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading students:', error);
            }
        });
    }

    // Load subjects into the dropdown
    function loadSubjects() {
        $.ajax({
            url: 'http://localhost:8080/subject',
            type: 'GET',
            success: function(response) {
                const subjectSelect = $('#subjectId');
                subjectSelect.empty(); // Clear existing options
                response.forEach(subject => {
                    subjectSelect.append(
                        `<option value="${subject.sub_id}">${subject.sub_id} - ${subject.subject_name}</option>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading subjects:', error);
            }
        });
    }

    // Load courses into the dropdown
    function loadCourses() {
        $.ajax({
            url: 'http://localhost:8080/course',
            type: 'GET',
            success: function(response) {
                const courseSelect = $('#courseId');
                courseSelect.empty(); // Clear existing options
                response.forEach(course => {
                    courseSelect.append(
                        `<option value="${course.cid}">${course.cid}</option>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading courses:', error);
            }
        });
    }

    // Load terminals into the dropdown
    function loadTerminals() {
        $.ajax({
            url: 'http://localhost:8080/terminal',
            type: 'GET',
            success: function(response) {
                const terminalSelect = $('#terminalId');
                terminalSelect.empty(); // Clear existing options
                response.forEach(terminal => {
                    terminalSelect.append(
                        `<option value="${terminal.terminal_id}">${terminal.terminal_id} - ${terminal.terminal_name}</option>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading terminals:', error);
            }
        });
    }

    // Load marks into the table
    function loadMarks() {
        $.ajax({
            url: 'http://localhost:8080/marks',
            type: 'GET',
            success: function(response) {
                const marksTableBody = $('#marks-table tbody');
                marksTableBody.empty(); // Clear existing rows
                response.forEach(marks => {
                    marksTableBody.append(
                        `<tr data-id="${marks.mid}">
                            <td>${marks.mid}</td>
                            <td>${marks.obtained_marks}</td>
                            <td>${marks.remarks}</td>
                            <td>${marks.student.sid} - ${marks.student.student_name}</td>
                            <td>${marks.subject.sub_id} - ${marks.subject.subject_name}</td>
                            <td>${marks.course.cid}</td>
                            <td>${marks.terminal.terminal_id} - ${marks.terminal.terminal_name}</td>
                            <td>
                                <button class="editButton">Edit</button> 
                                <button class="deleteButton">Delete</button>
                            </td>
                        </tr>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading marks:', error);
            }
        });
    }

    // Add new marks
    function addMarks(marks) {
        $.ajax({
            url: 'http://localhost:8080/marks',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(marks),
            success: function(response) {
                $('#marks-table tbody').append(
                    `<tr data-id="${response.mid}">
                        <td>${response.mid}</td>
                        <td>${response.obtained_marks}</td>
                        <td>${response.remarks}</td>
                        <td>${response.student.sid} - ${response.student.student_name}</td>
                        <td>${response.subject.sub_id} - ${response.subject.subject_name}</td>
                        <td>${response.course.cid}</td>
                        <td>${response.terminal.terminal_id} - ${response.terminal.terminal_name}</td>
                        <td>
                            <button class="editButton">Edit</button> 
                            <button class="deleteButton">Delete</button>
                        </td>
                    </tr>`
                );
                $('#marks-form')[0].reset();
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error adding marks:', error);
            }
        });
    }

    // Update existing marks
    function updateMarks(marks) {
        $.ajax({
            url: `http://localhost:8080/marks/${marks.mid}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(marks),
            success: function(response) {
                const row = $(`#marks-table tbody tr[data-id='${response.mid}']`);
                row.find('td:eq(1)').text(response.obtained_marks);
                row.find('td:eq(2)').text(response.remarks);
                row.find('td:eq(3)').text(`${response.student.sid} - ${response.student.student_name}`);
                row.find('td:eq(4)').text(`${response.subject.sub_id} - ${response.subject.subject_name}`);
                row.find('td:eq(5)').text(response.course.cid);
                row.find('td:eq(6)').text(`${response.terminal.terminal_id} - ${response.terminal.terminal_name}`);

                $('#marks-form')[0].reset();
                $('#marksId').val('');
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error updating marks:', error);
            }
        });
    }

    // Delete marks
    function deleteMarks(mid) {
        $.ajax({
            url: `http://localhost:8080/marks/${mid}`,
            type: 'DELETE',
            success: function(response) {
                $(`#marks-table tbody tr[data-id='${mid}']`).remove();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting marks:', error);
            }
        });
    }

    // Handle form submission
    $('#marks-form').on('submit', function(event) {
        event.preventDefault();
        const marksId = $('#marksId').val();
        const marks = {
            mid: marksId ? parseInt(marksId) : null,
            obtained_marks: parseInt($('#obtainedMarks').val()),
            remarks: $('#remarks').val(),
            student: {
                sid: parseInt($('#studentId').val())
            },
            subject: {
                sub_id: parseInt($('#subjectId').val())
            },
            course: {
                cid: parseInt($('#courseId').val())
            },
            terminal: {
                terminal_id: parseInt($('#terminalId').val())
            }
        };

        if (marksId) {
            updateMarks(marks);
        } else {
            addMarks(marks);
        }
    });

    // Handle edit button click
    $('#marks-table').on('click', '.editButton', function() {
        const row = $(this).closest('tr');
        const mid = row.data('id');
        const obtained_marks = row.find('td:eq(1)').text();
        const remarks = row.find('td:eq(2)').text();
        const studentId = row.find('td:eq(3)').text().split(' - ')[0];
        const subjectId = row.find('td:eq(4)').text().split(' - ')[0];
        const courseId = row.find('td:eq(5)').text();
        const terminalId = row.find('td:eq(6)').text().split(' - ')[0];

        $('#marksId').val(mid);
        $('#obtainedMarks').val(obtained_marks);
        $('#remarks').val(remarks);
        $('#studentId').val(studentId);
        $('#subjectId').val(subjectId);
        $('#courseId').val(courseId);
        $('#terminalId').val(terminalId);

        $('#updateButton').show();
        $('#saveButton').hide();
        $('#cancelButton').show();
    });

    // Handle delete button click
    $('#marks-table').on('click', '.deleteButton', function() {
        const mid = $(this).closest('tr').data('id');
        deleteMarks(mid);
    });

    // Handle cancel button click
    $('#cancelButton').on('click', function() {
        $('#marks-form')[0].reset();
        $('#marksId').val('');
        $('#updateButton').hide();
        $('#saveButton').show();
        $('#cancelButton').hide();
    });

    // Handle exit button click
    $('#exitButton').click(function() {
        if (confirm('Are you sure you want to exit this page?')) {
            window.location.href = 'index.html'; // Redirect to index.html
        }
    });

    // Load initial data
    loadStudents();
    loadSubjects();
    loadCourses();
    loadTerminals();
    loadMarks();
});
