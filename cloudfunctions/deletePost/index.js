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
    const { postId } = event
    const userId = OPENID
    
    if (!postId) {
      return {
        success: false,
        code: 40001,
        message: '缺少必要参数',
        data: null
      }
    }
    
    // 先检查动态是否存在且属于当前用户
    const post = await db.collection('posts').doc(postId).get()
    
    if (!post.data) {
      return {
        success: false,
        code: 40404,
        message: '动态不存在',
        data: null
      }
    }
    
    if (post.data.userId !== userId) {
      return {
        success: false,
        code: 40301,
        message: '无权删除此动态',
        data: null
      }
    }
    
    // 删除动态
    const result = await db.collection('posts').doc(postId).remove()
    
    if (result.stats.removed === 0) {
      return {
        success: false,
        code: 50010,
        message: '删除失败',
        data: null
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
      code: 0,
      message: '删除成功',
      data: null
    }
  } catch (error) {
    console.error('删除动态失败:', error)
    return {
      success: false,
      code: 50000,
      message: '删除失败',
      data: null
    }
  }
}
