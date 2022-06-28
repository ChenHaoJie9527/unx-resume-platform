### Vite 学习随记

市面上存在的构建工具多种多样，其中就包括`grunt`、`Webpack`、`Rolllup`、`Parcel`、`Esbuild`、`Vite` 等，无论哪一种工具，解决的核心问题，永远是前端工程化的痛点。

那么前端工程化存在的痛点有哪些呢？总结有一下几点：

1. **模块化需求**。实现模块化的标准也比较多，其中就有`ESM`、`CommonJs`、`AMD`和`CMD`等。前端工程既要实现这些模块化规范的同时，也要确保模块化的正常运行，兼容性，以确保在不同的执行环境中运行
2. **高级语法编译，兼容浏览器**。由于浏览器的实现方式不同，想要高级语言或者语法（TS、JXS、TSX、ES6）能在浏览器中正常运行，就必须转化为浏览器能够识别的形式。这些都需要工具链成层面的支持。
3. **代码质量**。在生产环境中，不仅要考虑代码的安全性、兼容性，同时也要保证线上代码的质量和性能问题，而这些问题也将影响到方方面面。
4. **开发效率**。在开发环境中，为了能有一个更快的产出，开发体验将是一个很重要的因素。其中项目的冷启动、二次启动、热更新时间都会严重影响开发效率，当项目越来越复杂庞大时，对项目的启动速度和热更新就有更高的要求。

那么，前端的构建工具是怎么解决以上的痛点呢？

|  模块化方案  | 1.提供模块加载方案；2.兼容不同的模块规范，`CommonJs`、`ESM`、`AMD`、`UMD` |
| :----------: | ------------------------------------------------------------ |
| **语法编译** | **1.高级预发转义，如Sass、Less、TS、ES6；2.资源加载，图片，字体等** |
| **代码质量** | **1.代码压缩、代码混淆、Tree Shaking、语法兼容；**           |
| **开发效率** | **1.冷启动，二次启动；2.热更新HMR**                          |

- 模块化方案。提供多种模块化加载方案，并作出兼容处理
- 语法转义，配合Sass、Babel等前端工具链实现语法的转义，也能对静态资源做处理，成为一个模块正常加载。
- 代码质量，在生产环境，配合Terser等压缩工具对代码进行压缩和混淆，通过Tree Shaking删除为引用的代码，提供对低版本浏览器的语法降级处理机制
- 开发效率，构建工具提供多种方式进行性能优化，包括原生的Go和Rust，np-bundle等思路，提高项目的启动性能和热更新速度

#### 1. Vite在众多构建工具中脱颖而出

- 开发效率，Vite在开发阶段是基于浏览器原生支持的ESM模块化实现了 no-bundle的思路，借助ESbuild超快的编译速度来构建第三方库以及TS/TSX等语法编译，从而提高了开发效率。
- 模块化方案，Vite是基于浏览器原生ESM的支持实现模块化加载，并且还可以将其他的模块化规范转为ESM模块，无论是在生产环境和开发环境
- 语法转义，Vite内置了对Sass、Less、TS等高级语法的支持，能够加载各种静态资源，如图片，字体等
- 代码质量，Vite基于成熟的Rollup实现生产环境打包，同时可以配置Babel等工具链，能够保证构建产物的质量

#### 2. ESM是前端模块化的未来

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c15509b49d84da58b745d6c1b97f8e7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

总体而言，业界经历了一系列**由规范、标准引领工程化改革**的过程。构建工具作为前端工程化的核心要素，与底层的前端模块化规范和标准息息相关。通过前端模块化的演进，也能更好的理解基于浏览器原生的`ES Module`而实现的`no-boundl`构建工具`Vite`的优势。

1. 无模块化标准阶段

   早期模块化标准还没有诞生的时候，前端就通过一些特殊手段来实现模块化，比如 **文件划分**、**命名空间**和**立即执行函数**。

   - 文件划分

     文件划分是最原始的模块化实现方式，通过引入不同的`script`标签，加载不同的`js`模块。

     ```js
     // module-1.js
     let data = 10
     ```

     ```js
     // module-2.js
     let list = [1,2,3]
     ```

     ```html
     // index.html
     <!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>Document</title>
       </head>
       <body>
         <script src="./module-1.js"></script>
         <script src="./module-2.js"></script>
         <script>
           console.log(data);
           console.log(list);
         </script>
       </body>
     </html>
     ```

     通过引入不同的module-1和module-2的两个模块，看似分散了不同的模块的运行和逻辑，实际上也带来了许多隐藏的风险因素：

     - 模块变量基于全局声明和定义，存在变量名冲突和覆盖的问题。
     - 由于变量都在全局定义，很难知道哪个变量属于哪些模块，带来调试上的困难
     - 无法清晰管理模块间的依赖关系和加载顺序，需要手动调整script执行顺序

   - 命名空间

     命名空间是模块化的另一种实现方式，主要解决了上述全局变量定义所带来的问题

     ```js
     // module-a.js
     window.moduleA = {
         data: 'moduleA',
         method() {
             console.log('moduleA')
         }
     }
     // module-b.js
     window.moduleB = {
         data: 'moduleB',
         method() {
             console.log('moduleB')
         }
     }
     ```

     ```html
     <!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>Document</title>
       </head>
       <body>
         <script src="./module-a.js"></script>
         <script src="./module-b.js"></script>
         <script>
           // 此时 window 上已经绑定了 moduleA 和 moduleB
           console.log(moduleA.data);
           moduleB.method();
         </script>
       </body>
     </html>
     ```

     这样一来，每个变量都有自己的专属空间，也能清楚的知道某个变量属于哪个模块，同时避免了避免全局变量命名冲突的问题

   - 立即执行函数

     相比于命名空间，立即执行函数会更有安全性，对于模块化作用域的区分也更为彻底和明显。

     ```js
     // module-a.js
     (function () {
         let data = '10';
         function method() {
             console.log(data)
         }
         window.moduleA = {
             method
         }
     })();
     ```

     ```JS
     // module-b.js
     (function () {
       let data = "moduleB";
     
       function method() {
         console.log(data + "execute");
       }
     
       window.moduleB = {
         method: method,
       };
     })();
     ```

     ```html
     // index.html
     <!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>Document</title>
       </head>
       <body>
         <script src="./module-a.js"></script>
         <script src="./module-b.js"></script>
         <script>
           // 此时 window 上已经绑定了 moduleA 和 moduleB
           console.log(moduleA.data);
           moduleB.method();
         </script>
       </body>
     </html>
     ```

     由于立即执行函数会创建一个私有的作用域，在私有作用域中的变量外界是无法访问的，只有模块内部的方法才能访问，这就很好的隔绝了不同模块之间的变量名冲突和覆盖的问题发生；

     实际上，无论是命名空间还是立即执行函数，都是为了解决在全局变量下带来的命名冲突和作用域不明确的问题。然而并没有解决模块之间的依赖关系和加载次序。一旦项目变动复杂膨大，模块之间的依赖也变得频繁多样。也正是这些问题促进了模块化的标准的出现。

     在经历了漫长的发展，即便到了如今都没能实现完全的统一，也就有了现在的三大模块化规范，分别是：`CommonJs`、`AMD`、`ES module`。

   2. `CommonJs`规范

      `CommonJs`是业界最早正式提出的JavaScript模块规范，主要用于服务端。随着`NodeJs`越来越普及，这个规范也就被业界广泛应用。该模块主要包含两个内容：

      - 统一的模块化代码规范
      - 实现了自动加载模块的加载器`loader`

      ```js
      // module-a.js
      var data = "hello world";
      function getData() {
        return data;
      }
      module.exports = {
        getData,
      };
      
      // index.js
      const { getData } = require("./module-a.js");
      console.log(getData());
      ```

      代码中使用 require 来导入一个模块，用`module.exports`来导出一个模块，实际上`NodeJs`在内部会运用相应的 loader 转译模块代码，最后会被处理成这样：

      ```js
      (function (exports, require, module, __filename, __dirname) {
        // 执行模块代码
        // 返回 exports 对象
      });
      ```

      然而这套规范存在一些局限性：

      - 模块解析器loader是NodeJs提供的，依赖NodeJs本身去实现，并且处于服务端环境中。在浏览器是无法执行的。
      - CommonJs规范约定了模块会被同步加载，这套机制放在服务端是不会有什么问题，因为服务端不需要进行网络IO，而且服务启动时才会去加载模块，通常服务启动后会一直在运行。而在浏览器环境中，同步加载会导致加载模块堵塞，导致页面性能问题明显暴露。因此该模块规范并不能很好的在浏览器中被广泛应用。

   3. `AMD`规范

      AMD指的是异步模块定义规范，模块会根据这个规范，在浏览器环境中被异步加载，而不会像CommonJs被同步加载，也不会产生同步请求导致浏览器解析堵塞问题。

      ```js
      // main.js
      define(["./print"], function (printModule) {
        printModule.print("main");
      });
      
      // print.js
      define(function () {
        return {
          print: function (msg) {
            console.log("print " + msg);
          },
        };
      });
      ```

      通过 define 去定义或加载一个模块，比如上面的 main 模块和 print 模块。如果模块需要导出一些成员需要通过在定义模块的函数中 return 出去(参考 `print` 模块)，如果当前模块依赖了一些其它的模块则可以通过 define 的第一个参数来声明依赖(参考`main`模块)，这样模块的代码执行之前浏览器会先**加载依赖模块**。

      也可以使用 require 来加载一个模块，如：

      ```js
      // module-a.js
      require(["./print.js"], function (printModule) {
        printModule.print("module-a");
      });
      ```

      不过 require 与 define 的区别在于前者只能加载模块，而`不能定义一个模块`。

      由于没有得到浏览器的原生支持，AMD 规范需要由第三方的 loader 来实现，最经典的就是 [requireJS](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Frequirejs%2Frequirejs) 库了，它完整实现了 AMD 规范，至今仍然有不少项目在使用。

   4. ES6 Module规范

      ES6 Module也成为 ES module或则ESM模块。是ECMAScript官方提出的模块化规范。该规范已经得到了现代浏览器的内置支持。在现代浏览器中，通过给 script 标签 添加 type='module' 属性，浏览器会按照 ESM规范去加载依赖和模块解析。这也是Vite在开发阶段实现no-boundle的原因。由于模块加载和解析的任务交给了浏览器，即便在不打包的情况下也可以顺利运行模块化代码。

      然而ESM的兼容性问题，已经被绝大部分现代浏览器支持了：

      ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a538b478a6e743fcb5dd5849cf07fcc8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

      不仅如此，NodeJs在实现了CommonJs规范之后也紧跟ESM的发展步伐，在版本12.20版本开始也正式支持 原生 ES Module规范。

      简单例子：

      ```JS
      // main.js
      import { methodA } from "./module-a.js";
      methodA();
      
      //module-a.js
      const methodA = () => {
        console.log("a");
      };
      
      export { methodA };
      ```

      ```html
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Vite App</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="./main.js"></script>
        </body>
      </html>
      ```

      而在`NodeJs`环境中，你可以在 `package.json` 中生命 `type: 'module'`

      ```json
      // package.json
      {
        "type": "module"
      }
      ```

      然后`nodeJs`会默认采用 ESM 规范去解析模块。即便在`CommonJs`模块里，也可以通过Import 方法导入ES模块

      ```js
      async function func() {
        // 加载一个 ES 模块
        // 文件名后缀需要是 mjs
        const { a } = await import("./module-a.mjs");
        console.log(a);
      }
      
      func();
      
      module.exports = {
        func,
      };
      ```

   5. Vite 的前景

      ES Module 作为 ECMAScript 官方提出的规范，经过五年多的发展，不仅得到了众多浏览器的原生支持，也在 Node.js 中得到了原生支持，是一个能够跨平台的模块规范。同时，它也是社区各种生态库的发展趋势，尤其是被如今大火的构建工具 Vite 所深度应用。可以说，ES Module 前景一片光明，成为前端大一统的模块标准指日可待。

#### 3. 使用 Vite 从零搭建前端项目

```powershell
node -v
npm -v
```

当然，在现代的前端项目中，我非常不推荐使用 npm 作为项目的包管理器，甚至也不再推荐`yarn`(`npm` 的替代方案)，因为两者都存在比较严重的性能和安全问题，而这些问题在 pnpm 中得到了很好的解决，更多细节可以参考我的这篇博客: [关于现代包管理器的深度思考——为什么现在我更推荐 pnpm 而不是 npm/yarn? ](https://juejin.cn/post/6932046455733485575)。

因此，包管理器方面我推荐使用 pnpm，安装方式非常简单，输入如下命令即可:

```powershell
npm i -g pnpm
```

由于默认的镜像源在国外，包下载速度和稳定性都不太好，因此我建议你换成国内的镜像源，这样`pnpm install`命令的体验会好很多，命令如下:

```powershell
pnpm config set registry https://registry.npmmirror.com/
```

初始化项目：

```powershell
pnpm create vite
```

这个命令会下载 create-vite包，然后执行这个包的项目初始化了逻辑，然后进入交互界面：![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7ca5186aa324841ba4f038642e355f3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

1. 输入项目名称
2. 选择前端框架
3. 选择开发语言

最后会得到一个你想要的vite构建的项目结构

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8ca697e5ca449f7af195245957856ff~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

先看下初始化的项目结构

```markdown
.
├── pubic
│	├── favicon.ico
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── favicon.svg
│   ├── assets
	   	├── logo.png
│   ├── components
		├── index.html HelloWorld.vue
│   ├── App.vue
│   ├── main.ts
│   └── env.d.ts
├── index.html
├── .gitignore
├── package.json
├── pnpm-lock-yaml
├── README.md
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

其中，在根目录下有一个 index.html 文件，这个文件是作为整个项目启动的入口文件，当启动 `pnpm run dev` 这个命令时，`Vite`的`Dev Server`会自动去返回这个`HTML`文件，用于在http://locahost:3000访问。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>

```

其中，带有id为app的标签是作为vue的根节点外，Script标签的type=module，表示基于ESM规范去解析依赖。

```html
<script type="module" src="/src/main.ts"></script>
```

这也是因为现代浏览器已经支持ESM模块，通过script标签声明type=''module"，同时src只想 src/main.ts文件，也就相当于请求了 http://locahost:3000/src/main.ts这个资源，Vite的 Dev Server会接收这个请求，然后去读取对应的文件内容，经过一定的处理，返回浏览器能够识别的内容。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee292d2f8917407ca8f47e94f8d8aeed~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

接下来，`src.main.ts`里面的内容是做了什么

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

该文件引入了两个 import 模块，分别是`vue`库和 `App.vue`组件，并将`App.vue` 组件 挂在到 index.html里的id为app的标签下进行渲染。

然而浏览器并不能识别`.vue`文件的内容，而是`Vite Dev Server`做了一个中间的处理，对`App.vue`文件的内容进行编译，通过浏览器的 `NetWorld`可以看到解析了`App.vue`。

`Vite` 会将项目的源代码编译成浏览器可以识别的代码，与此同时，一个 import 语句即代表了一个 HTTP 请求，如下面两个 import 语句

```ts
import { createApp } from 'vue'
import App from './App.vue'
```

需要注意的是，在 `Vite` 项目中，一个`import 语句即代表一个 HTTP 请求`。上述的语句则分别代表了两个请求，Vite Dev Server会读取本地文件，返回浏览器可以解析的代码。当浏览器解析到新的 import 语句时，又会发出新的请求， Dev Server又会去找对应的文件加载，知道所有的资源都加载完成。

总结：

- no-boundle理念，利用浏览器原生 ES 模块的支持，实现开发阶段的 Dev Server，进行模块的按需加载，而不是整体打包完后再加载，省略了繁琐且耗时的打包过程。这也是为什么它快的原因。

#### 4. Vite build

虽然Vite因其不打包的特性处于开发环境中，这也是基于ES模块实现的Dev Server去做了一定的中间处理。但在生产环境中，Vite会基于`Rollup`进行打包，并采取一系列打包优化手段，在`package.json`中可以看到：

``` json
"scripts": {
  // 开发阶段启动 Vite Dev Server
  "dev": "vite",
  // 生产环境打包
  "build": "vue-tsc --noEmit && vite build",
  // 生产环境打包完预览产物
  "preview": "vite preview"
},
```

在 build 命令中，做了两件事，先使用vue-tsc对代码做类型检查且只做类型检查，然后使用vite build命令基于Rollup进行打包。

但是为什么要使用vue-tsc进行类型检查呢？

- 打包前进行类型检查，能够确保代码的健壮性，减少错误的事情发生。
- 虽然Vite提供了开箱即用的 TS 和 JSX 的编译被爆发力，但实际上底层并没有实现TS的类型校验系统，因此需要借助tsc，而vue是基于vue-tsc这个库来实现的一个类型检查校验。

#### 5. css 方案

在现代前端工程化阶段中，CSS 实施方案一直都是为了解决项目基础问题而存在的。而这些问题有以下几点：

- 原生CSS开发体验欠佳，不支持选择器的嵌套，只能采取平铺
- 同类名样式污染被覆盖
- 浏览器兼容问题。为了实现兼容不同浏览器，一些属性需要添加不同的浏览器前缀
- Css打包后的体积问题，当存在没有在代码中使用的Css样式时，导致产物体积过大。

社区中常见的几种方案有如下几个：

1. `CSS` 预处理器：主流的包括有 Sass/Less。这些方案各自定义了一套语法规则，让`CSS`支持嵌套规则，并支持变量，函数，条件判断等功能，使得像编程语言一样定义变量。写条件判断和循环语句，大大增强样式语言的灵活性，解决了开发体验问题。
2. Css Modules: 能将CSS类处理成哈希值，避免出现同名时导致样式污染问题
3. PostCss，用于解析和处理Css代码，可以将Px转换为Rem，根据目标浏览器加上兼容的前缀属性。
4. Css in Js，主流包括emotion，styled-components等，允许直接在js中写样式代码，基本包含Css预处理器和Css Modules的各项优点，解决了开发体验和全局样式污染问题
5. Css原子化框架，如Tailwind Css、Windi Css，通过类名来指定样式，大大简化了样式写法

##### Css 预处理器

由于Vite本身对Css各种预处理器都做了内置支持。即时不经过任何的配置也可以直接使用各种Css预处理器。Vite会在底层调用对应的Css预处理器的官方库进行编译，而Vite为了实现按需加载，并没有内置这些工具库，选择交给用户来安装。

```powershell
pnpm i sass -D
```

例子：创建一个组件 Navbar.tsx

```tsx
import { defineComponent } from "vue";
// import style from "../styles/navbar.module.scss";
import style from "@/styles/navbar.module.scss";

export default defineComponent({
    name: 'NavBar',
    render() {
        return (
          <div class={style.NavBart}>
            NavBart <span class={style["NavBart.active"]}>跟我走吧</span>
          </div>
        );
    }
})
```

引入的 styles/navbar.module.scss

```scss
.NavBart {
  color: red;
  text-decoration: dashed;
  &.active {
    color: blue;
  }
}
```

封装一个全局的主题色，新建 styles/common.scss

```scss
$theme-color: red;
```

在 Header.vue 文件里引入

```vue
<template>
    <header class="header bg-red-400">header123</header>
</template>
<script lang="ts" setup>
</script>
<style lang="scss" scoped>
@use "@/styles/mixins.scss";
.header {
    color: $theme-color;
}
</style>
```

为了避免每次都要引入common.scss文件，可以采用自动引入方案，需要在Vite中进行一些自定义配置 => vite.config.ts

通过 css 字段的配置属性 preprocessorOptions，preprocessorOptions是用于处理各种预处理器的配置选项，其中 key 为预处理器的名称， value 为key的配置选项，这里我们写 scss，该scss选项有一个属性additionalData，表示会在每一个scss文件开头自动引入一个文件

```ts
import { defineConfig, normalizePath } from "vite";
import VueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";

import path from "path";
// 引入 path 包注意两点:
// 1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
// 2. tsconfig.node.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式

// 由于 Windows 识别多个路径分隔符，两个分隔符都将被 Windows 首选分隔符 (\) 的实例替换
// 解决 window 下的路径问题
const mixinsCssPath = normalizePath(
  path.resolve(__dirname, "src/styles/mixins.scss")
);

export default defineConfig({
  root: path.resolve(__dirname, "src"), // // 手动指定项目根目录位置
  plugins: [
    vue(),
    VueJsx({}),
  ],
  resolve: {
    alias: {
      // //文件系统路径的别名, 绝对路径
      "@": path.resolve(__dirname, "src")
    },
  },
  // css配置
  css: {
    // 指定传递给 CSS 预处理器的选项。文件扩展名用作选项的键：如scss less styles等
    preprocessorOptions: {
      scss: {
        // additionalData: 以lang="scss"的样式文件会自动引入对应的文件
        additionalData: `@use "${mixinsCssPath}" as *;`,
      },
    },
    modules: {
      // 开启 camelCase 格式变量名转换
      localsConvention: "camelCase",
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名 hash表示哈希值 6 表示6位数的`哈希值
      generateScopedName: "[name]__[local]__[hash:6]",
    },
    // 在开发过程中是否启用 sourcemap。default: false
    devSourcemap: false,
    // postcss配置
    postcss: {
      // autoprefixer 用来自动为不同的目标浏览器添加样式前缀，解决的是浏览器兼容性的问题
      plugins: [
        autoprefixer({
          // env: "development",
          // 制定目标浏览器
          overrideBrowserslist: ["Chrome > 40", "ff > 31", "ie 11"],
        }),
      ],
    },
  },
});

```

##### Css Modules

Css Modules是Vite开箱即用的功能，会识别带有 .module 的样式文件自动应用 Css Modules。

以 navbar.module.scss 为例

```scss
.NavBart {
  color: red;
  text-decoration: dashed;
  &.active {
    color: blue;
  }
}
```

应用到Navbar.tsx

```tsx
import { defineComponent } from "vue";
// import style from "../styles/navbar.module.scss";
import style from "@/styles/navbar.module.scss";

export default defineComponent({
    name: 'NavBar',
    render() {
        return (
          <div class={style.NavBart}>
            NavBart <span class={style["NavBart.active"]}>跟我走吧</span>
          </div>
        );
    }
})
```

同时，也可以在vite.config.ts 中对 Css Modules 功能进行配置

在 css 配置里，有一个modules属性选项，obejct 类型。其中 localsConvention 可以进行格式变量名转换，即 `import style from "@/styles/navbar.module.scss"`，导出到 style 变量中。generateScopedName 可以对样式文件做一些命名处理，最常见的是 文件名 + 类名 + 哈希值组合命名，这样不会出现类名冲突，样式污染。

这是一个 CSS Modules 中很常见的配置，对开发时的调试非常有用。其它的一些配置项不太常用，大家可以去这个[地址](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmadyankin%2Fpostcss-modules)进行查阅

```ts
import { defineConfig, normalizePath } from "vite";
import VueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";

import path from "path";
// 引入 path 包注意两点:
// 1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
// 2. tsconfig.node.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式

// 由于 Windows 识别多个路径分隔符，两个分隔符都将被 Windows 首选分隔符 (\) 的实例替换
// 解决 window 下的路径问题
const mixinsCssPath = normalizePath(
  path.resolve(__dirname, "src/styles/mixins.scss")
);

export default defineConfig({
  root: path.resolve(__dirname, "src"), // // 手动指定项目根目录位置
  plugins: [
    vue(),
    VueJsx({}),
  ],
  resolve: {
    alias: {
      // //文件系统路径的别名, 绝对路径
      "@": path.resolve(__dirname, "src")
    },
  },
  // css配置
  css: {
    // 指定传递给 CSS 预处理器的选项。文件扩展名用作选项的键：如scss less styles等
    preprocessorOptions: {
      scss: {
        // additionalData: 以lang="scss"的样式文件会自动引入对应的文件
        additionalData: `@use "${mixinsCssPath}" as *;`,
      },
    },
    modules: {
      // 开启 camelCase 格式变量名转换
      localsConvention: "camelCase",
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名 hash表示哈希值 6 表示6位数的`哈希值
      generateScopedName: "[name]__[local]__[hash:6]",
    },
    // 在开发过程中是否启用 sourcemap。default: false
    devSourcemap: false,
    // postcss配置
    postcss: {
      // autoprefixer 用来自动为不同的目标浏览器添加样式前缀，解决的是浏览器兼容性的问题
      plugins: [
        autoprefixer({
          // env: "development",
          // 制定目标浏览器
          overrideBrowserslist: ["Chrome > 40", "ff > 31", "ie 11"],
        }),
      ],
    },
  },
});
```

##### PostCss 后处理

Vite为 PostCss提供了配置入口，只需要在配置文件中进行操作即可。

```powershell
pnpm i autoprefixer -D
```

这个插件主要用于自动为不同的目标浏览器添加样式前缀，解决浏览器兼容性问题。

```tsx
import { defineConfig, normalizePath } from "vite";
import VueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";

import path from "path";
// 引入 path 包注意两点:
// 1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
// 2. tsconfig.node.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式

// 由于 Windows 识别多个路径分隔符，两个分隔符都将被 Windows 首选分隔符 (\) 的实例替换
// 解决 window 下的路径问题
const mixinsCssPath = normalizePath(
  path.resolve(__dirname, "src/styles/mixins.scss")
);

export default defineConfig({
  root: path.resolve(__dirname, "src"), // // 手动指定项目根目录位置
  plugins: [
    vue(),
    VueJsx({}),
  ],
  resolve: {
    alias: {
      // //文件系统路径的别名, 绝对路径
      "@": path.resolve(__dirname, "src")
    },
  },
  // css配置
  css: {
    // 指定传递给 CSS 预处理器的选项。文件扩展名用作选项的键：如scss less styles等
    preprocessorOptions: {
      scss: {
        // additionalData: 以lang="scss"的样式文件会自动引入对应的文件
        additionalData: `@use "${mixinsCssPath}" as *;`,
      },
    },
    modules: {
      // 开启 camelCase 格式变量名转换
      localsConvention: "camelCase",
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名 hash表示哈希值 6 表示6位数的`哈希值
      generateScopedName: "[name]__[local]__[hash:6]",
    },
    // 在开发过程中是否启用 sourcemap。default: false
    devSourcemap: false,
    // postcss配置
    postcss: {
      // autoprefixer 用来自动为不同的目标浏览器添加样式前缀，解决的是浏览器兼容性的问题
      plugins: [
        autoprefixer({
          // env: "development",
          // 制定目标浏览器
          overrideBrowserslist: ["Chrome > 40", "ff > 31", "ie 11"],
        }),
      ],
    },
  },
});
```

其中，postcss 选项是用来配置的，plugins 属性用于注册插件，增强postcss能力。这里使用 autoprefixer插件，初始化配置为 overrideBrowserslist，用于指定目标浏览器版本号使用前缀。

#### 6. Lint规范

在前端工程化当中，代码规范是一个很重要的环节。

需要解决一些自动化的工具来保证代码规范的落地。把代码规范检查这件事交给机器来完成，老发展只需要专注于应用逻辑本身。

在主流工具当中主要有：ESLint、Prettier、CommitLint等。还能配合husky、lint-staged、VScode插件和Vite生态在项目中集成的完整的Lint工具链，搭建起来完整的前端开发和代码提交工作流。

##### JS/TS规范工具：ESLint

ESLint主要是通过配置文件对各种代码格式的规则进行配置，以指定具体的代码规范。

- 初始化

  ```powershell
  pnpm i eslint -D
  ```

- eslint init 

  ```powershell
  npx eslint --init
  ```

  会进入一个交互引用程序，选择想要的配置

  ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c71cb725150d4e5c9d46539916047ef1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

执行完交互后，Eslint会自动在项目根目录下生成一个 .eslintrc.js配置文件，在这里需要手动安装一些插件：

```powershell
pnpm i eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest -D
```

核心配置解读

1. parser - 解析器

   ESLint 底层默认使用 [Espree](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Feslint%2Fespree)来进行 AST 解析，这个解析器目前已经基于 `Acron` 来实现，虽然说 `Acron` 目前能够解析绝大多数的 [ECMAScript 规范的语法](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Facornjs%2Facorn%2Ftree%2Fmaster%2Facorn)，但还是不支持 TypeScript ，因此需要引入其他的解析器完成 TS 的解析。

   社区提供了`@typescript-eslint/parser`这个解决方案，专门为了 TypeScript 的解析而诞生，将 `TS` 代码转换为 `Espree` 能够识别的格式(即 [**Estree 格式**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Festree%2Festree))，然后在 Eslint 下通过`Espree`进行格式检查， 以此兼容了 TypeScript 语法。

2. parserOptions - 解析器选项

   1. 这个配置可以对上述的解析器进行能力定制，默认情况下 ESLint 支持 ES5 语法，你可以配置这个选项，具体内容如下:
   2. ecmaVersion: 这个配置和 `Acron` 的 [ecmaVersion](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Facornjs%2Facorn%2Ftree%2Fmaster%2Facorn) 是兼容的，可以配置 `ES + 数字`(如 ES6)或者`ES + 年份`(如 ES2015)，也可以直接配置为`latest`，启用最新的 ES 语法。
   3. sourceType: 默认为`script`，如果使用 ES Module 则应设置为`module`。
   4. ecmaFeatures: 为一个对象，表示想使用的额外语言特性，如开启 `jsx`。

3. rules - 具体代码规则

   `rules` 配置即代表在 ESLint 中手动调整哪些代码规则，比如`禁止在 if 语句中使用赋值语句`这条规则可以像如下的方式配置:

   ```js
   // .eslintrc.js
   module.exports = {
     // 其它配置省略
     rules: {
       // key 为规则名，value 配置内容
       "no-cond-assign": ["error", "always"]
     }
   }
   ```

   在 rules 对象中，`key` 一般为`规则名`，`value` 为具体的配置内容，在上述的例子中我们设置为一个数组，数组第一项为规则的 `ID`，第二项为`规则的配置`。

   当然，你也能直接将 `rules` 对象的 `value` 配置成 ID，如: `"no-cond-assign": "error"`。

4. plugins

   上面提到过 ESLint 的 parser 基于`Acorn`实现，不能直接解析 TypeScript，需要我们指定 parser 选项为`@typescript-eslint/parser`才能兼容 TS 的解析。同理，ESLint 本身也没有内置 TypeScript 的代码规则，这个时候 ESLint 的插件系统就派上用场了。我们需要通过添加 ESLint 插件来增加一些特定的规则，比如添加`@typescript-eslint/eslint-plugin` 来拓展一些关于 TS 代码的规则，如下代码所示:

   ```js
   // .eslintrc.js
   module.exports = {
     // 添加 TS 规则，可省略`eslint-plugin`
     plugins: ['@typescript-eslint']
   }
   ```

   值得注意的是，添加插件后只是拓展了 ESLint 本身的规则集，但 ESLint 默认并**没有开启**这些规则的校验！如果要开启或者调整这些规则，你需要在 rules 中进行配置，如:

   ```js
   // .eslintrc.js
   module.exports = {
     // 开启一些 TS 规则
     rules: {
       '@typescript-eslint/ban-ts-comment': 'error',
       '@typescript-eslint/no-explicit-any': 'warn',
     }
   }
   ```

5. extends

   extends 相当于`继承`另外一份 ESLint 配置，可以配置为一个字符串，也可以配置成一个字符串数组。主要分如下 3 种情况:

   1. 从 ESLint 本身继承
   2. 从类似 `eslint-config-xxx` 的 npm 包继承
   3. 从 ESLint 插件继承

   ```js
   // .eslintrc.js
   module.exports = {
      "extends": [
        // 第1种情况 
        "eslint:recommended",
        // 第2种情况，一般配置的时候可以省略 `eslint-config`
        "standard"
        // 第3种情况，可以省略包名中的 `eslint-plugin`
        // 格式一般为: `plugin:${pluginName}/${configName}`
        "plugin:react/recommended"
        "plugin:@typescript-eslint/recommended",
      ]
   }
   ```

   有了 extends 的配置，对于之前所说的 ESLint 插件中的繁多配置，我们就**不需要手动一一开启**了，通过 extends 字段即可自动开启插件中的推荐规则:

   ```powershell
   extends: ["plugin:@typescript-eslint/recommended"]
   ```

6. env 和 globals

   两个配置分别表示`运行环境`和`全局变量`，在指定的运行环境中会预设一些全局变量，比如:

   ```js
   // .eslint.js
   module.export = {
     "env": {
       "browser": "true",
       "node": "true"
     }
   }
   ```

   指定上述的 `env` 配置后便会启用浏览器和 Node.js 环境，这两个环境中的一些全局变量(如 `window`、`global` 等)会同时启用

   有些全局变量是业务代码引入的第三方库所声明，这里就需要在`globals`配置中声明全局变量了。每个全局变量的配置值有 3 种情况:

   1. `"writable"`或者 `true`，表示变量可重写；
   2. `"readonly"`或者`false`，表示变量不可重写；
   3. `"off"`，表示禁用该全局变量

   那 jquery 举例，可以在配置文件中声明如下：

   ```js
   // .eslintrc.js
   module.exports = {
     "globals": {
       // 不可重写
       "$": false, 
       "jQuery": false 
     }
   }
   ```

##### Prettier 联合

虽然 ESLint 本身具备自动格式化代码的功能(`eslint --fix`)，但术业有专攻，ESLint 的主要优势在于`代码的风格检查并给出提示`，而在代码格式化这一块 Prettier 做的更加专业，因此我们经常将 ESLint 结合 Prettier 一起使用。

```
pnpm i prettier -D
```

在项目根目录新建`.prettierrc.js`配置文件，填写如下的配置内容:

```js
// .prettierrc.js
module.exports = {
  printWidth: 80, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, // 一个 tab 代表几个空格数，默认为 2 个
  useTabs: false, //是否使用 tab 进行缩进，默认为false，表示用空格进行缩减
  singleQuote: true, // 字符串是否使用单引号，默认为 false，使用双引号
  semi: true, // 行尾是否使用分号，默认为true
  trailingComma: "none", // 是否使用尾逗号
  bracketSpacing: true // 对象大括号直接是否有空格，默认为 true，效果：{ a: 1 }
};
```

接下来我们将`Prettier`集成到现有的`ESLint`工具中，首先安装两个工具包:

```
pnpm i eslint-config-prettier eslint-plugin-prettier -D
```

其中`eslint-config-prettier`用来覆盖 ESLint 本身的规则配置，而`eslint-plugin-prettier`则是用于让 Prettier 来接管`eslint --fix`即修复代码的能力。

在 `.eslintrc.js` 配置文件中接入 prettier 的相关工具链，最终的配置代码如下所示，你可以直接粘贴过去:

```js
const { defineConfig } = require('eslint-define-config');
module.exports = defineConfig({
  root: true,
  // 设置全局变量
  globals: {
    "$": 'readonly',
    "jQuery": 'readable'
  },
  // 设置我们的运行环境为浏览器 + es2021 + node ,否则eslint在遇到 Promise，window等全局对象时会报错
  env: {
    browser: true,
    es2021: true,
    node: true,
    // 开启setup语法糖环境
    'vue/setup-compiler-macros': true
  },
  // 新增，解析vue文件
  parser: 'vue-eslint-parser',
  // 继承eslint推荐的规则集，vue基本的规则集，typescript的规则集
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
    // './.eslintrc-auto-import.json',
  ],
  // 支持ts的最新语法
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  // 添加vue和@typescript-eslint插件，增强eslint的能力
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    // 3. 注意要加上这一句，开启 prettier 自动修复的功能
    'prettier/prettier': 'off',
    // js/ts
    camelcase: ['error', { properties: 'never' }],
    'no-console': 'error',
    'no-debugger': 'error',
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    'no-return-await': 'error',
    'no-var': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'prefer-const': [
      'warn',
      { destructuring: 'all', ignoreReadBeforeAssign: true }
    ],
    'prefer-arrow-callback': [
      'error',
      { allowNamedFunctions: false, allowUnboundThis: true }
    ],
    'object-shorthand': [
      'error',
      'always',
      { ignoreConstructors: false, avoidQuotes: true }
    ],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',

    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    // best-practice
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'no-alert': 'warn',
    'no-case-declarations': 'error',
    'no-multi-str': 'error',
    'no-with': 'error',
    'no-void': 'error',
    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false
      }
    ],

    // stylistic-issues
    'prefer-exponentiation-operator': 'error',
    // ts
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { disallowTypeAnnotations: false }
    ],
    '@typescript-eslint/no-var-requires': 'off',

    // vue
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    // prettier
    // 'prettier/prettier': 'off',
    // import
    // 'import/first': 'error',
    // 'import/no-duplicates': 'error',
    // 'import/no-unresolved': 'off',
    // 'import/namespace': 'off',
    // 'import/default': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/named': 'off',
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }]
  }
});

```

OK，现在我们回到项目中来见证一下`ESLint + Prettier`强强联合的威力，在 `package.json` 中定义一个脚本:

```js
{
  "scripts": {
    // 省略已有 script
    "lint:script": "eslint --ext .js,.jsx,.ts,.tsx --fix --quiet ./",
  }
}
```

#### 7. 在Vite中接入ESlint 插件

除了安装编辑器插件外，也可以通过Vite插件的方式在开发阶段进行 `ESlint` 扫描，以命令行的方式展示代码中可能存在的规范问题，并能够直接定位到原文件

```
pnpm i vite-plugin-eslint -D
```

在vite配置文件中接入该插件

```ts
// vite.config.ts
import viteEslint from 'vite-plugin-eslint';

// 具体配置
{
  plugins: [
    // 省略其它插件
    viteEslint(),
  ]
}
```

只需要重新启动项目，就能调用这个插件去检查代码中存在的规范错误.

#### 8.Husky + lint-staged 的 Git 提交工作流

commit 前代码lint 检查，这样做是为了确保代码提交到远程仓库前进行代码规范检查。也就是拦截 git commit 命令，进行代码格式检查，只有确保通过格式检查才允许正常提交代码。社区Husky来完成这件事情

```
pnpm i husky -D
```

**注意**：在 Husky `4.x` 及以下版本的时候，都是通过在 `package.json` 中配置 `Husky` 的钩子

```json
// package.json
{
  "husky": {
    "pre-commit": "npm run lint"
  }
}
```

然而 Husky 如今已经更新到 `7.x` 版本，之前的配置方法是无效的，就不在推荐用以前的方法了。新版的 `Husky` ，需要做如下的事情：

1. 初始化 Husky ：npx husky install，并将husky install 作为项目启动前脚本，如：

   初始化 husky 必须要在有.git 文件下才能初始化，否则无法初始化成功，并会有以下提示：

   ![image-20220423222305464](C:\Users\Chen.HJ\AppData\Roaming\Typora\typora-user-images\image-20220423222305464.png)

   ```json
   {
     "scripts": {
       // 会在安装 npm 依赖后自动执行
       "postinstall": "husky install"
     }
   }
   ```

2. 添加 Husky 钩子，在终端执行如下命令：

   ```powershell
   npx husky add .husky/pre-commit "npx vue-tsc --noEmit && npm run lint:pre"
   ```

   接着你将会在项目根目录的`.husky`目录中看到名为`pre-commit`的文件，里面包含了 `git commit`前要执行的脚本。现在，当你执行 `git commit` 的时候，会首先执行 `npm run lint`脚本，通过 Lint 检查后才会正式提交代码记录。

   ```bash
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"
   
   npx vue-tsc --noEmit
   npm run lint:pre
   ```

3. 添加 commit-msg 钩子，用于帮助我们在提交时，检验用户和提交信息

   ```
   npx husky add .husky/commit-msg
   ```

   执行完这行命令后，会在 .husky目录出现一个 commit-msg文件

   在该文件里添加 `npx --no-install commitlint --edit "$1"`

   ```bash
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"
   
   npx --no-install commitlint --edit "$1"
   ```

   以上我们添加了两条hooks钩子，当我们去操作 git commit 时，会优先执行 pre-commit 文件，该文件里有 vue-tes lint:pre等操作。，每commit 一次，husky就会执行一次 lint 脚本，并对仓库中的代码进行全量检查。也就是说，即使存在某些文件并未改动，也会走一次 Lint 检查，当项目代码越来越多时，提交的过程也就越来越慢，严重影响开发体验。

   这个时候，就得引出 lint-staged 这个库，帮助我们实现对进入暂存区的文件进行 Lint 检查，大大提高提交代码的效率：

   ```powershell
   pnpm i lint-staged
   ```

   ```json
   {
     "lint-staged": {
       "**/*.{js,jsx,tsx,ts,json}": [
         "npm run lint:script",
         "git add --force"
       ],
       "**/*.{scss}": [
         "npm run lint:style",
         "git add --force"
       ]
     }
   }
   ```

   接下来我们需要在 Husky 中应用`lint-stage`，回到`.husky/pre-commit`脚本中，将原来的`npm run lint`换成如下脚本:

   ```bash
   npx --no -- lint-staged
   ```


#### 9. commitlint 信息校验工具

这个工具是用于在进行 git commit 操作时，会进行一些校验逻辑，是否符合预期，首先需要安装对应的依赖：

```powershell
pnpm i commitlint @commitlint/config-conventional -D
pnpm husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

- **@commitlint/config-conventional** 这是一个规范配置,标识采用什么规范来执行消息校验, 这个默认是***Angular***的提交规范

  | 类型     | 描述                                                   |
  | -------- | ------------------------------------------------------ |
  | build    | 编译相关的修改，例如发布版本、对项目构建或者依赖的改动 |
  | chore    | 其他修改, 比如改变构建流程、或者增加依赖库、工具等     |
  | ci       | 持续集成修改                                           |
  | docs     | 文档修改                                               |
  | feat     | 新特性、新功能                                         |
  | fix      | 修改bug                                                |
  | perf     | 优化相关，比如提升性能、体验                           |
  | refactor | 代码重构                                               |
  | revert   | 回滚到上一个版本                                       |
  | style    | 代码格式修改, 注意不是 css 修改                        |
  | test     | 测试用例修改                                           |

- 安装辅助提交依赖

  ```powershell
  pnpm i commitizen cz-conventional-changelog -D
  ```

  - 安装指令和命令行的展示信息

    ```powershell
    npm set-script commit "git-cz" # package.json 中添加 commit 指令, 执行 `git-cz` 指令
    ```

  - 编写 commit 指令

    ```powershell
    npx commitizen init cz-conventional-changelog --save-dev --save-exact
    ```

    1. 初始化一下命令行的选项信息，才能看到一些选项
    2. ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4060ccb6a2bf48bda08c603d080e7109~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

  - 自定义提交规范信息

    ```powershell
    npm i -D commitlint-config-cz  cz-customizable
    ```

    变更 `commitlint.config.js` 配置文件，这里采用自己定义的规范，将会覆盖上面那个，所以那个也可以不用安装。

    ```js
    // commitlint.config.js
    module.epxorts = {
        // 采用 cz 定义的提交规范 => cz-config.js
        extends: ['cz'],
        rules: {
            // 自定义规则
        }
    }
    ```

    新增 .cz.config.js

    ```js
      'use strict'
      module.exports = {
        types: [
          { value: '✨新增', name: '新增:    新的内容' },
          { value: '🐛修复', name: '修复:    修复一个Bug' },
          { value: '📝文档', name: '文档:    变更的只有文档' },
          { value: '💄格式', name: '格式:    空格, 分号等格式修复' },
          { value: '♻️重构', name: '重构:    代码重构，注意和特性、修复区分开' },
          { value: '⚡️性能', name: '性能:    提升性能' },
          { value: '✅测试', name: '测试:    添加一个测试' },
          { value: '🔧工具', name: '工具:    开发工具变动(构建、脚手架工具等)' },
          { value: '⏪回滚', name: '回滚:    代码回退' }
        ],
        scopes: [
          { name: 'leetcode' },
          { name: 'javascript' },
          { name: 'typescript' },
          { name: 'Vue' },
          { name: 'node' }
        ],
        // it needs to match the value for field type. Eg.: 'fix'
        /*  scopeOverrides: {
          fix: [
            {name: 'merge'},
            {name: 'style'},
            {name: 'e2eTest'},
            {name: 'unitTest'}
          ]
        },  */
        // override the messages, defaults are as follows
        messages: {
          type: '选择一种你的提交类型:',
          scope: '选择一个scope (可选):',
          // used if allowCustomScopes is true
          customScope: 'Denote the SCOPE of this change:',
          subject: '短说明:\n',
          body: '长说明，使用"|"换行(可选)：\n',
          breaking: '非兼容性说明 (可选):\n',
          footer: '关联关闭的issue，例如：#31, #34(可选):\n',
          confirmCommit: '确定提交说明?(yes/no)'
        },
        allowCustomScopes: true,
        allowBreakingChanges: ['特性', '修复'],
        // limit subject length
        subjectLimit: 100
      }
    ```

    在 `package.json` 中，将原来commit配置，变更为自定义配置

    ```json
    "config": {
        "commitizen": {
            "path": "node_modules/cz-customizable"
        }
    }
    ```

    然后提交会编程这样

    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eeb9e9ee261f428ab1217bda629a3633~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)


#### 10. Vite 如何处理各种静态资源

静态资源处理是前端工程化中经常遇到的问题，在真实的工程中不仅仅包含动态执行的代码，还有许多静态资源的处理，包括图片，视频，JSON，Worker文件，font 字体图标等。

然而静态资源在标准意义上不算是模块，无论是Webpack，还是 Vite，都在做的一件事情就是将静态资源转化为模块进行解析和加载。所以对待静态资源的处理和普通代码是有区别的。

一方面是要解决静态资源加载的问题，另一方面则是在生产环境下需要考虑部署问题、资源体积、网络性能开销，并采取相关方案进行优化处理。