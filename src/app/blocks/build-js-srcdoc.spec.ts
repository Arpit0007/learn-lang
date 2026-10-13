import { buildJsSrcdoc } from './build-js-srcdoc';

describe('buildJsSrcdoc', () => {
  it('embeds the run id and the code as a JSON string', () => {
    const doc = buildJsSrcdoc('console.log("hi")', 'run-42');
    expect(doc).toContain('var RUN_ID = "run-42"');
    expect(doc).toContain('window.__llRun("console.log(\\"hi\\")")');
  });

  it('cannot be broken out of with a closing script tag', () => {
    const doc = buildJsSrcdoc('const s = "</script><img src=x onerror=alert(1)>";', 'r');
    const body = doc.slice(doc.indexOf('<body>'));
    expect(body).not.toContain('</script><img');
    expect(body).toContain('\\u003c/script>');
  });

  it('places demo HTML inside #root', () => {
    const doc = buildJsSrcdoc('', 'r', { demoHtml: '<button class="go">Go</button>' });
    expect(doc).toContain('<div id="root"><button class="go">Go</button></div>');
  });

  it('runs the code as an async function with root in scope', () => {
    const doc = buildJsSrcdoc('', 'r');
    expect(doc).toContain("new Function('root', 'return (async () => {\\n' + code + '\\n})();')");
  });

  it('provides a complete in-memory Storage stand-in', () => {
    const doc = buildJsSrcdoc('', 'r');
    for (const member of ['getItem', 'setItem', 'removeItem', 'clear', 'key', 'get length()']) {
      expect(doc).toContain(member);
    }
    expect(doc).toContain("Object.defineProperty(window, 'localStorage'");
    expect(doc).toContain("Object.defineProperty(window, 'sessionStorage'");
  });

  it('follows the site theme', () => {
    expect(buildJsSrcdoc('', 'r', { dark: true })).toContain('color-scheme:dark');
    expect(buildJsSrcdoc('', 'r', { dark: false })).toContain('color-scheme:light');
  });
});
