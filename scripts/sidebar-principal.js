document.addEventListener("DOMContentLoaded", function() {
    // Cria a estrutura da barra de navegação lateral
    const sidebarHTML = `
        <div class="sidebar">
            <button class="close-btn" onclick="toggleSidebar()">&#9776;</button>
            <nav class="links-sidebar">
                <ul id="sidebar-list"><br><br>
                    <a href="#section1"><li class="btn_sidebar">Em Breve</li></a>
                    <a href="#section1"><li class="btn_sidebar">Em Breve</li></a>
                    <a href="#section1"><li class="btn_sidebar">Em Breve</li></a>
                    <a href="https://app.pipefy.com/portals/41bee44f-d5ca-41fa-b7b2-0cc3e21501a3"><li class="btn_sidebar">Chamados PipeFy</li></a>
                    <a href="../../index.html"><li class="btn_sidebar">Sair</li></a>
                </ul>
            </nav>
        </div>
    `;

    // Insere a barra de navegação lateral no elemento com id "sidebar"
    document.getElementById('sidebar').innerHTML = sidebarHTML;

    // Adiciona os botões dinamicamente após a inserção do HTML
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
            console.log('Dados Recebidos do Servidor:', data)
            if (!data.success) {
                window.location.href = '../../index.html'; // Redireciona para a tela de login se o token não for válido
                alert('token de acesso invalido');
            } else {
                const sidebar = document.querySelector('#sidebar-list'); // Certifique-se de que este é o id correto
                console.log('SideBar Encontrada', sidebar)
                // Adicionar botões da permissão "ti" na barra lateral
                console.log('Tipo de data.buttos', typeof data.buttons);
                console.log('Conteúdo de data.buttons', data.buttons);
                if (data.buttons && data.buttons.length > 0) {
                    data.buttons.forEach(button => {
                        console.log('Adicionando botão', button);
                        const li = document.createElement('li');
                        li.className = 'btn_sidebar';
                        li.textContent = button.name;
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

// Função para alternar a visibilidade da barra lateral
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}
