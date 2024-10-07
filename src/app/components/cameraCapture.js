"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../config/firebaseConfig";

const CameraCapture = ({ onImageUpload }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const storage = getStorage(app);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera: ", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL("image/png");
      setCapturedImage(imageDataUrl);

      video.pause();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const uploadImageToStorage = async () => {
    if (!capturedImage) return;

    try {
      const imageName = `images/${Date.now()}.png`;
      const imageRef = ref(storage, imageName);

      await uploadString(imageRef, capturedImage, "data_url");

      const downloadURL = await getDownloadURL(imageRef);
      setImageUrl(downloadURL);
      console.log("Image uploaded to Firebase Storage! URL:", downloadURL);

      // Panggil fungsi props onImageUpload untuk mengirim URL ke komponen parent
      if (onImageUpload) {
        onImageUpload(downloadURL);
      }
    } catch (error) {
      console.error("Error uploading image: ", error.message);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setImageUrl(null);
    startCamera();
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
        {capturedImage && !imageUrl && (
          <>
            <button onClick={retakePhoto}>Ulangi Pengambilan Foto</button>
            <button
              onClick={uploadImageToStorage}
              style={{ marginLeft: "10px" }}
            >
              Simpan Gambar
            </button>
          </>
        )}
      </div>

      <div>
        <video
          ref={videoRef}
          style={{
            width: "100%",
            maxWidth: "500px",
            display: capturedImage ? "none" : "block",
          }}
        />

        <canvas ref={canvasRef} style={{ display: "none" }} />

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

        {imageUrl && (
          <div>
            <h3>Gambar Berhasil di simpan</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
