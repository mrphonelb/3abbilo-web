import React,{useEffect,useRef,useState}from'react';import{createPortal}from'react-dom';import{createRoot}from'react-dom/client';import{Gamepad2,Smartphone,Gift,Wifi,WalletCards,Zap,ShieldCheck,ArrowRight,LogIn,LayoutDashboard,Package,Store,ReceiptText,History,BarChart3,Wallet,User,KeyRound,LogOut,Menu,X,RefreshCw,MessageCircle,Globe2,Search,ChevronLeft,ChevronRight,ChevronDown}from'lucide-react';import'./style.css';import logo3abbilo from './3abbilo-logo.png';
const API=(import.meta.env.VITE_API_BASE_URL||'https://api.3abbilo.com').replace(/\/$/,'');
const services=[['Mobile Top-Up',Smartphone,'Alfa, Touch and instant mobile recharge.','cyan'],['Gaming Cards',Gamepad2,'PUBG, Jawaker and popular gaming services.','violet'],['Gift Cards',Gift,'Digital cards and codes delivered instantly.','pink'],['Data & eSIM',Wifi,'Flexible data services for connected customers.','orange']];
const Brand=({foot=false})=>{const logged=Boolean(localStorage.getItem('3abbilo_token'));return <a className={'brand '+(foot?'foot':'')} href={logged?'/dashboard':'/login'}><img src={logo3abbilo} alt="3ABBILO" /></a>};
function Home(){return <><header><Brand/><a className="signin" href="/login"><LogIn size={17}/> Sign in</a></header><main><section className="hero"><div className="copy"><div className="eyebrow">BUILT FOR RESELLERS</div><h1>Recharge faster.<br/><em>Sell more.</em></h1><p>One modern workspace for dealers and shops to sell gaming cards, mobile top-ups and digital services.</p><a className="primary" href="/login">Sign in <ArrowRight size={18}/></a><div className="trust"><ShieldCheck size={17}/> Secure reseller platform</div></div><div className="visual"><div className="glow g1"></div><div className="glow g2"></div><div className="dash"><div className="dashTop"><div><small>3ABBILO WALLET</small><h3>Available balance</h3></div><WalletCards/></div><div className="money">$1,240.50</div><div className="stats"><div><small>Today’s orders</small><b>28</b></div><div><small>Digital sales</small><b>$685</b></div></div><div className="chips"><span>GAME TOP-UP</span><span>GIFT CARDS</span><span>MOBILE</span></div></div></div></section><section className="services"><div className="sectionHead"><div><div className="eyebrow">DIGITAL SERVICES</div><h2>Everything your counter needs.</h2></div><p>Fast access to the services your customers ask for every day.</p></div><div className="grid">{services.map(([n,I,d,c])=><div className={'card '+c} key={n}><div className="icon"><I/></div><h3>{n}</h3><p>{d}</p><span>Explore <ArrowRight size={15}/></span></div>)}</div></section><section className="banner"><div><div className="eyebrow light">ONE WALLET. MORE SERVICES.</div><h2>Built to keep your shop moving.</h2><p>Manage your balance, orders and digital sales from one clean workspace.</p></div><div className="orb"><Zap/><span>Instant<br/>delivery</span></div></section></main><footer><Brand foot/><p>Digital recharge for modern resellers.</p><small>© 2026 3ABBILO. All rights reserved.</small></footer></>}
function Login(){const[email,setEmail]=useState(''),[p,setP]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);async function submit(e){e.preventDefault();setBusy(true);setErr('');try{const r=await fetch(API+'/api/wholesale/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim(),password:p})});const d=await r.json();if(!r.ok||!d.token)throw new Error(d.error||d.message||'Sign in failed');localStorage.setItem('3abbilo_token',d.token);const accountType=String(d.account?.account_type||'').toLowerCase();location.replace(['jounieh','jbeil'].includes(accountType)?'/dashboard?view=products':'/dashboard')}catch(x){setErr(x.message)}finally{setBusy(false)}}return <div className="loginPage"><div className="loginGlow"></div><form className="loginBox" onSubmit={submit}><Brand/><div className="loginSlogan">Top-Up Smarter</div><label>Email<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Enter your email address"/></label><label>Password<input type="password" autoComplete="current-password" value={p} onChange={e=>setP(e.target.value)} required placeholder="Enter your password"/></label>{err&&<div className="loginError">{err}</div>}<button className="loginSubmit" disabled={busy}>{busy?'Signing in…':'Sign in'}<ArrowRight size={18}/></button><div className="loginSecure"><ShieldCheck size={16}/> Secure access to 3ABBILO</div></form></div>}
const dealerNav=[[LayoutDashboard,'Dashboard'],[Package,'Products'],[Store,'My Shops'],[ReceiptText,'My Orders'],[ReceiptText,'Shop Orders'],[History,'Transactions'],[BarChart3,'Profit Report'],[Wallet,'Recharge Account'],[User,'My Account'],[KeyRound,'Change Password']];const branchNav=[[Package,'Products'],[ReceiptText,'My Orders']];const shopNav=[[LayoutDashboard,'Dashboard'],[Package,'Products'],[ReceiptText,'My Orders'],[History,'Transactions'],[BarChart3,'Profit Report'],[Wallet,'Recharge Account'],[User,'My Account'],[KeyRound,'Change Password']];
const categoryIcons={games:Gamepad2,chat:MessageCircle,gift_cards:Gift,alfa:Smartphone,touch:Smartphone,dsl:Wifi,other_services:Package,esim:Globe2};
function authHeaders(){return{Authorization:'Bearer '+localStorage.getItem('3abbilo_token')}}
function productImage(p){return p?.key?'/product-images/'+encodeURIComponent(p.key):''}
const quantityQuoteCache=new Map();
const serviceDetailCache=new Map();
const serviceDetailValues=new Map();
function serviceDetails(key){
 const account=authHeaders().Authorization;
 const cacheKey=account+'|'+key;
 return cachedFetch(serviceDetailCache,cacheKey,90000,async()=>{
  const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(key)+'/details',{headers:authHeaders()});
  const d=await r.json();if(!r.ok)throw Error(d.error||'Could not load service');
  serviceDetailValues.set(cacheKey,{product:d.product,until:Date.now()+90000});
  return d.product;
 });
}

const chatOffersPriceCache=new Map();
const chatQuantityPreviews=new Map();
const chatQuantityWarmups=new Map();
const chatSinglePreviewWarmups=new Map();
async function preloadChatQuantity(key){
 const accountKey=authHeaders().Authorization+'|'+key;
 const existing=chatQuantityPreviews.get(accountKey);
 if(existing&&Date.now()-existing.at<45000)return existing.quote;
 return cachedFetch(chatSinglePreviewWarmups,accountKey,45000,async()=>{
  const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(key)+'/chat-quantity-preview',{headers:authHeaders()});
  const d=await r.json();if(!r.ok||!d.quote)throw Error(d.error||'Current price unavailable');
  chatQuantityPreviews.set(accountKey,{quote:d.quote,at:Date.now()});
  return d.quote;
 });
}
async function preloadChatQuantities(){
 const accountKey=authHeaders().Authorization;
 return cachedFetch(chatQuantityWarmups,accountKey,45000,async()=>{
  const r=await fetch(API+'/api/wholesale/products/chat-quantity-previews',{headers:authHeaders()});
  const d=await r.json();if(!r.ok)throw Error(d.error||'Unable to preload Chat Apps');
  for(const [key,quote] of Object.entries(d.quotes||{}))chatQuantityPreviews.set(accountKey+'|'+key,{quote,at:Date.now()});
  return d.quotes||{};
 });
}

function chatOfferPrices(key,group){
 const accountKey=authHeaders().Authorization+'|'+key+'|'+group;
 return cachedFetch(chatOffersPriceCache,accountKey,20000,async()=>{
  const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(key)+'/chat-offer-prices?group='+encodeURIComponent(group),{headers:authHeaders()});
  const d=await r.json();if(!r.ok)throw Error(d.error||'Prices unavailable');return d.prices||{};
 });
}

function cachedFetch(cache,key,ttl,run){
 const item=cache.get(key);
 if(item&&item.until>Date.now())return item.promise;
 const promise=Promise.resolve().then(run).catch(e=>{cache.delete(key);throw e});
 cache.set(key,{promise,until:Date.now()+ttl});
 return promise;
}
function quantityQuote(key,suffix=''){
 const cacheKey=authHeaders().Authorization+'|'+key+'|'+suffix;
 return cachedFetch(quantityQuoteCache,cacheKey,12000,async()=>{
  const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(key)+'/quote'+suffix,{headers:authHeaders()});
  const d=await r.json();if(!r.ok)throw new Error(d.error||'Price unavailable');return d.quote;
 });
}
function ProductArtwork({p,alt='',compact=false}){
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[p?.key]);
 const title=String(p?.title||p?.name||alt||'CHAT APP').trim();
 const src=productImage(p);
 if(src&&!failed)return <img src={src} alt={alt||title} loading={compact?'eager':'lazy'} onError={()=>setFailed(true)}/>;
 return <div className="catalogFallback" role="img" aria-label={title} style={compact?{width:50,height:50,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:12,background:'#f4f7ff',color:'#152a54'}:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,background:'linear-gradient(145deg,#f6f2ff,#eef7ff)',color:'#1b335b',minHeight:140,padding:14}}><MessageCircle size={compact?23:38}/>{!compact&&<strong style={{fontSize:14,textAlign:'center',overflowWrap:'anywhere'}}>{title}</strong>}</div>;
}
function ProductTile({p,onOpen}){
 const tileRef=useRef(null);
 const prefetch=()=>{
  if(p.section==='gift_cards'||p.section==='alfa'||p.section==='touch'||p.section==='dsl'||p.key==='carfax')serviceDetails(p.key).catch(()=>{});
  if(p.type==='quantity'&&p.section==='chat')preloadChatQuantity(p.key).catch(()=>{});
  else if(p.section==='chat'){const group=Object.keys(p.groups||{})[0];if(group)chatOfferPrices(p.key,group).catch(()=>{})}
 };
 useEffect(()=>{
  if(p.section!=='chat'||!tileRef.current||typeof IntersectionObserver==='undefined')return;
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){
   if(p.type==='quantity')preloadChatQuantity(p.key).catch(()=>{});
   else{const group=Object.keys(p.groups||{})[0];if(group)chatOfferPrices(p.key,group).catch(()=>{})}
   observer.disconnect();
  }},{rootMargin:'120px'});
  observer.observe(tileRef.current);
  return()=>observer.disconnect();
 },[p.key,p.type,p.section]);
 return <button ref={tileRef} className="catalogProduct" onPointerEnter={prefetch} onFocus={prefetch} onTouchStart={prefetch} onClick={()=>onOpen(p)}><ProductArtwork p={p}/><b>{p.title||p.name||p.key}</b></button>;
}
function offerLabel(o){
 const raw=String(o.displayName||o.name||o.offerId||o.id||'Option').trim();
 // Dazz Live supplier ids have the form coins_5000_250: base coins + bonus.
 // Present both quantities clearly, never concatenate them as '5000 250'.
 const dazz=raw.match(/^coins[\s_-]+([\d,]+)[\s_-]+([\d,]+)$/i);
 if(dazz){
  const base=Number(dazz[1].replace(/,/g,'')),bonus=Number(dazz[2].replace(/,/g,''));
  if(Number.isFinite(base)&&Number.isFinite(bonus))return `${base.toLocaleString('en-US')} + ${bonus.toLocaleString('en-US')} Coins`;
 }
 return raw.replaceAll('_',' ');
}
// Scrollable, width-constrained package picker: no platform-native list taller than the viewport.
function rechargeCardFaceValue(option){
 const explicit=Number(option?.credit_value);
 if(option?.credit_value!=null&&Number.isFinite(explicit)&&explicit>0)return explicit;
 // Some deployed catalog versions omit credit_value but append the credit
 // amount to the supplier package title, e.g. TOUCH 10 DAYS - $3.79.
 const label=offerLabel(option);
 const match=label.match(/(?:[-–—]|\()\s*(?:Credit:\s*)?\$\s*(\d+(?:\.\d{1,2})?)\s*\)?\s*$/i);
 return match?Number(match[1]):null;
}
function PackagePicker({options,value,onChange,placeholder='Choose package',priceFor,subtitleFor}){
 const[open,setOpen]=useState(false),outer=useRef(null),list=useRef(null);
 const[position,setPosition]=useState(null);
 useEffect(()=>{if(!open)return;
  const positionList=()=>{
   const rect=outer.current?.getBoundingClientRect();if(!rect)return;
   const viewport=window.visualViewport?.height||window.innerHeight;
   const above=rect.top,below=viewport-rect.bottom;
   const onTop=below<190&&above>below;
   const height=Math.max(80,Math.min(280,Math.floor((onTop?above:below)-12)));
   setPosition({left:Math.max(8,rect.left),width:Math.min(rect.width,window.innerWidth-16),top:onTop?Math.max(8,rect.top-height-5):rect.bottom+5,maxHeight:height});
  };
  positionList();
  const hide=e=>{if(!outer.current?.contains(e.target)&&!list.current?.contains(e.target))setOpen(false)};
  const key=e=>{if(e.key==='Escape')setOpen(false)};
  const onScroll=e=>{if(list.current?.contains(e.target))return;positionList()};
  document.addEventListener('pointerdown',hide);
  document.addEventListener('keydown',key);
  window.addEventListener('scroll',onScroll,true);window.addEventListener('resize',positionList);
  return()=>{document.removeEventListener('pointerdown',hide);document.removeEventListener('keydown',key);window.removeEventListener('scroll',onScroll,true);window.removeEventListener('resize',positionList)};
 },[open]);
 const idOf=o=>String(o.offerId??o.id??'');
 // Sort denominations and data packages by their actual size, not alphabetically
 // or by a quoted price (which may change with the logged-in account).
 const parseSortValue=o=>{
  // Prefer the quantity/data/denomination on the package, never the account's selling price.
  const text=String(offerLabel(o)||'').replace(/\s+[—–-]\s*\$\s*[\d,]+(?:\.\d+)?\s*$/,'').trim();
  const number=v=>Number(String(v).replace(/,/g,''));
  const valueFrom=o.sortValue??o.sort_value??o.face_value??o.denomination;
  if(valueFrom!=null&&Number.isFinite(number(valueFrom))&&number(valueFrom)>=0)return number(valueFrom);
  const volume=text.match(/([\d,]+(?:\.\d+)?)\s*(TB|GB|MB|KB)\b/i);
  if(volume)return number(volume[1])*({TB:1048576,GB:1024,MB:1,KB:1/1024}[volume[2].toUpperCase()]);
  const count=text.match(/([\d,]+(?:\.\d+)?)\s*(?:UC|diamonds?|coins?|tokens?|points?|gems?|gold|credits?|stars?|beans?|chips?|passes?|days?|months?|years?|weeks?|hours?|minutes?)\b/i);
  if(count)return number(count[1]);
  const currency=text.match(/(?:\$|USD\s*|US\$\s*)([\d,]+(?:\.\d+)?)/i)||text.match(/([\d,]+(?:\.\d+)?)\s*(?:USD|CAD|EUR|GBP)\b/i);
  if(currency)return number(currency[1]);
  const credit=number(o.credit_value);
  if(o.credit_value!=null&&Number.isFinite(credit)&&credit>0)return credit;
  // For packages with an unlabelled number, use the first complete number,
  // including thousands separators (e.g. IMO 4,200 before 8,400).
  const first=text.match(/\d[\d,]*(?:\.\d+)?/);
  return first?number(first[0]):Number.POSITIVE_INFINITY;
 };
 const sorted=[...(options||[])].sort((a,b)=>{
  const left=parseSortValue(a),right=parseSortValue(b);
  return (left===right?0:left-right)||offerLabel(a).localeCompare(offerLabel(b),undefined,{numeric:true});
 });
 const selected=sorted.find(o=>idOf(o)===String(value))||options.find(o=>idOf(o)===String(value));
 const format=o=>{
  if(!o)return placeholder;
  const raw=priceFor?.(o);
  if(raw&&typeof raw==='object'&&!Array.isArray(raw)){
   if(raw.label)return raw.label;
   const face=Number(raw.base),sell=Number(raw.selling);
   const cleanName=offerLabel(o).replace(/\s*[-–—]\s*(?:Credit:\s*)?\$[\d.]+\s*$/i,'').trim();
   if(raw.base!=null&&raw.selling!=null&&Number.isFinite(face)&&face>0&&Number.isFinite(sell)&&sell>0)
    return `${cleanName} ($${face.toFixed(2)}) — $${sell.toFixed(2)}`;
   if(raw.selling!=null&&Number.isFinite(sell)&&sell>0)return `${cleanName} — $${sell.toFixed(2)}`;
  }
  const price=raw&&typeof raw==='object'?raw.value:raw;
  return offerLabel(o)+(price!=null&&price!==''&&Number.isFinite(Number(price))?' — $'+Number(price).toFixed(2):'');
 };
 return <div className={'branchPicker'+(open?' isOpen':'')} ref={outer}>
  <button type="button" className="branchPickerTrigger" aria-haspopup="listbox" aria-expanded={open} onClick={()=>setOpen(v=>!v)} disabled={!sorted.length}>{selected?format(selected):(sorted.length?placeholder:'No live packages available')}<span aria-hidden="true">⌄</span></button>
  {open&&position&&createPortal(<div className="branchPickerOptions branchPickerFloating" ref={list} style={position} role="listbox" aria-label={placeholder}>{sorted.map((o,i)=>{const id=idOf(o);return <button type="button" role="option" aria-selected={id===String(value)} className={id===String(value)?'selected':''} key={id||i} onClick={()=>{onChange(id);setOpen(false)}}><span>{format(o)}</span>{subtitleFor?.(o)&&<small className="floatingPickerSubtitle">{subtitleFor(o)}</small>}</button>})}</div>,document.body)}
 </div>;
}

// Rounded checkout suggestion for branch cash collection. Product/package retail
// prices remain unchanged; only the starting amount collected is rounded up.
// Below $5: next $0.50; $5–<$20: next $1; $20–<$40: next $5; $40+: next $10.
function branchCashPrice(price){
 const value=Number(price);
 if(!Number.isFinite(value)||value<=0)return '0.00';
 const step=value<5?.5:value<20?1:value<40?5:10;
 return (Math.ceil((value-1e-9)/step)*step).toFixed(2);
}
// Alfa/Touch Credits: round the cost upward to the next $0.50, then add $0.50.
function creditCashPrice(cost){return ((Math.ceil((Number(cost)-1e-9)*2)+1)/2).toFixed(2)}
function BranchSellingPrice({value,onChange,minimum,retail,locked=false,credit=false,showProfit=false}){
 const base=Number(credit?creditCashPrice(Math.max(Number(minimum||0),Number(retail||0))):branchCashPrice(retail)),floor=Number(minimum||0);
 const display=Number.isFinite(Number(value))?value:'';
 const deltas=[-1,-.5,0,.5,1];
 return <div className="sellCompact branchSellingPrice">
   <div className="sellLine branchSellingLine"><b>Selling Price</b><input aria-label="Selling Price" type="number" step="0.01" min={floor} value={display} readOnly={locked} onChange={e=>onChange(e.target.value)}/>{showProfit&&<span>Profit <strong>${(Number(display||0)-floor).toFixed(2)}</strong></span>}</div>
   {!locked&&<div className="branchPriceSteps" aria-label="Suggested selling prices">{deltas.map(delta=>{
     const target=Math.round((base+delta)*100)/100;
     const allowed=Number.isFinite(target)&&target>0&&target+1e-9>=floor;
     return <button type="button" key={delta} disabled={!allowed} title={allowed?'Set selling price to $'+target.toFixed(2):'Below account cost'} className={Math.abs(Number(value)-target)<.005?'active':''} onClick={()=>onChange(target.toFixed(2))}>
       <strong>${target.toFixed(target%1===0?0:2)}</strong>
     </button>;
   })}</div>}
 </div>;
}

// Game top-up cashier suggestions only. Account cost is unchanged.
function gameCashPrice(price){
 const amount=Number(price);
 if(!Number.isFinite(amount)||amount<=0)return '0.00';
 const step=amount<5?.5:amount<20?1:amount<40?5:10;
 return (Math.ceil((amount-1e-9)/step)*step).toFixed(2);
}
function GameSellingPrice({value,onChange,minimum,retail,showProfit=false,pending=false}){
 const base=Number(gameCashPrice(Math.max(Number(minimum||0),Number(retail||0))));
 const floor=Number(minimum||0);
 return <div className="sellCompact branchSellingPrice gameSellingPrice">
  <div className="sellLine branchSellingLine"><b>Selling Price</b><input aria-label="Selling Price" type="number" min={floor} step="0.01" value={value} onChange={e=>onChange(e.target.value)}/>{showProfit&&<span>Profit <strong>{pending?'—':'$'+(Number(value||0)-floor).toFixed(4)}</strong></span>}</div>
  <div className="branchPriceSteps" aria-label="Suggested game selling prices">{[-1,-.5,0,.5,1].map(delta=>{
   const target=Math.round((base+delta)*100)/100;
   const allowed=!pending&&Number.isFinite(target)&&target>0&&target+1e-9>=floor;
   return <button type="button" key={delta} disabled={!allowed} className={Math.abs(Number(value)-target)<.005?'active':''} onClick={()=>onChange(target.toFixed(2))}><strong>${target.toFixed(target%1===0?0:2)}</strong></button>;
  })}</div>
 </div>;
}

// Gift-card cashier suggestion, shared by all account types. The reference is
// the account's own purchase cost; this never changes the supplier debit.
function giftCashPrice(cost){
 const n=Number(cost);
 if(!Number.isFinite(n)||n<=0)return '0.00';
 let extra=0;
 if(n>=400)extra=30;
 else if(n>=200)extra=15;
 else if(n>=100)extra=10;
 else if(n>=60)extra=5;
 else if(n>=40)extra=3;
 else if(n>=25)extra=1;
 else if(n>=20)extra=0;
 // Whole-dollar values get at least $1 of room for a retail sale.
 const rounded=Math.ceil(n+extra-1e-9);
 return (Math.max(rounded,Math.floor(n)+1)).toFixed(2);
}
// Gift card suggestions: rounded cashier price, independent of supplier debit.
function GiftSellingPrice({value,onChange,minimum,retail,showProfit=false}){
 const floor=Number(minimum||0);
 const base=Number(giftCashPrice(floor));
 return <div className="sellCompact branchSellingPrice giftSellingPrice">
  <div className="sellLine branchSellingLine"><b>Selling Price</b><input aria-label="Selling Price" type="number" min={floor} step="0.01" value={value} onChange={e=>onChange(e.target.value)}/>{showProfit&&<span>Profit <strong>${(Number(value||0)-floor).toFixed(4)}</strong></span>}</div>
  <div className="branchPriceSteps" aria-label="Suggested gift card selling prices">{[-1,-.5,0,.5,1].map(delta=>{
   const target=Math.round((base+delta)*100)/100;
   const allowed=Number.isFinite(target)&&target>0&&target+1e-9>=floor;
   return <button type="button" key={delta} disabled={!allowed} className={Math.abs(Number(value)-target)<.005?'active':''} onClick={()=>onChange(target.toFixed(2))}><strong>${target.toFixed(target%1===0?0:2)}</strong></button>;
  })}</div>
 </div>;
}

function WholesaleSellingPrice({value,onChange,minimum,retail,showProfit=true,credit=false}){
 const floor=Number(minimum||0);
 const base=Number(credit?creditCashPrice(floor):branchCashPrice(Math.max(floor,Number(retail||0))));
 return <div className="sellCompact branchSellingPrice wholesaleSellingPrice">
  <div className="sellLine branchSellingLine"><b>Selling Price</b><input aria-label="Selling Price" type="number" min={floor} step="0.01" value={value} onChange={e=>onChange(e.target.value)}/>{showProfit&&<span>Profit <strong>${(Number(value||0)-floor).toFixed(2)}</strong></span>}</div>
  <div className="branchPriceSteps" aria-label="Suggested service selling prices">{[-1,-.5,0,.5,1].map(delta=>{
   const target=Math.round((base+delta)*100)/100;
   const allowed=Number.isFinite(target)&&target>0&&target+1e-9>=floor;
   return <button type="button" key={delta} disabled={!allowed} className={Math.abs(Number(value)-target)<.005?'active':''} onClick={()=>onChange(target.toFixed(2))}><strong>${target.toFixed(target%1===0?0:2)}</strong></button>;
  })}</div>
 </div>;
}

// The suggestion represents the customer's gross margin (roughly 12–15%).
// 8.50 / 0.85 = 10.00. Round to a practical 50-cent increment.
function suggestedChatRetail(accountCost){
 const cost=Number(accountCost);
 if(!Number.isFinite(cost)||cost<=0)return 0;
 const target=cost/0.85;
 let center=Math.round(target*2)/2;
 if(center<=cost)center=Math.ceil((cost+0.01)*2)/2;
 return Number(center.toFixed(2));
}
// Reference amounts from the supplied Chat App chart. These are suggested
// QUANTITIES, not supplier offers or fixed prices. Cost is always quoted for the
// selected quantity and authenticated account by the backend.
const CHAT_QUANTITY_REFERENCE={
 likeelive:[250,500,1000,2500],
 tango:[1500,3000,5000],
 litchat:[21000,42000,90000,200000],
 solfachat:[3000,6000,12000,30000],
 soulu:[4500,10000,20000,50000],
 honeyjar:[500,1000,2300,5500],
 coccolive:[35000,70000,160000,400000],
 dimochat:[4000,8000,16000,40000],
 samachat:[35000,70000,150000,350000],
 kiyolive:[10000,20000,40000,80000],
 superlive:[750,1500,3000,8000],
 xena:[35000,70000,150000,400000],
 sayalikee:[20000,40000,80000,220000],
 mr7bachat:[600000,1200000,2500000,5000000],
 sodfa:[75000,150000,320000,500000],
 dreamchat:[3000,6500,14000,30000],
 vecochat:[45000,90000,200000,500000],
 potalive:[150000,300000,900000],
 nabd:[25000,50000,110000,230000],
 hiparty:[40000,80000,160000,400000],
 yooy:[50000,100000,200000],
 yaahlan:[2200,4500,10000,24000],
 soulchill:[2500,5000,10000,25000],
 poppolive:[40000,80000,160000,400000],
 poppo:[40000,80000,160000,400000],
 waho:[40000,80000,160000,420000],
 tadachat:[3500,7000,15000,30000],
 ligolive:[4000,8000,16000,35000],
 soyochat:[5000,10000,20000,50000],
 laylachat:[40000,80000,160000,400000],
 bigolive:[250,500,1000,2500],
 bigo:[250,500,1000,2500],
 yohowaka:[40000,80000,160000,400000],
 azar:[1870,4950],
 fourfun:[65000,130000,270000],
 "4fun":[65000,130000,270000],
 fourfunchat:[65000,130000,270000],
 higolive:[4000,8000,16000,40000],
 fancylive:[55000,110000,220000,500000],
 uplive:[250,600,1200],
 partystar:[4500,9000,18000,40000],
 gimme:[35000,65000,165000,340000],
 oohlachat:[5500,11000,25000,55000],
 wyakchat:[1000000,2000000,4000000,5000000],
 majlischat:[4000,8000,16000,40000],
 amarchat:[5000,10000,20000],
 yallalive:[2900,5900,12500],
 lightchat:[12000,25000,40000,100000],
 somacht:[30000,60000,120000,300000],
 bobochat:[80000,160000,400000],
 sevenstar:[35000,75000,160000,330000],
 halachat:[35000,75000,150000,400000],
 olamet:[30000,60000,120000,300000],
 livuchat:[1250,2500,5000,10000],
 ifun:[50000,100000,200000,400000],
 hayyakomlive:[10000,22000,60000],
 toptop:[40000,80000,160000,400000],
 yoyochat:[5000,10000,20000,50000],
 lamachat:[12000,25000,50000,80000],
 hakichat:[4500,9000,20000,40000],
 bellachat:[5000,10000,20000,50000],
 wego:[40000,80000,160000,400000],
 chatchill:[9500,18500,37000,94000],
 azallive:[5000,10000,20000,50000],
 hiyachat:[4000,8000,16000,40000],
 hawachat:[8000,16000,30000,50000],
 soulchat:[30000,60000,150000],
 ahlanchat:[10000,20000,50000],
 sochat:[30000,60000,120000,300000],
 dawalive:[30000,60000,120000,300000],
 sugo:[28000,56000,120000,300000],
};
// For an app not on the reference chart, generate ten rounded amounts across
// its live minimum/maximum. Include reference quantities exactly when in range.
function chatQuantityPresets(productKey,minQuantity,maxQuantity,productTitle=''){
 const min=Math.max(1,Math.ceil(Number(minQuantity)||1));
 const max=Math.max(min,Math.floor(Number(maxQuantity)||min));
 if(min===max)return [min];
 const count=Math.min(10,max-min+1);
 const normalized=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
 const keys=[normalized(productTitle),normalized(productKey)];
 const refs=keys.map(k=>CHAT_QUANTITY_REFERENCE[k]).find(Array.isArray)||[];
 const selected=new Set([min,max]);
 refs.forEach(n=>{if(n>=min&&n<=max)selected.add(n)});
 if(selected.size>=count)return [...selected].sort((a,b)=>a-b).slice(0,count);
 const nice=v=>{
  if(v<10)return Math.round(v);
  const magnitude=Math.pow(10,Math.floor(Math.log10(v)));
  const steps=[1,1.25,1.5,2,2.5,3,3.5,4,5,6,6.5,7,7.5,8,9,10];
  const choice=steps.reduce((best,step)=>Math.abs(step*magnitude-v)<Math.abs(best*magnitude-v)?step:best);
  return Math.round(choice*magnitude);
 };
 const candidateSet=new Set();
 // Sample the whole span, rather than filling all buttons near the minimum.
 for(let i=0;i<=250;i++){
  const raw=min*Math.pow(max/min,i/250);
  const n=nice(raw);if(n>=min&&n<=max)candidateSet.add(n);
 }
 // Small integer ranges must still yield ten unique quantities where possible.
 if(max-min<150)for(let n=min;n<=max;n++)candidateSet.add(n);
 if(candidateSet.size+selected.size<count){
  for(let i=0;i<=250;i++){
   const n=Math.round(min+(max-min)*i/250);
   if(n>=min&&n<=max)candidateSet.add(n);
  }
 }
 const candidates=[...candidateSet].filter(n=>!selected.has(n));
 while(selected.size<count&&candidates.length){
  let bestIndex=-1,bestScore=-1;
  for(let i=0;i<candidates.length;i++){
   const candidate=candidates[i];
   // Maximize distance to existing suggestions in logarithmic space, so
   // both small and large quantities remain conveniently represented.
   const score=Math.min(...[...selected].map(n=>Math.abs(Math.log(candidate/n))));
   if(score>bestScore){bestScore=score;bestIndex=i}
  }
  selected.add(candidates.splice(bestIndex,1)[0]);
 }
 return [...selected].sort((a,b)=>a-b).slice(0,count);
}

function ChatSellingPrice({value,onChange,minimum,showProfit=false,pending=false}){
 const center=suggestedChatRetail(minimum),floor=Number(minimum||0);
 return <div className="sellCompact branchSellingPrice chatSellingPrice">
  <div className="sellLine branchSellingLine"><b>Selling Price</b><input aria-label="Selling Price" type="number" min={floor} step="0.01" value={value} onChange={e=>onChange(e.target.value)}/>{showProfit&&<span>Profit <strong>{pending?'—':'$'+(Number(value||0)-floor).toFixed(4)}</strong></span>}</div>
  {center>0&&<div className="branchPriceSteps" aria-label="Suggested chat selling prices">{[-1,-.5,0,.5,1].map(delta=>{
   const target=Math.round((center+delta)*100)/100;
   const allowed=!pending&&target>0&&target+1e-9>=floor;
   return <button type="button" key={delta} disabled={!allowed} className={Math.abs(Number(value)-target)<.005?'active':''} onClick={()=>onChange(target.toFixed(2))}><strong>${target.toFixed(target%1===0?0:2)}</strong></button>;
  })}</div>}
 </div>;
}

// Supplier-backed form for 3ABBILO digital services. Product type and section,
// NOT the private supplier property, select the correct popup.
// One receipt for Games, Chat Apps, Gift Cards, OneZone, CARFAX and eSIM.
// Reads only the current account's stored result; never calls a supplier again.
function PurchaseResult({orderId,initial=null,branch=false,onClose}){
 const[order,setOrder]=useState(initial),[error,setError]=useState(''),[copyMsg,setCopyMsg]=useState('');
 const numericId=Number(orderId||initial?.id);
 useEffect(()=>{
  if(!Number.isSafeInteger(numericId)||numericId<=0)return;
  let active=true,timer=null;
  async function refresh(){
   if(!active)return;
   let terminal=false;
   try{
    const r=await fetch(API+'/api/wholesale/orders/result/'+numericId,{headers:authHeaders(),cache:'no-store'});
    const d=await r.json();if(!r.ok)throw Error(d.error||'Unable to retrieve order');
    terminal=['success','failed','refunded'].includes(String(d.order?.status||'').toLowerCase());
    if(active){setOrder(d.order);setError('')}
   }catch(e){if(active)setError(e.message)}
   if(active&&!terminal)timer=setTimeout(refresh,3500);
  }
  refresh();
  return()=>{active=false;clearTimeout(timer)};
 },[numericId]);
 const state=String(order?.status||'pending').toLowerCase();
 const success=state==='success',failed=['failed','refunded'].includes(state),pending=!success&&!failed;
 const validHttps=url=>typeof url==='string'&&/^https:\/\/[^\s]+$/i.test(url);
 const install=order?.install&&typeof order.install==='object'?order.install:{};
 const report=validHttps(order?.report_url)?order.report_url:null;
 const qr=validHttps(install.qr_code_url)?install.qr_code_url:null;
 const installLink=validHttps(install.short_url)?install.short_url:null;
 const ios=validHttps(install.ios_install_url)?install.ios_install_url:null;
 const android=validHttps(install.android_install_url)?install.android_install_url:null;
 async function copy(value){try{await navigator.clipboard.writeText(String(value));setCopyMsg('Copied to clipboard')}catch{setCopyMsg('Copy is unavailable on this device')}}
 return <div className="unifiedReceipt" aria-live="polite">
   <div className={'receiptHeading '+(success?'receiptSuccess':failed?'receiptFailed':'receiptPending')}>
    {pending?<RefreshCw size={28} className="spin"/>:<ShieldCheck size={28}/>}
    <div><h3>{success&&['alfa_bill','touch_bill','ogero_bill'].includes(String(order?.product_key||''))?'Bill Paid Successfully':success?'Purchase successful':failed?'Purchase failed':'Order received — processing'}</h3><p>{success?'Service completed and receipt recorded':failed?'Please review the order details below':String(order?.supplier_status||'').match(/complete|success|delivered|fulfilled/i)?'Purchase completed. Your receipt is being finalized. Do not purchase again.':'Do not purchase again while confirmation is pending'}</p></div>
   </div>
   {Number.isSafeInteger(numericId)&&numericId>0&&<div className="receiptRow"><span>Order number</span><strong>#{numericId}</strong></div>}
   {(order?.package_name||order?.product_title)&&<div className="receiptRow"><span>Product</span><strong>{order.package_name||order.product_title}</strong></div>}
   {!!order?.customer_reference&&<div className="receiptRow"><span>Recipient / reference</span><strong>{order.customer_reference}</strong></div>}
   {!branch&&order?.account_cost!=null&&<div className="receiptRow"><span>Your cost</span><strong>${Number(order.account_cost).toFixed(4)}</strong></div>}
   {order?.selling_price!=null&&<div className="receiptRow"><span>Selling price</span><strong>${Number(order.selling_price).toFixed(2)}</strong></div>}
   {success&&!!order?.redeem_code&&<div className="receiptDelivery"><small>Delivered recharge / redeem code</small><div className="receiptCode"><strong>{order.redeem_code}</strong><button type="button" onClick={()=>copy(order.redeem_code)}>Copy code</button></div></div>}
   {success&&!!install.iccid&&<div className="receiptDelivery"><small>eSIM ICCID</small><div className="receiptCode"><strong>{install.iccid}</strong><button type="button" onClick={()=>copy(install.iccid)}>Copy</button></div></div>}
   {success&&qr&&<div className="receiptDelivery receiptQr"><small>eSIM activation QR code</small><img src={qr} alt="eSIM installation QR code" loading="lazy"/><a href={qr} target="_blank" rel="noopener noreferrer">Open QR code</a></div>}
   {success&&(installLink||ios||android)&&<div className="receiptLinks">{installLink&&<a href={installLink} target="_blank" rel="noopener noreferrer">Install eSIM</a>}{ios&&<a href={ios} target="_blank" rel="noopener noreferrer">Install on iPhone</a>}{android&&<a href={android} target="_blank" rel="noopener noreferrer">Install on Android</a>}</div>}
   {success&&!!install.lpa&&<div className="receiptDelivery"><small>Manual activation information</small><div className="receiptCode"><strong>{install.lpa}</strong><button type="button" onClick={()=>copy(install.lpa)}>Copy</button></div></div>}
   {success&&!!install.smdp_address&&<div className="receiptRow"><span>SM-DP+ address</span><strong>{install.smdp_address}</strong></div>}
   {success&&!!install.activation_code&&<div className="receiptRow"><span>Activation code</span><button type="button" className="receiptTextButton" onClick={()=>copy(install.activation_code)}>Copy activation code</button></div>}
   {success&&report&&<div className="receiptLinks"><a href={report} target="_blank" rel="noopener noreferrer">Open CARFAX report</a></div>}
   {success&&!order?.redeem_code&&!qr&&!report&&<div className="receiptNote">{order?.product_key==='esim_topup'?'The top-up was confirmed for the existing eSIM. No new QR code is issued.':'Your purchase was confirmed. You can review the transaction in My Orders.'}</div>}
   {pending&&<div className="receiptNote">{String(order?.supplier_status||'').match(/complete|success|delivered|fulfilled/i)?'Your purchase is confirmed and your receipt is being finalized. Your order is saved; do not buy again.':'Your order is saved. This receipt refreshes automatically; you can also close it and check My Orders. Do not submit the same purchase again.'}</div>}
   {failed&&<div className="receiptNote receiptNoteError">{safeCustomerMessage(order?.failure_reason||'The service could not complete this order.')}{order?.refunded_at?' The reserved wallet amount was refunded.':''}</div>}
   {error&&<div className="receiptNote receiptNoteError">{error}</div>}
   {!!copyMsg&&<p className="receiptCopyNotice" role="status">{copyMsg}</p>}
   <button type="button" className="popupAction" onClick={onClose}>Close result</button>
 </div>;
}

function alfaNumberStatus(value){
 const digits=String(value||'').replace(/\D/g,'').replace(/^961/,'');
 if(digits.length<3)return 'incomplete';
 const prefix=digits.slice(0,2),digit=Number(digits[2]);
 if(!['03','70','76','78','79','81','71'].includes(prefix))return 'invalid';
 if(digits.length>8)return 'invalid';
 const alfa=prefix==='71'?(digit===0||digit>=6):(digit>=1&&digit<=5);
 if(digits.length<8)return 'incomplete';
 return alfa?'alfa':'touch';
}
function safeCustomerMessage(value){
 const text=String(value||'').trim();
 if(!text)return 'Unable to complete your request. Please try again or contact support.';
 if(/(?:one\s*zone|onezone|daftra|mr\.?\s*phone|mrphonelb|fazer(?:cards)?|extra\s*4\s*card|supplier|\bapi\b|authorization|bearer|token|sql|https?:\/\/|www\.|\/api\/|request failed with status code|(?:error|status)\s*[:=]?\s*[45]\d\d)/i.test(text))return 'Your request needs review. Please contact support if you have already paid.';
 return text.slice(0,240);
}
function billNotice(result){
 if(result?.bill_status==='already_paid')return 'This bill has already been paid.';
 if(result?.bill_status==='unavailable')return 'No unpaid bill is available for this number.';
 const message=String(result?.message||'');
 if(/already\s*(?:been\s*)?paid|previously\s*paid|bill\s*(?:is\s*)?paid/i.test(message))return 'This bill has already been paid.';
 if(/bill\s*(?:is\s*)?not\s*available|no\s*(?:outstanding|unpaid|pending|payable)\s*bills?|bill\s*not\s*found|no\s*bills?/i.test(message))return 'No unpaid bill is available for this number.';
 return message||'No unpaid bill is available for this number.';
}
function ServiceModal({p,close,branch=false}){
 const detailKey=authHeaders().Authorization+'|'+p.key;
 const cachedDetail=serviceDetailValues.get(detailKey);
 const initialDetail=cachedDetail&&cachedDetail.until>Date.now()?cachedDetail.product:null;
 const [detail,setDetail]=useState(initialDetail),[loading,setLoading]=useState(!initialDetail),[error,setError]=useState('');
 const [values,setValues]=useState({method:'direct'}),[offer,setOffer]=useState(''),[quote,setQuote]=useState(null),[quotePending,setQuotePending]=useState(false);
 const [selling,setSelling]=useState(''),[phase,setPhase]=useState(1),[busy,setBusy]=useState(false);
 const [ushareBaseCost,setUshareBaseCost]=useState(null);
 const [verified,setVerified]=useState(null),[moreOptions,setMoreOptions]=useState([]),[billOtp,setBillOtp]=useState('');
 // Distinguish a genuine empty plan list from a temporary lookup failure.
 const [sodetelLookupStatus,setSodetelLookupStatus]=useState('idle'),[sodetelRetry,setSodetelRetry]=useState(0);
 const serviceRequestKey=useRef(null);
 // Protect manual Sodetel selling-price edits from a late supplier quotation.
 const sellingEditedRef=useRef(false);
 const path=API+'/api/wholesale/products/'+encodeURIComponent(p.key);
 const update=(key,value)=>{
  setValues(v=>({...v,[key]:value}));setVerified(null);
  // Switching recharge method or entering a recipient must not discard a valid
  // package quote; otherwise 'Recharge Now' remains disabled until reselecting.
  if(['amount','identifier','service','report_type'].includes(key)||(key==='phone'&&isBill))setQuotePending(true);
  if(key==='identifier'||key==='service'){setOffer('');setMoreOptions([]);setQuote(null);setSelling('');sellingEditedRef.current=false}
  setBillOtp('');setPhase(1);setError('');serviceRequestKey.current=null;
 };
 useEffect(()=>{let active=true;setError('');
  serviceDetails(p.key).then(product=>{if(active)setDetail(product)}).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setLoading(false)});
  return()=>{active=false};
 },[p.key]);
 const fields=detail?.fields||[];
 // Credits use a quantity before a destination. Other Alfa/Touch offers
 // render their package selector before the recipient number below.
 const orderedFields=fields.some(x=>x.key==='amount')&&detail?.kind==='credit'
  ?[...fields].sort((a,b)=>Number(b.key==='amount')-Number(a.key==='amount')):fields;
 const kind=detail?.kind||'';
 const isBill=kind==='bill',isCarfax=kind==='carfax',isSodetel=kind==='sodetel_plan',isGift=kind==='gift_card';
 const isCredit=kind==='credit';
 const isUshare=kind==='ushare';
 const telcoProvider=String(detail?.provider||'').toLowerCase();
 const telcoCredit=isCredit&&['alfa','touch'].includes(telcoProvider);
 const phoneField=fields.find(x=>/phone|number|recipient/i.test(x.key||''));
 const phoneStatus=(telcoCredit||isBill&&['alfa','touch'].includes(telcoProvider))?alfaNumberStatus(values[phoneField?.key||'phone']):'incomplete';
 const isCard=kind==='standard',isDsl=kind==='dsl_card';
 const hasOptions=isGift||['standard','dsl_card','ushare','gift','validity','internet','sodetel_plan'].includes(kind);
 const options=isSodetel?moreOptions:(detail?.options||[]);
 const touchInternet=kind==='internet'&&telcoProvider==='touch';
 const touchInternetPackages=touchInternet?options.map(o=>({...o,name:String(o.name||'').replace(/\s*\((M\d+)\)\s*$/i,'').trim()})):options;
 const selectedTouchPackage=touchInternet?options.find(o=>String(o.offerId??o.id??'')===String(offer)):null;
 const touchSmsCode=selectedTouchPackage?String(selectedTouchPackage.id||'').match(/^M\d+$/i)?.[0]||String(selectedTouchPackage.name||'').match(/\((M\d+)\)/i)?.[1]:null;
 const needsPhone=isCard&&values.method==='direct';
 const validFields=fields.every(x=>String(values[x.key]||'').trim())&&(!needsPhone||String(values.phone||'').trim())&&(!telcoCredit||phoneStatus===telcoProvider)&&(!isCard||Boolean(values.method))&&(!isBill||Boolean(verified?.available&&verified?.bill_ticket)&&(telcoProvider==='ogero'?/^(?:0\d{6,8}|961\d{6,9})$/.test(String(values.phone||'').replace(/\D/g,'')):phoneStatus===telcoProvider))&&(!isCarfax||verified?.ok===true);
 // On package or credit change, fetch a fresh server-authoritative wholesale quote.
 useEffect(()=>{let active=true;setQuotePending(true);setPhase(1);
  if(!detail||(!offer&&!isCredit&&!isCarfax&&!isBill))return;
  if(isBill&&!verified?.available)return;
  if(isCredit&&(!(Number(values.amount)>=1)||!(Number(values.amount)<=99)))return;
  if(isSodetel&&(!values.identifier||!values.service))return;
  const q=new URLSearchParams();if(offer)q.set('offer_id',offer);
  if(isCredit)q.set('amount',values.amount||'');
  if(isSodetel){q.set('identifier',values.identifier||'');q.set('service',values.service||'')}
  if(isCarfax)q.set('report_type',values.report_type||'1');
  if(isBill)q.set('bill_ticket',verified.bill_ticket);
  if(isUshare)q.set('add_activation_credit',values.add_activation_credit===true?'true':'false');
  const timer=setTimeout(()=>{fetch(path+'/quote?'+q.toString(),{headers:authHeaders()}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Price unavailable');if(active){setQuote(d.quote);setQuotePending(false);setError('');setSelling(current=>(isSodetel&&sellingEditedRef.current)?current:(isDsl||isSodetel)?Number(Math.max(Number(d.quote.account_cost||0),Number(d.quote.recommended_selling_price??d.quote.account_cost??0))).toFixed(2):isCredit?creditCashPrice(branch?Math.max(Number(d.quote.account_cost||0),Number(d.quote.recommended_selling_price??d.quote.account_cost??0)):Number(d.quote.account_cost||0)):isGift&&!d.quote.fixed_selling_price?giftCashPrice(Number(branch?(d.quote.recommended_selling_price??d.quote.account_cost??0):(d.quote.account_cost||0))):!isBill&&!d.quote.fixed_selling_price?branchCashPrice(branch?Math.max(Number(d.quote.account_cost||0),Number(d.quote.recommended_selling_price??d.quote.account_cost??0)):Number(d.quote.account_cost||0)):Number(Math.max(Number(d.quote.account_cost||0),Number(d.quote.recommended_selling_price??d.quote.account_cost??0))).toFixed(2))}})
   .catch(e=>{if(active){setQuotePending(false);setError(e.message)}});},isCredit?170:0);
  return()=>{active=false;clearTimeout(timer)};
 },[p.key,offer,values.amount,values.identifier,values.service,values.report_type,values.add_activation_credit,verified?.bill_ticket,detail]);
 useEffect(()=>{
  if(!isUshare||!offer||!values.add_activation_credit){setUshareBaseCost(null);return;}
  let active=true;setUshareBaseCost(null);
  fetch(path+'/quote?'+new URLSearchParams({offer_id:offer,add_activation_credit:'false'}),{headers:authHeaders()})
   .then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Unable to load credit price');if(active)setUshareBaseCost(Number(d.quote?.account_cost));})
   .catch(()=>{if(active)setUshareBaseCost(null)});
  return()=>{active=false};
 },[p.key,offer,values.add_activation_credit,isUshare]);
 useEffect(()=>{
  const identifier=String(values.identifier||'').trim();
  if(!isSodetel||!values.service||!identifier||!/^[0-9A-Za-z-]{4,32}$/.test(identifier)){
   setMoreOptions([]);setSodetelLookupStatus('idle');return;
  }
  // Wait until the user pauses typing; prevent overlapping/outdated plans
  // responses from clearing valid options or displaying upstream failures.
  let active=true;
  const controller=new AbortController();
  setSodetelLookupStatus('loading');setError('');
  const timer=setTimeout(()=>{
   fetch(path+'/extra-options?'+new URLSearchParams({identifier,service:values.service}),{
    headers:authHeaders(),signal:controller.signal
   }).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Unable to load packages');return d;})
    .then(d=>{if(!active)return;const next=Array.isArray(d.options)?d.options:[];
     setMoreOptions(next);setSodetelLookupStatus(next.length?'ready':'empty');setError('');
    }).catch(e=>{if(!active||e.name==='AbortError')return;
     setMoreOptions([]);setSodetelLookupStatus('error');
     // The supplier can reject a lookup for a valid number. Never show its
     // internal failure code, provider name or raw transport details.
     setError('Unable to retrieve packages right now. Please try again.');
    });
  },550);
  return()=>{active=false;clearTimeout(timer);controller.abort()};
 },[p.key,values.identifier,values.service,isSodetel,sodetelRetry]);
 async function check(){setBusy(true);setError('');setVerified(null);try{
  const r=await fetch(path+'/check',{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify(isCarfax?{vin:values.vin,report_type:values.report_type}:{phone:values.phone})});
  const d=await r.json();if(!r.ok){const message=String(d.error||'Could not verify details');const normalized=billNotice({message});throw Error(isBill&&normalized!==message&&normalized!=='No unpaid bill is available for this number.'?normalized:message)}setVerified(d.result||{});if(isBill&&!d.result?.available&&!d.result?.requires_otp)setError(billNotice(d.result));if(isCarfax&&!d.result?.ok)setError(d.result?.message||'Vehicle could not be verified');
 }catch(e){setError(e.message)}finally{setBusy(false)}}
 async function verifyOtp(){if(!verified?.bill_ticket||!billOtp)return;
  setBusy(true);setError('');try{
   const r=await fetch(path+'/bill-otp',{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify({bill_ticket:verified.bill_ticket,otp:billOtp})});
   const d=await r.json();if(!r.ok)throw Error(d.error||'Could not verify bill OTP');
   setVerified(d.result||{});setBillOtp('');if(!d.result?.available&&!d.result?.requires_otp)setError(billNotice(d.result));
  }catch(e){setError(e.message)}finally{setBusy(false)}
 }
 async function purchase(){if(!detail?.purchase_available||!quote||busy)return;
  setBusy(true);setError('');try{
   if(!serviceRequestKey.current)serviceRequestKey.current=globalThis.crypto?.randomUUID?.()||('3abbilo-'+Date.now()+'-'+Math.random().toString(36).slice(2));
   const requestKey=serviceRequestKey.current;
   const r=await fetch(path+'/purchase',{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify({offer_id:offer,fields:isBill?{...values,bill_ticket:verified?.bill_ticket}:values,selling_price:Number(selling),request_key:requestKey})});
   const d=await r.json();if(!r.ok)throw Error(d.error||'Purchase could not be completed');
   window.dispatchEvent(new CustomEvent('3abbilo:order-placed',{detail:{orderId:d.order?.id||d.order_id}}));
  }catch(e){setError(e.message)}finally{setBusy(false)}
 }
 const price=Number(selling),cost=Number(quote?.account_cost||0),profit=price-cost;
 const priceFixed=Boolean(quote?.fixed_selling_price)||isBill;
 const telcoBill=isBill&&['alfa','touch','ogero'].includes(telcoProvider);
 const billPhoneValid=isBill&&['alfa','touch'].includes(telcoProvider)?phoneStatus===telcoProvider:(isBill&&telcoProvider==='ogero'?/^(?:0\d{6,8}|961\d{6,9})$/.test(String(values.phone||'').replace(/\D/g,'')):Boolean(values.phone));
 const billUsd=Number(verified?.full_amount_usd||0);
 const billLbp=Number(verified?.original_total_lbp||verified?.payment_amount_lbp||0);
 const billEstimatedSupplier=Number(quote?.estimated_dealer_cost);
 const billEstimatedCost=Number.isFinite(billEstimatedSupplier)&&billEstimatedSupplier>0?billEstimatedSupplier:null;
 const ready=!quotePending&&!quote?.__preview&&!!detail?.purchase_available&&!!quote&&validFields&&(!hasOptions||!!offer)&&Number.isFinite(price)&&price>=cost&&(!telcoCredit||(phoneStatus===telcoProvider&&Number(values.amount)>=1&&Number(values.amount)<=99));
 const fieldInput=(field)=>isCarfax&&field.key==='report_type'?<PackagePicker options={(field.options||[]).map(o=>({...o,name:({'1':'CAR FAX','2':'AUTO CHECK','3':'IMAGE REPORT'}[String(o.id)]||o.label||o.name||String(o.id)),sortValue:({'1':1,'2':2,'3':3}[String(o.id)]??999)})).sort((a,b)=>a.sortValue-b.sortValue)} value={values.report_type||''} onChange={v=>update('report_type',v)} placeholder="Choose Report Type" priceFor={o=>branch?(o.retail_price??o.account_cost??null):(o.account_cost??null)}/>:field.type==='select'?<PackagePicker options={(field.options||[]).map(o=>typeof o==='string'?{id:o,name:o}:{...o,id:String(o.id??o.value??''),name:String(o.label||o.name||o.id||o.value||'')})} value={values[field.key]||''} onChange={v=>update(field.key,v)} placeholder={'Choose '+field.label} priceFor={o=>branch?(o.retail_price??o.account_cost??null):(o.account_cost??null)}/>
  :<input type={field.type==='number'?'number':'text'} min={field.min} max={field.max} maxLength={field.maxLength} value={values[field.key]||''} onChange={e=>update(field.key,e.target.value)} placeholder={telcoBill&&field.key==='phone'?'Enter Phone Number':'Enter '+field.label}/>;
 return <div className="modalShade" onClick={e=>{if(e.target===e.currentTarget){e.stopPropagation();close()}}}>
  <div className="productModal compactModal servicePopup">
   <button className="modalClose" onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();close()}} aria-label="Close"><X size={21}/></button>
   <div className="popupTitle"><img src={productImage(p)} alt=""/><h2>{p.title}</h2></div>
   {loading&&<div className="popupLoadingSkeleton" role="status"><RefreshCw size={18} className="spin"/><span>Preparing options…</span></div>}
   <>
    {!loading&&detail&&<>
     {isCard&&<div className="popupField"><span className="popupLabel">Recharge Method</span><div className="rechargeMethodChoices"><button type="button" aria-pressed={values.method==='code'} className={values.method==='code'?'selected':''} onClick={()=>update('method','code')}>Buy Now</button><button type="button" aria-pressed={values.method==='direct'} className={values.method==='direct'?'selected':''} onClick={()=>update('method','direct')}>Direct Recharge</button></div></div>}
     {hasOptions&&!isSodetel&&<div className="popupField"><span className="popupLabel">{isGift?'Choose Denomination':'Choose Package'}</span><PackagePicker options={touchInternet?touchInternetPackages:options} value={offer} onChange={v=>{setOffer(v);setError('');setPhase(1);serviceRequestKey.current=null}} placeholder="Choose package" priceFor={o=>{if(isGift)return branch?o.retail_price:(o.account_cost??null);if(isCard){const face=rechargeCardFaceValue(o);const accountPrice=branch?(o.retail_price??o.account_cost??null):(o.account_cost??null);return face!=null?{base:face,selling:accountPrice,sortValue:face}:{selling:accountPrice};}return branch?(o.retail_price??o.price??null):(o.account_cost??null);}}/>{touchInternet&&touchSmsCode&&<div className="touchInternetSmsInstruction" role="status" style={{marginTop:8,fontSize:13,fontWeight:600,color:"#0b2751",textAlign:"center"}}>Send <strong>{touchSmsCode.toUpperCase()}</strong> to <strong>1188</strong></div>}</div>}
     {orderedFields.map(x=><div key={x.key}><label className="popupField">{!(telcoBill&&x.key==='phone')&&(telcoCredit&&x.key==='amount'?<span className="alfaCreditAmountHeading"><span>{x.label}</span><span className="alfaCreditAmountCost">Cost: <strong>{quote?(branch?Number(quote.recommended_selling_price??quote.account_cost):Number(quote.account_cost)).toLocaleString('en-US',{style:'currency',currency:'USD'}):'—'}</strong></span></span>:x.label)}{telcoCredit&&x.key==='amount'?<input type="number" min="1" max="99" step="1" value={values.amount||''} onChange={e=>{const v=e.target.value;update('amount',v!==''&&(Number(v)<1||Number(v)>99)?'':v)}} onBlur={()=>{if(values.amount!==''&&(!Number.isInteger(Number(values.amount))||Number(values.amount)<1||Number(values.amount)>99))update('amount','')}} placeholder="Enter credit amount"/>:fieldInput(x)}</label>{telcoCredit&&x.key===phoneField?.key&&phoneStatus!==telcoProvider&&['alfa','touch'].includes(phoneStatus)&&<div className="alfaCreditError" role="alert">This is not a {telcoProvider==='alfa'?'Alfa':'Touch'} number.</div>}{telcoCredit&&x.key===phoneField?.key&&phoneStatus==='invalid'&&<div className="alfaCreditError" role="alert">Enter a valid {telcoProvider==='alfa'?'Alfa':'Touch'} number.</div>}{telcoCredit&&x.key==='amount'&&<><div className="alfaCreditShortcuts">{[1,2,3,4,5,10,15,20,25,30].map(n=><button type="button" key={n} className={Number(values.amount)===n?'selected':''} onClick={()=>update('amount',String(n))}>${n}</button>)}</div></>}</div>)}
     {isSodetel&&values.service&&values.identifier&&<div className="popupField"><span className="popupLabel">Choose Package</span><PackagePicker options={moreOptions} value={offer} onChange={v=>{
      // The already fetched account price makes the field available immediately.
      // A fresh server quote still has to complete before a purchase is possible.
      const plan=moreOptions.find(x=>String(x.id)===String(v));
      const previewCost=Number(plan?.account_cost);
      const previewRetail=Number(plan?.retail_price);
      sellingEditedRef.current=false;
      if(plan&&Number.isFinite(previewCost)&&previewCost>0){
       const startingPrice=Math.max(previewCost,Number.isFinite(previewRetail)&&previewRetail>0?previewRetail:previewCost);
       setQuote({account_cost:previewCost,recommended_selling_price:startingPrice,offer_id:v,__preview:true});
       setSelling(startingPrice.toFixed(2));
      }else{setQuote(null);setSelling('')}
      setQuotePending(true);
      setOffer(v);setError('');setPhase(1);serviceRequestKey.current=null;
     }} placeholder={moreOptions.length?'Choose package':sodetelLookupStatus==='loading'?'Loading packages…':sodetelLookupStatus==='error'?'Packages temporarily unavailable':sodetelLookupStatus==='empty'?'No live packages available':'Choose package'} priceFor={o=>branch?(o.retail_price??null):(o.account_cost??null)}/>{sodetelLookupStatus==='error'&&<button type="button" className="popupSecondary" onClick={()=>{setError('');setSodetelRetry(n=>n+1)}}>Try Again</button>}</div>}
     {telcoBill&&['alfa','touch'].includes(phoneStatus)&&phoneStatus!==telcoProvider&&<div className="alfaCreditError" role="alert">This is not a {telcoProvider==='alfa'?'Alfa':'Touch'} number.</div>}
     {telcoBill&&phoneStatus==='invalid'&&<div className="alfaCreditError" role="alert">Enter a valid {telcoProvider==='alfa'?'Alfa':'Touch'} number.</div>}
     {isUshare&&<label className="ushareCreditRow"><span className="ushareCreditLeft"><input type="checkbox" checked={values.add_activation_credit===true} onChange={e=>{update('add_activation_credit',e.target.checked);setQuote(null);setSelling('')}}/><span>Add $1 Alfa Credit</span></span><strong className="ushareCreditCost">{values.add_activation_credit===true?(quote&&Number.isFinite(ushareBaseCost)?'$'+Math.max(0,Number(quote.account_cost)-ushareBaseCost).toFixed(2):'—'):'Optional'}</strong></label>}
     {needsPhone&&<label className="popupField">Recipient Number<input value={values.phone||''} onChange={e=>update('phone',e.target.value)} placeholder="Enter recipient number"/></label>}
     {isCarfax&&<button className="popupSecondary" disabled={busy||!values.vin||!values.report_type} onClick={check}>{busy?'Checking…':'Check Vehicle'}</button>}
     {isBill&&<button className="popupSecondary" disabled={busy||!billPhoneValid} onClick={check}>{busy?'Checking…':'Get Bill'}</button>}
     {isBill&&verified?.requires_otp&&<label className="popupField">Bill Verification Code<input value={billOtp} inputMode="numeric" maxLength={10} onChange={e=>setBillOtp(e.target.value.replace(/\D/g,''))} placeholder="Enter SMS verification code"/></label>}
     {isBill&&verified?.requires_otp&&<button className="popupSecondary" disabled={busy||!billOtp} onClick={verifyOtp}>{busy?'Verifying…':'Verify Bill Code'}</button>}
     {verified&&(!isBill||verified.available||verified.requires_otp)&&!telcoBill&&<div className="validationOk"><ShieldCheck size={17}/><span>{isBill?(verified.requires_otp?'A verification code is required':verified.available?'Bill found · $'+Number(verified.full_amount_usd).toFixed(2):(verified.message||'No payable bill found')):(verified.ok?(verified.year_make||verified.message||'Vehicle checked'):(verified.message||'Vehicle verification failed'))}</span></div>}
     {telcoBill&&verified?.available&&<div className="billPaymentSummary">
      {!branch&&quote&&<><div className="billPaymentRow"><span>Cost</span><strong>{billEstimatedCost!=null?'$'+billEstimatedCost.toFixed(2):'Pending confirmation'}</strong></div><div className="billPaymentRow"><span>Profit</span><strong>{billEstimatedCost!=null?'$'+(billUsd-billEstimatedCost).toFixed(2):'Pending confirmation'}</strong></div></>}
      {billLbp>0&&<div className="billPaymentRow billPaymentLbp"><span>Bill in LBP</span><strong>LBP {billLbp.toLocaleString('en-US',{maximumFractionDigits:0})}</strong></div>}
      <div className="billPaymentTotal"><span>Amount to Be Paid</span><strong>${billUsd.toFixed(2)}</strong></div>
     </div>}
     {quote&&!telcoBill&&(isGift?<GiftSellingPrice value={selling} onChange={v=>{setSelling(v);setPhase(1)}} minimum={cost} retail={quote.recommended_selling_price??cost} showProfit={!branch}/>:(isDsl||isSodetel)?<BranchSellingPrice value={selling} onChange={v=>{if(isSodetel)sellingEditedRef.current=true;setSelling(v);setPhase(1)}} minimum={cost} retail={Math.max(cost,Number(quote.recommended_selling_price??cost))} showProfit/>:branch?<BranchSellingPrice value={selling} onChange={v=>{setSelling(v);setPhase(1)}} minimum={cost} retail={quote.recommended_selling_price??cost} locked={priceFixed} credit={isCredit}/>:<WholesaleSellingPrice value={selling} onChange={v=>{setSelling(v);setPhase(1)}} minimum={cost} retail={cost} showProfit={!isBill} credit={isCredit}/>)}
     {detail.purchase_available&&phase===1?<button className="popupAction" disabled={!ready||busy} onClick={()=>setPhase(2)}>{telcoBill?'Pay Bill':isGift||isCarfax||(isCard&&values.method==='code')||isDsl?'Buy Now':'Recharge Now'}</button>:null}
     {detail.purchase_available&&phase===2?<button className="popupAction" disabled={!ready||busy} onClick={purchase}>{busy?'Processing…':'Confirm Purchase'}</button>:null}
     {(!detail.purchase_available)&&<div className="catalogNotice">Package lookup is available. Secure purchasing for this service and account is not active yet; no balance will be deducted.</div>}
    </>}
    {error&&<div className="catalogNotice error">{error}</div>}
   </>
  </div>
 </div>

}
function ProductModal({p,close,branch=false}){
 if(p.type==='mrp_telco'||p.section==='gift_cards'||p.key==='carfax')return <ServiceModal p={p} close={close} branch={branch}/>;
 const isQuantity=p.type==='quantity';
 const groups=p.groups&&typeof p.groups==='object'?Object.entries(p.groups):[];
 const[firstGroup,setFirstGroup]=useState(groups[0]?.[0]||'');
 const group=groups.find(([k])=>k===firstGroup)?.[1];
 const[offer,setOffer]=useState(''),[quantity,setQuantity]=useState(''),[rechargeAmount,setRechargeAmount]=useState(''),[amountMode,setAmountMode]=useState(false),[values,setValues]=useState({}),[quote,setQuote]=useState(null),[selling,setSelling]=useState(''),[validated,setValidated]=useState(null),[busy,setBusy]=useState(false),[msg,setMsg]=useState(''),[offerPrices,setOfferPrices]=useState({});
 const qtyTimer=useRef(null),qtyRequest=useRef(0),offerRequest=useRef(0),purchaseRequestKey=useRef(null),quantityDirty=useRef(false),sellingEditedRef=useRef(false);
 const [preview,setPreview]=useState(null),[quoting,setQuoting]=useState(false),[offerPending,setOfferPending]=useState(false);
 useEffect(()=>()=>clearTimeout(qtyTimer.current),[]);
 useEffect(()=>{purchaseRequestKey.current=null;quantityDirty.current=false;sellingEditedRef.current=false;setPreview(null);setQuoting(false);setOffer('');setQuote(null);setSelling('');setRechargeAmount('');setAmountMode(false);setValidated(null);setMsg('');setOfferPrices({});let alive=true;if(isQuantity){
   const cached=chatQuantityPreviews.get(authHeaders().Authorization+'|'+p.key);
   const applyPreview=q=>{
    if(!q||quantityDirty.current)return;
    setPreview(q);setQuantity(String(q.quantity));
    // Show the account-specific preview immediately; purchases still wait for a fresh quote.
    setQuote({...q,recharge_amount:branch?Number(q.recommended_selling_price??0):undefined,__preview:true});
    if(branch&&Number(q.retail_unit)>0){
      const amount=Number(q.recommended_selling_price||0);
      setRechargeAmount(amount>0?amount.toFixed(2):'');
    }
    if(!sellingEditedRef.current)setSelling((branch?Number(q.recommended_selling_price??q.account_cost):suggestedChatRetail(q.account_cost)).toFixed(2));
    setQuoting(true);
    fetchQuantityQuote(q.quantity);
   };
   if(cached&&Date.now()-cached.at<45000)applyPreview(cached.quote);
   else{
    setQuoting(true);
    preloadChatQuantity(p.key).then(q=>{
     if(alive&&!quantityDirty.current)applyPreview(q);
    }).catch(()=>{if(alive&&!quantityDirty.current)loadQuantityQuote()});
   }
   return()=>{alive=false};
  }
  if(p.section==='chat'){
   chatOfferPrices(p.key,firstGroup).then(prices=>{if(alive)setOfferPrices(prices)}).catch(e=>{if(alive)setMsg(e.message)});
  }else if(branch){
   fetch(API+'/api/wholesale/products/'+encodeURIComponent(p.key)+'/offer-prices?group='+encodeURIComponent(firstGroup),{headers:authHeaders()}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Prices unavailable');if(alive)setOfferPrices(d.prices||{})}).catch(e=>{if(alive)setMsg(e.message)});
  }else{
   // Other product groups retain their existing individual live quote previews.
   const list=group?.offers||[];
   Promise.all(list.map(async(o,i)=>{const id=o.offerId||o.id||i;try{const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(p.key)+'/quote?offer_id='+encodeURIComponent(id),{headers:authHeaders()});const d=await r.json();return r.ok?[String(id),d.quote]:null}catch{return null}})).then(rows=>{if(alive)setOfferPrices(Object.fromEntries(rows.filter(Boolean)))});
  }
  return()=>{alive=false}},[firstGroup,p.key,isQuantity,branch]);
 const img=productImage(p);const fields=p.fields?.length?p.fields:(p.playerLabel?[{key:p.fieldKey||'player_id',label:p.playerLabel,placeholder:p.playerPlaceholder}]:[]);
 async function loadQuote(v){
  const requestId=++offerRequest.current;purchaseRequestKey.current=null;sellingEditedRef.current=false;setOffer(v);setOfferPending(Boolean(v));setValidated(null);setMsg('');
  if(!v){setQuote(null);setOfferPending(false);setSelling('');return}
  const cached=offerPrices[String(v)];
  if(cached&&Number.isFinite(Number(cached.account_cost))){
   const baseline=branch?Number(cached.recommended_selling_price??cached.account_cost):Number(cached.account_cost);
   setSelling(gameCashPrice(Math.max(Number(cached.account_cost),baseline)));
  }
  try{
   // Bulk prices are DISPLAY LABELS only. Never authorize checkout from a cached list.
   const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(p.key)+'/quote?offer_id='+encodeURIComponent(v),{headers:authHeaders()});
   const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load price');if(requestId!==offerRequest.current)return;
   const q=d.quote;setQuote(q);setOfferPending(false);if(!sellingEditedRef.current)setSelling(gameCashPrice(Math.max(Number(q.account_cost||0),Number(q.recommended_selling_price??q.account_cost??0))));
  }catch(e){if(requestId===offerRequest.current){setOfferPending(false);setQuote(null);setMsg(e.message)}}
 }
 async function fetchQuantityQuote(v,{keepSelling=false}={}){
  const requestId=++qtyRequest.current;setMsg('');setQuoting(true);
  try{
   const n=Number(v),suffix=Number.isFinite(n)&&n>0?'?qty='+encodeURIComponent(n):'';
   const q=await quantityQuote(p.key,suffix);
   if(requestId!==qtyRequest.current)return;
   if(v===undefined||v===null)setQuantity(String(q.quantity??''));
   setQuote(q);setPreview(old=>({...old,...q,preset_prices:old?.preset_prices,retail_unit:old?.retail_unit}));setQuoting(false);
   const amount=Number(q.recharge_amount??(branch?q.recommended_selling_price:0));
   setRechargeAmount(amount>0?amount.toFixed(2):'');
   if(!keepSelling&&!sellingEditedRef.current)setSelling((branch?Number(q.recommended_selling_price??q.account_cost):suggestedChatRetail(q.account_cost)).toFixed(2));
  }catch(e){if(requestId===qtyRequest.current){setQuoting(false);setMsg(e.message)}}
 }
 function loadQuantityQuote(v,opts={}){
  ++qtyRequest.current;purchaseRequestKey.current=null;setAmountMode(false);setQuoting(true);
  if(v!==undefined&&v!==null){quantityDirty.current=true;sellingEditedRef.current=false}
  clearTimeout(qtyTimer.current);
  if(v===undefined||v===null){fetchQuantityQuote(undefined,opts);return}
  setQuantity(String(v));setMsg('');
  const selectedQty=Number(v);
  const presetPrice=preview?.preset_prices?.[String(selectedQty)];
  if(!branch&&Number.isInteger(selectedQty)&&Number.isFinite(Number(presetPrice))&&Number(presetPrice)>0){
   setQuote({product_key:p.key,quantity:selectedQty,min_qty:preview.min_qty,max_qty:preview.max_qty,account_cost:Number(presetPrice),__preview:true});
   setSelling(suggestedChatRetail(Number(presetPrice)).toFixed(2));
  }
  if(String(v).trim()===''||!Number.isInteger(selectedQty)||selectedQty<=0){setQuoting(false);return}
  qtyTimer.current=setTimeout(()=>fetchQuantityQuote(v,opts),120);
 }
 // Branches use the exact Mr. Phone amount-to-quantity conversion on the server.
 // The quote records the selected amount and derived quantity for purchase verification.
 async function fetchBranchAmount(amount){
  const requestId=++qtyRequest.current;setQuoting(true);
  try{
   const q=await quantityQuote(p.key,'?amount='+encodeURIComponent(Number(amount)));
   if(requestId!==qtyRequest.current)return;
   setQuantity(String(q.quantity));setQuote(q);setPreview(old=>({...old,...q,preset_prices:old?.preset_prices,retail_unit:old?.retail_unit}));setQuoting(false);
   setAmountMode(true);setSelling(Number(q.recommended_selling_price??amount).toFixed(2));
  }catch(e){if(requestId===qtyRequest.current){setQuoting(false);setMsg(e.message);setAmountMode(false)}}
 }
 function loadBranchAmount(amount){
  ++qtyRequest.current;purchaseRequestKey.current=null;
  setRechargeAmount(String(amount));setSelling(String(amount));sellingEditedRef.current=false;setMsg('');setAmountMode(false);setQuoting(true);
  const unit=Number(preview?.retail_unit);if(unit>0&&Number(amount)>0){const estimated=Math.floor((Number(amount)+1e-9)/unit);if(estimated>=Number(preview?.min_qty||1)&&estimated<=Number(preview?.max_qty||Infinity))setQuantity(String(estimated));}
  quantityDirty.current=true;
  clearTimeout(qtyTimer.current);
  const n=Number(amount);
  if(String(amount).trim()===''||!Number.isFinite(n)||n<=0){setQuoting(false);return}
  qtyTimer.current=setTimeout(()=>fetchBranchAmount(amount),130);
 }
 async function validate(){setBusy(true);setMsg('');try{const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(p.key)+'/validate',{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify({fields:values})});const d=await r.json();if(!r.ok||d.valid===false)throw new Error(d.error||'Incorrect account information');setValidated(d)}catch(e){setValidated(null);setMsg(e.message)}finally{setBusy(false)}}
 async function purchase(){if(!quote||busy)return;setBusy(true);setMsg('');try{if(!purchaseRequestKey.current)purchaseRequestKey.current=(globalThis.crypto?.randomUUID?.()||String(Date.now())+'-'+Math.random());const requestKey=purchaseRequestKey.current;const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(p.key)+'/purchase',{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify({offer_id:offer,quantity:isQuantity?Number(quantity):undefined,requested_amount:isQuantity&&branch&&amountMode?Number(rechargeAmount):undefined,fields:values,selling_price:Number(selling),request_key:requestKey})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Purchase failed');window.dispatchEvent(new CustomEvent('3abbilo:order-placed',{detail:{orderId:d.order?.id||d.order_id}}))}catch(e){setMsg(e.message)}finally{setBusy(false)}}
 const needsValidation=Boolean(p.validateCategoryId);const allFields=fields.every(f=>String(values[f.key]||'').trim());const canBuy=!quoting&&!offerPending&&quote&&!quote.__preview&&allFields&&(!needsValidation||validated)&&(!isQuantity||(Number.isInteger(Number(quantity))&&Number(quantity)>=Number(quote.min_qty||1)&&Number(quantity)<=Number(quote.max_qty||Infinity)&&Number(quantity)===Number(quote.quantity)&&(!branch||!amountMode||Math.abs(Number(rechargeAmount)-Number(quote.recharge_amount??quote.recommended_selling_price))<0.005)));const profit=Number(selling||0)-Number(quote?.account_cost||0);const minQty=Number(preview?.min_qty||quote?.min_qty||p.minQty||1),maxQty=Math.max(minQty,Number(preview?.max_qty||quote?.max_qty||p.maxQty||999999999));
 const limitsReady=Boolean(preview||quote);
 const hasAccurateQuote=quote&&!quoting&&!quote.__preview&&Number(quote.quantity)===Number(quantity)&&(!branch||!amountMode||Math.abs(Number(rechargeAmount)-Number(quote.recharge_amount??quote.recommended_selling_price))<0.005);
 const shownCost=quote&&Number(quote.quantity)===Number(quantity)?Number(quote.account_cost):null;
 const quotedForSelection=isQuantity?hasAccurateQuote&&(!branch||!amountMode||Math.abs(Number(rechargeAmount)-Number(quote?.recharge_amount??quote?.recommended_selling_price))<0.005):Boolean(quote)&&!offerPending;
 return <div className="modalShade" onClick={e=>{if(e.target===e.currentTarget){e.stopPropagation();close()}}}><div className="productModal compactModal"><button className="modalClose" onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();close()}}><X size={21}/></button><div className="popupTitle"><ProductArtwork p={p} compact/><h2>{p.title}</h2></div><>{!isQuantity&&groups.length>1&&<div className="popupField"><span className="popupLabel">Choose Category</span><PackagePicker options={groups.map(([k,g])=>({id:k,name:g.title||k}))} value={firstGroup} onChange={v=>{purchaseRequestKey.current=null;setFirstGroup(v)}} placeholder="Choose Category"/></div>}{!isQuantity&&group?.offers?.length>0&&<div className="popupField"><span className="popupLabel">Choose Package</span><PackagePicker options={group.offers} value={offer} onChange={loadQuote} priceFor={o=>{const q=offerPrices[String(o.offerId||o.id||'')];return branch?q?.recommended_selling_price:(q?.account_cost==null?null:{value:q.account_cost,decimals:q.decimals??4})}}/></div>}{fields.map((f,i)=><label className="popupField" key={f.key||i}>{f.label||f.name||'Account information'}{f.type==='select'&&Array.isArray(f.options)?<select value={values[f.key]||''} onChange={e=>{setValues(v=>({...v,[f.key]:e.target.value}));setValidated(null)}}><option value="">Choose {f.label||'option'}</option>{f.options.map((o,j)=><option key={o.value||o.id||j} value={o.value||o.id||o}>{o.label||o.name||o}</option>)}</select>:<input value={values[f.key]||''} onChange={e=>{setValues(v=>({...v,[f.key]:e.target.value}));setValidated(null)}} placeholder={f.placeholder||'Enter '+(f.label||'information')}/>}</label>)}{isQuantity&&<>
  {!branch&&<div className="quantityCost"><span>Your Cost</span><strong>{Number.isFinite(shownCost)&&shownCost>0?'$'+shownCost.toFixed(4):'—'}</strong></div>}
  <label className="popupField">Quantity
   {<div className="chatBranchQuantityControl">
     <button type="button" aria-label="Decrease quantity" disabled={Number(quantity||0)<=minQty} onClick={()=>loadQuantityQuote(String(Math.max(minQty,Number(quantity||minQty)-1)))}>−</button>
     <input type="number" min={minQty} max={maxQty} step="1" value={quantity} onChange={e=>loadQuantityQuote(e.target.value)} onBlur={e=>{const n=Number(e.target.value);if(e.target.value.trim()&&Number.isFinite(n)){const adjusted=Math.min(maxQty,Math.max(minQty,Math.trunc(n)));if(String(adjusted)!==e.target.value)loadQuantityQuote(String(adjusted))}}} placeholder="Enter quantity"/>
     <button type="button" aria-label="Increase quantity" disabled={Number(quantity||0)>=maxQty} onClick={()=>loadQuantityQuote(String(Math.min(maxQty,Number(quantity||minQty)+1)))}>+</button>
    </div>}
  </label>
  <div className="quantityLimits">{limitsReady?<>Minimum: {minQty.toLocaleString('en-US')} <span>•</span> Maximum: {maxQty.toLocaleString('en-US')}</>:'Checking quantity limits…'}</div>
  {branch?<div className="chatBranchAmount">
   <label className="popupField">Amount ($)<input type="number" inputMode="decimal" min="0.01" step="0.01" value={rechargeAmount} onChange={e=>loadBranchAmount(e.target.value)} placeholder="Enter amount"/></label>
   <div className="chatQuantityPresets chatAmountPresets" aria-label="Quick recharge amounts">{[1,2,5,10,15,20,25,30,50,100].map(n=><button type="button" key={n} className={Number(rechargeAmount)===n&&amountMode?'selected':''} onClick={()=>loadBranchAmount(n)}>${n}</button>)}</div>
  </div>:<div className="chatWholesalePresets">
   <span className="popupLabel">Suggested Quantities</span>
   <div className="chatQuantityPresets" aria-label="Suggested chat quantities">{(limitsReady?chatQuantityPresets(p.key,minQty,maxQty,p.title):[]).map(n=><button type="button" key={n} className={Number(quantity)===n?'selected':''} onClick={()=>loadQuantityQuote(String(n))} title={n.toLocaleString('en-US')}>{n>=1000000?Number((n/1000000).toFixed(2))+'M':n>=1000?Number((n/1000).toFixed(2))+'K':n}</button>)}</div>
  </div>}
 </>}
 {needsValidation&&<button className="popupSecondary" onClick={validate} disabled={busy||!allFields}>{busy?'Checking…':'Check Player ID'}</button>}{validated&&<div className="validationOk"><ShieldCheck size={17}/><span>{validated.player_name||'Player verified'}{validated.region?' — '+validated.region:''}</span></div>}{(isQuantity?Boolean(preview||quote):Boolean(quote))&&(isQuantity?(branch?<div className="sellCompact branchSellingPrice chatBranchSellingPrice"><div className="sellLine branchSellingLine"><b>Selling Price</b><input aria-label="Selling Price" type="number" min={shownCost??0} step="0.01" value={branch&&quoting?rechargeAmount:selling} readOnly/></div></div>:<ChatSellingPrice value={selling} onChange={v=>{sellingEditedRef.current=true;setSelling(v)}} minimum={shownCost??Number(quote?.account_cost||0)} showProfit pending={shownCost===null}/>):<GameSellingPrice value={selling} onChange={v=>{sellingEditedRef.current=true;setSelling(v)}} minimum={offerPending?Number(offerPrices[String(offer)]?.account_cost??quote.account_cost):quote.account_cost} retail={offerPending?Number(offerPrices[String(offer)]?.recommended_selling_price??offerPrices[String(offer)]?.account_cost??quote.account_cost):(quote.recommended_selling_price??quote.account_cost)} showProfit={!branch} pending={offerPending}/>)}{msg&&<div className="catalogNotice error">{msg}</div>}<button className="popupAction" onClick={purchase} disabled={busy||!canBuy||Number(selling)<Number(quote?.account_cost||0)}>{busy?'Processing…':(['games','chat'].includes(p.section)?'Recharge Now':'Confirm Purchase')}</button></></div></div>
}
function StandardCatalog({category,branch=false}){const[items,setItems]=useState([]),[search,setSearch]=useState(''),[busy,setBusy]=useState(true),[err,setErr]=useState(''),[selected,setSelected]=useState(null);useEffect(()=>{setBusy(true);setErr('');fetch(API+'/api/wholesale/products?category='+encodeURIComponent(category)+(search?'&search='+encodeURIComponent(search):''),{headers:authHeaders()}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load products');setItems(d.products||[]);
  // Visible Chat Apps warm their own account prices; no slow full-category batch request.
  if(['gift_cards','alfa','touch','dsl','other_services'].includes(category)){
   const tiles=(d.products||[]).filter(p=>Boolean(p.key));
   // Warm a few at a time so the initial page and API aren't overwhelmed.
   const warm=async()=>{for(let i=0;i<tiles.length;i+=4){await Promise.all(tiles.slice(i,i+4).map(p=>serviceDetails(p.key).catch(()=>null)))}};
   warm();
  }}).catch(e=>setErr(e.message)).finally(()=>setBusy(false))},[category,search]);return <><div className="catalogSearch"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."/></div>{err&&<div className="catalogNotice error">{err}</div>}{busy?<div className="catalogNotice"><RefreshCw className="spin"/> Loading products…</div>:<div className="catalogGrid">{items.map(p=><ProductTile key={p.key||p.title} p={p} onOpen={setSelected}/>)}</div>}{selected&&createPortal(<ProductModal key={selected.key||selected.title} p={selected} branch={branch} close={()=>setSelected(null)}/>,document.body)}</>}
function EsimCatalog({topup=false,close,branch=false,accountType="shop"}){
 const[countries,setCountries]=useState([]),[country,setCountry]=useState(''),[countryOpen,setCountryOpen]=useState(false),[countrySearch,setCountrySearch]=useState(''),[iccid,setIccid]=useState(''),[packages,setPackages]=useState([]),[selected,setSelected]=useState(null),[planOpen,setPlanOpen]=useState(false),[selling,setSelling]=useState(''),[period,setPeriod]=useState('1'),[enabled,setEnabled]=useState(false),[busy,setBusy]=useState(false),[err,setErr]=useState('');
 const requestKey=useRef(null),planPicker=useRef(null),loadSerial=useRef(0);
 const daily=Number(selected?.data_type)===2;
 const dayMin=Number(selected?.period_min||1),dayMax=Number(selected?.period_max||365);
 const dayValid=!daily||(String(period).trim()!==''&&Number.isInteger(Number(period))&&Number(period)>=dayMin&&Number(period)<=dayMax);
 const days=daily&&dayValid?Number(period):1;
 const unitCost=Number(selected?.account_cost??selected?.recommended_selling_price??0);
 const totalCost=Number((unitCost*days).toFixed(2));
 const margin=branch ? 0 : (accountType==='dealer' ? 0.12 : 0.07);
 const suggested=Number((totalCost*(1+margin)).toFixed(2));
 const money2=v=>'$'+Number(v||0).toFixed(2);
 const profit=Number(selling)-totalCost;
 const highSpeedText=p=>{const matched=String(p?.name||'').match(/([\d.]+\s*(?:MB|GB))\s*\/\s*day/i);return matched?matched[1].replace(/\s+/g,''):(p?.data_label&&p.data_label!=='Unlimited / Day Pass'?p.data_label:'Daily data')};
 const dailySubtitle=p=>`${highSpeedText(p)} High Speed / Day · Then Unlimited at ${String(p?.fup_policy||'Low Speed').replace(/^FUP\s*/i,'')}`;
 const planPrice=p=>Number(p?.account_cost??p?.recommended_selling_price??0);
 const planHeading=p=>Number(p?.data_type)===2?`Unlimited · ${money2(planPrice(p))}/Day`:[p?.data_label,p?.duration_label,money2(planPrice(p))].filter(Boolean).join(' · ');
 const sortedPackages=[...packages].sort((a,b)=>{const ad=Number(a.data_type)===2,bd=Number(b.data_type)===2;if(ad!==bd)return ad?1:-1;return ad?planPrice(a)-planPrice(b):Number(a.volume)-Number(b.volume)||Number(a.duration)-Number(b.duration)});
 useEffect(()=>{
  fetch(API+'/api/wholesale/products/esim/capabilities',{headers:authHeaders()}).then(r=>r.json()).then(d=>setEnabled(d.purchase_enabled===true)).catch(()=>setEnabled(false));
  if(topup)return;
  fetch(API+'/api/wholesale/products/esim/countries',{headers:authHeaders()}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Unable to load destinations');return d}).then(d=>{setCountries((d.countries||[]).filter(c=>String(c.code).toUpperCase()!=='IL'));if(!(d.countries||[]).length)setErr('No destinations available')}).catch(e=>setErr(e.message));
 },[topup]);
 useEffect(()=>{if(!planOpen)return;const onPointer=e=>{if(!planPicker.current?.contains(e.target))setPlanOpen(false)};const onKey=e=>{if(e.key==='Escape')setPlanOpen(false)};document.addEventListener('pointerdown',onPointer);document.addEventListener('keydown',onKey);return()=>{document.removeEventListener('pointerdown',onPointer);document.removeEventListener('keydown',onKey)}},[planOpen]);
 useEffect(()=>{if(!countryOpen)return;const onKey=e=>{if(e.key==='Escape'){e.preventDefault();setCountryOpen(false)}};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey)},[countryOpen]);
 function suggestedSelling(cost){return (Math.round(Number(cost)*(1+margin)*100)/100).toFixed(2)}
 function choose(p){setSelected(p);setPeriod(String(p.period_min||1));setSelling(suggestedSelling(planPrice(p)));setPlanOpen(false);setErr('');requestKey.current=null;}
 function setDays(v){
  // Keep the raw editable value, including an empty field, until typing is finished.
  if(v!==''&&!/^\d+$/.test(v))return;
  setPeriod(v);requestKey.current=null;
  const n=Number(v);
  if(v!==''&&Number.isInteger(n)&&n>=dayMin&&n<=dayMax)setSelling(suggestedSelling(unitCost*n));
 }
 function commitDays(){
  const n=Number(period);const normalized=String(period).trim()!==''&&Number.isFinite(n)?Math.max(dayMin,Math.min(dayMax,Math.trunc(n))):dayMin;
  setPeriod(String(normalized));setSelling(suggestedSelling(unitCost*normalized));requestKey.current=null;
 }
 async function load(destination=country){
  const serial=++loadSerial.current;
  setErr('');setPackages([]);setSelected(null);setPlanOpen(false);requestKey.current=null;
  if(!topup&&!destination)return setErr('Choose a country first.');
  const normalizedIccid=iccid.replace(/\s+/g,'');
  if(topup&&!/^\d{18,22}$/.test(normalizedIccid))return setErr('Enter a valid eSIM ICCID.');
  setBusy(true);try{
   const url=topup?API+'/api/wholesale/products/esim/topup-packages?iccid='+encodeURIComponent(normalizedIccid):API+'/api/wholesale/products/esim/packages?country='+encodeURIComponent(destination);
   const r=await fetch(url,{headers:authHeaders()});const d=await r.json();if(serial!==loadSerial.current)return;
   if(!r.ok)throw Error(d.error||'Unable to load eSIM packages');
   setPackages(d.packages||[]);if(!(d.packages||[]).length)setErr('No eSIM plans are available for this destination.');
  }catch(e){if(serial===loadSerial.current)setErr(e.message)}finally{if(serial===loadSerial.current)setBusy(false)}
 }
 function changeCountry(next){setCountryOpen(false);setCountrySearch('');setCountry(next);setPackages([]);setSelected(null);setErr('');loadSerial.current++;if(next)load(next);}
 async function buy(){if(!enabled||!selected||busy||!dayValid)return;
  const price=Number(selling);
  if(!Number.isFinite(price)||price<totalCost||price<=0)return setErr('Selling price must cover the account cost.');
  if(Math.abs(price*100-Math.round(price*100))>0.00001)return setErr('Selling price must use two decimal places.');
  if(!requestKey.current)requestKey.current=globalThis.crypto?.randomUUID?.()||('esim-'+Date.now()+'-'+Math.random().toString(36).slice(2));
  setBusy(true);setErr('');try{
   const r=await fetch(API+'/api/wholesale/products/esim/purchase',{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify({mode:topup?'topup':'base',country,iccid:iccid.replace(/\s+/g,''),package_code:selected.package_code,selling_price:price,period_num:daily?days:0,request_key:requestKey.current})});
   const d=await r.json();if(!r.ok)throw Error(d.error||'Purchase could not be submitted');
   window.dispatchEvent(new CustomEvent('3abbilo:order-placed',{detail:{orderId:d.order_id||d.order?.id}}));
  }catch(e){setErr(e.message+' If already submitted, check My Orders before retrying.')}finally{setBusy(false)}
 }
 const center=Math.ceil((suggested-1e-9)*2)/2;
 return <>
 <div className="modalShade" onClick={e=>{if(e.target===e.currentTarget){e.stopPropagation();close()}}}>
  <div className="productModal compactModal esimPopup">
   <button className="modalClose" onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();close()}} aria-label="Close"><X size={21}/></button>
   <div className="popupTitle"><ProductArtwork p={{key:topup?'esim_topup':'esim_buy',title:topup?'TOPUP ESIM':'BUY ESIM'}} compact/><h2>{topup?'TOPUP ESIM':'BUY ESIM'}</h2></div>
   {topup?<label className="popupField">eSIM ICCID<input inputMode="numeric" value={iccid} onChange={e=>{setIccid(e.target.value.replace(/\D/g,''));setPackages([]);setSelected(null)}} placeholder="Enter ICCID number"/></label>:
    <div className="popupField esimCountryField"><span>Choose Country</span><button type="button" className="esimCountryTrigger" aria-haspopup="dialog" aria-expanded={countryOpen} onClick={()=>{setCountrySearch('');setCountryOpen(true)}}>{countries.find(c=>c.code===country)?.name||'Choose Country'}<ChevronDown size={16}/></button></div>}
   {topup&&<button className="popupAction" onClick={()=>load()} disabled={busy||!/^\d{18,22}$/.test(iccid)}>{busy?'Loading…':'Check eSIM / Show Plans'}</button>}
   {busy&&<div className="esimLoading" role="status"><RefreshCw className="spin" size={25}/><span>Loading available eSIM plans…</span></div>}
   {err&&<div className="catalogNotice error" role="alert">{err}</div>}
   {sortedPackages.length>0&&<div className="popupField esimPlanSelection"><span className="popupLabel">Choose eSIM Type</span><PackagePicker options={sortedPackages.map((p,i)=>({id:String(p.package_code||p.slug||i),name:planHeading(p),original:p,sortValue:i}))} value={selected?String(selected.package_code||selected.slug||''): ''} onChange={v=>{const plan=sortedPackages.find((p,i)=>String(p.package_code||p.slug||i)===String(v));if(plan)choose(plan)}} placeholder="Choose eSIM Type" priceFor={p=>({label:p.name})} subtitleFor={p=>Number(p.original?.data_type)===2?dailySubtitle(p.original):''}/></div>}
{selected&&<div className="esimCheckout">
    {daily&&<><div className="esimDayInfo"><strong>{planHeading(selected)}</strong><span>{dailySubtitle(selected)}</span></div><div className="popupField"><span className="popupLabel">Number of Days</span><div className="chatBranchQuantityControl esimDayControls"><button type="button" aria-label="Decrease days" disabled={!dayValid||days<=dayMin} onClick={()=>setDays(String(Math.max(dayMin,days-1)))}>−</button><input aria-label="Number of Days" type="text" inputMode="numeric" pattern="[0-9]*" value={period} onChange={e=>setDays(e.target.value)} onBlur={commitDays} onFocus={e=>e.target.select()}/><button type="button" aria-label="Increase days" disabled={!dayValid||days>=dayMax} onClick={()=>setDays(String(Math.min(dayMax,days+1)))}>+</button></div></div><div className="esimDayTotal">{!dayValid?'Enter a valid number of days':<>{days} {days===1?'day':'days'} · Total: {money2(totalCost)}</>}</div></>}
    <div className="sellCompact branchSellingPrice esimSellingPrice">
     <div className="sellLine branchSellingLine"><b>Selling Price</b><input aria-label="Selling Price" type="number" min={totalCost} step="0.01" value={selling} onChange={e=>setSelling(e.target.value)}/><span>Profit <strong>{Number.isFinite(profit)?money2(profit):'—'}</strong></span></div>
     <div className="branchPriceSteps" aria-label="Suggested eSIM selling prices">{[-1,-.5,0,.5,1].map(delta=>{const value=Math.round((center+delta)*100)/100;const allowed=value>0&&value+1e-9>=totalCost;return <button type="button" key={delta} disabled={!allowed} className={Math.abs(Number(selling)-value)<.005?'active':''} onClick={()=>setSelling(value.toFixed(2))}><strong>${value.toFixed(value%1===0?0:2)}</strong></button>})}</div>
    </div>
    {enabled&&<button className="popupAction" disabled={busy||!dayValid||!Number.isFinite(Number(selling))||Number(selling)<totalCost} onClick={buy}>{busy?'Submitting…':topup?'Topup eSIM':'Buy Now'}</button>}
   </div>}
   {selected&&!enabled&&<div className="checkoutPending compact">eSIM purchasing is currently unavailable. Please try again later.</div>}
  </div>
 </div>
 {!topup&&countryOpen&&createPortal(<div className="esimCountryOverlay" onClick={e=>{e.stopPropagation();if(e.target===e.currentTarget)setCountryOpen(false)}}>
   <div className="esimCountryDialog" role="dialog" aria-modal="true" aria-label="Choose Country" onClick={e=>e.stopPropagation()}>
    <div className="esimCountryDialogHeader"><strong>Choose Country</strong><button type="button" aria-label="Close country search" onClick={()=>setCountryOpen(false)}><X size={20}/></button></div>
    <div className="esimCountrySearch"><Search size={17}/><input autoFocus type="search" aria-label="Search countries" placeholder="Search country..." autoComplete="off" value={countrySearch} onChange={e=>setCountrySearch(e.target.value)}/></div>
    <div className="esimCountryDialogList" role="listbox" aria-label="Countries">{countries.filter(c=>c.name.toLowerCase().includes(countrySearch.trim().toLowerCase())).map(c=><button type="button" role="option" aria-selected={country===c.code} key={c.code} onClick={()=>changeCountry(c.code)}>{c.name}</button>)}{!countries.some(c=>c.name.toLowerCase().includes(countrySearch.trim().toLowerCase()))&&<div className="esimCountryEmpty">No matching countries</div>}</div>
   </div>
  </div>,document.body)}
 </>;
}

const CATEGORY_NAMES={games:'GAME TOP-UP',chat:'CHAT APPS TOP-UP',gift_cards:'GIFT CARDS',alfa:'ALFA',touch:'TOUCH',dsl:'OGERO & INTERNET CARDS',other_services:'CARFAX',esim:'ESIM & TOPUP'};
const PAGE_SLUGS={'Dashboard':'dashboard','Products':'products','My Shops':'my-shops','My Orders':'my-orders','Shop Orders':'shop-orders','Transactions':'transactions','Profit Report':'profit-report','Recharge Account':'recharge-account','My Account':'my-account','Change Password':'change-password'};
function readNav(){const q=new URLSearchParams(location.search);return {page:Object.keys(PAGE_SLUGS).find(k=>PAGE_SLUGS[k]===q.get('view'))||null,category:q.get('category')||null,esim:q.get('esim')||''};}
function writeNav(changes,replace=false){const now=readNav(),next={...now,...changes};const q=new URLSearchParams(location.search);['view','category','esim'].forEach(k=>q.delete(k));if(next.page)q.set('view',PAGE_SLUGS[next.page]||'products');if(next.category)q.set('category',next.category);if(next.esim)q.set('esim',next.esim);const url=location.pathname+(q.size?'?'+q.toString():'');history[replace?'replaceState':'pushState']({},'',url);window.dispatchEvent(new Event('3abbilo:navigation'));}
// Products overview: one cached catalog for every category and a global client-side search.
// Keep product selections in this screen so category previews open the same purchase popup
// as the full category page, without changing quote or purchase routes.
const overviewCatalogCache=new Map();
function overviewGroupFor(p){
 const key=String(p.key||'').toLowerCase(),provider=String(p.provider||'').toLowerCase();
 if(provider==='alfa'||key.startsWith('alfa_'))return 'alfa';
 if(provider==='touch'||key.startsWith('touch_'))return 'touch';
 if(['ogero','sodetel','mobi','terranet','wise'].includes(provider)||/^(ogero|sodetel|mobi|terranet|wise)_/.test(key))return 'dsl';
 if(key==='carfax')return 'other_services';
 return p.section;
}
const esimOverviewItems=[
 {key:'esim_buy',title:'BUY ESIM',section:'esim'},
 {key:'esim_topup',title:'TOPUP ESIM',section:'esim'}
];
function ProductsOverview({categories,branch,accountType}){
 const[search,setSearch]=useState(''),[products,setProducts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[selected,setSelected]=useState(null);
 useEffect(()=>{
  let alive=true;
  cachedFetch(overviewCatalogCache,authHeaders().Authorization,60000,async()=>{
   const response=await fetch(API+'/api/wholesale/products',{headers:authHeaders()});
   const data=await response.json();
   if(!response.ok||!data.ok)throw Error(data.error||'Unable to load products');
   return data.products||[];
  }).then(items=>{if(alive){setProducts(items);setError('')}})
    .catch(e=>{if(alive)setError(e.message||'Unable to load products')})
    .finally(()=>{if(alive)setLoading(false)});
  return()=>{alive=false};
 },[]);
 const needle=search.trim().toLowerCase();
 const findText=p=>`${p.title||''} ${p.name||''} ${p.subtitle||''} ${p.keywords||''} ${p.key||''}`.toLowerCase();
 const allCategories=categories.length?categories:[
  {key:'games',title:'Game Top-Up'},{key:'chat',title:'Chat Apps'},{key:'gift_cards',title:'Gift Cards'},
  {key:'alfa',title:'Alfa'},{key:'touch',title:'Touch'},{key:'dsl',title:'Ogero & Internet Cards'},
  {key:'other_services',title:'CARFAX'},{key:'esim',title:'eSIM'}
 ];
 // Browsing keeps category preview rows. A typed search instead searches every
 // product directly, without using category titles or showing category sections.
 const categorized=allCategories.map(c=>{
  const title=CATEGORY_NAMES[c.key]||String(c.title||c.key).toUpperCase();
  const matches=c.key==='esim'?esimOverviewItems:products.filter(p=>overviewGroupFor(p)===c.key);
  return {...c,title,matches};
 }).filter(c=>c.matches.length>0).sort((a,b)=>{
  const order=['games','chat','gift_cards','alfa','touch','esim','dsl','other_services'];
  const rank=k=>{const i=order.indexOf(k);return i<0?order.length:i};
  return rank(a.key)-rank(b.key);
 });
 const searchableProducts=Array.from(new Map([...products,...esimOverviewItems]
  .map(p=>[String(p.key||p.title||p.name),p])).values());
 const searchMatches=needle?searchableProducts.filter(p=>findText(p).includes(needle)):[];
 const openProduct=p=>{
  if(p.key==='esim_buy'||p.key==='esim_topup'){
   writeNav({page:'Products',category:'esim',esim:p.key==='esim_buy'?'buy':'topup'});
  }else setSelected(p);
 };
 return <div className="productsOverview">
  <label className="productsGlobalSearch" aria-label="Search all products">
   <Search size={20}/>
   <input type="search" value={search} onChange={e=>setSearch(e.target.value)}
    placeholder="Search all products..." aria-label="Search all products" autoComplete="off"/>
   {search&&<button type="button" aria-label="Clear search" onClick={()=>setSearch('')}><X size={18}/></button>}
  </label>
  {error&&<div className="catalogNotice error">{error}</div>}
  {loading?<div className="catalogNotice"><RefreshCw className="spin"/> Loading products…</div>
   :needle?(searchMatches.length===0
     ?<div className="catalogNotice">No products found. Try another search.</div>
     :<div className="productsSearchResults" aria-label="Matching products">
       {searchMatches.map(p=><ProductTile key={p.key||p.title} p={p} onOpen={openProduct}/>)}
      </div>)
   :categorized.length===0?<div className="catalogNotice">No products available.</div>
   :categorized.map(c=><section className="productsCategorySection" key={c.key}>
     <div className="productsCategoryHeader">
      <h2>{c.title} <span style={{fontSize:"0.55em",fontWeight:600,color:"#74829c",whiteSpace:"nowrap"}}>({c.matches.length} products)</span></h2>
      <button type="button" onClick={()=>writeNav({page:'Products',category:c.key,esim:''})}
       aria-label={'Show all '+c.title}>Show All <ChevronRight size={17}/></button>
     </div>
     <div className="productsOverviewRow" aria-label={c.title+' products'}>
      {c.matches.slice(0,12).map(p=><ProductTile key={p.key||p.title} p={p} onOpen={openProduct}/>)}
     </div>
    </section>)}
  {selected&&createPortal(<ProductModal key={selected.key||selected.title} p={selected} branch={branch} close={()=>setSelected(null)}/>,document.body)}
 </div>;
}
function ProductsPage({branch=false,accountType="shop"}){
 const[esimMode,setEsimMode]=useState(()=>readNav().esim);
 const[categories,setCategories]=useState([]),[active,setActive]=useState(()=>readNav().category),[err,setErr]=useState('');
 useEffect(()=>{
  fetch(API+'/api/wholesale/products/categories',{headers:authHeaders()})
   .then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load categories');setCategories(d.categories||[])})
   .catch(e=>setErr(e.message));
 },[]);
 useEffect(()=>{
  const sync=()=>{const n=readNav();setActive(n.category);setEsimMode(n.esim)};
  window.addEventListener('popstate',sync);window.addEventListener('3abbilo:navigation',sync);
  return()=>{window.removeEventListener('popstate',sync);window.removeEventListener('3abbilo:navigation',sync)};
 },[]);
 const current=categories.find(c=>c.key===active);
 return <div className="sectionPad">
  {active&&<>
   <div className="productsCategoryPageTitle"><h1>{current?(CATEGORY_NAMES[current.key]||current.title.toUpperCase()):(CATEGORY_NAMES[active]||active.toUpperCase())}</h1></div>
   <button className="catalogBack" onClick={()=>writeNav({category:null,esim:''})}><ChevronLeft size={17}/> All categories</button>
  </>}
  {err&&<div className="catalogNotice error">{err}</div>}
  {!active?<ProductsOverview categories={categories} branch={branch} accountType={accountType}/>
   :active==='esim'?<>
     <div className="catalogGrid esimTiles">
      <ProductTile p={{key:'esim_buy',title:'BUY ESIM'}} onOpen={()=>writeNav({esim:'buy'})}/>
      <ProductTile p={{key:'esim_topup',title:'TOPUP ESIM'}} onOpen={()=>writeNav({esim:'topup'})}/>
     </div>
     {esimMode&&createPortal(<EsimCatalog key={esimMode} branch={branch} accountType={accountType} topup={esimMode==='topup'} close={()=>writeNav({esim:''})}/>,document.body)}
    </>:<StandardCatalog category={active} branch={branch}/>}</div>;
}
const demoProfit=[['#1042','PUBG Mobile — 660 UC',9.50,10.00],['#1041','Jawaker — 80,926 Tokens',9.35,11.00],['#1039','Mobile Top-Up — $10',9.60,10.00]];
function ProfitPage({dealer}){const rows=demoProfit,total=rows.reduce((a,r)=>a+r[3]-r[2],0),sales=rows.reduce((a,r)=>a+r[3],0),cost=rows.reduce((a,r)=>a+r[2],0);return <div className="sectionPad"><div className="pageTitle"><small>{dealer?'DEALER':'SHOP'} PROFIT</small><h1>Profit Report</h1><p>{dealer?'Track your margin from successful sales and child-Shop activity.':'Track each successful sale using your cost, selling price and profit.'}</p></div><div className="profitSummary"><div><span>Total sales</span><strong>${sales.toFixed(2)}</strong></div><div><span>Total cost</span><strong>${cost.toFixed(2)}</strong></div><div><span>Total profit</span><strong className="profitPositive">${total.toFixed(2)}</strong></div></div><div className="profitTableWrap"><table className="profitTable"><thead><tr><th>Order</th><th>Product</th><th>Your cost</th><th>Selling price</th><th>Profit</th></tr></thead><tbody>{rows.map(r=><tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>${r[2].toFixed(2)}</td><td>${r[3].toFixed(2)}</td><td className="profitPositive">${(r[3]-r[2]).toFixed(2)}</td></tr>)}</tbody></table></div><p style={{color:'#71809d',fontSize:12,marginTop:12}}>Preview data is shown until the product/order backend stores selling price and profit on completed orders.</p></div>}
function DealerShopsPage(){const[shops,setShops]=useState([]),[busy,setBusy]=useState(false),[msg,setMsg]=useState('');async function load(){try{const r=await fetch(API+'/api/wholesale/dealer/shops',{headers:authHeaders()});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load shops');setShops(d.shops||[])}catch(e){setMsg(e.message)}}useEffect(()=>{load()},[]);async function save(shop,value){setBusy(true);setMsg('');try{const r=await fetch(API+'/api/wholesale/dealer/shops/'+shop.id+'/pricing',{method:'PATCH',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify({pricing_percent:Number(value)})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to save');setMsg('Pricing saved');await load()}catch(e){setMsg(e.message)}finally{setBusy(false)}}return <div className="sectionPad"><div className="pageTitle"><h1>My Shops</h1><p>Set the default percentage for each Shop. Product-specific overrides can be added through the pricing API.</p></div>{msg&&<div className="catalogNotice">{msg}</div>}<div className="shopPricingGrid">{shops.map(sh=><div className="shopPricingCard" key={sh.id}><div><b>{sh.shop_name}</b><span>Balance ${Number(sh.balance||0).toFixed(4)}</span></div><label>Default %<input type="number" min="0" max="100" step="0.0001" defaultValue={Number(sh.pricing_percent||0)} id={'pct-'+sh.id}/></label><button disabled={busy} onClick={()=>save(sh,document.getElementById('pct-'+sh.id).value)}>Save</button></div>)}</div></div>}
function OrdersPage({dealer,me,shopOrders=false,highlightOrderId=null}){const[selectedResult,setSelectedResult]=useState(null);const[orders,setOrders]=useState([]),[loading,setLoading]=useState(true),[err,setErr]=useState(''),[search,setSearch]=useState(''),[filter,setFilter]=useState('all');useEffect(()=>{let alive=true,timer;async function load(first=false){try{if(first)setLoading(true);const r=await fetch(API+'/api/wholesale/orders',{headers:authHeaders()});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load orders');if(!alive)return;const myId=Number(me?.id||me?.account_id);let rows=d.orders||[];if(dealer)rows=shopOrders?rows.filter(o=>Number(o.account_id)!==myId):rows.filter(o=>Number(o.account_id)===myId);setOrders(rows);setErr('')}catch(e){if(alive)setErr(e.message)}finally{if(alive)setLoading(false)}}load(true);timer=setInterval(()=>load(false),3000);return()=>{alive=false;clearInterval(timer)}},[dealer,shopOrders,me?.id,me?.account_id]);function money(v){return '$'+Number(v||0).toFixed(4)}function when(v){if(!v)return '—';try{return new Date(v).toLocaleString()}catch{return v}}function status(v){const x=String(v||'pending').toLowerCase();return x==='success'?'Success':x==='failed'||x==='refunded'?'Failed':'Pending'}const q=search.trim().toLowerCase();const shown=orders.filter(o=>{const st=status(o.status).toLowerCase();if(filter!=='all'&&st!==filter)return false;if(!q)return true;return [o.package_name,o.product_title,o.customer_reference,shopOrders?o.purchaser_name:''].some(v=>String(v||'').toLowerCase().includes(q))});async function copy(v){try{await navigator.clipboard.writeText(v)}catch{}}return <div className="sectionPad">{!shopOrders&&highlightOrderId&&<div className="orderLandingNotice" role="status"><ReceiptText size={19}/><div><strong>Order #{highlightOrderId} submitted</strong><span>Check its status below. Select <b>View result</b> anytime to see the delivery details. Pending orders update automatically.</span></div></div>}<div className="orderTools"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={shopOrders?'Search shop, product or customer…':'Search product or customer…'}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All Status</option><option value="pending">Pending</option><option value="success">Success</option><option value="failed">Failed</option></select></div>{err&&<div className="catalogNotice error">{err}</div>}{loading?<div className="ordersLoading"><RefreshCw className="spin"/> Loading orders…</div>:shown.length===0?<div className="ordersEmpty"><ReceiptText/><b>No matching orders</b><span>Try another search or status.</span></div>:<div className="ordersTableWrap"><table className="ordersTable"><thead><tr><th>Order ID</th>{shopOrders&&<th>Shop</th>}<th>Product</th><th>Customer</th>{!['jounieh','jbeil'].includes(String(me?.account_type||'').toLowerCase())&&<th>Cost</th>}<th>Status</th><th>Date</th></tr></thead><tbody>{shown.map(o=>{const st=status(o.status);const refundText='Your balance has been refunded.';const rawReason=String(o.failure_reason||'The service could not complete this order.').trim();const cleanReason=safeCustomerMessage(rawReason.replace(/(?:\s*Your balance has been refunded\.\s*)+/gi,' ').trim());return <tr key={o.id} className={[(st==='Failed'||(o.redeem_code&&st==='Success'))?'orderRowHasDetail':'',Number(o.id)===Number(highlightOrderId)?'orderRecentlyPlaced':''].filter(Boolean).join(' ')}><td><strong>#{o.id}</strong>{!shopOrders&&<button type="button" className="orderResultLink" onClick={()=>setSelectedResult(o.id)}>View result</button>}</td>{shopOrders&&<td>{o.purchaser_name||'Shop'}</td>}<td><strong className="orderProductName">{o.package_name||o.product_title||o.product_key}</strong></td><td>{o.customer_reference||'—'}</td>{!['jounieh','jbeil'].includes(String(me?.account_type||'').toLowerCase())&&<td>{money(o.account_cost)}</td>}<td className="orderStatusCell"><span className={'orderStatus '+st.toLowerCase()}>{st}</span>{st==='Failed'&&<div className="orderCellDetail failedCellDetail"><span className="detailWarn">⚠</span><span>{cleanReason}{o.refunded_at?' '+refundText:''}</span></div>}</td><td>{when(o.completed_at||o.created_at)}</td></tr>})}</tbody></table></div>}{selectedResult&&createPortal(<div className="modalShade" onMouseDown={e=>e.target===e.currentTarget&&setSelectedResult(null)}><div className="productModal compactModal orderResultModal"><button type="button" className="modalClose" onClick={()=>setSelectedResult(null)} aria-label="Close"><X size={21}/></button><div className="popupTitle"><ReceiptText size={32}/><h2>Order Result</h2></div><PurchaseResult orderId={selectedResult} branch={["jounieh","jbeil"].includes(String(me?.account_type||""))} onClose={()=>setSelectedResult(null)}/></div></div>,document.body)}</div>}
function PlaceholderPage({title}){return <div className="sectionPad"><div className="pageTitle"><small>3ABBILO</small><h1>{title}</h1><p>This section is ready to connect to the existing 3ABBILO API.</p></div></div>}
function DashboardHome({dealer,name,wallet,dailyProfit,setPage}){const[statsPeriod,setStatsPeriod]=useState('30d'),[stats,setStats]=useState(null),[statsLoading,setStatsLoading]=useState(true),[statsError,setStatsError]=useState(false);useEffect(()=>{let active=true;let busy=false;async function load(){if(busy)return;busy=true;try{const r=await fetch(API+'/api/wholesale/orders/dashboard-summary?period='+encodeURIComponent(statsPeriod),{headers:authHeaders(),cache:'no-store'});if(!r.ok)throw Error('Stats unavailable');const d=await r.json();if(active){setStats(d.summary);setStatsError(false)}}catch(e){if(active)setStatsError(true)}finally{busy=false;if(active)setStatsLoading(false)}}setStats(null);setStatsLoading(true);void load();const timer=setInterval(()=>{if(document.visibilityState==='visible')void load()},5000);const onFocus=()=>void load();window.addEventListener('3abbilo:order-placed',onFocus);window.addEventListener('focus',onFocus);return()=>{active=false;clearInterval(timer);window.removeEventListener('3abbilo:order-placed',onFocus);window.removeEventListener('focus',onFocus)}},[statsPeriod]);return <><div className="welcome"><div><h1>Welcome, {name}</h1></div><div className="walletHero"><WalletCards/><span>AVAILABLE BALANCE</span><strong>${Number(wallet?.balance||0).toFixed(4)}</strong>{dealer&&<div className="dailyProfitRows"><div><span>OWN SALES PROFIT (TODAY)</span><b>${Number(dailyProfit?.own_profit||0).toFixed(4)}</b></div><div><span>SHOPS PROFIT (TODAY)</span><b>${Number(dailyProfit?.shops_profit||0).toFixed(4)}</b></div></div>}<a href="#" onClick={e=>{e.preventDefault();setPage('Recharge Account')}}>Recharge account <ArrowRight size={17}/></a></div></div><div className="dashboardOrderSummary"><div className="dashboardPeriodTabs" role="group" aria-label="Order statistics period">{[['24h','24h'],['7d','7 days'],['30d','30 days'],['all','All time']].map(([key,label])=><button key={key} type="button" className={statsPeriod===key?'active':''} onClick={()=>setStatsPeriod(key)}>{label}</button>)}</div>{statsError&&<div className="dashboardStatsError">Unable to refresh order statistics. Showing the last available figures.</div>}<div className="dashboardStatsGrid">{[['Total Orders',stats?.total_orders,'total'],['Success',stats?.completed,'completed'],['Failed',stats?.failed,'failed'],['Pending',stats?.pending,'pending'],['Total Spent',stats?.total_spent,'spent'],['Total Profit',stats?.total_profit,'profit']].map(([label,value,kind])=><div className={'dashboardStatCard '+kind} key={kind}><span>{label}</span><strong>{statsLoading&&!stats?'—':(kind==='spent'||kind==='profit')?'$'+Number(value||0).toLocaleString('en-US',{minimumFractionDigits:4,maximumFractionDigits:4}):Number(value||0).toLocaleString('en-US')}</strong></div>)}</div></div><section className="dashSection"><div><small>SELL MORE</small><h2>Digital services</h2></div><div className="serviceMini">{services.map(([n,I,d,c])=><article className={c} key={n} onClick={()=>setPage('Products')}><I/><div><b>{n}</b><span>{d}</span></div><ArrowRight/></article>)}</div></section></>}
function Dashboard(){const[token]=useState(()=>localStorage.getItem('3abbilo_token')),[me,setMe]=useState(null),[wallet,setWallet]=useState(null),[dailyProfit,setDailyProfit]=useState(null),[loading,setLoading]=useState(true),[open,setOpen]=useState(false),[page,setPage]=useState(()=>readNav().page||'Dashboard'),[recentOrderId,setRecentOrderId]=useState(null);useEffect(()=>{function onOrderPlaced(event){const id=Number(event?.detail?.orderId);setRecentOrderId(Number.isSafeInteger(id)&&id>0?id:null);setOpen(false);writeNav({page:'My Orders',category:null,esim:''})}window.addEventListener('3abbilo:order-placed',onOrderPlaced);return()=>window.removeEventListener('3abbilo:order-placed',onOrderPlaced)},[]);useEffect(()=>{if(!token){location.replace('/login');return}fetch(API+'/api/wholesale/auth/me',{headers:{Authorization:'Bearer '+token}}).then(async r=>{if(!r.ok)throw Error('Unauthorized');const a=await r.json();const account=a.account||a.user||a;setMe(account);const branch=['jounieh','jbeil'].includes(String(account.account_type||'').toLowerCase());if(branch&&!['Products','My Orders'].includes(readNav().page)){writeNav({page:'Products',category:null,esim:''},true)}if(!branch){const [wr,pr]=await Promise.all([fetch(API+'/api/wholesale/wallet',{headers:{Authorization:'Bearer '+token}}),fetch(API+'/api/wholesale/orders/daily-profit',{headers:{Authorization:'Bearer '+token}})]);if(!wr.ok)throw Error('Wallet unavailable');const w=await wr.json();setWallet(w.wallet||w);if(pr.ok)setDailyProfit(await pr.json());if(!readNav().page)writeNav({page:'Dashboard',category:null,esim:''},true)}}).catch(()=>{localStorage.removeItem('3abbilo_token');location.replace('/login')}).finally(()=>setLoading(false))},[token]);useEffect(()=>{if(!token||!me||['jounieh','jbeil'].includes(String(me.account_type||'').toLowerCase()))return;let active=true;let running=false;async function refreshAccountTotals(){if(!active||running)return;running=true;try{const headers={Authorization:'Bearer '+token};const [wr,pr]=await Promise.all([fetch(API+'/api/wholesale/wallet',{headers,cache:'no-store'}),fetch(API+'/api/wholesale/orders/daily-profit',{headers,cache:'no-store'})]);if(!active)return;if(wr.ok){const data=await wr.json();if(active)setWallet(data.wallet||data)}if(pr.ok){const data=await pr.json();if(active)setDailyProfit(data)}}catch(e){/* Keep the last confirmed figures if a refresh fails. */}finally{running=false}}const onOrder=()=>{void refreshAccountTotals()};const onFocus=()=>{void refreshAccountTotals()};const onVisibility=()=>{if(document.visibilityState==='visible')void refreshAccountTotals()};window.addEventListener('3abbilo:order-placed',onOrder);window.addEventListener('focus',onFocus);document.addEventListener('visibilitychange',onVisibility);const timer=setInterval(()=>{if(document.visibilityState==='visible')void refreshAccountTotals()},5000);void refreshAccountTotals();return()=>{active=false;clearInterval(timer);window.removeEventListener('3abbilo:order-placed',onOrder);window.removeEventListener('focus',onFocus);document.removeEventListener('visibilitychange',onVisibility)}},[token,me?.id,me?.account_type]);useEffect(()=>{const sync=()=>{const n=readNav();setPage(n.page||'Dashboard')};window.addEventListener('popstate',sync);window.addEventListener('3abbilo:navigation',sync);return()=>{window.removeEventListener('popstate',sync);window.removeEventListener('3abbilo:navigation',sync)}},[]);function navigatePage(next){if(next!=='My Orders')setRecentOrderId(null);writeNav({page:next,category:null,esim:''})}if(loading)return <div className="loading"><RefreshCw className="spin"/> Loading 3ABBILO…</div>;const type=String(me?.account_type||'shop').toLowerCase(),dealer=type==='dealer',branch=type==='jounieh'||type==='jbeil',nav=branch?branchNav:dealer?dealerNav:shopNav,name=type==='jounieh'?'Jounieh Branch':type==='jbeil'?'Jbeil Branch':(me?.shop_name||me?.business_name||me?.name||'Shop');function logout(){localStorage.removeItem('3abbilo_token');location.replace('/login')}return <div className="appShell"><aside className={open?'side open':'side'}><div className="sideTop"><Brand/><button onClick={()=>setOpen(false)}><X/></button></div><div className="accountMini"><div className="avatar">{name[0]?.toUpperCase()}</div><div><b>{name}</b><span>{branch?'Branch account':dealer?'Dealer account':'Shop account'}</span></div></div><nav>{nav.map(([I,n])=><button className={page===n?'active':''} key={n} onClick={()=>{navigatePage(n);setOpen(false)}}><I size={19}/>{n}</button>)}</nav><button className="logout" onClick={logout}><LogOut size={19}/>Logout</button></aside><div className="appMain"><div className="appTop"><button className="menuBtn" onClick={()=>setOpen(true)}><Menu/></button><h2>{page}</h2>{!branch&&<div className="topBalance"><span>Available balance</span><b>${Number(wallet?.balance||0).toFixed(4)}</b></div>}</div>{page==='Dashboard'&&!branch?<DashboardHome dealer={dealer} name={name} wallet={wallet} dailyProfit={dailyProfit} setPage={navigatePage}/>:page==='Products'?<><ProductsPage branch={branch} accountType={type}/></>:page==='My Orders'?<OrdersPage dealer={dealer} me={me} highlightOrderId={recentOrderId}/>:!branch&&page==='Profit Report'?<ProfitPage dealer={dealer}/>:!branch&&page==='My Shops'&&dealer?<DealerShopsPage/>:!branch&&page==='Shop Orders'&&dealer?<OrdersPage dealer={dealer} me={me} shopOrders/>:!branch?<PlaceholderPage title={page}/>:null}</div></div>}
function App(){const p=location.pathname.replace(/\/+$/,'')||'/';if(p==='/'||p==='/login')return <Login/>;if(p==='/dashboard'||p.startsWith('/dashboard/'))return <Dashboard/>;return <Login/>}createRoot(document.getElementById('root')).render(<App/>);
