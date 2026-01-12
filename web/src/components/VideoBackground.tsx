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
    // identycznie jak Splash – oba wideo startują od razu
    lightRef.current?.play().catch(() => {});
    darkRef.current?.play().catch(() => {});
  }, []);

  return (
    <>
      {/* LIGHT VIDEO – zawsze w DOM */}
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

      {/* DARK VIDEO – zawsze w DOM */}
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
