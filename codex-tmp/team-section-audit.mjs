const endpoint = "http://127.0.0.1:9337";
const pageUrl = "http://127.0.0.1:8020/index.html";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

async function connectToPage() {
  const target = await fetch(`${endpoint}/json/new?${encodeURIComponent(pageUrl)}`, {
    method: "PUT",
  }).then((response) => response.json());

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let id = 0;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        reject(new Error(JSON.stringify(message.error)));
      } else {
        resolve(message.result);
      }
    }
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      id += 1;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });

  return { socket, send };
}

const { socket, send } = await connectToPage();

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1280,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

await sleep(2500);

const result = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const section = document.querySelector(".team-section");
    section.scrollIntoView({ block: "center" });
    const rectFor = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        right: Math.round(rect.right),
        bottom: Math.round(rect.bottom)
      };
    };
    const sectionRect = rectFor(section);
    const cards = [...document.querySelectorAll(".team-card")].map((card) => ({
      card: rectFor(card),
      media: rectFor(card.querySelector(".team-card__media")),
      orbit: rectFor(card.querySelector(".team-card__orbit")),
      text: card.querySelector(".team-card__orbit-text textPath")?.textContent.trim()
    }));
    return {
      viewport: { width: innerWidth, height: innerHeight },
      bodyWidth: document.documentElement.scrollWidth,
      section: sectionRect,
      cards
    };
  })()`,
});

await sleep(500);

const clip = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const rect = document.querySelector(".team-section").getBoundingClientRect();
    return {
      x: Math.max(0, rect.x),
      y: Math.max(0, rect.y),
      width: Math.min(innerWidth, rect.width),
      height: Math.min(innerHeight, rect.height),
      scale: 1
    };
  })()`,
});

const screenshot = await send("Page.captureScreenshot", {
  format: "png",
  clip: clip.result.value,
});

await import("node:fs/promises").then((fs) =>
  fs.writeFile("/private/tmp/lunera-team-section-cdp.png", screenshot.data, "base64")
);

console.log(JSON.stringify(result.result.value, null, 2));

socket.close();
