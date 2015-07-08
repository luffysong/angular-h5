/**
 * Controller Name: SearchController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('InvestorValidateApplyController',
    function($scope, SearchService,DictionaryService,ErrorService,DefaultService,$upload,checkForm,$timeout,UserService,$location) {
        if(!UserService.getUID()){
            location.href = "/user/login?from=" + encodeURIComponent(location.href);
            return;
        }
        $timeout(function(){
            window.scroll(0,0);
        },0);
        document.title="36氪股权众筹";
        WEIXINSHARE = {
            shareTitle: "36氪股权众筹",
            shareDesc: "投资人认证申请",
            shareImg: 'http://krplus-pic.b0.upaiyun.com/36kr_new_logo.jpg'
        };
        InitWeixin();
        $scope.intro = {};
        $scope.intro.value = {
            intro:"",
            pictures:""
        };

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
            investorRole:'',/*投资身份*/
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

        $scope.addr2Options = [];
        /*跟投人认证信息回写*/
        UserService.get({
            id:'identity',
            sub: 'cert',
            subid: 'coinvestor-info'
        },{},function(data){


        },function(err){

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
                $scope.areaList = [];
                $scope.invest.investorFocusIndustrys[index].active = !$scope.invest.investorFocusIndustrys[index].active;
                angular.forEach($scope.invest.investorFocusIndustrys,function(obj,i){
                    if(obj.active && $scope.areaList.indexOf($scope.invest.investorFocusIndustrys[i].value) < 0){
                        $scope.areaList.push($scope.invest.investorFocusIndustrys[i].value);
                    }
                });

                console.log('$scope.areaList===>>>',$scope.areaList);

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
        $timeout(function(){
            $scope.$watch("[user.reIdCardNumber,user.idCardNumber]",function(from){
                if(angular.element($("form[name='investorValidateForm']")).length > 0){
                    if(from[0] != from[1]){
                        angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("idcardInvalid",false);
                    }else{
                        angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("idcardInvalid",true);
                    }
                }
            });
        },500);
        /*表单提交*/
        $scope.submitForm = function(){
            console.log('====invest====',$scope.invest);
            var investoraudit = {};
                investoraudit['id'] = $scope.invest.id;
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
                investoraudit['cnyInvestMan']   = $scope.invest.cnyInvestMan;
                /*基金*/
                investoraudit['fundCnyInvestMin']   = $scope.invest.fundCnyInvestMin;
                investoraudit['fundCnyInvestMax']   = $scope.invest.fundCnyInvestMax;

                /*个人*/
                investoraudit['usdInvestMin']   = $scope.invest.usdInvestMin;
                investoraudit['usdInvestMan']   = $scope.invest.usdInvestMan;
                /*基金*/
                investoraudit['fundUsdInvestMin']   = $scope.invest.fundUsdInvestMin;
                investoraudit['fundUsdInvestMax']   = $scope.invest.fundUsdInvestMax;

                /*名片*/
                investoraudit['businessCardLink']   = $scope.intro.value.pictures;

                console.log('======request===',investoraudit);

        };
    }
);
