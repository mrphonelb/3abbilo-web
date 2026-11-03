import React,{useEffect,useRef,useState}from'react';import{createPortal}from'react-dom';import{createRoot}from'react-dom/client';import{Gamepad2,Smartphone,Gift,Wifi,WalletCards,Zap,ShieldCheck,ArrowRight,LogIn,LayoutDashboard,Package,Store,ReceiptText,History,BarChart3,Wallet,User,KeyRound,LogOut,Menu,X,RefreshCw,MessageCircle,Globe2,Search,ChevronLeft,ChevronRight}from'lucide-react';import'./style.css';import logo3abbilo from './3abbilo-logo.png';
const API=(import.meta.env.VITE_API_BASE_URL||'https://api.3abbilo.com').replace(/\/$/,'');
const services=[['Mobile Top-Up',Smartphone,'Alfa, Touch and instant mobile recharge.','cyan'],['Gaming Cards',Gamepad2,'PUBG, Jawaker and popular gaming services.','violet'],['Gift Cards',Gift,'Digital cards and codes delivered instantly.','pink'],['Data & eSIM',Wifi,'Flexible data services for connected customers.','orange']];
const Brand=({foot=false})=>{const logged=Boolean(localStorage.getItem('3abbilo_token'));return <a className={'brand '+(foot?'foot':'')} href={logged?'/dashboard':'/login'}><img src={logo3abbilo} alt="3ABBILO" /></a>};
function Home(){return <><header><Brand/><a className="signin" href="/login"><LogIn size={17}/> Sign in</a></header><main><section className="hero"><div className="copy"><div className="eyebrow">BUILT FOR RESELLERS</div><h1>Recharge faster.<br/><em>Sell more.</em></h1><p>One modern workspace for dealers and shops to sell gaming cards, mobile top-ups and digital services.</p><a className="primary" href="/login">Sign in <ArrowRight size={18}/></a><div className="trust"><ShieldCheck size={17}/> Secure reseller platform</div></div><div className="visual"><div className="glow g1"></div><div className="glow g2"></div><div className="dash"><div className="dashTop"><div><small>3ABBILO WALLET</small><h3>Available balance</h3></div><WalletCards/></div><div className="money">$1,240.50</div><div className="stats"><div><small>Today’s orders</small><b>28</b></div><div><small>Digital sales</small><b>$685</b></div></div><div className="chips"><span>GAME TOP-UP</span><span>GIFT CARDS</span><span>MOBILE</span></div></div></div></section><section className="services"><div className="sectionHead"><div><div className="eyebrow">DIGITAL SERVICES</div><h2>Everything your counter needs.</h2></div><p>Fast access to the services your customers ask for every day.</p></div><div className="grid">{services.map(([n,I,d,c])=><div className={'card '+c} key={n}><div className="icon"><I/></div><h3>{n}</h3><p>{d}</p><span>Explore <ArrowRight size={15}/></span></div>)}</div></section><section className="banner"><div><div className="eyebrow light">ONE WALLET. MORE SERVICES.</div><h2>Built to keep your shop moving.</h2><p>Manage your balance, orders and digital sales from one clean workspace.</p></div><div className="orb"><Zap/><span>Instant<br/>delivery</span></div></section></main><footer><Brand foot/><p>Digital recharge for modern resellers.</p><small>© 2026 3ABBILO. All rights reserved.</small></footer></>}
function Login(){const[email,setEmail]=useState(''),[p,setP]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);async function submit(e){e.preventDefault();setBusy(true);setErr('');try{const r=await fetch(API+'/api/wholesale/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim(),password:p})});const d=await r.json();if(!r.ok||!d.token)throw new Error(d.error||d.message||'Sign in failed');localStorage.setItem('3abbilo_token',d.token);location.replace('/dashboard')}catch(x){setErr(x.message)}finally{setBusy(false)}}return <div className="loginPage"><div className="loginGlow"></div><form className="loginBox" onSubmit={submit}><Brand/><div className="loginSlogan">Top-Up Smarter</div><label>Email<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Enter your email address"/></label><label>Password<input type="password" autoComplete="current-password" value={p} onChange={e=>setP(e.target.value)} required placeholder="Enter your password"/></label>{err&&<div className="loginError">{err}</div>}<button className="loginSubmit" disabled={busy}>{busy?'Signing in…':'Sign in'}<ArrowRight size={18}/></button><div className="loginSecure"><ShieldCheck size={16}/> Secure access to 3ABBILO</div></form></div>}
const dealerNav=[[LayoutDashboard,'Dashboard'],[Package,'Products'],[Store,'My Shops'],[ReceiptText,'My Orders'],[ReceiptText,'Shop Orders'],[History,'Transactions'],[BarChart3,'Profit Report'],[Wallet,'Recharge Account'],[User,'My Account'],[KeyRound,'Change Password']];const branchNav=[[Package,'Products'],[ReceiptText,'My Orders']];const shopNav=[[LayoutDashboard,'Dashboard'],[Package,'Products'],[ReceiptText,'My Orders'],[History,'Transactions'],[BarChart3,'Profit Report'],[Wallet,'Recharge Account'],[User,'My Account'],[KeyRound,'Change Password']];
const categoryIcons={games:Gamepad2,chat:MessageCircle,gift_cards:Gift,alfa:Smartphone,touch:Smartphone,dsl:Wifi,other_services:Package,esim:Globe2};
function authHeaders(){return{Authorization:'Bearer '+localStorage.getItem('3abbilo_token')}}
function productImage(p){return p?.key?'/product-images/'+encodeURIComponent(p.key):''}
const quantityQuoteCache=new Map();
const serviceDetailCache=new Map();
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
function ProductTile({p,onOpen}){const img=productImage(p);const prefetch=()=>{if(p.type==='quantity')quantityQuote(p.key).catch(()=>{});};return <button className="catalogProduct" onPointerEnter={prefetch} onFocus={prefetch} onClick={()=>onOpen(p)}>{img?<img src={img} alt={p.title||p.name||''} loading="lazy"/>:<div className="catalogFallback"><Package/></div>}<b>{p.title||p.name||p.key}</b></button>}
function offerLabel(o){return o.displayName||o.name||String(o.offerId||o.id||'Option').replaceAll('_',' ')}
// Scrollable, width-constrained package picker: no platform-native list taller than the viewport.
function PackagePicker({options,value,onChange,placeholder='Choose package',priceFor}){
 const[open,setOpen]=useState(false),outer=useRef(null),list=useRef(null);
 useEffect(()=>{if(!open)return;const hide=e=>{if(!outer.current?.contains(e.target))setOpen(false)};const key=e=>{if(e.key==='Escape')setOpen(false)};document.addEventListener('pointerdown',hide);document.addEventListener('keydown',key);return()=>{document.removeEventListener('pointerdown',hide);document.removeEventListener('keydown',key)}},[open]);
 const idOf=o=>String(o.offerId??o.id??'');
 const parseSortValue=o=>{const raw=priceFor?.(o);if(raw&&typeof raw==='object'&&raw.sortValue!=null&&Number.isFinite(Number(raw.sortValue)))return Number(raw.sortValue);const label=offerLabel(o);const m=label.match(/\$\s*([\d.]+)/)||label.match(/([\d.]+)\s*USD/i);return m?Number(m[1]):Infinity};
 const sorted=[...(options||[])].sort((a,b)=>parseSortValue(a)-parseSortValue(b)||offerLabel(a).localeCompare(offerLabel(b),undefined,{numeric:true}));
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
  {open&&<div className="branchPickerOptions" ref={list} role="listbox" aria-label={placeholder}>{sorted.map((o,i)=>{const id=idOf(o);return <button type="button" role="option" aria-selected={id===String(value)} className={id===String(value)?'selected':''} key={id||i} onClick={()=>{onChange(id);setOpen(false)}}>{format(o)}</button>})}</div>}
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
function BranchSellingPrice({value,onChange,minimum,retail,locked=false,credit=false}){
 const base=Number(credit?creditCashPrice(Math.max(Number(minimum||0),Number(retail||0))):branchCashPrice(retail)),floor=Number(minimum||0);
 const display=Number.isFinite(Number(value))?value:'';
 const deltas=[-1,-.5,0,.5,1];
 return <div className="sellCompact branchSellingPrice">
   <div className="sellLine branchSellingLine"><b>Selling Price</b><input aria-label="Selling Price" type="number" step="0.01" min={floor} value={display} readOnly={locked} onChange={e=>onChange(e.target.value)}/></div>
   {!locked&&<div className="branchPriceSteps" aria-label="Suggested selling prices">{deltas.map(delta=>{
     const target=Math.round((base+delta)*100)/100;
     const allowed=Number.isFinite(target)&&target>0&&target+1e-9>=floor;
     return <button type="button" key={delta} disabled={!allowed} title={allowed?'Set selling price to $'+target.toFixed(2):'Below supplier cost'} className={Math.abs(Number(value)-target)<.005?'active':''} onClick={()=>onChange(target.toFixed(2))}>
       <strong>${target.toFixed(target%1===0?0:2)}</strong>
     </button>;
   })}</div>}
 </div>;
}

// Game top-up cashier suggestions only. Supplier/account cost is unchanged.
function gameCashPrice(price){
 const amount=Number(price);
 if(!Number.isFinite(amount)||amount<=0)return '0.00';
 const step=amount<5?.5:amount<20?1:amount<40?5:10;
 return (Math.ceil((amount-1e-9)/step)*step).toFixed(2);
}
function GameSellingPrice({value,onChange,minimum,retail,showProfit=false}){
 const base=Number(gameCashPrice(Math.max(Number(minimum||0),Number(retail||0))));
 const floor=Number(minimum||0);
 return <div className="sellCompact branchSellingPrice gameSellingPrice">
  <div className="sellLine branchSellingLine"><b>Selling Price</b><input aria-label="Selling Price" type="number" min={floor} step="0.01" value={value} onChange={e=>onChange(e.target.value)}/>{showProfit&&<span>Profit <strong>${(Number(value||0)-floor).toFixed(4)}</strong></span>}</div>
  <div className="branchPriceSteps" aria-label="Suggested game selling prices">{[-1,-.5,0,.5,1].map(delta=>{
   const target=Math.round((base+delta)*100)/100;
   const allowed=Number.isFinite(target)&&target>0&&target+1e-9>=floor;
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

// Chat app cash collection: the recharge amount is the center suggestion.
// Adjusting the selling price never changes quantity or supplier debit.
function ChatSellingPrice({value,onChange,minimum,amount,showProfit=false}){
 const center=Number(amount);
 const floor=Number(minimum||0);
 const valid=Number.isFinite(center)&&center>0;
 return <div className="sellCompact branchSellingPrice chatSellingPrice">
  <div className="sellLine branchSellingLine"><b>Selling Price</b><input aria-label="Selling Price" type="number" min={floor} step="0.01" value={value} onChange={e=>onChange(e.target.value)}/>{showProfit&&<span>Profit <strong>${(Number(value||0)-floor).toFixed(4)}</strong></span>}</div>
  {valid&&<div className="branchPriceSteps" aria-label="Suggested chat selling prices">{[-1,-.5,0,.5,1].map(delta=>{
   const target=Math.round((center+delta)*100)/100;
   const allowed=target>0&&target+1e-9>=floor;
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
    <div><h3>{success?'Purchase successful':failed?'Purchase failed':'Order received — processing'}</h3><p>{success?'Supplier confirmed and invoice recorded':failed?'Please review the order details below':String(order?.supplier_status||'').match(/complete|success|delivered|fulfilled/i)?'Supplier completed — Daftra invoice pending. Do not repurchase.':'Do not purchase again while confirmation is pending'}</p></div>
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
   {success&&!order?.redeem_code&&!qr&&!report&&<div className="receiptNote">{order?.product_key==='esim_topup'?'The top-up was confirmed for the existing eSIM. No new QR code is issued.':'The supplier confirmed this service. You can review the transaction in My Orders.'}</div>}
   {pending&&<div className="receiptNote">{String(order?.supplier_status||'').match(/complete|success|delivered|fulfilled/i)?'The supplier confirmed this order. Daftra invoice synchronization is pending or needs manual review. Your order is saved; do not buy again.':'Your order is saved. This receipt refreshes automatically; you can also close it and check My Orders. Do not submit the same purchase again.'}</div>}
   {failed&&<div className="receiptNote receiptNoteError">{order?.failure_reason||'The supplier could not complete this order.'}{order?.refunded_at?' The reserved wallet amount was refunded.':''}</div>}
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
 const alfa=prefix==='71'?digit>=6:digit<=5;
 return alfa?'alfa':'touch';
}
function ServiceModal({p,close,branch=false}){
 const [detail,setDetail]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const [values,setValues]=useState({method:'direct'}),[offer,setOffer]=useState(''),[quote,setQuote]=useState(null);
 const [selling,setSelling]=useState(''),[phase,setPhase]=useState(1),[busy,setBusy]=useState(false);
 const [verified,setVerified]=useState(null),[moreOptions,setMoreOptions]=useState([]),[billOtp,setBillOtp]=useState('');
 const serviceRequestKey=useRef(null);
 const path=API+'/api/wholesale/products/'+encodeURIComponent(p.key);
 const update=(key,value)=>{
  setValues(v=>({...v,[key]:value}));setVerified(null);
  // Switching recharge method or entering a recipient must not discard a valid
  // package quote; otherwise 'Recharge Now' remains disabled until reselecting.
  if(['amount','identifier','service','report_type'].includes(key)||(key==='phone'&&isBill))setQuote(null);
  if(key==='identifier'||key==='service'){setOffer('');setMoreOptions([])}
  setBillOtp('');setPhase(1);setError('');serviceRequestKey.current=null;
 };
 useEffect(()=>{let active=true;setError('');setLoading(true);
  cachedFetch(serviceDetailCache,authHeaders().Authorization+'|'+p.key,18000,async()=>{const r=await fetch(path+'/details',{headers:authHeaders()});const d=await r.json();if(!r.ok)throw Error(d.error||'Could not load service');return d.product}).then(product=>{if(active)setDetail(product)}).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setLoading(false)});
  return()=>{active=false};
 },[p.key]);
 const fields=detail?.fields||[];
 // Credits use a quantity before a destination. Other Alfa/Touch offers
 // render their package selector before the recipient number below.
 const orderedFields=fields.some(x=>x.key==='amount')&&['alfa','touch'].includes(String(detail?.provider||'').toLowerCase())
  ?[...fields].sort((a,b)=>Number(b.key==='amount')-Number(a.key==='amount')):fields;
 const kind=detail?.kind||'';
 const isBill=kind==='bill',isCarfax=kind==='carfax',isSodetel=kind==='sodetel_plan',isGift=kind==='gift_card';
 const isCredit=kind==='credit';
 const alfaCredit=isCredit&&detail?.provider==='alfa';
 const phoneField=fields.find(x=>/phone|number|recipient/i.test(x.key||''));
 const phoneStatus=alfaCredit?alfaNumberStatus(values[phoneField?.key||'phone']):'incomplete';
 const isCard=kind==='standard',isDsl=kind==='dsl_card';
 const hasOptions=isGift||['standard','dsl_card','ushare','gift','validity','internet','sodetel_plan'].includes(kind);
 const options=isSodetel?moreOptions:(detail?.options||[]);
 const needsPhone=isCard&&values.method==='direct';
 const validFields=fields.every(x=>String(values[x.key]||'').trim())&&(!needsPhone||String(values.phone||'').trim())&&(!alfaCredit||(phoneStatus==='alfa'&&String(values[phoneField?.key||'phone']||'').replace(/\D/g,'').length>=8))&&(!isCard||Boolean(values.method))&&(!isBill||Boolean(verified?.available&&verified?.bill_ticket))&&(!isCarfax||verified?.ok===true);
 // On package or credit change, fetch a fresh server-authoritative wholesale quote.
 useEffect(()=>{let active=true;setQuote(null);setSelling('');setPhase(1);
  if(!detail||(!offer&&!isCredit&&!isCarfax&&!isBill))return;
  if(isBill&&!verified?.available)return;
  if(isCredit&&(!(Number(values.amount)>=1)||!(Number(values.amount)<=99)))return;
  if(isSodetel&&(!values.identifier||!values.service))return;
  const q=new URLSearchParams();if(offer)q.set('offer_id',offer);
  if(isCredit)q.set('amount',values.amount||'');
  if(isSodetel){q.set('identifier',values.identifier||'');q.set('service',values.service||'')}
  if(isCarfax)q.set('report_type',values.report_type||'1');
  if(isBill)q.set('bill_ticket',verified.bill_ticket);
  const timer=setTimeout(()=>{fetch(path+'/quote?'+q.toString(),{headers:authHeaders()}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Price unavailable');if(active){setQuote(d.quote);setError('');setSelling(isCredit?creditCashPrice(branch?Math.max(Number(d.quote.account_cost||0),Number(d.quote.recommended_selling_price??d.quote.account_cost??0)):Number(d.quote.account_cost||0)):isGift&&!d.quote.fixed_selling_price?giftCashPrice(Number(branch?(d.quote.recommended_selling_price??d.quote.account_cost??0):(d.quote.account_cost||0))):!isBill&&!d.quote.fixed_selling_price?branchCashPrice(branch?Math.max(Number(d.quote.account_cost||0),Number(d.quote.recommended_selling_price??d.quote.account_cost??0)):Number(d.quote.account_cost||0)):Number(Math.max(Number(d.quote.account_cost||0),Number(d.quote.recommended_selling_price??d.quote.account_cost??0))).toFixed(2))}})
   .catch(e=>{if(active)setError(e.message)});},isCredit?170:0);
  return()=>{active=false;clearTimeout(timer)};
 },[p.key,offer,values.amount,values.identifier,values.service,values.report_type,verified?.bill_ticket,detail]);
 useEffect(()=>{if(!isSodetel||!values.identifier||!values.service){setMoreOptions([]);return}
  let active=true;fetch(path+'/extra-options?'+new URLSearchParams({identifier:values.identifier,service:values.service}),{headers:authHeaders()})
   .then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Unable to load plans');if(active)setMoreOptions(d.options||[])}).catch(e=>{if(active)setError(e.message)});
  return()=>{active=false};
 },[p.key,values.identifier,values.service,isSodetel]);
 async function check(){setBusy(true);setError('');setVerified(null);try{
  const r=await fetch(path+'/check',{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify(isCarfax?{vin:values.vin,report_type:values.report_type}:{phone:values.phone})});
  const d=await r.json();if(!r.ok)throw Error(d.error||'Could not verify details');setVerified(d.result||{});if(isBill&&!d.result?.available&&!d.result?.requires_otp)setError(d.result?.message||'No payable bill found');if(isCarfax&&!d.result?.ok)setError(d.result?.message||'Vehicle could not be verified');
 }catch(e){setError(e.message)}finally{setBusy(false)}}
 async function verifyOtp(){if(!verified?.bill_ticket||!billOtp)return;
  setBusy(true);setError('');try{
   const r=await fetch(path+'/bill-otp',{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify({bill_ticket:verified.bill_ticket,otp:billOtp})});
   const d=await r.json();if(!r.ok)throw Error(d.error||'Could not verify bill OTP');
   setVerified(d.result||{});setBillOtp('');if(!d.result?.available&&!d.result?.requires_otp)setError(d.result?.message||'No payable bill found');
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
 const ready=!!detail?.purchase_available&&!!quote&&validFields&&(!hasOptions||!!offer)&&Number.isFinite(price)&&price>=cost&&(!alfaCredit||(phoneStatus==='alfa'&&Number(values.amount)>=1&&Number(values.amount)<=99));
 const fieldInput=(field)=>field.type==='select'?<select value={values[field.key]||''} onChange={e=>update(field.key,e.target.value)}>
   <option value="">Choose {field.label}</option>{(field.options||[]).map((o,i)=>{const id=typeof o==='string'?o:String(o.id||o.value||'');return <option value={id} key={id||i}>{typeof o==='string'?o:o.label||o.name||id}</option>})}</select>
  :<input type={field.type==='number'?'number':'text'} min={field.min} max={field.max} maxLength={field.maxLength} value={values[field.key]||''} onChange={e=>update(field.key,e.target.value)} placeholder={'Enter '+field.label}/>;
 return <div className="modalShade" onMouseDown={e=>e.target===e.currentTarget&&close()}>
  <div className="productModal compactModal servicePopup">
   <button className="modalClose" onClick={close} aria-label="Close"><X size={21}/></button>
   <div className="popupTitle"><img src={productImage(p)} alt=""/><h2>{p.title}{isGift?'':' Recharge'}</h2></div>
   {loading&&<div className="catalogNotice">Loading available services…</div>}
   <>
    {!loading&&detail&&<>
     {isCard&&(detail.provider==='alfa'?<div className="popupField"><span className="popupLabel">Recharge Method</span><div className="rechargeMethodChoices"><button type="button" aria-pressed={values.method==='code'} className={values.method==='code'?'selected':''} onClick={()=>update('method','code')}>Buy Now</button><button type="button" aria-pressed={values.method==='direct'} className={values.method==='direct'?'selected':''} onClick={()=>update('method','direct')}>Direct Recharge</button></div></div>:<label className="popupField">Recharge Method<select value={values.method||''} onChange={e=>update('method',e.target.value)}><option value="">Choose method</option><option value="code">Buy Now — Recharge Code</option><option value="direct">Direct Recharge</option></select></label>)}
     {hasOptions&&<div className="popupField"><span className="popupLabel">{isGift?'Choose Denomination':'Choose Package'}</span><PackagePicker options={options} value={offer} onChange={v=>{setOffer(v);setError('');setPhase(1);serviceRequestKey.current=null}} placeholder="Choose package" priceFor={o=>isGift?(branch?o.retail_price:(o.account_cost??null)):(detail.provider==='alfa'&&o.credit_value!=null?{base:o.credit_value,selling:branch?o.retail_price:o.account_cost,sortValue:o.credit_value}:(branch?o.retail_price??o.price??null:((detail.provider==='alfa'||detail.provider==='touch')?o.account_cost??null:null)))}/></div>}
     {orderedFields.map(x=><div key={x.key}><label className="popupField">{alfaCredit&&x.key==='amount'?<span className="alfaCreditAmountHeading"><span>{x.label}</span><span className="alfaCreditAmountCost">Cost: <strong>{quote?(branch?Number(quote.recommended_selling_price??quote.account_cost):Number(quote.account_cost)).toLocaleString('en-US',{style:'currency',currency:'USD'}):'—'}</strong></span></span>:x.label}{alfaCredit&&x.key==='amount'?<input type="number" min="1" max="99" step="1" value={values.amount||''} onChange={e=>{const v=e.target.value;update('amount',v!==''&&(Number(v)<1||Number(v)>99)?'':v)}} onBlur={()=>{if(values.amount!==''&&(!Number.isInteger(Number(values.amount))||Number(values.amount)<1||Number(values.amount)>99))update('amount','')}} placeholder="Enter credit amount"/>:fieldInput(x)}</label>{alfaCredit&&x.key===phoneField?.key&&phoneStatus==='touch'&&<div className="alfaCreditError" role="alert">This is not an Alfa number.</div>}{alfaCredit&&x.key===phoneField?.key&&phoneStatus==='invalid'&&<div className="alfaCreditError" role="alert">Enter a valid Alfa number.</div>}{alfaCredit&&x.key==='amount'&&<><div className="alfaCreditShortcuts">{[1,2,3,4,5,10,15,20,25,30].map(n=><button type="button" key={n} className={Number(values.amount)===n?'selected':''} onClick={()=>update('amount',String(n))}>${n}</button>)}</div></>}</div>)}
     {needsPhone&&<label className="popupField">Recipient Number<input value={values.phone||''} onChange={e=>update('phone',e.target.value)} placeholder="Enter recipient number"/></label>}
     {isCarfax&&<button className="popupSecondary" disabled={busy||!values.vin||!values.report_type} onClick={check}>{busy?'Checking…':'Check Vehicle'}</button>}
     {isBill&&<button className="popupSecondary" disabled={busy||!values.phone} onClick={check}>{busy?'Checking…':'Fetch Bill'}</button>}
     {isBill&&verified?.requires_otp&&<label className="popupField">Bill Verification Code<input value={billOtp} inputMode="numeric" maxLength={10} onChange={e=>setBillOtp(e.target.value.replace(/\D/g,''))} placeholder="Enter SMS verification code"/></label>}
     {isBill&&verified?.requires_otp&&<button className="popupSecondary" disabled={busy||!billOtp} onClick={verifyOtp}>{busy?'Verifying…':'Verify Bill Code'}</button>}
     {verified&&<div className="validationOk"><ShieldCheck size={17}/><span>{isBill?(verified.requires_otp?'A verification code is required':verified.available?'Bill found · $'+Number(verified.full_amount_usd).toFixed(2):(verified.message||'No payable bill found')):(verified.ok?(verified.year_make||verified.message||'Vehicle checked'):(verified.message||'Vehicle verification failed'))}</span></div>}
     {isBill&&quote&&!branch&&<div className="catalogNotice">Estimated dealer cost: ${Number(quote.estimated_dealer_cost??quote.account_cost).toFixed(2)} · Estimated profit: ${Number(quote.estimated_dealer_profit??0).toFixed(2)}. The full bill is temporarily reserved; actual dealer cost is confirmed after supplier payment and any discount difference is returned to your wallet.</div>}
     {quote&&(isGift?<GiftSellingPrice value={selling} onChange={v=>{setSelling(v);setPhase(1)}} minimum={cost} retail={quote.recommended_selling_price??cost} showProfit={!branch}/>:branch?<BranchSellingPrice value={selling} onChange={v=>{setSelling(v);setPhase(1)}} minimum={cost} retail={quote.recommended_selling_price??cost} locked={priceFixed} credit={isCredit}/>:<WholesaleSellingPrice value={selling} onChange={v=>{setSelling(v);setPhase(1)}} minimum={cost} retail={cost} showProfit={!isBill} credit={isCredit}/>)}
     {detail.purchase_available&&phase===1?<button className="popupAction" disabled={!ready||busy} onClick={()=>setPhase(2)}>Recharge Now</button>:null}
     {detail.purchase_available&&phase===2?<button className="popupAction" disabled={!ready||busy} onClick={purchase}>{busy?'Processing…':'Confirm Purchase'}</button>:null}
     {(!detail.purchase_available)&&<div className="catalogNotice">Package lookup is available. Secure purchasing for this service and account is not active yet; no balance will be deducted.</div>}
    </>}
    {error&&<div className="catalogNotice error">{error}</div>}
   </>
  </div>
 </div>;
}
function ProductModal({p,close,branch=false}){
 if(p.type==='mrp_telco'||p.section==='gift_cards'||p.key==='carfax')return <ServiceModal p={p} close={close} branch={branch}/>;
 const isQuantity=p.type==='quantity';
 const groups=p.groups&&typeof p.groups==='object'?Object.entries(p.groups):[];
 const[firstGroup,setFirstGroup]=useState(groups[0]?.[0]||'');
 const group=groups.find(([k])=>k===firstGroup)?.[1];
 const[offer,setOffer]=useState(''),[quantity,setQuantity]=useState(''),[rechargeAmount,setRechargeAmount]=useState(''),[amountMode,setAmountMode]=useState(false),[values,setValues]=useState({}),[quote,setQuote]=useState(null),[selling,setSelling]=useState(''),[validated,setValidated]=useState(null),[busy,setBusy]=useState(false),[msg,setMsg]=useState(''),[offerPrices,setOfferPrices]=useState({});
 const qtyTimer=useRef(null),qtyRequest=useRef(0),offerRequest=useRef(0),purchaseRequestKey=useRef(null);
 useEffect(()=>()=>clearTimeout(qtyTimer.current),[]);
 useEffect(()=>{purchaseRequestKey.current=null;setOffer('');setQuote(null);setSelling('');setRechargeAmount('');setAmountMode(false);setValidated(null);setMsg('');setOfferPrices({});if(isQuantity){loadQuantityQuote();return}let alive=true;
  if(branch){
   fetch(API+'/api/wholesale/products/'+encodeURIComponent(p.key)+'/offer-prices?group='+encodeURIComponent(firstGroup),{headers:authHeaders()}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Prices unavailable');if(alive)setOfferPrices(d.prices||{})}).catch(e=>{if(alive)setMsg(e.message)});
  }else{
   // Preserve the existing account-specific dealer/shop quoting workflow.
   const list=group?.offers||[];
   Promise.all(list.map(async(o,i)=>{const id=o.offerId||o.id||i;try{const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(p.key)+'/quote?offer_id='+encodeURIComponent(id),{headers:authHeaders()});const d=await r.json();return r.ok?[String(id),d.quote]:null}catch{return null}})).then(rows=>{if(alive)setOfferPrices(Object.fromEntries(rows.filter(Boolean)))});
  }
  return()=>{alive=false}},[firstGroup,p.key,isQuantity,branch]);
 const img=productImage(p);const fields=p.fields?.length?p.fields:(p.playerLabel?[{key:p.fieldKey||'player_id',label:p.playerLabel,placeholder:p.playerPlaceholder}]:[]);
 async function loadQuote(v){
  const requestId=++offerRequest.current;purchaseRequestKey.current=null;setOffer(v);setQuote(null);setValidated(null);setMsg('');
  if(!v){setSelling('');return}
  try{
   // Bulk prices are DISPLAY LABELS only. Never authorize checkout from a cached list.
   const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(p.key)+'/quote?offer_id='+encodeURIComponent(v),{headers:authHeaders()});
   const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load price');if(requestId!==offerRequest.current)return;
   const q=d.quote;setQuote(q);setSelling(gameCashPrice(Math.max(Number(q.account_cost||0),Number(q.recommended_selling_price??q.account_cost??0))));
  }catch(e){if(requestId===offerRequest.current)setMsg(e.message)}
 }
 async function fetchQuantityQuote(v,{keepSelling=false}={}){const requestId=++qtyRequest.current;setMsg('');try{const n=Number(v);const suffix=Number.isFinite(n)&&n>0?'?qty='+encodeURIComponent(n):'';const q=await quantityQuote(p.key,suffix);if(requestId!==qtyRequest.current)return;setQuantity(String(q.quantity||''));setQuote(q);const amount=Number(q.recharge_amount||0);setRechargeAmount(amount?amount.toFixed(2):'');if(!keepSelling)setSelling(Number(amount||q.recommended_selling_price||q.account_cost||0).toFixed(2))}catch(e){if(requestId===qtyRequest.current)setMsg(e.message)}}
 function loadQuantityQuote(v,opts={}){++qtyRequest.current;purchaseRequestKey.current=null;setAmountMode(false);setQuote(null);if(v===undefined||v===null){fetchQuantityQuote(undefined,opts);return}setQuantity(String(v));setMsg('');clearTimeout(qtyTimer.current);qtyTimer.current=setTimeout(()=>fetchQuantityQuote(v,opts),170)}
 async function loadAmountQuote(v){const requestId=++qtyRequest.current;purchaseRequestKey.current=null;setAmountMode(true);setRechargeAmount(String(v));setQuote(null);setMsg('');const amount=Number(v);if(!(amount>0))return;try{const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(p.key)+'/quote?amount='+encodeURIComponent(amount),{headers:authHeaders()});const d=await r.json();if(requestId!==qtyRequest.current)return;if(!r.ok)throw new Error(d.error||'Unable to load price');setQuote(d.quote);setQuantity(String(d.quote.quantity||''));const actual=Number(d.quote.recharge_amount||amount);setRechargeAmount(actual.toFixed(2));setSelling(actual.toFixed(2))}catch(e){if(requestId===qtyRequest.current)setMsg(e.message)}}
 async function validate(){setBusy(true);setMsg('');try{const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(p.key)+'/validate',{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify({fields:values})});const d=await r.json();if(!r.ok||d.valid===false)throw new Error(d.error||'Incorrect account information');setValidated(d)}catch(e){setValidated(null);setMsg(e.message)}finally{setBusy(false)}}
 async function purchase(){if(!quote||busy)return;setBusy(true);setMsg('');try{if(!purchaseRequestKey.current)purchaseRequestKey.current=(globalThis.crypto?.randomUUID?.()||String(Date.now())+'-'+Math.random());const requestKey=purchaseRequestKey.current;const r=await fetch(API+'/api/wholesale/products/'+encodeURIComponent(p.key)+'/purchase',{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify({offer_id:offer,quantity:isQuantity?Number(quantity):undefined,requested_amount:isQuantity&&branch&&amountMode?Number(rechargeAmount):undefined,fields:values,selling_price:Number(selling),request_key:requestKey})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Purchase failed');window.dispatchEvent(new CustomEvent('3abbilo:order-placed',{detail:{orderId:d.order?.id||d.order_id}}))}catch(e){setMsg(e.message)}finally{setBusy(false)}}
 const needsValidation=Boolean(p.validateCategoryId);const allFields=fields.every(f=>String(values[f.key]||'').trim());const canBuy=quote&&allFields&&(!needsValidation||validated);const profit=Number(selling||0)-Number(quote?.account_cost||0);const minQty=Number(quote?.min_qty||p.minQty||1),maxQty=Number(quote?.max_qty||p.maxQty||minQty);
 return <div className="modalShade" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="productModal compactModal"><button className="modalClose" onClick={close}><X size={21}/></button><div className="popupTitle">{img&&<img src={img} alt=""/>}<h2>{p.title} Recharge</h2></div><>{!isQuantity&&groups.length>1&&<label className="popupField">Choose Category<select value={firstGroup} onChange={e=>{purchaseRequestKey.current=null;setFirstGroup(e.target.value)}}>{groups.map(([k,g])=><option key={k} value={k}>{g.title||k}</option>)}</select></label>}{!isQuantity&&group?.offers?.length>0&&<div className="popupField"><span className="popupLabel">Choose Package</span><PackagePicker options={group.offers} value={offer} onChange={loadQuote} priceFor={o=>{const q=offerPrices[String(o.offerId||o.id||'')];return branch?q?.recommended_selling_price:(q?.account_cost==null?null:{value:q.account_cost,decimals:q.decimals??4})}}/></div>}{fields.map((f,i)=><label className="popupField" key={f.key||i}>{f.label||f.name||'Account information'}{f.type==='select'&&Array.isArray(f.options)?<select value={values[f.key]||''} onChange={e=>{setValues(v=>({...v,[f.key]:e.target.value}));setValidated(null)}}><option value="">Choose {f.label||'option'}</option>{f.options.map((o,j)=><option key={o.value||o.id||j} value={o.value||o.id||o}>{o.label||o.name||o}</option>)}</select>:<input value={values[f.key]||''} onChange={e=>{setValues(v=>({...v,[f.key]:e.target.value}));setValidated(null)}} placeholder={f.placeholder||'Enter '+(f.label||'information')}/>}</label>)}{isQuantity&&<>{!branch&&<div className="quantityCost"><span>Your Cost</span><strong>{quote?'$'+Number(quote.account_cost||0).toFixed(4):'—'}</strong></div>}<label className="popupField">Quantity<input type="number" min={minQty} max={maxQty} step="1" value={quantity} onChange={e=>loadQuantityQuote(e.target.value)} placeholder="Enter quantity"/></label><div className="quantityLimits">Minimum: {minQty.toLocaleString('en-US')} <span>•</span> Maximum: {maxQty.toLocaleString('en-US')}</div><label className="popupField">Amount ($)<input type="number" min="0.01" step="0.01" value={rechargeAmount} onChange={e=>{setRechargeAmount(e.target.value);setQuote(null);setMsg('')}} onBlur={e=>loadAmountQuote(e.target.value)} placeholder="Enter amount"/></label><div className="quickSell quickRecharge">{[1,5,10,15,20].map(v=><button type="button" key={v} onClick={()=>loadAmountQuote(v)}>${v}</button>)}</div></>}{needsValidation&&<button className="popupSecondary" onClick={validate} disabled={busy||!allFields}>{busy?'Checking…':'Check Player ID'}</button>}{validated&&<div className="validationOk"><ShieldCheck size={17}/><span>{validated.player_name||'Player verified'}{validated.region?' — '+validated.region:''}</span></div>}{quote&&(isQuantity?<ChatSellingPrice value={selling} onChange={setSelling} minimum={quote.account_cost} amount={quote.recharge_amount??rechargeAmount} showProfit={!branch}/>:<GameSellingPrice value={selling} onChange={setSelling} minimum={quote.account_cost} retail={quote.recommended_selling_price??quote.account_cost} showProfit={!branch}/>)}{msg&&<div className="catalogNotice error">{msg}</div>}<button className="popupAction" onClick={purchase} disabled={busy||!canBuy||Number(selling)<Number(quote?.account_cost||0)}>{busy?'Processing…':'Confirm Purchase'}</button></></div></div>
}
function StandardCatalog({category,branch=false}){const[items,setItems]=useState([]),[search,setSearch]=useState(''),[busy,setBusy]=useState(true),[err,setErr]=useState(''),[selected,setSelected]=useState(null);useEffect(()=>{setBusy(true);setErr('');fetch(API+'/api/wholesale/products?category='+encodeURIComponent(category)+(search?'&search='+encodeURIComponent(search):''),{headers:authHeaders()}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load products');setItems(d.products||[])}).catch(e=>setErr(e.message)).finally(()=>setBusy(false))},[category,search]);return <><div className="catalogSearch"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."/></div>{err&&<div className="catalogNotice error">{err}</div>}{busy?<div className="catalogNotice"><RefreshCw className="spin"/> Loading products…</div>:<div className="catalogGrid">{items.map(p=><ProductTile key={p.key||p.title} p={p} onOpen={setSelected}/>)}</div>}{selected&&createPortal(<ProductModal key={selected.key||selected.title} p={selected} branch={branch} close={()=>setSelected(null)}/>,document.body)}</>}
function EsimCatalog({topup=false,close,branch=false}){
 const[countries,setCountries]=useState([]),[country,setCountry]=useState(''),[iccid,setIccid]=useState(''),[packages,setPackages]=useState([]),[selected,setSelected]=useState(null),[selling,setSelling]=useState(''),[period,setPeriod]=useState(1),[enabled,setEnabled]=useState(false),[busy,setBusy]=useState(false),[err,setErr]=useState(''),[message,setMessage]=useState('');
 const requestKey=useRef(null);
 useEffect(()=>{fetch(API+'/api/wholesale/products/esim/capabilities',{headers:authHeaders()}).then(r=>r.json()).then(d=>setEnabled(d.purchase_enabled===true)).catch(()=>setEnabled(false));if(topup)return;fetch(API+'/api/wholesale/products/esim/countries',{headers:authHeaders()}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Unable to load destinations');return d}).then(d=>{setCountries(d.countries||[]);if(!(d.countries||[]).length)setErr('No destinations available')}).catch(e=>setErr(e.message))},[topup]);
 async function load(){setErr('');setMessage('');setPackages([]);setSelected(null);requestKey.current=null;if(!topup&&!country)return setErr('Choose a country first.');if(topup&&!/^\d{18,22}$/.test(iccid.replace(/\s+/g,'')))return setErr('Enter a valid eSIM ICCID.');setBusy(true);try{const url=topup?API+'/api/wholesale/products/esim/topup-packages?iccid='+encodeURIComponent(iccid.replace(/\s+/g,'')):API+'/api/wholesale/products/esim/packages?country='+encodeURIComponent(country);const r=await fetch(url,{headers:authHeaders()});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load eSIM packages');setPackages(d.packages||[])}catch(e){setErr(e.message)}finally{setBusy(false)}}
 function choose(p){setSelected(p);setPeriod(Math.max(1,Number(p.period_min||1)));setSelling(branch?branchCashPrice(Number(p.recommended_selling_price??p.account_cost??p.price??0)):Number(p.recommended_selling_price??p.account_cost??p.price??0).toFixed(2));setErr('');setMessage('');requestKey.current=null;}
 async function buy(){if(!enabled||!selected||busy)return;const cost=Number(selected.account_cost||0),price=Number(selling);if(!Number.isFinite(price)||price<cost||price<=0)return setErr('Selling price must cover the wholesale cost.');if(!requestKey.current)requestKey.current=globalThis.crypto?.randomUUID?.()||('esim-'+Date.now()+'-'+Math.random().toString(36).slice(2));setBusy(true);setErr('');try{const r=await fetch(API+'/api/wholesale/products/esim/purchase',{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify({mode:topup?'topup':'base',country,iccid:iccid.replace(/\s+/g,''),package_code:selected.package_code,selling_price:price,period_num:Number(selected.period_min)>0?period:0,request_key:requestKey.current})});const d=await r.json();if(!r.ok)throw Error(d.error||'Purchase could not be submitted');window.dispatchEvent(new CustomEvent('3abbilo:order-placed',{detail:{orderId:d.order_id||d.order?.id}}));}catch(e){setErr(e.message+' If a supplier request may have been submitted, check My Orders before trying again.')}finally{setBusy(false)}}
 return <div className="modalShade" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="productModal compactModal esimPopup"><button className="modalClose" onClick={close}><X size={21}/></button><div className="popupTitle">{topup?<RefreshCw size={42}/>:<Globe2 size={42}/>}<h2>{topup?'TOPUP ESIM':'BUY ESIM'}</h2></div><><label className="popupField">{topup?'eSIM ICCID':'Destination'}{topup?<input value={iccid} onChange={e=>setIccid(e.target.value)} placeholder="Enter ICCID"/>:<select value={country} onChange={e=>setCountry(e.target.value)}><option value="">Choose country</option>{countries.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}</select>}</label><button className="popupAction" onClick={load} disabled={busy}>{busy?'Loading…':topup?'Find Top-Up Plans':'Show Plans'}</button>{err&&<div className="catalogNotice error">{err}</div>}{packages.length>0&&<div className="esimPopupPlans">{packages.map((p,i)=><button type="button" className={'esimPopupPlan'+(selected?.package_code===p.package_code?' selected':'')} key={p.package_code||p.slug||i} onClick={()=>choose(p)}><b>{p.name}</b><span>{p.data_label||'Data plan'} · {p.duration_label||''}</span><strong>{branch?(p.recommended_selling_price!=null?'$'+Number(p.recommended_selling_price).toFixed(2):'Price unavailable'):'$'+Number(p.account_cost||p.price||0).toFixed(4)}</strong></button>)}</div>}{selected&&<div className="esimCheckout">{Number(selected.period_min)>0&&<label className="popupField">Days<input type="number" min={selected.period_min} max={selected.period_max||365} value={period} onChange={e=>setPeriod(Number(e.target.value))}/></label>}{branch?<BranchSellingPrice value={selling} onChange={setSelling} minimum={selected.account_cost||0} retail={selected.recommended_selling_price??selected.account_cost??0}/>:<label className="popupField">Selling Price ($)<input type="number" min={selected.account_cost||0} step="0.01" value={selling} onChange={e=>setSelling(e.target.value)}/></label>}{enabled&&<button className="popupAction" disabled={busy||!!message} onClick={buy}>{busy?'Submitting…':'Confirm eSIM Purchase'}</button>}</div>}{message&&<div className="catalogNotice">{message}</div>}{!enabled&&<div className="checkoutPending compact">eSIM checkout is not yet enabled by the wholesale backend. No wallet balance will be deducted.</div>}</></div></div>
}
const CATEGORY_NAMES={games:'GAME TOP-UP',chat:'CHAT APPS TOP-UP',gift_cards:'GIFT CARDS',alfa:'ALFA',touch:'TOUCH',dsl:'OGERO & INTERNET CARDS',other_services:'CARFAX',esim:'ESIM & TOPUP'};
function ProductsPage({branch=false}){const[esimMode,setEsimMode]=useState('');const[categories,setCategories]=useState([]),[active,setActive]=useState(null),[err,setErr]=useState('');useEffect(()=>{fetch(API+'/api/wholesale/products/categories',{headers:authHeaders()}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load categories');setCategories(d.categories||[])}).catch(e=>setErr(e.message))},[]);const current=categories.find(c=>c.key===active);return <div className="sectionPad"><div className="pageTitle"><small>SELL DIGITAL SERVICES</small><h1>{current?(CATEGORY_NAMES[current.key]||current.title.toUpperCase()):'PRODUCTS'}</h1></div>{active&&<button className="catalogBack" onClick={()=>{setActive(null);setEsimMode('')}}><ChevronLeft size={17}/> All categories</button>}{err&&<div className="catalogNotice error">{err}</div>}{!active?<div className="categoryGrid">{categories.map(c=>{const I=categoryIcons[c.key]||Package;return <button key={c.key} onClick={()=>{setActive(c.key);setEsimMode('')}}><div className="categoryIcon"><I/></div><div><h3>{CATEGORY_NAMES[c.key]||c.title.toUpperCase()}</h3>{c.count!=null&&<small>{c.count} products</small>}</div></button>})}</div>:active==='esim'?<><div className="catalogGrid esimTiles"><ProductTile p={{key:'esim_buy',title:'BUY ESIM'}} onOpen={()=>setEsimMode('buy')}/><ProductTile p={{key:'esim_topup',title:'TOPUP ESIM'}} onOpen={()=>setEsimMode('topup')}/></div>{esimMode&&createPortal(<EsimCatalog key={esimMode} branch={branch} topup={esimMode==='topup'} close={()=>setEsimMode('')}/>,document.body)}</>:<StandardCatalog category={active} branch={branch}/>}</div>}
const demoProfit=[['#1042','PUBG Mobile — 660 UC',9.50,10.00],['#1041','Jawaker — 80,926 Tokens',9.35,11.00],['#1039','Mobile Top-Up — $10',9.60,10.00]];
function ProfitPage({dealer}){const rows=demoProfit,total=rows.reduce((a,r)=>a+r[3]-r[2],0),sales=rows.reduce((a,r)=>a+r[3],0),cost=rows.reduce((a,r)=>a+r[2],0);return <div className="sectionPad"><div className="pageTitle"><small>{dealer?'DEALER':'SHOP'} PROFIT</small><h1>Profit Report</h1><p>{dealer?'Track your margin from successful sales and child-Shop activity.':'Track each successful sale using your cost, selling price and profit.'}</p></div><div className="profitSummary"><div><span>Total sales</span><strong>${sales.toFixed(2)}</strong></div><div><span>Total cost</span><strong>${cost.toFixed(2)}</strong></div><div><span>Total profit</span><strong className="profitPositive">${total.toFixed(2)}</strong></div></div><div className="profitTableWrap"><table className="profitTable"><thead><tr><th>Order</th><th>Product</th><th>Your cost</th><th>Selling price</th><th>Profit</th></tr></thead><tbody>{rows.map(r=><tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>${r[2].toFixed(2)}</td><td>${r[3].toFixed(2)}</td><td className="profitPositive">${(r[3]-r[2]).toFixed(2)}</td></tr>)}</tbody></table></div><p style={{color:'#71809d',fontSize:12,marginTop:12}}>Preview data is shown until the product/order backend stores selling price and profit on completed orders.</p></div>}
function DealerShopsPage(){const[shops,setShops]=useState([]),[busy,setBusy]=useState(false),[msg,setMsg]=useState('');async function load(){try{const r=await fetch(API+'/api/wholesale/dealer/shops',{headers:authHeaders()});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load shops');setShops(d.shops||[])}catch(e){setMsg(e.message)}}useEffect(()=>{load()},[]);async function save(shop,value){setBusy(true);setMsg('');try{const r=await fetch(API+'/api/wholesale/dealer/shops/'+shop.id+'/pricing',{method:'PATCH',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify({pricing_percent:Number(value)})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to save');setMsg('Pricing saved');await load()}catch(e){setMsg(e.message)}finally{setBusy(false)}}return <div className="sectionPad"><div className="pageTitle"><h1>My Shops</h1><p>Set the default percentage for each Shop. Product-specific overrides can be added through the pricing API.</p></div>{msg&&<div className="catalogNotice">{msg}</div>}<div className="shopPricingGrid">{shops.map(sh=><div className="shopPricingCard" key={sh.id}><div><b>{sh.shop_name}</b><span>Balance ${Number(sh.balance||0).toFixed(4)}</span></div><label>Default %<input type="number" min="0" max="100" step="0.0001" defaultValue={Number(sh.pricing_percent||0)} id={'pct-'+sh.id}/></label><button disabled={busy} onClick={()=>save(sh,document.getElementById('pct-'+sh.id).value)}>Save</button></div>)}</div></div>}
function OrdersPage({dealer,me,shopOrders=false,highlightOrderId=null}){const[selectedResult,setSelectedResult]=useState(null);const[orders,setOrders]=useState([]),[loading,setLoading]=useState(true),[err,setErr]=useState(''),[search,setSearch]=useState(''),[filter,setFilter]=useState('all');useEffect(()=>{let alive=true,timer;async function load(first=false){try{if(first)setLoading(true);const r=await fetch(API+'/api/wholesale/orders',{headers:authHeaders()});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load orders');if(!alive)return;const myId=Number(me?.id||me?.account_id);let rows=d.orders||[];if(dealer)rows=shopOrders?rows.filter(o=>Number(o.account_id)!==myId):rows.filter(o=>Number(o.account_id)===myId);setOrders(rows);setErr('')}catch(e){if(alive)setErr(e.message)}finally{if(alive)setLoading(false)}}load(true);timer=setInterval(()=>load(false),3000);return()=>{alive=false;clearInterval(timer)}},[dealer,shopOrders,me?.id,me?.account_id]);function money(v){return '$'+Number(v||0).toFixed(4)}function when(v){if(!v)return '—';try{return new Date(v).toLocaleString()}catch{return v}}function status(v){const x=String(v||'pending').toLowerCase();return x==='success'?'Success':x==='failed'||x==='refunded'?'Failed':'Pending'}const q=search.trim().toLowerCase();const shown=orders.filter(o=>{const st=status(o.status).toLowerCase();if(filter!=='all'&&st!==filter)return false;if(!q)return true;return [o.package_name,o.product_title,o.customer_reference,shopOrders?o.purchaser_name:''].some(v=>String(v||'').toLowerCase().includes(q))});async function copy(v){try{await navigator.clipboard.writeText(v)}catch{}}return <div className="sectionPad"><div className="pageTitle"><small>3ABBILO ORDERS</small><h1>{shopOrders?'Shop Orders':'My Orders'}</h1><p>{shopOrders?'Purchases made by Shops under your Dealer account.':'Your completed and recent digital-service purchases.'}</p></div>{!shopOrders&&highlightOrderId&&<div className="orderLandingNotice" role="status"><ReceiptText size={19}/><div><strong>Order #{highlightOrderId} submitted</strong><span>Check its status below. Select <b>View result</b> anytime to see the delivery details. Pending orders update automatically.</span></div></div>}<div className="orderTools"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={shopOrders?'Search shop, product or customer…':'Search product or customer…'}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All Status</option><option value="pending">Pending</option><option value="success">Success</option><option value="failed">Failed</option></select></div>{err&&<div className="catalogNotice error">{err}</div>}{loading?<div className="ordersLoading"><RefreshCw className="spin"/> Loading orders…</div>:shown.length===0?<div className="ordersEmpty"><ReceiptText/><b>No matching orders</b><span>Try another search or status.</span></div>:<div className="ordersTableWrap"><table className="ordersTable"><thead><tr><th>Order ID</th>{shopOrders&&<th>Shop</th>}<th>Product</th><th>Customer</th>{!['jounieh','jbeil'].includes(String(me?.account_type||'').toLowerCase())&&<th>Cost</th>}<th>Status</th><th>Date</th></tr></thead><tbody>{shown.map(o=>{const st=status(o.status);const refundText='Your balance has been refunded.';const rawReason=String(o.failure_reason||'The supplier could not complete this order.').trim();const cleanReason=rawReason.replace(/(?:\s*Your balance has been refunded\.\s*)+/gi,' ').trim();return <tr key={o.id} className={[(st==='Failed'||(o.redeem_code&&st==='Success'))?'orderRowHasDetail':'',Number(o.id)===Number(highlightOrderId)?'orderRecentlyPlaced':''].filter(Boolean).join(' ')}><td><strong>#{o.id}</strong>{!shopOrders&&<button type="button" className="orderResultLink" onClick={()=>setSelectedResult(o.id)}>View result</button>}</td>{shopOrders&&<td>{o.purchaser_name||'Shop'}</td>}<td><strong className="orderProductName">{o.package_name||o.product_title||o.product_key}</strong></td><td>{o.customer_reference||'—'}</td>{!['jounieh','jbeil'].includes(String(me?.account_type||'').toLowerCase())&&<td>{money(o.account_cost)}</td>}<td className="orderStatusCell"><span className={'orderStatus '+st.toLowerCase()}>{st}</span>{st==='Failed'&&<div className="orderCellDetail failedCellDetail"><span className="detailWarn">⚠</span><span>{cleanReason}{o.refunded_at?' '+refundText:''}</span></div>}</td><td>{when(o.completed_at||o.created_at)}</td></tr>})}</tbody></table></div>}{selectedResult&&createPortal(<div className="modalShade" onMouseDown={e=>e.target===e.currentTarget&&setSelectedResult(null)}><div className="productModal compactModal orderResultModal"><button type="button" className="modalClose" onClick={()=>setSelectedResult(null)} aria-label="Close"><X size={21}/></button><div className="popupTitle"><ReceiptText size={32}/><h2>Order Result</h2></div><PurchaseResult orderId={selectedResult} branch={["jounieh","jbeil"].includes(String(me?.account_type||""))} onClose={()=>setSelectedResult(null)}/></div></div>,document.body)}</div>}
function PlaceholderPage({title}){return <div className="sectionPad"><div className="pageTitle"><small>3ABBILO</small><h1>{title}</h1><p>This section is ready to connect to the existing 3ABBILO API.</p></div></div>}
function DashboardHome({dealer,name,wallet,monthlyProfit,setPage}){return <><div className="welcome"><div><h1>Welcome, {name}</h1></div><div className="walletHero"><WalletCards/><span>AVAILABLE BALANCE</span><strong>${Number(wallet?.balance||0).toFixed(4)}</strong><div className="monthlyProfitMini"><span>PROFIT</span><b>${Number(monthlyProfit?.total_profit||0).toFixed(4)}</b></div><a href="#" onClick={e=>{e.preventDefault();setPage('Recharge Account')}}>Recharge account <ArrowRight size={17}/></a></div></div><div className="quickGrid"><div onClick={()=>setPage('Products')}><Package/><span>Products</span><b>Browse digital services</b></div>{dealer&&<div onClick={()=>setPage('My Shops')}><Store/><span>My Shops</span><b>Manage your reseller network</b></div>}<div onClick={()=>setPage('My Orders')}><ReceiptText/><span>Orders</span><b>Track purchases and delivery</b></div><div onClick={()=>setPage('Profit Report')}><BarChart3/><span>Profit</span><b>Review cost, selling price and profit</b></div></div><section className="dashSection"><div><small>SELL MORE</small><h2>Digital services</h2></div><div className="serviceMini">{services.map(([n,I,d,c])=><article className={c} key={n} onClick={()=>setPage('Products')}><I/><div><b>{n}</b><span>{d}</span></div><ArrowRight/></article>)}</div></section></>}
function Dashboard(){const[token]=useState(()=>localStorage.getItem('3abbilo_token')),[me,setMe]=useState(null),[wallet,setWallet]=useState(null),[monthlyProfit,setMonthlyProfit]=useState(null),[loading,setLoading]=useState(true),[open,setOpen]=useState(false),[page,setPage]=useState('Products'),[recentOrderId,setRecentOrderId]=useState(null);useEffect(()=>{function onOrderPlaced(event){const id=Number(event?.detail?.orderId);setRecentOrderId(Number.isSafeInteger(id)&&id>0?id:null);setOpen(false);setPage('My Orders')}window.addEventListener('3abbilo:order-placed',onOrderPlaced);return()=>window.removeEventListener('3abbilo:order-placed',onOrderPlaced)},[]);useEffect(()=>{if(!token){location.replace('/login');return}fetch(API+'/api/wholesale/auth/me',{headers:{Authorization:'Bearer '+token}}).then(async r=>{if(!r.ok)throw Error('Unauthorized');const a=await r.json();const account=a.account||a.user||a;setMe(account);const branch=['jounieh','jbeil'].includes(account.account_type);if(!branch){const [wr,pr]=await Promise.all([fetch(API+'/api/wholesale/wallet',{headers:{Authorization:'Bearer '+token}}),fetch(API+'/api/wholesale/orders/monthly-profit',{headers:{Authorization:'Bearer '+token}})]);if(!wr.ok)throw Error('Wallet unavailable');const w=await wr.json();setWallet(w.wallet||w);if(pr.ok)setMonthlyProfit(await pr.json());setPage('Dashboard')}}).catch(()=>{localStorage.removeItem('3abbilo_token');location.replace('/login')}).finally(()=>setLoading(false))},[token]);function navigatePage(next){if(next!=='My Orders')setRecentOrderId(null);setPage(next)}if(loading)return <div className="loading"><RefreshCw className="spin"/> Loading 3ABBILO…</div>;const type=String(me?.account_type||'shop').toLowerCase(),dealer=type==='dealer',branch=type==='jounieh'||type==='jbeil',nav=branch?branchNav:dealer?dealerNav:shopNav,name=type==='jounieh'?'Jounieh Branch':type==='jbeil'?'Jbeil Branch':(me?.shop_name||me?.business_name||me?.name||'Shop');function logout(){localStorage.removeItem('3abbilo_token');location.replace('/login')}return <div className="appShell"><aside className={open?'side open':'side'}><div className="sideTop"><Brand/><button onClick={()=>setOpen(false)}><X/></button></div><div className="accountMini"><div className="avatar">{name[0]?.toUpperCase()}</div><div><b>{name}</b><span>{branch?'Branch account':dealer?'Dealer account':'Shop account'}</span></div></div><nav>{nav.map(([I,n])=><button className={page===n?'active':''} key={n} onClick={()=>{navigatePage(n);setOpen(false)}}><I size={19}/>{n}</button>)}</nav><button className="logout" onClick={logout}><LogOut size={19}/>Logout</button></aside><div className="appMain"><div className="appTop"><button className="menuBtn" onClick={()=>setOpen(true)}><Menu/></button><h2>{page}</h2>{!branch&&<div className="topBalance"><span>Available balance</span><b>${Number(wallet?.balance||0).toFixed(4)}</b></div>}</div>{page==='Dashboard'&&!branch?<DashboardHome dealer={dealer} name={name} wallet={wallet} monthlyProfit={monthlyProfit} setPage={navigatePage}/>:page==='Products'?<><ProductsPage branch={branch}/></>:page==='My Orders'?<OrdersPage dealer={dealer} me={me} highlightOrderId={recentOrderId}/>:!branch&&page==='Profit Report'?<ProfitPage dealer={dealer}/>:!branch&&page==='My Shops'&&dealer?<DealerShopsPage/>:!branch&&page==='Shop Orders'&&dealer?<OrdersPage dealer={dealer} me={me} shopOrders/>:!branch?<PlaceholderPage title={page}/>:null}</div></div>}
function App(){const p=location.pathname.replace(/\/+$/,'')||'/';if(p==='/'||p==='/login')return <Login/>;if(p==='/dashboard'||p.startsWith('/dashboard/'))return <Dashboard/>;return <Login/>}createRoot(document.getElementById('root')).render(<App/>);
