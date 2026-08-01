"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

const CameraCapture = ({ onImagesUpdate }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);

  const MAX_IMAGES = 5;

  const handleImageUploaded = (newUrl) => {
    const newImages = [...uploadedImages, newUrl];
    setUploadedImages(newImages);
    if (onImagesUpdate) onImagesUpdate(newImages);
  };

  const removeImage = (indexToRemove) => {
    const newImages = uploadedImages.filter((_, idx) => idx !== indexToRemove);
    setUploadedImages(newImages);
    if (onImagesUpdate) onImagesUpdate(newImages);
  };

  const startCamera = async () => {
    if (uploadedImages.length >= MAX_IMAGES) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera: ", error);
      if(typeof window !== "undefined" && window.showError) window.showError("Gagal mengakses kamera.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const captureImageAndUpload = async () => {
    if (uploadedImages.length >= MAX_IMAGES) {
      if(typeof window !== "undefined" && window.showError) window.showError(`Maksimal ${MAX_IMAGES} gambar.`);
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      setIsProcessing(true);
      const context = canvas.getContext("2d");
      
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

      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.7);
      
      video.pause();
      stopCamera();

      await uploadBase64(imageDataUrl);
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    if (uploadedImages.length + files.length > MAX_IMAGES) {
      if(typeof window !== "undefined" && window.showError) window.showError(`Maksimal ${MAX_IMAGES} gambar. Anda hanya bisa menambah ${MAX_IMAGES - uploadedImages.length} lagi.`);
      return;
    }

    setIsProcessing(true);
    for (const file of files) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise((resolve) => {
          reader.onload = async () => {
            await uploadBase64(reader.result);
            resolve();
          };
        });
      } catch (err) {
        console.error("Upload error", err);
      }
    }
    setIsProcessing(false);
    // reset input
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadBase64 = async (base64Url) => {
    try {
      const supabase = createClient();
      const imageName = `${Date.now()}-${Math.floor(Math.random()*1000)}.jpg`;

      const res = await fetch(base64Url);
      const blob = await res.blob();
      const base64Data = base64Url.split(",")[1];

      if (base64Data.length > 2097152) { // 2MB
         if(typeof window !== "undefined" && window.showError) window.showError("Ukuran gambar terlalu besar. Coba kompres atau gunakan gambar lain.");
         return;
      }

      const { data, error } = await supabase.storage
        .from('laporpak-bucket')
        .upload(imageName, blob, { contentType: 'image/jpeg' });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('laporpak-bucket')
        .getPublicUrl(imageName);

      handleImageUploaded(publicUrlData.publicUrl);
    } catch (error) {
      console.error("Error uploading image: ", error.message);
      if(typeof window !== "undefined" && window.showError) window.showError("Gagal mengunggah gambar.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-2">
      {/* Tombol Aksi */}
      {uploadedImages.length < MAX_IMAGES && !isCameraActive && (
        <div className="flex flex-col md:flex-row justify-center gap-4 w-full mb-6">
          <button
            onClick={startCamera}
            className="shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-bold py-3 px-6 rounded-2xl transition-all flex-1"
          >
            📸 Buka Kamera
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="shadow-clay-btn active:shadow-clay-btn-active bg-clayGreen hover:opacity-90 text-white font-bold py-3 px-6 rounded-2xl transition-all flex-1"
          >
            📁 Pilih dari Galeri
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*" 
            multiple 
            onChange={handleFileUpload} 
          />
        </div>
      )}

      {isProcessing && (
        <div className="w-full mb-6 p-4 text-center text-clayBlue font-bold animate-pulse">
          ⏳ Sedang memproses dan mengunggah...
        </div>
      )}

      {/* Mode Kamera Aktif */}
      <div className={`flex flex-col items-center w-full mb-6 ${isCameraActive ? "block" : "hidden"}`}>
        <video
          ref={videoRef}
          className="w-full max-w-sm rounded-[1.5rem] shadow-clay border-4 border-white/50 mb-4"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="flex justify-center gap-4 w-full">
           <button
             onClick={captureImageAndUpload}
             disabled={isProcessing}
             className="shadow-clay-btn active:shadow-clay-btn-active bg-clayGreen hover:opacity-90 text-white font-bold py-3 px-6 rounded-2xl transition-all"
           >
             Cetak & Unggah
           </button>
           <button
             onClick={stopCamera}
             className="shadow-clay-btn active:shadow-clay-btn-active bg-clayRed hover:opacity-90 text-white font-bold py-3 px-6 rounded-2xl transition-all"
           >
             Batal
           </button>
        </div>
      </div>

      {/* Grid Preview Image */}
      {uploadedImages.length > 0 && (
        <div className="w-full">
          <h3 className="text-sm font-bold text-clayText mb-3">
            Gambar Laporan ({uploadedImages.length}/{MAX_IMAGES})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((url, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden shadow-clay border-4 border-white/50">
                <Image
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full shadow-md font-bold text-sm transform hover:scale-110 transition-all"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
