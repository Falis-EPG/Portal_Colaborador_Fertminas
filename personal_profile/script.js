document.addEventListener("DOMContentLoaded", function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('globe-canvas'), alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Aumentar o tamanho do globo
    const geometry = new THREE.SphereGeometry(11, 64, 64); // Aumentando o tamanho e a quantidade de segmentos para mais suavidade
    const material = new THREE.MeshPhongMaterial({
        color: 0x0000ff, // Azul fraco para o globo
        emissive: 0x01b4f9, // Cor de brilho
        emissiveIntensity: 0.6, // Intensidade do brilho
        wireframe: true
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);


    // Adicionar luz ambiente para garantir que o globo seja visível
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Adicionar luz de ponto para destacar o brilho
    const pointLight = new THREE.PointLight(0x01b4f9, 1, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 20; // Ajuste a posição da câmera para acomodar o globo maior

    const animate = function () {
        requestAnimationFrame(animate);

        // Girar mais devagar
        globe.rotation.x += 0.001;
        globe.rotation.y += 0.001;

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
});
