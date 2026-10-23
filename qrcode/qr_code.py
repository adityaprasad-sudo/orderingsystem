import socket
import qrcode
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
@app.websocket("/itsdonebro")
async def endpoint(websocket: WebSocket):
    await websocket.accept()
    conneceted_shi.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
            conneceted_shi.remove(websocket)
@app.get("/scan", response_class=HTMLResponse)
async def scan():
  
  for client in conneceted_shi:
    await client.send_json({"status": True})
  return """
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmed!</title>
      </head>
      <style>
        body {
          font-family: sans-serif; 
          text-align: center; 
          margin-top: 60px; 
          background: #ffffff;
        }

      </style>
      <body>
        <video src="/videos/tickani.mp4" width="300px" height="300px" autoplay loop muted></video>
        <h1 style="color: #16a34a; font-size: 40px; margin-bottom: 8px;">Success</h1>
        <p style="font-size: 18px; color: #444;">Payment done! Look at your order screen.</p>
    </body>
</html>
    """
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)    


