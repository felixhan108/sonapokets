'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function MainScreen() {
  const phaserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 메인 씬 클래스 정의
    class MainScene extends Phaser.Scene {
      soldier!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

      constructor() {
        // 생성자에서 씬 이름 설정
        super('MainScene');
      }

      // 로드 씬 정의
      preload() {
        // 캐릭터 이미지 로드
        this.load.spritesheet('soldier-idle', '/assets/sprites/Soldier-Idle.png', {
          frameWidth: 100, // 디자인에 정해놓은 그리드 사이즈
          frameHeight: 100,
        });

        this.load.spritesheet('soldier-walk', '/assets/sprites/Soldier-Walk.png', {
          frameWidth: 100, // 디자인에 정해놓은 그리드 사이즈
          frameHeight: 100,
        });
      }

      // 생성 씬 정의
      create() {
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

        // 물리 시스템으로 캐릭터 생성
        this.soldier = this.physics.add.sprite(100, 150, 'soldier-idle');
        this.soldier.setScale(2);
        this.soldier.play('idle');

        // 1초 뒤에 run 애니메이션으로 변경 + 속도 증가
        this.time.delayedCall(1000, () => {
          this.soldier.play('walk');
        });
      }

      update() {}
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO, // 게임 타입 설정
      width: 400, // 게임 너비 설정
      height: 300, // 게임 높이 설정
      parent: phaserRef.current, // 게임 컨테이너 설정
      scene: MainScene, // 메인 씬 설정
      pixelArt: true, // 픽셀 아트 효과 활성화
      physics: {
        default: 'arcade', // 물리 엔진 설정
        arcade: {
          gravity: { x: 0, y: 0 }, // 중력 설정
        },
      },
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
