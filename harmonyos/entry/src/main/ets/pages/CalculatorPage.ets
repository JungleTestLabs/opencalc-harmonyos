// OpenCalc — Main Calculator Page (final)
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
  @State expression: string = ''
  @State result: string = ''
  @State errorMsg: string = ''
  @State scientific: boolean = false
  @State history: HistoryItem[] = []
  @State showHistory: boolean = false
  @State showSettings: boolean = false
  @State showAbout: boolean = false
  // Preferences
  @State vibrateOn: boolean = true
  @State preventSleep: boolean = false
  @State radianMode: boolean = false
  @State themeIdx: number = 0
  private nextId: number = 0
  private engine: CalcEngine = new CalcEngine()
  private expr: Expression = new Expression()
  private prefs: PreferencesStore | null = null

  aboutToAppear(): void {
    const ctx: common.UIAbilityContext = getContext(this) as common.UIAbilityContext
    this.prefs = new PreferencesStore(ctx)
    this.prefs.init().then((): void => {
      this.loadPrefs()
      this.loadHistory()
    })
  }

  async loadPrefs(): Promise<void> {
    if (!this.prefs) return
    this.vibrateOn = await this.prefs.getVibrationEnabled()
    this.preventSleep = await this.prefs.getPreventSleep()
    this.radianMode = await this.prefs.getRadiansDefault()
    this.themeIdx = await this.prefs.getTheme()
    this.scientific = (await this.prefs.getScientificModeDefault()) === 1
  }

  async loadHistory(): Promise<void> {
    if (!this.prefs) return
    this.history = await this.prefs.getHistory()
    if (this.history.length > 0) this.nextId = this.history[0].id + 1
  }

  async savePref(key: string, value: boolean | number): Promise<void> {
    if (!this.prefs) return
    if (key === 'vibrateOn') await this.prefs.setVibrationEnabled(value as boolean)
    else if (key === 'preventSleep') await this.prefs.setPreventSleep(value as boolean)
    else if (key === 'radianMode') await this.prefs.setRadiansDefault(value as boolean)
    else if (key === 'themeIdx') await this.prefs.setTheme(value as number)
    else if (key === 'scientific') await this.prefs.setScientificModeDefault(value as number)
  }

  // ==================== Button handlers (unchanged) ====================
  onDigit(d: string): void { this.expression = this.expression + d; this.errorMsg = '' }
  onOp(op: string): void { this.expression = this.expression + op; this.errorMsg = '' }
  onFunc(f: string): void { this.expression = this.expression + f + '('; this.errorMsg = '' }
  onConst(c: string): void { this.expression = this.expression + c; this.errorMsg = '' }
  onBS(): void { if (this.expression.length > 0) this.expression = this.expression.substring(0, this.expression.length - 1) }
  onAC(): void { this.expression = ''; this.result = ''; this.errorMsg = ''; ErrorFlags.reset() }

  onEquals(): void {
    if (this.expression.length === 0) return
    ErrorFlags.reset()
    try {
      const clean: string = this.expr.getCleanExpression(this.expression, '.', ',')
      const raw: number = this.engine.evaluate(clean, !this.radianMode)
      if (ErrorFlags.division_by_0) { this.errorMsg = '除数不能为零'; this.result = '' }
      else if (ErrorFlags.domain_error) { this.errorMsg = '定义域错误'; this.result = '' }
      else if (ErrorFlags.syntax_error) { this.errorMsg = '表达式错误'; this.result = '' }
      else if (ErrorFlags.is_infinity) { this.errorMsg = '结果无穷大'; this.result = '' }
      else if (ErrorFlags.require_real_number) { this.errorMsg = '需要实数'; this.result = '' }
      else {
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

  onCopy(): void {
    if (this.result.length === 0) return
    pasteboard.getSystemPasteboard().setData(pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, this.result))
    promptAction.showToast({ message: '已复制' })
  }

  onHistoryTap(item: HistoryItem): void { this.expression = item.expression; this.showHistory = false }
  onHistoryDelete(item: HistoryItem): void {
    const keep: HistoryItem[] = []
    for (let i: number = 0; i < this.history.length; i++) { if (this.history[i].id !== item.id) keep.push(this.history[i]) }
    this.history = keep
    if (this.prefs) this.prefs.setHistory(this.history)
  }

  // ==================== Theme colors ====================
  getBg(): string {
    if (this.themeIdx === 1) return '#000000' // AMOLED
    if (this.themeIdx === 2) return '#0d1117' // Material You dark
    return '#1a1a2e' // Default
  }
  getBtnBg(): string { return this.themeIdx === 1 ? '#1a1a1a' : '#2d2d44' }
  getFuncBg(): string { return this.themeIdx === 1 ? '#222' : '#3a3a5c' }
  getPanelBg(): string { return this.themeIdx === 1 ? '#111' : '#16213e' }

  // ==================== Build ====================
  build() {
    Stack() {
      Column() {
        this.DisplayPanel()
        this.ToggleRow()
        this.ButtonGrid()
        if (this.showHistory) this.HistoryPanel()
      }
      .width('100%').height('100%').backgroundColor(this.getBg())
      if (this.showSettings) this.SettingsPanel()
      if (this.showAbout) this.AboutPanel()
    }
  }

  @Builder DisplayPanel() {
    Column() {
      Text(this.expression.length > 0 ? this.expression : ' ')
        .fontSize(18).fontColor('#888').width('100%').textAlign(TextAlign.End)
        .padding({ right: 16, left: 16 }).maxLines(3)
      if (this.errorMsg.length > 0) {
        Text(this.errorMsg).fontSize(28).fontColor('#FF6B6B')
          .width('100%').textAlign(TextAlign.End).padding({ right: 16, left: 16 })
      } else {
        Text(this.result.length > 0 ? this.result : '0')
          .fontSize(36).fontWeight(FontWeight.Bold).fontColor('#FFFFFF')
          .width('100%').textAlign(TextAlign.End).padding({ right: 16, left: 16 })
      }
    }
    .width('100%').padding({ top: 24, bottom: 8 })
    .gesture(LongPressGesture().onAction((): void => { this.onCopy() }))
  }

  @Builder ToggleRow() {
    Row() {
      Text(this.scientific ? '科学' : '基础')
        .fontSize(12).fontColor('#26b89c')
        .padding({ left: 12, right: 12, top: 4, bottom: 4 })
        .border({ width: 1, color: '#26b89c', radius: 8 })
        .onClick((): void => { this.scientific = !this.scientific })
      Blank()
      Text(this.showHistory ? '▲ 历史' : '▼ 历史')
        .fontSize(12).fontColor('#888').padding(8)
        .onClick((): void => { this.showHistory = !this.showHistory })
      Text('⚙').fontSize(16).fontColor('#888').padding(8)
        .onClick((): void => { this.showSettings = true })
    }
    .width('100%').padding({ left: 16, right: 16, bottom: 4 })
  }

  @Builder ButtonGrid() {
    Column() {
      if (this.scientific) {
        Row() { this.BtnFunc('sin'); this.BtnFunc('cos'); this.BtnFunc('tan'); this.BtnFunc('ln'); this.BtnFunc('log') }
        Row() { this.BtnFunc('arcsi'); this.BtnFunc('arcco'); this.BtnFunc('arcta'); this.BtnConst('π'); this.BtnConst('e') }
      }
      Row() { this.BtnAct('AC'); this.BtnOp('('); this.BtnOp(')'); this.BtnOp('÷') }
      Row() { this.BtnDig('7'); this.BtnDig('8'); this.BtnDig('9'); this.BtnOp('×') }
      Row() { this.BtnDig('4'); this.BtnDig('5'); this.BtnDig('6'); this.BtnOp('-') }
      Row() { this.BtnDig('1'); this.BtnDig('2'); this.BtnDig('3'); this.BtnOp('+') }
      Row() { this.BtnDig('0'); this.BtnOp('.'); this.BtnAct('⌫'); this.BtnEq() }
    }
    .width('100%').padding({ left: 8, right: 8 }).layoutWeight(1)
  }

  @Builder BtnDig(l: string) { Text(l).fontSize(22).fontColor('#FFFFFF').width('22%').height(56).textAlign(TextAlign.Center).backgroundColor(this.getBtnBg()).borderRadius(12).margin(4).onClick((): void => { this.onDigit(l) }) }
  @Builder BtnOp(l: string) { Text(l).fontSize(20).fontColor('#FFFFFF').width('22%').height(56).textAlign(TextAlign.Center).backgroundColor('#26b89c').borderRadius(12).margin(4).onClick((): void => { this.onOp(l) }) }
  @Builder BtnFunc(l: string) { Text(l).fontSize(14).fontColor('#FFFFFF').width('18%').height(46).textAlign(TextAlign.Center).backgroundColor(this.getFuncBg()).borderRadius(10).margin(3).onClick((): void => { this.onFunc(l) }) }
  @Builder BtnConst(l: string) { Text(l).fontSize(18).fontColor('#26b89c').width('18%').height(46).textAlign(TextAlign.Center).backgroundColor(this.getBtnBg()).borderRadius(10).margin(3).onClick((): void => { this.onConst(l) }) }
  @Builder BtnAct(l: string) { Text(l).fontSize(20).fontColor(l === 'AC' ? '#FF6B6B' : '#888').width('22%').height(56).textAlign(TextAlign.Center).backgroundColor(this.getBtnBg()).borderRadius(12).margin(4).onClick((): void => { if (l === 'AC') this.onAC(); else this.onBS() }) }
  @Builder BtnEq() { Text('=').fontSize(24).fontWeight(FontWeight.Bold).fontColor('#1a1a2e').width('22%').height(56).textAlign(TextAlign.Center).backgroundColor('#26b89c').borderRadius(12).margin(4).onClick((): void => { this.onEquals() }) }

  @Builder HistoryPanel() {
    Column() {
      if (this.history.length === 0) {
        Text('暂无计算记录').fontSize(14).fontColor('#666').width('100%').textAlign(TextAlign.Center).padding(40)
      } else {
        List() {
          ForEach(this.history, (item: HistoryItem) => {
            ListItem() {
              Row() {
                Column() { Text(item.expression).fontSize(13).fontColor('#ccc').maxLines(1); Text(item.result).fontSize(16).fontWeight(FontWeight.Bold).fontColor('#26b89c') }
                .alignItems(HorizontalAlign.Start).layoutWeight(1)
              }
              .width('100%').padding(12).onClick((): void => { this.onHistoryTap(item) })
            }
            .swipeAction({ end: { builder: (): void => { this.DelBtn(item) } } })
          })
        }
        .height(200)
      }
    }
    .width('100%').backgroundColor(this.getPanelBg()).borderRadius({ topLeft: 16, topRight: 16 }).padding({ top: 12 })
  }

  @Builder DelBtn(item: HistoryItem) {
    Text('删除').fontSize(14).fontColor('#FFFFFF').padding(16).backgroundColor('#FF6B6B').height('100%')
      .onClick((): void => { this.onHistoryDelete(item) })
  }

  // ==================== Settings Panel ====================
  @Builder SettingsPanel() {
    Column() {
      Row() {
        Text('设置').fontSize(18).fontWeight(FontWeight.Bold).fontColor('#FFFFFF')
        Blank()
        Text('✕').fontSize(20).fontColor('#888').onClick((): void => { this.showSettings = false })
      }
      .width('100%').padding(16)

      List() {
        ListItem() { this.ToggleItem('振动反馈', this.vibrateOn, (v: boolean): void => { this.vibrateOn = v; this.savePref('vibrateOn', v) }) }
        ListItem() { this.ToggleItem('防休眠', this.preventSleep, (v: boolean): void => { this.preventSleep = v; this.savePref('preventSleep', v) }) }
        ListItem() { this.ToggleItem('弧度模式', this.radianMode, (v: boolean): void => { this.radianMode = v; this.savePref('radianMode', v) }) }
        ListItem() { this.ThemeItem() }
        ListItem() {
          Row() { Text('关于 OpenCalc').fontSize(15).fontColor('#ccc'); Blank(); Text('>').fontColor('#888') }
          .width('100%').padding(12)
          .onClick((): void => { this.showSettings = false; this.showAbout = true })
        }
      }
    }
    .width('85%').backgroundColor(this.getPanelBg()).borderRadius(16)
  }

  @Builder ToggleItem(title: string, val: boolean, cb: (v: boolean) => void) {
    Row() {
      Text(title).fontSize(15).fontColor('#FFFFFF').layoutWeight(1)
      Toggle({ type: ToggleType.Switch, isOn: val }).onChange((on: boolean): void => { cb(on) })
    }
    .width('100%').padding(12)
  }

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

  // ==================== About Panel ====================
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
