"use client";

import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";

type coordinateXY = {
  x: number;
  y: number;
} | null;

type CurrentShapeProps = coordinateXY[];

const GameComponent = () => {
  const gameContainerRef = useRef(null);
  const [game, setGame] = useState<Phaser.Game | null>(null);

  let isDrawing = false;
  let currentShape: CurrentShapeProps = [];
  let currentGraphics: Phaser.GameObjects.Graphics; // Phaser에서 벡터 기반 도형을 그리기 위한 그래픽 객체
  let startPoint: coordinateXY;
  let lastPoint: coordinateXY;
  let drawnShapes: CurrentShapeProps[] = [];

  useEffect(() => {
    const preload: Phaser.Types.Scenes.ScenePreloadCallback = function (
      this: Phaser.Scene
    ) {
      const scene = this;
      scene.load.image("successBall", "./whiteBall.png");
      scene.load.image("failBall", "./redBall.png");
    };

    const update = function () {};

    const create: Phaser.Types.Scenes.ScenePreloadCallback = function (
      this: Phaser.Scene
    ) {
      const scene = this;
      const canvas = scene.game.canvas;

      scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        isDrawing = true;
        lastPoint = { x: pointer.x, y: pointer.y };

        currentGraphics = scene.add.graphics();
        currentGraphics.setDepth(1);

        if (!startPoint) {
          currentGraphics.moveTo(lastPoint.x, lastPoint.y);
        }

        startPoint = { x: pointer.x, y: pointer.y };
        currentShape.push({ x: startPoint.x, y: startPoint.y });
        currentGraphics.lineStyle(4, 0x009900, 1);
      });

      scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
        if (isDrawing) {
          currentGraphics.lineTo(pointer.x, pointer.y);
          lastPoint = { x: pointer.x, y: pointer.y };
          currentGraphics.strokePath();
          currentShape.push({ x: pointer.x, y: pointer.y });
        }
      });

      scene.input.on("pointerup", () => {
        handlePointerUp(scene);
      });

      canvas.addEventListener("mouseleave", () => {
        if (isDrawing) {
          handlePointerUp(scene);
        }
      });

      if (scene.input.keyboard) {
        const key9 = scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.NINE
        );

        key9.on("down", () => {
          console.log("newGame", newGame);
          const randomX = Phaser.Math.Between(0, Number(newGame.config.width));
          const randomY = Phaser.Math.Between(0, Number(newGame.config.height));
          const randomPoint = { x: randomX, y: randomY };

          console.log(`랜덤 좌표: (${randomPoint.x}, ${randomPoint.y})`);

          let isInsideAnyShape = false;
          drawnShapes.forEach((shape) => {
            if (isPointInShape(randomPoint, shape)) {
              isInsideAnyShape = true;
            }
          });

          if (!isInsideAnyShape) {
            const sprite = newGame.scene.scenes[0].add.image(
              randomPoint.x,
              randomPoint.y,
              "failBall" // successBall 이미지를 사용
            );

            sprite.setDepth(3);
            sprite.setDisplaySize(32, 32); // 원래 원의 크기와 비슷하게 이미지 크기를 조정

            // const circle = newGame.scene.scenes[0].add.circle(
            //   randomPoint.x,
            //   randomPoint.y,
            //   4,
            //   0xff0000
            // );
            // circle.setDepth(3);
          } else {
            // const circle = newGame.scene.scenes[0].add.circle(
            //   randomPoint.x,
            //   randomPoint.y,
            //   4,
            //   0xffff00
            // );
            const sprite = newGame.scene.scenes[0].add.image(
              randomPoint.x,
              randomPoint.y,
              "successBall" // successBall 이미지를 사용
            );
            sprite.setDepth(3);

            sprite.setDisplaySize(32, 32);
            // circle.setDepth(3);
          }
        });
      }
    };

    const config = {
      type: Phaser.AUTO,
      width: 1920,
      height: 1080,
      parent: gameContainerRef.current, // React ref를 Phaser가 렌더링할 DOM 요소로 설정
      scene: {
        preload,
        create,
        update,
      },
    };

    const newGame = new Phaser.Game(config);
    setGame(newGame);

    return () => {
      if (newGame) {
        newGame.destroy(true); // 컴포넌트가 언마운트되면 게임도 해제
      }
    };
  }, []);

  const handlePointerUp = function (scene: Phaser.Scene) {
    isDrawing = false;

    if (lastPoint && startPoint) {
      currentGraphics.lineTo(lastPoint.x, lastPoint.y);
      currentGraphics.strokePath();
      currentGraphics.lineTo(startPoint.x, startPoint.y);
      currentGraphics.strokePath();
      // currentGraphics.fillStyle(0x009900, 1);
      // currentGraphics.fillPath();
      //   currentGraphics.clear();
      addTilesFromShape(scene, currentShape);
      drawnShapes.push([...currentShape]);
      currentShape = [];
      startPoint = null;
      lastPoint = null;
    }
  };

  const polygonList: Phaser.Geom.Polygon[] = [];

  type PolygonCoordinate = {
    x: number;
    y: number;
  };

  const addTilesFromShape = function (
    scene: Phaser.Scene,
    shape: CurrentShapeProps
  ) {
    const polygonPoints = shape.map((point: any) => ({
      x: point?.x,
      y: point?.y,
    }));
    const polygon = new Phaser.Geom.Polygon(polygonPoints);

    polygonList.push(polygon);

    const graphics = scene.add.graphics();
    graphics.setDepth(2);
    // graphics.fillStyle(0x009900, 1);
    fillPolygonInterior(scene, graphics, polygon);

    //graphics.fillPoints(polygon.points, true);
    // Phaser.Geom.Polygon.Close(polygon);
  };

  const isPointInShape = function (
    point: { x: number; y: number },
    shape: CurrentShapeProps
  ): boolean {
    let result = false;
    polygonList.forEach((polygon) => {
      if (Phaser.Geom.Polygon.Contains(polygon, point.x, point.y)) {
        result = true;
      }
    });

    return result;
  };

  const fillPolygonInterior = function (
    scene: Phaser.Scene,
    graphics: Phaser.GameObjects.Graphics,
    polygon: Phaser.Geom.Polygon
  ) {
    // 다각형의 바운딩 박스 구하기
    const bounds = Phaser.Geom.Polygon.GetAABB(polygon);

    // 바운딩 박스 내의 점을 순회하며, 다각형 내부에 있는지 검사
    for (let x = bounds.x; x < bounds.right; x++) {
      for (let y = bounds.y; y < bounds.bottom; y++) {
        // 해당 점이 다각형 내부에 있으면 점을 그린다
        if (Phaser.Geom.Polygon.Contains(polygon, x, y)) {
          graphics.fillStyle(0x009900, 1);
          graphics.fillPoint(x, y);
        }
      }
    }
  };

  return <div ref={gameContainerRef} className="w-[480px] h-[480px]"></div>; // Phaser 게임이 렌더링될 DOM 요소
};

export default GameComponent;
