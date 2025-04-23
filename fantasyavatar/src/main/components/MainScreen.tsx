'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function MainScreen() {
  const phaserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 메인 씬 클래스 정의
    class MainScene extends Phaser.Scene {
      private soldier!: Phaser.GameObjects.Sprite;
      private background!: Phaser.GameObjects.TileSprite;
      constructor() {
        // 생성자에서 씬 이름 설정
        super('MainScene');
      }

      // 로드 씬 정의
      preload() {
        // 배경 불러오기
        this.load.image('tiles', 'assets/bg/nature.png');
        this.load.tilemapTiledJSON('map', 'assets/bg/river.json');
        this.load.image('background', 'assets/bg/nature.png');

        // 캐릭터 - Idle
        this.load.spritesheet('soldier-idle', '/assets/sprites/Soldier-Idle.png', {
          frameWidth: 100, // 디자인에 정해놓은 그리드 사이즈
          frameHeight: 100,
        });

        // 캐릭터 - Walk
        this.load.spritesheet('soldier-walk', '/assets/sprites/Soldier-Walk.png', {
          frameWidth: 100, // 디자인에 정해놓은 그리드 사이즈
          frameHeight: 100,
        });
      }

      // 생성 씬 정의
      create() {
        /**
         * 배경 생성하기
         */

        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('river', 'tiles')!;
        map.createLayer(0, tiles, 0, 0);
        // this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'tiles').setOrigin(0, 0);

        this.anims.create({
          key: 'idle',
          frames: this.anims.generateFrameNumbers('soldier-idle', { start: 0, end: 5 }),
          frameRate: 12, // 초당 12프레임
          repeat: -1, // 무한 반복
        });

        this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNumbers('soldier-walk', { start: 0, end: 7 }),
          frameRate: 12, // 초당 12프레임
          repeat: -1, // 무한 반복
        });

        this.soldier = this.add.sprite(50, 60, 'soldier-idle');
        this.soldier.play('idle');

        // 1초 뒤에 walk 애니메이션으로 변경 + 속도 증가
        this.time.delayedCall(1000, () => {
          this.soldier.play('walk');
        });
      }

      update() {
        // this.background.tilePositionX += 1;
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL, // 게임 타입 설정
      width: 10 * 16, // 게임 너비 설정
      height: 10 * 16, // 게임 높이 설정
      parent: phaserRef.current, // 게임 컨테이너 설정
      scene: MainScene, // 메인 씬 설정
      pixelArt: true, // 픽셀 아트 효과 활성화
      zoom: 2,
    };

    // 게임 인스턴스 생성
    const game = new Phaser.Game(config);

    return () => {
      // 컴포넌트가 언마운트될 때 게임 인스턴스 제거
      game.destroy(true);
    };
  }, []);

  return (
    <>
      <div ref={phaserRef} />
    </>
  );
}
