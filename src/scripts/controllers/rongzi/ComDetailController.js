var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('ComDetailController', ComDetailController);

function ComDetailController($modal, loading, $stateParams, RongziService, $state, UserService,
	ErrorService, hybrid, baseInfo, pojrectList) {
	var vm = this;
	vm.tabChange = tabChange;
	vm.shareWechat = shareWechat;
	vm.Aafter = false;
	vm.Abefore = true;
	vm.category = $stateParams.category;
	vm.state = $stateParams.state;
	vm.nameArr = [];
	vm.subscribe = subscribe;
	vm.needApp = true;
	vm.hasEmail = false;
	vm.openApp = openApp;
	vm.openAppUrl;
	vm.downloadMask = downloadMask;
	vm.inviteInvestor = inviteInvestor;
	init();

    function init() {
        loading.hide('findLoading');
        initData();
        if (!hybrid.isInApp) {
            initLinkme();
            vm.needApp = false;
        }
    }

    function tabChange(e) {
        var obj = angular.element(e.currentTarget);
        var id = obj.attr('id');
        obj.parent().children().removeClass('tab-org-selected');
        obj.addClass('tab-org-selected');
        if ('AAfter' === id) {
            vm.Aafter = true;
            vm.Abefore = false;
        } else if (('ABefore') === id) {
            vm.Aafter = false;
            vm.Abefore = true;
        }
    }

    function initWeixin(name) {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手·融资季】' + name + '优质项目输出，马上来对接！',
            shareUrl: window.location.href,
            krtou: 'weChatShare/' + $stateParams.id,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '每周2个创业社群精品项目选送，等你来约谈。',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function initData() {
        if (parseInt($stateParams.id)) {
            if (baseInfo.data) {
                vm.result = baseInfo.data;
                vm.name = baseInfo.data.name;
                vm.status = vm.result.status;
                initWeixin(vm.name);
                initTitle('融资季·' + baseInfo.data.name);
                vm.nameArr = vm.name.split('');
            }
        }

        if (UserService.getUID()) {
            if (pojrectList.data.projects) {
                vm.associations = pojrectList.data.projects.associations;
            }
            vm.canWeChatShare = pojrectList.data.canWeChatShare;
            vm.hasPermission = pojrectList.data.hasPermission;
            vm.remind = pojrectList.data.remind;
        }
    }

    function initTitle(t) {
        document.title = t;
    }

    function fail(err) {
        if (err.code === '403') {
            console.log(err.msg);
        } else if (err.code === '1') {
            ErrorService.alert(err.msg);
        }
    }

    function subscribe(item, e) {
        e.preventDefault();
        e.stopPropagation();
        item = item ? item : {};
        item.investRole = vm.investRole;
        item.hasEmail = vm.hasEmail;
        item.remindText = vm.name;
        if (!hybrid.isInApp) {
            defaultModal();
            clickSetTrack('SeasonDownloadClick', 'season_set_download', 'comdetail' + $stateParams.id);
        } else if (hybrid.isInApp && vm.remind === 1 && UserService.getUID()) {
            subscribeAction(item);
        } else if (UserService.getUID() && vm.remind === 0 && UserService.getUID()) {
            cancelSubscribeAction(item);
        } else {
            window.location.href = 'https://passport.36kr.com/pages';
        }
    }

    modalController.$inject = ['$modalInstance', 'obj', 'hybrid'];

    function modalController($modalInstance, obj, hybrid) {

        var vm = this;
        vm.item = obj;
        vm.cancelModal = cancelModal;
        vm.title = obj.title;
        vm.investRole = obj.investRole;
        vm.hasEmail = obj.hasEmail;
        vm.cancelMainRemind = obj.cancelMainRemind;
        vm.cancelRemindtxt = obj.cancelRemindtxt;
        vm.needApp = true;
        vm.setEmailState = false;
        vm.addEmail = addEmail;
        vm.remindText = obj.remindText;

        function cancelModal() {
            $modalInstance.dismiss();
        }

        function addEmail() {
            var senddata = {
                email: vm.emailInput,
            };
            if (vm.emailInput) {
                RongziService.setEmail(senddata)
                    .then(function setSussess() {
                        vm.title = '添加邮件提醒成功！';
                        vm.cancelRemindtxt = '当' + vm.remindText + '专场开始时，您将会收到包括邮件在内的所有提醒，' +
                            '确保您不会错过本专场';
                        vm.setEmailState = true;
                        vm.hasEmail = true;
                    })
                    .catch(fail);
            } else {
                $modalInstance.dismiss();
            }
        }
    }

    function subscribeAction(item) {
        var senddata = {
            id: vm.result.id,
            subscibeType: 1,
        };
        RongziService.setSubscribe(senddata)
            .then(function setSussess(data) {
                if (data.data.data) {
                    vm.hasEmail = true;
                }

                item.hasEmail = vm.hasEmail;
                item.cancelMainRemind = false;
                item.title = '设置开场提醒成功！';
                modalOpen(item);
                vm.remind = 0;
            })
            .catch(fail);
    }

    function cancelSubscribeAction(item) {
        var senddata = {
            id: vm.result.id,
            subscibeType: 1,
        };
        RongziService.cancelSubscribe(senddata)
            .then(function setSussess() {
                item.cancelMainRemind = true;
                item.title = '取消开场提醒成功！';
                item.hasEmail = true;
                item.cancelRemindtxt = '本专场开始前不会有开场提醒';
                modalOpen(item);
                vm.remind = 1;
            })
            .catch(fail);
    }

    function modalOpen(item) {
        $modal.open({
            templateUrl: 'templates/rongzi-common/remindAlert.html',
            windowClass: 'nativeAlert_wrap',
            controller: modalController,
            controllerAs: 'vm',
            resolve: {
                obj: function() {
                    return item;
                }
            }
        });
    }

    function openApp(ccid) {
        if (!hybrid.isInApp) {
            defaultModal();
        } else if (hybrid.isInApp && UserService.getUID() && ccid) {
            hybrid.open('crmCompany/' + ccid);
        }

    }

    function defaultModal(item) {
        item = item ? item : {};
        item.openUrl = vm.openAppUrl;
        $modal.open({
            templateUrl: 'templates/rongzi-common/downloadApp.html',
            windowClass: 'nativeAlert_wrap',
            controller: defaultController,
            controllerAs: 'vm',
            resolve: {
                obj: function() {
                    return item;
                }
            }
        });
    }

    defaultController.$inject = ['$modalInstance', 'obj'];

    function defaultController($modalInstance, obj) {

        var vm = this;
        vm.openUrl = obj.openUrl;
        vm.cancelModal = cancelModal;

        function cancelModal() {
            $modalInstance.dismiss();
        }
    }

    function initLinkme() {
        var krdata = {};
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/comdetail?id=' + $stateParams.id + '&category=' + $stateParams.category + '","currentRoom":"0"}';
        window.linkedme.init(window.projectEnvConfig.linkmeKey, {
            type: window.projectEnvConfig.linkmeType
        }, function(err, res) {
            if (err) {
                return;
            }

            window.linkedme.link(krdata, function(err, data) {
                if (err) {
                    // 生成深度链接失败，返回错误对象err
                    console.log(err);
                } else {
                    // 生成深度链接成功，深度链接可以通过data.url得到
                    //console.log(data.url,   $('#comm-openApp11').attr('href'));
                    vm.openAppUrl = data.url;
                }
            }, false);
        });
    }

	function shareWechat() {
		var _ab= 'before';
		if(vm.status === 'GOING' || vm.status === 'END') {
			_ab = 'after';
		};
		sa.track('SeasonShare', {
				target: 'share_wechat',
				befor_after: _ab,
				season_set_id: 'comdetail' + $stateParams.id,
				branch_id: 'comdetail',
		});

		if (!hybrid.isInApp) {
			defaultModal();
		} else if (hybrid.isInApp && !UserService.getUID()) {
			window.location.href = 'https://passport.36kr.com/pages';
		} else if (hybrid.isInApp && UserService.getUID()) {
			hybrid.open('weChatShare/' + $stateParams.id);
		}
	}

    function downloadMask() {
        clickSetTrack('SeasonDownloadClick', 'season_set_download', 'comdetail' + $stateParams.id);
        window.location.href = vm.openAppUrl;
    }

    function clickSetTrack(event, source, season_set_id) {
        var params = {
            source: source,
            client: 'H5',
            season_set_id: season_set_id
        }
        sa.track(event, params);
    };

	vm.clickSetTrack = function() {
		sa.track('SeasonDownloadClick', {
			source: 'season_set_download',
			client: 'H5',
			season_set_id: 'comdetail' + $stateParams.id,
		});
	};

	function inviteInvestor() {
		var _ab= 'before';
		if(vm.status === 'GOING' || vm.status === 'END') {
			_ab = 'after';
		};
		sa.track('SeasonShare',
			{
				target:'invite_investor',
				befor_after:_ab,
				season_set_id:'comdetail' + $stateParams.id,
				branch_id:'comdetail'
			});

		$state.go('rongzi.inviteInvestor', {
				category: vm.category
		});
	}
}
