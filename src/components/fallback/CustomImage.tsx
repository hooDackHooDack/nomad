import React, { useState } from 'react';
import Image from 'next/image';

const CustomImage = ({ src, fallbackSrc = '/logo/logo_col.svg', ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
      alt="image"
    />
  );
};

export default CustomImage;
