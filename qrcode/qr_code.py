import socket
import qrcode
import math
from pydantic import BaseModel
from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class prices(BaseModel):
    price: str

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
async def pricesender(data: prices):
    global daprice
    daprice = round(float(data.price) * 100)/100
    return {"status": True, "amount": data.price}
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
        <p style="font-size: 18px; color: #444;">Payment of {daprice} done ! Look at your order screen. Thank You!!!</p>
    </body>
</html>
    """
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)