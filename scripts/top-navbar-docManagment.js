document.addEventListener("DOMContentLoaded", function() {
    // Cria a estrutura da barra de navegação
    const navbarHTML = `
        <nav class="navbar">
            <ul class="navbar-list">
                <li class="navbar-item"><a href="politicas.html">Políticas</a></li>
                <li class="navbar-item"><a href="#">POP's</a></li>
                <li class="navbar-item"><a href="#">Processos</a></li>
                <li class="navbar-item"><a href="#">Externos</a></li>
            </ul>
        </nav>
    `;

    // Insere a barra de navegação no elemento com id "top-navbar"
    document.getElementById('top-navbar').innerHTML = navbarHTML;
});
