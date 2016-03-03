/**
 * Service Name: UserService
 */

//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var angular = require('angular');

angular.module('defaultApp.service').service('UserService', [
    '$location', 'BasicService', 'dateFilter', 'appendTransform', '$http', '$cookies', '$stateParams',
    function ($location, BasicService, dateFilter, appendTransform, $http, $cookies, $stateParams) {
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
                'check'

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
            },

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

        service.isProfileValid = function (callback) {
            if (!service.getUID()) {
                callback(false);
                return;
            }

            service.basic.get({
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

            service.basic.get({
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

            service.basic.get({
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

            service.basic.get({
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

            service.basic.get({
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
            $http.get('/api/user/identity').success(function (data) {
                callback && callback(data);
            }).catch(function (err) {
                callback && callback(err);
            });
        };

        //获取用户的在职公司工作经历
        service.getCurrentWorkCompanys = function (uid, callback, error) {
            $http.get('/api/user/' + uid + '/cur_work?type=com').success(function (data) {
                callback && callback(data);
            }).catch(function (err) {
                error && error(err);
            });
        };

        //获取用户的在职机构工作经历
        service.getCurrentWorkOrganizations = function (uid, callback, error) {
            $http.get('/api/user/' + uid + '/cur_work?type=org').success(function (data) {
                callback && callback(data);
            }).catch(function (err) {
                error && error(err);
            });
        };

        //新增用户任职经历
        service.addWorkExperience = function (data, callback, error) {
            $http.post('/api/user/' + data.uid + '/work', data).success(function (response) {
                callback && callback(response);
            }).catch(function (err) {
                error && error(err);
            });
        };

        //更新用户任职经历
        service.updateWorkExperience = function (data, callback, error) {
            $http.put('/api/user/' + data.uid + '/work/' + data.id, data).success(function (response) {
                callback && callback(response);
            }).catch(function (err) {
                error && error(err);
            });
        };

        return service;
    },
]);
