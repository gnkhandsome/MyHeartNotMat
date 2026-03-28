// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { postId, userId, nickname, content } = event
    
    if (!postId || !userId || !nickname || !content) {
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
    
    // 创建评论
    const result = await db.collection('comments').add({
      data: {
        postId: postId,
        userId: userId,
        nickname: nickname,
        content: content,
        createdAt: db.serverDate()
      }
    })
    
    // 给被评论的用户发送通知（如果不是自己评论自己的）
    if (post.data.userId !== userId) {
      await db.collection('notifications').add({
        data: {
          receiverId: post.data.userId,
          senderId: userId,
          senderNickname: nickname,
          type: 'comment',
          postId: postId,
          content: `${nickname} 评论了你的动态: ${content}`,
          read: false,
          createdAt: db.serverDate()
        }
      })
    }
    
    return {
      success: true,
      commentId: result._id,
      message: '评论成功'
    }
  } catch (error) {
    console.error('创建评论失败:', error)
    return {
      success: false,
      message: '评论失败',
      error: error.message
    }
  }
}
