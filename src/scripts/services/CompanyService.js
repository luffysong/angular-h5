/**
 * Service Name: CompanyService
 */

//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var angular = require('angular');

angular.module('defaultApp.service').service('CompanyService', [
    '$location', 'BasicService', 'dateFilter', 'appendTransform', '$http',
    '$stateParams', '$q',
    function($location, BasicService, dateFilter, appendTransform, $http,
             $stateParams, $q) {
        var service = BasicService('/api/company/:id/:sub/:subid', {
            query: {
                method: 'GET',
                transformResponse: appendTransform($http.defaults.transformResponse,
                    function(data) {
                        if (data.data && data.data.data && data.data.data.length) {
                            var list = data.data.data;
                            list.forEach(function(item) {
                                if (item.founder && !item.user) {
                                    item.user = item.founder;
                                }
                            });
                        }

                        return data;
                    })
            },
            get: {
                method: 'GET',
                params: {
                    mode: $stateParams.mode
                },
                transformResponse: appendTransform($http.defaults.transformResponse,
                    function(data) {

                        var basics = {
                            name: '36氪',
                            fullName: '北京齐心筑成信息技术有限公司',
                            brief: '专注于互联网创业',
                            logo: '',
                            industry: 'MEDIA',
                            status: 'CREATED',
                            managerId: 100,
                            operationStatus: 'CLOSED',
                            address1: 103,
                            address2: 20301,
                            address3: 3030101,
                            startDate: 1388505600000,
                            website: 'http://www.36kr.com',
                            weibo: 'http://www.weibo.com/36kr',
                            weixin: 'weixin'
                        };

                        if (data.data && data.data.company) {
                            data.data.basic = {};
                            Object.keys(basics).forEach(function(k) {
                                data.data.basic[k] = data.data.company[k];
                                delete data.data.company[k];
                            });

                            data.data.other = data.data.company;
                        }

                        if (data.data && data.data.basic) {
                            data.data.basic.startDate = !data.data.basic.startDate ?
                                '' : new Date(data.data.basic.startDate).getFullYear() +
                            '';
                        }

                        if (data.data && data.data.other) {
                            data.data.other.pictures = data.data.other.pictures ?
                                data.data.other.pictures.split(',') : [];
                            var other = data.data.other;
                            if (other.story) {
                                other.story = other.story.replace(/&gt;/g, '>').replace(
                                    /&lt;/g, '<');
                                delete data.pictures;
                            }

                            if (other.intro) {
                                other.intro = other.intro.replace(/&gt;/g, '>').replace(
                                    /&lt;/g, '<');

                                //delete data.pictures;
                            }

                        }

                        return data;
                    })
            },
            save: {
                method: 'POST',
                transformRequest: appendTransform($http.defaults.transformRequest,
                    function(data) {
                        console.log('---提交的创建公司数据:', data);
                        if (data.companySource) {
                            //console.log(data)
                            data.startDate = data.startYear + '-' + (data.startMonth
                                        .length > 1 ? data.startMonth : ('0' + data.startMonth)
                                ) + '-' + '01 ' + '00:00:00';
                            data.endDate = dateFilter(data.endDate,
                                'yyyy-MM-dd hh:mm:ss');
                            if (!data.endDate) {
                                data.current = true;
                            }

                            data.type = data.level;
                        } else if (!data.level) {
                            data.mode = 'fast';
                        } else {

                            data.startDate = dateFilter(data.startDate,
                                'yyyy-MM-dd hh:mm:ss');

                            data.endDate = data.endYear ? (dateFilter(data.endDate,
                                'yyyy-MM-dd hh:mm:ss')) : '';
                            if (!data.endDate) {
                                data.current = true;
                            }

                            data.type = data.level;
                        }

                        console.log('---创建公司提交的数据－－', data);
                        return data;
                    })
            },
            checkName: {
                method: 'GET',
                params: {
                    action: 'checkName'
                }
            },
            sendAudit: {
                method: 'POST',
                params: {
                    sub: 'audit'
                }
            },
            countAll: {
                method: 'GET',
                params: {
                    sub: 'count-all'
                }
            },
            countCommon: {
                method: 'GET',
                params: {
                    sub: 'count-common'
                }
            },
            claim: {
                method: 'PUT',
                params: {
                    action: 'claim'
                },
                transformRequest: appendTransform($http.defaults.transformRequest,
                    function(data) {
                        data.startDate = data.startYear + '-' + (data.startMonth.length >
                            1 ? data.startMonth : ('0' + data.startMonth)) + '-' +
                            '01 ' + '00:00:00';
                        data.endDate = dateFilter(data.endDate,
                            'yyyy-MM-dd hh:mm:ss');
                        if (!data.endDate) {
                            data.current = true;
                        }

                        data.type = data.level;
                        return data;
                    })
            },
            getManaged: {
                method: 'GET',
                params: {
                    type: 'managed'
                }
            },
            getCrowdFunding: {
                method: 'GET',
                url: '//' + projectEnvConfig.zhongHost + '/api/p/crowd-funding/:id'
            }
        }, {
            sub: [
                'finance',
                'past-finance',
                'employee',
                'founder',
                'funds',
                'feed',
                'investor',
                'past-investor',
                'product',
                'qichacha',
                'other'
            ]
        }, {
            other: {
                update: {
                    method: 'PUT',
                    params: {
                        sub: undefined
                    },
                    transformRequest: appendTransform($http.defaults.transformRequest,
                        function(data) {
                            data.pictures = data.pictures ? data.pictures.join(',') :
                                '';
                            if (data.story) {
                                data.story = data.story.replace(/>/g, '&gt;').replace(
                                    /</g, '&lt;');
                                delete data.pictures;
                            }

                            if (data.intro) {
                                data.intro = data.intro.replace(/>/g, '&gt;').replace(
                                    /</g, '&lt;');

                                //delete data.pictures;
                            }

                            for (var k in data) {
                                if (k.indexOf('Link') > -1) {
                                    delete data.pictures;
                                    break;
                                }
                            }

                            data.mode = $stateParams.mode;
                            return data;
                        })
                }
            }, qichacha: {
                get: {
                    method: 'GET'
                }
            }, feed: {
                get: {
                    method: 'GET',
                    params: {
                        type: 0,
                        pageSize: 1000
                    }
                }
            },
            founder: {
                query: {
                    method: 'GET',
                    params: {
                        mode: $stateParams.mode
                    }
                },
                save: {
                    method: 'POST',
                    transformRequest: appendTransform($http.defaults.transformRequest,
                        function(data) {
                            data.mode = $stateParams.mode;
                            return data;
                        })
                },
                update: {
                    method: 'PUT',
                    transformRequest: appendTransform($http.defaults.transformRequest,
                        function(data) {
                            data.mode = $stateParams.mode;
                            return data;
                        })
                }
            },
            employee: {
                query: {
                    method: 'GET',
                    params: {
                        mode: $stateParams.mode
                    }
                },
                save: {
                    method: 'POST',
                    transformRequest: appendTransform($http.defaults.transformRequest,
                        function(data) {
                            data.mode = $stateParams.mode;
                            return data;
                        })
                },
                update: {
                    method: 'PUT',
                    transformRequest: appendTransform($http.defaults.transformRequest,
                        function(data) {
                            data.mode = $stateParams.mode;
                            return data;
                        })
                }
            },
            finance: {
                query: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse,
                        function(data) {
                            if (data.data && data.data.data) {
                                data.data.data.forEach(function(item) {
                                    // item.entity = JSON.parse(item.entity);
                                    financeAdaptor(item);
                                });
                            }

                            return data;
                        })
                },
                save: {
                    method: 'POST',
                    transformRequest: appendTransform($http.defaults.transformRequest,
                        function(data) {
                            data.financeDate = dateFilter(new Date([data.startYear,
                                    data.startMonth, '1'].join('/')),
                                'yyyy-MM-dd hh:mm:ss');

                            data.entitys.forEach(function(item) {
                                if (item.id) {
                                    if (!item.entityId) {
                                        item.entityId = item.id;
                                    }

                                    if (!item.entityType) {
                                        item.entityType = item.type;
                                    }

                                    delete item.id;
                                    delete item.type;
                                }
                            });

                            data.entitys = JSON.stringify(data.entitys);
                            return data;
                        }),

                    transformResponse: appendTransform($http.defaults.transformResponse,
                        function(data) {
                            var item = data.data;
                            financeAdaptor(item);
                            return data;
                        })
                },
                update: {
                    method: 'PUT',
                    transformRequest: appendTransform($http.defaults.transformRequest,
                        function(data) {
                            data.financeDate = dateFilter(new Date([data.startYear,
                                    data.startMonth, '1'].join('/')),
                                'yyyy-MM-dd hh:mm:ss');
                            if (data.entitys) {
                                data.entitys.forEach(function(item) {
                                    if (item.id) {
                                        if (!item.entityId) {
                                            item.entityId = item.id;
                                        }

                                        if (!item.entityType) {
                                            item.entityType = item.type;
                                        }

                                        delete item.id;
                                        delete item.type;
                                    }
                                });

                            }

                            data.entitys = JSON.stringify(data.entitys);
                            return data;
                        }),

                    transformResponse: appendTransform($http.defaults.transformResponse,
                        function(data) {
                            var item = data.data;
                            financeAdaptor(item);
                            return data;
                        })
                }
            },
            'past-finance': {
                query: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse,
                        function(data) {
                            if (data.data && data.data.data) {
                                data.data.data.forEach(function(item) {
                                    // item.entity = JSON.parse(item.entity);
                                    financeAdaptor(item);
                                });
                            }

                            return data;
                        })
                }
            },

            investor: {
                save: {
                    method: 'POST',
                    transformRequest: appendTransform($http.defaults.transformRequest,
                        function(data) {
                            if (!data.investorId) {
                                data.investorId = data.id;
                                delete data.id;
                            }

                            data.mode = $stateParams.mode;
                            return data;
                        })
                }
            },
            funds: {
                get: {
                    method: 'get',
                    transformResponse: appendTransform($http.defaults.transformResponse,
                        function(data) {
                            return data;
                        })
                }, applyView: {
                    method: 'POST',
                    params: {
                        action: 'permission'
                    }
                },
                finish: {
                    method: 'POST',
                    params: {
                        action: 'complete'
                    },
                    transformRequest: appendTransform($http.defaults.transformRequest,
                        function(data) {

                            data.entitys.forEach(function(item) {
                                if (item.id) {
                                    if (!item.entityId) {
                                        item.entityId = item.id;
                                    }

                                    if (!item.entityType) {
                                        item.entityType = item.type;
                                    }

                                    delete item.id;
                                    delete item.type;
                                }
                            });

                            data.entitys = JSON.stringify(data.entitys);

                            data.isPublic = data.isPublic ? 1 : 0;
                            data.isReport = data.isReport ? 1 : 0;
                            return data;
                        })
                },
                rejected: {
                    method: 'GET',
                    params: {
                        action: 'rejected'
                    }
                }
            }
        });

        function financeAdaptor(item) {
            if (!item.financeDate) {
                return;
            }

            if (item.phase === 'UNKNOWN') {
                item.phase = '';
            }

            var time = new Date(item.financeDate);
            item.startYear = time.getFullYear() + '';
            item.startMonth = time.getMonth() + 1 + '';
            if (!item.entitys && item.details) {
                item.entitys = item.details;
                item.showNotifyTip = false;
                item.showInviteTip = false;
                item.entitys.forEach(function(entity) {
                    if (entity.status === 'PENDING' && entity.source === 'INVESTOR') {
                        item.showNotifyTip = true;
                    }

                    if (entity.status === 'PENDING' && entity.source ===
                        'FINANCIER') {
                        item.showInviteTip = true;
                    }
                });

                delete item.details;
            }

        }

        service.getCompanyListForHome = function(callback) {

            $http.get('/api/organization/finished-com').success(function(data) {
                var list = [];
                if (data.data) {
                    data.data.forEach(function(item, i) {
                        var company = {
                            company_logo: item.company.logo,
                            company_bg: 'http://krplus-pic.b0.upaiyun.com/' +
                            'home/company-bg-' + (i % 3) + '.jpg',
                            company_name: item.company.name,
                            finance_start: {
                                date: dateFilter(new Date(item.startDateStr),
                                    'yyyy.MM'),
                                user_id: item.user.id,
                                user_name: item.user.name,
                                user_desc: item.user.intro,
                                user_image: item.user.avatar
                            },
                            finance_rounds: []
                        };
                        item.financeExpList.forEach(function(exp) {
                            var round = {
                                date: dateFilter(new Date(exp.fundDateStr),
                                    'yyyy.MM'),
                                round: exp.phase,
                                money: exp.fundValue,
                                investor_count: 0,
                                investor_type: '',
                                investor_name: '',
                                investor_id: 0,
                                show: false
                            };
                            if (exp.financeEntityList.length > 0) {
                                round.investor_count = exp.financeEntityList.length;
                                round.investor_type = exp.financeEntityList[0]
                                    .entityType;
                                round.investor_name = exp.financeEntityList[0]
                                    .entityName;
                                round.investor_id = exp.financeEntityList[0].entityId;
                                round.show = exp.financeEntityList[0].show;
                            }

                            company.finance_rounds.push(round);
                        });

                        list.push(company);
                    });
                }

                if (callback) {
                    callback(list);
                }
            }).error(function(err) {
                console.log(err);
            });

        };

        service.ventureApply = function(cid, type, callback) {
            $http.get('/api/company/intention/' + cid, {
                params: type
            }).success(function(data) {
                if (callback) {
                    callback(data);
                }
            }).error(function(err) {
                console.log(err);
            });
        };

        service.getIndustry2 = function(id) {
            var deferred = $q.defer();
            $http.get('/api/dict/industry/' + id).success(function(data) {
                deferred.resolve(data);
            }).error(function() {
                deferred.reject();
            });

            return deferred.promise;
        };

        // 获取最新快讯
        service.news = function(id, callback, errcallback) {
            $http.get('/api/company/' + id + '/news').success(function(response) {
                callback && callback(response);
            }).catch(function(err) {
                errcallback && errcallback(err);
            });
        };

        return service;
    }
]);

