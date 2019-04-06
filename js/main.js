import THREE from './libs/three/index'

import {
  Zlib
} from "./libs/three/js/libs/inflate.min"
window.Zlib = Zlib
require('./libs/three/js/controls/OrbitControls')

export default class Main {
  constructor() {
    this.init();
    this.createCube();
    this.createGround();
    this.createLight();
    this.createTarget();
    this.createGroup()
    this.createRaycaster()
    this.createHud();
    this.HudEvent();
    // this.setControls()

    console.log(this.renderer)
  }
  // 初始化场景
  init() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(0, 7, 7);
    this.camera.rotation.set(-0.5, 0, 0)

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);

    // webGL渲染器
    // 同时指定canvas为小游戏暴露出来的canvas

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMapEnabled = true;
    window.requestAnimationFrame(this.loop.bind(this), canvas);
  }
  setControls() {
    this.controls = new THREE.OrbitControls(this.camera)
    this.controls.target.set(this.group.position.x, this.group.position.y + 1, this.group.position.z)
    this.controls.update();
  }
  createLight() {
    this.hemLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    this.scene.add(this.hemLight);
    this.pointLight = new THREE.PointLight(0xffffff, 0.3);
    this.pointLight.position.set(0, 6, 1)
    this.pointLightHelper = new THREE.PointLightHelper(this.pointLight);

    this.pointLight.castShadow = true;
    this.pointLight.shadow.mapSize.width = 1024;
    this.pointLight.shadow.mapSize.height = 1024;
    this.pointLight.shadow.camera.left = -100;
    this.pointLight.shadow.camera.right = 100;
    this.pointLight.shadow.camera.bottom = -1000;
    this.pointLight.shadow.camera.top = 1000;

    this.scene.add(this.pointLightHelper);
    this.scene.add(this.pointLight)
  }
  createCube() {
    let boxGeo = new THREE.BoxGeometry(2, 2, 2);
    let greenLambertMat = new THREE.MeshLambertMaterial({
      color: 0x00ff00
    });
    this.cube = new THREE.Mesh(boxGeo, greenLambertMat);
    this.cube.position.set(0, 0, 0);
    this.cube.castShadow = true;
    // this.scene.add(this.cube);

    let blueLambertMat = new THREE.MeshPhongMaterial({
      color: 0x0000ff
    });
    let wallGeo = new THREE.PlaneBufferGeometry(20, 10);
    this.wall = new THREE.Mesh(wallGeo, blueLambertMat);
    this.wall2 = new THREE.Mesh(wallGeo, blueLambertMat);
    this.wall3 = new THREE.Mesh(wallGeo, blueLambertMat);
    this.wall2.rotation.set(0, -1.6, 0)
    this.wall3.rotation.set(0, 1.6, 0)
    this.wall.position.set(0, 4, -15)
    this.wall2.position.set(8, 4, -5);
    this.wall3.position.set(-8, 4, -5);
    this.wall.castShadow = true;
    this.wall2.castShadow = true;
    this.wall3.castShadow = true;
    this.wallGroup = new THREE.Group();
    this.wallGroup.add(this.wall)
    this.wallGroup.add(this.wall2)
    this.wallGroup.add(this.wall3)
    this.scene.add(this.wallGroup);
    // this.scene.add(this.wall);
    // this.scene.add(this.wall2);
    // this.scene.add(this.wall3);

    let redLambertMat = new THREE.MeshPhongMaterial({
      color: 0xff0000
    })
    let lampGeo = new THREE.SphereGeometry(0.5, 32, 32)
    this.lamp = new THREE.Mesh(lampGeo, redLambertMat);
    this.lamp.position.set(0, 1.2, 0);
    // this.scene.add(this.lamp);
  }
  createGround() {
    let groundGeo = new THREE.PlaneBufferGeometry(50, 50);
    let groundMat = new THREE.MeshPhongMaterial();
    groundMat.color = {
      r: 0,
      g: 1,
      b: 0
    }
    groundMat.emissive = {
      r: 1,
      g: 0,
      b: 0
    }
    this.ground = new THREE.Mesh(groundGeo, groundMat);
    this.ground.rotation.x = -0.5 * Math.PI;
    this.ground.position.y = -1;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
  }
  createTarget() {
    let spotGeo = new THREE.BoxGeometry(1, 1, 1);
    let spotMat = new THREE.MeshBasicMaterial();
    spotMat.visible = false;
    this.spotTarget = new THREE.Mesh(spotGeo, spotMat);
    this.spotTarget.position.set(0, 2, -5)
    // this.scene.add(this.spotTarget);
  }
  createGroup() {
    this.spotLight = new THREE.SpotLight('#F0E68C', 0.5);
    this.spotLight.penumbra = 0.1;
    this.spotLight.position.set(0, 1.2, 0)
    this.spotLight.angle = -0.4
    this.spotLight.target = this.spotTarget
    this.spotLight.castShadow = true;

    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;

    this.spotLight.shadow.camera.left = -100;
    this.spotLight.shadow.camera.right = 100;
    this.spotLight.shadow.camera.top = 100;
    this.spotLight.shadow.camera.bottom = -100;
    this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    // this.scene.add(this.spotLight);
    this.spotLightHelper.update();
    // this.scene.add(this.spotLightHelper);

    this.group = new THREE.Group();
    this.group.add(this.lamp);
    this.group.add(this.spotLight);
    // this.group.add(this.spotLightHelper);
    this.group.add(this.spotTarget);
    this.group.add(this.cube);

    this.scene.add(this.group);
  }
  createRaycaster() {
    let directionUp = new THREE.Vector3(0, 0, -1);
    let directionLeft = new THREE.Vector3(-1, 0, 0);
    let directionRight = new THREE.Vector3(1, 0, 0);
    this.raycasterUp = new THREE.Raycaster(this.group.position, directionUp, 0.1, 1.0);
    this.raycasterLeft = new THREE.Raycaster(this.group.position, directionLeft, 0.1, 1.0);
    this.raycasterRight = new THREE.Raycaster(this.group.position, directionRight, 0.1, 1.0);
  }
  createHud() {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    // HUD离屏渲染
    // HUD场景
    this.hudScene = new THREE.Scene();
    // HUD相机
    this.hudCamera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0, 1000);
    this.hudCamera.updateProjectionMatrix();
    this.hudCamera.lookAt(new THREE.Vector3(0, 0, 0));
    this.hubCanvas = wx.createCanvas()
    this.context = this.hubCanvas.getContext('2d');

    var imgArray = []

    function loadImg(src) {
      return new Promise(function (res, rej) {
        let img = new Image();
        img.src = src;
        img.onload = () => {
          imgArray.push(img);
          res(img)
        }
        img.onerror = () => {
          rej()
        }
      })
    }

    // 保证了顺序
    loadImg('images/up.png').then(() => {
      return loadImg('images/down.png')
    }).then(() => {
      return loadImg('images/left.png')
    }).then(() => {
      return loadImg('images/right.png')
    }).then(() => {
      this.buttonSize = screenHeight * 0.1;

      this.upButtonX = screenWidth * 0.12;
      this.upButtonY = screenHeight * 0.68;
      this.downButtonY = screenHeight * 0.82;
      this.leftButtonX = screenWidth * 0.06;
      this.rightButtonX = screenWidth * 0.18;
      this.leftButtonY = screenHeight * 0.75;
      this.context.drawImage(imgArray[0], this.upButtonX, this.upButtonY, this.buttonSize, this.buttonSize)
      this.context.drawImage(imgArray[1], this.upButtonX, this.downButtonY, this.buttonSize, this.buttonSize)
      this.context.drawImage(imgArray[2], this.leftButtonX, this.leftButtonY, this.buttonSize, this.buttonSize)
      this.context.drawImage(imgArray[3], this.rightButtonX, this.leftButtonY, this.buttonSize, this.buttonSize)
      this.hubGeo = new THREE.PlaneGeometry(screenWidth, screenHeight);
      this.hubTexture = new THREE.CanvasTexture(this.hubCanvas);
      this.hubTexture.minFilter = THREE.LinearFilter;
      this.hubTexture.needsUpdate = true;
      let hubMat = new THREE.MeshBasicMaterial({
        map: this.hubTexture,
        transparent: true,
        opacity: 1
      })
      let hubPlane = new THREE.Mesh(this.hubGeo, hubMat);
      this.hudScene.add(hubPlane);
    })

    // //无法保证顺序 
    // Promise.all([loadImg('images/up.png'),
    //   loadImg('images/down.png'),
    //   loadImg('images/left.png'),
    //   loadImg('images/right.png')
    // ]).then(() => {
    //   this.buttonSize = screenHeight * 0.1;

    //   this.upButtonX = screenWidth * 0.12;
    //   this.upButtonY = screenHeight * 0.68;
    //   this.downButtonY = screenHeight * 0.82;
    //   this.leftButtonX = screenWidth * 0.06;
    //   this.rightButtonX = screenWidth * 0.18;
    //   this.leftButtonY = screenHeight * 0.75;
    //   this.context.drawImage(imgArray[0], this.upButtonX, this.upButtonY, this.buttonSize, this.buttonSize)
    //   this.context.drawImage(imgArray[1], this.upButtonX, this.downButtonY, this.buttonSize, this.buttonSize)
    //   this.context.drawImage(imgArray[2], this.leftButtonX, this.leftButtonY, this.buttonSize, this.buttonSize)
    //   this.context.drawImage(imgArray[3], this.rightButtonX, this.leftButtonY, this.buttonSize, this.buttonSize)
    //   this.hubGeo = new THREE.PlaneGeometry(screenWidth, screenHeight);
    //   this.hubTexture = new THREE.CanvasTexture(this.hubCanvas);
    //   this.hubTexture.minFilter = THREE.LinearFilter;
    //   this.hubTexture.needsUpdate = true;
    //   let hubMat = new THREE.MeshBasicMaterial({
    //     map: this.hubTexture,
    //     transparent: true,
    //     opacity: 1
    //   })
    //   let hubPlane = new THREE.Mesh(this.hubGeo, hubMat);
    //   this.hudScene.add(hubPlane);
    // })

  }
  HudEvent() {
    let SPEED = 0.1;
    this.zspeed = 0;
    this.xspeed = 0;
    canvas.addEventListener('touchstart', (e) => {
      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;
      let distanceToUp = Math.sqrt((x - this.upButtonX - this.buttonSize / 2) * (x - this.upButtonX - this.buttonSize / 2) + (y - this.upButtonY - this.buttonSize / 2) * (y - this.upButtonY - this.buttonSize / 2));
      let distanceToDown = Math.sqrt((x - this.upButtonX - this.buttonSize / 2) * (x - this.upButtonX - this.buttonSize / 2) + (y - this.downButtonY - this.buttonSize / 2) * (y - this.downButtonY - this.buttonSize / 2));
      let distanceToLeft = Math.sqrt((x - this.leftButtonX - this.buttonSize / 2) * (x - this.leftButtonX - this.buttonSize / 2) + (y - this.leftButtonY - this.buttonSize / 2) * (y - this.leftButtonY - this.buttonSize / 2));
      let distanceToRight = Math.sqrt((x - this.rightButtonX - this.buttonSize / 2) * (x - this.rightButtonX - this.buttonSize / 2) + (y - this.leftButtonY - this.buttonSize / 2) * (y - this.leftButtonY - this.buttonSize / 2));
      if (distanceToUp < this.buttonSize / 2) {
        this.zspeed = -SPEED
      } else if (distanceToDown < this.buttonSize / 2) {
        this.zspeed = SPEED
      } else if (distanceToLeft < this.buttonSize / 2) {
        this.xspeed = -SPEED;
      } else if (distanceToRight < this.buttonSize / 2) {
        this.xspeed = SPEED;
      }
    })
    window.addEventListener('touchend', (e) => {
      this.xspeed = 0;
      this.zspeed = 0;
    })
  }
  update() {
    // if(this.raycaster.intersectObject(this.wall,true).length == 0){
    this.Move(this.group, this.xspeed, this.zspeed)
    // }

    // console.log(this.raycaster.intersectObject(this.wall,true))
  }
  Move(object, xspeed, zspeed) {
    if (this.raycasterLeft.intersectObject(this.wallGroup, true).length == 0 && xspeed < 0) {
      object.position.x += xspeed;
    } else if (this.raycasterRight.intersectObject(this.wallGroup, true).length == 0 && xspeed > 0) {
      object.position.x += xspeed;
    }

    if (this.raycasterUp.intersectObject(this.wallGroup, true).length == 0 && zspeed < 0) {
      object.position.z += zspeed;
    } else if (zspeed > 0) {
      object.position.z += zspeed;
    }

  }
  loop() {
    this.update();
    this.spotLightHelper.update();
    this.renderer.autoClear = false; // 此处关键否则,画布会被重新擦拭
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.hudScene, this.hudCamera)
    window.requestAnimationFrame(this.loop.bind(this), canvas);
  }
}