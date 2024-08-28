import React from "react";
import { YT_EMBEDDED } from "../config/apiEndpoints";

const YouTubeEmbed = ({ ytId }) => {
  return (
    <div>
      <iframe
        width="100%"
        height="550vh"
        src={`${YT_EMBEDDED}/${ytId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
