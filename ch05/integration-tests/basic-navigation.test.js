const portfinder = require('portfinder');
const puppeteer = require('puppeteer');

const app = require("../meadowlark.js");
let server = null;
let port = null;

// run server on background (after finding one available port)
beforeEach(async ()=>{
  port = await portfinder.getPortPromise();
  server = app.listen(port);
})

afterEach(() => {
  server.close();
})

test("home page links to about page", async()=>{
  // Open a virtual browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Go to the virtual page; click to the virtual link at the virtual address
  await page.goto(`http://localhost:${port}`);
  await Promise.all([
    page.waitForNavigation(),
    page.click('[data-test-id="about"')
  ])
  expect(page.url()).toBe(`http://localhost:${port}/about`);
  await browser.close();
})