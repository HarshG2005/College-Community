import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeHero() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        // Geometries
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x10b981,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Inner solid core
        const coreGeometry = new THREE.IcosahedronGeometry(0.5, 0);
        const coreMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        scene.add(core);

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 200; // reduced for cleaner look
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 5;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02, // smaller dots
            color: 0x6b6b6b,
            transparent: true,
            opacity: 0.5
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x10b981, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xEED07A, 0.5); // Subtle BMSIT Gold accent
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);

        camera.position.z = 3;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Resize handler
        const handleResize = () => {
            if (!mountRef.current) return;
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate main sphere
            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.002;

            // Rotate core opposite
            core.rotation.x -= 0.004;
            core.rotation.y -= 0.004;

            // Rotate particles container slightly
            particlesMesh.rotation.y += 0.0005;

            // Mouse interaction easing
            sphere.rotation.x += mouseY * 0.01;
            sphere.rotation.y += mouseX * 0.01;

            // Gentle floating movement for core
            const time = Date.now() * 0.001;
            core.position.y = Math.sin(time) * 0.1;

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full absolute inset-0 pointer-events-none" />;
}
