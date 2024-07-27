$(document).ready(function() {
    function checkLoginState() {
        const loggedIn = localStorage.getItem('loggedIn') === 'true';
        const userType = localStorage.getItem('userType');

        // Hide all links initially
        $('.navigation a').hide();

        if (loggedIn) {
            if (userType === 'admin') {
                // Show all links for admin
                $('.navigation a').show();
            } else if (userType === 'teacher') {
                // Show only 'Add Marks' link for teachers
                $('#marksLink').show();
            }
        }
    }

    // Call the function to set the link visibility based on login state
    checkLoginState();

    // Logout functionality
    $('#logoutButton').on('click', function() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userType');
        window.location.href = 'resultapp.html'; // Redirect to login page
    });
});
