document.addEventListener("DOMContentLoaded", function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = Math.random() * 800 - 400;
        particlePositions[i * 3 + 1] = Math.random() * 800 - 400;
        particlePositions[i * 3 + 2] = Math.random() * 800 - 400;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('file://192.168.0.2/Arquivos/Departamentos/19%20-%20Tecnologia%20e%20Informa%C3%A7%C3%A3o/Erick/arquivos%20pessoais/PortfolioWebPage/pexels-enginakyurt-2092075.jpg');

    const pMaterial = new THREE.PointsMaterial({
        color: 0x01b4f9,
        size: 4,
        map: particleTexture,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    camera.position.z = 1000;

    const animate = function () {
        requestAnimationFrame(animate);

        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 1] -= 1; // Mover para baixo
            if (positions[i * 3 + 1] < -400) {
                positions[i * 3 + 1] = 400; // Reiniciar posição no topo
            }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
});
