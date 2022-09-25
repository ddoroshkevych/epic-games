import React, { useEffect, useRef } from "react";
import { Snake } from "../games/SnakeTypes";

const SnakeGame = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if(ref.current){
      const context = ref.current.getContext("2d");
      if(context){
        const snake = new Snake(context);
        snake.start();
      }
    }
  }, [ref]);

  return (
    <div>
      <h2>Snake game</h2>
      <canvas ref={ref} width={400} height={400} />
    </div>
  );
}
export default SnakeGame;
