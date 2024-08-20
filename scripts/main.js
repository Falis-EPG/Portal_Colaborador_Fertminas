document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch('http://3.226.151.106:5000/login_portal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            sessionStorage.setItem('userToken', data.token.token);
            window.location.href = '../pages/General/general.html'; // Redirect to another page
        } else {
            document.getElementById("responseMessage").textContent = data.message;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
