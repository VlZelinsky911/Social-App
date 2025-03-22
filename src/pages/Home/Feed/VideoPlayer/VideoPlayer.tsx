import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";
import "./VideoPlayer.scss";

const VideoPlayer: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && videoRef.current && !userPaused) {
          videoRef.current.play();
          setIsPlaying(true);
        } else if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [userPaused]); // Додаємо userPaused до залежностей

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setUserPaused(false); // Якщо відео грає, скидаємо userPaused
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setUserPaused(true); // Якщо поставили на паузу, зберігаємо це
      }
      setShowPlayIcon(true);
      setTimeout(() => setShowPlayIcon(false), 500);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted);
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  return (
    <div className="insta-video-container" ref={containerRef} onClick={togglePlay}>
      <video ref={videoRef} src={videoUrl} muted={isMuted} loop playsInline className="insta-video" />

      {showPlayIcon && (
        <div className="play-icon">
          <Play size={60} color="white" />
        </div>
      )}

      <button className="mute-button" onClick={(e) => { e.stopPropagation(); toggleMute(); }}>
        {isMuted ? <VolumeX size={24} color="#333" /> : <Volume2 size={24} color="#333" />}
      </button>
    </div>
  );
};

export default VideoPlayer;
