# 云函数和数据集规划文档

## 一、数据集设计

### 1.1 posts（内容数据集）
**用途**：存储所有发布的内容（日记、信件、明信片等）

**字段设计**：
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | String | 是 | 内容唯一标识 |
| _openid | String | 是 | 发布者的 OpenID（微信云开发自动生成） |
| type | String | 是 | 内容类型：diary/letter/postcard/vlog |
| typeLabel | String | 是 | 类型标签：日记/信件/明信片/VLOG脚本 |
| typeIcon | String | 是 | 类型图标 |
| content | String | 是 | 内容正文 |
| title | String | 否 | 标题（可选） |
| time | String | 是 | 发布时间（格式化文本） |
| timestamp | Number | 是 | 发布时间戳（用于排序） |
| visibility | String | 是 | 可见性：public/private |
| nickname | String | 否 | 发布者昵称（公开内容可见） |
| location | String | 否 | 位置信息 |
| blindBoxQuote | String | 否 | 盲盒文案 |
| letterSalutation | String | 否 | 信件称呼（仅 letter 类型） |
| letterSignature | String | 否 | 信件落款（仅 letter 类型） |
| postcardLocation | String | 否 | 明信片地点（仅 postcard 类型） |
| diaryWeather | String | 否 | 日记天气（仅 diary 类型） |
| diaryMoodScore | Number | 否 | 日记心情评分（仅 diary 类型） |
| vlogShots | Array | 否 | VLOG 分镜列表（仅 vlog 类型） |
| scenePackage | Object | 否 | 场景包信息 |
| customBackground | String | 否 | 自定义背景图片路径 |
| likeCount | Number | 否 | 点赞数，默认 0 |
| collectCount | Number | 否 | 收藏数，默认 0 |
| commentCount | Number | 否 | 评论数，默认 0 |
| createTime | Date | 是 | 创建时间 |
| updateTime | Date | 是 | 更新时间 |

**索引设计**：
- `_openid` + `timestamp`：用于查询"我的内容"列表，按时间倒序
- `visibility` + `timestamp`：用于查询广场列表，按时间倒序
- `timestamp`：用于查询最新内容


### 1.2 collections（收藏数据集）
**用途**：存储用户的收藏记录

**字段设计**：
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | String | 是 | 记录唯一标识 |
| _openid | String | 是 | 收藏者的 OpenID |
| postId | String | 是 | 被收藏的内容 ID |
| postData | Object | 否 | 收藏时的内容快照（便于快速展示） |
| createTime | Date | 是 | 收藏时间 |

**索引设计**：
- `_openid` + `createTime`：用于查询"我的收藏"列表，按时间倒序
- `postId`：用于检查内容是否已被收藏


### 1.3 notifications（通知数据集）
**用途**：存储系统通知（如点赞通知、评论通知等）

**字段设计**：
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | String | 是 | 通知唯一标识 |
| _openid | String | 是 | 接收通知的用户 OpenID |
| type | String | 是 | 通知类型：like/comment/system |
| title | String | 是 | 通知标题 |
| content | String | 是 | 通知内容 |
| fromUserId | String | 否 | 触发通知的用户 OpenID |
| fromNickname | String | 否 | 触发通知的用户昵称 |
| postId | String | 否 | 相关的内容 ID |
| commentId | String | 否 | 相关的评论 ID（仅评论通知） |
| isRead | Boolean | 否 | 是否已读，默认 false |
| createTime | Date | 是 | 创建时间 |

**索引设计**：
- `_openid` + `createTime`：用于查询通知列表，按时间倒序
- `_openid` + `isRead`：用于查询未读通知


### 1.4 comments（评论数据集）
**用途**：存储评论数据，支持二级回复

**字段设计**：
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | String | 是 | 评论唯一标识 |
| _openid | String | 是 | 评论者的 OpenID |
| postId | String | 是 | 被评论的内容 ID |
| parentId | String | 否 | 父评论 ID（二级评论时必填） |
| replyToId | String | 否 | 回复的评论 ID（二级评论时可选） |
| replyToNickname | String | 否 | 回复的用户昵称 |
| nickname | String | 是 | 评论者昵称 |
| content | String | 是 | 评论内容 |
| likeCount | Number | 否 | 点赞数，默认 0 |
| createTime | Date | 是 | 创建时间 |

**索引设计**：
- `postId` + `createTime`：用于查询内容的一级评论列表
- `parentId` + `createTime`：用于查询二级评论列表


## 二、云函数设计

### 2.1 publishPost（发布内容云函数）
**功能**：发布新内容

**参数**：
```javascript
{
  type: 'diary|letter|postcard|vlog',
  content: '内容正文',
  title: '标题（可选）',
  visibility: 'public|private',
  nickname: '发布者昵称（公开时必填）',
  location: '位置（可选）',
  blindBoxQuote: '盲盒文案（可选）',
  letterSalutation: '称呼（仅 letter）',
  letterSignature: '落款（仅 letter）',
  postcardLocation: '地点（仅 postcard）',
  diaryWeather: '天气（仅 diary）',
  diaryMoodScore: 8, // 心情评分（仅 diary）
  vlogShots: ['分镜1', '分镜2'], // 仅 vlog
  scenePackage: { sceneKey: 'rainy', sceneIntensity: 65 },
  customBackground: '图片路径（可选）'
}
```

**返回值**：
```javascript
{
  code: 0,
  message: '发布成功',
  data: { postId: 'xxx' }
}
```


### 2.2 toggleLike（点赞云函数）
**功能**：点赞/取消点赞

**参数**：
```javascript
{
  postId: '内容ID',
  action: 'like|unlike'
}
```

**返回值**：
```javascript
{
  code: 0,
  message: '操作成功',
  data: { 
    isLiked: true,
    likeCount: 123
  }
}
```

**额外操作**：
- 点赞成功时，向被点赞的内容发布者发送一条点赞通知


### 2.3 toggleCollect（收藏云函数）
**功能**：收藏/取消收藏

**参数**：
```javascript
{
  postId: '内容ID',
  action: 'collect|uncollect'
}
```

**返回值**：
```javascript
{
  code: 0,
  message: '操作成功',
  data: { 
    isCollected: true,
    collectCount: 45
  }
}
```


### 2.4 addComment（添加评论云函数）
**功能**：添加评论或回复

**参数**：
```javascript
{
  postId: '内容ID',
  parentId: '父评论ID（二级评论时必填）',
  replyToId: '回复的评论ID（可选）',
  replyToNickname: '回复的用户昵称（可选）',
  nickname: '评论者昵称',
  content: '评论内容'
}
```

**返回值**：
```javascript
{
  code: 0,
  message: '评论成功',
  data: { commentId: 'xxx' }
}
```

**额外操作**：
- 评论成功时，向内容发布者发送一条评论通知
- 如果是回复评论，向被回复的用户发送一条回复通知


### 2.5 getPostList（获取内容列表云函数）
**功能**：获取广场内容列表或我的内容列表

**参数**：
```javascript
{
  type: 'square|my', // 广场列表或我的内容
  visibility: 'all|public|private', // 仅 my 类型有效
  lastTimestamp: 1234567890, // 分页游标（可选）
  limit: 20 // 每页数量，默认 20
}
```

**返回值**：
```javascript
{
  code: 0,
  message: '获取成功',
  data: {
    list: [ ... ],
    hasMore: false,
    newPostCount: 3 // 新内容数量（仅 square 类型）
  }
}
```


### 2.6 getCollectList（获取收藏列表云函数）
**功能**：获取我的收藏列表

**参数**：
```javascript
{
  lastTimestamp: 1234567890, // 分页游标（可选）
  limit: 20 // 每页数量，默认 20
}
```

**返回值**：
```javascript
{
  code: 0,
  message: '获取成功',
  data: {
    list: [ ... ],
    hasMore: false
  }
}
```


### 2.7 getCommentList（获取评论列表云函数）
**功能**：获取内容的评论列表

**参数**：
```javascript
{
  postId: '内容ID',
  lastTimestamp: 1234567890, // 分页游标（可选）
  limit: 20 // 每页数量，默认 20
}
```

**返回值**：
```javascript
{
  code: 0,
  message: '获取成功',
  data: {
    list: [
      {
        _id: '评论ID',
        nickname: '评论者',
        content: '评论内容',
        likeCount: 5,
        createTime: Date,
        replies: [ ... ] // 二级评论列表
      }
    ],
    hasMore: false
  }
}
```


### 2.8 getNotificationList（获取通知列表云函数）
**功能**：获取我的通知列表

**参数**：
```javascript
{
  lastTimestamp: 1234567890, // 分页游标（可选）
  limit: 20, // 每页数量，默认 20
  unreadOnly: false // 是否只获取未读通知
}
```

**返回值**：
```javascript
{
  code: 0,
  message: '获取成功',
  data: {
    list: [ ... ],
    hasMore: false,
    unreadCount: 5 // 未读通知数
  }
}
```


### 2.9 markNotificationRead（标记通知已读云函数）
**功能**：标记一条或所有通知为已读

**参数**：
```javascript
{
  notificationId: '通知ID（可选，不传则标记所有）'
}
```

**返回值**：
```javascript
{
  code: 0,
  message: '标记成功'
}
```


## 三、数据流程

### 3.1 发布内容流程
1. 用户在首页编写内容
2. 点击发布，调用 `publishPost` 云函数
3. 云函数验证参数，插入 `posts` 数据集
4. 返回成功，更新本地列表


### 3.2 点赞流程
1. 用户点击点赞按钮
2. 调用 `toggleLike` 云函数
3. 云函数更新 `posts` 表的 `likeCount`
4. 如果是点赞，插入通知到 `notifications` 表
5. 返回结果，更新本地状态


### 3.3 收藏流程
1. 用户点击收藏按钮
2. 调用 `toggleCollect` 云函数
3. 如果是收藏，插入记录到 `collections` 表
4. 如果是取消收藏，从 `collections` 表删除记录
5. 更新 `posts` 表的 `collectCount`
6. 返回结果，更新本地状态


### 3.4 评论流程
1. 用户在详情页输入评论
2. 调用 `addComment` 云函数
3. 插入评论到 `comments` 表
4. 更新 `posts` 表的 `commentCount`
5. 插入通知到 `notifications` 表
6. 返回成功，刷新评论列表


## 四、安全规则示例

### posts 数据集安全规则
```javascript
{
  "read": "doc.visibility == 'public' || doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

### collections 数据集安全规则
```javascript
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

### notifications 数据集安全规则
```javascript
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

### comments 数据集安全规则
```javascript
{
  "read": true,
  "write": "doc._openid == auth.openid"
}
```
