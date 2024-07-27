$(document).ready(function() {
    // Function to add a faculty
    function addFaculty(facultyName) {
        $.ajax({
            url: 'http://localhost:8080/faculty',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ faculty_name: facultyName }),
            success: function(response) {
                $('#facultyTable tbody').append(
                    '<tr data-id="' + response.faculty_id + '"><td>' + response.faculty_id + '</td><td>' + response.faculty_name + '</td><td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td></tr>'
                );
                $('#facultyName').val(''); // Clear the input field
            },
            error: function(xhr, status, error) {
                console.error('Error adding faculty:', error); // Log the error
            }
        });
    }

    // Function to update a faculty
    function updateFaculty(facultyId, facultyName) {
        $.ajax({
            url: 'http://localhost:8080/faculty/' + facultyId,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ faculty_name: facultyName }),
            success: function(response) {
                const row = $('#facultyTable tbody').find('tr[data-id="' + facultyId + '"]');
                row.find('td:eq(1)').text(response.faculty_name);
                $('#facultyName').val(''); // Clear the input field
                $('#facultyId').val(''); // Clear the hidden input field
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error updating faculty:', error); // Log the error
            }
        });
    }

    // Function to delete a faculty
    function deleteFaculty(facultyId) {
        $.ajax({
            url: 'http://localhost:8080/faculty/' + facultyId,
            type: 'DELETE',
            success: function(response) {
                $('#facultyTable tbody').find('tr[data-id="' + facultyId + '"]').remove();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting faculty:', error); // Log the error
            }
        });
    }

    // Handle form submission for saving or updating
    $('#facultyForm').submit(function(event) {
        event.preventDefault();
        const facultyName = $('#facultyName').val();
        const facultyId = $('#facultyId').val();
        if (facultyName) {
            if ($('#saveButton').is(':visible')) {
                addFaculty(facultyName);
            } else if ($('#updateButton').is(':visible')) {
                updateFaculty(facultyId, facultyName);
            }
        } else {
            alert('Please enter a faculty name.');
        }
    });

    // Handle cancel button click
    $('#cancelButton').click(function() {
        $('#facultyName').val(''); // Clear the input field
        $('#facultyId').val(''); // Clear the hidden input field
        $('#updateButton').hide();
        $('#saveButton').show();
        $('#cancelButton').hide();
    });

    // Handle edit button click
    $('#facultyTable').on('click', '.editButton', function() {
        const row = $(this).closest('tr');
        const facultyId = row.data('id');
        const facultyName = row.find('td:eq(1)').text();
        $('#facultyId').val(facultyId);
        $('#facultyName').val(facultyName);
        $('#saveButton').hide();
        $('#updateButton').show();
        $('#cancelButton').show();
    });

    // Handle delete button click
    $('#facultyTable').on('click', '.deleteButton', function() {
        const row = $(this).closest('tr');
        const facultyId = row.data('id');
        if (confirm('Are you sure you want to delete this faculty?')) {
            deleteFaculty(facultyId);
        }
    });


     // Handle exit button click
     $('#exitButton').click(function() {
        $('#formContainer').hide(); // Hide the form container
    });




    // Handle exit button click
    $('#exitButton').click(function() {
        $('#facultyName').val(''); // Clear the input field
        if (confirm('Are you sure you want to exit this page?')) {
            window.location.href = 'index.html'; // Redirect to index.html
        }
    });




    // Function to load the list of faculties
    function loadFaculties() {
        $.ajax({
            url: 'http://localhost:8080/faculty',
            type: 'GET',
            success: function(response) {
                response.forEach(faculty => {
                    $('#facultyTable tbody').append(
                        '<tr data-id="' + faculty.faculty_id + '"><td>' + faculty.faculty_id + '</td><td>' + faculty.faculty_name + '</td><td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td></tr>'
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading faculties:', error); // Log the error
            }
        });
    }

    // Load faculties on page load
    loadFaculties();
});
