<template>
  <div ref="canvasContainer" :class="containerClass" :style="{ height: containerHeight }">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  containerClass: {
    type: String,
    default: 'absolute top-0 left-0 w-full'
  },
  containerHeight: {
    type: String,
    default: '100%'
  },
  speedFactor: {
    type: Number,
    default: 10
  },
  numPoints: {
    type: Number,
    default: 100
  },
  maxDistance: {
    type: Number,
    default: 100
  }
});

const canvasContainer = ref(null);
const canvas = ref(null);
const localSpeedFactor = ref(props.speedFactor);
const localNumPoints = ref(props.numPoints);
const localMaxDistance = ref(props.maxDistance);

onMounted(() => {
  if (process.client) {
    createAnimation();
  }
});

watch([() => props.speedFactor, () => props.numPoints, () => props.maxDistance], 
  ([newSpeedFactor, newNumPoints, newMaxDistance]) => {
    localSpeedFactor.value = newSpeedFactor;
    localNumPoints.value = newNumPoints;
    localMaxDistance.value = newMaxDistance;
    if (process.client) {
      createAnimation();
    }
  }
);

function createAnimation() {
  const ctx = canvas.value.getContext('2d');
  const width = canvasContainer.value.offsetWidth;
  const height = canvasContainer.value.offsetHeight;
  canvas.value.width = width;
  canvas.value.height = height;

  const points = [];

  for (let i = 0; i < localNumPoints.value; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() * 2 - 1) * localSpeedFactor.value,
      vy: (Math.random() * 2 - 1) * localSpeedFactor.value
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();

      for (let j = i + 1; j < points.length; j++) {
        const p2 = points[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < localMaxDistance.value) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / localMaxDistance.value})`;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}
</script>
