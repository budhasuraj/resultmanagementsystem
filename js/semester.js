$(document).ready(function() {
    // Function to add a semester
    function addSemester(semesterCode, semesterName) {
        $.ajax({
            url: 'http://localhost:8080/semester',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ semester_code: semesterCode, semester: semesterName }),
            success: function(response) {
                $('#semesterTable tbody').append(
                    '<tr data-id="' + response.semester_id + '"><td>' + response.semester_id + '</td><td>' + response.semester_code + '</td><td>' + response.semester + '</td><td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td></tr>'
                );
                $('#semestercode').val(''); // Clear the input fields
                $('#semester').val('');
            },
            error: function(xhr, status, error) {
                console.error('Error adding semester:', error); // Log the error
            }
        });
    }

    // Function to update a semester
    function updateSemester(semesterId, semesterCode, semesterName) {
        $.ajax({
            url: 'http://localhost:8080/semester/' + semesterId,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ semester_code: semesterCode, semester: semesterName }),
            success: function(response) {
                const row = $('#semesterTable tbody').find('tr[data-id="' + semesterId + '"]');
                row.find('td:eq(1)').text(response.semester_code);
                row.find('td:eq(2)').text(response.semester_name);
                $('#semestercode').val(''); // Clear the input fields
                $('#semester').val('');
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error updating semester:', error); // Log the error
            }
        });
    }

    // Function to delete a semester
    function deleteSemester(semesterId) {
        $.ajax({
            url: 'http://localhost:8080/semester/' + semesterId,
            type: 'DELETE',
            success: function(response) {
                $('#semesterTable tbody').find('tr[data-id="' + semesterId + '"]').remove();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting semester:', error); // Log the error
            }
        });
    }

    // Handle form submission for saving or updating
    $('#semesterForm').submit(function(event) {
        event.preventDefault();
        const semesterCode = $('#semestercode').val();
        const semesterName = $('#semester').val();
        const semesterId = $('#semesterId').val();
        if (semesterCode && semesterName) {
            if ($('#saveButton').is(':visible')) {
                addSemester(semesterCode, semesterName);
            } else if ($('#updateButton').is(':visible')) {
                updateSemester(semesterId, semesterCode, semesterName);
            }
        } else {
            alert('Please enter both semester code and semester name.');
        }
    });

    // Handle cancel button click
    $('#cancelButton').click(function() {
        $('#semestercode').val(''); // Clear the input fields
        $('#semester').val('');
        $('#updateButton').hide();
        $('#saveButton').show();
        $('#cancelButton').hide();
    });

    // Handle edit button click
    $('#semesterTable').on('click', '.editButton', function() {
        const row = $(this).closest('tr');
        const semesterId = row.data('id');
        const semesterCode = row.find('td:eq(1)').text();
        const semesterName = row.find('td:eq(2)').text();
        $('#semesterId').val(semesterId);
        $('#semestercode').val(semesterCode);
        $('#semester').val(semesterName);
        $('#saveButton').hide();
        $('#updateButton').show();
        $('#cancelButton').show();
    });

    // Handle delete button click
    $('#semesterTable').on('click', '.deleteButton', function() {
        const row = $(this).closest('tr');
        const semesterId = row.data('id');
        if (confirm('Are you sure you want to delete this semester?')) {
            deleteSemester(semesterId);
        }
    });



    // Handle exit button click
    $('#exitButton').click(function() {
        $('#facultyName').val(''); // Clear the input field
        if (confirm('Are you sure you want to exit this page?')) {
            window.location.href = 'index.html'; // Redirect to index.html
        }
    });




    // Function to load the list of semesters
    function loadSemesters() {
        $.ajax({
            url: 'http://localhost:8080/semester',
            type: 'GET',
            success: function(response) {
                response.forEach(semester => {
                    $('#semesterTable tbody').append(
                        '<tr data-id="' + semester.semester_id + '"><td>' + semester.semester_id + '</td><td>' + semester.semester_code + '</td><td>' + semester.semester + '</td><td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td></tr>'
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading semesters:', error); // Log the error
            }
        });
    }

    // Load semesters on page load
    loadSemesters();
});
