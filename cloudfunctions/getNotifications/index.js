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
    const { page = 1, pageSize = 20, unreadOnly = false } = event
    const safePage = Math.max(1, Number(page) || 1)
    const safePageSize = Math.min(50, Math.max(1, Number(pageSize) || 20))

    const where = {
      receiverId: OPENID
    }
    if (unreadOnly) {
      where.read = false
    }
    
    const query = db.collection('notifications').where(where)
    
    // 获取通知列表，按创建时间倒序排列
    const result = await query
      .orderBy('createdAt', 'desc')
      .skip((safePage - 1) * safePageSize)
      .limit(safePageSize)
      .get()
    
    // 直接返回通知列表，不获取发送者信息（用户信息存储在本地）
    const notifications = result.data
    
    // 获取未读通知数量
    const unreadCountResult = await db.collection('notifications')
      .where({
        receiverId: OPENID,
        read: false
      })
      .count()
    
    return {
      success: true,
      code: 0,
      message: '获取通知列表成功',
      data: {
        notifications,
        total: result.data.length,
        unreadCount: unreadCountResult.total
      }
    }
  } catch (error) {
    console.error('获取通知列表失败:', error)
    return {
      success: false,
      code: 50000,
      message: '获取通知列表失败',
      data: null
    }
  }
}