// pages/shopDetail/index.js

import api from 'utils/api';
const app = getApp();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    product: {
    'id': 7,
    'type': 1,
    'post_type': 'product',
    'status': 'publish',
    'views': 202,
    'icon': '',
    'title': '测试商品',
    'excerpt': 'a:1:{i:0;s:154:"http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2023/03/1678087530-8989ed0a6d4eea3d70b47b6103b8828d.jpg?orientation=portrait&width=1280&height=1923";}',
    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509699-%E7%BB%98%E7%94%BB.png?imageMogr2/auto-orient/thumbnail/!400x400r/gravity/Center/crop/400x400/format/webp#',
    'user_id': 28,
    'timestamp': 1659952052,
    'time': '7月前',
    'date': '2022-08-08',
    'day': '08月08日',
    'modified_timestamp': 1678353535,
    'modified_time': '23小时前',
    'modified_date': '2023-03-09',
    'name': 'adf',
    'post_url': '/?product=adf',
    'images': [
        {
            'large': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509699-%E7%BB%98%E7%94%BB.png?imageMogr2/auto-orient/thumbnail/!1200x1200r/gravity/Center/crop/1200x1200/format/webp#',
            'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509699-%E7%BB%98%E7%94%BB.png?imageMogr2/auto-orient/thumbnail/!400x400r/gravity/Center/crop/400x400/format/webp#',
            'orientation': 'landscape',
            'width': 152,
            'thumbnail_width': 400,
            'height': 152,
            'thumbnail_height': 400,
            'full': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509699-%E7%BB%98%E7%94%BB.png?imageMogr2/auto-orient/format/webp#'
        },
        {
            'large': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509700-%E7%90%86%E8%B4%A2.png?imageMogr2/auto-orient/thumbnail/!1200x1200r/gravity/Center/crop/1200x1200/format/webp#',
            'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509700-%E7%90%86%E8%B4%A2.png?imageMogr2/auto-orient/thumbnail/!400x400r/gravity/Center/crop/400x400/format/webp#',
            'orientation': 'landscape',
            'width': 120,
            'thumbnail_width': 400,
            'height': 120,
            'thumbnail_height': 400,
            'full': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509700-%E7%90%86%E8%B4%A2.png?imageMogr2/auto-orient/format/webp#'
        },
        {
            'large': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/08/1665712639-image.png?imageMogr2/auto-orient/thumbnail/!1200x1200r/gravity/Center/crop/1200x1200/format/webp#',
            'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/08/1665712639-image.png?imageMogr2/auto-orient/thumbnail/!400x400r/gravity/Center/crop/400x400/format/webp#',
            'orientation': 'landscape',
            'width': 750,
            'thumbnail_width': 400,
            'height': 750,
            'thumbnail_height': 400,
            'full': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/08/1665712639-image.png?imageMogr2/auto-orient/format/webp#'
        },
        {
            'large': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/08/1665712589-1664350714089-1.png?imageMogr2/auto-orient/thumbnail/!1200x1200r/gravity/Center/crop/1200x1200/format/webp#',
            'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/08/1665712589-1664350714089-1.png?imageMogr2/auto-orient/thumbnail/!400x400r/gravity/Center/crop/400x400/format/webp#',
            'orientation': 'landscape',
            'width': 635,
            'thumbnail_width': 400,
            'height': 496,
            'thumbnail_height': 400,
            'full': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/08/1665712589-1664350714089-1.png?imageMogr2/auto-orient/format/webp#'
        },
        {
            'large': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/08/1665712589-1664350693336-1.png?imageMogr2/auto-orient/thumbnail/!1200x1200r/gravity/Center/crop/1200x1200/format/webp#',
            'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/08/1665712589-1664350693336-1.png?imageMogr2/auto-orient/thumbnail/!400x400r/gravity/Center/crop/400x400/format/webp#',
            'orientation': 'portrait',
            'width': 660,
            'thumbnail_width': 400,
            'height': 862,
            'thumbnail_height': 400,
            'full': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/08/1665712589-1664350693336-1.png?imageMogr2/auto-orient/format/webp#'
        },
        {
            'large': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509916-%E8%81%8C%E5%9C%BA.png?imageMogr2/auto-orient/thumbnail/!1200x1200r/gravity/Center/crop/1200x1200/format/webp#',
            'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509916-%E8%81%8C%E5%9C%BA.png?imageMogr2/auto-orient/thumbnail/!400x400r/gravity/Center/crop/400x400/format/webp#',
            'orientation': 'landscape',
            'width': 152,
            'thumbnail_width': 400,
            'height': 152,
            'thumbnail_height': 400,
            'full': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509916-%E8%81%8C%E5%9C%BA.png?imageMogr2/auto-orient/format/webp#'
        },
        {
            'large': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509916-%E7%BA%A6%E9%A5%AD.png?imageMogr2/auto-orient/thumbnail/!1200x1200r/gravity/Center/crop/1200x1200/format/webp#',
            'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509916-%E7%BA%A6%E9%A5%AD.png?imageMogr2/auto-orient/thumbnail/!400x400r/gravity/Center/crop/400x400/format/webp#',
            'orientation': 'landscape',
            'width': 160,
            'thumbnail_width': 400,
            'height': 152,
            'thumbnail_height': 400,
            'full': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509916-%E7%BA%A6%E9%A5%AD.png?imageMogr2/auto-orient/format/webp#'
        },
        {
            'large': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509700-%E8%84%B1%E5%8D%95.png?imageMogr2/auto-orient/thumbnail/!1200x1200r/gravity/Center/crop/1200x1200/format/webp#',
            'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509700-%E8%84%B1%E5%8D%95.png?imageMogr2/auto-orient/thumbnail/!400x400r/gravity/Center/crop/400x400/format/webp#',
            'orientation': 'landscape',
            'width': 160,
            'thumbnail_width': 400,
            'height': 152,
            'thumbnail_height': 400,
            'full': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509700-%E8%84%B1%E5%8D%95.png?imageMogr2/auto-orient/format/webp#'
        },
        {
            'large': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509699-%E6%9B%B4%E5%A4%9A.png?imageMogr2/auto-orient/thumbnail/!1200x1200r/gravity/Center/crop/1200x1200/format/webp#',
            'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509699-%E6%9B%B4%E5%A4%9A.png?imageMogr2/auto-orient/thumbnail/!400x400r/gravity/Center/crop/400x400/format/webp#',
            'orientation': 'landscape',
            'width': 152,
            'thumbnail_width': 400,
            'height': 152,
            'thumbnail_height': 400,
            'full': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2022/09/1664509699-%E6%9B%B4%E5%A4%9A.png?imageMogr2/auto-orient/format/webp#'
        }
    ],
    'product_category': [
        {
            'id': 60,
            'taxonomy': 'product_category',
            'name': '家用电器',
            'count': 1,
            'description': '',
            'slug': '%e5%ae%b6%e7%94%a8%e7%94%b5%e5%99%a8',
            'parent': 0
        }
    ],
    'content': [
        'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2023/03/1678087530-8989ed0a6d4eea3d70b47b6103b8828d.jpg?imageMogr2/auto-orient/thumbnail/750x/format/webp#'
    ],
    'comment_sticky': true,
    'comment_read': true,
    'reply_type': 'all',
    'comment_count': 0,
    'comment_status': 'open',
    'comments': [],
    'fav_count': 0,
    'fav_status': 'open',
    'is_faved': false,
    'sku_no': 'sdfdfs',
    'stp': 3331,
    'price': 213,
    'cost': 100,
    'stock': 45000,
    'sales': 111,
    'product_no': 'sdfdfs',
    'highest_price': 213,
    'discount': 0.06,
    'is_multi_sku': true,
    'definePrice': 123, // 价格
    'coupons_price': 222, // 优惠价格
    'product_type': 1, // 购买数量加减隐藏
    'properties': [
        {
            'name': '颜色',
            'items': [
                {
                    'name': '红色',
                    'image': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2023/03/1678087530-8989ed0a6d4eea3d70b47b6103b8828d.jpg?imageMogr2/auto-orient/format/webp#',
                    'large': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2023/03/1678087530-8989ed0a6d4eea3d70b47b6103b8828d.jpg?imageMogr2/auto-orient/thumbnail/!750x750r/gravity/Center/crop/750x750/format/webp#',
                    'thumbnail': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/6749/2023/03/1678087530-8989ed0a6d4eea3d70b47b6103b8828d.jpg?imageMogr2/auto-orient/thumbnail/!360x360r/gravity/Center/crop/360x360/format/webp#'
                },
                {
                    'name': '绿色',
                    'thumbnail': '',
                    'large': '',
                    'image': ''
                },
                {
                    'name': '黄色',
                    'thumbnail': '',
                    'large': '',
                    'image': ''
                },
                {
                    'name': '天青色',
                    'thumbnail': '',
                    'large': '',
                    'image': ''
                },
                {
                    'name': '天蓝色',
                    'thumbnail': '',
                    'large': '',
                    'image': ''
                }
            ]
        },
        {
            'name': '尺寸',
            'items': [
                {
                    'name': 'S'
                },
                {
                    'name': 'M'
                },
                {
                    'name': 'L'
                }
            ]
        }
    ],
    'skus': [
        {
            'id': 33,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '红色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:红色;尺寸:S;其他:1;',
            'properties_json': '[{"k":"颜色","v":"红色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 34,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '红色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:红色;尺寸:S;其他:2;',
            'properties_json': '[{"k":"颜色","v":"红色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 35,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '红色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:红色;尺寸:S;其他:3;',
            'properties_json': '[{"k":"颜色","v":"红色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 36,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '红色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:红色;尺寸:M;其他:1;',
            'properties_json': '[{"k":"颜色","v":"红色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 37,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '红色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:红色;尺寸:M;其他:2;',
            'properties_json': '[{"k":"颜色","v":"红色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 38,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '红色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:红色;尺寸:M;其他:3;',
            'properties_json': '[{"k":"颜色","v":"红色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 39,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '红色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:红色;尺寸:L;其他:1;',
            'properties_json': '[{"k":"颜色","v":"红色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 40,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '红色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:红色;尺寸:L;其他:2;',
            'properties_json': '[{"k":"颜色","v":"红色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 41,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '红色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:红色;尺寸:L;其他:3;',
            'properties_json': '[{"k":"颜色","v":"红色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 42,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '绿色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:绿色;尺寸:S;其他:1;',
            'properties_json': '[{"k":"颜色","v":"绿色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 43,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '绿色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:绿色;尺寸:S;其他:2;',
            'properties_json': '[{"k":"颜色","v":"绿色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 44,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '绿色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:绿色;尺寸:S;其他:3;',
            'properties_json': '[{"k":"颜色","v":"绿色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 45,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '绿色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:绿色;尺寸:M;其他:1;',
            'properties_json': '[{"k":"颜色","v":"绿色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 46,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '绿色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:绿色;尺寸:M;其他:2;',
            'properties_json': '[{"k":"颜色","v":"绿色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 47,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '绿色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:绿色;尺寸:M;其他:3;',
            'properties_json': '[{"k":"颜色","v":"绿色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 48,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '绿色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:绿色;尺寸:L;其他:1;',
            'properties_json': '[{"k":"颜色","v":"绿色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 49,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '绿色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:绿色;尺寸:L;其他:2;',
            'properties_json': '[{"k":"颜色","v":"绿色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 50,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '绿色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:绿色;尺寸:L;其他:3;',
            'properties_json': '[{"k":"颜色","v":"绿色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 51,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '黄色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:黄色;尺寸:S;其他:1;',
            'properties_json': '[{"k":"颜色","v":"黄色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 52,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '黄色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:黄色;尺寸:S;其他:2;',
            'properties_json': '[{"k":"颜色","v":"黄色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 53,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '黄色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:黄色;尺寸:S;其他:3;',
            'properties_json': '[{"k":"颜色","v":"黄色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 54,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '黄色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:黄色;尺寸:M;其他:1;',
            'properties_json': '[{"k":"颜色","v":"黄色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 55,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '黄色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:黄色;尺寸:M;其他:2;',
            'properties_json': '[{"k":"颜色","v":"黄色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 56,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '黄色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:黄色;尺寸:M;其他:3;',
            'properties_json': '[{"k":"颜色","v":"黄色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 57,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '黄色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:黄色;尺寸:L;其他:1;',
            'properties_json': '[{"k":"颜色","v":"黄色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 58,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '黄色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:黄色;尺寸:L;其他:2;',
            'properties_json': '[{"k":"颜色","v":"黄色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 59,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '黄色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:黄色;尺寸:L;其他:3;',
            'properties_json': '[{"k":"颜色","v":"黄色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 60,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天青色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:天青色;尺寸:S;其他:1;',
            'properties_json': '[{"k":"颜色","v":"天青色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 61,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天青色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:天青色;尺寸:S;其他:2;',
            'properties_json': '[{"k":"颜色","v":"天青色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 62,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天青色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:天青色;尺寸:S;其他:3;',
            'properties_json': '[{"k":"颜色","v":"天青色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 63,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天青色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:天青色;尺寸:M;其他:1;',
            'properties_json': '[{"k":"颜色","v":"天青色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 64,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天青色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:天青色;尺寸:M;其他:2;',
            'properties_json': '[{"k":"颜色","v":"天青色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 65,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天青色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:天青色;尺寸:M;其他:3;',
            'properties_json': '[{"k":"颜色","v":"天青色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 66,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天青色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:天青色;尺寸:L;其他:1;',
            'properties_json': '[{"k":"颜色","v":"天青色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 67,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天青色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:天青色;尺寸:L;其他:2;',
            'properties_json': '[{"k":"颜色","v":"天青色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 68,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天青色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:天青色;尺寸:L;其他:3;',
            'properties_json': '[{"k":"颜色","v":"天青色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 69,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天蓝色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:天蓝色;尺寸:S;其他:1;',
            'properties_json': '[{"k":"颜色","v":"天蓝色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 70,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天蓝色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:天蓝色;尺寸:S;其他:2;',
            'properties_json': '[{"k":"颜色","v":"天蓝色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 71,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天蓝色'
                },
                {
                    'k': '尺寸',
                    'v': 'S'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:天蓝色;尺寸:S;其他:3;',
            'properties_json': '[{"k":"颜色","v":"天蓝色"},{"k":"尺寸","v":"S"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 72,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天蓝色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:天蓝色;尺寸:M;其他:1;',
            'properties_json': '[{"k":"颜色","v":"天蓝色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 73,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天蓝色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:天蓝色;尺寸:M;其他:2;',
            'properties_json': '[{"k":"颜色","v":"天蓝色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 74,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天蓝色'
                },
                {
                    'k': '尺寸',
                    'v': 'M'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:天蓝色;尺寸:M;其他:3;',
            'properties_json': '[{"k":"颜色","v":"天蓝色"},{"k":"尺寸","v":"M"},{"k":"其他","v":"3"}]'
        },
        {
            'id': 75,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天蓝色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '1'
                }
            ],
            'property_names': '颜色:天蓝色;尺寸:L;其他:1;',
            'properties_json': '[{"k":"颜色","v":"天蓝色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"1"}]'
        },
        {
            'id': 76,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天蓝色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '2'
                }
            ],
            'property_names': '颜色:天蓝色;尺寸:L;其他:2;',
            'properties_json': '[{"k":"颜色","v":"天蓝色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"2"}]'
        },
        {
            'id': 77,
            'type': 0,
            'sku_no': '0',
            'stp': 0,
            'price': 213,
            'cost': 100,
            'stock': 1000,
            'sales': 0,
            'properties': [
                {
                    'k': '颜色',
                    'v': '天蓝色'
                },
                {
                    'k': '尺寸',
                    'v': 'L'
                },
                {
                    'k': '其他',
                    'v': '3'
                }
            ],
            'property_names': '颜色:天蓝色;尺寸:L;其他:3;',
            'properties_json': '[{"k":"颜色","v":"天蓝色"},{"k":"尺寸","v":"L"},{"k":"其他","v":"3"}]'
        }
    ],
    isGrouponBuy: true
},
    actions: [
      {
        type: 'onBuy',
        text: '立即支付¥399',
      },
    ],
    isShowSkuModal: false,
    isBargainBuy: false, // 购买数量加减隐藏
    time: 30 * 60 * 60 * 1000, // 倒计时
    timeData: {},
  },

    countdownChange(e) {
        this.setData({
        timeData: e.detail,
        });
    },
    
  handleClick() {
      this.setData({ isShowSkuModal: true });
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
