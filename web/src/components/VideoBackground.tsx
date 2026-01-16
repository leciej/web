import { useEffect, useRef } from "react";
import videoDark from "../assets/loop.mp4";
import videoLight from "../assets/loop4k_2.mp4";

export function VideoBackground({
  theme,
}: {
  theme: "light" | "dark";
}) {
  const lightRef = useRef<HTMLVideoElement>(null);
  const darkRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    lightRef.current?.play().catch(() => {});
    darkRef.current?.play().catch(() => {});
  }, []);

  return (
    <>
      <video
        ref={lightRef}
        className={`login-video ${
          theme === "light" ? "" : "hidden"
        }`}
        muted
        loop
        playsInline
      >
        <source src={videoLight} type="video/mp4" />
      </video>

      <video
        ref={darkRef}
        className={`login-video ${
          theme === "dark" ? "" : "hidden"
        }`}
        muted
        loop
        playsInline
      >
        <source src={videoDark} type="video/mp4" />
      </video>
    </>
  );
}