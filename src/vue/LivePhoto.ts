import {
  computed,
  defineComponent,
  h,
  onMounted,
  type PropType,
  ref,
  type VNode,
  watch,
} from 'vue';
import type { LivePhotoConfig, MotionPhotoInput, ThemeConfig } from '../core';
import { applyThemeToContainer, injectStyles } from '../styles';
import { ErrorIcon, LiveBadgeIcon, PauseIcon, PlayIcon, RingBadgeIcon, VolumeIcon } from './icons';
import { useLivePhoto } from './useLivePhoto';

const DefaultLoadingComponent = defineComponent({
  name: 'DefaultLoading',
  setup() {
    return () =>
      h('div', { class: 'live-photo__loading' }, [
        h('div', { class: 'live-photo__loading-spinner' }),
      ]);
  },
});

const DefaultErrorComponent = defineComponent({
  name: 'DefaultError',
  props: {
    error: { type: Error, default: null },
    retry: { type: Function, default: null },
  },
  setup(props) {
    return () =>
      h('div', { class: 'live-photo__error' }, [
        h('div', { class: 'live-photo__error-icon' }, [h(ErrorIcon, { size: 32 })]),
        h('span', { class: 'live-photo__error-message' }, props.error?.message || 'Failed to load'),
        props.retry
          ? h('button', { class: 'live-photo__error-retry', onClick: props.retry }, 'Retry')
          : null,
      ]);
  },
});

export default defineComponent({
  name: 'LivePhoto',
  props: {
    src: { type: [String, File, Blob, Object] as PropType<MotionPhotoInput>, required: true },
    config: { type: Object as PropType<Partial<LivePhotoConfig>>, default: undefined },
    className: { type: String, default: '' },
    style: { type: Object as PropType<Record<string, string | number>>, default: undefined },
  },
  setup(props, { slots }) {
    const hook = useLivePhoto(props);
    const containerRef = ref<HTMLDivElement | null>(null);
    const isMuted = ref(props.config?.muted ?? true);

    onMounted(() => {
      injectStyles();
    });

    watch(
      () => [containerRef.value, props.config?.theme],
      ([container, theme]) => {
        if (container && theme) {
          applyThemeToContainer(container as HTMLDivElement, theme as ThemeConfig);
        }
      },
      { immediate: true }
    );

    const badgeStyleVariant = computed(() => props.config?.liveBadgeStyle?.style || 'concentric');

    const badgeSizeVariant = computed(() => props.config?.liveBadgeStyle?.size || 'md');

    const iconSize = computed(() => {
      const size = badgeSizeVariant.value;
      return size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
    });

    const badgeClasses = computed(() => {
      const bs = props.config?.liveBadgeStyle;
      const classes = ['live-badge'];
      classes.push(`live-badge--${props.config?.liveBadgePosition || 'top-left'}`);
      classes.push(`live-badge--${bs?.size || 'md'}`);
      classes.push(`live-badge--${bs?.style || 'concentric'}`);
      if (bs?.animation !== false) classes.push('live-badge--animated');
      return classes.join(' ');
    });

    const containerClasses = computed(() => {
      const classes = ['live-photo', props.className || ''];
      const s = hook.state.value;
      if (s === 'playing') classes.push('live-photo--playing');
      if (s === 'paused') classes.push('live-photo--paused');
      if (s === 'ready') classes.push('live-photo--ready');
      if (s === 'parsing') classes.push('live-photo--loading');
      if (s === 'error') classes.push('live-photo--error');
      return classes.filter(Boolean).join(' ');
    });

    const showBadge = computed(
      () => props.config?.showLiveBadge !== false && hook.parsedData.value?.hasVideo
    );

    const showMuteButton = computed(() => {
      const show = props.config?.showMuteButton;
      return show === 'auto'
        ? hook.parsedData.value?.hasVideo && hook.parsedData.value?.videoSrc
        : show;
    });

    const muteButtonClasses = computed(() => {
      const classes = ['live-photo__mute-btn'];
      if (hook.state.value === 'playing' || hook.state.value === 'paused') {
        classes.push('live-photo__mute-btn--visible');
      }
      return classes.join(' ');
    });

    const showPlayPauseIndicator = computed(() => props.config?.showPlayPauseIndicator === true);
    const playPauseIndicatorStyle = computed(() => props.config?.playPauseIndicatorStyle || 'icon');
    const playPauseClasses = computed(() => {
      const classes = ['live-photo__play-pause'];
      if (playPauseIndicatorStyle.value === 'ripple')
        classes.push('live-photo__play-pause--ripple');
      return classes.join(' ');
    });

    const liveBadgeText = computed(() => props.config?.liveBadgeText || 'LIVE');

    const handleMuteToggle = (e: Event) => {
      e.stopPropagation();
      const newMuted = !isMuted.value;
      isMuted.value = newMuted;
      hook.mute(newMuted);
    };

    const handleRetry = () => hook.play();

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hook.toggle();
      }
    };

    const handleBadgeClick = (e: Event) => {
      e.stopPropagation();
      hook.play();
    };

    const handleHover = () => {
      if (props.config?.trigger === 'hover') hook.play();
    };

    const handleHoverEnd = () => {
      if (props.config?.trigger === 'hover') hook.pause();
    };

    return () => {
      const pd = hook.parsedData.value;
      const st = hook.state.value;
      const bsv = badgeStyleVariant.value;

      const children: VNode[] = [];

      // Image
      children.push(
        h('img', { src: pd?.imageSrc, alt: '', class: 'live-photo__img', draggable: false })
      );

      // Video overlay
      if (pd?.hasVideo) {
        children.push(
          h('video', {
            ref: hook.videoElement,
            src: pd.videoSrc ?? undefined,
            muted: isMuted.value,
            loop: props.config?.loop ?? false,
            playsInline: true,
            class: 'live-photo__video',
          })
        );
      }

      // Badge
      if (showBadge.value) {
        const badgeChildren: VNode[] = [];

        if (bsv === 'concentric') {
          badgeChildren.push(
            h('span', { class: 'live-badge__rings' }, [
              h('span', { class: 'live-badge__ring live-badge__ring--inner' }),
              h('span', { class: 'live-badge__ring live-badge__ring--middle' }),
              h('span', { class: 'live-badge__ring live-badge__ring--outer' }),
            ])
          );
        }

        if (bsv === 'icon') {
          badgeChildren.push(
            h('span', { class: 'live-badge__icon' }, [h(LiveBadgeIcon, { size: iconSize.value })])
          );
        }

        if (bsv === 'ring') {
          badgeChildren.push(
            h('span', { class: 'live-badge__icon' }, [h(RingBadgeIcon, { size: iconSize.value })])
          );
        }

        if (bsv !== 'icon') {
          badgeChildren.push(h('span', { class: 'live-badge__text' }, liveBadgeText.value));
        }

        children.push(
          h(
            'div',
            { class: badgeClasses.value, onClick: handleBadgeClick, style: 'cursor:pointer' },
            badgeChildren
          )
        );
      }

      // Play/Pause indicator
      if (showPlayPauseIndicator.value && playPauseIndicatorStyle.value !== 'none') {
        children.push(
          h('div', { class: playPauseClasses.value }, [
            st === 'playing' ? h(PauseIcon, { size: 24 }) : h(PlayIcon, { size: 24 }),
          ])
        );
      }

      // Mute button
      if (showMuteButton.value && pd?.hasVideo) {
        children.push(
          h(
            'button',
            {
              type: 'button',
              class: muteButtonClasses.value,
              onClick: handleMuteToggle,
              'aria-label': isMuted.value ? 'Unmute' : 'Mute',
            },
            [h(VolumeIcon, { size: 20, muted: isMuted.value })]
          )
        );
      }

      // Loading state
      if (st === 'parsing') {
        children.push(h(DefaultLoadingComponent));
      }

      // Error state
      if (st === 'error') {
        children.push(
          h(DefaultErrorComponent, { error: hook.error.value ?? undefined, retry: handleRetry })
        );
      }

      // Default slot
      if (slots.default) {
        const slotContent = slots.default({
          state: st,
          imgSrc: pd?.imageSrc,
          videoRef: hook.videoElement,
          play: hook.play,
          pause: hook.pause,
          toggle: hook.toggle,
          mute: hook.mute,
          error: hook.error.value,
        });
        children.push(...slotContent);
      }

      return h(
        'div',
        {
          ref: containerRef,
          class: containerClasses.value,
          style: props.style,
          role: props.config?.role || 'button',
          'aria-label': props.config?.ariaLabel || 'Live Photo',
          tabindex: 0,
          onMouseenter: handleHover,
          onMouseleave: handleHoverEnd,
          onKeydown: handleKeydown,
        },
        children
      );
    };
  },
});
