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
    const { postId, nickname, content } = event
    const userId = OPENID
    const safeContent = typeof content === 'string' ? content.trim() : ''
    const safeNickname = typeof nickname === 'string' && nickname.trim() ? nickname.trim() : '匿名用户'
    
    if (!postId || !safeContent) {
      return {
        success: false,
        code: 40001,
        message: '缺少必要参数',
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
    
    // 创建评论
    const result = await db.collection('comments').add({
      data: {
        postId: postId,
        userId: userId,
        nickname: safeNickname,
        content: safeContent,
        createdAt: db.serverDate()
      }
    })
    
    // 给被评论的用户发送通知（如果不是自己评论自己的）
    if (post.data.userId !== userId) {
      await db.collection('notifications').add({
        data: {
          receiverId: post.data.userId,
          senderId: userId,
          senderNickname: safeNickname,
          type: 'comment',
          postId: postId,
          content: `${safeNickname} 评论了你的动态: ${safeContent}`,
          read: false,
          createdAt: db.serverDate()
        }
      })
    }
    
    return {
      success: true,
      code: 0,
      message: '评论成功',
      data: {
        commentId: result._id
      }
    }
  } catch (error) {
    console.error('创建评论失败:', error)
    return {
      success: false,
      code: 50000,
      message: '评论失败',
      data: null
    }
  }
}
