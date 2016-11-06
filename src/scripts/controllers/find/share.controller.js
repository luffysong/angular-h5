
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('ShareController', ShareController);

function ShareController(loading, $stateParams) {
    var vm = this;
    vm.type = $stateParams.type;

    vm.data = {
        title:'temp',
        content:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。'
    }
    vm.responseData = [
        {
            advantage: '*一句话亮点**一句话亮点**一句话亮点**一',
            brief: '服务中国高端人群的出境体验顾问',
            ccid: 1253,
            finance_phase: 'Pre-A轮',
            funding: 0,
            industry1: '旅游户外',
            logo: 'https://krplus-pic.b0.upaiyun.com/201511/18/d1caf1248e234a97a425cfee32e283bc.jpg!200',
            name: '逸香高端定制',
            pubdate: '今天',
            rcid: 1709,
            signs: [
                {
                    color: '#6ba2fc',
                    name: 'Pre-A轮'
                },
                {
                    color: '#f8627e',
                    name: '热'
                }
            ]
        },
        {
            advantage: '一二三四一二三四一二三四一二三四。',
            brief: '一句话简介一句话简介一句话简介',
            ccid: 101423,
            finance_phase: 'Pre-A轮',
            funding: 1,
            industry1: '媒体门户',
            logo: 'https://pic.36krcnd.com/avatar/201610/17114434/vm3nwn54zspb82f5.png!200',
            name: "Levi's Jeans",
            pubdate: '10/28',
            rcid: 159734,
            signs: [
                {
                    color: '#6ba2fc',
                    name: 'Pre-A轮'
                }
            ]
        },
        {
            advantage: '啦啦啦啦啦啦啦啦啦啦来了来了',
            brief: '职场达人 每日一招',
            ccid: 70665,
            finance_phase: '天使轮',
            funding: 2,
            industry1: '教育',
            logo: 'https://krplus-pic.b0.upaiyun.com/201503/24224916/abd2319266b61e8f.png!200',
            name: '学之桥',
            pubdate: '10/21',
            rcid: 131918,
            signs: [
                {
                    color: '#6ba2fc',
                    name: '天使轮'
                }
            ]
        },

    ];

    init();
    function init() {
        document.title = vm.data.title;
        loading.hide('demos');
    }

}
