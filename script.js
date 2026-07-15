// ---------------- Black hole canvas (perf-optimized) ----------------
(function(){
  const canvas = document.getElementById('bh-canvas');
  const ctx = canvas.getContext('2d', {alpha:false});
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, cx, cy, dpr;
  let particles = [];
  const isSmall = window.innerWidth < 700;
  const COUNT = reduceMotion ? 0 : (isSmall ? 260 : 520);
  const RH = () => Math.min(W, H) * 0.09; // event horizon radius

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth = canvas.offsetWidth;
    H = canvas.clientHeight = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    cx = W/2; cy = H*0.52;
  }

  function rand(a,b){ return a + Math.random()*(b-a); }

  function makeParticle(){
    const r = rand(RH()*1.6, Math.max(W,H)*0.62);
    const angle = rand(0, Math.PI*2);
    const speed = (0.0009 + (1/r)*2.6) * rand(0.7,1.3);
    const hueMix = Math.random();
    let color;
    if(hueMix < 0.3) color = '255,157,77';      // hot orange
    else if(hueMix < 0.65) color = '198,92,255'; // violet
    else color = '91,60,255';                    // deep blue
    return {
      r, angle, speed,
      size: rand(0.5, 1.6),
      alpha: rand(0.25, 0.9),
      color,
      trail: rand(0.85,0.97)
    };
  }

  function init(){
    resize();
    particles = [];
    for(let i=0;i<COUNT;i++) particles.push(makeParticle());
  }

  function drawGlow(){
    // core glow
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,RH()*3.2);
    g.addColorStop(0,'rgba(5,5,10,1)');
    g.addColorStop(0.32,'rgba(20,10,35,0.9)');
    g.addColorStop(0.55,'rgba(60,20,70,0.35)');
    g.addColorStop(1,'rgba(5,5,10,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx,cy,RH()*3.2,0,Math.PI*2);
    ctx.fill();

    // photon ring
    ctx.beginPath();
    ctx.arc(cx,cy,RH(),0,Math.PI*2);
    const ring = ctx.createRadialGradient(cx,cy,RH()*0.7,cx,cy,RH()*1.15);
    ring.addColorStop(0,'rgba(5,5,10,1)');
    ring.addColorStop(0.85,'rgba(255,157,77,0.9)');
    ring.addColorStop(1,'rgba(255,157,77,0)');
    ctx.fillStyle = ring;
    ctx.arc(cx,cy,RH()*1.15,0,Math.PI*2);
    ctx.fill();

    // true event horizon (black core)
    ctx.beginPath();
    ctx.fillStyle = '#050508';
    ctx.arc(cx,cy,RH()*0.86,0,Math.PI*2);
    ctx.fill();
  }

  function frame(){
    // trail fade
    ctx.fillStyle = 'rgba(5,5,10,0.28)';
    ctx.fillRect(0,0,W,H);

    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      p.angle += p.speed;
      p.r -= p.speed * (RH()*0.18); // slow inward drift

      if(p.r < RH()*0.9){
        Object.assign(p, makeParticle());
        p.r = Math.max(W,H)*0.62;
        continue;
      }
      // gravitational squash near horizon = flatten ellipse (accretion disk look)
      const squash = 0.38;
      const x = cx + Math.cos(p.angle) * p.r;
      const y = cy + Math.sin(p.angle) * p.r * squash;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.arc(x,y,p.size,0,Math.PI*2);
      ctx.fill();
    }

    drawGlow();
    requestAnimationFrame(frame);
  }

  init();
  window.addEventListener('resize', ()=>{ resize(); });
  if(!reduceMotion){
    requestAnimationFrame(frame);
  } else {
    drawGlow();
  }
})();

// ---------------- Project cards ----------------
const projects = [
  {
    name:'STEDI-Human-Balance-Analytics',
    lang:'Python · AWS',
    desc:'Data lakehouse pipeline on AWS: ingests STEDI Step Trainer sensor and mobile app data, curating it for model training.',
    url:'https://github.com/abdulmukthadir/STEDI-Human-Balance-Analytics'
  },
  {
    name:'e-commerce-website',
    lang:'HTML/CSS/JS',
    desc:'"Anon" — a fully responsive ecommerce storefront, tuned for compatibility across mobile devices.',
    url:'https://github.com/abdulmukthadir/e-commerce-website'
  },
  {
    name:'Notes-website',
    lang:'React',
    desc:'A feature-rich notes app built with React, Tailwind CSS, React Router DOM and localStorage persistence.',
    url:'https://github.com/abdulmukthadir/Notes-website'
  },
  {
    name:'edutech-website',
    lang:'HTML/Tailwind',
    desc:'A modern edutech landing page built from a Figma design, using HTML and Tailwind CSS.',
    url:'https://github.com/abdulmukthadir/edutech-website'
  },
  {
    name:'yt-mp4--mp3',
    lang:'Python',
    desc:'A small utility that converts YouTube videos into downloadable MP3 audio files.',
    url:'https://github.com/abdulmukthadir/yt-mp4--mp3'
  },
  {
    name:'project-CCTV',
    lang:'Python',
    desc:'An old Redmi 5A repurposed into a live CCTV system with real-time object detection using Python and OpenCV.',
    url:'https://github.com/abdulmukthadir/project-CCTV'
  }
];

const grid = document.getElementById('proj-grid');
grid.innerHTML = projects.map(p => `
  <a class="proj-card" href="${p.url}" target="_blank" rel="noopener">
    <div class="proj-top">
      <h3>${p.name}</h3>
      <span class="lang">${p.lang}</span>
    </div>
    <p>${p.desc}</p>
    <span class="go">view repository →</span>
  </a>
`).join('');

grid.querySelectorAll('.proj-card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX-rect.left)/rect.width*100)+'%');
    card.style.setProperty('--my', ((e.clientY-rect.top)/rect.height*100)+'%');
  });
});