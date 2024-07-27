$(document).ready(function () {
    const apiUrl = 'http://localhost:8080/studentsignup';
    let studentIds = [];

    // Load existing student signups
    function loadStudentSignups() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function (response) {
                console.log('Loaded student signups:', response); // Log the response
                const tableBody = $('#studentsignup-table tbody');
                tableBody.empty(); // Clear existing rows
                response.forEach(function (signup) {
                    tableBody.append(`
                        <tr data-id="${signup.ssid}">
                            <td>${signup.student_id}</td>
                            <td>${signup.username}</td>
                            <td>${signup.password}</td>
                            <td>
                                <button class="editButton">Edit</button>
                                <button class="deleteButton">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error loading student signups:', error);
            }
        });
    }

    // Load students and store their student_id
    function loadStudents() {
        $.ajax({
            url: 'http://localhost:8080/student',
            type: 'GET',
            success: function(response) {
                studentIds = response.map(student => student.student_id); // Store student_ids
                console.log('Loaded student IDs:', studentIds); // Log loaded student IDs
            },
            error: function(xhr, status, error) {
                console.error('Error loading students:', error);
            }
        });
    }

    // Add new student signup
    function addStudentSignup(studentSignup) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(studentSignup),
            success: function (response) {
                $('#studentsignup-table tbody').append(`
                    <tr data-id="${response.ssid}">
                        <td>${response.student_id}</td>
                        <td>${response.username}</td>
                        <td>${response.password}</td>
                        <td>
                            <button class="editButton">Edit</button>
                            <button class="deleteButton">Delete</button>
                        </td>
                    </tr>
                `);
                resetForm();
                window.location.href = 'resultapp.html'; // Redirect to resultapp.html
            },
            error: function (xhr, status, error) {
                console.error('Error adding student signup:', error);
            }
        });
    }

    // Update existing student signup
    function updateStudentSignup(studentSignup, id) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(studentSignup),
            success: function (response) {
                const row = $(`tr[data-id="${id}"]`);
                row.find('td').eq(0).text(response.student_id);
                row.find('td').eq(1).text(response.username);
                row.find('td').eq(2).text(response.password);
                resetForm();
                window.location.href = 'resultapp.html'; // Redirect to resultapp.html
            },
            error: function (xhr, status, error) {
                console.error('Error updating student signup:', error);
            }
        });
    }

    // Delete student signup
    function deleteStudentSignup(id) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'DELETE',
            success: function () {
                $(`tr[data-id="${id}"]`).remove();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting student signup:', error);
            }
        });
    }

    // Reset form to initial state
    function resetForm() {
        $('#studentsignup-form')[0].reset();
        $('#saveButton').show();
        $('#updateButton, #cancelButton').hide();
        $('#studentsignup-form').data('id', '');
    }

    // Handle form submission for adding or updating a student signup
    $('#studentsignup-form').submit(function (event) {
        event.preventDefault();
        const studentSignup = {
            student_id: $('#studentId').val(), // Ensure field name matches your back-end entity
            username: $('#username').val(),
            password: $('#password').val(),
        };

        console.log('Entered student ID:', studentSignup.student_id); // Log entered student ID

        if (studentIds.includes(parseInt(studentSignup.student_id))) { // Validate student_id
            const id = $('#studentsignup-form').data('id');
            if (id) {
                updateStudentSignup(studentSignup, id);
            } else {
                addStudentSignup(studentSignup);
            }
        } else {
            alert('Invalid student ID. Please enter a valid student ID.');
        }
    });

    // Handle edit button click
    $('#studentsignup-table').on('click', '.editButton', function () {
        const row = $(this).closest('tr');
        const id = row.data('id');
        const student_id = row.find('td').eq(0).text();
        const username = row.find('td').eq(1).text();
        const password = row.find('td').eq(2).text();

        $('#studentId').val(student_id);
        $('#username').val(username);
        $('#password').val(password);
        $('#studentsignup-form').data('id', id);

        $('#saveButton').hide();
        $('#updateButton, #cancelButton').show();
    });

    // Handle delete button click
    $('#studentsignup-table').on('click', '.deleteButton', function () {
        const id = $(this).closest('tr').data('id');
        deleteStudentSignup(id);
    });

    // Handle cancel button click
    $('#cancelButton').click(function () {
        resetForm();
    });

    // Load students and existing student signups on page load
    loadStudents();
    loadStudentSignups();

    // Directly move into resultapp.html page when clicking on account button
    $('#accountButton').click(function() {
        window.location.href = 'resultapp.html';
    });
});
