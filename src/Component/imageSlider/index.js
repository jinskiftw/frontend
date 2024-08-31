import React, { useState } from "react";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import baseUrl, { backendUrl } from "../../utils/baseUrl";
import config from "../../config";
const navButtonStyle = {
  position: "absolute",
  top: "40%",
  fontSize: "20px",
  fontWeight: "bold",
  backgroundColor: "transparent",
  color: "#E4E4E4",
  border: "none",
  cursor: "pointer",
};

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <div
      style={{
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={`${config.BACKEND_URL}/uploads/cars/${images[currentIndex]?.image}`}
        alt={`Slide ${currentIndex}`}
        style={{ width: "100%" }}
      />
      <ArrowBackIosNewIcon
        className="LImgLArrow"
        onClick={goToPrev}
        style={navButtonStyle}
      />
      <ArrowForwardIosIcon
        className="LImgRArrow"
        onClick={goToNext}
        style={navButtonStyle}
      />
    </div>
  );
};

export default ImageSlider;
