/**
 * Service Name: UserService
 */

//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var angular = require('angular');

angular.module('defaultApp.service').service('UserService', [
    '$location', 'BasicService', 'dateFilter', 'appendTransform', '$http', '$cookies', '$stateParams', '$state',
    function ($location, BasicService, dateFilter, appendTransform, $http, $cookies, $stateParams, $state) {
        var service = BasicService('/api/user/:id/:sub/:subid', {
            save: {
                method: 'POST',
                transformRequest: appendTransform($http.defaults.transformRequest, function (data) {

                    delete data.status;

                    return data;
                }),
            },
            sendValidMail: {
                method: 'GET',
                params: {
                    sub: 'send-activate-email',
                },
            },
        }, {
            sub: [
                'followed',
                'basic',
                'base',
                'info',
                'investment',
                'company',
                'finacing',
                'work',
                'send-sms',
                'check',
                'gee'

                // "finance_sort",
                // "company_sort",

                // "work_sort"
            ],
        }, {
            basic: {
                get: {
                    method: 'GET',
                    params: {
                        mode: $stateParams.mode,
                    },
                    transformResponse: appendTransform($http.defaults.transformResponse, function (data) {
                        if (data.code === 0 &&
                                window.localStorage &&
                                (data.data.email || data.data.phone) &&
                                service.getUID() === data.data.id) {

                            localStorage.setItem('uemail', data.data.email);
                            localStorage.setItem('uphone', data.data.phone);
                            localStorage.setItem('investorType', data.data.investorType);

                        }

                        //if(typeof data.data.isDisplayWeixin!='undefined'){
                        //    data.data.isDisplayWeixin = data.data.isDisplayWeixin?true:false;
                        //}

                        return data;
                    }),
                },
                update: {
                    method: 'PUT',
                    transformRequest: appendTransform($http.defaults.transformRequest, function (data) {
                        if (!data.phone) {
                            delete data.phone;
                        }

                        if (data.city === '') {
                            data.city = 0;
                        }

                        if (data.country === '') {
                            data.country = 0;
                        }

                        try {
                            if (data.phone || data.email) {
                                localStorage.removeItem('uemail');
                                localStorage.removeItem('uphone');
                                localStorage.removeItem('investorType');
                                localStorage.removeItem('isEmailActivate');
                            }

                        }catch (e) {

                        }

                        //if(typeof data.isDisplayWeixin!='undefined'){
                        //    data.isDisplayWeixin = data.isDisplayWeixin?1:0;
                        //}
                        //try {
                        //    //编辑用户详情页基本信息
                        //    data.mode = $stateParams.mode;
                        //    data.data.data.schools = data.data.data.schools.map(function(v) {
                        //        return v.id;
                        //    }).join(',');
                        //} catch (e) {
                        //    //完善资料
                        //
                        //}

                        return data;
                    }),
                },
            },
            base: {
                update: {
                    method: 'PUT',
                    transformRequest: appendTransform($http.defaults.transformRequest, function (data) {

                        return data;
                    }),
                },
            },
            company: {
                query: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (data) {
                        data.data.expList.forEach(function (item) {
                            if (!item.startDate) {
                                return;
                            }

                            var startDate = new Date(item.startDate);
                            item.startYear = startDate.getFullYear() + '';
                            item.startMonth = startDate.getMonth() + 1 + '';
                            if (!item.endDate) {
                                return;
                            }

                            if (!item.isCurrent) {
                                var endDate = new Date(item.endDate);
                                item.endYear = endDate.getFullYear() + '';
                                item.endMonth = endDate.getMonth() + 1 + '';
                            }

                        });

                        return data;
                    }),
                },
                save: {
                    method: 'POST',
                    transformRequest: appendTransform($http.defaults.transformRequest, function (data) {
                        data.startDate = dateFilter(new Date([data.startYear, data.startMonth, '1'].join('/')), 'yyyy-MM-dd hh:mm:ss');

                        data.endDate = data.endYear ? dateFilter(new Date([data.endYear, data.endMonth, '1'].join('/')), 'yyyy-MM-dd hh:mm:ss') : '';

                        data.current = data.current || data.isCurrent;

                        return data;
                    }),

                    transformResponse: appendTransform($http.defaults.transformResponse, function (data) {

                        return data;
                    }),
                },
                update: {
                    method: 'PUT',
                    transformRequest: appendTransform($http.defaults.transformRequest, function (data) {
                        data.startDate = dateFilter(new Date([data.startYear, data.startMonth, '1'].join('/')), 'yyyy-MM-dd hh:mm:ss');

                        data.endDate = data.endYear ? dateFilter(new Date([data.endYear, data.endMonth, '1'].join('/')), 'yyyy-MM-dd hh:mm:ss') : '';

                        data.current = data.current || data.isCurrent;

                        return data;
                    }),

                    transformResponse: appendTransform($http.defaults.transformResponse, function (data) {

                        return data;
                    }),
                },
            },
            work: {
                save: {
                    method: 'POST',
                    transformRequest: appendTransform($http.defaults.transformRequest, function (data) {

                        var c;
                        if (data.groupIdType && data.groupId) {
                            data.startDate = data.startDate || [data.startYear, data.startMonth, '01'].join('-') + ' 01:01:01';
                            if (!data.isCurrent) {
                                data.endDate = data.endDate || [data.endYear, data.endMonth, '01'].join('-') + ' 01:01:01';
                                data.current = false;
                            }else {
                                data.current = true;
                            }

                            //如果是经过处理的接口直接返回
                            return data;
                        }

                        if (data.groupIdType === 3) {
                            c = data.company;
                            data.groupId = c.id;
                            data.position = c.position;
                            data.positionDetail = c.positionDetail;
                            data.groupIdType = data.groupIdType;
                            data.startDate = [c.startYear, c.startMonth, '01'].join('-') + ' 01:01:01';

                            if (!c.isCurrent) {
                                data.endDate = [c.endYear, c.endMonth, '01'].join('-') + ' 01:01:01';
                                data.isCurrent = false;
                            }else {
                                data.isCurrent = true;
                            }
                        }

                        if (data.groupIdType === 2) {
                            c = data.organization;
                            data.groupId = c.id;
                            data.position = c.position;
                            data.positionDetail = c.positionDetail;
                            data.groupIdType = data.groupIdType;
                            data.startDate = [c.startYear, c.startMonth, '01'].join('-') + ' 01:01:01';
                            if (!c.isCurrent) {
                                data.endDate = [c.endYear, c.endMonth, '01'].join('-') + ' 01:01:01';
                                data.isCurrent = false;
                            }else {
                                data.isCurrent = true;
                            }
                        }

                        data.current = data.current || data.isCurrent;

                        delete data.company;
                        delete data.organization;
                        return data;
                    }),

                    transformResponse: appendTransform($http.defaults.transformResponse, function (data) {

                        return data;
                    }),
                },
                update: {
                    method: 'PUT',
                    transformRequest: appendTransform($http.defaults.transformRequest, function (data) {
                        data.startDate = [data.startYear, data.startMonth, '01'].join('-') + ' 01:01:01';
                        if (!data.isCurrent) {
                            data.endDate = [data.endYear, data.endMonth, '01'].join('-') + ' 01:01:01';
                            data.isCurrent = false;
                        }

                        data.current = data.current || data.isCurrent;
                        return data;
                    }),
                },
                query: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (data) {
                        data.data.expList.forEach(function (item) {
                            if (!item.startDate) {
                                return;
                            }

                            var startDate = new Date(item.startDate);
                            item.startYear = startDate.getFullYear() + '';
                            item.startMonth = startDate.getMonth() + 1 + '';
                            if (!item.endDate) {
                                return;
                            }

                            if (!item.isCurrent) {
                                var endDate = new Date(item.endDate);
                                item.endYear = endDate.getFullYear() + '';
                                item.endMonth = endDate.getMonth() + 1 + '';
                            }
                        });

                        return data;
                    }),
                },
            },
            finacing: {
                query: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (data) {
                        if (!data.data || data.code !== 0) {
                            return data;
                        }

                        data.data.data.forEach(function (item) {
                            adaptFinanceItem(item);
                        });

                        return data;
                    }),
                },
                save: {
                    method: 'POST',
                    transformRequest: appendTransform($http.defaults.transformRequest, function (data) {
                        data.investDate = dateFilter(new Date([data.investYear, data.investMonth, '1'].join('/')), 'yyyy-MM-dd hh:mm:ss');

                        return data;
                    }),

                    transformResponse: appendTransform($http.defaults.transformResponse, function (data) {
                        if (!data.data || data.code !== 0) {
                            return data;
                        }

                        adaptFinanceItem(data.data);

                        return data;
                    }),
                },
                update: {
                    method: 'PUT',
                    transformRequest: appendTransform($http.defaults.transformRequest, function (data) {
                        data.investDate = dateFilter(new Date([data.investYear, data.investMonth, '1'].join('/')), 'yyyy-MM-dd hh:mm:ss');
                        return data;
                    }),

                    transformResponse: appendTransform($http.defaults.transformResponse, function (data) {
                        if (!data.data || data.code !== 0) {
                            return data;
                        }

                        adaptFinanceItem(data.data);
                        return data;
                    }),
                },
            },
            'send-sms': {
                send: {
                    method: 'post',
                },
            }, gee: {
                initCode: {
                    url: '/api/gee-test/init-code',
                    params:{
                        sub: undefined
                    },
                    method: 'post'
                }, sendCode: {
                    url: '/api/gee-test/send-code',
                    method: 'post',
                    params: {
                        sub: undefined
                    }
                }
            }

        });

        function adaptFinanceItem(item) {

            var time = new Date(item.financeDate);
            item.investYear = time.getFullYear() + '';
            item.investMonth = time.getMonth() + 1 + '';
            item.editInfo = {
                id: item.id,
                cid: item.cid,
                phase: item.phase,
                totalInvestValue: item.financeValue,
                totalInvestValueUnit: item.financeValueUnit,
                estimateValue: item.estimateValue,
                estimateValueUnit: item.estimateValueUnit,
                investDate: item.financeDate,
                investYear: item.investYear,
                investMonth: item.investMonth,
                entityId: item.details[0].entityId,
                entityType: item.details[0].entityType,
                company: item.company,
                detailId: item.details[0].id,
            };
            item.editInfo.entity = {
                id: item.details[0].entityId,
                name: item.details[0].name,
            };
        }

        service.getUID = function () {
            return $cookies.kr_plus_id;

            //return 115;
        };

        service.ensureLogin = function () {
            if (!$cookies.kr_plus_id) {
                setTimeout(function () {
                    location.href = '/user/login?from=' + encodeURIComponent(location.href);
                }, 300);

                return false;
            }

            return true;
        };

        service.ensureValid = function (callback) {
            if (!this.ensureLogin()) {
                return false;
            }

            this.isProfileValid(function (valid) {
                callback(valid);
                if (valid) {
                    return true;
                } else {

                    var href = location.href;
                    var type;
                    var   from;
                    if (href.indexOf('#/investor/apply') !== -1) {
                        type = 'investor_apply';
                        from = '#/investor/apply';
                    }else {
                        type = 'other';
                        from = href;
                    }

                    $state.go('guide.welcome', { from:encodeURIComponent(from), type:type });
                    return false;
                }
            });
        };

        service.isProfileValid = function (callback) {
            if (!service.getUID()) {
                callback(false);
                return;
            }

            return service.basic.get({
                id: service.getUID(),
            }, function (data) {
                if (data.email && data.phone && data.avatar && data.name) {
                    callback(true);
                }else {
                    callback(false);
                }
            });
        };

        service.investorType = function (callback) {
            if (!window.localStorage || !service.getUID()) {
                callback(100);
                return;
            }

            var investorType = localStorage.getItem('investorType');
            if (investorType) {
                callback(investorType);
                return;
            }

            return service.basic.get({
                id: service.getUID(),
            }, function (data) {
                if (!data.investorType) {
                    callback(100);
                    return;
                }

                callback(data.investorType);
            });
        };

        service.isEmailValid = function (callback) {

            if (!window.localStorage || !service.getUID()) {
                callback(false);
                return;
            }

            var result = localStorage.getItem('isEmailActivate');
            if (result && result !== 'undefined') {
                callback(JSON.parse(result));
                return;
            }

            return service.basic.get({
                id: service.getUID(),
            }, function (data) {
                localStorage.setItem('isEmailActivate', data.isEmailActivate);
                callback(data.isEmailActivate);
            });
        };

        service.getMyEmail = function (callback) {
            if (!window.localStorage || !service.getUID()) {
                callback(null);
                return;
            }

            var email = localStorage.getItem('uemail');
            if (email) {
                callback(email);
                return;
            }

            return service.basic.get({
                id: service.getUID(),
            }, function (data) {
                if (!data.email) {
                    callback(null);
                    return;
                }

                service.getMyEmail(callback);
            });
        };

        service.getPhone = function (callback) {
            if (!window.localStorage || !service.getUID()) {
                callback(null);
                return;
            }

            var phone = localStorage.getItem('uphone');
            if (phone) {
                callback(phone);
                return;
            }

            return service.basic.get({
                id: service.getUID(),
            }, function (data) {
                if (!data.phone) {
                    callback(null);
                    return;
                }

                service.getPhone(callback);
            });
        };

        service.getIdentity = function (callback) {
            return $http.get('/api/user/identity').success(function (data) {
                callback && callback(data);
            }).catch(function (err) {
                callback && callback(err);
            });
        };

        //获取用户的在职公司工作经历
        service.getCurrentWorkCompanys = function (uid, callback, error) {
            return $http.get('/api/user/' + uid + '/cur_work?type=com').success(function (data) {
                callback && callback(data);
            }).catch(function (err) {
                error && error(err);
            });
        };

        //获取用户的在职机构工作经历
        service.getCurrentWorkOrganizations = function (uid, callback, error) {
            return $http.get('/api/user/' + uid + '/cur_work?type=org').success(function (data) {
                callback && callback(data);
            }).catch(function (err) {
                error && error(err);
            });
        };

        //新增用户任职经历
        service.addWorkExperience = function (data, callback, error) {
            return $http.post('/api/user/' + data.uid + '/work', data).success(function (response) {
                callback && callback(response);
            }).catch(function (err) {
                error && error(err);
            });
        };

        //更新用户任职经历
        service.updateWorkExperience = function (data, callback, error) {
            return $http.put('/api/user/' + data.uid + '/work/' + data.id, data).success(function (response) {
                callback && callback(response);
            }).catch(function (err) {
                error && error(err);
            });
        };

        //更新用户
        service.getInvestCases = function (data, callback, error) {
            $http.get('/api/user/' + data + '/past-investment').success(function (response) {
                callback && callback(response);
            }).catch(function (err) {
                error && error(err);
            });
        };

        //错误配置
        service.errorGroup = [{
            field: 'email',
            define: [{
                type: 'required',
                msg: '请输入邮箱地址'
            }, {
                type: 'email',
                msg: '请输入合法邮箱地址'
            }, {
                type: 'checked',
                msg: '你输入的邮箱已被占用'
            }]
        }, {
            field: 'smscode',
            define: [{
                type: 'required',
                msg: '请输入验证码'
            }]
        }, {
            field: 'phone',
            define: [{
                type: 'required',
                msg: '请输入手机号码'
            }, {
                type: 'pattern',
                msg: '请输入合法手机号码'
            }, {
                type: 'checked',
                msg: '你输入的手机号已被占用'
            }]
        }, {
            field: 'name',
            define: [{
                type: 'required',
                msg: '请输入真实姓名'
            }, {
                type: 'pattern',
                msg: '请输入真实姓名'
            }]
        }, {
            field: 'avatar',
            define: [{
                type: 'size',
                msg: '文件过大'
            }, {
                type: 'type',
                msg: '请上传目前支持的格式'
            }, {
                type: 'required',
                msg: '请上传您的头像'
            }]
        }];
        service.investorErrorGroup = [{//todo check_this_error
            field:'organizationWebsite',
            define: [{
                type: 'url',
                msg: '请以http://开头'
            }, {
                type: 'urlbacklist',
                msg: '所填网址无法作为公司独立网址'
            }]
        }, {//todo logoType && logoSize
            field:'upload',
            define: [{
                type: 'uploadType',
                msg: '请上传目前支持的格式'
            }, {
                type: 'uploadSize',
                msg: '文件过大'
            }]
        }, {
            field:'time',
            define: [{
                type: 'now',
                msg: '任职的起始时间不能大于当前月'
            }, {
                type: 'required',
                msg: '请选择任职时间'
            }]
        }, {
            field:'position',
            define: [{
                type: 'required',
                msg: '请选择职位'
            }]
        }, {
            field:'companyName',
            define: [{
                type: 'required',
                msg: '请输入机构或公司简称'
            }]
        }, {
            field:'organizationBrief',
            define: [{
                type: 'required',
                msg: '请输入机构简介'
            }, {
                type: 'minlength',
                msg: '机构简介必须大于十个字'
            }]
        }, {
            field:'organizationName',
            define: [{
                type: 'required',
                msg: '请输入机构简称'
            }]
        }, {
            field:'investFrom',
            define: [{
                type: 'required',
                msg: '请填写单笔可投额'
            }]
        }, {
            field:'investTo',
            define: [{
                type: 'required',
                msg: '请填写单笔可投额'
            }, {
                type: 'checked',
                msg: '投资额下限不能大于上限值'
            }]
        }, {
            field:'identity',
            define: [{
                type: 'required',
                msg: '请选择投资身份'
            }]
        }, {
            field:'stage',
            define: [{
                type: 'required',
                msg: '请选择关注阶段'
            }]
        }, {
            field:'industry',
            define: [{
                type: 'required',
                msg: '请选择关注行业'
            }]
        }, {
            field:'pictures',
            define: [{
                type: 'required',
                msg: '请上传您的名片'
            }]
        }, {
            field:'intro',
            define: [{
                type: 'required',
                msg: '请输入一句话简介'
            }]
        }, {
            field: 'weixin',
            define: [{
                type: 'required',
                msg: '请输入微信'
            }]
        }];

        return service;
    },
]);
