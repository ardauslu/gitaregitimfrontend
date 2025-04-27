import React, { useState } from "react";
import ReactPlayer from "react-player";
import Layout from "../components/Layout";
import "./Etudes.css"; // CSS dosyasını import ediyoruz

const etudesData = [
  {
    title: "Legato",
    videos: [
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
    ],
  },
  {
    title: "Sweep Picking",
    videos: [
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA",
      "https://youtu.be/eDuiPDOf8TA"
    ],
  },
  {
    title: "Economy Picking",
    videos: [
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
      "https://youtu.be/L2j7g85XYMo",
    ],
  },
  {
    title: "Hybrid Picking",
    videos: [
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",
      "https://youtu.be/fCC3Y0Q6dF4",

    ],
  },
  {
    title: "Tapping",
    videos: [
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
      "https://youtu.be/mhSHiucbZQA",
    ],
  },
];

const Etudes = () => {
  const [activeTab, setActiveTab] = useState(0); // Varsayılan olarak ilk sekme aktif

  return (
    <Layout>
      <h1 className="etudes-title">Etüdler</h1>
      <p className="etudes-description">Bu sayfa gitar etüdlerini içerir.</p>

      {/* Sekme Butonları */}
      <div className="etudes-tabs">
        {etudesData.map((etude, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {etude.title}
          </button>
        ))}
      </div>

      {/* Sekme İçeriği */}
      <div className="tab-content">
        {etudesData[activeTab].videos.map((videoUrl, videoIndex) => (
          <div key={videoIndex} className="video-container">
            <ReactPlayer
              url={videoUrl}
              controls
              width="100%"
              height="100%"
              className="react-player"
            />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Etudes;