import http from 'http';

const port = 9444;
async function query() {
  const data = await new Promise(res => http.get(`http://127.0.0.1:${port}/json`, r => {
    let b = '';
    r.on('data', c => b += c);
    r.on('end', () => res(b));
  }));
  const page = JSON.parse(data).find(p => p.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  ws.addEventListener('open', () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        returnByValue: true,
        expression: `(() => {
          const getBox = id => {
            const el = document.getElementById(id);
            return el ? { id, y: el.getBoundingClientRect().y, h: el.getBoundingClientRect().height, bottom: el.getBoundingClientRect().bottom } : null;
          };
          return [getBox('app-root'), getBox('screen-atelier'), getBox('layout'), getBox('stage'), getBox('viewer')];
        })()`
      }
    }));
  });
  ws.addEventListener('message', e => {
    console.log(JSON.stringify(JSON.parse(e.data).result?.result?.value, null, 2));
    ws.close();
    process.exit(0);
  });
}
query();
