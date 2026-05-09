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
    
// Background starfield setup
const bgCanvas = document.getElementById('bg');
if (bgCanvas) {
    // Create scene for background
    const bgScene = new THREE.Scene();
    
    // Create camera
    const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    bgCamera.position.z = 5;
    
    // Create renderer
    const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: true });
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    bgRenderer.setClearColor(0x000011); // Dark blue-black space color
    
    // Create stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;     // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    bgScene.add(stars);
    
    // Animation function for background
    function animateBackground() {
        requestAnimationFrame(animateBackground);
        
        // Slowly rotate stars for subtle movement
        stars.rotation.x += 0.0005;
        stars.rotation.y += 0.0005;
        
        bgRenderer.render(bgScene, bgCamera);
    }
    
    // Handle window resize for background
    window.addEventListener('resize', function() {
        bgCamera.aspect = window.innerWidth / window.innerHeight;
        bgCamera.updateProjectionMatrix();
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Start background animation
    animateBackground();
}

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