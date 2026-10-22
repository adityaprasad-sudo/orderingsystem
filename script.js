 const homebtn = document.getElementById("homebtn")
  const img = document.getElementById("home")
  const aboutbtn = document.getElementById("aboutbtn")
  const feedbackbtn = document.getElementById("feedbackbtn")
  const carebtn = document.getElementById("carebtn")
  const aboutimg = document.getElementById("about")
  const feedbackimg = document.getElementById("feedback")
  const careimg = document.getElementById("care")
  homebtn.addEventListener('mouseover', () => {
    img.src = "./assets/homehov.png";
  });

  homebtn.addEventListener('mouseout', () => {
    img.src = "./assets/home.png";
  });

  aboutbtn.addEventListener('mouseover', () => {
    aboutimg.src = "./assets/abouthov.png";
  });

  aboutbtn.addEventListener('mouseout', () => {
    aboutimg.src = "./assets/about.png";
  });

  feedbackbtn.addEventListener('mouseover', () => {
    feedbackimg.src = "./assets/feedbackhov.png";
  });

  feedbackbtn.addEventListener('mouseout', () => {
    feedbackimg.src = "./assets/feedback.png";
  });

  carebtn.addEventListener('mouseover', () => {
    careimg.src = "./assets/carehov.png";
  });

  carebtn.addEventListener('mouseout', () => {
    careimg.src = "./assets/care.png";
  });
  let nextorderno = 2
  let currentorderno = 1
  let actcat = "All"
  const orders = {
    "1": { table: "tb1", items: {} },
    "2": { table: "tb2", items: {} },
    "3": { table: "tb3", items: {} },
    "4": { table: "tb4", items: {} },
    "5": { table: "tb5", items: {} },
    "6": { table: "tb6", items: {} },
    "7": { table: "tb7", items: {} },
    "8": { table: "tb8", items: {} },
    "9": { table: "tb9", items: {} },
    "10": { table: "tb10", items: {} },
  }
  const tabscunt = document.querySelector(".tabs")
  const addbtn = document.querySelector(".addbtn")
  const tableselec = document.querySelector(".selectdrop")
  const selectinput = document.getElementById("site-search")
  const filterbtns = document.querySelectorAll(".filterbtn")
  const billitmecontainer = document.createElement("div")
  const billybox = document.querySelector(".billy")
  billitmecontainer.className = "billitems"
  billybox.appendChild(billitmecontainer)
  const billfoot = document.createElement("div")
  billfoot.className = "billfoot"
  billybox.appendChild(billfoot)
  const itemcard = document.querySelectorAll(".itemcard")
  const warnbox = document.querySelector(".warn")
itemcard.forEach((card,index) => {
    const title = card.querySelector("h3").innerText.trim()
    const pricetxt = card.querySelector(".price").innerText.replace("$","").trim()
    const price = parseFloat(pricetxt) || 2.99;
    const itemid = `item-${index}`;
    card.dataset.id = itemid
    card.dataset.title = title
    card.dataset.price = price 
    if(title.toLowerCase().includes("mushroom")){
        card.dataset.category = "Veg"
    }else{
        card.dataset.category = "Nonveg"
    }
})
  const ordernovalue = document.querySelector(".orderno .value")
  const preptimevalue = document.querySelector(".estimatedtime .value")
  function tabshi(tabel,orderid){
    const crossbtn = tabel.querySelector(".cross")
    tabel.dataset.orderid = orderid;
    tabel.addEventListener("click", (e) => {
        if(e.target.classList.contains("cross")){
            return
        }
        switchorder(orderid)
    })
    if(crossbtn){
        crossbtn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeorder(orderid, tabel);
        })
    }
  }
  document.querySelectorAll(".tabbtn").forEach((tabel) => {
      const match = tabel.innerText.match(/#(\d+)/);
      if (match){
        tabshi(tabel,match[1])
      }
  })
  function switchorder(orderid){
    currentorderno = orderid
    document.querySelectorAll(".tabbtn").forEach((tab) => {
        if(tab.dataset.orderid === orderid){
        tab.style.backgroundColor = "#ffe6e0"
        tab.style.color = "#ee3a03"
        tab.style.borderBottom = "2px solid #ee3a03"
    }else{
        tab.style.backgroundColor = "#ffffff"
        tab.style.color = "#333"
        tab.style.borderBottom = "none"
    }
    })
    if(orders[orderid]){
        tableselec.value = orders[orderid].table
    }
    renderAll();}
    function closeorder(orderid, tabel)
    {
        delete orders[orderid];
        tabel.remove();
        const remainid = Object.keys(orders);
        if(remainid.length > 0){
            switchorder(remainid[remainid.length - 1])
        }else{
            currentorderno = null;
            renderAll();
        }
    }
    addbtn.addEventListener("click", () => {
        const newid = String(nextorderno++);
        orders[newid] = { table: tableselec.value, items: {} };
        const newtab = document.createElement("div")
        newtab.className = "tabbtn"
        newtab.innerText = `Order #${newid}<div class="cross">✖</div>`
        tabscunt.appendChild(newtab)
        tabshi(newtab,newid)
        switchorder(newid)
    })
    tableselec.addEventListener("change", () => {
        if(currentorderno && orders[currentorderno]){
            orders[currentorderno].table = tableselec.value
        }
    })
    function itemquantity(itemid, title, price, delta){
        if(!currentorderno || !orders[currentorderno]){
            addbtn.click()
        }
        const cart = orders[currentorderno].items;
        if(!cart[itemid]){
            cart[itemid] = { title, price, qty: 0 }
        }
        cart[itemid].qty += delta;
        if(cart[itemid].qty <= 0){
            delete cart[itemid]
        }
        renderAll()
    }
    function cardbtn(){
        const cart = (currentorderno && orders[currentorderno]) ? orders[currentorderno].items : {};
        itemcard.forEach((card) => {
            const itemid = card.dataset.id
            const title = card.dataset.title
            const price = parseFloat(card.dataset.price)
            const cardfoot = card.querySelector(".cardfoot")
            const currentqty = cart[itemid] ? cart[itemid].qty : 0;
            const oldshi = cardfoot.querySelector(".addbtncard, .qtycontrol")
            if(oldshi ) oldshi.remove();
            if(currentqty === 0){
                const addbtn = document.createElement("button")
                addbtn.className = "addbtncard"
                addbtn.innerText = "+ Add"
                addbtn.addEventListener("click", () => {
                    itemquantity(itemid, title, price, 1)
                })
                cardfoot.appendChild(addbtn)
            } else{
                const qtyctrl = document.createElement("div")
                qtyctrl.className = "qtycontrol"
                qtyctrl.style.marginRight = "10px"
                qtyctrl.style.marginBottom = "10px"
                qtyctrl.innerHTML = `<button class="qtybtn">-</button><span>${currentqty}</span><button class="qtybtn plus">+</button>`
                qtyctrl.querySelector(".minus").addEventListener("click", () => itemquantity(itemid, title, price, -1))
                qtyctrl.querySelector(".plus").addEventListener("click", () => itemquantity(itemid, title, price, 1))
                cardfoot.appendChild(qtyctrl)
            }
        })
    }
    function rendermoney(){
        if(!currentorderno || !orders[currentorderno]){
            warnbox.style.display = "flex"
            billybox.style.display = "none"
            return
        }
        const cart = orders[currentorderno].items
        const itemkey = Object.keys(cart)
        if(itemkey.length === 0){
            warnbox.style.display = "flex"
            billybox.style.display = "none"
            return
        }
        warnbox.style.display = "none"
        billybox.style.display = "flex"
        billybox.style.display = "column"
        billybox.style.height = "calc(100vh -140px)"
        ordernovalue.textContent = `#${currentorderno}`
        let toitems = 0;
        let subtotal = 0;
        billitmecontainer.innerHTML = "";
        itemkeys.forEach((itemid) => {
            const item = cart[itemid]
            toitems += item.qty
            subtotal += item.price * item.qty
            const row = document.createElement("div")
            row.className = "itemrowbill"
            row.innerText = ` <div class="iteminfo>
            <div class="itemtitle">${item.title}</div>
            <div class="itemprice">${(item.price * item.qty).toFixed(2)}</div>
            </div>
            <div class="qtycontrol">
            <button class="qtybtn minus">-</button>
            <span>${item.qty}</span>
            <button class="qtybtn plus">+</button>
            </div>`
            row.querySelector(".minus").addEventListener("click", () => itemquantity(itemid, item.title, item.price, -1))
            row.querySelector(".plus").addEventListener("click", () => itemquantity(itemid, item.title, item.price, 1))
            billitmecontainer.appendChild(row)

        })
        preptimevalue.textContent = `${15 + toitems * 2} min`
        const tax = subtotal * 0.05;
        const grandtotal = subtotal + tax;

    }
    function renderAll(){
        cardbtn()
        rendermoney()
    }