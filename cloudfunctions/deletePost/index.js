// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { postId, userId } = event
    
    if (!postId || !userId) {
      return {
        success: false,
        message: '缺少必要参数'
      }
    }
    
    // 先检查动态是否存在且属于当前用户
    const post = await db.collection('posts').doc(postId).get()
    
    if (!post.data) {
      return {
        success: false,
        message: '动态不存在'
      }
    }
    
    if (post.data.userId !== userId) {
      return {
        success: false,
        message: '无权删除此动态'
      }
    }
    
    // 删除动态
    const result = await db.collection('posts').doc(postId).remove()
    
    if (result.stats.removed === 0) {
      return {
        success: false,
        message: '删除失败'
      }
    }
    
    // 同时删除相关的收藏记录
    await db.collection('favorites').where({
      postId: postId
    }).remove()
    
    // 同时删除相关的评论
    await db.collection('comments').where({
      postId: postId
    }).remove()
    
    return {
      success: true,
      message: '删除成功'
    }
  } catch (error) {
    console.error('删除动态失败:', error)
    return {
      success: false,
      message: '删除失败',
      error: error.message
    }
  }
}
