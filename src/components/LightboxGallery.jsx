import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function LightboxGallery({ slides }) {
  const [index, setIndex] = useState(-1);
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {slides.map((s, i) => (
          <img key={i} src={s.src} alt={s.alt || ''} style={{ width: 120, cursor: 'pointer' }} onClick={() => setIndex(i)} />
        ))}
      </div>
      <Lightbox open={index >= 0} index={index} close={() => setIndex(-1)} slides={slides} />
    </div>
  );
}

LightboxGallery.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      width: PropTypes.number,
      height: PropTypes.number,
    })
  ).isRequired,
};
