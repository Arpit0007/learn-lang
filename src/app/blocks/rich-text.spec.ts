import { TestBed } from '@angular/core/testing';
import { parseRich, safeHref } from './rich-text';
import { RichTextComponent } from './rich-text.component';

describe('parseRich', () => {
  it('parses bold, italic, code and links', () => {
    expect(parseRich('a **b** *c* `d` [e](https://x.dev)')).toEqual([
      { type: 'text', text: 'a ' },
      { type: 'strong', children: [{ type: 'text', text: 'b' }] },
      { type: 'text', text: ' ' },
      { type: 'em', children: [{ type: 'text', text: 'c' }] },
      { type: 'text', text: ' ' },
      { type: 'code', text: 'd' },
      { type: 'text', text: ' ' },
      { type: 'link', href: 'https://x.dev', children: [{ type: 'text', text: 'e' }] },
    ]);
  });

  it('nests code inside bold', () => {
    expect(parseRich('**use `const`**')).toEqual([
      { type: 'strong', children: [{ type: 'text', text: 'use ' }, { type: 'code', text: 'const' }] },
    ]);
  });

  it('honours backslash escapes, including backticks inside code', () => {
    expect(parseRich('2 \\* 3')).toEqual([{ type: 'text', text: '2 * 3' }]);
    expect(parseRich('`\\`${x}\\``')).toEqual([{ type: 'code', text: '`${x}`' }]);
  });

  it('treats unclosed markers as text', () => {
    expect(parseRich('a * b')).toEqual([{ type: 'text', text: 'a * b' }]);
    expect(parseRich('see [note')).toEqual([{ type: 'text', text: 'see [note' }]);
    expect(parseRich('tick ` mark')).toEqual([{ type: 'text', text: 'tick ` mark' }]);
  });

  it('only allows http(s) and mailto links', () => {
    expect(safeHref('https://a.b')).toBe('https://a.b');
    expect(safeHref('mailto:x@y.z')).toBe('mailto:x@y.z');
    expect(safeHref('javascript:alert(1)')).toBeNull();
  });
});

describe('RichTextComponent', () => {
  function render(text: string): HTMLElement {
    const fixture = TestBed.createComponent(RichTextComponent);
    fixture.componentRef.setInput('text', text);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('renders formatting as elements', () => {
    const el = render('**bold** and `code` and [link](https://x.dev)');
    expect(el.querySelector('strong')?.textContent).toBe('bold');
    expect(el.querySelector('code')?.textContent).toBe('code');
    const a = el.querySelector('a')!;
    expect(a.getAttribute('href')).toBe('https://x.dev');
    expect(a.getAttribute('rel')).toBe('noopener');
  });

  it('shows HTML in content as text, not markup', () => {
    const el = render('<img src=x onerror=alert(1)>');
    expect(el.querySelector('img')).toBeNull();
    expect(el.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('renders unsafe links as plain text', () => {
    const el = render('[click](javascript:alert(1))');
    expect(el.querySelector('a')).toBeNull();
    expect(el.textContent).toBe('click');
  });
});
