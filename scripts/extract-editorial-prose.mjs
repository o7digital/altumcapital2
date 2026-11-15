// Content extraction only. This file does not copy any page layout or stylesheet.
import {firefox} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import imported from '../src/data/imported.json' with {type:'json'};
import source from '../src/data/source-pages.json' with {type:'json'};
const browser=await firefox.launch();
const page=await browser.newPage({javaScriptEnabled:false});
await page.route('**/*',route=>route.abort());
const entries=[];
for(const item of [...imported.posts,...imported.documents]){
 await page.setContent(`<div id="content">${item.html}</div>`,{waitUntil:'domcontentloaded'});
 const blocks=await page.evaluate(()=>{
  const output=[];let pending='';
  const escape=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const inline=node=>{
   if(node.nodeType===Node.TEXT_NODE)return escape(node.textContent);
   if(!(node instanceof Element))return '';
   const children=[...node.childNodes].map(inline).join('');
   if(node.tagName==='BR')return '<br>';
   if(['B','STRONG'].includes(node.tagName))return `<strong>${children}</strong>`;
   if(['EM','I'].includes(node.tagName))return `<em>${children}</em>`;
   if(node.tagName==='A'){const href=node.getAttribute('href')||'';return /^(https?:|mailto:|tel:|\/)/i.test(href)?`<a href="${escape(href)}"${href.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${children}</a>`:children;}
   if(node.tagName==='P')return children+'<br><br>';
   return children;
  };
  const text=html=>{const d=document.createElement('div');d.innerHTML=html;return d.textContent.replace(/\s+/g,' ').trim();};
  const flush=()=>{if(text(pending))output.push({kind:'paragraph',html:pending.trim(),text:text(pending)});pending='';};
  const walk=node=>{
   if(node.nodeType===Node.TEXT_NODE){pending+=inline(node);return;}
   if(!(node instanceof Element))return;
   if(node.tagName==='IMG'){flush();output.push({kind:'image',src:node.getAttribute('src'),alt:node.getAttribute('alt')||''});return;}
   if(/^H[1-6]$/.test(node.tagName)){flush();output.push({kind:'heading',html:[...node.childNodes].map(inline).join(''),text:node.textContent.trim()});return;}
   if(node.tagName==='P'){flush();const html=[...node.childNodes].map(inline).join('');if(text(html))output.push({kind:'paragraph',html,text:text(html)});return;}
   if(['UL','OL'].includes(node.tagName)){flush();const items=[...node.children].filter(n=>n.tagName==='LI').map(n=>({html:[...n.childNodes].map(inline).join(''),text:n.textContent.trim()}));
    if(items.length===1 && items[0].text===items[0].text.toUpperCase() && items[0].text.length<120)output.push({kind:'heading',...items[0]});
    else output.push({kind:'list',ordered:node.tagName==='OL',items});return;}
   if(node.tagName==='BLOCKQUOTE'){flush();output.push({kind:'quote',html:[...node.childNodes].map(inline).join(''),text:node.textContent.trim()});return;}
   if(node.tagName==='BR'){if(pending.endsWith('<br>'))flush();else pending+='<br>';return;}
   if(['STRONG','B','EM','I','A','SPAN'].includes(node.tagName)){pending+=inline(node);return;}
   [...node.childNodes].forEach(walk);
  };
  [...document.querySelector('#content').childNodes].forEach(walk);flush();return output;
 });
 const original=source.pages.find(p=>p.slug===item.slug);
 const cover=original?.sections[0]?.background[0] || null;
 const thumbnails=source.assets.find(asset=>asset.local.endsWith('/'+item.image?.split('/').pop()));
 const images=blocks.filter(b=>b.kind==='image').map(b=>{const asset=source.assets.find(a=>a.local.endsWith('/'+b.src.split('/').pop()));return {local:asset?.local||b.src,source:asset?.source||'https://altumcapital.vercel.app/wp-content/uploads/2022/12/Buro.jpg',alt:b.alt};});
 entries.push({slug:item.slug,title:item.title,date:item.date||'',author:item.author||'',excerpt:item.excerpt||'',cover,thumbnail:thumbnails||null,blocks:blocks.filter(b=>b.kind!=='image'),images});
}
await writeFile('src/data/editorial/prose.json',JSON.stringify(entries,null,2)+'\n');
console.log(`Extracted ${entries.length} editorial texts without source layout markup.`);await browser.close();
