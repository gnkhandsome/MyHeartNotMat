// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { page = 1, limit = 10, lastId, postId } = event
    const safePage = Math.max(1, Number(page) || 1)
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10))
    
    // 如果提供了postId，查询单个动态
    if (postId) {
      const result = await db.collection('posts').doc(postId).get()
      const posts = result.data ? [result.data] : []
      const total = result.data ? 1 : 0
      const hasMore = false
      return {
        success: true,
        code: 0,
        message: '获取成功',
        data: {
          posts,
          total,
          hasMore
        }
      }
    }
    
    let query = db.collection('posts').orderBy('createdAt', 'desc')
    
    // 如果有lastId，使用分页查询
    if (lastId) {
      const lastPost = await db.collection('posts').doc(lastId).get()
      if (lastPost.data) {
        query = query.where({
          createdAt: db.command.lt(lastPost.data.createdAt)
        })
      }
    }
    
    // 执行查询
    const result = await query
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .get()

    const posts = result.data
    const total = result.data.length
    const hasMore = result.data.length === safeLimit
    
    return {
      success: true,
      code: 0,
      message: '获取成功',
      data: {
        posts,
        total,
        hasMore
      }
    }
  } catch (error) {
    console.error('获取动态列表失败:', error)
    return {
      success: false,
      code: 50000,
      message: '获取失败',
      data: null
    }
  }
}
