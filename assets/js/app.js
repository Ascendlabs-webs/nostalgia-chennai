/* Nostalgia Chennai — shared app shell */
(function(){
  "use strict";
  var D = window.NOSTALGIA_DATA || {products:[], collections:[], brands:[]};
  var store = {
    get:function(k,d){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
    set:function(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  };
  function money(n){ return "Rs. " + Number(n).toLocaleString("en-IN"); }
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
    {t:"Shop", h:"shop.html", mega:true},
    {t:"Anime", h:"anime.html"}, {t:"Marvel", h:"marvel.html"}, {t:"DC", h:"dc.html"},
    {t:"Brands", h:"brands.html"}, {t:"Pre-Orders", h:"pre-orders.html"},
    {t:"New Arrivals", h:"new-arrivals.html"}
  ];
  function headerHTML(active){
    var links = NAV.map(function(n){
      if(n.mega){
        return '<span class="nav-item"><a href="shop.html">Shop</a><span class="mega">'+
          '<span><h5>Category</h5><ul><li><a href="shop.html">Action Figures</a></li><li><a href="shop.html">Statues</a></li><li><a href="shop.html">Die-Cast</a></li><li><a href="shop.html">Model Kits</a></li></ul></span>'+
          '<span><h5>Featured</h5><ul><li><a href="new-arrivals.html">New Arrivals</a></li><li><a href="best-sellers.html">Best Sellers</a></li><li><a href="pre-orders.html">Pre-Orders</a></li></ul></span>'+
          '<span><h5>Worlds</h5><ul><li><a href="marvel.html">Marvel</a></li><li><a href="anime.html">Anime</a></li><li><a href="dc.html">DC</a></li></ul></span></span></span>';
      }
      return '<a href="'+n.h+'">'+n.t+'</a>';
    }).join("");
    return '<div class="infobar"><div class="wrap"><span>Chennai, Tamil Nadu · Superhero &amp; anime collectibles</span><span>Mon–Sat, 11am–7pm · WhatsApp for stock checks</span></div></div>'+
    '<div class="offers"><div class="offers-track"><span>FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE Rs. 2,499</span><span>CHENNAI STORE — MON TO SAT, 11AM TO 7PM</span><span>WHATSAPP US FOR PRE-ORDERS &amp; STOCK CHECKS</span><span>FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE Rs. 2,499</span><span>CHENNAI STORE — MON TO SAT, 11AM TO 7PM</span><span>WHATSAPP US FOR PRE-ORDERS &amp; STOCK CHECKS</span></div></div>'+
    '<header class="site"><div class="wrap"><a class="brand" href="index.html">NOSTALGIA</a>'+
    '<nav class="main" aria-label="Primary">'+links+'<a class="sale" href="shop.html?filter=sale">Sale</a></nav>'+
    '<div class="hicons"><a href="search.html" aria-label="Search">Search</a><a href="wishlist.html" aria-label="Wishlist">Wishlist (<span data-wish-count>0</span>)</a><a href="cart.html" aria-label="Cart">Cart (<span data-cart-count>0</span>)</a></div>'+
    '<button class="burger" type="button" aria-label="Menu">Menu</button></div></header>';
  }
  function footerHTML(){
    return '<footer><div class="wrap"><div class="foot-grid">'+
    '<div><h5>NOSTALGIA</h5><ul><li>Superhero, anime &amp; pop-culture collectibles from Chennai.</li><li>Mon–Sat · 11am–7pm</li></ul></div>'+
    '<div><h5>SHOP</h5><ul><li><a href="new-arrivals.html">New Arrivals</a></li><li><a href="best-sellers.html">Best Sellers</a></li><li><a href="pre-orders.html">Pre-Orders</a></li><li><a href="collections.html">Collections</a></li></ul></div>'+
    '<div><h5>EXPLORE</h5><ul><li><a href="marvel.html">Marvel</a></li><li><a href="dc.html">DC</a></li><li><a href="anime.html">Anime</a></li><li><a href="collections.html">Retro</a></li></ul></div>'+
    '<div><h5>HELP</h5><ul><li><a href="shipping-returns.html">Shipping</a></li><li><a href="shipping-returns.html">Returns</a></li><li><a href="faq.html">FAQ</a></li><li><a href="contact.html">Contact</a></li><li><a href="search.html">Search</a></li></ul></div>'+
    '</div><div class="foot-bottom"><span>© Nostalgia Chennai · Instagram · WhatsApp · Product photos: Flickr contributors via Openverse (CC BY / CC BY-SA)</span><span><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a></span></div></div></footer>';
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
    window.addEventListener("resize", function(){ if(window.innerWidth>1100){ closeNav(); } });
    }
  }
  /* product card */
  function badgeClass(b){ b=(b||"").toUpperCase(); if(b==="SALE")return "b-sale"; if(b==="PRE-ORDER")return "b-pre"; return ""; }
  function cardHTML(p){
    var w = wish().indexOf(p.slug)>-1 ? " on" : "";
    var price = p.was ? '<span class="p-price"><span class="sp">'+money(p.price)+'</span><span class="was">'+money(p.was)+'</span></span>'
                      : '<span class="p-price">'+money(p.price)+'</span>';
    return '<article class="p-card reveal"><div class="p-fig" style="background:'+p.bg+'">'+
      '<div class="badges"><span class="'+badgeClass(p.badge)+'">'+p.badge+'</span></div>'+
      '<button class="p-wish'+w+'" data-wish="'+p.slug+'" aria-label="Wishlist">♡</button>'+
      '<a href="product.html?slug='+p.slug+'" style="display:contents">'+(p.img?'<img src="'+p.img+'" alt="'+p.name+'" loading="lazy">':'<span class="glyph" style="color:#fff">'+p.glyph+'</span>')+'</a></div>'+
      '<div class="p-body"><div class="p-brand">'+p.brand.toUpperCase()+'</div>'+
      '<h3 class="p-name"><a href="product.html?slug='+p.slug+'">'+p.name+'</a></h3>'+
      '<div class="p-row">'+price+'<button class="p-add" data-add="'+p.slug+'">Quick Add</button></div>'+
      '<div class="p-status">'+p.status.toUpperCase()+'</div></div></article>';
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
  window.NC = {products:function(){return D.products.slice();}, collections:function(){return D.collections.slice();}, brands:function(){return D.brands.slice();},
    bySlug:bySlug, money:money, cardHTML:cardHTML, gridHTML:gridHTML, bindCards:bindCards, reveal:reveal,
    cart:cart, wish:wish, addCart:addCart, toggleWish:toggleWish, paintCounts:paintCounts, qs:qs, store:store, mountChrome:mountChrome};
  document.addEventListener("DOMContentLoaded", function(){ mountChrome(); reveal(document); });
})();
