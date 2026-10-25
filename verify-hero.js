const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: '1440', width: 1440, height: 900 },
    { name: '1024', width: 1024, height: 768 },
    { name: '390', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    console.log('\n=== ' + vp.name + 'px ===');

    const response = await page.goto('https://nuvelshape.store/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    console.log('Status: ' + response.status());

    // Check for broken images
    const brokenImgs = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const broken = [];
      for (const img of imgs) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src || img.getAttribute('src') || 'unknown');
        }
      }
      return broken;
    });
    if (brokenImgs.length > 0) {
      console.log('IMÁGENES ROTAS:', brokenImgs);
    } else {
      console.log('No hay imágenes rotas OK');
    }

    // Take screenshot
    await page.screenshot({ path: 'captura-hero-' + vp.name + '.png', fullPage: true });
    console.log('Captura guardada: captura-hero-' + vp.name + '.png');

    // Check hero image
    const heroInfo = await page.evaluate(() => {
      const img = document.querySelector('.nuvel-hero__img');
      if (!img) return null;
      const rect = img.getBoundingClientRect();
      const style = window.getComputedStyle(img);
      return {
        rect: { width: Math.round(rect.width), height: Math.round(rect.height), top: Math.round(rect.top), left: Math.round(rect.left) },
        objectPosition: style.objectPosition,
        objectFit: style.objectFit,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      };
    });
    console.log('Hero img: ' + JSON.stringify(heroInfo));

    // Check text styles
    const contrastInfo = await page.evaluate(() => {
      const title = document.querySelector('.nuvel-hero__title');
      const eyebrow = document.querySelector('.nuvel-hero__eyebrow');
      const subtitle = document.querySelector('.nuvel-hero__subtitle');
      const getStyle = (el) => el ? window.getComputedStyle(el) : null;

      const result = {};
      if (title) {
        const s = getStyle(title);
        result.title = { color: s.color, fontWeight: s.fontWeight, fontSize: s.fontSize };
      }
      if (eyebrow) {
        const s = getStyle(eyebrow);
        result.eyebrow = { color: s.color, fontWeight: s.fontWeight, fontSize: s.fontSize };
      }
      if (subtitle) {
        const s = getStyle(subtitle);
        result.subtitle = { color: s.color, fontWeight: s.fontWeight, fontSize: s.fontSize };
      }
      return result;
    });
    console.log('Estilos texto: ' + JSON.stringify(contrastInfo));

    // Check horizontal scroll
    const scrollInfo = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });
    console.log('Scroll horizontal: ' + (scrollInfo.hasHorizontalScroll ? 'SÍ (problema)' : 'No OK'));

    await page.close();
  }

  await browser.close();
  console.log('\n=== Verificación completada ===');
})();
