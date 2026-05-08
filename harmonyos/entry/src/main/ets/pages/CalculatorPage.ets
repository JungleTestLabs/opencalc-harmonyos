// OpenCalc — Main Calculator Page (clean rewrite)
// ArkTS @Entry page with calculator UI

import { promptAction } from '@kit.ArkUI'
import { pasteboard } from '@kit.BasicServicesKit'
import { Expression } from '../calculator/Expression'
import { CalcEngine } from '../calculator/Calculator'
import { NumberFormatter } from '../calculator/NumberFormatter'
import { NumberingSystem, HistoryItem } from '../model/Models'
import { ErrorFlags } from '../model/ErrorFlags'

@Entry
@Component
export struct CalculatorPage {
  @State expression: string = ''
  @State result: string = ''
  @State errorMsg: string = ''
  @State scientific: boolean = false
  @State history: HistoryItem[] = []
  @State showHistory: boolean = false
  private nextId: number = 0
  private engine: CalcEngine = new CalcEngine()
  private expr: Expression = new Expression()

  onDigit(d: string): void {
    this.expression = this.expression + d
    this.errorMsg = ''
  }

  onOp(op: string): void {
    this.expression = this.expression + op
    this.errorMsg = ''
  }

  onFunc(f: string): void {
    this.expression = this.expression + f + '('
    this.errorMsg = ''
  }

  onConst(c: string): void {
    this.expression = this.expression + c
    this.errorMsg = ''
  }

  onBS(): void {
    if (this.expression.length > 0) {
      this.expression = this.expression.substring(0, this.expression.length - 1)
    }
  }

  onAC(): void {
    this.expression = ''
    this.result = ''
    this.errorMsg = ''
    ErrorFlags.reset()
  }

  onEquals(): void {
    if (this.expression.length === 0) return
    ErrorFlags.reset()
    try {
      const clean: string = this.expr.getCleanExpression(this.expression, '.', ',')
      const raw: number = this.engine.evaluate(clean, true)
      if (ErrorFlags.division_by_0) { this.errorMsg = '除数不能为零'; this.result = '' }
      else if (ErrorFlags.domain_error) { this.errorMsg = '定义域错误'; this.result = '' }
      else if (ErrorFlags.syntax_error) { this.errorMsg = '表达式错误'; this.result = '' }
      else if (ErrorFlags.is_infinity) { this.errorMsg = '结果无穷大'; this.result = '' }
      else if (ErrorFlags.require_real_number) { this.errorMsg = '需要实数'; this.result = '' }
      else {
        const formatted: string = NumberFormatter.format(raw.toString(), '.', ',', NumberingSystem.INTERNATIONAL)
        this.result = formatted
        this.errorMsg = ''
        // Add to history
        const item: HistoryItem = { id: this.nextId, expression: this.expression, result: formatted, timestamp: Date.now() }
        this.nextId = this.nextId + 1
        const newHistory: HistoryItem[] = [item]
        for (let i: number = 0; i < this.history.length; i++) newHistory.push(this.history[i])
        this.history = newHistory
      }
    } catch (_e) {
      this.errorMsg = '计算错误'
    }
  }

  onCopy(): void {
    if (this.result.length === 0) return
    const data: pasteboard.PasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, this.result)
    pasteboard.getSystemPasteboard().setData(data)
    promptAction.showToast({ message: '已复制' })
  }

  onHistoryTap(item: HistoryItem): void {
    this.expression = item.expression
    this.showHistory = false
  }

  onHistoryDelete(item: HistoryItem): void {
    const keep: HistoryItem[] = []
    for (let i: number = 0; i < this.history.length; i++) {
      if (this.history[i].id !== item.id) keep.push(this.history[i])
    }
    this.history = keep
  }

  build() {
    Stack() {
      Column() {
        // Display
        this.DisplayPanel()

        // Toggle row
        Row() {
          Text(this.scientific ? '科学' : '基础')
            .fontSize(12).fontColor('#26b89c')
            .padding({ left: 12, right: 12, top: 4, bottom: 4 })
            .border({ width: 1, color: '#26b89c', radius: 8 })
            .onClick((): void => { this.scientific = !this.scientific })
          Blank()
          Text(this.showHistory ? '▲ 历史' : '▼ 历史')
            .fontSize(12).fontColor('#888')
            .padding(8)
            .onClick((): void => { this.showHistory = !this.showHistory })
        }
        .width('100%').padding({ left: 16, right: 16, bottom: 4 })

        // Button grid
        this.ButtonGrid()

        // History panel
        if (this.showHistory) { this.HistoryPanel() }
      }
      .width('100%').height('100%')
      .backgroundColor('#1a1a2e')
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

  @Builder BtnDig(label: string) {
    Text(label).fontSize(22).fontColor('#FFFFFF')
      .width('22%').height(56).textAlign(TextAlign.Center)
      .backgroundColor('#2d2d44').borderRadius(12).margin(4)
      .onClick((): void => { this.onDigit(label) })
  }

  @Builder BtnOp(label: string) {
    Text(label).fontSize(20).fontColor('#FFFFFF')
      .width('22%').height(56).textAlign(TextAlign.Center)
      .backgroundColor('#26b89c').borderRadius(12).margin(4)
      .onClick((): void => { this.onOp(label) })
  }

  @Builder BtnFunc(label: string) {
    Text(label).fontSize(14).fontColor('#FFFFFF')
      .width('18%').height(46).textAlign(TextAlign.Center)
      .backgroundColor('#3a3a5c').borderRadius(10).margin(3)
      .onClick((): void => { this.onFunc(label) })
  }

  @Builder BtnConst(label: string) {
    Text(label).fontSize(18).fontColor('#26b89c')
      .width('18%').height(46).textAlign(TextAlign.Center)
      .backgroundColor('#2d2d44').borderRadius(10).margin(3)
      .onClick((): void => { this.onConst(label) })
  }

  @Builder BtnAct(label: string) {
    Text(label).fontSize(20).fontColor(label === 'AC' ? '#FF6B6B' : '#888')
      .width('22%').height(56).textAlign(TextAlign.Center)
      .backgroundColor('#2d2d44').borderRadius(12).margin(4)
      .onClick((): void => { if (label === 'AC') this.onAC(); else this.onBS() })
  }

  @Builder BtnEq() {
    Text('=').fontSize(24).fontWeight(FontWeight.Bold).fontColor('#1a1a2e')
      .width('22%').height(56).textAlign(TextAlign.Center)
      .backgroundColor('#26b89c').borderRadius(12).margin(4)
      .onClick((): void => { this.onEquals() })
  }

  @Builder HistoryPanel() {
    Column() {
      if (this.history.length === 0) {
        Text('暂无计算记录').fontSize(14).fontColor('#666')
          .width('100%').textAlign(TextAlign.Center).padding(40)
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
              .width('100%').padding(12)
              .onClick((): void => { this.onHistoryTap(item) })
            }
            .swipeAction({ end: { builder: (): void => { this.DelBtn(item) } } })
          })
        }
        .height(200)
      }
    }
    .width('100%').backgroundColor('#16213e')
    .borderRadius({ topLeft: 16, topRight: 16 })
    .padding({ top: 12 })
  }

  @Builder DelBtn(item: HistoryItem) {
    Text('删除').fontSize(14).fontColor('#FFFFFF')
      .padding(16).backgroundColor('#FF6B6B').height('100%')
      .onClick((): void => { this.onHistoryDelete(item) })
  }
}
