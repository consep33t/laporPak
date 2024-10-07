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
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Kamera Pengambilan Gambar
      </h1>
      <div className="mb-4 flex justify-center">
        {!capturedImage && (
          <div className="flex space-x-2">
            <button
              onClick={startCamera}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Buka Kamera
            </button>
            <button
              onClick={captureImage}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
            >
              Ambil Gambar
            </button>
            <button
              onClick={stopCamera}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Hentikan Kamera
            </button>
          </div>
        )}
        {capturedImage && !imageUrl && (
          <div className="flex flex-col space-y-2">
            <button
              onClick={retakePhoto}
              className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
            >
              Ulangi Pengambilan Foto
            </button>
            <button
              onClick={uploadImageToStorage}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
            >
              Simpan Gambar
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <video
          ref={videoRef}
          className={`w-full max-w-sm ${capturedImage ? "hidden" : "block"}`}
        />

        <canvas ref={canvasRef} className="hidden" />

        {capturedImage && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mt-4">Gambar yang Diambil:</h3>
            <Image
              src={capturedImage}
              alt="Captured"
              width={500}
              height={500}
              className="w-full max-w-sm"
            />
          </div>
        )}

        {imageUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Gambar Berhasil Disimpan</h3>
            <p className="text-sm text-gray-500">URL: {imageUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
