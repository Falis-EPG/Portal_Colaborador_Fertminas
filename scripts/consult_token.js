document.addEventListener("DOMContentLoaded", function() {
    const token = sessionStorage.getItem('userToken');
    if (token) {
        fetch('http://3.226.151.106:5000/verify_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                window.location.href = '../../index.html'; // Redireciona para a tela de login se o token não for válido
                alert('token de acesso invalido')
            } else {
                const sidebar = document.querySelector('.links-sidebar ul');

                console.log(data.buttons)

                // Adicionar botões da permissão "ti" na barra lateral
                if (data.buttons && data.buttons.length > 0) {
                    data.buttons.forEach(button => {
                        const li = document.createElement('li');
                        li.className = 'btn_sidebar';
                        li.textContent = button.name;
                        console.log(buttons.name)
                        const a = document.createElement('a');
                        a.href = button.link;
                        a.appendChild(li);
                        sidebar.appendChild(a);
                    });
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error);
            window.location.href = '../../index.html'; // Redireciona para a tela de login em caso de erro
        });
    } else {
        window.location.href = '../../index.html'; // Redireciona para a tela de login se não houver token
    }
});
