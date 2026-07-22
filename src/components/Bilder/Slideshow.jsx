import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export default function Slideshow({ images }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPresenterMode, setIsPresenterMode] =
    useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartPosition = useRef(null);
  const touchHasMoved = useRef(false);

  const showNextImage = useCallback(() => {
    if (!images || images.length === 0) {
      return;
    }

    setCurrentIndex((previousIndex) =>
      previousIndex === images.length - 1
        ? 0
        : previousIndex + 1
    );
  }, [images]);

  const showPreviousImage = useCallback(() => {
    if (!images || images.length === 0) {
      return;
    }

    setCurrentIndex((previousIndex) =>
      previousIndex === 0
        ? images.length - 1
        : previousIndex - 1
    );
  }, [images]);

  const closePresenterMode = useCallback(async () => {
    setIsPresenterMode(false);
    setIsPlaying(false);

    document.body.classList.remove("presenter-mode");

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn(
        "Kunde inte avsluta presentationsläget:",
        error
      );
    }
  }, []);

  const openPresenterMode = async () => {
    setCurrentIndex(0);
    setIsPlaying(true);
    setIsPresenterMode(true);

    document.body.classList.add("presenter-mode");

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.warn(
        "Kunde inte öppna presentationsläget i helskärm:",
        error
      );
    }
  };

  const handlePresenterClick = (event) => {
    if (touchHasMoved.current) {
      touchHasMoved.current = false;
      return;
    }

    event.stopPropagation();
    showNextImage();
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];

    touchStartPosition.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    touchHasMoved.current = false;
  };

  const handleTouchMove = (event) => {
    if (!touchStartPosition.current) {
      return;
    }

    const touch = event.touches[0];

    const distanceX = Math.abs(
      touch.clientX - touchStartPosition.current.x
    );

    const distanceY = Math.abs(
      touch.clientY - touchStartPosition.current.y
    );

    if (distanceX > 10 || distanceY > 10) {
      touchHasMoved.current = true;
    }
  };

  const handleTouchEnd = async (event) => {
    if (!touchStartPosition.current) {
      return;
    }

    const touch = event.changedTouches[0];

    const distanceX =
      touch.clientX - touchStartPosition.current.x;

    const distanceY =
      touch.clientY - touchStartPosition.current.y;

    const swipeDistance = Math.sqrt(
      distanceX * distanceX + distanceY * distanceY
    );

    touchStartPosition.current = null;

    if (swipeDistance >= 60) {
      touchHasMoved.current = true;
      await closePresenterMode();
      return;
    }

    touchHasMoved.current = false;
  };

  useEffect(() => {
    if (!isPlaying || images.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      showNextImage();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPlaying, images.length, showNextImage]);

  useEffect(() => {
    if (!isPresenterMode) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePresenterMode();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === " ") {
        event.preventDefault();

        setIsPlaying((previousValue) => !previousValue);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isPresenterMode,
    closePresenterMode,
    showNextImage,
    showPreviousImage,
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        isPresenterMode
      ) {
        setIsPresenterMode(false);
        setIsPlaying(false);

        document.body.classList.remove(
          "presenter-mode"
        );
      }
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, [isPresenterMode]);

  useEffect(() => {
    if (
      images.length > 0 &&
      currentIndex > images.length - 1
    ) {
      setCurrentIndex(0);
    }
  }, [currentIndex, images.length]);

  useEffect(() => {
    return () => {
      document.body.classList.remove(
        "presenter-mode"
      );

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  if (!currentImage) {
    return null;
  }

  const imageKey =
    currentImage.asset_id ||
    currentImage.public_id ||
    currentImage.secure_url;

  return (
    <>
      <section className="bilder-card slideshow-card">
        <h2 className="slideshow-title">Bildspel</h2>

        <div className="slideshow-preview">
          <img
            key={imageKey}
            src={currentImage.secure_url}
            alt={`Bröllopsbild ${currentIndex + 1}`}
          />
        </div>

        <p className="slideshow-counter">
          Bild {currentIndex + 1} av {images.length}
        </p>

        <div className="slideshow-controls">
          <button
            type="button"
            className="slideshow-button secondary-button"
            onClick={showPreviousImage}
          >
            Föregående
          </button>

          {isPlaying ? (
            <button
              type="button"
              className="slideshow-button"
              onClick={() => setIsPlaying(false)}
            >
              Pausa bildspel
            </button>
          ) : (
            <button
              type="button"
              className="slideshow-button"
              onClick={() => setIsPlaying(true)}
            >
              Starta bildspel
            </button>
          )}

          <button
            type="button"
            className="slideshow-button secondary-button"
            onClick={showNextImage}
          >
            Nästa
          </button>
        </div>

        <button
          type="button"
          className="presenter-button"
          onClick={openPresenterMode}
        >
          Presentationsläge
        </button>
      </section>

      {isPresenterMode && (
        <div
          className="presenter-overlay"
          onClick={handlePresenterClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-label="Tryck för nästa bild eller svep för att avsluta"
        >
          <img
            key={imageKey}
            className="presenter-image"
            src={currentImage.secure_url}
            alt={`Bröllopsbild ${currentIndex + 1}`}
            draggable="false"
          />

          <p className="presenter-help">
            Tryck för nästa bild · Svep för att avsluta
          </p>
        </div>
      )}
    </>
  );
}