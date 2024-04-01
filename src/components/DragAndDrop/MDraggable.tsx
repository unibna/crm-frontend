import React, { useEffect, useRef } from "react";
import { useSpring } from "@react-spring/web";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import { getStorage, setStorage } from "utils/asyncStorageUtil";

const useGesture = createUseGesture([dragAction, pinchAction]);

type MDraggableProps = {
  element: ({ ref, style }: { ref: React.ForwardedRef<unknown>; style: object }) => JSX.Element;
};

export default function MDraggable(props: MDraggableProps) {
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
  }));

  const ref = useRef<any>(null);

  useEffect(() => {
    try {
      const coordinateString = getStorage("coordinate-group-button");
      const coordinateObject = (coordinateString && JSON.parse(coordinateString)) || { x: 0, y: 0 };
      api.start({ x: coordinateObject.x || 0, y: coordinateObject.y || 0 });
    } catch (error) {}
  }, []);

  useGesture(
    {
      onDrag: (dragProps: any) => {
        api.start({ x: dragProps.offset[0], y: dragProps.offset[1] });
      },
      onDragEnd: (dragProps: any) => {
        setStorage(
          "coordinate-group-button",
          JSON.stringify({
            x: dragProps.offset[0],
            y: dragProps.offset[1],
          })
        );
      },
    },
    {
      target: ref,
      drag: {
        from: () => [style.x.get(), style.y.get()],
        bounds: {
          left: -window.innerWidth + 128,
          right: 34,
          top: -window.innerHeight + 218,
          bottom: 50,
        },
      },
    }
  );

  return <>{props.element({ ref, style })}</>;
}
