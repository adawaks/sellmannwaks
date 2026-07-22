import React, { useCallback, useEffect, useState } from "react";
import DropZone from "./DropZone";
import Slideshow from "./Slideshow";
import "./Bilder.css";

const CLOUD_NAME = "gxc5qchq";
const UPLOAD_PRESET = "sellmannwaks_upload";
const GALLERY_TAG = "sellmannwaks-gallery";

export default function Bilder() {
  const [images, setImages] = useState([]);

  const [loadingGallery, setLoadingGallery] = useState(true);
  const [galleryError, setGalleryError] = useState("");

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const createImageUrl = useCallback((image) => {
    if (image.secure_url) {
      return image.secure_url;
    }

    const version = image.version ? `v${image.version}/` : "";
    const format = image.format ? `.${image.format}` : "";

    return (
      `https://res.cloudinary.com/${CLOUD_NAME}` +
      `/image/upload/f_auto,q_auto,w_1600/${version}` +
      `${image.public_id}${format}`
    );
  }, []);

  const normalizeImage = useCallback(
    (image) => ({
      ...image,
      secure_url: createImageUrl(image),
      asset_id:
        image.asset_id ||
        `${image.public_id}-${image.version || "latest"}`,
    }),
    [createImageUrl]
  );

  const loadGallery = useCallback(async () => {
    setLoadingGallery(true);
    setGalleryError("");

    try {
      const listUrl =
        `https://res.cloudinary.com/${CLOUD_NAME}` +
        `/image/list/${GALLERY_TAG}.json`;

      const response = await fetch(listUrl, {
        cache: "no-store",
      });

      const responseText = await response.text();

      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            'Cloudinary blockerar gallerilistan. Avmarkera "Resource list" under Settings → Security i Cloudinary.'
          );
        }

        throw new Error(
          data?.error?.message ||
            `Kunde inte hämta bilderna. Cloudinary svarade med status ${response.status}.`
        );
      }

      const galleryImages = (data?.resources || [])
        .map(normalizeImage)
        .sort((firstImage, secondImage) => {
          const firstTime = new Date(
            firstImage.created_at || 0
          ).getTime();

          const secondTime = new Date(
            secondImage.created_at || 0
          ).getTime();

          return secondTime - firstTime;
        });

      setImages(galleryImages);
    } catch (error) {
      console.error("Cloudinary gallery error:", error);

      setGalleryError(
        error.message || "Kunde inte hämta bildgalleriet."
      );
    } finally {
      setLoadingGallery(false);
    }
  }, [normalizeImage]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    setProgress(0);
    setUploadMessage("");
    setUploadError("");

    const uploadedImages = [];

    try {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];

        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const responseText = await response.text();

        let data = null;

        if (responseText) {
          try {
            data = JSON.parse(responseText);
          } catch {
            data = null;
          }
        }

        if (!response.ok) {
          const errorMessage =
            data?.error?.message ||
            response.headers.get("X-Cld-Error") ||
            `Uppladdningen misslyckades med status ${response.status}.`;

          throw new Error(errorMessage);
        }

        if (!data?.secure_url) {
          throw new Error(
            "Cloudinary svarade utan någon bildadress."
          );
        }

        uploadedImages.push(normalizeImage(data));

        setProgress(
          Math.round(((i + 1) / files.length) * 100)
        );
      }

      setImages((previousImages) => {
        const combinedImages = [
          ...uploadedImages.reverse(),
          ...previousImages,
        ];

        return Array.from(
          new Map(
            combinedImages.map((image) => [
              image.asset_id ||
                image.public_id ||
                image.secure_url,
              image,
            ])
          ).values()
        );
      });

      setUploadMessage(
        files.length === 1
          ? "Bilden har laddats upp!"
          : `${files.length} bilder har laddats upp!`
      );
    } catch (error) {
      console.error("Cloudinary upload error:", error);

      setUploadError(
        error.message || "Något gick fel vid uppladdningen."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bilder-container">
      <section className="bilder-card">
        <h1>📸 Våra bröllopsminnen</h1>

        <p>Dela gärna era bilder från dagen med oss.</p>

        <p>
          Alla uppladdade bilder visas direkt i galleriet.
        </p>

        <p>
          ❤️ Tack för att ni hjälper oss att bevara minnena ❤️
        </p>
      </section>

      <DropZone onUpload={uploadFiles} />

      {uploadMessage && !uploading && (
        <div className="upload-success" role="status">
          ✓ {uploadMessage}
        </div>
      )}

      {uploadError && !uploading && (
        <div className="upload-error" role="alert">
          Kunde inte ladda upp bilden: {uploadError}
        </div>
      )}

      {uploading && (
        <section className="bilder-card">
          <h2>Laddar upp bilder...</h2>

          <div
            className="progress"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress}
          >
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p>{progress}%</p>
        </section>
      )}

      {loadingGallery && (
        <section className="bilder-card">
          <p>Hämtar bilder...</p>
        </section>
      )}

      {galleryError && !loadingGallery && (
        <div className="upload-error" role="alert">
          {galleryError}
        </div>
      )}

      {!loadingGallery &&
        !galleryError &&
        images.length === 0 && (
          <section className="bilder-card">
            <h1>Galleri</h1>

            <p>
              Inga bilder har laddats upp ännu. Bli gärna den
              första!
            </p>
          </section>
        )}

      {images.length > 0 && (
        <section className="bilder-card">
          <h1>Galleri</h1>

          <div className="gallery-grid">
            {images.map((image, index) => (
              <img
                key={
                  image.asset_id ||
                  image.public_id ||
                  image.secure_url
                }
                src={image.secure_url}
                alt={`Uppladdat bröllopsfoto ${index + 1}`}
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}

      <Slideshow images={images} />
    </div>
  );
}