"use client";

import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";

type coordinateXY = {
  x: number;
  y: number;
} | null;

type CurrentShapeProps = coordinateXY[];

type GameComponentProps = {
  width: number;
  height: number;
  distance: number;
  range: number;
};

const GameComponent = (props: GameComponentProps) => {
  const gameContainerRef = useRef(null);
  const { width, height, distance, range } = props;

  const pixelsPerDistance = height / distance;
  const pixelsPerRange = width / range;
  const center = width / 2;

  const [game, setGame] = useState<Phaser.Game | null>(null);

  let isDrawing = false;
  let currentShape: CurrentShapeProps = [];
  let currentGraphics: Phaser.GameObjects.Graphics; // Phaser에서 벡터 기반 도형을 그리기 위한 그래픽 객체
  let startPoint: coordinateXY;
  let lastPoint: coordinateXY;
  let drawnShapes: CurrentShapeProps[] = [];
  const ballSprites: Phaser.GameObjects.Image[] = []; // 스프라이트를 저장할 배열

  useEffect(() => {
    const ballList: any[] = [];
    const preload: Phaser.Types.Scenes.ScenePreloadCallback = function (
      this: Phaser.Scene
    ) {
      const scene = this;
      scene.load.image("successBall", "./whiteBall.png");
      scene.load.image("failBall", "./redBall.png");
      scene.load.image("yellowBall", "./yellowBall.png");
    };
    const randomPointList: any[] = [];
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
          const randomX = Phaser.Math.Between(-20, 20); // X축 최대 200
          const randomY = Phaser.Math.Between(0, 200);

          const realY = randomY * pixelsPerDistance;
          const realX = randomY * pixelsPerDistance;

          const randomPoint = {
            x: center + randomX * pixelsPerRange,
            y: 1080 - randomY * pixelsPerDistance,
          };

          randomPointList.push({
            x: randomPoint.x,
            y: randomPoint.y,
          });

          let isInsideAnyShape = false;
          drawnShapes.forEach((shape) => {
            if (isPointInShape(randomPoint, shape)) {
              isInsideAnyShape = true;
            }
          });

          const ball = {
            x: realX - center,
            y: realY,
            isInside: isInsideAnyShape,
          };

          ballSprites.forEach((sprite) => {
            sprite.destroy(); // 기존 스프라이트 제거
          });

          // 성공한 공들 중 가장 먼 공 찾기
          let furthestBall = null;
          let maxDistance = 0;

          ballList.push(ball);

          ballList.forEach((b) => {
            if (b.isInside) {
              const distance = b.y;
              if (distance > maxDistance) {
                maxDistance = distance;
                furthestBall = b;
              }
            }
          });

          // 공들을 다시 그리기
          ballList.forEach((b, index) => {
            let sprite;
            if (!b.isInside) {
              // 실패한 공 (빨간색)
              sprite = scene.add.image(
                randomPointList[index].x,
                randomPointList[index].y,
                "failBall"
              );
            } else if (b === furthestBall) {
              // 가장 먼 공 (노란색)
              sprite = scene.add.image(
                randomPointList[index].x,
                randomPointList[index].y,
                "yellowBall"
              );
            } else {
              // 성공한 공 (흰색)
              sprite = scene.add.image(
                randomPointList[index].x,
                randomPointList[index].y,
                "successBall"
              );
            }

            sprite.setDepth(3);
            sprite.setDisplaySize(32, 32);
            ballSprites.push(sprite); // 새로 그린 공을 배열에 저장
          });

          // 공 그리기
          if (!isInsideAnyShape) {
            const sprite = newGame.scene.scenes[0].add.image(
              randomPoint.x,
              randomPoint.y,
              "failBall" // 실패 공 이미지
            );
            sprite.setDepth(3);
            sprite.setDisplaySize(32, 32);
            ballSprites.push(sprite);
          } else {
            const sprite = newGame.scene.scenes[0].add.image(
              randomPoint.x,
              randomPoint.y,
              ball === furthestBall ? "yellowBall" : "successBall" // 가장 먼 공이면 노란색, 아니면 성공 공 이미지
            );
            sprite.setDepth(3);
            sprite.setDisplaySize(32, 32);
            ballSprites.push(sprite);
          }
        });
      }
    };

    const config = {
      type: Phaser.AUTO,
      width,
      height,
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
    console.log("addTilesFromShape");
    const polygonPoints = shape.map((point: any) => ({
      x: point?.x,
      y: point?.y,
    }));
    const polygon = new Phaser.Geom.Polygon(polygonPoints);

    polygonList.push(polygon);

    const graphics = scene.add.graphics();
    graphics.setDepth(2);
    // graphics.fillStyle(0x009900, 1);
    fillPolygonInteriorWithScanLine(scene, graphics, polygon);

    //graphics.fillPoints(polygon.points, true);
    // Phaser.Geom.Polygon.Close(polygon);
  };

  const isPointInShape = function (
    point: { x: number; y: number },
    shape: CurrentShapeProps
  ): boolean {
    let result = false;
    polygonList.forEach((polygon) => {
      console.log("hihihihhihihi???");
      if (Phaser.Geom.Polygon.Contains(polygon, point.x, point.y)) {
        result = true;
      }
    });

    return result;
  };

  const fillPolygonInteriorWithScanLine = function (
    scene: Phaser.Scene,
    graphics: Phaser.GameObjects.Graphics,
    polygon: Phaser.Geom.Polygon
  ) {
    const bounds = Phaser.Geom.Polygon.GetAABB(polygon);

    for (let y = bounds.y; y < bounds.bottom; y++) {
      let intersections: number[] = [];

      // 각 줄에서 다각형과 교차하는 점 찾기
      for (let i = 0; i < polygon.points.length; i++) {
        let p1 = polygon.points[i];
        let p2 = polygon.points[(i + 1) % polygon.points.length];

        if ((p1.y <= y && p2.y > y) || (p1.y > y && p2.y <= y)) {
          let intersectX = p1.x + ((y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y);
          intersections.push(intersectX);
        }
      }

      // 교차점 정렬
      intersections.sort((a, b) => a - b);

      // 교차점 쌍으로 내부 점을 채우기
      for (let i = 0; i < intersections.length; i += 2) {
        let xStart = Math.ceil(intersections[i]);
        let xEnd = Math.floor(intersections[i + 1]);
        graphics.fillStyle(0x009900, 1);
        graphics.fillRect(xStart, y, xEnd - xStart, 1);
      }
    }
  };

  const fillPolygonInterior = function (
    scene: Phaser.Scene,
    graphics: Phaser.GameObjects.Graphics,
    polygon: Phaser.Geom.Polygon
  ) {
    // 다각형의 바운딩 박스 구하기
    const bounds = Phaser.Geom.Polygon.GetAABB(polygon);
    console.log("boundsboundsbounds", bounds);
    // 바운딩 박스 내의 점을 순회하며, 다각형 내부에 있는지 검사
    for (let x = bounds.x; x < bounds.right; x++) {
      for (let y = bounds.y; y < bounds.bottom; y++) {
        // 해당 점이 다각형 내부에 있으면 점을 그린다
        console.log("hihihihi??~~~~~");
        if (Phaser.Geom.Polygon.Contains(polygon, x, y)) {
          graphics.fillStyle(0x009900, 1);
          graphics.fillPoint(x, y);
        }
      }
    }
  };

  return <div ref={gameContainerRef}></div>; // Phaser 게임이 렌더링될 DOM 요소
};

export default GameComponent;
