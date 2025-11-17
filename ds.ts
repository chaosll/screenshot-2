// 定义按钮配置
const buttonConfigs = [
  {
    id: 'fontWeight',
    key: 'fontWeight',
    label: '加粗',
    styleKey: 'fontWeight',
    activeValue: '700',           // 激活时的样式值
    inactiveValue: '400',         // 非激活时的样式值（正常字重）
    toggleValue: 'initial'        // 点击切换时的值
  },
  {
    id: 'fontStyle',
    key: 'fontStyle', 
    label: '斜体',
    styleKey: 'fontStyle',
    activeValue: 'italic',        // 激活时的样式值
    inactiveValue: 'normal',      // 非激活时的样式值（正常字体）
    toggleValue: 'initial'
  },
  {
    id: 'underline',
    key: 'textDecoration',
    label: '下划线',
    styleKey: 'textDecorationLine',
    activeValue: 'underline',     // 激活时的样式值
    inactiveValue: 'none',        // 非激活时的样式值（无装饰）
    toggleValue: 'none'
  },
  {
    id: 'lineThrough',
    key: 'textDecoration',
    label: '删除线', 
    styleKey: 'textDecorationLine',
    activeValue: 'line-through',  // 激活时的样式值
    inactiveValue: 'none',        // 非激活时的样式值（无装饰）
    toggleValue: 'none'
  },
  {
    id: 'writingMode',
    key: 'writingMode',
    label: '文字竖排',
    styleKey: 'writingMode',
    activeValue: 'vertical-lr',   // 激活时的样式值
    inactiveValue: 'horizontal-tb', // 非激活时的样式值（水平排列）
    toggleValue: 'initial',
    useLayerValue: true
  }
]

// 根据配置生成 btnMap（初始化时使用 inactiveValue）
const btnMap = reactive<Record<string, BtnItem>>({})
buttonConfigs.forEach(config => {
  btnMap[config.id] = {
    key: config.key,
    nextValue: config.inactiveValue, // 初始化为非激活状态的值
    label: config.label,
    active: false
  }
})

// 统一的样式状态更新函数
const updateButtonState = (config, isActive) => {
  btnMap[config.id].active = isActive
  btnMap[config.id].nextValue = isActive ? config.toggleValue : config.inactiveValue
}

// 统一的样式监听
watch(() => elementStore.innerSpanStyles, (newVal) => {
  console.log('样式==========', newVal)
  
  buttonConfigs.forEach(config => {
    if (config.useLayerValue) return
    
    const styleValue = newVal[config.styleKey]
    const isActive = styleValue?.isSame && styleValue.styles[0] === config.activeValue
    
    updateButtonState(config, isActive)
  })
}, { deep: true })

// writingMode 的特殊监听
watch(() => elementStore.selectedActiveLayer?.writingMode, (newVal) => {
  const writingModeConfig = buttonConfigs.find(config => config.id === 'writingMode')
  if (!writingModeConfig) return
  
  const isActive = newVal === writingModeConfig.activeValue
  updateButtonState(writingModeConfig, isActive)
  
  console.log('widget', elementStore.selectedActiveLayer)
})
