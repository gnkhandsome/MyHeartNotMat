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
    const { page = 1, limit = 10 } = event
    const safePage = Math.max(1, Number(page) || 1)
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10))
    
    // 查询用户的收藏记录
    const favorites = await db.collection('favorites')
      .where({
        userId: OPENID
      })
      .orderBy('createdAt', 'desc')
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .get()
    
    if (favorites.data.length === 0) {
      return {
        success: true,
        code: 0,
        message: '获取成功',
        data: {
          posts: [],
          total: 0
        }
      }
    }
    
    // 分离本地日记和云端动态
    const localDiaryFavorites = favorites.data.filter(item => item.isLocalDiary)
    const cloudPostFavorites = favorites.data.filter(item => !item.isLocalDiary)
    
    const result = []
    
    // 处理云端动态
    if (cloudPostFavorites.length > 0) {
      const postIds = cloudPostFavorites.map(item => item.postId)
      
      // 查询对应的动态内容
      const posts = await db.collection('posts')
        .where({
          _id: db.command.in(postIds)
        })
        .get()
      
      // 创建ID到动态的映射
      const postMap = {}
      posts.data.forEach(post => {
        postMap[post._id] = post
      })
      
      // 添加云端动态到结果
      cloudPostFavorites.forEach(favorite => {
        if (postMap[favorite.postId]) {
          result.push(postMap[favorite.postId])
        }
      })
    }
    
    // 处理本地日记（只返回基本信息，详细内容需要从本地获取）
    localDiaryFavorites.forEach(favorite => {
      result.push({
        _id: favorite.postId,
        id: favorite.postId,
        isLocalDiary: true,
        createdAt: favorite.createdAt,
        type: 'diary',
        typeLabel: '日记',
        content: '本地日记内容',
        time: '本地存储'
      })
    })
    
    // 按照收藏时间排序
    result.sort((a, b) => {
      const aTime = a.createdAt || new Date()
      const bTime = b.createdAt || new Date()
      return bTime - aTime
    })
    
    return {
      success: true,
      code: 0,
      message: '获取成功',
      data: {
        posts: result,
        total: result.length
      }
    }
  } catch (error) {
    console.error('获取收藏列表失败:', error)
    return {
      success: false,
      code: 50000,
      message: '获取失败',
      data: null
    }
  }
}
