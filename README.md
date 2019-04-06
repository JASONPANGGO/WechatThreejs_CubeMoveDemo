## 使用three.js制作微信小游戏实现控制方块移动的功能

* 使用离屏渲染一个Canvas层于three.js的canvas层上方以绘制hud
* 使用promise改写了图片加载解决了回调嵌套的问题

## 源码目录介绍
```
./js
├── libs
│    ├──weapp-adapter                  // 兼容three.js的小游戏适配器
|    ├──three                           // three.js及其他插相关件
│    └── symbol.js                          // ES6 Symbol简易兼容
|
└── main.js                                // 游戏入口主函数
```