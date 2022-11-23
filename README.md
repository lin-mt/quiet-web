# Quiet Web

Quiet 是一个关注于管理项目迭代以及项目文档的开源项目。

后端：https://github.com/lin-mt/quiet

## 快速开始

```shell
// 初始化项目
npm install

// 开发模式
npm run dev

// 构建
npm run build
```

## 技术栈

后端：Spring Cloud、Spring Data JPA、Dubbo 等

前端：Arco Design Pro 等

[项目图片示例](EXAMPLE.md)

![example](https://user-images.githubusercontent.com/58337359/203343775-d3d38dd8-a433-468a-9cd1-42318026ae9b.gif)

## 功能简介

### 仪表盘

**工作台**：考虑到每个团队的关注点和侧重点不一样，所以保留了 Arco Design Pro 的原 Demo 页面。

### 敏捷管理

**项目管理**：管理项目组和项目，项目可以归属于一个项目组，一个项目组中可以包含多个项目。个人空间中包含的是每个用户创建的，但是未规划到具体项目组的项目。

**版本规划**：管理项目的规划信息，包含版本和迭代的管理，每个版本下可以创建子版本和迭代，迭代是最小的规划单元，每个需求可以规划到迭代中，无法规划到版本中。

**需求规划**：管理项目中的所有需求，可以将需求规划到具体的迭代，每个需求只能规划到一个迭代中。

**迭代看板**：管理迭代中需求的拆分，一个需求可以拆分多个任务，每个任务都有自己的生命周期（可配置）。在此可以开始和结束一个迭代，如果在迭代结束时，还有需求未完成（需求中所有任务的状态都在最后一个任务步骤中），则在结束迭代时未完成的需求需要规划到指定的其他未结束的迭代中。

**模板管理**：在创建项目时，可以选择不同模板，模板中包含创建需求时可选择的优先级，每个优先级对应需求卡片的不同颜色，可配置的颜色中包含自适应色板（适配项目的暗色和亮色模式），任务的生命周期也是可配置的。

### 文档管理

**项目管理**：管理文档的项目信息，与敏捷管理中的项目管理类似。

**接口文档**：管理项目的接口信息，该部分参考了 [YApi](https://github.com/YMFE/yapi) 的接口预览、编辑和调试，页面布局与其类似。提供了定时导入 Swagger（OpenApi 3.0）的功能，可配置多个环境，调试时可选择不同的环境进行接口的测试，如无配置环境，则默认 http://127.0.0.1:9363 。

### 系统管理

**用户管理**：管理系统中的用户信息。

**部门管理**：管理部门信息。

**团队管理**：管理团队信息，在敏捷管理中创建项目时，可选择负责该项目的团队。

**角色管理**：管理项目中的角色信息。

**数据字典**：管理项目中用到的数据字典，每个数据字典隶属于一种数据字典类型，数据字典的 key 设计为多层父子结构，每层的 key 为两位数字构成，每层最多可以包含 99 个数据字典。

**日历设置**：可设置每年中的节假日以及工作日。

## License

[GPL-3.0](https://github.com/lin-mt/quiet-web/blob/master/LICENSE.txt)
