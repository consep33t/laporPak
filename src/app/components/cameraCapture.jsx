"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

const CameraCapture = ({ onImageUpload }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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
      // Resize to ensure it's not overly huge
      let width = video.videoWidth;
      let height = video.videoHeight;
      const MAX_WIDTH = 1280;
      const MAX_HEIGHT = 720;
      
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Compress with JPEG and 0.7 quality to aim for < 1MB
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.7);
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
      const supabase = createClient();
      const imageName = `${Date.now()}.jpg`;

      // Convert base64 data url to Blob
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const base64 = capturedImage.split(",")[1];

      // Ensure blob is under 1MB
      if (base64.length > 1048576) {
        if(typeof window !== "undefined" && window.showError) window.showError("Error: Ukuran gambar melebihi 1MB meskipun sudah dikompresi. Silakan ambil ulang dengan pencahayaan lebih minim.");
        setProcessing(false);
        return;
      }

      const { data, error } = await supabase.storage
        .from('laporpak-bucket')
        .upload(imageName, blob, {
          contentType: 'image/jpeg'
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('laporpak-bucket')
        .getPublicUrl(imageName);

      const downloadURL = publicUrlData.publicUrl;
      setImageUrl(downloadURL);
      console.log("Image uploaded to Supabase Storage! URL:", downloadURL);

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
