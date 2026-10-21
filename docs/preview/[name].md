---
layout: preview
search: false
# Theme before first paint (PreviewPage keeps it in sync afterwards). Embedded: the frame's `data-preview-theme` and the
# parent's design attributes; standalone: `?theme=`. Page head tags render after the site's, so this runs after
# VitePress's appearance script and the design-theme script, which apply the stored docs settings.
head:
  - - script
    - id: preview-theme
    - "try{var r=document.documentElement,f=window.frameElement,t=f?f.getAttribute('data-preview-theme'):new URLSearchParams(location.search).get('theme');if(t==='dark'||t==='light')r.classList.toggle('dark',t==='dark');if(f){var p=parent.document.documentElement;['data-design-theme','data-vibrant-palette'].forEach(function(a){var v=p.getAttribute(a);if(v===null)r.removeAttribute(a);else r.setAttribute(a,v)})}}catch(e){}"
---
