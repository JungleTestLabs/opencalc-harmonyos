// OpenCalc — 主计算器页面
// 移植自：MainActivity.kt（1447行）
// ArkUI 声明式 @Entry 页面，包含显示屏、按钮网格、科学模式、
// 历史记录、设置面板、主题切换和关于页面

import { promptAction } from '@kit.ArkUI'
import { pasteboard } from '@kit.BasicServicesKit'
import { common } from '@kit.AbilityKit'
import { Expression } from '../calculator/Expression'
import { CalcEngine } from '../calculator/Calculator'
import { NumberFormatter } from '../calculator/NumberFormatter'
import { NumberingSystem, HistoryItem } from '../model/Models'
import { ErrorFlags } from '../model/ErrorFlags'
import { PreferencesStore } from '../preferences/PreferencesStore'

@Entry
@Component
export struct CalculatorPage {
  // ==================== 显示状态 ====================
  @State expression: string = ''      // 当前输入表达式
  @State result: string = ''          // 计算结果
  @State errorMsg: string = ''        // 错误信息
  @State scientific: boolean = false  // 科学模式开关
  @State history: HistoryItem[] = []  // 历史记录列表
  @State showHistory: boolean = false // 历史面板可见性
  @State showSettings: boolean = false // 设置面板可见性
  @State showAbout: boolean = false   // 关于面板可见性

  // ==================== 偏好设置状态 ====================
  @State vibrateOn: boolean = true     // 振动反馈
  @State preventSleep: boolean = false // 防休眠
  @State radianMode: boolean = false   // 弧度模式（否则为角度）
  @State themeIdx: number = 0          // 主题索引

  // ==================== 内部状态 ====================
  private nextId: number = 0                          // 历史记录自增 ID
  private engine: CalcEngine = new CalcEngine()       // 计算引擎实例
  private expr: Expression = new Expression()         // 表达式预处理器实例
  private prefs: PreferencesStore | null = null        // 偏好存储实例

  /**
   * 页面初始化生命周期
   * 创建 PreferencesStore 并异步加载偏好和历史
   */
  aboutToAppear(): void {
    const ctx: common.UIAbilityContext = getContext(this) as common.UIAbilityContext
    this.prefs = new PreferencesStore(ctx)
    this.prefs.init().then((): void => {
      this.loadPrefs()
      this.loadHistory()
    })
  }

  /** 从持久化存储加载偏好设置 */
  async loadPrefs(): Promise<void> {
    if (!this.prefs) return
    this.vibrateOn = await this.prefs.getVibrationEnabled()
    this.preventSleep = await this.prefs.getPreventSleep()
    this.radianMode = await this.prefs.getRadiansDefault()
    this.themeIdx = await this.prefs.getTheme()
    this.scientific = (await this.prefs.getScientificModeDefault()) === 1
  }

  /** 从持久化存储加载历史记录 */
  async loadHistory(): Promise<void> {
    if (!this.prefs) return
    this.history = await this.prefs.getHistory()
    if (this.history.length > 0) this.nextId = this.history[0].id + 1
  }

  /**
   * 保存单个偏好设置项
   * @param key 偏好键名
   * @param value 偏好值
   */
  async savePref(key: string, value: boolean | number): Promise<void> {
    if (!this.prefs) return
    if (key === 'vibrateOn') await this.prefs.setVibrationEnabled(value as boolean)
    else if (key === 'preventSleep') await this.prefs.setPreventSleep(value as boolean)
    else if (key === 'radianMode') await this.prefs.setRadiansDefault(value as boolean)
    else if (key === 'themeIdx') await this.prefs.setTheme(value as number)
    else if (key === 'scientific') await this.prefs.setScientificModeDefault(value as number)
  }

  // ==================== 按钮事件处理 ====================

  /** 数字按钮点击：追加数字到表达式 */
  onDigit(d: string): void { this.expression = this.expression + d; this.errorMsg = '' }

  /** 运算符按钮点击：追加运算符到表达式 */
  onOp(op: string): void { this.expression = this.expression + op; this.errorMsg = '' }

  /** 函数按钮点击：追加函数名和左括号 */
  onFunc(f: string): void { this.expression = this.expression + f + '('; this.errorMsg = '' }

  /** 常量按钮点击：追加常量到表达式 */
  onConst(c: string): void { this.expression = this.expression + c; this.errorMsg = '' }

  /** 退格按钮：删除表达式最后一个字符 */
  onBS(): void { if (this.expression.length > 0) this.expression = this.expression.substring(0, this.expression.length - 1) }

  /** AC 按钮：清空表达式、结果和错误信息 */
  onAC(): void { this.expression = ''; this.result = ''; this.errorMsg = ''; ErrorFlags.reset() }

  /**
   * 等号按钮：执行计算
   * 流程：预处理表达式 → 递归下降解析 → 格式化结果 → 添加到历史
   */
  onEquals(): void {
    if (this.expression.length === 0) return
    ErrorFlags.reset()
    try {
      const clean: string = this.expr.getCleanExpression(this.expression, '.', ',')
      const raw: number = this.engine.evaluate(clean, !this.radianMode)

      // 按优先级检查各类错误
      if (ErrorFlags.division_by_0) { this.errorMsg = '除数不能为零'; this.result = '' }
      else if (ErrorFlags.domain_error) { this.errorMsg = '定义域错误'; this.result = '' }
      else if (ErrorFlags.syntax_error) { this.errorMsg = '表达式错误'; this.result = '' }
      else if (ErrorFlags.is_infinity) { this.errorMsg = '结果无穷大'; this.result = '' }
      else if (ErrorFlags.require_real_number) { this.errorMsg = '需要实数'; this.result = '' }
      else {
        // 格式化结果并添加到历史
        const fmt: string = NumberFormatter.format(raw.toString(), '.', ',', NumberingSystem.INTERNATIONAL)
        this.result = fmt; this.errorMsg = ''
        const item: HistoryItem = { id: this.nextId, expression: this.expression, result: fmt, timestamp: Date.now() }
        this.nextId = this.nextId + 1
        const nh: HistoryItem[] = [item]
        for (let i: number = 0; i < this.history.length; i++) nh.push(this.history[i])
        this.history = nh
        if (this.prefs) this.prefs.setHistory(this.history)
      }
    } catch (_e) { this.errorMsg = '计算错误' }
  }

  /** 长按结果区：复制结果到剪贴板 */
  onCopy(): void {
    if (this.result.length === 0) return
    pasteboard.getSystemPasteboard().setData(pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, this.result))
    promptAction.showToast({ message: '已复制' })
  }

  /** 点击历史条目：回填表达式到输入框 */
  onHistoryTap(item: HistoryItem): void { this.expression = item.expression; this.showHistory = false }

  /** 删除历史条目 */
  onHistoryDelete(item: HistoryItem): void {
    const keep: HistoryItem[] = []
    for (let i: number = 0; i < this.history.length; i++) { if (this.history[i].id !== item.id) keep.push(this.history[i]) }
    this.history = keep
    if (this.prefs) this.prefs.setHistory(this.history)
  }

  // ==================== 主题颜色 ====================

  /** 获取当前主题的背景色 */
  getBg(): string {
    if (this.themeIdx === 1) return '#000000'  // AMOLED 纯黑
    if (this.themeIdx === 2) return '#0d1117'  // Material You 暗色
    return '#1a1a2e'                            // 默认深蓝
  }

  /** 获取按钮背景色 */
  getBtnBg(): string { return this.themeIdx === 1 ? '#1a1a1a' : '#2d2d44' }

  /** 获取功能按钮背景色 */
  getFuncBg(): string { return this.themeIdx === 1 ? '#222' : '#3a3a5c' }

  /** 获取面板背景色 */
  getPanelBg(): string { return this.themeIdx === 1 ? '#111' : '#16213e' }

  // ==================== 主布局 ====================

  build() {
    Stack() {
      Column() {
        this.DisplayPanel()   // 显示屏（表达式 + 结果）
        this.ToggleRow()      // 模式切换栏（科学/基础 + 历史 + 设置按钮）
        this.ButtonGrid()     // 按钮网格
        if (this.showHistory) this.HistoryPanel()  // 历史面板（条件渲染）
      }
      .width('100%').height('100%').backgroundColor(this.getBg())
      if (this.showSettings) this.SettingsPanel()   // 设置面板（覆盖层）
      if (this.showAbout) this.AboutPanel()         // 关于面板（覆盖层）
    }
  }

  // ==================== 显示屏面板 ====================

  @Builder DisplayPanel() {
    Column() {
      // 表达式显示行（小字，灰色）
      Text(this.expression.length > 0 ? this.expression : ' ')
        .fontSize(18).fontColor('#888').width('100%').textAlign(TextAlign.End)
        .padding({ right: 16, left: 16 }).maxLines(3)

      // 结果或错误显示行
      if (this.errorMsg.length > 0) {
        // 错误信息（红色大字）
        Text(this.errorMsg).fontSize(28).fontColor('#FF6B6B')
          .width('100%').textAlign(TextAlign.End).padding({ right: 16, left: 16 })
      } else {
        // 计算结果（白色大字）
        Text(this.result.length > 0 ? this.result : '0')
          .fontSize(36).fontWeight(FontWeight.Bold).fontColor('#FFFFFF')
          .width('100%').textAlign(TextAlign.End).padding({ right: 16, left: 16 })
      }
    }
    .width('100%').padding({ top: 24, bottom: 8 })
    .gesture(LongPressGesture().onAction((): void => { this.onCopy() }))  // 长按复制结果
  }

  // ==================== 模式切换栏 ====================

  @Builder ToggleRow() {
    Row() {
      // 科学/基础模式切换
      Text(this.scientific ? '科学' : '基础')
        .fontSize(12).fontColor('#26b89c')
        .padding({ left: 12, right: 12, top: 4, bottom: 4 })
        .border({ width: 1, color: '#26b89c', radius: 8 })
        .onClick((): void => { this.scientific = !this.scientific })
      Blank()
      // 历史面板开关
      Text(this.showHistory ? '▲ 历史' : '▼ 历史')
        .fontSize(12).fontColor('#888').padding(8)
        .onClick((): void => { this.showHistory = !this.showHistory })
      // 设置按钮
      Text('⚙').fontSize(16).fontColor('#888').padding(8)
        .onClick((): void => { this.showSettings = true })
    }
    .width('100%').padding({ left: 16, right: 16, bottom: 4 })
  }

  // ==================== 按钮网格 ====================

  @Builder ButtonGrid() {
    Column() {
      // 科学模式额外按钮行
      if (this.scientific) {
        Row() { this.BtnFunc('sin'); this.BtnFunc('cos'); this.BtnFunc('tan'); this.BtnFunc('ln'); this.BtnFunc('log') }
        Row() { this.BtnFunc('arcsi'); this.BtnFunc('arcco'); this.BtnFunc('arcta'); this.BtnConst('π'); this.BtnConst('e') }
      }
      // 标准按钮行
      Row() { this.BtnAct('AC'); this.BtnOp('('); this.BtnOp(')'); this.BtnOp('÷') }
      Row() { this.BtnDig('7'); this.BtnDig('8'); this.BtnDig('9'); this.BtnOp('×') }
      Row() { this.BtnDig('4'); this.BtnDig('5'); this.BtnDig('6'); this.BtnOp('-') }
      Row() { this.BtnDig('1'); this.BtnDig('2'); this.BtnDig('3'); this.BtnOp('+') }
      Row() { this.BtnDig('0'); this.BtnOp('.'); this.BtnAct('⌫'); this.BtnEq() }
    }
    .width('100%').padding({ left: 8, right: 8 }).layoutWeight(1)  // 填充剩余空间
  }

  // ==================== 按钮构建器 ====================

  /** 数字按钮（白色文字，深色背景） */
  @Builder BtnDig(l: string) { Text(l).fontSize(22).fontColor('#FFFFFF').width('22%').height(56).textAlign(TextAlign.Center).backgroundColor(this.getBtnBg()).borderRadius(12).margin(4).onClick((): void => { this.onDigit(l) }) }

  /** 运算符按钮（白色文字，青绿色背景） */
  @Builder BtnOp(l: string) { Text(l).fontSize(20).fontColor('#FFFFFF').width('22%').height(56).textAlign(TextAlign.Center).backgroundColor('#26b89c').borderRadius(12).margin(4).onClick((): void => { this.onOp(l) }) }

  /** 科学函数按钮（小字，紫色背景） */
  @Builder BtnFunc(l: string) { Text(l).fontSize(14).fontColor('#FFFFFF').width('18%').height(46).textAlign(TextAlign.Center).backgroundColor(this.getFuncBg()).borderRadius(10).margin(3).onClick((): void => { this.onFunc(l) }) }

  /** 常量按钮（青绿色文字，深色背景） */
  @Builder BtnConst(l: string) { Text(l).fontSize(18).fontColor('#26b89c').width('18%').height(46).textAlign(TextAlign.Center).backgroundColor(this.getBtnBg()).borderRadius(10).margin(3).onClick((): void => { this.onConst(l) }) }

  /** 动作按钮（AC 红色，退格灰色） */
  @Builder BtnAct(l: string) { Text(l).fontSize(20).fontColor(l === 'AC' ? '#FF6B6B' : '#888').width('22%').height(56).textAlign(TextAlign.Center).backgroundColor(this.getBtnBg()).borderRadius(12).margin(4).onClick((): void => { if (l === 'AC') this.onAC(); else this.onBS() }) }

  /** 等号按钮（深色文字，青绿色背景，加粗） */
  @Builder BtnEq() { Text('=').fontSize(24).fontWeight(FontWeight.Bold).fontColor('#1a1a2e').width('22%').height(56).textAlign(TextAlign.Center).backgroundColor('#26b89c').borderRadius(12).margin(4).onClick((): void => { this.onEquals() }) }

  // ==================== 历史记录面板 ====================
  // 底部弹出面板，显示计算历史，支持点击回填和左滑删除

  @Builder HistoryPanel() {
    Column() {
      if (this.history.length === 0) {
        // 空状态引导
        Text('暂无计算记录').fontSize(14).fontColor('#666').width('100%').textAlign(TextAlign.Center).padding(40)
      } else {
        List() {
          ForEach(this.history, (item: HistoryItem) => {
            ListItem() {
              Row() {
                Column() {
                  Text(item.expression).fontSize(13).fontColor('#ccc').maxLines(1)
                  Text(item.result).fontSize(16).fontWeight(FontWeight.Bold).fontColor('#26b89c')
                }
                .alignItems(HorizontalAlign.Start).layoutWeight(1)
              }
              .width('100%').padding(12).onClick((): void => { this.onHistoryTap(item) })  // 点击回填
            }
            .swipeAction({ end: { builder: (): void => { this.DelBtn(item) } } })  // 左滑出现删除按钮
          })
        }
        .height(200)
      }
    }
    .width('100%').backgroundColor(this.getPanelBg()).borderRadius({ topLeft: 16, topRight: 16 }).padding({ top: 12 })
  }

  /** 历史条目删除按钮（红色） */
  @Builder DelBtn(item: HistoryItem) {
    Text('删除').fontSize(14).fontColor('#FFFFFF').padding(16).backgroundColor('#FF6B6B').height('100%')
      .onClick((): void => { this.onHistoryDelete(item) })
  }

  // ==================== 设置面板 ====================
  // 居中覆盖层，包含振动、防休眠、弧度模式、主题切换和关于入口

  @Builder SettingsPanel() {
    Column() {
      // 标题栏
      Row() {
        Text('设置').fontSize(18).fontWeight(FontWeight.Bold).fontColor('#FFFFFF')
        Blank()
        Text('✕').fontSize(20).fontColor('#888').onClick((): void => { this.showSettings = false })
      }
      .width('100%').padding(16)

      List() {
        // 振动反馈开关
        ListItem() { this.ToggleItem('振动反馈', this.vibrateOn, (v: boolean): void => { this.vibrateOn = v; this.savePref('vibrateOn', v) }) }
        // 防休眠开关
        ListItem() { this.ToggleItem('防休眠', this.preventSleep, (v: boolean): void => { this.preventSleep = v; this.savePref('preventSleep', v) }) }
        // 弧度模式开关
        ListItem() { this.ToggleItem('弧度模式', this.radianMode, (v: boolean): void => { this.radianMode = v; this.savePref('radianMode', v) }) }
        // 主题选择
        ListItem() { this.ThemeItem() }
        // 关于入口
        ListItem() {
          Row() { Text('关于 OpenCalc').fontSize(15).fontColor('#ccc'); Blank(); Text('>').fontColor('#888') }
          .width('100%').padding(12)
          .onClick((): void => { this.showSettings = false; this.showAbout = true })
        }
      }
    }
    .width('85%').backgroundColor(this.getPanelBg()).borderRadius(16)
  }

  /** 开关设置项（标题 + Toggle 开关） */
  @Builder ToggleItem(title: string, val: boolean, cb: (v: boolean) => void) {
    Row() {
      Text(title).fontSize(15).fontColor('#FFFFFF').layoutWeight(1)
      Toggle({ type: ToggleType.Switch, isOn: val }).onChange((on: boolean): void => { cb(on) })
    }
    .width('100%').padding(12)
  }

  /** 主题选择项（三个按钮：默认 / AMOLED / Material） */
  @Builder ThemeItem() {
    Row() {
      Text('主题').fontSize(15).fontColor('#FFFFFF').layoutWeight(1)
      Row() {
        Text('默认')
          .fontSize(11).fontColor(this.themeIdx === 0 ? '#1a1a2e' : '#888')
          .backgroundColor(this.themeIdx === 0 ? '#26b89c' : '#333')
          .padding({ left: 8, right: 8, top: 4, bottom: 4 }).borderRadius(8).margin({ left: 2 })
          .onClick((): void => { this.themeIdx = 0; this.savePref('themeIdx', 0) })
        Text('AMOLED')
          .fontSize(11).fontColor(this.themeIdx === 1 ? '#1a1a2e' : '#888')
          .backgroundColor(this.themeIdx === 1 ? '#26b89c' : '#333')
          .padding({ left: 8, right: 8, top: 4, bottom: 4 }).borderRadius(8).margin({ left: 2 })
          .onClick((): void => { this.themeIdx = 1; this.savePref('themeIdx', 1) })
        Text('Material')
          .fontSize(11).fontColor(this.themeIdx === 2 ? '#1a1a2e' : '#888')
          .backgroundColor(this.themeIdx === 2 ? '#26b89c' : '#333')
          .padding({ left: 8, right: 8, top: 4, bottom: 4 }).borderRadius(8).margin({ left: 2 })
          .onClick((): void => { this.themeIdx = 2; this.savePref('themeIdx', 2) })
      }
    }
    .width('100%').padding(12)
  }

  // ==================== 关于面板 ====================
  // 居中覆盖层，显示版本信息和项目链接

  @Builder AboutPanel() {
    Column() {
      Text('关于 OpenCalc').fontSize(18).fontWeight(FontWeight.Bold).fontColor('#FFFFFF').padding({ bottom: 12 })
      Text('OpenCalc HarmonyOS').fontSize(14).fontColor('#ccc')
      Text('版本 1.0.0').fontSize(14).fontColor('#ccc').padding({ top: 4 })
      Text('原项目: github.com/clementwzk/OpenCalc').fontSize(11).fontColor('#888').padding({ top: 8 })
      Text('Android 3.2.1 → HarmonyOS').fontSize(11).fontColor('#888').padding({ top: 2 })
      Text('迁移: github.com/JungleTestLabs/opencalc-harmonyos').fontSize(11).fontColor('#26b89c').padding({ top: 4 })
      Button('关闭').margin({ top: 16 }).onClick((): void => { this.showAbout = false })
    }
    .width('80%').padding(24).backgroundColor(this.getPanelBg()).borderRadius(16)
  }
}
