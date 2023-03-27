import api from "utils/api";
import { onDefaultShareAppMessage } from "utils/pageShare";
import { CONFIG } from "constants/index";
import { updateTabbar } from "../../utils/util";
const app = getApp();

Page({
  data: {
    swiperCurrent: 0,
    categories: [
      {
        name: "服饰",
        banner: [
          "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
          "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
          "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
        ],
        children: [
          {
            title: "人气热销",
            children: [
              {
                name: "运动鞋",
                thumbnail:
                  "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
              },
              {
                name: "运动鞋",
                thumbnail:
                  "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
              },
              {
                name: "运动鞋",
                thumbnail:
                  "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
              },
              {
                name: "运动鞋",
                thumbnail:
                  "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
              },
            ],
          },
          {
            title: "运动鞋",
            children: [
              {
                name: "运动鞋",
                thumbnail:
                  "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
              },
              {
                name: "运动鞋",
                thumbnail:
                  "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
              },
            ],
          },
        ],
      },
      {
        name: "鞋靴",
      },
      {
        name: "箱包",
      },
      {
        name: "护肤",
      },
      {
        name: "彩妆",
      },
      {
        name: "香水",
      },
      {
        name: "精品",
      },
      {
        name: "母婴",
      },
    ],
    selectedIndex: 0,
    isLoading: true,
    showIndex: 0,
  },

  async onLoad() {
    console.log(121);
  },

  onShow() {
    console.log(121);
  },

  getDomRect(id) {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select(`#${id}`)
        .boundingClientRect((rect) => {
          resolve(rect);
        })
        .exec();
    });
  },

  async getCategoryTop() {
    const { categories = [] } = this.data;
    const categoryTops = [];
    for (const i in categories) {
      const rect = await this.getDomRect("c" + i);
      categoryTops.push(rect && rect.top);
    }
    this.setData({ categoryTops });
    console.log(categoryTops, "ooo");
  },

  async onScroll(e) {
    const { categoryTops } = this.data;
    if (categoryTops) {
      const { scrollTop } = e.detail;
      let index = categoryTops.findIndex((item) => {
        return item >= scrollTop;
      });
      if (scrollTop > categoryTops[categoryTops.length - 1]) {
        index = categoryTops.length - 1;
      }
      this.setData({
        showIndex: index,
      });
    }
  },

  onMainCategoryItemClick(ev) {
    console.log(ev.currentTarget.dataset, 231);
    const { index } = ev.currentTarget.dataset;
    this.setData({
      selectedIndex: index,
      showIndex: index,
    });
  },
  onShareAppMessage: onDefaultShareAppMessage,

  // async onPullDownRefresh() {
  //     this.onLoad();
  //     wx.stopPullDownRefresh();
  // }
});
