// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { OPENID } = cloud.getWXContext()
    const { page = 1, limit = 10 } = event
    const safePage = Math.max(1, Number(page) || 1)
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10))
    
    // 查询用户的发布列表
    const result = await db.collection('posts')
      .where({
        userId: OPENID
      })
      .orderBy('createdAt', 'desc')
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .get()
    
    return {
      success: true,
      code: 0,
      message: '获取成功',
      data: {
        posts: result.data,
        total: result.data.length
      }
    }
  } catch (error) {
    console.error('获取用户发布列表失败:', error)
    return {
      success: false,
      code: 50000,
      message: '获取失败',
      data: null
    }
  }
}
