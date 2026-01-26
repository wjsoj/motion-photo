<template>
  <div
    class="live-photo"
    v-bind="$attrs"
    @click="handleClick"
    @mouseenter="handleHover"
    @mouseleave="handleHoverEnd"
  >
    <img :src="parsedData?.imageSrc" alt="" style="display: block" />
    <video
      v-if="parsedData?.hasVideo"
      ref="videoElement"
      :src="parsedData.videoSrc ?? undefined"
      :muted="muted"
      :loop="loop"
      playsInline
      style="display: none"
    />
    <div v-if="showLiveBadge" :style="badgeStyle">
      {{ liveBadgeText }}
    </div>
    <slot
      :state="state"
      :imgSrc="parsedData?.imageSrc"
      :videoRef="videoElement"
      :play="play"
      :pause="pause"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLivePhoto } from './useLivePhoto';
import type { MotionPhotoInput } from '../core';

const props = withDefaults(
  defineProps<{
    src: MotionPhotoInput;
    muted?: boolean;
    loop?: boolean;
    showLiveBadge?: boolean;
    liveBadgeText?: string;
    trigger?: 'click' | 'hover';
  }>(),
  {
    muted: true,
    loop: true,
    showLiveBadge: true,
    liveBadgeText: 'LIVE',
    trigger: 'click',
  }
);

const hook = useLivePhoto(props);

const badgeStyle = computed(() => ({
  position: 'absolute',
  top: '8px',
  left: '8px',
  background: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
}));

const handleClick = () => {
  if (props.trigger === 'click') hook.toggle();
};

const handleHover = () => {
  if (props.trigger === 'hover') hook.play();
};

const handleHoverEnd = () => {
  if (props.trigger === 'hover') hook.pause();
};
</script>
