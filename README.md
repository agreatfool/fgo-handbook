Fgo Handbook
============

## 1. 简介

React Native 实验项目。

主要功能：

* 列出当前所有的从者，含：从者基本信息、从者技能、从者故事、从者材料需求
* 种火经验计算器
* 根据材料查看该材料所有的数量需求
* 编辑当前玩家的从者等级等进度信息
* 制作玩家的目标进度信息
* 进行当前进度和目标之间的比对，获得需要的材料和QP数量

## 2. Note

代码主要分为两部分：

* src/mobile：这部分是RN相关的移动应用代码
* src/server：这部分是Node.JS的命令行下更新脚本

对应有两份tsconfig配置文件：

* 对应mobile的是根目录下的tsconfig.json
* 对应server的是根目录下的server-tsconfig.json

tsc生成的代码在：

* mobile：build
* server：server_build

## 3. 更新

当有版本需要更新的时候，需要：

* 运行`gulp watch`，编译出对应的mobile和server可执行的js代码
* 运行`node server_build/server/Runner.js`，从网络获取版本信息
* 获取的最新版本信息和图片等，会放在`database/x.x.x`下
* 并且会同步将最新的一份版本内容放到`src/resource`下，便于后面进行bundle

然后需要改动`ios/mobile/AppDelegate.m`文件，把`jsCodeLocation`这行的内容替换成`jsbundle`代码

接下来运行`bash/bundle.ios.sh`，制作出静态jsbundle，放在`ios/bundle`下

最后使用xcode，将项目编译并部署到真机上

### 3.1 当更新发生问题的时候

需要修改`src/server/Runner.ts`，把`manuallyUpdateVer`从`undefined`修改成`x.x.x`版本号，一般是最新一次更新生成的版本号，然后在运行Runner.js

这个操作会避免再运行一系列的图片下载行为，对脚本资源的下载和分析有加速作用

## 4. Tips
当前使用的RN版本是有致命BUG的，但我也不想更换了，每次一换都是一堆问题。

在npm安装完成之后记得：
```
mkdir node_modules/react-native/packager
cp node_modules/react-native/scripts/react-native-xcode.sh node_modules/react-native/packager/react-native-xcode.sh
```

自从某次更新版本之后发现了这个问题我就对RN完全失去了兴趣，连最基本的测试都没有做好就放出来的release，对得起FB大厂的脸面？