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
    const { post } = event
    
    if (!post || !post.postId) {
      return {
        success: false,
        code: 40001,
        message: '缺少必要参数',
        data: null
      }
    }
    
    const { postId, userId, createdAt, ...updateData } = post

    const existed = await db.collection('posts').doc(postId).get()
    if (!existed.data) {
      return {
        success: false,
        code: 40404,
        message: '动态不存在或已被删除',
        data: null
      }
    }

    if (existed.data.userId !== OPENID) {
      return {
        success: false,
        code: 40301,
        message: '无权修改此动态',
        data: null
      }
    }
    
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
        code: 40404,
        message: '动态不存在或已被删除',
        data: null
      }
    }
    
    return {
      success: true,
      code: 0,
      message: '更新成功',
      data: null
    }
  } catch (error) {
    console.error('更新动态失败:', error)
    return {
      success: false,
      code: 50000,
      message: '更新失败',
      data: null
    }
  }
}
