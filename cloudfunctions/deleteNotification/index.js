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
    const { notificationId, deleteAll = false } = event
    
    let result
    
    if (deleteAll) {
      // 删除用户所有通知
      result = await db.collection('notifications')
        .where({
          receiverId: OPENID
        })
        .remove()
    } else if (notificationId) {
      // 删除单个通知
      const notification = await db.collection('notifications').doc(notificationId).get()
      
      if (!notification.data) {
        return {
          success: false,
          code: 40404,
          message: '通知不存在',
          data: null
        }
      }
      
      // 确保只能删除自己的通知
      if (notification.data.receiverId !== OPENID) {
        return {
          success: false,
          code: 40301,
          message: '无权操作此通知',
          data: null
        }
      }
      
      result = await db.collection('notifications').doc(notificationId).remove()
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
      deleted: result.stats.removed,
      code: 0,
      message: '删除通知成功',
      data: {
        deleted: result.stats.removed
      }
    }
  } catch (error) {
    console.error('删除通知失败:', error)
    return {
      success: false,
      code: 50000,
      message: '删除通知失败',
      data: null
    }
  }
}