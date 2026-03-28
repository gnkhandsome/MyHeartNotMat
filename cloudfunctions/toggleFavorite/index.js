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
    
    // 检查是否是本地日记（ID以"my-"开头）
    const isLocalDiary = postId.startsWith('my-')
    
    let postData = null
    
    // 只有非本地日记才检查云端是否存在
    if (!isLocalDiary) {
      try {
        const post = await db.collection('posts').doc(postId).get()
        postData = post.data
        if (!postData) {
          return {
            success: false,
            message: '动态不存在'
          }
        }
      } catch (error) {
        console.error('检查动态是否存在失败:', error)
        return {
          success: false,
          message: '动态不存在'
        }
      }
    }
    
    if (action === 'add') {
      // 添加收藏
      // 先检查是否已经收藏
      const existingFavorite = await db.collection('favorites')
        .where({
          userId: userId,
          postId: postId
        })
        .get()
      
      if (existingFavorite.data.length > 0) {
        return {
          success: false,
          message: '已经收藏过了'
        }
      }
      
      // 添加收藏记录
      await db.collection('favorites').add({
        data: {
          userId: userId,
          postId: postId,
          createdAt: db.serverDate(),
          isLocalDiary: isLocalDiary
        }
      })
      
      // 只有非本地日记且不是自己收藏自己的才发送通知
      if (!isLocalDiary && postData && postData.userId !== userId) {
        await db.collection('notifications').add({
          data: {
            receiverId: postData.userId,
            senderId: userId,
            senderNickname: nickname,
            type: 'favorite',
            postId: postId,
            content: `${nickname} 收藏了你的动态`,
            read: false,
            createdAt: db.serverDate()
          }
        })
      }
      
      return {
        success: true,
        message: '收藏成功'
      }
    } else if (action === 'remove') {
      // 移除收藏
      const result = await db.collection('favorites')
        .where({
          userId: userId,
          postId: postId
        })
        .remove()
      
      if (result.stats.removed === 0) {
        return {
          success: false,
          message: '未收藏过此动态'
        }
      }
      
      return {
        success: true,
        message: '取消收藏成功'
      }
    } else {
      return {
        success: false,
        message: '无效的操作类型'
      }
    }
  } catch (error) {
    console.error('切换收藏状态失败:', error)
    return {
      success: false,
      message: '操作失败',
      error: error.message
    }
  }
}
