const { query } = require("../utils/mysql");
// 轮播图
module.exports.banners = async (ctx, next) => {
  ctx.body = {
    status: 200,
    swipeList: [],
  };
};

// 运动专区
module.exports.sports = async (ctx, next) => {
  ctx.body = {
    status: 200,
    sportsList: [],
  };
};

// 宫格列表
module.exports.gridlist = async (ctx, next) => {
  query("SELECT * FROM category");
  ctx.body = {
    status: 200,
    gridlist: [
      {
        id: 1,
        img: "/images/nav1.png",
      },
      {
        id: 2,
        img: "/images/nav2.png",
      },
      {
        id: 3,
        img: "/images/nav3.png",
      },
      {
        id: 4,
        img: "/images/nav4.png",
      },
      {
        id: 5,
        img: "/images/nav5.png",
      },
    ],
  };
};
