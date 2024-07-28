// Initialisation de la scène, de la caméra et du renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajout d'une lumière
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Création du joueur (un cube pour l'instant)
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

camera.position.z = 5;

// Variables pour les niveaux de survie
let level = 1;
let enemies = [];
const maxLevels = 10;

function createEnemy() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(geometry, material);
    enemy.position.x = Math.random() * 10 - 5;
    enemy.position.y = Math.random() * 10 - 5;
    enemies.push(enemy);
    scene.add(enemy);
}

function startLevel() {
    enemies.forEach(enemy => scene.remove(enemy));
    enemies = [];
    for (let i = 0; i < level; i++) {
        createEnemy();
    }
}

function update() {
    // Mise à jour des ennemis (déplacement simple)
    enemies.forEach(enemy => {
        enemy.position.z += 0.01;
        if (enemy.position.z > 5) {
            // Si un ennemi dépasse le joueur, il a perdu
            alert('Game Over');
            level = 1;
            startLevel();
        }
    });

    // Si tous les ennemis sont éliminés, passer au niveau suivant
    if (enemies.length === 0) {
        level++;
        if (level > maxLevels) {
            alert('You win!');
            level = 1;
        }
        startLevel();
    }
}

function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// Démarrer le premier niveau
startLevel();
animate();

// Ajout des contrôles du joueur
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            player.position.y += 0.1;
            break;
        case 'ArrowDown':
            player.position.y -= 0.1;
            break;
        case 'ArrowLeft':
            player.position.x -= 0.1;
            break;
        case 'ArrowRight':
            player.position.x += 0.1;
            break;
        case ' ':
            // Tirer (supprimer les ennemis proches)
            enemies = enemies.filter(enemy => {
                if (enemy.position.distanceTo(player.position) < 1) {
                    scene.remove(enemy);
                    return false;
                }
                return true;
            });
            break;
    }
});
