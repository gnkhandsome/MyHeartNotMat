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
    const { postId, action, nickname } = event
    const userId = OPENID
    const safeAction = typeof action === 'string' ? action.trim() : ''
    const safeNickname = typeof nickname === 'string' && nickname.trim() ? nickname.trim() : '匿名用户'
    
    if (!postId || !safeAction) {
      return {
        success: false,
        code: 40001,
        message: '缺少必要参数',
        data: null
      }
    }

    if (safeAction !== 'add' && safeAction !== 'remove') {
      return {
        success: false,
        code: 40002,
        message: '无效的操作类型',
        data: null
      }
    }
    
    // 检查动态是否存在
    const post = await db.collection('posts').doc(postId).get()
    if (!post.data) {
      return {
        success: false,
        code: 40404,
        message: '动态不存在',
        data: null
      }
    }
    
    if (safeAction === 'add') {
      // 给被点赞的用户发送通知（如果不是自己点赞自己的）
      if (post.data.userId !== userId) {
        await db.collection('notifications').add({
          data: {
            receiverId: post.data.userId,
            senderId: userId,
            senderNickname: safeNickname,
            type: 'like',
            postId: postId,
            content: `${safeNickname} 点赞了你的动态`,
            read: false,
            createdAt: db.serverDate()
          }
        })
      }
      
      return {
        success: true,
        code: 0,
        message: '点赞成功',
        data: null
      }
    } else if (safeAction === 'remove') {
      return {
        success: true,
        code: 0,
        message: '取消点赞成功',
        data: null
      }
    }
  } catch (error) {
    console.error('切换点赞状态失败:', error)
    return {
      success: false,
      code: 50000,
      message: '操作失败',
      data: null
    }
  }
}
