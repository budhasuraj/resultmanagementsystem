// Base API URL for student signups
const apiUrl = 'http://localhost:8080/studentsignup';

// Variable to store the fetched teacher data
let teachers = [];

// Variable to store the fetched student signups
let studentSignups = [];

// Function to load teachers from the API
function loadTeachers() {
    $.ajax({
        url: 'http://localhost:8080/teacher',
        type: 'GET',
        success: function(response) {
            teachers = response; // Store the fetched teachers in a variable
        },
        error: function(xhr, status, error) {
            console.error('Error loading teachers:', error);
        }
    });
}

// Function to load student signups from the API
function loadStudentSignups() {
    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function (response) {
            console.log('Loaded student signups:', response); // Log the response
            studentSignups = response; // Store the fetched student signups
        },
        error: function (xhr, status, error) {
            console.error('Error loading student signups:', error);
        }
    });
}

// Function to handle the login form submission
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the email and password match Superadmin credentials
    if (email === 'Super@admin.com' && password === 'admin') {
        // Successfully logged in as admin
        document.getElementById('message').textContent = 'Login successful!';
        // Store login state and user type in localStorage
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userType', 'admin');
        // Redirect to index.html
        window.location.href = 'index.html';
        return;
    }

    // Check if the email and password match any teacher
    const teacher = teachers.find(t => t.email === email && t.password === password);
    if (teacher) {
        // Successfully logged in as teacher
        document.getElementById('message').textContent = 'Login successful!';
        // Store login state and user type in localStorage
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userType', 'teacher');
        // Redirect to index.html
        window.location.href = 'index.html';
        return;
    }

    // Check if the email and password match any student signup
    const student = studentSignups.find(s => s.username === email && s.password === password);
    if (student) {
        // Successfully logged in as student
        document.getElementById('message').textContent = 'Login successful!';
        // Store login state and user type in localStorage
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userType', 'student');
        // Redirect to index.html
        window.location.href = 'index.html';
        return;
    }

    // Login failed
    document.getElementById('message').textContent = 'Invalid credentials';
}

// Function to handle the exit button click
function handleExit() {
    const confirmExit = confirm('Are you sure you want to exit this page?');
    if (confirmExit) {
        window.close();
    }
}


document.getElementById('signupButton').addEventListener('click', function() {
    const confirmExit = confirm('Are you sure you want to sign up?');
    if (confirmExit) {
        window.location.href = 'signup.html';
    }
});

// Initialize the page
$(document).ready(function() {
    loadTeachers(); // Load teachers data when the page is ready
    loadStudentSignups(); // Load student signups data when the page is ready

    // Attach event listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('exitButton').addEventListener('click', handleExit);
});
