/**
 * Controller Name: SearchController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('InvestorValidateApplyController',

    function(OrganizationService,CompanyService,$state,$scope,SuggestService,$q, SearchService,DictionaryService,ErrorService,DefaultService,$upload,checkForm,$timeout,UserService,$location,InvestorauditService,monthOptions,yearOptions,AndroidUploadService) {
        $scope.investorValidateApply = {
            status:''
        }
        //用户是否登录
        //if(!UserService.getUID()){
        //    location.href = "/user/login?from=" + encodeURIComponent(location.href);
        //    return;
        //}

        //用户个人信息是否满足条件
        //UserService.isProfileValid(function(response){
        //    if(!response){
        //        $state.go('guide.welcome');
        //        return false;
        //    }
        //});

        //android客户端
        $scope.androidUpload = AndroidUploadService.setClick(function(filename){
            $scope.$apply(function(){
                $scope.intro.value.pictures = filename;
            })

        });

        /*查询投资人认证申请状态*/
        InvestorauditService.queryStatus({},function(response){
            switch(response.status){
                /*审核中*/
                case 0:
                 $scope.investorValidateApply.status = 'checking';
                    break;
                /*审核通过*/
                case 1 :
                    $scope.investorValidateApply.status = 'success';
                    break;
                default:
                    break;
            }
        },function(err){
            ErrorService.alert(err);
        });

        $timeout(function(){
            window.scroll(0,0);
        },0);

        document.title="36氪投资人认证申请";
        WEIXINSHARE = {
            shareTitle: "36氪投资人认证申请",
            shareDesc: "投资人认证申请",
            shareImg: 'http://krplus-pic.b0.upaiyun.com/36kr_new_logo.jpg'
        };
        InitWeixin();
        var Error = {
            show:function(msg){
                $scope.error.msg = msg;
                $scope.error.code = 1;
            },
            hide:function(){
                $scope.error.code = 0;
            }
        }
        //产品状态字典
        $scope.operationStatus = DictionaryService.getDict('CompanyOperationStatus');
        //获取工作职位
        $scope.workPositionType = DictionaryService.getDict('WorkPositionType');
        $scope.orgPositionType = DictionaryService.getDict('OrgPositionType');

        //获取年月份
        $scope.yearOptions = yearOptions;
        $scope.monthOptions = monthOptions;

        //机构suggest

        $scope.suggestOrganization = {
            add: []
        }

        $scope.autocomplete_options_organization = {
            suggest: suggest_state_remote_organization,
            on_error: console.log,
            on_detach: function (cs) {
                if(($scope.organizationList.data[0].name === $scope.organization.addForm.name) && !$scope.organizationList.data[0].status) {
                    $scope.organization.isAdd = false;
                    var organization = $scope.organizationList.data[0];
                    $scope.organization.addForm.name = organization.name;
                    $scope.organization.addForm.id = organization.id;
                    return;
                }

                $scope.organization.isAddExperience = true;
                $scope.organization.isAdd = true;
                $scope.organization.addForm.id = 0;
            },
            on_select: function (selected) {
                if (selected.obj.status != 'add') {
                    $scope.organization.isAdd = false;
                    var organization = selected.obj;
                    $scope.organization.addForm.name = organization.name;
                    $scope.organization.addForm.id = organization.id;
                } else {
                    $scope.organization.isAdd = true;
                    $scope.organization.addForm.name = selected.obj.value;
                    $scope.organization.addForm.id = 0;
                }
            }
        }
        function suggest_state_organization(data) {
            //var q = term.toLowerCase().trim();
            var results = data.map(function (item) {//krplus-pic.b0.upaiyun.com/default_logo.png!30" src="//krplus-pic.b0.upaiyun.com/default_logo.png!30
                var logo = item.logo ? item.logo : '//krplus-pic.b0.upaiyun.com/default_logo.png!30" src="//krplus-pic.b0.upaiyun.com/default_logo.png!30',
                    //label = '<img src="' + logo + '">' + '<span>' + item.name + '</span>';
                    label

                if(item.status!='add'){
                    label = '<div class="coList"><img src="' + logo + '">' + item.name + '</div>';
                }else{
                    label = '<div class="newCo">'+'<span>创建 </span> “'+ item.name + '”</div>';
                }

                return {
                    label: label,
                    value: item.name,
                    obj: item,
                    logo: item.logo
                }
            });

            return results;
        }
        function suggest_state_remote_organization(term) {
            var deferred = $q.defer();
            var q = term.toLowerCase().trim();

            SuggestService.query({
                wd: q,
                sub: 'institution'
            }, function (data) {
                $scope.organizationList = data;
                var exist = data.data.filter(function (item) {
                    return item.name.toLowerCase() == q.toLowerCase();
                });
                if (!exist.length) {
                    data.data.push({
                        name: q,
                        id:'',
                        type:'',
                        status: 'add',
                        value: q
                    })
                }
                deferred.resolve(suggest_state_organization(data.data));
            }, function () {

            });
            return deferred.promise;
        }

        //公司suggest
        $scope.suggest = {
            add: []
        }
        $scope.autocomplete_options = {
            suggest: suggest_state_remote,
            on_error: console.log,
            on_detach: function (cs) {
            },
            on_select: function (selected) {
                if (selected.obj.status != 'add') {
                    $scope.company.isAdd = false;
                    var company = selected.obj;
                    $scope.company.addForm.name = company.name;
                    $scope.company.addForm.id = company.id;
                } else {
                    $scope.company.isAdd = true;
                    $scope.company.addForm.name = selected.obj.value;
                    $scope.company.addForm.id = 0;
                }

            }
        }
        function suggest_state(data) {
            //var q = term.toLowerCase().trim();
            var results = data.map(function (item) {//krplus-pic.b0.upaiyun.com/default_logo.png!30" src="//krplus-pic.b0.upaiyun.com/default_logo.png!30
                var logo = item.logo ? item.logo : '//krplus-pic.b0.upaiyun.com/default_logo.png!30" src="//krplus-pic.b0.upaiyun.com/default_logo.png!30',
                    //label = '<img src="' + logo + '">' + '<span>' + item.name + '</span>';
                    label

                if(item.status!='add'){
                    label = '<div class="coList"><img src="' + logo + '">' + item.name + '</div>';
                }else{
                    label = '<div class="newCo">'+'<span>创建 </span> “'+ item.name + '”</div>';
                }

                return {
                    label: label,
                    value: item.name,
                    obj: item,
                    logo: item.logo
                }
            });

            return results;
        }
        function suggest_state_remote(term) {
            var deferred = $q.defer();
            var q = term.toLowerCase().trim();

            $scope.company.isAddExperience = true;
            $scope.company.addForm.name = term;
            $scope.company.addForm.id = 0;


            SuggestService.query({
                wd: q,
                sub: 'company'
            }, function (data) {
                var exist = data.data.filter(function (item) {
                    return item.name.toLowerCase() == q.toLowerCase();
                });

                deferred.resolve(suggest_state(data.data));
            }, function () {

            });
            return deferred.promise;
        }
        //任职公司
        $scope.company = {
            isAddExperience:false,
            isAdd:false,
            form:{
                startYear:'',
                startMonth:'',
                position:'',
                positionDetail:''
            },
            addForm:{
                id:'',
                name:'',
                brief:'',
                operationStatus:'OPEN'
            },
            response:{
                data:[]
            },
            choose:function(){
                var companyId = $scope.company.form.id,
                    companyData = $scope.company.response.data,
                    company = {};

                if(companyId == 0){
                    $scope.company.isAddExperience = true;
                    $scope.company.form.position = '';
                    $scope.company.form.positionDetail = '';
                    $scope.company.form.startYear = '';
                    $scope.company.form.startMonth = '';
                    $scope.company.form.groupName='';

					$scope.company.addForm.id = '';
					$scope.company.addForm.name = '';
					$scope.company.addForm.website = '';
					$scope.company.addForm.brief = '';
					$scope.company.addForm.operationStatus = 'OPEN';
                    return false;
                }
                $scope.company.isAddExperience = false;
                $scope.company.isAdd = false;

                angular.forEach(companyData,function(item){
                    if(companyId == item.id){
                        company = item;
                        return true;
                    }

                });
                var startDate = new Date(company.startDate);
                $scope.company.form.groupId = company.groupId;
                $scope.company.form.groupName=company.groupName;
                $scope.company.form.position = company.position;
                $scope.company.form.positionDetail = company.positionDetail;
                $scope.company.form.startYear = startDate.getFullYear() +'';
                $scope.company.form.startMonth = 1 + startDate.getMonth()+'';

            },
            loadData:function(){
                //获取当前用户在职公司工作经历
                UserService.getCurrentWorkCompanys(UserService.getUID(),function(response){
                    console.log('获取当前用户在职公司工作经历',response);
                    $scope.company.response.data = angular.copy(response.expList);

					if(!response.expList.length){
                        $scope.company.form.id = 0;
						$scope.company.isAddExperience = true;
					}

                    $scope.company.response.data.push({
                         id:0,
                         groupName:'新增经历'
                    });

                    /*if($scope.company.response.data.length){
                        var company = response.expList[0];
                        $scope.company.form.id = company.id;
                        $scope.company.form.groupId = company.groupId;
                        $scope.company.form.position = company.position;
                        $scope.company.form.positionDetail = company.positionDetail;
                        var startDate = new Date(company.startDate);
                        $scope.company.form.startYear = startDate.getFullYear()+'';
                        $scope.company.form.startMonth = 1 + startDate.getMonth()+'';
                    }*/
                },function(err){
                    ErrorService.alert(err);
                });
            }

        };
        $scope.company.loadData();
        //任职机构
        $scope.organization = {
            isAddExperience:false,
            isAdd:false,
            form:{
                startYear:'',
                startMonth:'',
                position:''
            },
            addForm:{
                id:'',
                name:'',
                brief:'',
				enName:'',
				website:''
            },
            response:{
                data:[]
            },
            choose:function(){
                var orId = $scope.organization.form.id,
                    organizationData = $scope.organization.response.data,
                    organization = {};


                //新增机构工作经历
                if(orId == 0){
                    $scope.organization.isAddExperience = true;
                    $scope.organization.form.position = '';
                    $scope.organization.form.startYear = '';
                    $scope.organization.form.startMonth = '';

					$scope.organization.addForm.id = '';
					$scope.organization.addForm.enName = '';
					$scope.organization.addForm.name = '';
					$scope.organization.addForm.website = '';
					$scope.organization.addForm.brief = '';
                    return false;
                }
                $scope.organization.isAddExperience = false;
                $scope.organization.isAdd = false;

                angular.forEach(organizationData,function(item){
                    if(orId == item.id){
                        organization = item;
                        return true;
                    }

                });
                var startDate = new Date(organization.startDate);
                $scope.organization.form.groupId = organization.groupId;
                $scope.organization.form.position = organization.position;
                $scope.organization.form.startMonth =  1 + startDate.getMonth()+'';
                $scope.organization.form.startYear = startDate.getFullYear() +'';
            },
            loadData:function(){
                //获取当前用户在职机构工作经历
                UserService.getCurrentWorkOrganizations(UserService.getUID(),function(response){
                    $scope.organization.response.data = angular.copy(response.expList);

					if(!response.expList.length){
                        $scope.organization.form.id = 0;
						$scope.organization.isAddExperience = true;
					}

                    $scope.organization.response.data.push({
                         id:0,
                         groupName:'新增经历'
                    });

                    /*if($scope.organization.response.data.length){
                        var organization = angular.copy($scope.organization.response.data[0]);
                        $scope.organization.form.id = organization.id;
                        var startDate = new Date(organization.startDate);
                        $scope.organization.form.position = organization.position;
                        $scope.organization.form.groupId = organization.groupId;
                        $scope.organization.form.startYear = startDate.getFullYear()+'';
                        $scope.organization.form.startMonth = 1 + startDate.getMonth()+'';
                    }*/

                },function(err){
                    ErrorService.alert(err);
                });
            }

        };
        $scope.organization.loadData();
        //投资人认证表单
        $scope.intro = {};
        $scope.intro.value = {
            intro:"",
            pictures:""
        };
        /*错误信息提示*/
        $scope.error = {
            code:0, //0为不显示，非0显示错误信息
            msg:''
        };
        /*选中的投资阶段*/
        $scope.stageList = [];
        /*选中的领域*/
        $scope.areaList = [];


        $scope.valStatus = "normal";
        $scope.hasClick = false;


        /*投资人认证申请*/
        $scope.invest = {
            id:'',/*用户id*/
            name:'',/*真实姓名*/
            intro:'',/*一句话简介*/
            investorRole:'PERSONAL_INVESTOR',/*投资身份*/
            businessCard:'',/*名片*/
            fundsPhases:'',/*投资阶段*/
            investorFocusIndustrys:'',/*关注领域*/
            usdInvestMin:'',/*个人美元投资下限*/
            usdInvestMax:'',/*个人美元投资上限*/
            cnyInvestMin:'',/* 个人人民币投资下限*/
            cnyInvestMax:'',/*个人人民币投资上限*/
            fundUsdInvestMin:'',/*基金美元投资下限*/
            fundUsdInvestMax:'',/*基金美元投资上限*/
            fundCnyInvestMin:'',/*基金人民币投资下限*/
            fundCnyInvestMax:'',/*基金人民币投资上限*/
            mainCurrency:'USD',/*主投币种 CNY:人民币 USD:美元*/
            businessCardLink:'',/*名片*/
        }
        /*投资阶段*/
        $scope.invest.fundsPhases = [
            {
                name:"天使轮",
                engName:"ANGEL",
                active:false
            },{
                name:"Pre-A轮",
                engName:"PRE_A",
                active:false
            },{
                name:"A轮",
                engName:"A",
                active:false
            },{
                name:"B轮",
                engName:"B",
                active:false
            },{
                name:"C轮",
                engName:"C",
                active:false
            },{
                name:"D轮",
                engName:"D",
                active:false
            },{
                name:"E轮及以后",
                engName:"E",
                active:false
            }

        ];
        /*关注领域*/
        $scope.invest.investorFocusIndustrys = DictionaryService.getDict('InvestorFollowedIndustry');
        /*获取用户默认的关注领域和投资阶段的数据*/
        UserService.basic.get({
            id:UserService.getUID()
        },function(data){
            /*基本信息*/
            $scope.invest.name = data.name;
            $scope.invest.intro = data.intro;
            /*关注领域数据处理*/
            if(data.industry && data.industry.length){
                angular.extend($scope.areaList,data.industry);
                angular.forEach(data.industry,function(o,i){
                    angular.forEach($scope.invest.investorFocusIndustrys,function(key,index){
                        if(key.value == o){
                            key.active = true;
                        }
                    });
                });
            }
            /*投资阶段数据处理*/
            angular.forEach(data.investPhases,function(val){
                angular.forEach($scope.invest.fundsPhases,function(item){
                    if(val == item.engName){
                        item.active = true;
                    }
                });
            });
            /*单笔可投额度*/
            $scope.invest.cnyInvestMax      =   data.investorSettings.cnyInvestMax;
            $scope.invest.cnyInvestMin      =   data.investorSettings.cnyInvestMin;
            $scope.invest.fundCnyInvestMax  =   data.investorSettings.fundCnyInvestMax;
            $scope.invest.fundCnyInvestMin  =   data.investorSettings.fundCnyInvestMin;
            $scope.invest.fundUsdInvestMax  =   data.investorSettings.fundUsdInvestMax;
            $scope.invest.fundUsdInvestMin  =   data.investorSettings.fundUsdInvestMin;
            $scope.invest.usdInvestMax      =   data.investorSettings.usdInvestMax;
            $scope.invest.usdInvestMin      =   data.investorSettings.usdInvestMin;

        },function(err){
            ErrorService.alert(err);
        });
        /*更改投资阶段被选中状态*/
        $scope.selectStage = function(index){
            angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("stageEmpty",true);
            $scope.invest.fundsPhases[index].active = !$scope.invest.fundsPhases[index].active;
        }
        /*更改选择领域*/
        $scope.selectArea = function(index){
            if($scope.areaList.length == 3 && $scope.areaList.indexOf($scope.invest.investorFocusIndustrys[index].value) < 0){
                return;
            }else{
                 angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("industyEmpty",true);
                $scope.areaList = [];
                $scope.invest.investorFocusIndustrys[index].active = !$scope.invest.investorFocusIndustrys[index].active;
                angular.forEach($scope.invest.investorFocusIndustrys,function(obj,i){
                    if(obj.active && $scope.areaList.indexOf($scope.invest.investorFocusIndustrys[i].value) < 0){
                        $scope.areaList.push($scope.invest.investorFocusIndustrys[i].value);
                    }
                });
            }
        }
        /*上传名片*/
        $scope.imgFileSelected  = function(files, e){
            var upyun = window.kr.upyun;
            if(files[0].size > 5 * 1024 * 1024){
                ErrorService.alert({
                    msg:"图片大于5M"
                });
                return;
            }
            $scope.intro.value.pictures = "";
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.intro.uploading = true;
                $scope.intro.progress = 0;
                DefaultService.getUpToken({
                    'x-gmkerl-type': 'fix_width', //限定宽度,高度自适应
                    'x-gmkerl-value': '900',      //限定的宽度的值
                    'x-gmkerl-unsharp': true
                }).then(function (data) {
                    $scope.upload = $upload.upload({
                        url: upyun.api + '/' + upyun.bucket.name,
                        data: data,
                        file: file,
                        withCredentials: false
                    }).progress(function (evt) {
                        $scope.intro.progress = evt.loaded * 100 / evt.total;
                    }).success(function (data, status, headers, config) {
                        var filename = data.url.toLowerCase();
                        if(filename.indexOf('.jpg') != -1 || (filename.indexOf('.png') != -1) || filename.indexOf('.jpeg') != -1) {
                            $scope.intro.value.pictures = window.kr.upyun.bucket.url + data.url;
                            //隐藏提示信息
                            angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("picEmpty",true);

                        } else {
                            ErrorService.alert({
                                msg: '格式不支持，请重新上传！'
                            });
                        }
                        $scope.intro.uploading = false;
                    }).error(function(){
                        ErrorService.alert({
                            msg: '格式不支持，请重新上传！'
                        });
                        $scope.intro.uploading = false;
                    });
                }, function (err) {
                    $scope.intro.uploading = false;
                    ErrorService.alert(err);
                });
            }
        };
        /*表单提交*/
        $scope.submitForm = function(){
                //创建公司
                function createCompany(data){
                    var deferred = $q.defer();
                    CompanyService.save(data,function(response){
                        deferred.resolve(response);
                    },function(error){
                        deferred.reject(error);
                    });
                    return deferred.promise;
                }
                //创建机构
                function createOrganization(data){
                    var deferred = $q.defer();
                    OrganizationService.save(data,function(response){
                        deferred.resolve(response);
                    },function(err){
                        deferred.reject(err);
                    });
                    return deferred.promise;
                }

                //创建任职经历
                function createExperience(data){
                    var deferred = $q.defer();
                    UserService.addWorkExperience(data,function(response){
                        deferred.resolve(response);
                    },function(err){
                        deferred.reject(err);
                    });
                    return deferred.promise;
                }
                //更新任职经历
                function updateExperience(data){
                    var deferred = $q.defer();
                    UserService.updateWorkExperience(data,function(response){
                        deferred.resolve(response);
                    },function(err){
                        deferred.reject(err);
                    });
                    return deferred.promise;
                }

            //隐藏自定义错误信息
            Error.hide();
            if($scope.intro.value.pictures){
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("picEmpty",true);
            }else{
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("picEmpty",false);
            }
            /*检查投资阶段是否选择，给出相应提示*/
            $scope.stageList = [];
            angular.forEach($scope.invest.fundsPhases,function(key,index){
                if(key.active){
                    $scope.stageList.push(key);
                }
            });
            if(!$scope.stageList.length){
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("stageEmpty",false);
            }else{
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("stageEmpty",true);
            }
            /*检查选择领域是否选择，给出相应提示*/
            if(!$scope.areaList.length){
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("industyEmpty",false);
            }else{
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("industyEmpty",true);
            }
            var isPersonal = ($scope.invest.cnyInvestMin || $scope.invest.cnyInvestMax || $scope.invest.usdInvestMin || $scope.invest.usdInvestMax),
                isFund     = ($scope.invest.fundCnyInvestMin || $scope.invest.fundCnyInvestMax || $scope.invest.fundUsdInvestMin || $scope.invest.fundUsdInvestMax);
            /*检查单笔可投额度*/
            if(isPersonal){
                /*个人*/
                if(($scope.invest.cnyInvestMin && $scope.invest.cnyInvestMax) || (!$scope.invest.cnyInvestMin && !$scope.invest.cnyInvestMax)){
                    Error.hide();
                }else{
                    Error.show("请填写单笔可投额");
                    return false;
                }
                if(($scope.invest.usdInvestMin && $scope.invest.usdInvestMax) || (!$scope.invest.usdInvestMin && !$scope.invest.usdInvestMax)){
                    Error.hide();
                }else{
                    Error.show("请填写单笔可投额");
                    return false;
                }
            }
            if (isFund){
                /*基金*/
                if(($scope.invest.fundCnyInvestMin && $scope.invest.fundCnyInvestMax) || (!$scope.invest.fundCnyInvestMin && !$scope.invest.fundCnyInvestMax)){
                    Error.hide();
                }else{
                    Error.show("请填写单笔可投额");
                    return false;
                }
                if(($scope.invest.fundUsdInvestMin && $scope.invest.fundUsdInvestMax) || (!$scope.invest.fundUsdInvestMin && !$scope.invest.fundUsdInvestMax)){
                    Error.hide();
                }else{
                    Error.show("请填写单笔可投额");
                    return false;
                }
            }
            if(!isPersonal && !isFund){
                 Error.show("请填写单笔可投额");
                 return false;
            }
            /*检查表单填写是否正确*/
            if(!checkForm("investorValidateForm")) return;

            var investoraudit = {};
                investoraudit['id'] = UserService.getUID();
                investoraudit['name']   = $scope.invest.name;
                investoraudit['investorRole']   = $scope.invest.investorRole;
                investoraudit['intro']   = $scope.invest.intro;
                /*投资阶段*/
                investoraudit['fundsPhases'] = [];
                angular.forEach($scope.invest.fundsPhases,function(val,key){
                    if(val.active){
                        investoraudit['fundsPhases'].push(val.engName);
                    }
                });
                /*关注领域*/
                investoraudit['investorFocusIndustrys']  = $scope.areaList;
                /*主投资币种*/
                investoraudit['mainCurrency'] = $scope.invest.mainCurrency;
                /*个人*/
                investoraudit['cnyInvestMin']   = $scope.invest.cnyInvestMin;
                investoraudit['cnyInvestMax']   = $scope.invest.cnyInvestMax;
                if(parseFloat(investoraudit['cnyInvestMin']) > parseFloat(investoraudit['cnyInvestMax'])){
                    Error.show("投资额下限不能大于上限值");
                    return false;
                }
                /*基金*/
                investoraudit['fundCnyInvestMin']   = $scope.invest.fundCnyInvestMin;
                investoraudit['fundCnyInvestMax']   = $scope.invest.fundCnyInvestMax;
                if(parseFloat(investoraudit['fundCnyInvestMin']) > parseFloat(investoraudit['fundCnyInvestMax'])){
                    Error.show("投资额下限不能大于上限值");
                    return false;
                }
                /*个人*/
                investoraudit['usdInvestMin']   = $scope.invest.usdInvestMin;
                investoraudit['usdInvestMax']   = $scope.invest.usdInvestMax;

                if(parseFloat(investoraudit['usdInvestMin'])  > parseFloat(investoraudit['usdInvestMax'])){
                     Error.show("投资额下限不能大于上限值");
                    return false;
                }
                /*基金*/
                investoraudit['fundUsdInvestMin']   = $scope.invest.fundUsdInvestMin;
                investoraudit['fundUsdInvestMax']   = $scope.invest.fundUsdInvestMax;
                if(parseFloat(investoraudit['fundUsdInvestMin'])  > parseFloat(investoraudit['fundUsdInvestMax'])){
                     Error.show("投资额下限不能大于上限值");
                    return false;
                }
                /*名片*/
                investoraudit['businessCardLink']   = $scope.intro.value.pictures;
                //$scope.hasClick = true;

                //判断投资身份
                var investorRole  = $scope.invest.investorRole;
                switch(investorRole){
                    //任职机构
                    case 'ORG_INVESTOR':{
                        console.log('---任职机构');
                        if($scope.organization.isAddExperience){
                            if($scope.organization.isAdd){
                                //快速创建机构
                                var data = {};
                                    data['name'] = $scope.organization.addForm['name'];
                                    data['enName'] = $scope.organization.addForm['enName'];
                                    data['brief'] = $scope.organization.addForm['brief'];
                                    data['website'] = $scope.organization.addForm['website'];
                                    data['source'] = 'INVESTOR_AUDIT';

                                var createOrganizationPromise = createOrganization(data);
                                createOrganizationPromise.then(function(response){
                                    console.log('---公司返回数据--',response);
                                    //创建经历
                                    var expData = {};
                                        expData['uid'] = UserService.getUID();
                                        expData['groupIdType'] = 2;
                                        expData['current'] = true;
                                        expData['groupId'] = response.id;
                                        expData['position'] = $scope.organization.form.position;
                                        expData['startDate'] = $scope.organization.form.startYear +'-'+$scope.organization.form.startMonth+'-01 01:01:01';
                                        console.log('---要提交的创建经历数据--',expData);

                                    var createExperiencePromise = createExperience(expData);
                                    createExperiencePromise.then(function(response){
                                        console.log('--创建经历成功--');
                                        //提交总数据
                                        send(response.id);
                                    },function(err){
                                        console.log('--创建经历失败--');
                                    });
                                },function(err){
                                    /*fixme 增加错误提示*/
                                    ErrorService.alert({
                                        msg: '对不起，该机构不符合平台收录标准'
                                    });
                                    console.log('---创建公司失败--',err,err.msg.indexOf('10次'),err.msg.indexOf("不符合"));
                                });
                            }else{
                                //创建经历
                                    var expData = {};
                                        expData['uid'] = UserService.getUID();
                                        expData['groupIdType'] = 2;
                                        expData['current'] = true;
                                        expData['groupId'] = $scope.organization.addForm.id;
                                        expData['position'] = $scope.organization.form.position;
                                        expData['startDate'] = $scope.organization.form.startYear +'-'+$scope.organization.form.startMonth+'-01 01:01:01';

                                console.log('---要提交的创建经历数据--',expData);

                                var createExperiencePromise = createExperience(expData);
                                createExperiencePromise.then(function(response){
                                    console.log('--创建经历成功--');
                                    //提交总数据
                                    send(response.id);
                                },function(err){
                                    console.log('--创建经历失败--');
                                });
                            }
                        }else{
                            //更新任职经历
                            var expData = {};
                                expData['uid'] = UserService.getUID();
                                expData['groupIdType'] = 2;
                                expData['current'] = true;
                                expData['id'] = $scope.organization.form.id;
                                expData['groupId'] = $scope.organization.form.groupId;
                                expData['position'] = $scope.organization.form.position;
                                expData['startDate'] = $scope.organization.form.startYear +'-'+$scope.organization.form.startMonth+'-01 01:01:01';

                                console.log('---提交更新任职经历数据--',expData);

                                var updateExperiencePromise = updateExperience(expData);
                                updateExperiencePromise.then(function(response){
                                    console.log('--更新经历成功--');
                                    //提交总数据
                                    send(response.id);
                                },function(err){
                                    console.log('--更新经历失败--');
                                });
                        }

                    }
                    break;
                    //任职公司
                    case 'COMPANY_INVEST_DEPT':{
                        console.log('---任职公司');
                        if($scope.company.isAddExperience){
                            if($scope.company.isAdd){
                                //创建经历
                                var expData = {};
                                expData['uid'] = UserService.getUID();
                                expData['groupIdType'] = 3;
                                expData['current'] = true;
                                expData['groupId'] = 0;
                                expData['groupName'] = $scope.company.addForm.name;
                                expData['position'] = $scope.company.form.position;
                                expData['positionDetail'] = $scope.company.form.positionDetail;
                                expData['startDate'] = $scope.company.form.startYear +'-'+$scope.company.form.startMonth+'-01 01:01:01';
                                console.log('---要提交的创建经历数据--',expData);

                                var createExperiencePromise = createExperience(expData);
                                createExperiencePromise.then(function(response){
                                    console.log('--创建经历成功--');
                                    //提交总数据
                                    send(response.id);
                                },function(err){
                                    console.log('--创建经历失败--');
                                });

                            }else{
                                console.log('---company---',$scope.company);
                                //创建经历
                                    var expData = {};
                                        expData['uid'] = UserService.getUID();
                                        expData['groupIdType'] = 3;
                                        expData['current'] = true;
                                        expData['groupId'] = $scope.company.addForm.id;
                                        expData['groupName'] = $scope.company.form.groupName;
                                        expData['position'] = $scope.company.form.position;
                                        expData['positionDetail'] = $scope.company.form.positionDetail;
                                        expData['startDate'] = $scope.company.form.startYear +'-'+$scope.company.form.startMonth+'-01 01:01:01';

                                console.log('---要提交的创建经历数据--',expData);

                                var createExperiencePromise = createExperience(expData);
                                createExperiencePromise.then(function(response){
                                    console.log('--创建经历成功--');
                                    //提交总数据
                                    send(response.id);
                                },function(err){
                                    console.log('--创建经历失败--');
                                });
                            }
                        }else{
                            //更新任职经历
                            var expData = {};
                                expData['uid'] = UserService.getUID();
                                expData['groupIdType'] = 3;
                                expData['current'] = true;
                                expData['id'] = $scope.company.form.id;
                                expData['groupName'] = $scope.company.form.groupName;
                                expData['groupId'] = $scope.company.form.groupId;
                                expData['position'] = $scope.company.form.position;
                                expData['positionDetail'] = $scope.company.form.positionDetail;
                                expData['startDate'] = $scope.company.form.startYear +'-'+$scope.company.form.startMonth+'-01 01:01:01';

                                console.log('---提交更新任职经历数据--',expData);

                                var updateExperiencePromise = updateExperience(expData);
                                updateExperiencePromise.then(function(response){
                                    console.log('--更新经历成功--');
                                    //提交总数据
                                    send(response.id);
                                },function(err){
                                    console.log('--更新经历失败--');
                                });
                        }

                    }
                    break;
                    default:{
                        console.log('--个人投资人--');
                        send();
                    }
                }


                //发送投资人认证数据
                function send(workExpId){
                    if(workExpId){
                        investoraudit['workExpId'] = workExpId;
                    }
                    InvestorauditService.save(investoraudit,function(response){
                        $scope.investorValidateApply.status = 'checking';
                    },function(err){
                        $scope.hasClick = false;
                        ErrorService.alert(err);
                    });
                }

        };
		$scope.$watch('invest.investorRole',function(){
			$scope.organization.addForm.website = '';
			$scope.company.addForm.website = '';
		});
        /*监听事件*/
        $scope.changeMoney = function(fieldName){
             Error.hide();
            if(fieldName == 'cnyInvestMin' ||  fieldName == 'cnyInvestMax'){
                if(parseFloat($scope.invest.cnyInvestMin) > parseFloat($scope.invest.cnyInvestMax)){
                    Error.show("投资额下限不能大于上限值");
                }else{
                    Error.hide();
                }
            }else if(fieldName =='fundCnyInvestMin' || fieldName ==  'fundCnyInvestMax' ){
                if(parseFloat($scope.invest.fundCnyInvestMin) > parseFloat($scope.invest.fundCnyInvestMax)){
                     Error.show("投资额下限不能大于上限值");
                }else{
                    Error.hide();
                }
            }else if (fieldName == 'usdInvestMin' || fieldName == 'usdInvestMax'){
                if(parseFloat($scope.invest.usdInvestMin)  > parseFloat($scope.invest.usdInvestMax)){
                    Error.show("投资额下限不能大于上限值");
                }else{
                     Error.hide();
                }

            }else if(fieldName == 'fundUsdInvestMin' || fieldName == 'fundUsdInvestMax'){
                if(parseFloat($scope.invest.fundUsdInvestMin)  > parseFloat($scope.invest.fundUsdInvestMax)){
                     Error.show("投资额下限不能大于上限值");
                }else{
                    Error.hide();
                }
            }
        }

    }
);
