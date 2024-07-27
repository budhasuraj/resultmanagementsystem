$(document).ready(function() {
    // Function to add a new teacher
    function addTeacher(teacher) {
        $.ajax({
            url: 'http://localhost:8080/teacher',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(teacher),
            success: function(response) {
                $('#teacherTable tbody').append(
                    `<tr data-id="${response.tid}">
                        <td>${response.tid}</td>
                        <td>${response.fullname}</td>
                        <td>${response.email}</td>
                        <td>${response.contact}</td>
                        <td>${response.teacher_code}</td>
                        <td>${response.address}</td>
                        <td>${response.password}</td>
                        <td>
                            <button class="editButton">Edit</button>
                            <button class="deleteButton">Delete</button>
                        </td>
                    </tr>`
                );
                $('#teacherForm')[0].reset(); // Clear the form
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error adding teacher:', error);
            }
        });
    }

    // Function to update an existing teacher
    function updateTeacher(teacherId, teacher) {
        $.ajax({
            url: `http://localhost:8080/teacher/${teacherId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(teacher),
            success: function(response) {
                const row = $('#teacherTable tbody').find(`tr[data-id="${teacherId}"]`);
                row.html(
                    `<td>${response.tid}</td>
                     <td>${response.fullname}</td>
                     <td>${response.email}</td>
                     <td>${response.contact}</td>
                     <td>${response.teacher_code}</td>
                     <td>${response.address}</td>
                     <td>${response.password}</td>
                     <td>
                         <button class="editButton">Edit</button>
                         <button class="deleteButton">Delete</button>
                     </td>`
                );
                $('#teacherForm')[0].reset(); // Clear the form
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error updating teacher:', error);
            }
        });
    }

    // Function to delete a teacher
    function deleteTeacher(teacherId) {
        $.ajax({
            url: `http://localhost:8080/teacher/${teacherId}`,
            type: 'DELETE',
            success: function(response) {
                $('#teacherTable tbody').find(`tr[data-id="${teacherId}"]`).remove();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting teacher:', error);
            }
        });
    }

    // Handle form submission for saving or updating
    $('#teacherForm').submit(function(event) {
        event.preventDefault();
        const teacher = {
            fullname: $('#fullname').val(),
            email: $('#email').val(),
            contact: $('#contact').val(),
            teacher_code: $('#teachercode').val(),
            address: $('#address').val(),
            password: $('#password').val()
        };
        const teacherId = $('#teacherId').val();
        if (teacherId) {
            updateTeacher(teacherId, teacher);
        } else {
            addTeacher(teacher);
        }
    });

    // Handle cancel button click
    $('#cancelButton').click(function() {
        $('#teacherForm')[0].reset(); // Clear the form
        $('#updateButton').hide();
        $('#saveButton').show();
        $('#cancelButton').hide();
    });

    // Handle edit button click
    $('#teacherTable').on('click', '.editButton', function() {
        const row = $(this).closest('tr');
        const teacherId = row.data('id');
        const fullName = row.find('td:eq(1)').text();
        const email = row.find('td:eq(2)').text();
        const contact = row.find('td:eq(3)').text();
        const teacherCode = row.find('td:eq(4)').text();
        const address = row.find('td:eq(5)').text();
        const password = row.find('td:eq(6)').text();
        
        $('#teacherId').val(teacherId);
        $('#fullname').val(fullName);
        $('#email').val(email);
        $('#contact').val(contact);
        $('#teachercode').val(teacherCode);
        $('#address').val(address);
        $('#address').val(password);
        
        $('#saveButton').hide();
        $('#updateButton').show();
        $('#cancelButton').show();
    });

    // Handle delete button click
    $('#teacherTable').on('click', '.deleteButton', function() {
        const row = $(this).closest('tr');
        const teacherId = row.data('id');
        if (confirm('Are you sure you want to delete this teacher?')) {
            deleteTeacher(teacherId);
        }
    });

    // Load teachers on page load
    function loadTeachers() {
        $.ajax({
            url: 'http://localhost:8080/teacher',
            type: 'GET',
            success: function(response) {
                const tbody = $('#teacherTable tbody');
                tbody.empty(); // Clear existing rows
                response.forEach(teacher => {
                    tbody.append(
                        `<tr data-id="${teacher.tid}">
                            <td>${teacher.tid}</td>
                            <td>${teacher.fullname}</td>
                            <td>${teacher.email}</td>
                            <td>${teacher.contact}</td>
                            <td>${teacher.teacher_code}</td>
                            <td>${teacher.address}</td>
                            <td>${teacher.password}</td>
                            <td>
                                <button class="editButton">Edit</button>
                                <button class="deleteButton">Delete</button>
                            </td>
                        </tr>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading teachers:', error);
            }
        });
    }

    // Handle exit button click
    $('#exitButton').click(function() {
        if (confirm('Are you sure you want to exit this page?')) {
            window.location.href = 'index.html'; // Redirect to index.html
        }
    });

    loadTeachers();
});
