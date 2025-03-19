const Koa = require('koa');
const Router = require('koa-router');
const puppeteer = require('puppeteer');

const app = new Koa();
const router = new Router();

// 截图处理中间件
router.get('/get', async (ctx) => {
  const targetUrl = ctx.query.url;
  
  if (!targetUrl) {
    ctx.status = 400;
    ctx.body = { error: 'Missing url parameter' };
    return;
  }

  try {
    // 启动无头浏览器
    const browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // 设置视口和导航
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    
    // 生成截图Buffer
    const screenshotBuffer = await page.screenshot({
      type: 'png',
      fullPage: true, // 截取整个页面
    });

    // 关闭浏览器释放资源
    await browser.close();

    // 设置响应头
    ctx.set('Content-Type', 'image/png');
    ctx.body = Buffer.from(screenshotBuffer);

  } catch (error) {
    console.error('截图失败:', error);
    ctx.status = 500;
    ctx.body = { error: '截图生成失败' };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
