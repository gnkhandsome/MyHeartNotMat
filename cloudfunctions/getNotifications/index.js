// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { userId, page = 1, pageSize = 20, unreadOnly = false } = event
    
    if (!userId) {
      return {
        success: false,
        message: '缺少用户ID'
      }
    }
    
    let query = db.collection('notifications').where({
      receiverId: userId
    })
    
    // 如果只查询未读通知
    if (unreadOnly) {
      query = query.where({
        read: false
      })
    }
    
    // 获取通知列表，按创建时间倒序排列
    const result = await query
      .orderBy('createdAt', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    // 直接返回通知列表，不获取发送者信息（用户信息存储在本地）
    const notifications = result.data
    
    // 获取未读通知数量
    const unreadCountResult = await db.collection('notifications')
      .where({
        receiverId: userId,
        read: false
      })
      .count()
    
    return {
      success: true,
      notifications,
      total: result.data.length,
      unreadCount: unreadCountResult.total,
      message: '获取通知列表成功'
    }
  } catch (error) {
    console.error('获取通知列表失败:', error)
    return {
      success: false,
      message: '获取通知列表失败',
      error: error.message
    }
  }
}