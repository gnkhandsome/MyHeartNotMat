// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { userId, postId, action, nickname } = event
    
    if (!userId || !postId || !action || !nickname) {
      return {
        success: false,
        message: '缺少必要参数'
      }
    }
    
    // 检查动态是否存在
    const post = await db.collection('posts').doc(postId).get()
    if (!post.data) {
      return {
        success: false,
        message: '动态不存在'
      }
    }
    
    if (action === 'add') {
      // 给被点赞的用户发送通知（如果不是自己点赞自己的）
      if (post.data.userId !== userId) {
        await db.collection('notifications').add({
          data: {
            receiverId: post.data.userId,
            senderId: userId,
            senderNickname: nickname,
            type: 'like',
            postId: postId,
            content: `${nickname} 点赞了你的动态`,
            read: false,
            createdAt: db.serverDate()
          }
        })
      }
      
      return {
        success: true,
        message: '点赞成功'
      }
    } else if (action === 'remove') {
      return {
        success: true,
        message: '取消点赞成功'
      }
    } else {
      return {
        success: false,
        message: '无效的操作类型'
      }
    }
  } catch (error) {
    console.error('切换点赞状态失败:', error)
    return {
      success: false,
      message: '操作失败',
      error: error.message
    }
  }
}
