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
    
    if (!post) {
      return {
        success: false,
        code: 40001,
        message: '缺少必要参数',
        data: null
      }
    }

    const safePost = {
      ...post,
      userId: OPENID
    }
    
    // 创建新的公开动态
    const result = await db.collection('posts').add({
      data: {
        ...safePost,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate(),
        likeCount: 0
      }
    })
    
    return {
      success: true,
      code: 0,
      postId: result._id,
      message: '创建成功',
      data: {
        postId: result._id
      }
    }
  } catch (error) {
    console.error('创建动态失败:', error)
    return {
      success: false,
      code: 50000,
      message: '创建失败',
      data: null
    }
  }
}
