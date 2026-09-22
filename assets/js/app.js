/* Nostalgia Chennai — shared app shell */
(function(){
  "use strict";
  var D = window.NOSTALGIA_DATA || {products:[], collections:[], brands:[]};
  var store = {
    get:function(k,d){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
    set:function(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  };
  function money(n){ return "Rs. " + Number(n).toLocaleString("en-IN"); }
  function thumb(src){ if(!src || src.indexOf("assets/img/") !== 0) return src; return src.replace("assets/img/", "assets/img/sm/"); }
  function bySlug(s){ return D.products.find(function(p){ return p.slug===s; }); }
  function cart(){ return store.get("nc_cart", []); }
  function wish(){ return store.get("nc_wish", []); }
  function cartCount(){ return cart().reduce(function(a,l){ return a + (l.qty||1); },0); }
  function addCart(slug,qty){
    var c = cart(); var line = c.find(function(l){ return l.slug===slug; });
    if(line){ line.qty += (qty||1); } else { c.push({slug:slug, qty:(qty||1)}); }
    store.set("nc_cart", c); paintCounts();
  }
  function toggleWish(slug){
    var w = wish(); var i = w.indexOf(slug);
    if(i>-1){ w.splice(i,1); } else { w.push(slug); }
    store.set("nc_wish", w); paintCounts();
    document.querySelectorAll('[data-wish="'+slug+'"]').forEach(function(b){ b.classList.toggle("on", w.indexOf(slug)>-1); });
  }
  function paintCounts(){
    document.querySelectorAll("[data-cart-count]").forEach(function(el){ el.textContent = cartCount(); });
    document.querySelectorAll("[data-wish-count]").forEach(function(el){ el.textContent = wish().length; });
  }
  /* header + footer */
  var NAV = [
    {t:"Home", h:"index.html"},
    {t:"Shop", h:"shop.html", mega:true},
    {t:"Brands", h:"brands.html"}, {t:"Pre-Orders", h:"pre-orders.html"},
    {t:"New Arrivals", h:"new-arrivals.html"}
  ];
  function headerHTML(active){
    var links = NAV.map(function(n){
      if(n.mega){
        return '<span class="nav-item"><a href="shop.html">Shop</a><span class="shop-drop">'+
          '<span class="sd-item"><a href="brands.html">Brands<i>›</i></a><span class="sd-fly brands-fly">'+
          '<span class="sd-group"><a class="sd-brand" href="brand.html?b=hot-wheels">HOTWHEELS</a>'+
          '<a href="search.html?q=Mainlines">Mainlines</a><a href="search.html?q=Fantasy">Fantasy</a><a href="search.html?q=Premiums">Premiums</a><a href="search.html?q=Imported">Imported</a><a href="search.html?q=Silver%20Series">Silver Series</a></span>'+
          '<span class="sd-group"><a class="sd-brand" href="brand.html?b=topps">TOPPS</a>'+
          '<a href="search.html?q=Cricket%20Attax">Cricket Attax</a><span class="sd-years"><a href="search.html?q=Cricket%20Attax%202011">2011</a><a href="search.html?q=Cricket%20Attax%202012">2012</a><a href="search.html?q=Cricket%20Attax%202013">2013</a><a href="search.html?q=Cricket%20Attax%202014">2014</a><a href="search.html?q=Cricket%20Attax%202015">2015</a><a href="search.html?q=Cricket%20Attax%202016">2016</a><a href="search.html?q=Cricket%20Attax%202017">2017</a></span><a href="search.html?q=Slam%20Attax">Slam Attax</a><span class="sd-years"><a href="search.html?q=Slam%20Attax%20Evolution">Evolution ’09</a><a href="search.html?q=Slam%20Attax%20Mayhem">Mayhem ’10</a><a href="search.html?q=Slam%20Attax%20Rumble">Rumble ’11</a><a href="search.html?q=Slam%20Attax%20Rebellion">Rebellion ’12</a><a href="search.html?q=Slam%20Attax%20Superstars">Superstars ’13</a><a href="search.html?q=Slam%20Attax%2010th%20Edition">10th Ed ’17</a><a href="search.html?q=Slam%20Attax%20Live">Live ’18</a><a href="search.html?q=Slam%20Attax%20Universe">Universe ’19</a><a href="search.html?q=Slam%20Attax%20Reloaded">Reloaded ’20</a><a href="search.html?q=Slam%20Attax%202021">2021</a></span><a href="search.html?q=Match%20Attax">Match Attax</a><a href="search.html?q=Hero%20Attax">Hero Attax</a><a href="search.html?q=Turbo%20Attax">Turbo Attax</a></span>'+
          '<span class="sd-group"><a class="sd-brand" href="brand.html?b=wwe">WWE</a>'+
          '<a href="search.html?q=Funko%20Pops">Funko Pops</a><a href="search.html?q=Action%20Figures">Action Figures</a><a href="search.html?q=Stampers">Stampers</a></span>'+
          '<span class="sd-group"><a class="sd-brand" href="brand.html?b=lego">LEGO</a>'+
          '<a href="search.html?q=New%20Sets">New Sets</a><a href="search.html?q=Pre%20Built%20Sets">Pre Built Sets</a></span>'+
          '<span class="sd-group"><a class="sd-brand" href="brand.html?b=harry-potter">HARRY POTTER</a>'+
          '<a href="search.html?q=Action%20Figures">Action Figures</a><a href="search.html?q=Kinder%20Joy">Kinder Joy Pops</a><a href="search.html?q=Funko%20Pop">Funko Pop</a></span>'+
          '<span class="sd-group"><a class="sd-brand" href="brand.html?b=dc-comics">DC</a>'+
          '<a href="search.html?q=Action%20Figures">Action Figures</a><a href="search.html?q=Kinder%20Joy">Kinder Joy Pops</a></span>'+
          '<span class="sd-group"><a class="sd-brand" href="brand.html?b=majorette">MAJORETTE</a>'+
          '<a href="search.html?q=Street%20Cars">Street Cars</a><a href="search.html?q=Racing%20Cars">Racing Cars</a><a href="search.html?q=Collection">Collection</a></span>'+
          '<a href="brands.html">View all brands</a></span></span>'+
          '<span class="sd-item"><a href="shop.html">Product Type<i>›</i></a><span class="sd-fly">'+
          '<a href="shop.html?cat=Action%20Figures">Action Figures</a><a href="shop.html?cat=Statues">Statues</a><a href="shop.html?cat=Replicas">Replicas</a><a href="shop.html?cat=Designer%20Figures">Designer Figures</a><a href="shop.html?cat=Dolls%20and%20Plushies">Dolls and Plushies</a><a href="shop.html?cat=1%2F6%20Scale">1/6 Scale</a><a href="shop.html?cat=Merchandise">Merchandise</a><a href="shop.html?cat=Board%20Games">Board Games</a><a href="shop.html?cat=Exclusives">Exclusives</a><a href="shop.html?cat=Diecast%20Cars">Diecast Cars</a></span></span>'+
          '<span class="sd-item"><a href="new-arrivals.html">Trending<i>›</i></a><span class="sd-fly">'+
          '<a href="collection.html?c=gaming">Gaming Collectibles</a><a href="search.html?q=Iron%20Man">Iron Man</a><a href="search.html?q=Batman">Batman</a><a href="search.html?q=Superman">Superman</a><a href="search.html?q=Spider-Man">Spider-Man</a><a href="collection.html?c=retro">G.I. Joe</a><a href="search.html?q=Warhammer">WARHAMMER</a><a href="search.html?q=Wonder%20Woman">Wonder Women</a><a href="search.html?q=Joker">Joker</a><a href="search.html?q=Harley%20Quinn">Harley Quinn</a><a href="collection.html?c=transformers">Transformers</a><a href="search.html?q=Friends">Friends</a><a href="search.html?q=Harry%20Potter">Harry Potter</a><a href="search.html?q=Witcher">The Witcher</a><a href="search.html?q=Hellboy">Hellboy</a><a href="search.html?q=John%20Wick">John Wick</a><a href="anime.html">Attack On Titan</a><a href="anime.html">Naruto</a><a href="search.html?q=Chainsaw">Chainsaw man</a><a href="anime.html">Demon Slayer</a></span></span>'+
          '</span></span>';
      }
      return '<a href="'+n.h+'">'+n.t+'</a>';
    }).join("");
    return '<div class="infobar"><div class="wrap"><span>Chennai, Tamil Nadu · Superhero &amp; anime collectibles</span><span>Mon–Sat, 11am–7pm · WhatsApp for stock checks</span></div></div>'+
    '<div class="offers"><div class="offers-track"><span>FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE Rs. 2,499</span><span>CHENNAI STORE — MON TO SAT, 11AM TO 7PM</span><span>WHATSAPP US FOR PRE-ORDERS &amp; STOCK CHECKS</span><span>FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE Rs. 2,499</span><span>CHENNAI STORE — MON TO SAT, 11AM TO 7PM</span><span>WHATSAPP US FOR PRE-ORDERS &amp; STOCK CHECKS</span></div></div>'+
    '<header class="site"><div class="wrap"><a class="brand" href="index.html">NOSTALGIA</a>'+
    '<nav class="main" aria-label="Primary">'+links+'<a class="sale" href="shop.html?filter=sale">Sale</a></nav>'+
    '<div class="nav-icons"><a href="search.html" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg></a>'+
    '<a href="contact.html" aria-label="Account"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.4-3.6 3.9-5.2 7-5.2s5.6 1.6 7 5.2"/></svg></a>'+
    '<a href="wishlist.html" aria-label="Wishlist"><svg viewBox="0 0 24 24"><path d="M12 20.3C6.7 16.7 3.5 13.5 3.5 10a4.5 4.5 0 0 1 7.7-3.1l.8.9.8-.9A4.5 4.5 0 0 1 20.5 10c0 3.5-3.2 6.7-8.5 10.3z"/></svg><span class="icount" data-wish-count>0</span></a>'+
    '<a href="cart.html" aria-label="Cart"><svg viewBox="0 0 24 24"><path d="M4.5 9.5h15l-1.4 8.3a2 2 0 0 1-2 1.7H7.9a2 2 0 0 1-2-1.7L4.5 9.5z"/><path d="M9 9.5 12 4.5l3 5"/></svg><span class="icount" data-cart-count>0</span></a></div>'+
    '<button class="burger" type="button" aria-label="Menu">Menu</button></div></header>';
  }
  function footerHTML(){
    return '<footer><div class="wrap"><div class="foot-grid">'+
    '<div><h5>NOSTALGIA</h5><ul><li>Superhero, anime &amp; pop-culture collectibles from Chennai.</li><li>Mon–Sat · 11am–7pm</li></ul></div>'+
    '<div><h5>SHOP</h5><ul><li><a href="new-arrivals.html">New Arrivals</a></li><li><a href="best-sellers.html">Best Sellers</a></li><li><a href="pre-orders.html">Pre-Orders</a></li><li><a href="collections.html">Collections</a></li></ul></div>'+
    '<div><h5>EXPLORE</h5><ul><li><a href="marvel.html">Marvel</a></li><li><a href="dc.html">DC</a></li><li><a href="anime.html">Anime</a></li><li><a href="collections.html">Retro</a></li></ul></div>'+
    '<div><h5>HELP</h5><ul><li><a href="shipping-returns.html">Shipping</a></li><li><a href="shipping-returns.html">Returns</a></li><li><a href="faq.html">FAQ</a></li><li><a href="contact.html">Contact</a></li><li><a href="search.html">Search</a></li></ul></div>'+
    '</div><div class="foot-bottom"><span>© Nostalgia Chennai · Instagram · WhatsApp · Product photos: Flickr contributors via Openverse (CC BY / CC BY-SA)</span><span><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a></span></div></div></footer><nav class="mobilebar" aria-label="Mobile"><a href="index.html" aria-label="Home"><svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7"/><path d="M6.5 9.5V20h11V9.5"/></svg><span>Home</span></a><a href="shop.html" aria-label="Shop"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg><span>Shop</span></a><a href="wishlist.html" aria-label="Wishlist"><svg viewBox="0 0 24 24"><path d="M12 20.3C6.7 16.7 3.5 13.5 3.5 10a4.5 4.5 0 0 1 7.7-3.1l.8.9.8-.9A4.5 4.5 0 0 1 20.5 10c0 3.5-3.2 6.7-8.5 10.3z"/></svg><span class="icount" data-ic-wish data-wish-count>0</span><span>Saved</span></a><a href="cart.html" aria-label="Cart"><svg viewBox="0 0 24 24"><path d="M4.5 9.5h15l-1.4 8.3a2 2 0 0 1-2 1.7H7.9a2 2 0 0 1-2-1.7L4.5 9.5z"/><path d="M9 9.5 12 4.5l3 5"/></svg><span class="icount" data-ic-cart data-cart-count>0</span><span>Cart</span></a></nav>';
  }
  function mountChrome(){
    var hb = document.querySelector("[data-header]"); if(hb){ hb.innerHTML = headerHTML(); }
    var fb = document.querySelector("[data-footer]"); if(fb){ fb.innerHTML = footerHTML(); }
    paintCounts();
    var header = document.querySelector("header.site");
    window.addEventListener("scroll", function(){ if(header){ header.classList.toggle("scrolled", window.scrollY>12); } }, {passive:true});
    var b = document.querySelector(".burger"), n = document.querySelector("nav.main");
    function closeNav(){ n.style.display=""; b.setAttribute("aria-expanded","false"); }
    if(b && n){ b.addEventListener("click", function(){
      if(n.style.display==="flex"){ closeNav(); return; }
      n.style.display="flex"; n.style.flexDirection="column"; n.style.position="absolute";
      n.style.top="100%"; n.style.left="0"; n.style.right="0"; n.style.background="#fff";
      n.style.padding="18px 28px 24px"; n.style.borderBottom="1px solid #DED7CB";
      b.setAttribute("aria-expanded","true");
    });
    n.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeNav); });
    window.addEventListener("resize", function(){ if(window.innerWidth>1300){ closeNav(); } });
    }
  }
  /* product card */
  function badgeClass(b){ b=(b||"").toUpperCase(); if(b==="SALE")return "b-sale"; if(b==="PRE-ORDER")return "b-pre"; if(b==="SOLD OUT")return "b-out"; return ""; }
  function cardHTML(p){
    var w = wish().indexOf(p.slug)>-1 ? " on" : "";
    var price = (p.price==null) ? '<span class="p-price">PRICE ON REQUEST</span>'
      : p.was ? '<span class="p-price"><span class="sp">'+money(p.price)+'</span><span class="was">'+money(p.was)+'</span></span>'
      : '<span class="p-price">'+money(p.price)+'</span>';
    var buyBtn = (p.price==null) ? '<a class="p-add" href="product.html?slug='+p.slug+'">Enquire</a>'
      : (p.status==="Sold Out" ? '<button class="p-add" disabled>Sold Out</button>' : '<button class="p-add" data-add="'+p.slug+'">Quick Add</button>');
    return '<article class="p-card reveal fr-'+p.franchise.toLowerCase().replace(/\s+/g,'-')+'"><div class="p-fig" style="background:'+p.bg+'">'+
      '<div class="badges"><span class="'+badgeClass(p.badge)+'">'+p.badge+'</span></div>'+
      '<button class="p-wish'+w+'" data-wish="'+p.slug+'" aria-label="Wishlist">♡</button>'+
      '<a href="product.html?slug='+p.slug+'" style="display:contents"><span class="glyph" style="color:#fff">'+p.glyph+'</span>'+(p.img?'<img src="'+thumb(p.img)+'" alt="'+p.name+'" loading="lazy" decoding="async" onerror="this.remove()">':'')+'</a></div>'+
      '<div class="p-body"><div class="p-brand">'+p.brand.toUpperCase()+'</div>'+
      '<h3 class="p-name"><a href="product.html?slug='+p.slug+'">'+p.name+'</a></h3>'+
      '<div class="p-row">'+price+buyBtn+'</div>'+
      '<div class="p-status">'+(p.stock?('ONLY '+p.stock+' LEFT'):p.status.toUpperCase())+'</div></div></article>';
  }
  function gridHTML(list){ return list.map(cardHTML).join(""); }
  function bindCards(root){
    (root||document).querySelectorAll("[data-add]").forEach(function(btn){
      btn.addEventListener("click", function(){ addCart(btn.getAttribute("data-add"),1); btn.textContent="Added ✓"; setTimeout(function(){btn.textContent="Quick Add";},1200); });
    });
    (root||document).querySelectorAll("[data-wish]").forEach(function(btn){
      btn.addEventListener("click", function(e){ e.preventDefault(); toggleWish(btn.getAttribute("data-wish")); });
    });
    reveal(root);
  }
  function reveal(root){
    var els = (root||document).querySelectorAll(".reveal:not(.vis)");
    if(!("IntersectionObserver" in window)){ els.forEach(function(el){el.classList.add("vis");}); return; }
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("vis"); io.unobserve(e.target);} }); }, {threshold:.1});
    els.forEach(function(el){ io.observe(el); });
  }
  function qs(name){ return new URLSearchParams(window.location.search).get(name); }
  window.NC = {products:function(){return D.products.slice();}, collections:function(){return D.collections.slice();}, brands:function(){return D.brands.slice();}, thumb:thumb,
    bySlug:bySlug, money:money, cardHTML:cardHTML, gridHTML:gridHTML, bindCards:bindCards, reveal:reveal,
    cart:cart, wish:wish, addCart:addCart, toggleWish:toggleWish, paintCounts:paintCounts, qs:qs, store:store, mountChrome:mountChrome};
  function scrollBands(){
    if(!document.querySelector(".reveal-band")) return;
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var bands = document.querySelectorAll(".reveal-band"), ticking = false;
    function frame(){
      ticking = false;
      var vh = window.innerHeight;
      bands.forEach(function(b){
        var r = b.getBoundingClientRect();
        var p = (vh - r.top) / (vh + r.height);
        p = Math.max(0, Math.min(1, p));
        var inset = (1 - p) * 34, side = (1 - p) * 6;
        b.style.clipPath = "inset("+inset.toFixed(2)+"% "+side.toFixed(2)+"% "+inset.toFixed(2)+"% "+side.toFixed(2)+"% round 14px)";
        var img = b.querySelector("img");
        if(img){ img.style.transform = "scale(1.12) translateY("+((p - 0.5) * -36).toFixed(1)+"px)"; }
      });
    }
    function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", onScroll);
    frame();
  }
  function showPageLoader(href){
    if(document.querySelector(".page-loader")) return;
    var d = document.createElement("div");
    d.className = "page-loader";
    d.innerHTML = '<div class="pl-card"><div class="pl-media"><video src="assets/vid/hero.mp4" autoplay muted loop playsinline poster="assets/img/loader.gif"></video></div><div class="pl-row"><span class="pl-rec"></span><span class="pl-txt">LOADING...</span></div><div class="pl-bar"><i></i></div></div>';
    document.body.appendChild(d);
    var pv = d.querySelector("video");
    if(pv){ pv.muted = true; pv.play().catch(function(){}); }
    setTimeout(function(){ document.body.classList.add("is-loading"); }, 20);
    setTimeout(function(){ location.href = href; }, 700);
  }
  function initPageLoader(){
    document.addEventListener("click", function(e){
      var a = e.target.closest ? e.target.closest("a") : null;
      if(!a) return;
      var href = a.getAttribute("href");
      if(!href || href.charAt(0)==="#" || a.target==="_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var url;
      try{ url = new URL(href, location.href); }catch(err){ return; }
      if(url.origin !== location.origin) return;
      if(url.pathname === location.pathname && url.search === location.search) return;
      e.preventDefault();
      showPageLoader(href);
    });
    window.addEventListener("pageshow", function(){
      var l = document.querySelector(".page-loader");
      if(l){ l.remove(); }
      document.body.classList.remove("is-loading");
    });
  }
  document.addEventListener("DOMContentLoaded", function(){ mountChrome(); reveal(document); scrollBands(); initPageLoader(); });
})();
