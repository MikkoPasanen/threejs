//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

//Keep the 3D models
let deathstar;
let stardestroyer;
let mc80;

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the deathstar file
loader.load(
    `models/deathstar/scene.gltf`,
    function (gltf) {
        deathstar = gltf.scene;
        deathstar.rotation.x = 0.7;
        deathstar.position.z = -200;
        deathstar.position.x = -400;
        deathstar.position.y = 200;
        scene.add(deathstar);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
        console.error(error);
    }
);

//Load the stardestroyer file
loader.load(
    `models/stardestroyer/scene.gltf`,
    function (gltf) {
        stardestroyer = gltf.scene;
        stardestroyer.scale.set(2, 2, 2);
        stardestroyer.rotation.x = 0.1;
        stardestroyer.rotation.y = 2;
        stardestroyer.rotation.z = 0.2;
        stardestroyer.position.z = 230;
        stardestroyer.position.y = -20;
        stardestroyer.position.x = 100;
        scene.add(stardestroyer);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
        console.error(error);
    }
);

//Load the mc80 file
loader.load(
    `models/mc80/scene.gltf`,
    function (gltf) {
        mc80 = gltf.scene;
        mc80.scale.set(0.03, 0.03, 0.03);
        mc80.rotation.x = 0.1;
        mc80.rotation.y = 2;
        mc80.rotation.z = 0.2;
        mc80.position.z = 250;
        mc80.position.y = -55;
        mc80.position.x = 0;
        scene.add(mc80);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
        console.error(error);
    }
);


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = 300;
camera.position.y = -50;
camera.position.x = 50;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.PointLight(0xffffff, 2); // (color, intensity)
topLight.position.set(0, -200, 200);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.5
);
scene.add(ambientLight);

// Add controls to the camera
const controls = new OrbitControls(camera, renderer.domElement);

//Render the scene
function animate() {
    requestAnimationFrame(animate);
    deathstar.rotation.y += 0.001;

    updateLasers();

    controls.update();

    renderer.render(scene, camera);
}

let lasers = [];

function shootLaser1() {
    const laserGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);
    const laserMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const laser = new THREE.Mesh(laserGeometry, laserMaterial);
    laser.position.set(100, -20, 230);
    laser.rotation.x = 8;
    laser.rotation.y = 60;
    laser.rotation.z = 5;
    scene.add(laser);
    lasers.push(laser);
}

function shootLaser2() {
    const laserGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);
    const laserMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const laser = new THREE.Mesh(laserGeometry, laserMaterial);
    laser.position.set(105, -25, 230);
    laser.rotation.x = 8;
    laser.rotation.y = 60;
    laser.rotation.z = 5;
    scene.add(laser);
    lasers.push(laser);
}

function updateLasers() {
    lasers.forEach((laser, index) => {
        laser.position.x -= 0.3;
        laser.position.y -= 0.1;
        laser.position.z -= -0.05;
        if (laser.position.y < -55) {
            scene.remove(laser);
            lasers.splice(index, 1);
        }
    });
}
let firstLaser = true;
setInterval(() => {
    if (firstLaser) {
        shootLaser1();
        firstLaser = false;
    }
    else {
        shootLaser2();
        firstLaser = true;
    }
}, 1000);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(600));

    star.position.set(x, y, z);
    scene.add(star);
}

Array(400).fill().forEach(addStar);

//Start the 3D rendering
animate();
