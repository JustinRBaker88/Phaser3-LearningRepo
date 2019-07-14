import "phaser";
import { CanvasTile } from '../gameobjects/tile';
import { CameraUtil } from '../util/cameraUtil';
import { CameraDragController } from '../controllerobjects/cameraDragController';
import { CameraZoomController } from '../controllerobjects/cameraZoomController';

export class Canvas extends Phaser.Scene {

  canvasGroup: Array<Array<CanvasTile>>;
  mCamera: Phaser.Cameras.Scene2D.Camera;

  cameraDragController : CameraDragController;
  cameraZoomController : CameraZoomController;

  readonly CANVASWIDTH: number = 100;
  readonly CANVASHEIGHT: number = 100;


  constructor() {
    super({
      key: "Canvas"
    });
  }

  init(startData : Object): void {
    this.scene.launch("CanvasUI");
  }


  preload(): void {
  }

  create(startData: Object ): void {
    
    
    this.initCamera();
    this.initCanvas();
    this.initEvents();

    this.cameraDragController = new CameraDragController(this.mCamera, this);
    this.cameraZoomController = new CameraZoomController(this.mCamera, this);
  }

  update(time: number, delta: number): void {
    this.cameraDragController.update(delta);
  }

  private initCanvas() {
    this.canvasGroup = new Array<Array<CanvasTile>>();

    for (let i = 1; i <= this.CANVASWIDTH; i++) {
      let row: Array<CanvasTile>  = new Array<CanvasTile>();
      for (let j = 1; j <= this.CANVASHEIGHT; j++) {
        let tile = new CanvasTile(this, i, j);
        this.add.existing(tile);
        tile.randomizeColor();
        row.push(tile);
      }
      this.canvasGroup.push(row);
    }
  }

  private initEvents() : void {
    this.input.on(Phaser.Input.Events.POINTER_DOWN, this.pointerDownHandler, this);
  }

  private initCamera() : void {
    this.mCamera = this.cameras.main;

    CameraUtil.setCameraWidth(this.mCamera,this.CANVASWIDTH);
    this.mCamera.centerOn(0,0);
  }

  private pointerDownHandler(pointer : Phaser.Input.Pointer) {
    if (pointer.primaryDown) {

      let coordinates : Phaser.Math.Vector2 = new Phaser.Math.Vector2(); 
      pointer.positionToCamera(this.mCamera, coordinates);
      const x: number = Math.floor(pointer.worldX);
      const y: number = Math.floor(pointer.worldY);

      if (x < this.CANVASWIDTH && y < this.CANVASHEIGHT && x >= 0 && y >= 0) {
        let tile = this.canvasGroup[x][y] as CanvasTile;
        if (tile != null) {
          tile.randomizeColor();
        }
      }
    }
  }
};
