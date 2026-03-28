// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { notificationId, userId, deleteAll = false } = event
    
    if (!userId) {
      return {
        success: false,
        message: '缺少用户ID'
      }
    }
    
    let result
    
    if (deleteAll) {
      // 删除用户所有通知
      result = await db.collection('notifications')
        .where({
          receiverId: userId
        })
        .remove()
    } else if (notificationId) {
      // 删除单个通知
      const notification = await db.collection('notifications').doc(notificationId).get()
      
      if (!notification.data) {
        return {
          success: false,
          message: '通知不存在'
        }
      }
      
      // 确保只能删除自己的通知
      if (notification.data.receiverId !== userId) {
        return {
          success: false,
          message: '无权操作此通知'
        }
      }
      
      result = await db.collection('notifications').doc(notificationId).remove()
    } else {
      return {
        success: false,
        message: '缺少必要参数'
      }
    }
    
    return {
      success: true,
      deleted: result.stats.removed,
      message: '删除通知成功'
    }
  } catch (error) {
    console.error('删除通知失败:', error)
    return {
      success: false,
      message: '删除通知失败',
      error: error.message
    }
  }
}