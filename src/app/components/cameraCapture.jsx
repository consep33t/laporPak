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
    <div className="w-full flex flex-col items-center p-2">
      <div className="mb-6 flex flex-wrap justify-center gap-4 w-full">
        {!capturedImage && (
          <div className="flex flex-wrap justify-center gap-4 w-full">
            <button
              onClick={startCamera}
              className="shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 flex-1 md:flex-none"
            >
              Buka Kamera
            </button>
            <button
              onClick={captureImage}
              className="shadow-clay-btn active:shadow-clay-btn-active bg-clayGreen hover:opacity-90 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 flex-1 md:flex-none"
            >
              Ambil Gambar
            </button>
            <button
              onClick={stopCamera}
              className="shadow-clay-btn active:shadow-clay-btn-active bg-clayRed hover:opacity-90 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 flex-1 md:flex-none"
            >
              Hentikan
            </button>
          </div>
        )}
        {capturedImage && !imageUrl && (
          <div className="flex flex-wrap justify-center gap-4 w-full">
            <button
              onClick={retakePhoto}
              className="shadow-clay-btn active:shadow-clay-btn-active bg-clayYellow hover:opacity-90 text-clayText font-bold py-3 px-6 rounded-2xl transition-all duration-200 flex-1 md:flex-none"
            >
              Ulangi Foto
            </button>
            <button
              onClick={uploadImageToStorage}
              className="shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 flex-1 md:flex-none"
            >
              Simpan Gambar
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center w-full">
        <video
          ref={videoRef}
          className={`w-full max-w-sm rounded-[1.5rem] shadow-clay ${capturedImage ? "hidden" : "block"}`}
        />

        <canvas ref={canvasRef} className="hidden" />

        {capturedImage && (
          <div className="flex flex-col items-center w-full">
            <h3 className="text-lg font-bold mt-4 mb-4 text-clayText">Gambar yang Diambil:</h3>
            <Image
              src={capturedImage}
              alt="Captured"
              width={500}
              height={500}
              className="w-full max-w-sm rounded-[1.5rem] shadow-clay border-4 border-white/50"
            />
          </div>
        )}

        {imageUrl && (
          <div className="mt-6 shadow-clay-active bg-clayPrimary rounded-2xl p-4 w-full text-center">
            <h3 className="text-lg font-bold text-clayGreen mb-1">Gambar Berhasil Disimpan ✓</h3>
            <p className="text-xs text-gray-500 truncate px-2">{imageUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
