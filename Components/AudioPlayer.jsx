import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const AudioPlayer = ({ voiceUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <audio ref={audioRef} src={voiceUrl} />
      <button
        onClick={togglePlayPause}
        className="p-2 bg-black text-white rounded-full"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      {isPlaying ? "Pause" : "Play"}
    </div>
  );
};

export default AudioPlayer;
