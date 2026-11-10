  const homebtn = document.getElementById("homebtn")
  const img = document.getElementById("home")
  const aboutbtn = document.getElementById("aboutbtn")
  const feedbackbtn = document.getElementById("feedbackbtn")
  const carebtn = document.getElementById("carebtn")
  const aboutimg = document.getElementById("about")
  const feedbackimg = document.getElementById("feedback")
  const careimg = document.getElementById("care")
  let platformfee = 0
  let servicecharge = 0
  homebtn.addEventListener('mouseover', () => {
    img.src = "./assets/homehov.png";
  })
  homebtn.addEventListener('mouseout', () => {
    img.src = "./assets/home.png";
  })

  aboutbtn.addEventListener('mouseover', () => {
    aboutimg.src = "./assets/abouthov.png";
  })

  aboutbtn.addEventListener('mouseout', () => {
    aboutimg.src = "./assets/about.png";
  })

  feedbackbtn.addEventListener('mouseover', () => {
    feedbackimg.src = "./assets/feedbackhov.png";
  })

  feedbackbtn.addEventListener('mouseout', () => {
    feedbackimg.src = "./assets/feedback.png";
  })
let tabs = 1;
  carebtn.addEventListener('mouseover', () => {
    careimg.src = "./assets/carehov.png";
  })

  carebtn.addEventListener('mouseout', () => {
    careimg.src = "./assets/care.png";
  })
  let nextorderno = 2
  let payedorder = 0
  let currentorderno = 1
  let noclose = true
  let actcat = "All"
  const orders = {
    "1": { table: "tb1", items: {}, locked: false },
    "2": { table: "tb2", items: {},locked: false },
    "3": { table: "tb3", items: {}, locked: false },
    "4": { table: "tb4", items: {}, locked: false },
    "5": { table: "tb5", items: {},locked: false },
    "6": { table: "tb6", items: {}, locked: false},
    "7": { table: "tb7", items: {}, locked: false },
    "8": { table: "tb8", items: {}, locked: false },
    "9": { table: "tb9", items: {}, locked: false },
    "10": { table: "tb10", items: {}, locked: false },
  }
  const tabscunt = document.querySelector(".tabs")
  const addbtn = document.querySelector(".addbtn")
  
  const tableselec = document.querySelector(".selectdrop")
  const selectinput = document.getElementById("site-search")
  const filterbtns = document.querySelectorAll(".filterbtn")
  const billitmecontainer = document.createElement("div")
  const billyboxshi = document.getElementById("billyshi")
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
        card.dataset.category = "NonVeg"
    }
})
const qrimg = document.getElementById("qrimg")
const payingani = document.getElementById("payingani")
const socket = new WebSocket("ws://localhost:8000/itsdonebro");
socket.onopen = () => {
  console.log("Connected to payment WebSocket server.");
};
socket.onmessage = (event) => {
    console.log(event.data)
    const data = JSON.parse(event.data)
    
    if(data.status === true){
        const status = document.getElementById("paystatid")
        if(status){
            status.textContent = "Payment Successful"
            status.classList.add("success")
            qrimg.style.display = "none"
            payingani.style.display = "flex"
            setTimeout(() => {
                overlay.style.display = "none"
            },3000)
        }
    }
}
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
            if(tabs>1){
                if(!orders[orderid] || orders[orderid].locked === false){
                    closeorder(orderid, tabel); 
                    tabs--;
                }else{
                    document.querySelector(".overlay2").style.display = "flex"
                    document.querySelector(".errortitle").innerText = "Order is locked"
                    document.querySelector(".errortext").innerText = "You can't close locked order since this order is being processed by our chefs."
                }
            }
            else{
                document.querySelector(".overlay2").style.display = "flex"
                document.querySelector(".errortitle").innerText = "Cannot Close"
                document.querySelector(".errortext").innerText = "Atleast have one Tab Opened"
            }
        })
    }
  }
  document.querySelectorAll(".tabbtn").forEach((tabel) => {
      const match = tabel.innerText.match(/#(\d+)/);
      if (match){
        if (!tabel.querySelector(".orderinprog")) {
            const badge = document.createElement("div");
            badge.className = "orderinprog";
            badge.style.display = "none";
            badge.innerText = "Order In Progress";
            tabel.appendChild(badge);
        }
        tabshi(tabel,match[1])
      }
  })
  const overlay = document.getElementById("over")
  const cross2 = document.getElementById("cross2")
  cross2.addEventListener("click", () => {
      overlay.style.display = "none"
  })
 const tabbtn = document.querySelectorAll(".tabbtn")
 document.getElementById("errorbtn").addEventListener("click", () => {
     document.querySelector(".overlay2").style.display = "none"
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
        tabs++;
        const newid = String(nextorderno++);
        orders[newid] = { table: tableselec.value, items: {}, locked: false };
        const newtab = document.createElement("div")
        newtab.className = "tabbtn"
        newtab.innerHTML = `Order #${newid}<div class="cross">✖</div><div class="orderinprog" style="display:none;">Order In Progress</div>`
        tabscunt.appendChild(newtab)
        tabshi(newtab,newid)
        switchorder(newid)
    })
    tableselec.addEventListener("change", () => {
        if(currentorderno && orders[currentorderno]){
            orders[currentorderno].table = tableselec.value
        }
    })
    const sumcont = document.getElementById("summarycont")
    function rendersummary(data){
        if(!data){
            sumcont.innerHTML = "<p>No orders yet</p>"
            return
        }
        const itemhtml = data.items.map(item => `
        <div class="sumrow">
            <span>${item.qty}x ${item.title}</span>
            <span>$${item.linetotal.toFixed(2)}</span>
        </div>
        `).join("");
        sumcont.innerHTML = `
        ${itemhtml}
        <div class="sumrow" style="color:#555; border:none;">
        <span>Tax (5%)</span>
        <span>$${data.tax.toFixed(2)}</span>
        </div>
        <div class="sumrow" style="color:#555; border:none;">
        <span>service charge (5%)</span>
        <span>$${servicecharge.toFixed(2)}</span>
        </div>
        <div class="sumrow" style="color:#555; border:none;">
        <span>platform (5%)</span>
        <span>$${platformfee.toFixed(2)}</span>
        </div>
        <div class="sumtotal">
        <span>Total</span>
        <span>$${data.total.toFixed(2)}</span>
        </div>
        `
    }
    function orderinprogbadge(){
        document.querySelectorAll(".tabbtn").forEach((tab) => {
        const id = tab.dataset.orderid;
        const badge = tab.querySelector(".orderinprog");
        const order = orders[id];
        if (badge && order) {
            badge.style.display = order.locked ? "block" : "none";
        }
    });
    }
    function itemquantity(itemid, title, price, delta){
        if(!currentorderno || !orders[currentorderno]){
            addbtn.click()
        }
        const cart = orders[currentorderno].items;
        if(!cart[itemid]){
            cart[itemid] = { title, price, qty: 0 }
        }
        cart[itemid].qty += delta
        if(cart[itemid].qty <= 0){
            delete cart[itemid]
        }
        renderAll()
    }
    let lockshi = false
    let totalfinale = 0
    function cardbtn(){
        const curroder = currentorderno ? orders[currentorderno] : null;
        const cart = (currentorderno && orders[currentorderno]) ? orders[currentorderno].items : {};
        const lockedshi = curroder ? curroder.locked : false;
        itemcard.forEach((card) => {
            const itemid = card.dataset.id
            const title = card.dataset.title
            const price = parseFloat(card.dataset.price)
            const cardfoot = card.querySelector(".cardfoot")
            const currentqty = cart[itemid] ? cart[itemid].qty : 0;
            const oldshi = cardfoot.querySelector(".addbtncard, .qtycontrol")
            if(oldshi) oldshi.remove();
            if(currentqty === 0){
                const addbtn = document.createElement("button")
                addbtn.className = "addbtncard"
                addbtn.innerText = lockedshi ? "Lock": "+ Add"
                addbtn.disabled = lockedshi
                if(!lockedshi){
                    addbtn.addEventListener("click", () => {
                    itemquantity(itemid, title, price, 1)
                })
                }
                cardfoot.appendChild(addbtn)
            } else{
                const qtyctrl = document.createElement("div")
                qtyctrl.className = "qtycontrol"
                qtyctrl.style.marginRight = "10px"
                qtyctrl.style.marginBottom = "10px"
                qtyctrl.innerHTML = `
                <button class="qtybtn minus" ${lockedshi ? "disabled" : ""}>-</button>
                <span>${currentqty}</span>
                <button class="qtybtn plus" ${lockedshi ? "disabled" : ""}>+</button>
                `
                qtyctrl.querySelector(".minus").addEventListener("click", () => itemquantity(itemid, title, price, -1))
                qtyctrl.querySelector(".plus").addEventListener("click", () => itemquantity(itemid, title, price, 1))
                cardfoot.appendChild(qtyctrl)
            }
            const btn = document.getElementById("addbtn22")
        })
    }
    const afterpay = document.getElementById("afterpayid")
    const cancelbtn = document.querySelector(".cancelbtn")
    function cancelorder(order){
        if(!cancelbtn || !order) return;
        
        if(order.permaoder === true){
            
            const cancelbtndis = document.querySelector(".cancelbtndis")
               cancelbtn.disabled = true
                cancelbtn.style.display = "none"
                cancelbtndis.style.display = "flex"
                tabbtn.forEach((tab) => {
                        tab.style.backgroundColor = "#ff9100"
                    })
                console.log("order is perma")
        }else{
            cancelbtn.disabled = false
            const cancelbtndis = document.querySelector(".cancelbtndis")
            if(cancelbtndis) cancelbtndis.style.display = "none"
            cancelbtn.style.display = "flex"
            const timothy = order.canceltimer !== undefined ? order.canceltimer : 10
            let secrem = timothy % 60
            let minrem = Math.floor(timothy / 60)
            cancelbtn.innerText = `Cancel Order
            (${minrem}m ${secrem}s)`
        }
    }
    function timothystart(order){
        if(order.timerid){ clearInterval(order.timerid);
            order.timerid = null;
        }
        order.canceltimer = 180;
        order.permaoder = false;
        if(orders[String(currentorderno)] === order) cancelorder(order);
        cancelorder(order);
        order.timerid = setInterval(() => {
            order.canceltimer--;
            if(order.canceltimer <= 0){
                clearInterval(order.timerid);
                order.permaoder = true;
                order.timerid = null;
                 orderinprogbadge()
            }
            if (orders[String(currentorderno)] === order) {
            cancelorder(order);
        }
        },1000)
    }
    let iwantit = false
    const cancelbtn2 = document.getElementById("cancelbtn2")
    const okbtn = document.getElementById("idkbtn")
    cancelbtn2.addEventListener("click", () => {
        document.querySelector(".overlay3").style.display = "none"
        
    })
    okbtn.addEventListener("click", () => {
    const   overlay3 = document.querySelector(".overlay3")
        overlay3.style.display = "none";
    const cur = orders[currentorderno];
    if (!cur || cur.permaoder === true) return;

    if (cur.timerid) {
        clearInterval(cur.timerid);
        cur.timerid = null;
    }
    noclose = false;
    cur.locked = false;
    cur.permaoder = false;
    delete cur.summary;
    lockshi = false;
    renderAll();
    })
    console.log(iwantit)
    cancelbtn.addEventListener("click", () => {
        document.querySelector(".idktitle").innerText = "Are you sure?"
        document.querySelector(".idktext").innerText = "You want to cancel this order?"
        const overlay3 = document.querySelector(".overlay3")
        const cur = orders[currentorderno];
    if (!cur || cur.permaoder === true) return;
    overlay3.style.display = "flex";
        
        })
        
    
    function rendermoney(){
        if(!currentorderno || !orders[currentorderno]){
            warnbox.style.display = "flex"
            billybox.style.display = "none"
            return
        }
        const curroder = orders[currentorderno]
        if(curroder.locked && curroder.summary){
            warnbox.style.display = "none"
            billybox.style.display = "none"
            afterpay.style.display = "flex"
            rendersummary(curroder.summary)
            cancelorder(curroder)
            return
        }
        afterpay.style.display = "none"
        const cart = orders[currentorderno].items
        const itemkey = Object.keys(cart)
        if(itemkey.length === 0){
            warnbox.style.display =  "flex"
            billybox.style.display = "none"
            return
        }
        warnbox.style.display = "none"
        billybox.style.display = "flex"
        billybox.style.flexDirection = "column"
        billybox.style.height = "calc(100vh - 140px)"
        ordernovalue.textContent = `#${currentorderno}`
        let toitems = 0;
        let subtotal = 0;
        billitmecontainer.innerHTML = "";
        itemkey.forEach((itemid) => {
            const item = cart[itemid]
            toitems += item.qty
            subtotal += item.price * item.qty
            const row = document.createElement("div")
            row.className = "itemrowbill"
            row.innerHTML = ` <div class="iteminfo">
            <div class="itemtitle">${item.title}</div>
            <div class="itemprice">$${(item.price * item.qty).toFixed(2)}</div>
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
        servicecharge = subtotal * 0.1;
        platformfee = subtotal * 0.02; 
        const grandtotal = subtotal + tax + servicecharge + platformfee;
        totalfinale = grandtotal;
        billfoot.innerHTML = `<div class="seperator2" style="width: auto;"></div>
        <div class="billsum"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="billsum"><span>Tax(5%)</span><span>$${tax.toFixed(2)}</span></div>
        <div class="billsum"><span>Service Charge(10%)</span><span>$${servicecharge.toFixed(2)}</span></div>
        <div class="billsum"><span>Platform Fee(2%)</span><span>$${platformfee.toFixed(2)}</span></div>
        <div class="billsum total"><span>total</span><span>$${grandtotal.toFixed(2)}</span></div>
        <button class="checkoutbtn">Checkout(YES!)($${grandtotal.toFixed(2)})</button>`
        billfoot.querySelector(".checkoutbtn").addEventListener("click", () => {
            noclose = true
            const ordersumjson = {
                
                orderid: String(currentorderno),
                table: curroder.table,
                items: itemkey.map(id =>({
                    title: cart[id].title,
                    qty: cart[id].qty,
                    price: cart[id].price,
                    linetotal: Number((cart[id].price * cart[id].qty).toFixed(2))

                })),
                subtotal: Number(subtotal.toFixed(2)),
                tax: Number(tax.toFixed(2)),
                platformfee: Number(platformfee.toFixed(2)),
                servicecharge: Number(servicecharge.toFixed(2)),
                total: Number(grandtotal.toFixed(2))
            }
            curroder.locked = true
            curroder.summary = ordersumjson
            curroder.permaoder = false
            amountchig.textContent = "Scan to Pay $" + totalfinale.toFixed(2);
            lockshi = true
            timothystart(curroder)
            pricesender(ordersumjson)
            renderAll()
        })
        
    }
    document.querySelector(".paynow").addEventListener("click", () => {
    const cur = orders[currentorderno];
    if (cur && cur.summary) {
        amountchig.textContent = "Scan to Pay $" + cur.summary.total.toFixed(2);
        qrimg.style.display = "block";
        payingani.style.display = "none";
        overlay.style.display = "flex";
        pricesender(cur.summary);
    }
})
    function renderAll(){
        cardbtn()
        rendermoney()
        orderinprogbadge()
    }
    function filterlogic(){
        const filter = selectinput.value.toLowerCase().trim();
        itemcard.forEach((card) =>{
            const title = card.dataset.title.toLowerCase();
            const desc = card.querySelector("p").innerText.toLowerCase();
            const category = card.dataset.category
            const match = title.includes(filter) || desc.includes(filter)
            const matchcat = actcat === "All" || category === actcat;
            card.style.display = (match && matchcat) ? "flex":"none"
        })
    }
    selectinput.addEventListener("input", filterlogic)
    filterbtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            actcat = btn.innerText.trim()
            filterbtns.forEach((b) =>{
                b.style.backgroundColor = "#f0f0f0";
                b.style.color = "#333"
                b.style.borderColor = "#e0e0e0"
            })
            btn.style.backgroundColor = "#ffffff"
            btn.style.color = "#333"
            btn.style.borderColor = "#ee3a03"
            filterlogic()
        })
    })
    const amountchig = document.getElementById("amount")
    switchorder("1");
    async function pricesender(sumdata){
        const response = await fetch("http://localhost:8000/pricesenderapi",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
               sumdata
            )
        })
        console.log(await response.json())

    }