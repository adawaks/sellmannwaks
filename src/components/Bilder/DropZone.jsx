import React from "react";

export default function DropZone({ onUpload }) {

    const handleFiles = (files) => {

        if (!files.length) return;

        onUpload(Array.from(files));

    };

    return (

        <div className="bilder-card">

            <div
                className="drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {

                    e.preventDefault();

                    handleFiles(e.dataTransfer.files);

                }}
            >

                <div className="drop-icon">

                    📷

                </div>

                <h1>Dra bilder hit</h1>

                <p>eller</p>

                <label className="upload-button">

                    Välj bilder

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                            handleFiles(e.target.files)
                        }
                    />

                </label>

            </div>

        </div>

    );

}