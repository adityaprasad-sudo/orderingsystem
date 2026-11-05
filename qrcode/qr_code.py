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
    line_total: float
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
def immastealyoip(): #just kidding i used this to attach the ip link in the qr code
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
async def pricesender(data: ordersum):
    global latestorder
    latestorder = data
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
                  <span>${item.line_total:.2f}</span>
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
        amount_str = f"${lastestorder.total:.2f}"
    else:
        receipt_html = "<p>No active order items found.</p>"
        amount_str = "$0.00"
  return f"""
<!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmed!</title>
      </head>
      <style>
        body {{
          width: 100%;
          height: 100vh;
          font-family: sans-serif;
          text-align: center;
          overflow: hidden;
          margin-top: 60px;
          background-image: linear-gradient(to bottom, #0afa5e, #f0fdf4);
        }}
        video {{
        cursor: none;
        overflow: hidden;
  mix-blend-mode: multiply;
  filter: contrast(0.8) brightness(1.2) saturate(1.2);
}}

      </style>
      <body>
        <video src="./videos/tickani.mp4" width="300px" height="300px" autoplay loop muted></video>
        <video src="./videos/tickani3.mp4" style="position: absolute; top:1px; left: 5px;" autoplay loop muted></video>
        <h1 style="color: #16a34a; font-size: 40px; margin-bottom: 8px;">Success!!!</h1>
        <p style="font-size: 18px; color: #444;">Payment of {amount_str} done ! Look at your order screen. Thank You!!!</p>
        {receipt_html}
    </body>
</html>
    """
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)