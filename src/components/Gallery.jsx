import React, { useState } from "react";
import "../css/gallery.css";
import LightboxGallery from './LightboxGallery';

const IMAGES = Array.from({ length: 10 }, (_, i) => ({
  src: `https://picsum.photos/seed/gal-${i + 1}/1200/1200`, // bigger for lightbox
  thumb: `https://picsum.photos/seed/gal-${i + 1}/400/400`, // small grid preview
  caption: `Photo ${i + 1}`,
}));

export default function Gallery() {
  const [active, setActive] = useState(null); // holds clicked image

  return (
    <div className="gallery-page">
      <div className="gallery-container">
        <h1 className="gallery-title">📂 Gallery</h1>

        <ul className="gallery-grid">
          {IMAGES.map((img, i) => (
            <li
              key={i}
              className={`card ${i < 5 ? "card--circle" : "card--rounded"}`}
              title={img.caption}
              onClick={() => setActive(img)}
            >
              <img src={img.thumb} alt={img.caption} loading="lazy" />
              <div className="card-caption">{img.caption}</div>
            </li>
          ))}
        </ul>
      </div>

      <LightboxGallery slides={IMAGES.map(i => ({ src: i.src, alt: i.caption }))} />
    </div>
  );
}
