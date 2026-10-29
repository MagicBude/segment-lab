import fs from 'node:fs';
class Element {
 constructor(){this.children=[];this.value='';this.dataset={};this.style={setProperty(){}};this.classList={toggle(){}};this.events={};}
 setAttribute(){} append(...v){this.children.push(...v)} replaceChildren(...v){this.children=v} addEventListener(n,f){this.events[n]=f} scrollIntoView(){} focus(){} querySelectorAll(){return this.children.map(e=>e.children[0])}
}
const ids=[...fs.readFileSync('web/index.html','utf8').matchAll(/id="([^"]+)"/g)].map(m=>m[1]);const map=Object.fromEntries(ids.map(id=>[id,new Element()]));
map['export-format'].value='frame';map['text-input'].value='12.34';map['digits-input'].value='4';map['display-color'].value='#ff3838';
globalThis.document={getElementById:id=>map[id]??null,createElement:()=>new Element(),createElementNS:()=>new Element(),documentElement:new Element()};globalThis.window={location:{search:''}};globalThis.localStorage={getItem(){return null}};
await import('../web/js/pages/index.js');
if(map['single-display'].children.length!==1||map['segment-switches'].children.length!==8)throw Error('Initialization failed');
map.reset.events.click();if(map['logic-code'].textContent!=='0x00')throw Error('Reset failed');
console.log('PASS page initialization, digit rendering, segment controls and reset');

if (!map['export-preview'].textContent.includes('seg_frame')) throw Error('Export preview failed');
map['export-format'].value = 'json';
map['export-format'].events.change();
JSON.parse(map['export-preview'].textContent);
console.log('PASS C/JSON preview initialized');
