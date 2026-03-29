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
    const { notificationId, markAll = false } = event
    
    let result
    
    if (markAll) {
      // 标记所有未读通知为已读
      result = await db.collection('notifications')
        .where({
          receiverId: OPENID,
          read: false
        })
        .update({
          data: {
            read: true,
            readAt: db.serverDate()
          }
        })
    } else if (notificationId) {
      // 标记单个通知为已读
      const notification = await db.collection('notifications').doc(notificationId).get()
      
      if (!notification.data) {
        return {
          success: false,
          code: 40404,
          message: '通知不存在',
          data: null
        }
      }
      
      // 确保只能标记自己的通知
      if (notification.data.receiverId !== OPENID) {
        return {
          success: false,
          code: 40301,
          message: '无权操作此通知',
          data: null
        }
      }
      
      result = await db.collection('notifications').doc(notificationId).update({
        data: {
          read: true,
          readAt: db.serverDate()
        }
      })
    } else {
      return {
        success: false,
        code: 40001,
        message: '缺少必要参数',
        data: null
      }
    }
    
    return {
      success: true,
      updated: result.stats.updated,
      code: 0,
      message: '标记已读成功',
      data: {
        updated: result.stats.updated
      }
    }
  } catch (error) {
    console.error('标记通知已读失败:', error)
    return {
      success: false,
      code: 50000,
      message: '标记已读失败',
      data: null
    }
  }
}