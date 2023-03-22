// pages/shopDetail/index.js

import api from 'utils/api';
const app = getApp();


Page({
  /**
   * 页面的初始数据
   */
  data: {
       filterListData: [
            {
                name: '综合',
                hideOption: true
            },
            {
                name: '价格',
            },
            {
                name: '销量',
            }
        ],
        filterData: {
            filterIndex: 0,
            filterType: 'Down'
        },
        filterOrderby: '',
        filterOrder: '',
    products: [
  {
    'id': 1803,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 240,
    'icon': '',
    'title': '进口牡丹花郁金香鲜花玫瑰花礼盒北京同城花店速递上海广州花全国',
    'excerpt': '',
    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2023/03/1678087530-8989ed0a6d4eea3d70b47b6103b8828d.jpg?imageMogr2/auto-orient/thumbnail/!360x360r/gravity/Center/crop/360x360/format/webp#',
    'user_id': 34445,
    'timestamp': 1637573525,
    'time': '1年前',
    'date': '2021-11-22',
    'day': '11月22日',
    'modified_timestamp': 1657088332,
    'modified_time': '8月前',
    'modified_date': '2022-07-06',
    'format': '',
    'product_category': [
      {
        'id': 66,
        'taxonomy': 'product_category',
        'name': '鞋子',
        'count': 40,
        'description': '',
        'slug': '%e9%9e%8b%e5%ad%90',
        'parent': 0,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#',
        'banner': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_banner.png?imageMogr2/auto-orient/thumbnail/!864x320r/gravity/Center/crop/864x320/quality/70#'
      },
      {
        'id': 27,
        'taxonomy': 'product_category',
        'name': '时尚美妆',
        'count': 32,
        'description': '',
        'slug': '%e6%97%b6%e5%b0%9a%e7%be%8e%e5%a6%86',
        'parent': 67,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2020/12/1609140839-b196c8e36a364a02cb44922623220e31.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#'
      },
      {
        'id': 25,
        'taxonomy': 'product_category',
        'name': '母婴亲子',
        'count': 4,
        'description': '',
        'slug': '%e6%af%8d%e5%a9%b4%e4%ba%b2%e5%ad%90',
        'parent': 67,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#'
      }
    ],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'open',
    'fav_count': 1,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1627453654-641.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989259-34c700c7b93f4903ffd4cca426cf2ee5.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'product_type': 0,
    'product_no': '',
    'price': 66,
    'original_price': 498,
    'discount': 0.13,
    'cost': 55,
    'stock': 934,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 11232,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': false,
    'order_annotation': [],
    'highest_price': 0,
    'hide_postage': true,
    'postage': 0,
    'quota': 0,
    'quota_type': 0,
    'least': 0,
    'weight': '',
    'properties': [
      {
        'name': '颜色分类',
        'items': [
          {
            'name': '进3口粉白满天星郁金香玫瑰棉花等组合灰盒45',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '30只白郁金香灰礼盒',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口粉玫和奶白玫瑰进口郁金香紫罗兰乒乓等55',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口郁金香白满天星白盒',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '19只进口粉郁满天星',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口红郁洋牡丹玫瑰等',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '19只进口白郁金香满天星等',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口粉郁金香桃红玫瑰刺秦等2组合',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口粉白满天星郁金香玫瑰棉花等组合灰盒45',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口粉白满天星郁金香玫瑰棉花等组合灰盒451',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口粉白满天星郁金香玫瑰棉花等组合灰盒452',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '3口粉白满天星郁金香玫瑰棉花等组合灰盒453',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口2粉白满天星郁金香玫瑰棉花等组合灰盒454',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口粉2白满天星郁金香玫瑰棉花等组合灰盒455',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口粉白满天星郁金香玫瑰棉花等组合灰盒456',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口粉6白满天星郁金香玫瑰棉花等组合灰盒456',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口粉白满天星郁金香玫瑰棉花等组合灰盒4577',
            'image': '',
            'thumbnail': '',
            'large': ''
          }
        ]
      }
    ],
    'sku_images': {
      '进3口粉白满天星郁金香玫瑰棉花等组合灰盒45': '',
      '30只白郁金香灰礼盒': '',
      '进口粉玫和奶白玫瑰进口郁金香紫罗兰乒乓等55': '',
      '进口郁金香白满天星白盒': '',
      '19只进口粉郁满天星': '',
      '进口红郁洋牡丹玫瑰等': '',
      '19只进口白郁金香满天星等': '',
      '进口粉郁金香桃红玫瑰刺秦等2组合': '',
      '进口粉白满天星郁金香玫瑰棉花等组合灰盒45': '',
      '进口粉白满天星郁金香玫瑰棉花等组合灰盒451': '',
      '进口粉白满天星郁金香玫瑰棉花等组合灰盒452': '',
      '3口粉白满天星郁金香玫瑰棉花等组合灰盒453': '',
      '进口2粉白满天星郁金香玫瑰棉花等组合灰盒454': '',
      '进口粉2白满天星郁金香玫瑰棉花等组合灰盒455': '',
      '进口粉白满天星郁金香玫瑰棉花等组合灰盒456': '',
      '进口粉6白满天星郁金香玫瑰棉花等组合灰盒456': '',
      '进口粉白满天星郁金香玫瑰棉花等组合灰盒4577': ''
    },
    'is_multi_sku': true,
    'skus': [
      {
        'id': 9850,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口粉白满天星郁金香玫瑰棉花等组合灰盒4577'
          }
        ],
        'property_names': '颜色分类:进口粉白满天星郁金香玫瑰棉花等组合灰盒4577;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口粉白满天星郁金香玫瑰棉花等组合灰盒4577"}]'
      },
      {
        'id': 9849,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口粉6白满天星郁金香玫瑰棉花等组合灰盒456'
          }
        ],
        'property_names': '颜色分类:进口粉6白满天星郁金香玫瑰棉花等组合灰盒456;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口粉6白满天星郁金香玫瑰棉花等组合灰盒456"}]'
      },
      {
        'id': 9848,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口粉白满天星郁金香玫瑰棉花等组合灰盒456'
          }
        ],
        'property_names': '颜色分类:进口粉白满天星郁金香玫瑰棉花等组合灰盒456;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口粉白满天星郁金香玫瑰棉花等组合灰盒456"}]'
      },
      {
        'id': 9847,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口粉2白满天星郁金香玫瑰棉花等组合灰盒455'
          }
        ],
        'property_names': '颜色分类:进口粉2白满天星郁金香玫瑰棉花等组合灰盒455;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口粉2白满天星郁金香玫瑰棉花等组合灰盒455"}]'
      },
      {
        'id': 9846,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口2粉白满天星郁金香玫瑰棉花等组合灰盒454'
          }
        ],
        'property_names': '颜色分类:进口2粉白满天星郁金香玫瑰棉花等组合灰盒454;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口2粉白满天星郁金香玫瑰棉花等组合灰盒454"}]'
      },
      {
        'id': 9845,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '3口粉白满天星郁金香玫瑰棉花等组合灰盒453'
          }
        ],
        'property_names': '颜色分类:3口粉白满天星郁金香玫瑰棉花等组合灰盒453;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"3口粉白满天星郁金香玫瑰棉花等组合灰盒453"}]'
      },
      {
        'id': 9844,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口粉白满天星郁金香玫瑰棉花等组合灰盒452'
          }
        ],
        'property_names': '颜色分类:进口粉白满天星郁金香玫瑰棉花等组合灰盒452;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口粉白满天星郁金香玫瑰棉花等组合灰盒452"}]'
      },
      {
        'id': 9843,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口粉白满天星郁金香玫瑰棉花等组合灰盒451'
          }
        ],
        'property_names': '颜色分类:进口粉白满天星郁金香玫瑰棉花等组合灰盒451;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口粉白满天星郁金香玫瑰棉花等组合灰盒451"}]'
      },
      {
        'id': 9842,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口粉郁金香桃红玫瑰刺秦等2组合'
          }
        ],
        'property_names': '颜色分类:进口粉郁金香桃红玫瑰刺秦等2组合;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口粉郁金香桃红玫瑰刺秦等2组合"}]'
      },
      {
        'id': 9841,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 54,
        'sales': 1,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进3口粉白满天星郁金香玫瑰棉花等组合灰盒45'
          }
        ],
        'property_names': '颜色分类:进3口粉白满天星郁金香玫瑰棉花等组合灰盒45;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进3口粉白满天星郁金香玫瑰棉花等组合灰盒45"}]'
      },
      {
        'id': 8735,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口粉白满天星郁金香玫瑰棉花等组合灰盒45'
          }
        ],
        'property_names': '颜色分类:进口粉白满天星郁金香玫瑰棉花等组合灰盒45;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口粉白满天星郁金香玫瑰棉花等组合灰盒45"}]'
      },
      {
        'id': 8734,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '30只白郁金香灰礼盒'
          }
        ],
        'property_names': '颜色分类:30只白郁金香灰礼盒;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"30只白郁金香灰礼盒"}]'
      },
      {
        'id': 8733,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口粉玫和奶白玫瑰进口郁金香紫罗兰乒乓等55'
          }
        ],
        'property_names': '颜色分类:进口粉玫和奶白玫瑰进口郁金香紫罗兰乒乓等55;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口粉玫和奶白玫瑰进口郁金香紫罗兰乒乓等55"}]'
      },
      {
        'id': 8732,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口郁金香白满天星白盒'
          }
        ],
        'property_names': '颜色分类:进口郁金香白满天星白盒;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口郁金香白满天星白盒"}]'
      },
      {
        'id': 8731,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '19只进口粉郁满天星'
          }
        ],
        'property_names': '颜色分类:19只进口粉郁满天星;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"19只进口粉郁满天星"}]'
      },
      {
        'id': 8730,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口红郁洋牡丹玫瑰等'
          }
        ],
        'property_names': '颜色分类:进口红郁洋牡丹玫瑰等;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口红郁洋牡丹玫瑰等"}]'
      },
      {
        'id': 8729,
        'sku_no': '',
        'price': 66,
        'cost': 55,
        'stock': 55,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '19只进口白郁金香满天星等'
          }
        ],
        'property_names': '颜色分类:19只进口白郁金香满天星等;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"19只进口白郁金香满天星等"}]'
      }
    ],
    'attributes': [],
    'groupon_enable': '1',
    'groupon_price': 9.9,
    'groupon_type': 'normal',
    'groupon_commander_price': 8.8,
    'groupon_member_limit': 2,
    'groupon_time_limit': 1,
    'groupon_once_only': false,
    'groupon_not_auto_finish': true,
    'groupon_hide_pending': false,
    'promotion_type': 'groupon_enable',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989259-34c700c7b93f4903ffd4cca426cf2ee5.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'sku_guide_image': '',
    'hide_price': false,
    'is_sticky': true
  },
  {
    'id': 2144,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 240,
    'icon': '',
    'title': '更清凉更干爽，黑科技持久冷感夏被 升级款',
    'excerpt': '',
    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989357-c7467af8344ef7c74651b1e5fafdfd94.png?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'user_id': 34445,
    'timestamp': 1625047224,
    'time': '2年前',
    'date': '2021-06-30',
    'day': '06月30日',
    'modified_timestamp': 1628578044,
    'modified_time': '2年前',
    'modified_date': '2021-08-10',
    'format': '',
    'product_category': [
      {
        'id': 66,
        'taxonomy': 'product_category',
        'name': '鞋子',
        'count': 40,
        'description': '',
        'slug': '%e9%9e%8b%e5%ad%90',
        'parent': 0,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#',
        'banner': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_banner.png?imageMogr2/auto-orient/thumbnail/!864x320r/gravity/Center/crop/864x320/quality/70#'
      },
      {
        'id': 27,
        'taxonomy': 'product_category',
        'name': '时尚美妆',
        'count': 32,
        'description': '',
        'slug': '%e6%97%b6%e5%b0%9a%e7%be%8e%e5%a6%86',
        'parent': 67,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2020/12/1609140839-b196c8e36a364a02cb44922623220e31.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#'
      },
      {
        'id': 86,
        'taxonomy': 'product_category',
        'name': '床品',
        'count': 1,
        'description': '',
        'slug': '%e5%ba%8a%e5%93%81',
        'parent': 79,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#'
      }
    ],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'open',
    'fav_count': 4,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1626082076-srchttp___ww1.sinaimg.cn_large_9150e4e5gy1g3toiwqyz0j208c07caa1.jpgreferhttp___www.sina_.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989357-c7467af8344ef7c74651b1e5fafdfd94.png?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'product_type': 0,
    'product_no': '',
    'price': 319,
    'original_price': 369,
    'discount': 0.86,
    'cost': 0,
    'stock': 1598,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 53434,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': false,
    'order_annotation': [],
    'highest_price': 0,
    'hide_postage': true,
    'postage': 0,
    'quota': 1,
    'quota_type': 2,
    'least': 0,
    'weight': '0',
    'properties': [
      {
        'name': '颜色分类',
        'items': [
          {
            'name': '冰点蓝 经典款',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '浅卡其 经典款',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '冰蓝升级款',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '雅灰升级款',
            'image': '',
            'thumbnail': '',
            'large': ''
          }
        ]
      },
      {
        'name': '尺寸',
        'items': [
          {
            'name': '150*200cm'
          },
          {
            'name': '200*230cm'
          }
        ]
      }
    ],
    'sku_images': {
      '冰点蓝 经典款': '',
      '浅卡其 经典款': '',
      '冰蓝升级款': '',
      '雅灰升级款': ''
    },
    'is_multi_sku': true,
    'skus': [
      {
        'id': 9317,
        'sku_no': '',
        'price': 319,
        'cost': 0,
        'stock': 200,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '雅灰升级款'
          },
          {
            'k': '尺寸',
            'v': '200*230cm'
          }
        ],
        'property_names': '颜色分类:雅灰升级款;尺寸:200*230cm;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"雅灰升级款"},{"k":"尺寸","v":"200*230cm"}]'
      },
      {
        'id': 9316,
        'sku_no': '',
        'price': 319,
        'cost': 0,
        'stock': 199,
        'sales': 1,
        'properties': [
          {
            'k': '颜色分类',
            'v': '雅灰升级款'
          },
          {
            'k': '尺寸',
            'v': '150*200cm'
          }
        ],
        'property_names': '颜色分类:雅灰升级款;尺寸:150*200cm;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"雅灰升级款"},{"k":"尺寸","v":"150*200cm"}]'
      },
      {
        'id': 9315,
        'sku_no': '',
        'price': 319,
        'cost': 0,
        'stock': 200,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '冰蓝升级款'
          },
          {
            'k': '尺寸',
            'v': '200*230cm'
          }
        ],
        'property_names': '颜色分类:冰蓝升级款;尺寸:200*230cm;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"冰蓝升级款"},{"k":"尺寸","v":"200*230cm"}]'
      },
      {
        'id': 9314,
        'sku_no': '',
        'price': 319,
        'cost': 0,
        'stock': 200,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '冰蓝升级款'
          },
          {
            'k': '尺寸',
            'v': '150*200cm'
          }
        ],
        'property_names': '颜色分类:冰蓝升级款;尺寸:150*200cm;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"冰蓝升级款"},{"k":"尺寸","v":"150*200cm"}]'
      },
      {
        'id': 9313,
        'sku_no': '',
        'price': 319,
        'cost': 0,
        'stock': 200,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '浅卡其 经典款'
          },
          {
            'k': '尺寸',
            'v': '200*230cm'
          }
        ],
        'property_names': '颜色分类:浅卡其 经典款;尺寸:200*230cm;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"浅卡其 经典款"},{"k":"尺寸","v":"200*230cm"}]'
      },
      {
        'id': 9312,
        'sku_no': '',
        'price': 319,
        'cost': 0,
        'stock': 200,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '浅卡其 经典款'
          },
          {
            'k': '尺寸',
            'v': '150*200cm'
          }
        ],
        'property_names': '颜色分类:浅卡其 经典款;尺寸:150*200cm;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"浅卡其 经典款"},{"k":"尺寸","v":"150*200cm"}]'
      },
      {
        'id': 9311,
        'sku_no': '',
        'price': 319,
        'cost': 0,
        'stock': 200,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '冰点蓝 经典款'
          },
          {
            'k': '尺寸',
            'v': '200*230cm'
          }
        ],
        'property_names': '颜色分类:冰点蓝 经典款;尺寸:200*230cm;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"冰点蓝 经典款"},{"k":"尺寸","v":"200*230cm"}]'
      },
      {
        'id': 9310,
        'sku_no': '',
        'price': 319,
        'cost': 0,
        'stock': 199,
        'sales': 1,
        'properties': [
          {
            'k': '颜色分类',
            'v': '冰点蓝 经典款'
          },
          {
            'k': '尺寸',
            'v': '150*200cm'
          }
        ],
        'property_names': '颜色分类:冰点蓝 经典款;尺寸:150*200cm;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"冰点蓝 经典款"},{"k":"尺寸","v":"150*200cm"}]'
      }
    ],
    'attributes': [],
    'promotion_type': '',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989357-c7467af8344ef7c74651b1e5fafdfd94.png?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'sku_guide_image': '',
    'hide_price': false,
    'is_sticky': true
  },
  {
    'id': 2403,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 10,
    'icon': '',
    'title': '2333',
    'excerpt': 'aaa',
    'thumbnail': '',
    'user_id': 13277,
    'timestamp': 1627986633,
    'time': '2年前',
    'date': '2021-08-03',
    'day': '08月03日',
    'modified_timestamp': 1676618341,
    'modified_time': '4周前',
    'modified_date': '2023-02-17',
    'format': '',
    'product_category': [
      {
        'id': 66,
        'taxonomy': 'product_category',
        'name': '鞋子',
        'count': 40,
        'description': '',
        'slug': '%e9%9e%8b%e5%ad%90',
        'parent': 0,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#',
        'banner': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_banner.png?imageMogr2/auto-orient/thumbnail/!864x320r/gravity/Center/crop/864x320/quality/70#'
      },
      {
        'id': 27,
        'taxonomy': 'product_category',
        'name': '时尚美妆',
        'count': 32,
        'description': '',
        'slug': '%e6%97%b6%e5%b0%9a%e7%be%8e%e5%a6%86',
        'parent': 67,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2020/12/1609140839-b196c8e36a364a02cb44922623220e31.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#'
      }
    ],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'closed',
    'fav_count': 1,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1627453654-641.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': '',
    'product_type': 0,
    'product_no': '',
    'price': 9999,
    'original_price': 9999,
    'discount': 1,
    'cost': 999,
    'stock': 105,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 6,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': false,
    'order_annotation': [],
    'highest_price': 0,
    'hide_postage': true,
    'postage': 0,
    'quota': 0,
    'quota_type': 0,
    'least': 0,
    'weight': '',
    'properties': [],
    'sku_images': [],
    'is_multi_sku': false,
    'skus': [],
    'attributes': [],
    'promotion_type': 'affiliate_dedicated_enable',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': '',
    'sku_guide_image': '',
    'hide_price': false,
    'is_sticky': true
  },
  {
    'id': 1713,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 10,
    'icon': '',
    'title': '电影折扣券',
    'excerpt': '',
    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620357144-dd581f00773098c2f5f2673d9d27c391.gif?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'user_id': 34445,
    'timestamp': 1676970471,
    'time': '3周前',
    'date': '2023-02-21',
    'day': '02月21日',
    'modified_timestamp': 1676970471,
    'modified_time': '3周前',
    'modified_date': '2023-02-21',
    'format': '',
    'product_category': [],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'open',
    'fav_count': 0,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1627453654-641.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620357144-dd581f00773098c2f5f2673d9d27c391.gif?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'product_type': 1,
    'product_no': '',
    'price': 15,
    'original_price': 20,
    'discount': 0.75,
    'cost': 0,
    'stock': 98,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 1,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': true,
    'order_annotation': [],
    'highest_price': 0,
    'hide_postage': true,
    'postage': 0,
    'quota': 0,
    'quota_type': 0,
    'least': 0,
    'weight': '0',
    'properties': [],
    'sku_images': [],
    'is_multi_sku': false,
    'skus': [],
    'attributes': [],
    'promotion_type': '',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620357144-dd581f00773098c2f5f2673d9d27c391.gif?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'sku_guide_image': '',
    'hide_price': false
  },
  {
    'id': 2584,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 10,
    'icon': '',
    'title': '测试',
    'excerpt': '',
    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'user_id': 51,
    'timestamp': 1651069114,
    'time': '11月前',
    'date': '2022-04-27',
    'day': '04月27日',
    'modified_timestamp': 1676555200,
    'modified_time': '4周前',
    'modified_date': '2023-02-16',
    'format': '',
    'product_category': [],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'open',
    'fav_count': 0,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1627453654-641.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'product_type': 0,
    'product_no': '',
    'price': 1,
    'original_price': 3,
    'discount': 0.33,
    'cost': 0,
    'stock': 5,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 0,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': false,
    'order_annotation': [],
    'highest_price': 0,
    'hide_postage': true,
    'postage': 0,
    'quota': 0,
    'quota_type': 0,
    'least': 0,
    'weight': '',
    'properties': [],
    'sku_images': [],
    'is_multi_sku': false,
    'skus': [],
    'attributes': [],
    'promotion_type': 'affiliate_dedicated_enable',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'sku_guide_image': '',
    'hide_price': false
  },
  {
    'id': 2541,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 60,
    'icon': '',
    'title': "OLSSON S 厨用海盐 1kg OLSSON'S PURE COOKING SEA SALT杯具熊圣诞儿童保温杯女礼物2022新款限量版水杯316不锈钢保温壶",
    'excerpt': '',
    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/02/1645501959-fa2a137fe1f83e3e9f9e60fc3f8ce397.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'user_id': 51,
    'timestamp': 1646444273,
    'time': '1年前',
    'date': '2022-03-05',
    'day': '03月05日',
    'modified_timestamp': 1676547207,
    'modified_time': '4周前',
    'modified_date': '2023-02-16',
    'format': '',
    'product_category': [
      {
        'id': 94,
        'taxonomy': 'product_category',
        'name': '生活日用',
        'count': 1,
        'description': '',
        'slug': '%e7%94%9f%e6%b4%bb%e6%97%a5%e7%94%a8',
        'parent': 0,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#',
        'banner': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_banner.png?imageMogr2/auto-orient/thumbnail/!864x320r/gravity/Center/crop/864x320/quality/70#'
      },
      {
        'id': 25,
        'taxonomy': 'product_category',
        'name': '母婴亲子',
        'count': 4,
        'description': '',
        'slug': '%e6%af%8d%e5%a9%b4%e4%ba%b2%e5%ad%90',
        'parent': 67,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#'
      },
      {
        'id': 76,
        'taxonomy': 'product_category',
        'name': '文具玩具',
        'count': 1,
        'description': '',
        'slug': '%e6%96%87%e5%85%b7%e7%8e%a9%e5%85%b7',
        'parent': 31,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#'
      }
    ],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'open',
    'fav_count': 1,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1627453654-641.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/02/1645501959-fa2a137fe1f83e3e9f9e60fc3f8ce397.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'product_type': 0,
    'product_no': ' ',
    'price': 138,
    'original_price': 138,
    'discount': 1,
    'cost': 85,
    'stock': 98,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 1,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': false,
    'order_annotation': [],
    'highest_price': 0,
    'hide_postage': true,
    'postage': 0,
    'quota': 0,
    'quota_type': 0,
    'least': 0,
    'weight': '',
    'properties': [
      {
        'name': '颜色分类',
        'items': [
          {
            'name': '【弹跳直饮杯】圣诞祥鹿-350ml',
            'image': '//img.alicdn.com/imgextra/i1/2207813763603/O1CN01TAnYI91cUDkaXA0os_!!2207813763603.jpg',
            'thumbnail': '//img.alicdn.com/imgextra/i1/2207813763603/O1CN01TAnYI91cUDkaXA0os_!!2207813763603.jpg',
            'large': '//img.alicdn.com/imgextra/i1/2207813763603/O1CN01TAnYI91cUDkaXA0os_!!2207813763603.jpg'
          }
        ]
      }
    ],
    'sku_images': {
      '【弹跳直饮杯】圣诞祥鹿-350ml': {
        'thumbnail': '//img.alicdn.com/imgextra/i1/2207813763603/O1CN01TAnYI91cUDkaXA0os_!!2207813763603.jpg',
        'large': '//img.alicdn.com/imgextra/i1/2207813763603/O1CN01TAnYI91cUDkaXA0os_!!2207813763603.jpg'
      }
    },
    'is_multi_sku': true,
    'skus': [
      {
        'id': 9919,
        'sku_no': ' ',
        'price': 138,
        'cost': 85,
        'stock': 98,
        'sales': 1,
        'properties': [
          {
            'k': '颜色分类',
            'v': '【弹跳直饮杯】圣诞祥鹿-350ml'
          }
        ],
        'property_names': '颜色分类:【弹跳直饮杯】圣诞祥鹿-350ml;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"【弹跳直饮杯】圣诞祥鹿-350ml"}]'
      }
    ],
    'attributes': [],
    'promotion_type': 'affiliate_dedicated_enable',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/02/1645501959-fa2a137fe1f83e3e9f9e60fc3f8ce397.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'sku_guide_image': '',
    'hide_price': false
  },
  {
    'id': 2504,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 0,
    'icon': '',
    'title': '我的图集1',
    'excerpt': '',
    'thumbnail': '',
    'user_id': 34445,
    'timestamp': 1642130393,
    'time': '1年前',
    'date': '2022-01-14',
    'day': '01月14日',
    'modified_timestamp': 1642130393,
    'modified_time': '1年前',
    'modified_date': '2022-01-14',
    'format': 'image',
    'product_category': [],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'open',
    'fav_count': 0,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'format_content': {
      'images': []
    },
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1627453654-641.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': '',
    'product_type': 0,
    'product_no': '',
    'price': 99,
    'original_price': 111,
    'discount': 0.89,
    'cost': 0,
    'stock': 100,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 0,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': false,
    'order_annotation': [],
    'highest_price': 0,
    'hide_postage': true,
    'postage': 0,
    'quota': 0,
    'quota_type': 0,
    'least': 0,
    'weight': '0',
    'properties': [],
    'sku_images': [],
    'is_multi_sku': false,
    'skus': [],
    'attributes': [],
    'promotion_type': '',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': '',
    'sku_guide_image': '',
    'hide_price': false
  },
  {
    'id': 2496,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 90,
    'icon': '',
    'title': '尊阁 圆形LED吸顶灯饰阳台灯具109书房照明房间灯厨房现代灯',
    'excerpt': '',
    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/01/1642077565-48400a651c180aadd6a80271603d0b6e.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'user_id': 34445,
    'timestamp': 1642077577,
    'time': '1年前',
    'date': '2022-01-13',
    'day': '01月13日',
    'modified_timestamp': 1642077577,
    'modified_time': '1年前',
    'modified_date': '2022-01-13',
    'format': '',
    'product_category': [
      {
        'id': 92,
        'taxonomy': 'product_category',
        'name': '中度灯饰',
        'count': 1,
        'description': '',
        'slug': '%e4%b8%ad%e5%ba%a6%e7%81%af%e9%a5%b0',
        'parent': 0,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#',
        'banner': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_banner.png?imageMogr2/auto-orient/thumbnail/!864x320r/gravity/Center/crop/864x320/quality/70#'
      }
    ],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'open',
    'fav_count': 0,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1627453654-641.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/01/1642077565-48400a651c180aadd6a80271603d0b6e.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'product_type': 0,
    'product_no': 'H2',
    'price': 0.1,
    'original_price': 66,
    'discount': 0,
    'cost': 0,
    'stock': 15,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 1,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': false,
    'order_annotation': [],
    'highest_price': 0,
    'hide_postage': true,
    'postage': 0,
    'quota': 0,
    'quota_type': 0,
    'least': 0,
    'weight': '0',
    'properties': [
      {
        'name': '尺寸',
        'items': [
          {
            'name': '阳台灯具',
            'image': '',
            'thumbnail': '',
            'large': ''
          }
        ]
      }
    ],
    'sku_images': {
      '阳台灯具': ''
    },
    'is_multi_sku': true,
    'skus': [
      {
        'id': 9852,
        'sku_no': '',
        'price': 0.1,
        'cost': 0,
        'stock': 15,
        'sales': 1,
        'properties': [
          {
            'k': '尺寸',
            'v': '阳台灯具'
          }
        ],
        'property_names': '尺寸:阳台灯具;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"尺寸","v":"阳台灯具"}]'
      }
    ],
    'attributes': [],
    'promotion_type': '',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/01/1642077565-48400a651c180aadd6a80271603d0b6e.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'sku_guide_image': '',
    'hide_price': false
  },
  {
    'id': 1767,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 130,
    'icon': '',
    'title': '测试商品 | 迷你保温壶',
    'excerpt': '',
    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989250-1cec9f4d5fcc285744ded8e626d194c0.png?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'user_id': 34445,
    'timestamp': 1636356924,
    'time': '1年前',
    'date': '2021-11-08',
    'day': '11月08日',
    'modified_timestamp': 1636712054,
    'modified_time': '1年前',
    'modified_date': '2021-11-12',
    'format': '',
    'product_category': [
      {
        'id': 27,
        'taxonomy': 'product_category',
        'name': '时尚美妆',
        'count': 32,
        'description': '',
        'slug': '%e6%97%b6%e5%b0%9a%e7%be%8e%e5%a6%86',
        'parent': 67,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2020/12/1609140839-b196c8e36a364a02cb44922623220e31.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#'
      },
      {
        'id': 72,
        'taxonomy': 'product_category',
        'name': '杯壶',
        'count': 1,
        'description': '',
        'slug': '%e6%9d%af%e5%a3%b6',
        'parent': 71,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#'
      },
      {
        'id': 66,
        'taxonomy': 'product_category',
        'name': '鞋子',
        'count': 40,
        'description': '',
        'slug': '%e9%9e%8b%e5%ad%90',
        'parent': 0,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#',
        'banner': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_banner.png?imageMogr2/auto-orient/thumbnail/!864x320r/gravity/Center/crop/864x320/quality/70#'
      }
    ],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'open',
    'fav_count': 0,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1627453654-641.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989250-1cec9f4d5fcc285744ded8e626d194c0.png?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'product_type': 0,
    'product_no': '',
    'price': 83,
    'original_price': 83,
    'discount': 1,
    'cost': 0,
    'stock': 399,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 1,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': false,
    'order_annotation': [],
    'highest_price': 160,
    'hide_postage': true,
    'postage': 0,
    'quota': 0,
    'quota_type': 0,
    'least': 0,
    'weight': '',
    'properties': [
      {
        'name': '颜色',
        'items': [
          {
            'name': '白色',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '黑色',
            'image': '',
            'thumbnail': '',
            'large': ''
          }
        ]
      },
      {
        'name': '容量',
        'items': [
          {
            'name': '1000ML'
          },
          {
            'name': '2000ML'
          }
        ]
      }
    ],
    'sku_images': {
      '白色': '',
      '黑色': ''
    },
    'is_multi_sku': true,
    'skus': [
      {
        'id': 9778,
        'sku_no': '',
        'price': 160,
        'cost': 0,
        'stock': 100,
        'sales': 0,
        'properties': [
          {
            'k': '颜色',
            'v': '黑色'
          },
          {
            'k': '容量',
            'v': '2000ML'
          }
        ],
        'property_names': '颜色:黑色;容量:2000ML;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色","v":"黑色"},{"k":"容量","v":"2000ML"}]'
      },
      {
        'id': 9777,
        'sku_no': '',
        'price': 150,
        'cost': 0,
        'stock': 100,
        'sales': 0,
        'properties': [
          {
            'k': '颜色',
            'v': '白色'
          },
          {
            'k': '容量',
            'v': '2000ML'
          }
        ],
        'property_names': '颜色:白色;容量:2000ML;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色","v":"白色"},{"k":"容量","v":"2000ML"}]'
      },
      {
        'id': 9776,
        'sku_no': '',
        'price': 83,
        'cost': 0,
        'stock': 100,
        'sales': 0,
        'properties': [
          {
            'k': '颜色',
            'v': '黑色'
          },
          {
            'k': '容量',
            'v': '1000ML'
          }
        ],
        'property_names': '颜色:黑色;容量:1000ML;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色","v":"黑色"},{"k":"容量","v":"1000ML"}]'
      },
      {
        'id': 9775,
        'sku_no': '',
        'price': 83,
        'cost': 0,
        'stock': 99,
        'sales': 1,
        'properties': [
          {
            'k': '颜色',
            'v': '白色'
          },
          {
            'k': '容量',
            'v': '1000ML'
          }
        ],
        'property_names': '颜色:白色;容量:1000ML;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色","v":"白色"},{"k":"容量","v":"1000ML"}]'
      }
    ],
    'attributes': [],
    'promotion_type': 'luckydraw_enable',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989250-1cec9f4d5fcc285744ded8e626d194c0.png?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'sku_guide_image': '',
    'hide_price': false
  },
  {
    'id': 1821,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 130,
    'icon': '',
    'title': '进口郁金香鲜花礼盒玫瑰花盒芍药广州同城鲜花速递深圳花店送礼物',
    'excerpt': '',
    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989264-61821b9a638c876a75fcf25f398a42df.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'user_id': 34445,
    'timestamp': 1631873833,
    'time': '1年前',
    'date': '2021-09-17',
    'day': '09月17日',
    'modified_timestamp': 1634911486,
    'modified_time': '1年前',
    'modified_date': '2021-10-22',
    'format': '',
    'product_category': [
      {
        'id': 27,
        'taxonomy': 'product_category',
        'name': '时尚美妆',
        'count': 32,
        'description': '',
        'slug': '%e6%97%b6%e5%b0%9a%e7%be%8e%e5%a6%86',
        'parent': 67,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2020/12/1609140839-b196c8e36a364a02cb44922623220e31.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#'
      },
      {
        'id': 66,
        'taxonomy': 'product_category',
        'name': '鞋子',
        'count': 40,
        'description': '',
        'slug': '%e9%9e%8b%e5%ad%90',
        'parent': 0,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#',
        'banner': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_banner.png?imageMogr2/auto-orient/thumbnail/!864x320r/gravity/Center/crop/864x320/quality/70#'
      }
    ],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'closed',
    'fav_count': 1,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1627453654-641.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989264-61821b9a638c876a75fcf25f398a42df.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'product_type': 0,
    'product_no': '',
    'price': 5,
    'original_price': 398,
    'discount': 0.01,
    'cost': 398,
    'stock': 318,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 29,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': false,
    'order_annotation': [],
    'highest_price': 50,
    'hide_postage': true,
    'postage': 0,
    'quota': 0,
    'quota_type': 0,
    'least': 0,
    'weight': '2',
    'properties': [
      {
        'name': '颜色分类',
        'items': [
          {
            'name': '进口郁金香奶白玫瑰粉玫瑰桔梗紫罗兰等组合',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口粉玫瑰蜜桃玫瑰桔梗乒乓满天星等组合灰盒45',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '3色玫瑰组合30只',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '19只进口粉郁满天星',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口粉郁粉玫风信子组合',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '进口红郁红玫等组合',
            'image': '',
            'thumbnail': '',
            'large': ''
          }
        ]
      },
      {
        'name': '是否含花瓶',
        'items': [
          {
            'name': '不含花瓶'
          }
        ]
      }
    ],
    'sku_images': {
      '进口郁金香奶白玫瑰粉玫瑰桔梗紫罗兰等组合': '',
      '进口粉玫瑰蜜桃玫瑰桔梗乒乓满天星等组合灰盒45': '',
      '3色玫瑰组合30只': '',
      '19只进口粉郁满天星': '',
      '进口粉郁粉玫风信子组合': '',
      '进口红郁红玫等组合': ''
    },
    'is_multi_sku': true,
    'skus': [
      {
        'id': 8776,
        'sku_no': '',
        'price': 5,
        'cost': 698,
        'stock': 61,
        'sales': 23,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口郁金香奶白玫瑰粉玫瑰桔梗紫罗兰等组合'
          },
          {
            'k': '是否含花瓶',
            'v': '不含花瓶'
          }
        ],
        'property_names': '颜色分类:进口郁金香奶白玫瑰粉玫瑰桔梗紫罗兰等组合;是否含花瓶:不含花瓶;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口郁金香奶白玫瑰粉玫瑰桔梗紫罗兰等组合"},{"k":"是否含花瓶","v":"不含花瓶"}]'
      },
      {
        'id': 8775,
        'sku_no': '',
        'price': 10,
        'cost': 398,
        'stock': 20,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口粉玫瑰蜜桃玫瑰桔梗乒乓满天星等组合灰盒45'
          },
          {
            'k': '是否含花瓶',
            'v': '不含花瓶'
          }
        ],
        'property_names': '颜色分类:进口粉玫瑰蜜桃玫瑰桔梗乒乓满天星等组合灰盒45;是否含花瓶:不含花瓶;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口粉玫瑰蜜桃玫瑰桔梗乒乓满天星等组合灰盒45"},{"k":"是否含花瓶","v":"不含花瓶"}]'
      },
      {
        'id': 8774,
        'sku_no': '',
        'price': 15,
        'cost': 598,
        'stock': 45,
        'sales': 1,
        'properties': [
          {
            'k': '颜色分类',
            'v': '3色玫瑰组合30只'
          },
          {
            'k': '是否含花瓶',
            'v': '不含花瓶'
          }
        ],
        'property_names': '颜色分类:3色玫瑰组合30只;是否含花瓶:不含花瓶;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"3色玫瑰组合30只"},{"k":"是否含花瓶","v":"不含花瓶"}]'
      },
      {
        'id': 8773,
        'sku_no': '',
        'price': 20,
        'cost': 598,
        'stock': 29,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '19只进口粉郁满天星'
          },
          {
            'k': '是否含花瓶',
            'v': '不含花瓶'
          }
        ],
        'property_names': '颜色分类:19只进口粉郁满天星;是否含花瓶:不含花瓶;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"19只进口粉郁满天星"},{"k":"是否含花瓶","v":"不含花瓶"}]'
      },
      {
        'id': 8772,
        'sku_no': '',
        'price': 30,
        'cost': 698,
        'stock': 81,
        'sales': 5,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口粉郁粉玫风信子组合'
          },
          {
            'k': '是否含花瓶',
            'v': '不含花瓶'
          }
        ],
        'property_names': '颜色分类:进口粉郁粉玫风信子组合;是否含花瓶:不含花瓶;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口粉郁粉玫风信子组合"},{"k":"是否含花瓶","v":"不含花瓶"}]'
      },
      {
        'id': 8771,
        'sku_no': '',
        'price': 50,
        'cost': 598,
        'stock': 82,
        'sales': 0,
        'properties': [
          {
            'k': '颜色分类',
            'v': '进口红郁红玫等组合'
          },
          {
            'k': '是否含花瓶',
            'v': '不含花瓶'
          }
        ],
        'property_names': '颜色分类:进口红郁红玫等组合;是否含花瓶:不含花瓶;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"颜色分类","v":"进口红郁红玫等组合"},{"k":"是否含花瓶","v":"不含花瓶"}]'
      }
    ],
    'attributes': [],
    'bargain_enable': '1',
    'bargain_price': 1,
    'bargain_member_count': 1,
    'bargain_duration_hours': 1,
    'bargain_finished_count': 2,
    'promotion_type': 'bargain_enable',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989264-61821b9a638c876a75fcf25f398a42df.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'sku_guide_image': '',
    'hide_price': false
  },
  {
    'id': 2429,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 200,
    'icon': '',
    'title': '杏花楼 杏花楼 七星伴月礼盒810g 广式月饼多口味',
    'excerpt': '765519、广式月饼、保质期60天、发货时保质期大于50天',
    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/08/1629450700-2131033193.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'user_id': 12780,
    'timestamp': 1629450700,
    'time': '2年前',
    'date': '2021-08-20',
    'day': '08月20日',
    'modified_timestamp': 1631159409,
    'modified_time': '2年前',
    'modified_date': '2021-09-09',
    'format': '',
    'product_category': [
      {
        'id': 66,
        'taxonomy': 'product_category',
        'name': '鞋子',
        'count': 40,
        'description': '',
        'slug': '%e9%9e%8b%e5%ad%90',
        'parent': 0,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#',
        'banner': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_banner.png?imageMogr2/auto-orient/thumbnail/!864x320r/gravity/Center/crop/864x320/quality/70#'
      }
    ],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'open',
    'fav_count': 0,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1627453654-641.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/08/1629450700-2131033193.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'product_type': 0,
    'product_no': '765519',
    'price': 999,
    'original_price': 999,
    'discount': 1,
    'cost': 0,
    'stock': 24975,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 1,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': false,
    'order_annotation': [],
    'highest_price': 0,
    'hide_postage': true,
    'postage': 0,
    'quota': 0,
    'quota_type': 0,
    'least': 0,
    'weight': '',
    'properties': [
      {
        'name': '口味',
        'items': [
          {
            'name': '七星伴月礼盒810g 广式月饼苹果味',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '七星伴月礼盒810g 广式月饼香蕉味',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '七星伴月礼盒810g 广式月饼西瓜味',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '七星伴月礼盒810g 广式月饼香橙味',
            'image': '',
            'thumbnail': '',
            'large': ''
          },
          {
            'name': '七星伴月礼盒810g 广式月饼草莓味',
            'image': '',
            'thumbnail': '',
            'large': ''
          }
        ]
      },
      {
        'name': '包装',
        'items': [
          {
            'name': '自用不加包装11111111'
          },
          {
            'name': '送朋友简单包装2222222222'
          },
          {
            'name': '送长辈礼盒装2222222222'
          },
          {
            'name': '送领导超级无敌豪华装'
          },
          {
            'name': '钱太多不用给我发货了22222222'
          }
        ]
      }
    ],
    'sku_images': {
      '七星伴月礼盒810g 广式月饼苹果味': '',
      '七星伴月礼盒810g 广式月饼香蕉味': '',
      '七星伴月礼盒810g 广式月饼西瓜味': '',
      '七星伴月礼盒810g 广式月饼香橙味': '',
      '七星伴月礼盒810g 广式月饼草莓味': ''
    },
    'is_multi_sku': true,
    'skus': [
      {
        'id': 9773,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼草莓味'
          },
          {
            'k': '包装',
            'v': '钱太多不用给我发货了22222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼草莓味;包装:钱太多不用给我发货了22222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼草莓味"},{"k":"包装","v":"钱太多不用给我发货了22222222"}]'
      },
      {
        'id': 9772,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼香橙味'
          },
          {
            'k': '包装',
            'v': '钱太多不用给我发货了22222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼香橙味;包装:钱太多不用给我发货了22222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼香橙味"},{"k":"包装","v":"钱太多不用给我发货了22222222"}]'
      },
      {
        'id': 9771,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼西瓜味'
          },
          {
            'k': '包装',
            'v': '钱太多不用给我发货了22222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼西瓜味;包装:钱太多不用给我发货了22222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼西瓜味"},{"k":"包装","v":"钱太多不用给我发货了22222222"}]'
      },
      {
        'id': 9770,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼香蕉味'
          },
          {
            'k': '包装',
            'v': '钱太多不用给我发货了22222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼香蕉味;包装:钱太多不用给我发货了22222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼香蕉味"},{"k":"包装","v":"钱太多不用给我发货了22222222"}]'
      },
      {
        'id': 9769,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼苹果味'
          },
          {
            'k': '包装',
            'v': '钱太多不用给我发货了22222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼苹果味;包装:钱太多不用给我发货了22222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼苹果味"},{"k":"包装","v":"钱太多不用给我发货了22222222"}]'
      },
      {
        'id': 9763,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼草莓味'
          },
          {
            'k': '包装',
            'v': '送领导超级无敌豪华装'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼草莓味;包装:送领导超级无敌豪华装;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼草莓味"},{"k":"包装","v":"送领导超级无敌豪华装"}]'
      },
      {
        'id': 9762,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼香橙味'
          },
          {
            'k': '包装',
            'v': '送领导超级无敌豪华装'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼香橙味;包装:送领导超级无敌豪华装;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼香橙味"},{"k":"包装","v":"送领导超级无敌豪华装"}]'
      },
      {
        'id': 9761,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼西瓜味'
          },
          {
            'k': '包装',
            'v': '送领导超级无敌豪华装'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼西瓜味;包装:送领导超级无敌豪华装;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼西瓜味"},{"k":"包装","v":"送领导超级无敌豪华装"}]'
      },
      {
        'id': 9760,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼香蕉味'
          },
          {
            'k': '包装',
            'v': '送领导超级无敌豪华装'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼香蕉味;包装:送领导超级无敌豪华装;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼香蕉味"},{"k":"包装","v":"送领导超级无敌豪华装"}]'
      },
      {
        'id': 9759,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼苹果味'
          },
          {
            'k': '包装',
            'v': '送领导超级无敌豪华装'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼苹果味;包装:送领导超级无敌豪华装;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼苹果味"},{"k":"包装","v":"送领导超级无敌豪华装"}]'
      },
      {
        'id': 9758,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼草莓味'
          },
          {
            'k': '包装',
            'v': '送长辈礼盒装2222222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼草莓味;包装:送长辈礼盒装2222222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼草莓味"},{"k":"包装","v":"送长辈礼盒装2222222222"}]'
      },
      {
        'id': 9757,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼草莓味'
          },
          {
            'k': '包装',
            'v': '送朋友简单包装2222222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼草莓味;包装:送朋友简单包装2222222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼草莓味"},{"k":"包装","v":"送朋友简单包装2222222222"}]'
      },
      {
        'id': 9756,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼草莓味'
          },
          {
            'k': '包装',
            'v': '自用不加包装11111111'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼草莓味;包装:自用不加包装11111111;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼草莓味"},{"k":"包装","v":"自用不加包装11111111"}]'
      },
      {
        'id': 9755,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼香橙味'
          },
          {
            'k': '包装',
            'v': '送长辈礼盒装2222222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼香橙味;包装:送长辈礼盒装2222222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼香橙味"},{"k":"包装","v":"送长辈礼盒装2222222222"}]'
      },
      {
        'id': 9754,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼香橙味'
          },
          {
            'k': '包装',
            'v': '送朋友简单包装2222222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼香橙味;包装:送朋友简单包装2222222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼香橙味"},{"k":"包装","v":"送朋友简单包装2222222222"}]'
      },
      {
        'id': 9753,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼香橙味'
          },
          {
            'k': '包装',
            'v': '自用不加包装11111111'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼香橙味;包装:自用不加包装11111111;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼香橙味"},{"k":"包装","v":"自用不加包装11111111"}]'
      },
      {
        'id': 9752,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼西瓜味'
          },
          {
            'k': '包装',
            'v': '送长辈礼盒装2222222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼西瓜味;包装:送长辈礼盒装2222222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼西瓜味"},{"k":"包装","v":"送长辈礼盒装2222222222"}]'
      },
      {
        'id': 9751,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼西瓜味'
          },
          {
            'k': '包装',
            'v': '送朋友简单包装2222222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼西瓜味;包装:送朋友简单包装2222222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼西瓜味"},{"k":"包装","v":"送朋友简单包装2222222222"}]'
      },
      {
        'id': 9750,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼西瓜味'
          },
          {
            'k': '包装',
            'v': '自用不加包装11111111'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼西瓜味;包装:自用不加包装11111111;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼西瓜味"},{"k":"包装","v":"自用不加包装11111111"}]'
      },
      {
        'id': 9749,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼香蕉味'
          },
          {
            'k': '包装',
            'v': '送长辈礼盒装2222222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼香蕉味;包装:送长辈礼盒装2222222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼香蕉味"},{"k":"包装","v":"送长辈礼盒装2222222222"}]'
      },
      {
        'id': 9748,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼香蕉味'
          },
          {
            'k': '包装',
            'v': '送朋友简单包装2222222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼香蕉味;包装:送朋友简单包装2222222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼香蕉味"},{"k":"包装","v":"送朋友简单包装2222222222"}]'
      },
      {
        'id': 9747,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼香蕉味'
          },
          {
            'k': '包装',
            'v': '自用不加包装11111111'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼香蕉味;包装:自用不加包装11111111;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼香蕉味"},{"k":"包装","v":"自用不加包装11111111"}]'
      },
      {
        'id': 9746,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼苹果味'
          },
          {
            'k': '包装',
            'v': '送长辈礼盒装2222222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼苹果味;包装:送长辈礼盒装2222222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼苹果味"},{"k":"包装","v":"送长辈礼盒装2222222222"}]'
      },
      {
        'id': 9745,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼苹果味'
          },
          {
            'k': '包装',
            'v': '送朋友简单包装2222222222'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼苹果味;包装:送朋友简单包装2222222222;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼苹果味"},{"k":"包装","v":"送朋友简单包装2222222222"}]'
      },
      {
        'id': 9744,
        'sku_no': '',
        'price': 999,
        'cost': 0,
        'stock': 999,
        'sales': 0,
        'properties': [
          {
            'k': '口味',
            'v': '七星伴月礼盒810g 广式月饼苹果味'
          },
          {
            'k': '包装',
            'v': '自用不加包装11111111'
          }
        ],
        'property_names': '口味:七星伴月礼盒810g 广式月饼苹果味;包装:自用不加包装11111111;',
        'type': '0',
        'copy_id': '0',
        'store_id': 0,
        'properties_json': '[{"k":"口味","v":"七星伴月礼盒810g 广式月饼苹果味"},{"k":"包装","v":"自用不加包装11111111"}]'
      }
    ],
    'attributes': [],
    'promotion_type': 'luckydraw_enable',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/08/1629450700-2131033193.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'sku_guide_image': '',
    'hide_price': false
  },
  {
    'id': 2427,
    'type': 'product',
    'post_type': 'product',
    'status': 'publish',
    'views': 10,
    'icon': '',
    'title': '中元节饰品',
    'excerpt': '',
    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989403-8997901f94198f0ac680ccd095ad48e3.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'user_id': 34445,
    'timestamp': 1629449356,
    'time': '2年前',
    'date': '2021-08-20',
    'day': '',
    'modified_timestamp': 1630919981,
    'modified_time': '2年前',
    'modified_date': '2021-09-06',
    'format': '',
    'product_category': [
      {
        'id': 66,
        'taxonomy': 'product_category',
        'name': '鞋子',
        'count': 40,
        'description': '',
        'slug': '%e9%9e%8b%e5%ad%90',
        'parent': 0,
        'thumbnail': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_thumbnail.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/70#',
        'banner': 'http://cdn2.wpweixin.com/wp-content/develop/wpjam-shop2/extends/wpjam-product/static/product_category_banner.png?imageMogr2/auto-orient/thumbnail/!864x320r/gravity/Center/crop/864x320/quality/70#'
      }
    ],
    'comment_sticky': true,
    'comment_rating': true,
    'rating': 5,
    'comment_read': true,
    'comment_images': true,
    'comment_moderation': true,
    'reply_type': 'admin_reply',
    'comment_count': 0,
    'comment_status': 'closed',
    'fav_count': 3,
    'fav_status': 'open',
    'affiliate_enable': true,
    'commission_percent_level_1': 100000,
    'commission_percent_level_2': 100000,
    'affiliate_cps_enable': false,
    'shipping_types': [
      1,
      2,
      4
    ],
    'parent': 0,
    'share_image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/07/1627453654-641.jpg?imageMogr2/auto-orient/thumbnail/!500x400r/gravity/Center/crop/500x400/quality/70#',
    'poster': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989403-8997901f94198f0ac680ccd095ad48e3.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70#',
    'product_type': 0,
    'product_no': '',
    'price': 0.1,
    'original_price': 0.1,
    'discount': 1,
    'cost': 0,
    'stock': 12220,
    'blur_stock': {
      'enough_stock': 100,
      'less_stock': 5,
      'enough_stock_text': '库存充足',
      'enough_stock_color': '#78c900',
      'less_stock_text': '少量库存',
      'less_stock_color': '#ff0000',
      'between_stock_text': '库存紧张',
      'between_stock_color': '#ffc300'
    },
    'sales_hidden': 1,
    'sales': 0,
    'tax_free': 0,
    'tax_included': 0,
    'tax_rate': 0,
    'individual_buy': false,
    'order_annotation': [],
    'highest_price': 0,
    'hide_postage': true,
    'postage': 0,
    'quota': 1,
    'quota_type': 2,
    'least': 0,
    'weight': '',
    'properties': [],
    'sku_images': [],
    'is_multi_sku': false,
    'skus': [],
    'attributes': [],
    'promotion_type': 'luckydraw_enable',
    'reply_enable': true,
    'reply_count': 0,
    'product_annotation': [],
    'related_product': [],
    'free_product': [],
    'special_attributes': [],
    'product_style_type': 1,
    'gift_enable': false,
    'module_cover': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2021/05/1620989403-8997901f94198f0ac680ccd095ad48e3.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#',
    'sku_guide_image': '',
    'hide_price': false
  }
]
  },
  // 切换tab
   changeFilterList(e) {
        this.setData({
            filterData: e.detail,
            current_page: 0,
            isLoading: true,
            members: []
        }, this.filterShareList);
        console.log(this.data);
    },
  async initPage() {
    // console.log('000');
    // const { id } = this.options;
    // console.log(id, 'ii1');
    // const data = await api.hei.fetchProduct({ id });
    // console.log(data, 'data');
    // const { config, share_title, share_image } = data;
    // this.config = config;
    // wx.setNavigationBarTitle({
    //   title: data.page_title,
    // });
    // this.setData({ product, isShowSkuModal: true });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('===');
    console.log('091');
    this.initPage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
