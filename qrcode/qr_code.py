import socket
import qrcode
import math
from pydantic import BaseModel
from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class Orderitems(BaseModel):
    title: str
    qty: int
    price: float
    linetotal: float
class Ordersum(BaseModel):
    orderid: str
    table:str
    items: List[Orderitems]
    subtotal: float
    tax: float
    total: float    

lastestorder : Ordersum | None = None
app.mount("/videos", StaticFiles(directory="videos"), name="videos")
conneceted_shi: list[WebSocket] = []
def immastealyoip(): #just kidding i used this to attach the ip link in the qr code(for the local host to work on other devices in the same network)
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip
daprice = 0
localip = immastealyoip()
port = 8000
scanurl = f"http://{localip}:{port}/scan"
qr = qrcode.QRCode(
        box_size = 8, border=2
)
qr.add_data(scanurl)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
img.save("qrcode.png")

@app.get("/qrcode.png")
async def qrco():
    return FileResponse("qrcode.png", media_type="image/png")
@app.post("/pricesenderapi")
async def pricesender(data: Ordersum):
    global lastestorder
    lastestorder = data
    return {"status": True, "order": data.model_dump()}
@app.websocket("/itsdonebro")
async def endpoint(websocket: WebSocket):
    await websocket.accept()
    conneceted_shi.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
            conneceted_shi.remove(websocket)
shisha = 99
@app.get("/scan", response_class=HTMLResponse)
async def scan():
       
    for client in conneceted_shi:
          await client.send_json({"status": True})
    if lastestorder:
        itemhtml = "".join([f"""<div style="display:flex; justify-content:space-between; margin: 6px 0; border-bottom: 1px dashed #ccc; padding-bottom: 4px;">
                  <span>{item.qty}x {item.title}</span>
                  <span>${item.linetotal:.2f}</span>
                </div>""" 
                for item in lastestorder.items])
        receipt_html = f"""
        <div style="max-width: 320px; margin: 16px auto; background: #fff; padding: 16px; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: left; font-size: 14px; color: #222;">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; text-align: center;">
                Order #{lastestorder.orderid} ({lastestorder.table.upper()})
            </div>
            {itemhtml}
            <div style="display:flex; justify-content:space-between; color:#666; margin-top: 8px;">
                <span>Tax (5%)</span><span>${lastestorder.tax:.2f}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size: 17px; margin-top: 8px; border-top: 2px solid #222; padding-top: 6px;">
                <span>Total Paid</span><span>${lastestorder.total:.2f}</span>
            </div>
        </div>
        """
        amount_str = f"{lastestorder.total:.2f}"
        
    else:
        receipt_html = "<p>No active order items found.</p>"
        amount_str = "0.00"
        
    return f"""
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Payment Confirmed!</title>
    <style>
      * {{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }}
      body {{
        width: 100%;
        min-height: 100dvh;
        font-family: sans-serif;
        text-align: center;
        overflow-x: hidden;
        padding: 32px 16px;
        background-image: linear-gradient(to bottom, #0afa5e, #f0fdf4);
        position: relative;
      }}
      video {{
        pointer-events: none;
        mix-blend-mode: multiply;
        filter: contrast(0.8) brightness(1.2) saturate(1.2);
      }}
      .main-video {{
        width: 220px;
        height: 220px;
        max-width: 70vw;
        object-fit: contain;
        margin: 0 auto;
        display: block;
      }}
      .bg-video {{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100dvh;
        object-fit: cover;
        z-index: -1;
      }}
    </style>
  </head>
  <body>
    <video class="main-video" src="/videos/tickani.mp4" autoplay loop muted playsinline></video>
    <video class="bg-video" src="/videos/tickani3.mp4" autoplay loop muted playsinline></video>
    <h1 style="color: #16a34a; font-size: 34px; margin: 12px 0 8px;">Success!!!</h1>
    <p style="font-size: 16px; color: #444; margin-bottom: 16px;">Payment of ${amount_str} done! Look at your order screen. Thank You!!!</p>
    {receipt_html}
  </body>
</html>
    """
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)