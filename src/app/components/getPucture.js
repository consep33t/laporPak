"use client";
import { useState, useRef } from "react";
import Image from "next/image";

const CameraCapture = () => {
  const [capturedImage, setCapturedImage] = useState(null); // State untuk gambar yang diambil
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null); // Menyimpan stream video untuk memberhentikannya nanti

  // Fungsi untuk memulai stream kamera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream); // Menyimpan stream untuk nanti dihentikan
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Mulai memutar video dari kamera
      }
    } catch (error) {
      console.error("Error accessing camera: ", error);
    }
  };

  // Fungsi untuk menghentikan stream kamera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Matikan stream kamera
    }
  };

  // Fungsi untuk menangkap gambar dari video feed
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Menggambar frame video ke dalam canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Mengubah gambar dari canvas menjadi data URL
      const imageDataUrl = canvas.toDataURL("image/png");
      setCapturedImage(imageDataUrl); // Menyimpan URL gambar di state

      // Pause video feed setelah gambar diambil
      video.pause();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // Matikan stream kamera
      }
    }
  };

  // Fungsi untuk mengulangi pengambilan gambar
  const retakePhoto = () => {
    setCapturedImage(null); // Reset gambar yang diambil
    startCamera(); // Mulai ulang kamera
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        {!capturedImage && (
          <>
            <button onClick={startCamera}>Buka Kamera</button>
            <button onClick={captureImage} style={{ marginLeft: "10px" }}>
              Ambil Gambar
            </button>
            <button onClick={stopCamera} style={{ marginLeft: "10px" }}>
              Hentikan Kamera
            </button>
          </>
        )}
        {capturedImage && (
          <button onClick={retakePhoto}>Ulangi Pengambilan Foto</button>
        )}
      </div>

      <div>
        {/* Video stream dari kamera */}
        <video
          ref={videoRef}
          style={{
            width: "100%",
            maxWidth: "500px",
            display: capturedImage ? "none" : "block",
          }}
        />

        {/* Canvas untuk menangkap gambar, disembunyikan */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Tampilkan gambar yang diambil */}
        {capturedImage && (
          <div>
            <h3>Gambar yang Diambil:</h3>
            <Image
              src={capturedImage}
              alt="Captured"
              width={500}
              height={500}
              style={{ width: "100%", maxWidth: "500px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
