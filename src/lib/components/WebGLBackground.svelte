<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let containerRef = $state(null);
  let animationId;
  let scene, camera, renderer, particles, shaderMaterial;
  let clock;

  onMount(async () => {
    if (!browser || !containerRef) return;

    // Dynamically import THREE to split it into a separate chunk and improve initial load time
    const THREE = await import('three');

    // 1. Setup WebGL Scene
    scene = new THREE.Scene();
    const PARTICLE_COUNT = 1500;
    const BASE_COLOR = new THREE.Color('#c9a84c');
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

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    clock = new THREE.Clock();
    animate();
  });

  const animate = () => {
    if (!renderer || !clock) return;
    animationId = requestAnimationFrame(animate);

    const elTime = clock.getElapsedTime();
    if (shaderMaterial) shaderMaterial.uniforms.uTime.value = elTime;

    // Smooth inertia mouse follow
    let targetX = mouseState.mouseX * 0.001;
    let targetY = mouseState.mouseY * 0.001;
    
    // Rotate entire particle cloud softly
    if (particles) {
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
    }
    
    // Mouse interaction parallax
    if (camera && scene) {
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (-targetY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
  };

  onDestroy(() => {
    // Cleanup listeners and WebGL resources
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    }
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer) renderer.dispose();
    if (scene) scene.clear();
  });

  // Event handlers declared in outer scope for onDestroy access
  let onMouseMove = (event) => {
    if (!browser) return;
    const halfX = window.innerWidth / 2;
    const halfY = window.innerHeight / 2;
    // Shared state update
    mouseState.mouseX = (event.clientX - halfX);
    mouseState.mouseY = (event.clientY - halfY);
  };

  let onResize = () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (shaderMaterial) shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  };

  let mouseState = { mouseX: 0, mouseY: 0 };
</script>

<div bind:this={containerRef} class="fixed inset-0 z-[-1] pointer-events-none bg-[#020202]"></div>
