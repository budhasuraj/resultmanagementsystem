$(document).ready(function() {
    // Load faculty options
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

    // Load program options
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

    // Load student data
    function loadStudents() {
        $.ajax({
            url: 'http://localhost:8080/student',
            type: 'GET',
            success: function(response) {
                const studentTableBody = $('#studentTable tbody');
                studentTableBody.empty(); // Clear existing rows
                response.forEach(student => {
                    studentTableBody.append(
                        `<tr data-id="${student.sid}">
                            <td>${student.sid}</td>
                            <td>${student.student_name}</td>
                            <td>${student.email}</td>
                            <td>${student.contact}</td>
                            <td>${student.student_id}</td>
                            <td>${student.address}</td>
                            <td>${student.faculty.faculty_id} - ${student.faculty.faculty_name}</td>
                            <td>${student.program.program_id} - ${student.program.program_name}</td>
                            <td>${student.gender}</td>
                            <td>
                                <button class="editButton">Edit</button> 
                                <button class="deleteButton">Delete</button>
                            </td>
                        </tr>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading students:', error);
            }
        });
    }

    // Function to add a student
    function addStudent(student) {
        $.ajax({
            url: 'http://localhost:8080/student',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(student),
            success: function(response) {
                $('#studentTable tbody').append(
                    `<tr data-id="${response.sid}">
                        <td>${response.sid}</td>
                        <td>${response.student_name}</td>
                        <td>${response.email}</td>
                        <td>${response.contact}</td>
                        <td>${response.student_id}</td>
                        <td>${response.address}</td>
                        <td>${response.faculty.faculty_id} - ${response.faculty.faculty_name}</td>
                        <td>${response.program.program_id} - ${response.program.program_name}</td>
                        <td>${response.gender}</td>
                        <td>
                            <button class="editButton">Edit</button> 
                            <button class="deleteButton">Delete</button>
                        </td>
                    </tr>`
                );
                $('#studentForm')[0].reset(); // Clear the form
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error adding student:', error);
            }
        });
    }

    // Function to update a student
    function updateStudent(studentId, student) {
        $.ajax({
            url: `http://localhost:8080/student/${studentId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(student),
            success: function(response) {
                const row = $('#studentTable tbody').find(`tr[data-id="${studentId}"]`);
                row.html(
                    `<td>${response.sid}</td>
                     <td>${response.student_name}</td>
                     <td>${response.email}</td>
                     <td>${response.contact}</td>
                     <td>${response.student_id}</td>
                     <td>${response.address}</td>
                     <td>${response.faculty.faculty_id} - ${response.faculty.faculty_name}</td>
                     <td>${response.program.program_id} - ${response.program.program_name}</td>
                     <td>${response.gender}</td>
                     <td>
                         <button class="editButton">Edit</button> 
                         <button class="deleteButton">Delete</button>
                     </td>`
                );
                $('#studentForm')[0].reset(); // Clear the form
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error updating student:', error);
            }
        });
    }

    // Function to delete a student
    function deleteStudent(studentId) {
        $.ajax({
            url: `http://localhost:8080/student/${studentId}`,
            type: 'DELETE',
            success: function(response) {
                $('#studentTable tbody').find(`tr[data-id="${studentId}"]`).remove();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting student:', error);
            }
        });
    }

    // Form submit event
    $('#studentForm').on('submit', function(event) {
        event.preventDefault();
        
        const student = {
            student_name: $('#fullName').val(),
            email: $('#email').val(),
            contact: $('#contact').val(),
            student_id: $('#identityCard').val(),
            address: $('#address').val(),
            faculty: {
                faculty_id: $('#facultyId').val()
            },
            program: {
                program_id: $('#programId').val()
            },
            gender: $('#gender').val()
        };
        
        if ($('#saveButton').is(':visible')) {
            addStudent(student);
        } else {
            const studentId = $('#studentId').val();
           // alert('Updating student with ID: ' + studentId); // Alert to check if button listener is working
            updateStudent(studentId, student);
        }
    });

    // Cancel button click event
    $('#cancelButton').on('click', function() {
        $('#studentForm')[0].reset();
        $('#updateButton').hide();
        $('#saveButton').show();
        $('#cancelButton').hide();
    });

    // Edit button click event
    $('#studentTable').on('click', '.editButton', function() {
        const row = $(this).closest('tr');
        const studentId = row.data('id');
       // alert('Editing student with ID: ' + studentId); // Alert to check if button listener is working
        $('#studentId').val(studentId);
        $('#fullName').val(row.find('td:eq(1)').text());
        $('#email').val(row.find('td:eq(2)').text());
        $('#contact').val(row.find('td:eq(3)').text());
        $('#identityCard').val(row.find('td:eq(4)').text());
        $('#address').val(row.find('td:eq(5)').text());
        const facultyText = row.find('td:eq(6)').text().split(' - ');
        $('#facultyId').val(facultyText[0]);
        const programText = row.find('td:eq(7)').text().split(' - ');
        $('#programId').val(programText[0]);
        $('#gender').val(row.find('td:eq(8)').text());
        $('#updateButton').show();
        $('#saveButton').hide();
        $('#cancelButton').show();
    });

    // Delete button click event
    $('#studentTable').on('click', '.deleteButton', function() {
        const studentId = $(this).closest('tr').data('id');
        alert('Deleting student with ID: ' + studentId); // Alert to check if button listener is working
        deleteStudent(studentId);
    });

    // Handle exit button click
    $('#exitButton').click(function() {
        if (confirm('Are you sure you want to exit this page?')) {
            window.location.href = 'index.html'; // Redirect to index.html
        }
    });

    // Load initial data
    loadFaculties();
    loadPrograms();
    loadStudents(); // Load students when the page loads
});
