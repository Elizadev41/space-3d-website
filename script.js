// Three.js 3D Planets Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Planet data with container IDs and texture paths
    const planets = [
        { name: 'mercury', container: 'mercury-container', texture: 'textures/72-the-solar-system/The Solar System/tex/mercury.jpg' },
        { name: 'venus', container: 'venus-container', texture: 'textures/72-the-solar-system/The Solar System/tex/Venus.jpg' },
        { name: 'earth', container: 'earth-container', texture: 'textures/72-the-solar-system/The Solar System/tex/Earth Map.jpg' },
        { name: 'mars', container: 'mars-container', texture: 'textures/72-the-solar-system/The Solar System/tex/mars.jpg' },
        { name: 'jupiter', container: 'jupiter-container', texture: 'textures/72-the-solar-system/The Solar System/tex/Jupitar.jpg' },
        { name: 'saturn', container: 'saturn-container', texture: 'textures/72-the-solar-system/The Solar System/tex/saturn.jpg' },
        { name: 'uranus', container: 'uranus-container', texture: 'textures/72-the-solar-system/The Solar System/tex/uranus.jpg' },
        { name: 'neptune', container: 'neptune-container', texture: 'textures/72-the-solar-system/The Solar System/tex/neptune.jpg' }
    ];

    // Store scenes and renderers for each planet
    const planetScenes = {};

    function initPlanet(planetName, containerId, texturePath) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }

        // Create scene
        const scene = new THREE.Scene();

        // Create camera
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 2;

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        container.appendChild(renderer.domElement);

        // Load texture and create planet
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            texturePath,
            function(texture) {
                // Create sphere geometry
                const geometry = new THREE.SphereGeometry(1, 32, 32);

                // Create material with texture
                const material = new THREE.MeshBasicMaterial({ map: texture });

                // Create mesh
                const sphere = new THREE.Mesh(geometry, material);
                scene.add(sphere);

                // Store references
                planetScenes[containerId] = {
                    scene: scene,
                    camera: camera,
                    renderer: renderer,
                    sphere: sphere,
                    container: container
                };

                // Start animation
                animate(containerId);
            },
            undefined, // onProgress
            function(error) {
                console.error(`Error loading texture for ${containerId}:`, error);
                // Create fallback sphere with solid color
                const geometry = new THREE.SphereGeometry(1, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
                const sphere = new THREE.Mesh(geometry, material);
                scene.add(sphere);

                planetScenes[containerId] = {
                    scene: scene,
                    camera: camera,
                    renderer: renderer,
                    sphere: sphere,
                    container: container
                };

                animate(containerId);
            }
        );

        // Handle container resize
        const resizeObserver = new ResizeObserver(function() {
            if (planetScenes[containerId]) {
                const data = planetScenes[containerId];
                data.camera.aspect = container.clientWidth / container.clientHeight;
                data.camera.updateProjectionMatrix();
                data.renderer.setSize(container.clientWidth, container.clientHeight);
            }
        });
        resizeObserver.observe(container);
    }

    function animate(containerId) {
        const data = planetScenes[containerId];
        if (!data) return;

        requestAnimationFrame(function() { animate(containerId); });

        // Rotate the planet
        if (data.sphere) {
            data.sphere.rotation.y += 0.005;
        }

        // Render the scene
        data.renderer.render(data.scene, data.camera);
    }

    // Initialize all planets
    planets.forEach(function(planet) {
        initPlanet(planet.name, planet.container, planet.texture);
    });
});