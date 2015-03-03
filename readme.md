# KR-PLUS

## 安装说明

* 安装[Node.js ](http://nodejs.org/)
* 在当前目录下执行命令` npm install `
* 安装bower	`npm install -g bower`
* 执行命令 `bower install`

## 启动页面

执行命令 `gulp`

## Livereload

需要在chrome中安装插件

地址：[Livereload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
)

## 端口

默认端口为**9000**，可在**gulpfile.js**自行修改

- 404 页面
- 500 页面


## 三方插件
上传： [angular-file-upload](https://github.com/danialfarid/angular-file-upload)

## DictionaryService使用说明

* 所有跟后端共用的静态数据放在 /scripts/config/dictionary.js 中， 发布前端代码时从后端接口中请求数据更新
* 会自动创建对应的value -> desc的filter， 命名为：dict_XXXXXXX

```
	<div class="role">{{item.level | dict_EmployeeType}}</div>
	<!-- 0 -> 联合创始人 -->
```

* 获取下拉框的选项：

```
	//JS
	$scope.phaseOptions = DictionaryService.getDict('FinancePhase');
```
```
	<!-- HTML -->
	<select class="form-control" name="phase" ng-model="finance.draft.phase" ng-options="c.value as c.desc for c in phaseOptions"></select>
```


## 静态数据

* 静态数据放在 /scripts/config/constant.js 中，包含下面这些
* yearOptions
* monthOptions


## 环境安装

