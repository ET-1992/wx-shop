import { imgToHttps, formatConfirmTime } from 'utils/util';

export default class Poster {
    constructor(data, user, posterType) {
        this.data = {
            ...data,
            user,
            posterType
        };
        this.posterPainter = {};
        this.posterPainterViews = [];
    }

    init() {
        const { posterType } = this.data;
        this.posterPainter = this.initBase();
        let views = [
            ...this.initHeader(),
            ...this.initQrcode()
        ];

        switch (posterType) {
            case 'miaosha':
                views = [
                    ...views,
                    ...this.titleViews(),
                    ...this.miaoshaFooter()
                ];
                break;

            // 拼团商品海报
            case 'groupon':
                views = [
                    ...views,
                    ...this.grouponViews(),
                    ...this.initFooter()
                ];
                break;

            // 邀请拼团海报
            case 'grouponBuy':
                views = [
                    ...views,
                    ...this.titleViews(),
                    ...this.grouponBuyFooter()
                ];
                break;

            case 'product':
            case 'crowd':
                views = [
                    ...views,
                    ...this.productViews(),
                    ...this.initFooter()
                ];
                break;

            case 'article':
                views = [
                    ...views,
                    ...this.articleViews(),
                    ...this.initFooter()
                ];
                break;
        }

        this.posterPainter.views = views;
        return this.posterPainter;
    }

    initBase() {
        return {
            width: '540rpx',
            height: '900rpx',
            background: '#ffffff'
        };
    }

    // 绘制banner图
    initHeader() {
        const { banner, product, posterType } = this.data;
        return [
            {
                type: 'image',
                url: imgToHttps(banner || `${product.image_url}?imageView2/1/w/540/h/540/q/70#`),
                css: {
                    width: '450rpx',
                    height: `${posterType === 'article' ? 360 : 450}rpx`,
                    top: '30rpx',
                    left: '45rpx'
                }
            }
        ];
    }

    // 文章
    articleViews() {
        const { title, author, excerpt } = this.data;
        const _views = [];
        const viewsText = [
            title,
            author ? `作者：${author}` : '',
            excerpt
        ];
        const viewsTop = [60, 120, 150];
        const viewsFontSize = [32, 26, 26];
        const viewsLeft = [45, 45, 45];
        const viewsFontWeight = ['normal', 'normal', 'normal'];
        const viewsMaxLines = [2, 1, 2];

        for (let i = 0; i < 3; i++) {
            _views.push({
                type: 'text',
                text: viewsText[i],
                css: {
                    width: '450rpx',
                    top: `${360 + viewsTop[i] + i * 30}rpx`,
                    left: `${viewsLeft[i]}rpx`,
                    fontSize: `${viewsFontSize[i]}rpx`,
                    maxLines: viewsMaxLines[i],
                    fontWeight: viewsFontWeight[i]
                }
            });
        }
        return _views;
    }

    // 普通商品
    productViews() {
        const { title, price, highest_price = 0, excerpt = '', globalData, posterType } = this.data;
        const _views = [];
        let viewsText = [
            title,
            excerpt,
            `${globalData.CURRENCY[globalData.currency] + price}${price < highest_price ? '~' + highest_price : ''}`
        ];
        if (posterType === 'crowd') {
            viewsText[2] = `${globalData.CURRENCY[globalData.currency] + price}`;
        }

        const viewsTop = [50, 110, 130];
        const viewsFontSize = [28, 24, 26];
        const viewsLeft = [45, 45, 45];
        const viewsFontWeight = ['normal', 'normal', 'normal'];
        const viewsMaxLines = [2, 1, 1];
        const viewsColor = ['', '', '#FC2732'];
        const viewsLineHeight = [35, 30, 30];

        for (let i = 0; i < 3; i++) {
            _views.push({
                type: 'text',
                text: viewsText[i],
                css: {
                    width: '450rpx',
                    top: `${450 + viewsTop[i] + i * 30}rpx`,
                    left: `${viewsLeft[i]}rpx`,
                    fontSize: `${viewsFontSize[i]}rpx`,
                    maxLines: viewsMaxLines[i],
                    fontWeight: viewsFontWeight[i],
                    color: viewsColor[i],
                    lineHeight: `${viewsLineHeight[i]}rpx`
                }
            });
        }
        return _views;
    }

    // 拼团商品
    grouponViews() {
        const { title, groupon_price, price, member_limit, globalData } = this.data;
        const viewsLeft = 45;
        const viewsBottom = 240;
        let rectWidth = 80;
        if (member_limit && (member_limit > 9) && (member_limit < 100)) {
            rectWidth = 92;
        }

        if (member_limit && member_limit > 99) {
            rectWidth = 110;
        }

        return [
            {
                type: 'text',
                text: title,
                css: {
                    width: '450rpx',
                    top: '500rpx',
                    left: `${viewsLeft}rpx`,
                    fontSize: '28rpx',
                    maxLines: 2,
                    lineHeight: '35rpx'
                }
            },
            {
                type: 'text',
                text: `单独购买${globalData.CURRENCY[globalData.currency] + price}`,
                css: {
                    bottom: viewsBottom + 50 + 'rpx',
                    left: `${viewsLeft}rpx`,
                    fontSize: '18rpx',
                    color: '#707070'
                }
            },
            {
                type: 'text',
                text: `${globalData.CURRENCY[globalData.currency]}`,
                css: {
                    bottom: viewsBottom + 'rpx',
                    left: viewsLeft + 'rpx',
                    fontSize: '18rpx',
                    color: '#FC2732'
                }
            },
            {
                id: 'groupon-price-id',
                type: 'text',
                text: `${groupon_price}`,
                css: {
                    bottom: viewsBottom + 'rpx',
                    left: `${viewsLeft + 20}rpx`,
                    fontSize: '28rpx',
                    color: '#FC2732'
                }
            },
            {
                type: 'rect',
                css: {
                    bottom: (viewsBottom - 3) + 'rpx',
                    width: `${rectWidth}rpx`,
                    height: '30rpx',
                    color: 'linear-gradient(-135deg, #ff6034 0%, #FC2732 80%)',
                    left: [`${viewsLeft + 60}rpx`, 'groupon-price-id'],
                    borderRadius: '5rpx'
                }
            },
            {
                type: 'text',
                text: `${member_limit && member_limit > 99 ? '99+' : member_limit}人团`,
                css: {
                    bottom: viewsBottom + 3 + 'rpx',
                    left: [`${viewsLeft + 74}rpx`, 'groupon-price-id'],
                    fontSize: '20rpx',
                    color: '#ffffff'
                }
            }
        ];
    }

    // 海报中间文字
    titleViews() {
        const { title, excerpt = '', product = {}} = this.data;
        const _views = [];
        const viewsText = [
            title || (product && product.title),
            excerpt || (product && product.excerpt)
        ];
        const viewsTop = [60, 120];
        const viewsFontSize = [28, 24];
        const viewsLeft = [45, 45];
        const viewsFontWeight = ['normal', 'normal'];
        const viewsMaxLines = [2, 1];
        const viewsColor = ['', ''];
        const viewsLineHeight = [35, 30];

        for (let i = 0; i < 2; i++) {
            _views.push({
                type: 'text',
                text: viewsText[i],
                css: {
                    width: '450rpx',
                    top: `${450 + viewsTop[i] + i * 30}rpx`,
                    left: `${viewsLeft[i]}rpx`,
                    fontSize: `${viewsFontSize[i]}rpx`,
                    maxLines: viewsMaxLines[i],
                    fontWeight: viewsFontWeight[i],
                    color: viewsColor[i],
                    lineHeight: `${viewsLineHeight[i]}rpx`
                }
            });
        }
        return _views;
    }

    // 绘制二维码
    initQrcode() {
        const { qrcode_url } = this.data;
        return [
            {
                type: 'rect',
                css: {
                    bottom: '220rpx',
                    width: '500rpx',
                    height: '1rpx',
                    color: '#ccc',
                    left: '20rpx'
                }
            },
            {
                type: 'image',
                url: imgToHttps(qrcode_url),
                css: {
                    bottom: '40rpx',
                    right: '45rpx',
                    width: '150rpx',
                    height: '150rpx'
                }
            }
        ];
    }

    // 限时购海报
    miaoshaFooter() {
        const {
            price,
            miaosha_price,
            highest_price,
            timeLimit,
            globalData,
            hasStart,
            hasEnd
        } = this.data;

        let _views = [];
        let statusText = '';

        const viewsLeft = 45;
        const viewsBottom = 40;

        if (!hasStart) {
            statusText = '距活动开始';
        }
        if (hasStart && !hasEnd) {
            statusText = '距活动结束';
        }
        if (hasEnd) {
            statusText = '活动已结束';
        }

        _views = [
            {
                id: 'miaosha-status-text-id',
                type: 'text',
                text: statusText,
                css: {
                    bottom: viewsBottom + 120 + 'rpx',
                    left: viewsLeft + 'rpx',
                    fontSize: '22rpx',
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                text: `原价购买${globalData.CURRENCY[globalData.currency] + price}${price < highest_price ? '~' + highest_price : ''}`,
                css: {
                    bottom: viewsBottom + 70 + 'rpx',
                    left: viewsLeft + 'rpx',
                    fontSize: '18rpx',
                    color: '#707070'
                }
            },
            {
                id: 'miaosha-currency-id',
                type: 'text',
                text: `${globalData.CURRENCY[globalData.currency]}`,
                css: {
                    bottom: viewsBottom + 15 + 'rpx',
                    left: viewsLeft + 'rpx',
                    fontSize: '18rpx',
                    color: '#FC2732'
                }
            },
            {
                id: 'miaosha-price-id',
                type: 'text',
                text: `${miaosha_price}`,
                css: {
                    bottom: viewsBottom + 12 + 'rpx',
                    left: [`${viewsLeft}rpx`, 'miaosha-currency-id'],
                    fontSize: '28rpx',
                    color: '#FC2732'
                }
            },
            {
                type: 'rect',
                css: {
                    bottom: viewsBottom + 9 + 'rpx',
                    width: '80rpx',
                    height: '30rpx',
                    color: 'linear-gradient(-135deg, #ff6034 0%, #FC2732 80%)',
                    left: [`${viewsLeft + 50}rpx`, 'miaosha-price-id'],
                    borderRadius: '5rpx'
                }
            },
            {
                type: 'text',
                text: '限时价',
                css: {
                    bottom: viewsBottom + 17 + 'rpx',
                    left: [`${viewsLeft + 62}rpx`, 'miaosha-price-id'],
                    fontSize: '20rpx',
                    color: '#ffffff'
                }
            }
        ];


        if (!hasStart || (hasStart && !hasEnd)) {
            const { remainTime } = formatConfirmTime(timeLimit);
            _views.push(
                {
                    type: 'text',
                    text: remainTime,
                    css: {
                        bottom: viewsBottom + 120 + 'rpx',
                        left: [`${viewsLeft + 10}rpx`, 'miaosha-status-text-id'],
                        color: '#FC2732',
                        fontSize: '20rpx',
                        width: '190rpx',
                        maxLines: 1
                    }
                }
            );
        }
        return _views;
    }

    // 邀请参团海报底部
    grouponBuyFooter() {
        const {
            price,
            member_limit,
            remainSecond,
            product,
            globalData
        } = this.data;

        let _views = [];
        let statusText = remainSecond > 0 ? '距拼团结束' : '已结束';

        const viewsLeft = 45;
        const viewsBottom = 40;

        _views = [
            {
                id: 'grouponBuy-status-text-id',
                type: 'text',
                text: statusText,
                css: {
                    bottom: viewsBottom + 120 + 'rpx',
                    left: viewsLeft + 'rpx',
                    fontSize: '22rpx',
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                text: `单独购买${globalData.CURRENCY[globalData.currency] + product.price}`,
                css: {
                    bottom: viewsBottom + 70 + 'rpx',
                    left: viewsLeft + 'rpx',
                    fontSize: '18rpx',
                    color: '#707070'
                }
            },
            {
                id: 'grouponBuy-currency-id',
                type: 'text',
                text: `${globalData.CURRENCY[globalData.currency]}`,
                css: {
                    bottom: viewsBottom + 15 + 'rpx',
                    left: viewsLeft + 'rpx',
                    fontSize: '18rpx',
                    color: '#FC2732'
                }
            },
            {
                id: 'grouponBuy-price-id',
                type: 'text',
                text: `${price}`,
                css: {
                    bottom: viewsBottom + 12 + 'rpx',
                    left: [`${viewsLeft}rpx`, 'grouponBuy-currency-id'],
                    fontSize: '28rpx',
                    color: '#FC2732'
                }
            },
            {
                type: 'text',
                text: `${member_limit}人团`,
                css: {
                    bottom: viewsBottom + 17 + 'rpx',
                    left: [`${viewsLeft + 62}rpx`, 'grouponBuy-price-id'],
                    fontSize: '20rpx',
                    color: '#FC2732'
                }
            }
        ];

        if (remainSecond > 0) {
            const { remainTime } = formatConfirmTime(remainSecond);
            _views.push(
                {
                    type: 'text',
                    text: remainTime,
                    css: {
                        bottom: viewsBottom + 120 + 'rpx',
                        left: [`${viewsLeft + 10}rpx`, 'grouponBuy-status-text-id'],
                        color: '#FC2732',
                        fontSize: '20rpx',
                        width: '190rpx',
                        maxLines: 1
                    }
                }
            );
        }
        return _views;
    }

    initFooter() {
        const { user, posterType } = this.data;
        const _views = [];
        let viewsText = [
            (user && user.nickname) || '好友'
        ];
        switch (posterType) {
            case 'article':
                viewsText = [
                    ...viewsText,
                    '向你推荐这篇文章',
                    '长按识别小程序码访问'
                ];
                break;

            case 'crowd':
                viewsText = [
                    ...viewsText,
                    '很想要这个商品',
                    '邀请你给TA赞助'
                ];
                break;

            default:
                viewsText = [
                    ...viewsText,
                    '向你推荐这个商品',
                    '长按识别小程序码访问'
                ];
                break;
        }
        const viewsBottom = [125, 85, 50];
        const viewsFontSize = [24, 24, 24];
        const viewsLeft = [45, 45, 45];
        const viewsFontWeight = ['bold', 'normal', 'normal'];
        const viewsMaxLines = [1, 1, 1];
        const viewsWidth = [200, 300, 300];

        for (let i = 0; i < 3; i++) {
            _views.push({
                type: 'text',
                text: viewsText[i],
                css: {
                    bottom: `${viewsBottom[i]}rpx`,
                    left: `${viewsLeft[i]}rpx`,
                    fontSize: `${viewsFontSize[i]}rpx`,
                    maxLines: viewsMaxLines[i],
                    fontWeight: viewsFontWeight[i],
                    width: `${viewsWidth[i]}rpx`,
                }
            });
        }
        return _views;
    }
}