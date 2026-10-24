<script setup lang="ts">
import { useId } from 'vue'

// Brand marks drawn inline: GitHub from Simple Icons (CC0), HeroUI from heroui.com's heroui-plain-logo,
// Reka UI from unovue/reka-ui docs/content/public/logo.svg, Vue from its official logo.
defineProps<{ name: 'github' | 'heroui' | 'reka' | 'vue' }>()

// The Reka mark paints with gradients, so its <defs> ids must be unique per instance: a repeated id
// resolves to the first match in the document, which paints blank when that copy sits in a hidden subtree.
const uid = useId()
</script>

<template>
  <svg v-if="name === 'github'" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    />
  </svg>
  <svg
    v-else-if="name === 'heroui'"
    width="1em"
    height="1em"
    viewBox="0 0 114 158"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M0 39.403v47.208a6.467 6.467 0 0 0 3.035 5.485l32.2 20.127c4.29 2.682 9.848-.413 9.848-5.485V67.056c0-2.283 1.2-4.397 3.159-5.56l19.64-11.672v101.703c0 5.055 5.525 8.153 9.817 5.505l33.234-20.503a6.467 6.467 0 0 0 3.067-5.505V33.361c0-5.03-5.476-8.132-9.769-5.534L67.883 49.824V6.473c0-5.016-5.45-8.12-9.744-5.549L3.14 33.853A6.467 6.467 0 0 0 0 39.404Z"
    />
  </svg>
  <svg v-else-if="name === 'vue'" width="1em" height="1em" viewBox="0 0 256 221" aria-hidden="true">
    <path fill="#41b883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z" />
    <path fill="#41b883" d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z" />
    <path fill="#35495e" d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z" />
  </svg>
  <svg v-else width="1em" height="1em" viewBox="0 0 290 290" fill="none" aria-hidden="true">
    <path
      d="M226.269 52.4044L226.274 52.4067C237.406 58.2619 245.614 66.3008 250.94 76.5218C256.285 86.7776 258.969 98.4614 258.969 111.596C258.969 124.732 256.285 136.34 250.943 146.446C245.618 156.521 237.447 164.451 226.389 170.234C221.59 172.712 219.355 178.881 222.459 183.542L257.922 236.789C261.773 242.571 257.628 250.311 250.681 250.311H196.906C193.806 250.311 190.939 248.661 189.382 245.98L79.3991 56.5686C76.0313 50.7687 80.2159 43.5 86.9227 43.5H183.394C200.888 43.5 215.161 46.4896 226.269 52.4044Z"
      :fill="`url(#${uid}-p0)`"
      :stroke="`url(#${uid}-p1)`"
      stroke-width="1.93333"
    />
    <path
      d="M116.722 247.228C113.004 253.687 103.684 253.687 99.9661 247.228L26.2042 119.085C22.4947 112.64 27.1462 104.596 34.5821 104.596L182.106 104.596C189.542 104.596 194.193 112.64 190.484 119.085L116.722 247.228Z"
      :fill="`url(#${uid}-p2)`"
    />
    <path
      d="M116.722 247.228C113.004 253.687 103.684 253.687 99.9661 247.228L26.2042 119.085C22.4947 112.64 27.1462 104.596 34.5821 104.596L182.106 104.596C189.542 104.596 194.193 112.64 190.484 119.085L116.722 247.228Z"
      :fill="`url(#${uid}-p3)`"
      fill-opacity="0.5"
    />
    <path
      d="M100.804 246.745L27.042 118.602C23.7034 112.802 27.8898 105.562 34.5821 105.562L182.106 105.562C188.798 105.562 192.985 112.802 189.646 118.602L115.884 246.745C112.538 252.558 104.15 252.558 100.804 246.745Z"
      :fill="`url(#${uid}-p4)`"
      fill-opacity="0.5"
      :stroke="`url(#${uid}-p5)`"
      stroke-width="1.93333"
      stroke-linejoin="round"
    />
    <defs>
      <linearGradient
        :id="`${uid}-p0`"
        x1="241.666"
        y1="264.867"
        x2="88.9331"
        y2="7.73334"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#00996C" />
        <stop offset="1" stop-color="#7AFFD8" />
      </linearGradient>
      <linearGradient
        :id="`${uid}-p1`"
        x1="192.366"
        y1="289.033"
        x2="233.933"
        y2="42.5333"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" stop-opacity="0.56" />
        <stop offset="0.494792" stop-color="white" stop-opacity="0" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
      <radialGradient
        :id="`${uid}-p2`"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(185.6 110.2) rotate(147.858) scale(129.006 128.619)"
      >
        <stop offset="0.48614" stop-color="#00C58A" />
        <stop offset="1" stop-color="white" stop-opacity="0.21" />
      </radialGradient>
      <radialGradient
        :id="`${uid}-p3`"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(108.266 160.467) rotate(90) scale(191.4 190.827)"
      >
        <stop stop-color="white" stop-opacity="0" />
        <stop offset="1" stop-color="white" />
      </radialGradient>
      <radialGradient
        :id="`${uid}-p4`"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(108.266 181.733) rotate(-90) scale(129.533 129.145)"
      >
        <stop stop-color="white" stop-opacity="0" />
        <stop offset="1" stop-color="white" />
      </radialGradient>
      <linearGradient
        :id="`${uid}-p5`"
        x1="105.366"
        y1="105.367"
        x2="105.366"
        y2="261"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" stop-opacity="0.6" />
        <stop offset="0.494792" stop-color="white" stop-opacity="0" />
        <stop offset="1" stop-color="white" stop-opacity="0.38" />
      </linearGradient>
    </defs>
  </svg>
</template>
