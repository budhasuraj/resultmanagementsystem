$(document).ready(function() {
    // Function to add a new subject
    function addSubject(subject) {
        $.ajax({
            url: 'http://localhost:8080/subject',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(subject),
            success: function(response) {
                $('#subjectTable tbody').append(
                    `<tr data-id="${response.sub_id}">
                        <td>${response.sub_id}</td>
                        <td>${response.subject_name}</td>
                        <td>${response.subject_code}</td>
                        <td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td>
                    </tr>`
                );
                $('#subjectForm')[0].reset(); // Clear the form
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error adding subject:', error);
            }
        });
    }

    // Function to update an existing subject
    function updateSubject(subjectId, subject) {
        $.ajax({
            url: `http://localhost:8080/subject/${subjectId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(subject),
            success: function(response) {
                const row = $('#subjectTable tbody').find(`tr[data-id="${subjectId}"]`);
                row.html(
                    `<td>${response.sub_id}</td>
                     <td>${response.subject_name}</td>
                     <td>${response.subject_code}</td>
                     <td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td>`
                );
                $('#subjectForm')[0].reset(); // Clear the form
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error updating subject:', error);
            }
        });
    }

    // Function to delete a subject
    function deleteSubject(subjectId) {
        $.ajax({
            url: `http://localhost:8080/subject/${subjectId}`,
            type: 'DELETE',
            success: function(response) {
                $('#subjectTable tbody').find(`tr[data-id="${subjectId}"]`).remove();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting subject:', error);
            }
        });
    }

    // Handle form submission for saving or updating
    $('#subjectForm').submit(function(event) {
        event.preventDefault();
        const subject = {
            subject_name: $('#subjectName').val(),
            subject_code: $('#subjectCode').val()
        };
        const subjectId = $('#subjectId').val();
        if (subjectId) {
            updateSubject(subjectId, subject);
        } else {
            addSubject(subject);
        }
    });

    // Handle cancel button click
    $('#cancelButton').click(function() {
        $('#subjectForm')[0].reset(); // Clear the form
        $('#updateButton').hide();
        $('#saveButton').show();
        $('#cancelButton').hide();
    });

    // Handle edit button click
    $('#subjectTable').on('click', '.editButton', function() {
        const row = $(this).closest('tr');
        const subjectId = row.data('id');
        const subjectName = row.find('td:eq(1)').text();
        const subjectCode = row.find('td:eq(2)').text();
        $('#subjectId').val(subjectId);
        $('#subjectName').val(subjectName);
        $('#subjectCode').val(subjectCode);
        $('#saveButton').hide();
        $('#updateButton').show();
        $('#cancelButton').show();
    });

    // Handle delete button click
    $('#subjectTable').on('click', '.deleteButton', function() {
        const row = $(this).closest('tr');
        const subjectId = row.data('id');
        if (confirm('Are you sure you want to delete this subject?')) {
            deleteSubject(subjectId);
        }
    });

    // Load subjects on page load
    function loadSubjects() {
        $.ajax({
            url: 'http://localhost:8080/subject',
            type: 'GET',
            success: function(response) {
                const tbody = $('#subjectTable tbody');
                tbody.empty(); // Clear existing rows
                response.forEach(subject => {
                    tbody.append(
                        `<tr data-id="${subject.sub_id}">
                            <td>${subject.sub_id}</td>
                            <td>${subject.subject_name}</td>
                            <td>${subject.subject_code}</td>
                            <td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td>
                        </tr>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading subjects:', error);
            }
        });
    }

    // Handle exit button click
    $('#exitButton').click(function() {
        if (confirm('Are you sure you want to exit this page?')) {
            window.location.href = 'index.html'; // Redirect to index.html
        }
    });

    loadSubjects();
});
