/**
 * Directive Name: clamp
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('krSuggest',
    function (SuggestService, $sce, $q, utls) {
        var TYPE_TO_METHOD = {
            company: 'queryCompany',
            organization: 'queryOrganization',
            comAndOrg: 'queryComAndOrg',
            position: 'queryPosition'
        };
        return {
            restrict: 'AE',
            scope: {
                maxLength:'@',
                name:'@',
                minLength:'@',
                placeholder:'@',
                suggestObj:'=',
                type: '@',
                autocompleteOptions:'=?',
                krDisabled: '=?',
                krRequired: '=?',
                maxWidth: '=?'
            },
            controller: function ($scope) {

                var TYPE_META = {
                    2: '机构',
                    3: '公司'
                };
                initScope();
                function initScope() {
                    setAutocompleteOptions();
                }

                function setAutocompleteOptions() {
                    var baseAutocompleteOptions = {
                        suggest: suggestRemote,
                        auto_select_first: true,
                        full_match:fullMatch
                    };
                    $scope.autocompleteOptions =
                        angular.extend(baseAutocompleteOptions, $scope.autocompleteOptions || {});
                }

                function suggestRemote(word) {
                    var method = TYPE_TO_METHOD[$scope.type];
                    var deferred = $q.defer();
                    SuggestService[method]({
                        kw: word
                    }, function (suggest) {
                        deferred.resolve(makeSuggestListObjs(word, suggest));
                    });

                    return deferred.promise;
                }

                function fullMatch(item, wd) {
                    if (item && wd) {
                        var wdUpperCase = wd.toUpperCase().trim();
                        return item.obj.name.toUpperCase() === wdUpperCase ||
                            (item.obj.aliasName || '').toUpperCase() === wdUpperCase;
                    }

                    return false;
                }

                function makeSuggestListObjs(word, list) {
                    return list.map(function (item) {
                        return {
                            value: item.name,
                            label: makeLabel(item, word),
                            obj: item
                        };
                    });
                }

                function makeLabel(item, word) {
                    var label =  '<div class="suggest-row-content"> <img src="' + item.logo + '" />' +
                        highlight(item.name, word) + '&nbsp;&nbsp;' + getAliasHighligt(item, word) +
                        getTypeHtml(item.type) +
                        '</div>';
                    return label;
                }

                function getTypeHtml(type) {
                    if (!type) {
                        return '';
                    }

                    var text = TYPE_META[type];
                    return '<span  class="item-type">' + text + '</span>';
                }

                function getAliasHighligt(item, word) {
                    if (item.aliasName) {
                        return '（' + highlight(item.aliasName, word) + '）';
                    }

                    return '';
                }

                function highlight(str, term) {
                    var highlightRegex = new RegExp('(' + utls.escapeReg(term.trim()) + ')', 'gi');
                    return str.replace(highlightRegex,
                      '<span class="highlight-word">$1</span>');
                }

            },

            templateUrl: 'templates/directive/suggest/index.html',
            link: function () {
            }
        };

    });
