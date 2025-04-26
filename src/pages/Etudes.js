import React, { useState } from "react";
import ReactPlayer from "react-player";
import Layout from "../components/Layout";
import './Etudes.css';  // CSS dosyasını import ediyoruz

const etudesData = [
  {
    title: "Legato",
    videos: [
      "https://www.youtube.com/watch?v=ivFnSNZeWMY",
      "https://www.youtube.com/watch?v=xyz1234",
      // 10 video ekleyin
    ],
  },
  {
    title: "Sweep Picking",
    videos: [
      "https://www.youtube.com/watch?v=abc5678",
      "https://www.youtube.com/watch?v=def91011",
      // 10 video ekleyin
    ],
  },
  {
    title: "Economy Picking",
    videos: [
      "https://www.youtube.com/watch?v=ghi12345",
      "https://www.youtube.com/watch?v=jkl67890",
      // 10 video ekleyin
    ],
  },
  {
    title: "Hybric Picking",
    videos: [
      "https://www.youtube.com/watch?v=mno12345",
      "https://www.youtube.com/watch?v=pqr67890",
      // 10 video ekleyin
    ],
  },
  {
    title: "Tapping",
    videos: [
      "https://www.youtube.com/watch?v=stu12345",
      "https://www.youtube.com/watch?v=vwx67890",
      // 10 video ekleyin
    ],
  },
];

const Etudes = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Layout>
      <h1 className="etudes-title">Etüdler</h1>
      <p className="etudes-description">Bu sayfa gitar etüdlerini içerir.</p>

      {etudesData.map((etude, index) => (
        <div key={index} className="etude-container">
          <div
            onClick={() => toggleAccordion(index)}
            className="etude-title"
          >
            {etude.title}
          </div>
          {activeIndex === index && (
            <div className="etude-videos">
              {etude.videos.map((videoUrl, videoIndex) => (
                <div
                  key={videoIndex}
                  className="video-container"
                >
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
          )}
        </div>
      ))}
    </Layout>
  );
};

export default Etudes;
