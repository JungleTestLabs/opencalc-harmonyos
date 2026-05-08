if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CalculatorPage_Params {
    expression?: string;
    result?: string;
    errorMsg?: string;
    scientific?: boolean;
    history?: HistoryItem[];
    showHistory?: boolean;
    showSettings?: boolean;
    showAbout?: boolean;
    isLandscape?: boolean;
    vibrateOn?: boolean;
    preventSleep?: boolean;
    radianMode?: boolean;
    themeIdx?: number;
    nextId?: number;
    engine?: CalcEngine;
    expr?: Expression;
    prefs?: PreferencesStore | null;
}
import promptAction from "@ohos:promptAction";
import pasteboard from "@ohos:pasteboard";
import type common from "@ohos:app.ability.common";
import { Expression } from "@bundle:com.darkempire78.opencalculator/entry/ets/calculator/Expression";
import { CalcEngine } from "@bundle:com.darkempire78.opencalculator/entry/ets/calculator/Calculator";
import { NumberFormatter } from "@bundle:com.darkempire78.opencalculator/entry/ets/calculator/NumberFormatter";
import { NumberingSystem } from "@bundle:com.darkempire78.opencalculator/entry/ets/model/Models";
import type { HistoryItem } from "@bundle:com.darkempire78.opencalculator/entry/ets/model/Models";
import { ErrorFlags } from "@bundle:com.darkempire78.opencalculator/entry/ets/model/ErrorFlags";
import { PreferencesStore } from "@bundle:com.darkempire78.opencalculator/entry/ets/preferences/PreferencesStore";
export class CalculatorPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__expression = new ObservedPropertySimplePU('' // 当前输入表达式
        , this, "expression");
        this.__result = new ObservedPropertySimplePU('' // 计算结果
        , this, "result");
        this.__errorMsg = new ObservedPropertySimplePU('' // 错误信息
        , this, "errorMsg");
        this.__scientific = new ObservedPropertySimplePU(false // 科学模式开关
        , this, "scientific");
        this.__history = new ObservedPropertyObjectPU([] // 历史记录列表
        , this, "history");
        this.__showHistory = new ObservedPropertySimplePU(false // 历史面板可见性
        , this, "showHistory");
        this.__showSettings = new ObservedPropertySimplePU(false // 设置面板可见性
        , this, "showSettings");
        this.__showAbout = new ObservedPropertySimplePU(false // 关于面板可见性
        , this, "showAbout");
        this.__isLandscape = new ObservedPropertySimplePU(false // 横屏模式（自动检测）
        // ==================== 偏好设置状态 ====================
        , this, "isLandscape");
        this.__vibrateOn = new ObservedPropertySimplePU(true // 振动反馈
        , this, "vibrateOn");
        this.__preventSleep = new ObservedPropertySimplePU(false // 防休眠
        , this, "preventSleep");
        this.__radianMode = new ObservedPropertySimplePU(false // 弧度模式（否则为角度）
        , this, "radianMode");
        this.__themeIdx = new ObservedPropertySimplePU(0 // 主题索引
        // ==================== 内部状态 ====================
        , this, "themeIdx");
        this.nextId = 0 // 历史记录自增 ID
        ;
        this.engine = new CalcEngine() // 计算引擎实例
        ;
        this.expr = new Expression() // 表达式预处理器实例
        ;
        this.prefs = null // 偏好存储实例
        ;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CalculatorPage_Params) {
        if (params.expression !== undefined) {
            this.expression = params.expression;
        }
        if (params.result !== undefined) {
            this.result = params.result;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
        if (params.scientific !== undefined) {
            this.scientific = params.scientific;
        }
        if (params.history !== undefined) {
            this.history = params.history;
        }
        if (params.showHistory !== undefined) {
            this.showHistory = params.showHistory;
        }
        if (params.showSettings !== undefined) {
            this.showSettings = params.showSettings;
        }
        if (params.showAbout !== undefined) {
            this.showAbout = params.showAbout;
        }
        if (params.isLandscape !== undefined) {
            this.isLandscape = params.isLandscape;
        }
        if (params.vibrateOn !== undefined) {
            this.vibrateOn = params.vibrateOn;
        }
        if (params.preventSleep !== undefined) {
            this.preventSleep = params.preventSleep;
        }
        if (params.radianMode !== undefined) {
            this.radianMode = params.radianMode;
        }
        if (params.themeIdx !== undefined) {
            this.themeIdx = params.themeIdx;
        }
        if (params.nextId !== undefined) {
            this.nextId = params.nextId;
        }
        if (params.engine !== undefined) {
            this.engine = params.engine;
        }
        if (params.expr !== undefined) {
            this.expr = params.expr;
        }
        if (params.prefs !== undefined) {
            this.prefs = params.prefs;
        }
    }
    updateStateVars(params: CalculatorPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__expression.purgeDependencyOnElmtId(rmElmtId);
        this.__result.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
        this.__scientific.purgeDependencyOnElmtId(rmElmtId);
        this.__history.purgeDependencyOnElmtId(rmElmtId);
        this.__showHistory.purgeDependencyOnElmtId(rmElmtId);
        this.__showSettings.purgeDependencyOnElmtId(rmElmtId);
        this.__showAbout.purgeDependencyOnElmtId(rmElmtId);
        this.__isLandscape.purgeDependencyOnElmtId(rmElmtId);
        this.__vibrateOn.purgeDependencyOnElmtId(rmElmtId);
        this.__preventSleep.purgeDependencyOnElmtId(rmElmtId);
        this.__radianMode.purgeDependencyOnElmtId(rmElmtId);
        this.__themeIdx.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__expression.aboutToBeDeleted();
        this.__result.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        this.__scientific.aboutToBeDeleted();
        this.__history.aboutToBeDeleted();
        this.__showHistory.aboutToBeDeleted();
        this.__showSettings.aboutToBeDeleted();
        this.__showAbout.aboutToBeDeleted();
        this.__isLandscape.aboutToBeDeleted();
        this.__vibrateOn.aboutToBeDeleted();
        this.__preventSleep.aboutToBeDeleted();
        this.__radianMode.aboutToBeDeleted();
        this.__themeIdx.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // ==================== 显示状态 ====================
    private __expression: ObservedPropertySimplePU<string>; // 当前输入表达式
    get expression() {
        return this.__expression.get();
    }
    set expression(newValue: string) {
        this.__expression.set(newValue);
    }
    private __result: ObservedPropertySimplePU<string>; // 计算结果
    get result() {
        return this.__result.get();
    }
    set result(newValue: string) {
        this.__result.set(newValue);
    }
    private __errorMsg: ObservedPropertySimplePU<string>; // 错误信息
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    private __scientific: ObservedPropertySimplePU<boolean>; // 科学模式开关
    get scientific() {
        return this.__scientific.get();
    }
    set scientific(newValue: boolean) {
        this.__scientific.set(newValue);
    }
    private __history: ObservedPropertyObjectPU<HistoryItem[]>; // 历史记录列表
    get history() {
        return this.__history.get();
    }
    set history(newValue: HistoryItem[]) {
        this.__history.set(newValue);
    }
    private __showHistory: ObservedPropertySimplePU<boolean>; // 历史面板可见性
    get showHistory() {
        return this.__showHistory.get();
    }
    set showHistory(newValue: boolean) {
        this.__showHistory.set(newValue);
    }
    private __showSettings: ObservedPropertySimplePU<boolean>; // 设置面板可见性
    get showSettings() {
        return this.__showSettings.get();
    }
    set showSettings(newValue: boolean) {
        this.__showSettings.set(newValue);
    }
    private __showAbout: ObservedPropertySimplePU<boolean>; // 关于面板可见性
    get showAbout() {
        return this.__showAbout.get();
    }
    set showAbout(newValue: boolean) {
        this.__showAbout.set(newValue);
    }
    private __isLandscape: ObservedPropertySimplePU<boolean>; // 横屏模式（自动检测）
    get isLandscape() {
        return this.__isLandscape.get();
    }
    set isLandscape(newValue: boolean) {
        this.__isLandscape.set(newValue);
    }
    // ==================== 偏好设置状态 ====================
    private __vibrateOn: ObservedPropertySimplePU<boolean>; // 振动反馈
    get vibrateOn() {
        return this.__vibrateOn.get();
    }
    set vibrateOn(newValue: boolean) {
        this.__vibrateOn.set(newValue);
    }
    private __preventSleep: ObservedPropertySimplePU<boolean>; // 防休眠
    get preventSleep() {
        return this.__preventSleep.get();
    }
    set preventSleep(newValue: boolean) {
        this.__preventSleep.set(newValue);
    }
    private __radianMode: ObservedPropertySimplePU<boolean>; // 弧度模式（否则为角度）
    get radianMode() {
        return this.__radianMode.get();
    }
    set radianMode(newValue: boolean) {
        this.__radianMode.set(newValue);
    }
    private __themeIdx: ObservedPropertySimplePU<number>; // 主题索引
    get themeIdx() {
        return this.__themeIdx.get();
    }
    set themeIdx(newValue: number) {
        this.__themeIdx.set(newValue);
    }
    // ==================== 内部状态 ====================
    private nextId: number; // 历史记录自增 ID
    private engine: CalcEngine; // 计算引擎实例
    private expr: Expression; // 表达式预处理器实例
    private prefs: PreferencesStore | null; // 偏好存储实例
    /**
     * 页面初始化生命周期
     * 创建 PreferencesStore 并异步加载偏好和历史
     */
    aboutToAppear(): void {
        const ctx: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
        this.prefs = new PreferencesStore(ctx);
        this.prefs.init().then((): void => {
            this.loadPrefs();
            this.loadHistory();
        });
    }
    /** 从持久化存储加载偏好设置 */
    async loadPrefs(): Promise<void> {
        if (!this.prefs)
            return;
        this.vibrateOn = await this.prefs.getVibrationEnabled();
        this.preventSleep = await this.prefs.getPreventSleep();
        this.radianMode = await this.prefs.getRadiansDefault();
        this.themeIdx = await this.prefs.getTheme();
        this.scientific = (await this.prefs.getScientificModeDefault()) === 1;
    }
    /** 从持久化存储加载历史记录 */
    async loadHistory(): Promise<void> {
        if (!this.prefs)
            return;
        this.history = await this.prefs.getHistory();
        if (this.history.length > 0)
            this.nextId = this.history[0].id + 1;
    }
    /**
     * 保存单个偏好设置项
     * @param key 偏好键名
     * @param value 偏好值
     */
    async savePref(key: string, value: boolean | number): Promise<void> {
        if (!this.prefs)
            return;
        if (key === 'vibrateOn')
            await this.prefs.setVibrationEnabled(value as boolean);
        else if (key === 'preventSleep')
            await this.prefs.setPreventSleep(value as boolean);
        else if (key === 'radianMode')
            await this.prefs.setRadiansDefault(value as boolean);
        else if (key === 'themeIdx')
            await this.prefs.setTheme(value as number);
        else if (key === 'scientific')
            await this.prefs.setScientificModeDefault(value as number);
    }
    // ==================== 按钮事件处理 ====================
    /** 数字按钮点击：追加数字到表达式 */
    onDigit(d: string): void { this.expression = this.expression + d; this.errorMsg = ''; }
    /** 运算符按钮点击：追加运算符到表达式 */
    onOp(op: string): void { this.expression = this.expression + op; this.errorMsg = ''; }
    /** 函数按钮点击：追加函数名和左括号 */
    onFunc(f: string): void { this.expression = this.expression + f + '('; this.errorMsg = ''; }
    /** 常量按钮点击：追加常量到表达式 */
    onConst(c: string): void { this.expression = this.expression + c; this.errorMsg = ''; }
    /** 退格按钮：删除表达式最后一个字符 */
    onBS(): void { if (this.expression.length > 0)
        this.expression = this.expression.substring(0, this.expression.length - 1); }
    /** AC 按钮：清空表达式、结果和错误信息 */
    onAC(): void { this.expression = ''; this.result = ''; this.errorMsg = ''; ErrorFlags.reset(); }
    /**
     * 等号按钮：执行计算
     * 流程：预处理表达式 → 递归下降解析 → 格式化结果 → 添加到历史
     */
    onEquals(): void {
        if (this.expression.length === 0)
            return;
        ErrorFlags.reset();
        try {
            const clean: string = this.expr.getCleanExpression(this.expression, '.', ',');
            const raw: number = this.engine.evaluate(clean, !this.radianMode);
            // 按优先级检查各类错误
            if (ErrorFlags.division_by_0) {
                this.errorMsg = '除数不能为零';
                this.result = '';
            }
            else if (ErrorFlags.domain_error) {
                this.errorMsg = '定义域错误';
                this.result = '';
            }
            else if (ErrorFlags.syntax_error) {
                this.errorMsg = '表达式错误';
                this.result = '';
            }
            else if (ErrorFlags.is_infinity) {
                this.errorMsg = '结果无穷大';
                this.result = '';
            }
            else if (ErrorFlags.require_real_number) {
                this.errorMsg = '需要实数';
                this.result = '';
            }
            else {
                // 格式化结果并添加到历史
                const fmt: string = NumberFormatter.format(raw.toString(), '.', ',', NumberingSystem.INTERNATIONAL);
                this.result = fmt;
                this.errorMsg = '';
                const item: HistoryItem = { id: this.nextId, expression: this.expression, result: fmt, timestamp: Date.now() };
                this.nextId = this.nextId + 1;
                const nh: HistoryItem[] = [item];
                for (let i: number = 0; i < this.history.length; i++)
                    nh.push(this.history[i]);
                this.history = nh;
                if (this.prefs)
                    this.prefs.setHistory(this.history);
            }
        }
        catch (_e) {
            this.errorMsg = '计算错误';
        }
    }
    /** 长按结果区：复制结果到剪贴板 */
    onCopy(): void {
        if (this.result.length === 0)
            return;
        pasteboard.getSystemPasteboard().setData(pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, this.result));
        promptAction.showToast({ message: '已复制' });
    }
    /** 点击历史条目：回填表达式到输入框 */
    onHistoryTap(item: HistoryItem): void { this.expression = item.expression; this.showHistory = false; }
    /** 删除历史条目 */
    onHistoryDelete(item: HistoryItem): void {
        const keep: HistoryItem[] = [];
        for (let i: number = 0; i < this.history.length; i++) {
            if (this.history[i].id !== item.id)
                keep.push(this.history[i]);
        }
        this.history = keep;
        if (this.prefs)
            this.prefs.setHistory(this.history);
    }
    // ==================== 主题颜色 ====================
    /** 获取当前主题的背景色 */
    getBg(): string {
        if (this.themeIdx === 1)
            return '#000000'; // AMOLED 纯黑
        if (this.themeIdx === 2)
            return '#0d1117'; // Material You 暗色
        return '#1a1a2e'; // 默认深蓝
    }
    /** 获取按钮背景色 */
    getBtnBg(): string { return this.themeIdx === 1 ? '#1a1a1a' : '#2d2d44'; }
    /** 获取功能按钮背景色 */
    getFuncBg(): string { return this.themeIdx === 1 ? '#222' : '#3a3a5c'; }
    /** 获取面板背景色 */
    getPanelBg(): string { return this.themeIdx === 1 ? '#111' : '#16213e'; }
    // ==================== 主布局（支持横竖屏自适应） ====================
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
            Stack.onAreaChange((oldValue: Area, newValue: Area): void => {
                const w: number = newValue.width as number;
                const h: number = newValue.height as number;
                const wasLandscape: boolean = this.isLandscape;
                this.isLandscape = w > h;
                // 切换到横屏时自动开启科学模式+历史面板
                if (!wasLandscape && this.isLandscape) {
                    this.scientific = true;
                    this.showHistory = true;
                }
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLandscape) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 横屏布局：左边按钮网格 + 右边历史面板
                        Row.create();
                        // 横屏布局：左边按钮网格 + 右边历史面板
                        Row.width('100%');
                        // 横屏布局：左边按钮网格 + 右边历史面板
                        Row.height('100%');
                        // 横屏布局：左边按钮网格 + 右边历史面板
                        Row.backgroundColor(this.getBg());
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.layoutWeight(3);
                        Column.height('100%');
                    }, Column);
                    this.DisplayPanel.bind(this)();
                    this.ToggleRow.bind(this)();
                    this.ButtonGrid.bind(this)();
                    Column.pop();
                    this.HistoryPanel.bind(this)();
                    // 横屏布局：左边按钮网格 + 右边历史面板
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 竖屏布局：原有布局
                        Column.create();
                        // 竖屏布局：原有布局
                        Column.width('100%');
                        // 竖屏布局：原有布局
                        Column.height('100%');
                        // 竖屏布局：原有布局
                        Column.backgroundColor(this.getBg());
                    }, Column);
                    this.DisplayPanel.bind(this)();
                    this.ToggleRow.bind(this)();
                    this.ButtonGrid.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.showHistory) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.HistoryPanel.bind(this)();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    // 竖屏布局：原有布局
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showSettings) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.SettingsPanel.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showAbout) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.AboutPanel.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    // ==================== 显示屏面板 ====================
    DisplayPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ top: 24, bottom: 8 });
            globalThis.Gesture.create(GesturePriority.Low);
            LongPressGesture.create();
            LongPressGesture.onAction((): void => { this.onCopy(); });
            LongPressGesture.pop();
            globalThis.Gesture.pop();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 表达式显示行（小字，灰色）
            Text.create(this.expression.length > 0 ? this.expression : ' ');
            // 表达式显示行（小字，灰色）
            Text.fontSize(18);
            // 表达式显示行（小字，灰色）
            Text.fontColor('#888');
            // 表达式显示行（小字，灰色）
            Text.width('100%');
            // 表达式显示行（小字，灰色）
            Text.textAlign(TextAlign.End);
            // 表达式显示行（小字，灰色）
            Text.padding({ right: 16, left: 16 });
            // 表达式显示行（小字，灰色）
            Text.maxLines(3);
        }, Text);
        // 表达式显示行（小字，灰色）
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 结果或错误显示行
            if (this.errorMsg.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 错误信息（红色大字）
                        Text.create(this.errorMsg);
                        // 错误信息（红色大字）
                        Text.fontSize(28);
                        // 错误信息（红色大字）
                        Text.fontColor('#FF6B6B');
                        // 错误信息（红色大字）
                        Text.width('100%');
                        // 错误信息（红色大字）
                        Text.textAlign(TextAlign.End);
                        // 错误信息（红色大字）
                        Text.padding({ right: 16, left: 16 });
                    }, Text);
                    // 错误信息（红色大字）
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 计算结果（白色大字）
                        Text.create(this.result.length > 0 ? this.result : '0');
                        // 计算结果（白色大字）
                        Text.fontSize(36);
                        // 计算结果（白色大字）
                        Text.fontWeight(FontWeight.Bold);
                        // 计算结果（白色大字）
                        Text.fontColor('#FFFFFF');
                        // 计算结果（白色大字）
                        Text.width('100%');
                        // 计算结果（白色大字）
                        Text.textAlign(TextAlign.End);
                        // 计算结果（白色大字）
                        Text.padding({ right: 16, left: 16 });
                    }, Text);
                    // 计算结果（白色大字）
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    // ==================== 模式切换栏 ====================
    ToggleRow(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16, bottom: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 科学/基础模式切换
            Text.create(this.scientific ? '科学' : '基础');
            // 科学/基础模式切换
            Text.fontSize(12);
            // 科学/基础模式切换
            Text.fontColor('#26b89c');
            // 科学/基础模式切换
            Text.padding({ left: 12, right: 12, top: 4, bottom: 4 });
            // 科学/基础模式切换
            Text.border({ width: 1, color: '#26b89c', radius: 8 });
            // 科学/基础模式切换
            Text.onClick((): void => { this.scientific = !this.scientific; });
        }, Text);
        // 科学/基础模式切换
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 历史面板开关
            Text.create(this.showHistory ? '▲ 历史' : '▼ 历史');
            // 历史面板开关
            Text.fontSize(12);
            // 历史面板开关
            Text.fontColor('#888');
            // 历史面板开关
            Text.padding(8);
            // 历史面板开关
            Text.onClick((): void => { this.showHistory = !this.showHistory; });
        }, Text);
        // 历史面板开关
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 设置按钮
            Text.create('⚙');
            // 设置按钮
            Text.fontSize(16);
            // 设置按钮
            Text.fontColor('#888');
            // 设置按钮
            Text.padding(8);
            // 设置按钮
            Text.onClick((): void => { this.showSettings = true; });
        }, Text);
        // 设置按钮
        Text.pop();
        Row.pop();
    }
    // ==================== 按钮网格 ====================
    ButtonGrid(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 8, right: 8 });
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 科学模式额外按钮行
            if (this.scientific) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.BtnFunc.bind(this)('sin');
                    this.BtnFunc.bind(this)('cos');
                    this.BtnFunc.bind(this)('tan');
                    this.BtnFunc.bind(this)('ln');
                    this.BtnFunc.bind(this)('log');
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.BtnFunc.bind(this)('arcsi');
                    this.BtnFunc.bind(this)('arcco');
                    this.BtnFunc.bind(this)('arcta');
                    this.BtnConst.bind(this)('π');
                    this.BtnConst.bind(this)('e');
                    Row.pop();
                });
            }
            // 标准按钮行
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标准按钮行
            Row.create();
        }, Row);
        this.BtnAct.bind(this)('AC');
        this.BtnOp.bind(this)('(');
        this.BtnOp.bind(this)(')');
        this.BtnOp.bind(this)('÷');
        // 标准按钮行
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.BtnDig.bind(this)('7');
        this.BtnDig.bind(this)('8');
        this.BtnDig.bind(this)('9');
        this.BtnOp.bind(this)('×');
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.BtnDig.bind(this)('4');
        this.BtnDig.bind(this)('5');
        this.BtnDig.bind(this)('6');
        this.BtnOp.bind(this)('-');
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.BtnDig.bind(this)('1');
        this.BtnDig.bind(this)('2');
        this.BtnDig.bind(this)('3');
        this.BtnOp.bind(this)('+');
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.BtnDig.bind(this)('0');
        this.BtnOp.bind(this)('.');
        this.BtnAct.bind(this)('⌫');
        this.BtnEq.bind(this)();
        Row.pop();
        Column.pop();
    }
    // ==================== 按钮构建器 ====================
    /** 数字按钮（白色文字，深色背景） */
    BtnDig(l: string, parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(l);
        Text.fontSize(this.isLandscape ? 18 : 22);
        Text.fontColor('#FFFFFF');
        Text.width('22%');
        Text.height(this.isLandscape ? 40 : 56);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor(this.getBtnBg());
        Text.borderRadius(12);
        Text.margin(this.isLandscape ? 2 : 4);
        Text.onClick((): void => { this.onDigit(l); });
    }, Text); Text.pop(); }
    /** 运算符按钮（白色文字，青绿色背景） */
    BtnOp(l: string, parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(l);
        Text.fontSize(this.isLandscape ? 16 : 20);
        Text.fontColor('#FFFFFF');
        Text.width('22%');
        Text.height(this.isLandscape ? 40 : 56);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor('#26b89c');
        Text.borderRadius(12);
        Text.margin(this.isLandscape ? 2 : 4);
        Text.onClick((): void => { this.onOp(l); });
    }, Text); Text.pop(); }
    /** 科学函数按钮（小字，紫色背景） */
    BtnFunc(l: string, parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(l);
        Text.fontSize(this.isLandscape ? 12 : 14);
        Text.fontColor('#FFFFFF');
        Text.width('18%');
        Text.height(this.isLandscape ? 34 : 46);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor(this.getFuncBg());
        Text.borderRadius(10);
        Text.margin(this.isLandscape ? 2 : 3);
        Text.onClick((): void => { this.onFunc(l); });
    }, Text); Text.pop(); }
    /** 常量按钮（青绿色文字，深色背景） */
    BtnConst(l: string, parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(l);
        Text.fontSize(this.isLandscape ? 14 : 18);
        Text.fontColor('#26b89c');
        Text.width('18%');
        Text.height(this.isLandscape ? 34 : 46);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor(this.getBtnBg());
        Text.borderRadius(10);
        Text.margin(this.isLandscape ? 2 : 3);
        Text.onClick((): void => { this.onConst(l); });
    }, Text); Text.pop(); }
    /** 动作按钮（AC 红色，退格灰色） */
    BtnAct(l: string, parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(l);
        Text.fontSize(this.isLandscape ? 16 : 20);
        Text.fontColor(l === 'AC' ? '#FF6B6B' : '#888');
        Text.width('22%');
        Text.height(this.isLandscape ? 40 : 56);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor(this.getBtnBg());
        Text.borderRadius(12);
        Text.margin(this.isLandscape ? 2 : 4);
        Text.onClick((): void => { if (l === 'AC')
            this.onAC();
        else
            this.onBS(); });
    }, Text); Text.pop(); }
    /** 等号按钮（深色文字，青绿色背景，加粗） */
    BtnEq(parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create('=');
        Text.fontSize(this.isLandscape ? 20 : 24);
        Text.fontWeight(FontWeight.Bold);
        Text.fontColor('#1a1a2e');
        Text.width('22%');
        Text.height(this.isLandscape ? 40 : 56);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor('#26b89c');
        Text.borderRadius(12);
        Text.margin(this.isLandscape ? 2 : 4);
        Text.onClick((): void => { this.onEquals(); });
    }, Text); Text.pop(); }
    // ==================== 历史记录面板 ====================
    // 竖屏：底部弹出面板；横屏：右侧固定面板
    HistoryPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(this.isLandscape ? 1 : 0);
            Column.width(this.isLandscape ? '100%' : '100%');
            Column.height(this.isLandscape ? '100%' : 'auto');
            Column.backgroundColor(this.getPanelBg());
            Column.borderRadius(this.isLandscape ? 0 : { topLeft: 16, topRight: 16 });
            Column.padding({ top: this.isLandscape ? 8 : 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('历史记录');
            Text.fontSize(this.isLandscape ? 14 : 16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
            Text.width('100%');
            Text.padding(this.isLandscape ? 8 : 16);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.history.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 空状态引导
                        Text.create('暂无计算记录');
                        // 空状态引导
                        Text.fontSize(13);
                        // 空状态引导
                        Text.fontColor('#666');
                        // 空状态引导
                        Text.width('100%');
                        // 空状态引导
                        Text.textAlign(TextAlign.Center);
                        // 空状态引导
                        Text.padding(20);
                    }, Text);
                    // 空状态引导
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.height(this.isLandscape ? '100%' : 200);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                    ListItem.swipeAction({ end: { builder: (): void => { this.DelBtn(item); } } });
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.alignItems(HorizontalAlign.Start);
                                        Column.width('100%');
                                        Column.padding(this.isLandscape ? 8 : 12);
                                        Column.onClick((): void => { this.onHistoryTap(item); });
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.expression);
                                        Text.fontSize(12);
                                        Text.fontColor('#ccc');
                                        Text.maxLines(1);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.result);
                                        Text.fontSize(this.isLandscape ? 14 : 16);
                                        Text.fontWeight(FontWeight.Bold);
                                        Text.fontColor('#26b89c');
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.history, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /** 历史条目删除按钮（红色） */
    DelBtn(item: HistoryItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('删除');
            Text.fontSize(14);
            Text.fontColor('#FFFFFF');
            Text.padding(16);
            Text.backgroundColor('#FF6B6B');
            Text.height('100%');
            Text.onClick((): void => { this.onHistoryDelete(item); });
        }, Text);
        Text.pop();
    }
    // ==================== 设置面板 ====================
    // 居中覆盖层，包含振动、防休眠、弧度模式、主题切换和关于入口
    SettingsPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('85%');
            Column.backgroundColor(this.getPanelBg());
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.padding(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('设置');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('✕');
            Text.fontSize(20);
            Text.fontColor('#888');
            Text.onClick((): void => { this.showSettings = false; });
        }, Text);
        Text.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create();
        }, List);
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    // 振动反馈开关
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.ToggleItem.bind(this)('振动反馈', this.vibrateOn, (v: boolean): void => { this.vibrateOn = v; this.savePref('vibrateOn', v); });
                // 振动反馈开关
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            // 振动反馈开关
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    // 防休眠开关
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.ToggleItem.bind(this)('防休眠', this.preventSleep, (v: boolean): void => { this.preventSleep = v; this.savePref('preventSleep', v); });
                // 防休眠开关
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            // 防休眠开关
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    // 弧度模式开关
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.ToggleItem.bind(this)('弧度模式', this.radianMode, (v: boolean): void => { this.radianMode = v; this.savePref('radianMode', v); });
                // 弧度模式开关
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            // 弧度模式开关
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    // 主题选择
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.ThemeItem.bind(this)();
                // 主题选择
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            // 主题选择
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    // 关于入口
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding(12);
                    Row.onClick((): void => { this.showSettings = false; this.showAbout = true; });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('关于 OpenCalc');
                    Text.fontSize(15);
                    Text.fontColor('#ccc');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('>');
                    Text.fontColor('#888');
                }, Text);
                Text.pop();
                Row.pop();
                // 关于入口
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            // 关于入口
            ListItem.pop();
        }
        List.pop();
        Column.pop();
    }
    /** 开关设置项（标题 + Toggle 开关） */
    ToggleItem(title: string, val: boolean, cb: (v: boolean) => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(15);
            Text.fontColor('#FFFFFF');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: val });
            Toggle.onChange((on: boolean): void => { cb(on); });
        }, Toggle);
        Toggle.pop();
        Row.pop();
    }
    /** 主题选择项（三个按钮：默认 / AMOLED / Material） */
    ThemeItem(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('主题');
            Text.fontSize(15);
            Text.fontColor('#FFFFFF');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('默认');
            Text.fontSize(11);
            Text.fontColor(this.themeIdx === 0 ? '#1a1a2e' : '#888');
            Text.backgroundColor(this.themeIdx === 0 ? '#26b89c' : '#333');
            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            Text.borderRadius(8);
            Text.margin({ left: 2 });
            Text.onClick((): void => { this.themeIdx = 0; this.savePref('themeIdx', 0); });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AMOLED');
            Text.fontSize(11);
            Text.fontColor(this.themeIdx === 1 ? '#1a1a2e' : '#888');
            Text.backgroundColor(this.themeIdx === 1 ? '#26b89c' : '#333');
            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            Text.borderRadius(8);
            Text.margin({ left: 2 });
            Text.onClick((): void => { this.themeIdx = 1; this.savePref('themeIdx', 1); });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Material');
            Text.fontSize(11);
            Text.fontColor(this.themeIdx === 2 ? '#1a1a2e' : '#888');
            Text.backgroundColor(this.themeIdx === 2 ? '#26b89c' : '#333');
            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            Text.borderRadius(8);
            Text.margin({ left: 2 });
            Text.onClick((): void => { this.themeIdx = 2; this.savePref('themeIdx', 2); });
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
    }
    // ==================== 关于面板 ====================
    // 居中覆盖层，显示版本信息和项目链接
    AboutPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('80%');
            Column.padding(24);
            Column.backgroundColor(this.getPanelBg());
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('关于 OpenCalc');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
            Text.padding({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('OpenCalc HarmonyOS');
            Text.fontSize(14);
            Text.fontColor('#ccc');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('版本 1.0.0');
            Text.fontSize(14);
            Text.fontColor('#ccc');
            Text.padding({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('原项目: github.com/clementwzk/OpenCalc');
            Text.fontSize(11);
            Text.fontColor('#888');
            Text.padding({ top: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Android 3.2.1 → HarmonyOS');
            Text.fontSize(11);
            Text.fontColor('#888');
            Text.padding({ top: 2 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('迁移: github.com/JungleTestLabs/opencalc-harmonyos');
            Text.fontSize(11);
            Text.fontColor('#26b89c');
            Text.padding({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('关闭');
            Button.margin({ top: 16 });
            Button.onClick((): void => { this.showAbout = false; });
        }, Button);
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "CalculatorPage";
    }
}
registerNamedRoute(() => new CalculatorPage(undefined, {}), "", { bundleName: "com.darkempire78.opencalculator", moduleName: "entry", pagePath: "pages/CalculatorPage", pageFullPath: "entry/src/main/ets/pages/CalculatorPage", integratedHsp: "false", moduleType: "followWithHap" });
