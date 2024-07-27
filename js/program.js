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

    // Display the faculty name based on selected faculty ID
    $('#facultyId').change(function() {
        const facultyId = $(this).val();
        const facultyNameDisplay = $('#facultyNameDisplay');
        if (facultyId) {
            $.ajax({
                url: `http://localhost:8080/faculty/${facultyId}`,
                type: 'GET',
                success: function(response) {
                    facultyNameDisplay.text(`Faculty Name: ${response.faculty_name}`);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching faculty name:', error);
                }
            });
        } else {
            facultyNameDisplay.text('');
        }
    });

    // Function to add a program
    function addProgram(program) {
        $.ajax({
            url: 'http://localhost:8080/program',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(program),
            success: function(response) {
                const { program_id, faculty, program_code, program_name } = response;
                $('#programTable tbody').append(
                    `<tr data-id="${program_id}">
                        <td>${program_id}</td>
                        <td>${faculty.faculty_id}</td>
                        <td>${program_code}</td>
                        <td>${program_name}</td>
                        <td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td>
                    </tr>`
                );
                $('#programForm')[0].reset(); // Clear the form
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
                $('#facultyNameDisplay').text(''); // Clear faculty name display
            },
            error: function(xhr, status, error) {
                console.error('Error adding program:', error);
            }
        });
    }

    // Function to update a program
    function updateProgram(programId, program) {
        $.ajax({
            url: `http://localhost:8080/program/${programId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(program),
            success: function(response) {
                const { program_id, faculty, program_code, program_name } = response;
                const row = $('#programTable tbody').find(`tr[data-id="${programId}"]`);
                row.html(
                    `<td>${program_id}</td>
                     <td>${faculty.faculty_id}</td>
                     <td>${program_code}</td>
                     <td>${program_name}</td>
                     <td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td>`
                );
                $('#programForm')[0].reset(); // Clear the form
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
                $('#facultyNameDisplay').text(''); // Clear faculty name display
            },
            error: function(xhr, status, error) {
                console.error('Error updating program:', error);
            }
        });
    }

    // Function to delete a program
    function deleteProgram(programId) {
        $.ajax({
            url: `http://localhost:8080/program/${programId}`,
            type: 'DELETE',
            success: function(response) {
                $('#programTable tbody').find(`tr[data-id="${programId}"]`).remove();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting program:', error);
            }
        });
    }

    // Handle form submission for saving or updating
    $('#programForm').submit(function(event) {
        event.preventDefault();
        const program = {
            faculty: { faculty_id: $('#facultyId').val() },
            program_code: $('#programCode').val(),
            program_name: $('#programName').val()
        };
        const programId = $('#programId').val();
        if (programId) {
            updateProgram(programId, program);
        } else {
            addProgram(program);
        }
    });

    // Handle cancel button click
    $('#cancelButton').click(function() {
        $('#programForm')[0].reset(); // Clear the form
        $('#updateButton').hide();
        $('#saveButton').show();
        $('#cancelButton').hide();
        $('#facultyNameDisplay').text(''); // Clear faculty name display
    });

    // Handle edit button click
    $('#programTable').on('click', '.editButton', function() {
        const row = $(this).closest('tr');
        const programId = row.data('id');
        const facultyId = row.find('td:eq(1)').text();
        const programCode = row.find('td:eq(2)').text();
        const programName = row.find('td:eq(3)').text();
        $('#programId').val(programId);
        $('#facultyId').val(facultyId).trigger('change'); // Trigger change to update faculty name display
        $('#programCode').val(programCode);
        $('#programName').val(programName);
        $('#saveButton').hide();
        $('#updateButton').show();
        $('#cancelButton').show();
    });

    // Handle delete button click
    $('#programTable').on('click', '.deleteButton', function() {
        const row = $(this).closest('tr');
        const programId = row.data('id');
        if (confirm('Are you sure you want to delete this program?')) {
            deleteProgram(programId);
        }
    });

    // Load faculties and existing programs on page load
    loadFaculties();

    function loadPrograms() {
        $.ajax({
            url: 'http://localhost:8080/program',
            type: 'GET',
            success: function(response) {
                const tbody = $('#programTable tbody');
                tbody.empty(); // Clear existing rows
                response.forEach(program => {
                    tbody.append(
                        `<tr data-id="${program.program_id}">
                            <td>${program.program_id}</td>
                            <td>${program.faculty.faculty_id}</td>
                            <td>${program.program_code}</td>
                            <td>${program.program_name}</td>
                            <td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td>
                        </tr>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading programs:', error);
            }
        });
    }


    // Handle exit button click
    $('#exitButton').click(function() {
        if (confirm('Are you sure you want to exit this page?')) {
            window.location.href = 'index.html'; // Redirect to index.html
        }
    });

    loadPrograms();
});
