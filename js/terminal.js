$(document).ready(function() {
    // Function to add a terminal
    function addTerminal(terminalName) {
        $.ajax({
            url: 'http://localhost:8080/terminal',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ terminal_name: terminalName }),
            success: function(response) {
                $('#terminalTable tbody').append(
                    '<tr data-id="' + response.terminal_id + '"><td>' + response.terminal_id + '</td><td>' + response.terminal_name + '</td><td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td></tr>'
                );
                $('#terminalName').val(''); // Clear the input field
            },
            error: function(xhr, status, error) {
                console.error('Error adding terminal:', error);
            }
        });
    }

    // Function to update a terminal
    function updateTerminal(terminalId, terminalName) {
        $.ajax({
            url: 'http://localhost:8080/terminal/' + terminalId,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ terminal_name: terminalName }),
            success: function(response) {
                const row = $('#terminalTable tbody').find('tr[data-id="' + terminalId + '"]');
                row.find('td:eq(1)').text(response.terminal_name);
                $('#terminalName').val(''); // Clear the input field
                $('#termId').val(''); // Clear the hidden input field
                $('#updateButton').hide();
                $('#saveButton').show();
                $('#cancelButton').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error updating terminal:', error);
            }
        });
    }

    // Function to delete a terminal
    function deleteTerminal(terminalId) {
        $.ajax({
            url: 'http://localhost:8080/terminal/' + terminalId,
            type: 'DELETE',
            success: function(response) {
                $('#terminalTable tbody').find('tr[data-id="' + terminalId + '"]').remove();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting terminal:', error);
            }
        });
    }

    // Handle form submission for saving or updating
    $('#terminalForm').submit(function(event) {
        event.preventDefault();
        const terminalName = $('#terminalName').val();
        const terminalId = $('#termId').val();
        if (terminalName) {
            if ($('#saveButton').is(':visible')) {
                addTerminal(terminalName);
            } else if ($('#updateButton').is(':visible')) {
                updateTerminal(terminalId, terminalName);
            }
        } else {
            alert('Please enter a terminal name.');
        }
    });

    // Handle cancel button click
    $('#cancelButton').click(function() {
        $('#terminalName').val(''); // Clear the input field
        $('#termId').val(''); // Clear the hidden input field
        $('#updateButton').hide();
        $('#saveButton').show();
        $('#cancelButton').hide();
    });

    // Handle edit button click
    $('#terminalTable').on('click', '.editButton', function() {
        const row = $(this).closest('tr');
        const terminalId = row.data('id');
        const terminalName = row.find('td:eq(1)').text();
        $('#termId').val(terminalId);
        $('#terminalName').val(terminalName);
        $('#saveButton').hide();
        $('#updateButton').show();
        $('#cancelButton').show();
    });

    // Handle delete button click
    $('#terminalTable').on('click', '.deleteButton', function() {
        const row = $(this).closest('tr');
        const terminalId = row.data('id');
        if (confirm('Are you sure you want to delete this terminal?')) {
            deleteTerminal(terminalId);
        }
    });

    // Function to load the list of terminals
    function loadTerminals() {
        $.ajax({
            url: 'http://localhost:8080/terminal',
            type: 'GET',
            success: function(response) {
                response.forEach(terminal => {
                    $('#terminalTable tbody').append(
                        '<tr data-id="' + terminal.terminal_id + '"><td>' + terminal.terminal_id + '</td><td>' + terminal.terminal_name + '</td><td><button class="editButton">Edit</button> <button class="deleteButton">Delete</button></td></tr>'
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading terminals:', error);
            }
        });
    }

    // Handle exit button click
    $('#exitButton').click(function() {
        if (confirm('Are you sure you want to exit this page?')) {
            window.location.href = 'index.html'; // Redirect to index.html
        }
    });

    // Load terminals on page load
    loadTerminals();
});
