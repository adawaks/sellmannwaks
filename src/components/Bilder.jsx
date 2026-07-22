import React, { useState, useEffect } from "react";

export default function Bilder() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fade, setFade] = useState(true);


  const handleUpload = (event) => {
    const files = Array.from(event.target.files);

    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    event.target.value = "";
  };


  // Slideshow timer
  useEffect(() => {

    if (!playing || images.length < 2) return;

    const timer = setInterval(() => {

      setFade(false);

      setTimeout(() => {

        setCurrentIndex(
          (prev) => (prev + 1) % images.length
        );

        setFade(true);

      }, 400);

    }, 3000);


    return () => clearInterval(timer);

  }, [playing, images]);


  // Exit presenter mode with ESC
  useEffect(() => {

    const handleKeyDown = (event) => {

      if (event.key === "Escape") {
        exitFullscreen();
      }

    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, []);



  // Cleanup memory URLs
  useEffect(() => {

    return () => {

      images.forEach((img) =>
        URL.revokeObjectURL(img.url)
      );

    };

  }, [images]);



  const startFullscreen = () => {
    setFullscreen(true);
    setPlaying(true);
  };


  const exitFullscreen = () => {
    setFullscreen(false);
    setPlaying(false);
  };



  const removeImage = (id) => {

    const img = images.find(
      (image) => image.id === id
    );

    if (img) {
      URL.revokeObjectURL(img.url);
    }


    const updated = images.filter(
      (image) => image.id !== id
    );


    setImages(updated);


    if (updated.length === 0) {

      setCurrentIndex(0);
      setPlaying(false);

    }
    else if (currentIndex >= updated.length) {

      setCurrentIndex(updated.length - 1);

    }

  };



  const clearImages = () => {

    images.forEach((img) =>
      URL.revokeObjectURL(img.url)
    );

    setImages([]);
    setCurrentIndex(0);
    setPlaying(false);

  };



  return (

    <div style={{ padding: 20 }}>


      <h2>Bilder</h2>


      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
      />



      {images.length > 0 && (

        <>

          {/* Main image */}
          <div
            style={{
              marginTop: 20,
              textAlign: "center",
            }}
          >

            <img
              src={images[currentIndex].url}
              alt=""
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                borderRadius: 10,
                boxShadow:
                  "0 0 10px rgba(0,0,0,.3)",
              }}
            />

          </div>



          {/* Controls */}

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >

            <button
              onClick={() =>
                setCurrentIndex(
                  (currentIndex - 1 + images.length)
                  % images.length
                )
              }
            >
              ◀ Previous
            </button>


            <button
              onClick={() =>
                setPlaying(!playing)
              }
            >
              {playing ? "Pause" : "Play"}
            </button>


            <button
              onClick={startFullscreen}
            >
              Play fullscreen
            </button>


            <button
              onClick={() =>
                setCurrentIndex(
                  (currentIndex + 1)
                  % images.length
                )
              }
            >
              Next ▶
            </button>


            <button
              onClick={clearImages}
            >
              Clear All
            </button>


          </div>



          {/* Thumbnails */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 30,
            }}
          >

            {images.map((image, index) => (

              <div
                key={image.id}
                style={{
                  textAlign: "center",
                }}
              >

                <img
                  src={image.url}
                  alt=""
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                  style={{
                    width: 120,
                    height: 80,
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      index === currentIndex
                        ? "3px solid #D4E2D0"
                        : "1px solid gray",
                    borderRadius: 5,
                  }}
                />


                <br />


                <button
                  onClick={() =>
                    removeImage(image.id)
                  }
                >
                  Delete
                </button>


              </div>

            ))}

          </div>

        </>

      )}



      {/* Presenter mode */}

      {fullscreen && images.length > 0 && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "black",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={exitFullscreen}
        >

          <img
            src={images[currentIndex].url}
            alt=""
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "contain",
              opacity: fade ? 1 : 0,
              transition:
                "opacity 0.4s ease",
            }}
          />

        </div>

      )}


    </div>

  );
}