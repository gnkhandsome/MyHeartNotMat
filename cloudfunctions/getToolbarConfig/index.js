// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const COLLECTION_NAME = 'app_configs'
const DEFAULT_CONFIG_KEY = 'home_toolbar_defaults'

// 云函数入口函数
exports.main = async (event, context) => {
  const key = String((event && event.key) || DEFAULT_CONFIG_KEY).trim() || DEFAULT_CONFIG_KEY

  try {
    const result = await db.collection(COLLECTION_NAME)
      .where({ key })
      .limit(1)
      .get()

    const config = result && result.data && result.data[0]
    if (!config) {
      return {
        success: false,
        code: 40404,
        message: '工具栏默认配置不存在',
        data: null
      }
    }

    return {
      success: true,
      code: 0,
      message: '获取成功',
      data: {
        config
      }
    }
  } catch (error) {
    console.error('获取工具栏默认配置失败:', error)
    return {
      success: false,
      code: 50000,
      message: '获取失败',
      data: null
    }
  }
}