<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import * as THREE from 'three';

  let containerRef = $state(null);
  let animationId;
  let scene, camera, renderer, particles, shaderMaterial;
  let clock;

  const PARTICLE_COUNT = 1500;
  const BASE_COLOR = new THREE.Color('#c9a84c'); // Our primary accent

  onMount(() => {
    if (!browser || !containerRef) return;

    // 1. Setup WebGL Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.appendChild(renderer.domElement);

    // 2. Create Particles geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const opacities = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribute randomly in a sphere-like volume
      const radius = 100 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Varying starting opacity
      opacities[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

    // 3. Custom Shader Material
    shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: BASE_COLOR },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        uniform float uTime;
        attribute float aOpacity;
        varying float vOpacity;
        void main() {
          vOpacity = aOpacity;
          vec3 pos = position;
          // Subtle wave motion
          pos.y += sin(uTime * 0.5 + pos.x * 0.05) * 2.0;
          pos.x += cos(uTime * 0.3 + pos.y * 0.05) * 2.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          // Size attenuation based on depth to create 3D cinematic feel
          gl_PointSize = (12.0 * (1.0 + aOpacity)) * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        varying float vOpacity;
        void main() {
          // Draw soft circle
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          // Soft glowing edge
          float alpha = (0.5 - dist) * 2.0;
          // Add subtle pulsing based on time and individual offset
          float pulse = sin(uTime + vOpacity * 10.0) * 0.5 + 0.5;
          // Keep overall opacity extremely subtle
          gl_FragColor = vec4(uColor, alpha * pulse * 0.15);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, shaderMaterial);
    scene.add(particles);

    // 4. Interactive mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event) => {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      mouseX = (event.clientX - halfX);
      mouseY = (event.clientY - halfY);
    };

    const onResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    // 5. Render loop
    clock = new THREE.Clock();

    const animate = () => {
      if (!renderer) return;
      animationId = requestAnimationFrame(animate);

      const elTime = clock.getElapsedTime();
      shaderMaterial.uniforms.uTime.value = elTime;

      // Smooth inertia mouse follow
      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;
      
      // Rotate entire particle cloud softly
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      
      // Mouse interaction parallax
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (-targetY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer) renderer.dispose();
      if (scene) scene.clear();
    };
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer) renderer.dispose();
  });
</script>

<div bind:this={containerRef} class="fixed inset-0 z-[-1] pointer-events-none bg-[#020202]"></div>
