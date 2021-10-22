const { query } = require("../utils/mysql");

// 新建订单
module.exports.newOrder = async ({ appid, mch_id, total_fee, out_trade_no, nonce_str, sign, trade_type, fee_type = "CNY" }) => {
  return await query(
    `INSERT INTO payorder(appid,fee_type,mch_id,nonce_str,out_trade_no,sign,total_fee,trade_type,trade_state) values('${appid}','${fee_type}','${mch_id}','${nonce_str}','${out_trade_no}','${sign}','${total_fee}','${trade_type}','NOTPAY')`
  );
};
// 更新订单
module.exports.updataOrder = async (payload) => {
  const sqlPrefix = `UPDATE payorder SET `;
  const sql = Object.keys(payload)
    .sort()
    .reduce((prev, next) => (prev += `${prev === sqlPrefix ? `` : `,`}${next} = '${payload[next]}'`), sqlPrefix)
    .concat(` WHERE out_trade_no = '${payload.out_trade_no}'`);
  return await query(sql);
};
