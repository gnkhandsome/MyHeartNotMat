// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { notification } = event
    
    if (!notification || !notification.type || !notification.receiverId || !notification.senderId) {
      return {
        success: false,
        message: '缺少必要参数'
      }
    }
    
    // 创建通知
    const result = await db.collection('notifications').add({
      data: {
        ...notification,
        createdAt: db.serverDate(),
        read: false
      }
    })
    
    return {
      success: true,
      notificationId: result._id,
      message: '通知创建成功'
    }
  } catch (error) {
    console.error('创建通知失败:', error)
    return {
      success: false,
      message: '创建通知失败',
      error: error.message
    }
  }
}