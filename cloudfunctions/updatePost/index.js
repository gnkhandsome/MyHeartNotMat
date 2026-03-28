// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { post } = event
    
    if (!post || !post.postId) {
      return {
        success: false,
        message: '缺少必要参数'
      }
    }
    
    const { postId, ...updateData } = post
    
    // 更新动态内容
    const result = await db.collection('posts').doc(postId).update({
      data: {
        ...updateData,
        updatedAt: db.serverDate()
      }
    })
    
    if (result.stats.updated === 0) {
      return {
        success: false,
        message: '动态不存在或已被删除'
      }
    }
    
    return {
      success: true,
      message: '更新成功'
    }
  } catch (error) {
    console.error('更新动态失败:', error)
    return {
      success: false,
      message: '更新失败',
      error: error.message
    }
  }
}
