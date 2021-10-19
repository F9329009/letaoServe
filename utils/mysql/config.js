// mysql 数据库连接配置
module.exports.mysqlConfig = {
  // 开发环境
  dev: {
    // 数据库主机名
    host: "127.0.0.1",
    // 端口
    port: 3306,
    // 用户名
    user: "root",
    // 密码
    password: "123456",
    // 数据库名称
    database: "letao",
    // 最大连接数
    connectionLimit: 100,
    // 在初始连接到 MySQL 服务器期间发生超时之前的毫秒数
    connectTimeout: 60 * 1000,
    // 连接获取过程中发生超时前的毫秒数
    acquireTimeout: 60 * 1000,
    // 连接超时时间
    timeout: 60 * 1000,
    //允许每次查询多条 mysql 语句(有注入攻击的风险)
    // multipleStatements: true,
    // 在处理数据库中的大数(BIGINT 和 DECIMAL 列)时，您应该启用此选项
    supportBigNumbers: true,
  },
  // 测试环境
  uat: {
    // 数据库主机名
    host: "127.0.0.1",
    // 端口
    port: 3306,
    // 用户名
    user: "root",
    // 密码
    password: "123456",
    // 数据库名称
    database: "letao",
    // 最大连接数
    connectionLimit: 100,
    // 在初始连接到 MySQL 服务器期间发生超时之前的毫秒数
    connectTimeout: 60 * 1000,
    // 连接获取过程中发生超时前的毫秒数
    acquireTimeout: 60 * 1000,
    // 连接超时时间
    timeout: 60 * 1000,
    //允许每次查询多条 mysql 语句(有注入攻击的风险)
    // multipleStatements: true,
    // 在处理数据库中的大数(BIGINT 和 DECIMAL 列)时，您应该启用此选项
    supportBigNumbers: true,
  },
  // 生产环境
  pro: {
    // 数据库主机名
    host: "127.0.0.1",
    // 端口
    port: 3306,
    // 用户名
    user: "root",
    // 密码
    password: "123456",
    // 数据库名称
    database: "letao",
    // 最大连接数
    connectionLimit: 100,
    // 在初始连接到 MySQL 服务器期间发生超时之前的毫秒数
    connectTimeout: 60 * 1000,
    // 连接获取过程中发生超时前的毫秒数
    acquireTimeout: 60 * 1000,
    // 连接超时时间
    timeout: 60 * 1000,
    //允许每次查询多条 mysql 语句(有注入攻击的风险)
    // multipleStatements: true,
    // 在处理数据库中的大数(BIGINT 和 DECIMAL 列)时，您应该启用此选项
    supportBigNumbers: true,
  },
};
