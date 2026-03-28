// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { userId, page = 1, limit = 10 } = event
    
    if (!userId) {
      return {
        success: false,
        message: '缺少用户ID'
      }
    }
    
    // 查询用户的发布列表
    const result = await db.collection('posts')
      .where({
        userId: userId
      })
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()
    
    return {
      success: true,
      posts: result.data,
      total: result.data.length
    }
  } catch (error) {
    console.error('获取用户发布列表失败:', error)
    return {
      success: false,
      message: '获取失败',
      error: error.message
    }
  }
}
