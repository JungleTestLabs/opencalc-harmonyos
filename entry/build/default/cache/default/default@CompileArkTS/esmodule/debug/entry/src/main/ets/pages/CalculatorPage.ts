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
        this.__expression = new ObservedPropertySimplePU('', this, "expression");
        this.__result = new ObservedPropertySimplePU('', this, "result");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.__scientific = new ObservedPropertySimplePU(false, this, "scientific");
        this.__history = new ObservedPropertyObjectPU([], this, "history");
        this.__showHistory = new ObservedPropertySimplePU(false, this, "showHistory");
        this.__showSettings = new ObservedPropertySimplePU(false, this, "showSettings");
        this.__showAbout = new ObservedPropertySimplePU(false, this, "showAbout");
        this.__isLandscape = new ObservedPropertySimplePU(false
        // ==================== 偏好设置状态 ====================
        , this, "isLandscape");
        this.__vibrateOn = new ObservedPropertySimplePU(true, this, "vibrateOn");
        this.__preventSleep = new ObservedPropertySimplePU(false, this, "preventSleep");
        this.__radianMode = new ObservedPropertySimplePU(false, this, "radianMode");
        this.__themeIdx = new ObservedPropertySimplePU(0
        // ==================== 内部状态 ====================
        , this, "themeIdx");
        this.nextId = 0;
        this.engine = new CalcEngine();
        this.expr = new Expression();
        this.prefs = null;
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
    private __expression: ObservedPropertySimplePU<string>;
    get expression() {
        return this.__expression.get();
    }
    set expression(newValue: string) {
        this.__expression.set(newValue);
    }
    private __result: ObservedPropertySimplePU<string>;
    get result() {
        return this.__result.get();
    }
    set result(newValue: string) {
        this.__result.set(newValue);
    }
    private __errorMsg: ObservedPropertySimplePU<string>;
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    private __scientific: ObservedPropertySimplePU<boolean>;
    get scientific() {
        return this.__scientific.get();
    }
    set scientific(newValue: boolean) {
        this.__scientific.set(newValue);
    }
    private __history: ObservedPropertyObjectPU<HistoryItem[]>;
    get history() {
        return this.__history.get();
    }
    set history(newValue: HistoryItem[]) {
        this.__history.set(newValue);
    }
    private __showHistory: ObservedPropertySimplePU<boolean>;
    get showHistory() {
        return this.__showHistory.get();
    }
    set showHistory(newValue: boolean) {
        this.__showHistory.set(newValue);
    }
    private __showSettings: ObservedPropertySimplePU<boolean>;
    get showSettings() {
        return this.__showSettings.get();
    }
    set showSettings(newValue: boolean) {
        this.__showSettings.set(newValue);
    }
    private __showAbout: ObservedPropertySimplePU<boolean>;
    get showAbout() {
        return this.__showAbout.get();
    }
    set showAbout(newValue: boolean) {
        this.__showAbout.set(newValue);
    }
    private __isLandscape: ObservedPropertySimplePU<boolean>;
    get isLandscape() {
        return this.__isLandscape.get();
    }
    set isLandscape(newValue: boolean) {
        this.__isLandscape.set(newValue);
    }
    // ==================== 偏好设置状态 ====================
    private __vibrateOn: ObservedPropertySimplePU<boolean>;
    get vibrateOn() {
        return this.__vibrateOn.get();
    }
    set vibrateOn(newValue: boolean) {
        this.__vibrateOn.set(newValue);
    }
    private __preventSleep: ObservedPropertySimplePU<boolean>;
    get preventSleep() {
        return this.__preventSleep.get();
    }
    set preventSleep(newValue: boolean) {
        this.__preventSleep.set(newValue);
    }
    private __radianMode: ObservedPropertySimplePU<boolean>;
    get radianMode() {
        return this.__radianMode.get();
    }
    set radianMode(newValue: boolean) {
        this.__radianMode.set(newValue);
    }
    private __themeIdx: ObservedPropertySimplePU<number>;
    get themeIdx() {
        return this.__themeIdx.get();
    }
    set themeIdx(newValue: number) {
        this.__themeIdx.set(newValue);
    }
    // ==================== 内部状态 ====================
    private nextId: number;
    private engine: CalcEngine;
    private expr: Expression;
    private prefs: PreferencesStore | null;
    aboutToAppear(): void {
        const ctx: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
        this.prefs = new PreferencesStore(ctx);
        this.prefs.init().then((): void => { this.loadPrefs(); this.loadHistory(); });
    }
    async loadPrefs(): Promise<void> {
        if (!this.prefs)
            return;
        this.vibrateOn = await this.prefs.getVibrationEnabled();
        this.preventSleep = await this.prefs.getPreventSleep();
        this.radianMode = await this.prefs.getRadiansDefault();
        this.themeIdx = await this.prefs.getTheme();
        this.scientific = (await this.prefs.getScientificModeDefault()) === 1;
    }
    async loadHistory(): Promise<void> {
        if (!this.prefs)
            return;
        this.history = await this.prefs.getHistory();
        if (this.history.length > 0)
            this.nextId = this.history[0].id + 1;
    }
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
    // ==================== 按钮事件 ====================
    onDigit(d: string): void { this.expression = this.expression + d; this.errorMsg = ''; }
    onOp(op: string): void { this.expression = this.expression + op; this.errorMsg = ''; }
    onFunc(f: string): void { this.expression = this.expression + f + '('; this.errorMsg = ''; }
    onConst(c: string): void { this.expression = this.expression + c; this.errorMsg = ''; }
    onBS(): void { if (this.expression.length > 0)
        this.expression = this.expression.substring(0, this.expression.length - 1); }
    onAC(): void { this.expression = ''; this.result = ''; this.errorMsg = ''; ErrorFlags.reset(); }
    onEquals(): void {
        if (this.expression.length === 0)
            return;
        ErrorFlags.reset();
        try {
            const clean: string = this.expr.getCleanExpression(this.expression, '.', ',');
            const raw: number = this.engine.evaluate(clean, !this.radianMode);
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
    onCopy(): void {
        if (this.result.length === 0)
            return;
        pasteboard.getSystemPasteboard().setData(pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, this.result));
        promptAction.showToast({ message: '已复制' });
    }
    onHistoryTap(item: HistoryItem): void { this.expression = item.expression; this.showHistory = false; }
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
    // ==================== 主题颜色（对齐 Android 原版） ====================
    // themeIdx: 0=默认浅色  1=AMOLED纯黑  2=暗色
    // 默认：Android values/colors.xml 浅色主题
    // 暗色：Android values-night/colors.xml 暗色主题
    /** 背景色（默认白 #FFFFFF） */
    getBg(): string {
        if (this.themeIdx === 1)
            return '#000000'; // AMOLED
        if (this.themeIdx === 2)
            return '#121212'; // 暗色
        return '#FFFFFF'; // 默认浅色
    }
    /** 按钮背景色（默认浅灰 #EFEFEF） */
    getBtnBg(): string {
        if (this.themeIdx === 1)
            return '#000000';
        if (this.themeIdx === 2)
            return '#333333';
        return '#EFEFEF';
    }
    /** 面板背景色 */
    getPanelBg(): string {
        if (this.themeIdx === 1)
            return '#111111';
        if (this.themeIdx === 2)
            return '#323232';
        return '#FFFFFF';
    }
    /** 运算符按钮色（默认浅蓝 #B4D2E4） */
    getOp(): string {
        if (this.themeIdx === 2)
            return '#0070BC';
        return '#B4D2E4';
    }
    /** 等号按钮色（默认浅粉 #DCB5C5） */
    getEq(): string {
        if (this.themeIdx === 2)
            return '#B3004D';
        return '#DCB5C5';
    }
    /** 清除按钮色（默认浅绿 #B7DABD） */
    getClr(): string {
        if (this.themeIdx === 2)
            return '#00BA20';
        return '#B7DABD';
    }
    /** 错误文字色 */
    getErr(): string { return '#F44B3F'; }
    /** 主文字色（默认黑 #000000） */
    getT1(): string {
        if (this.themeIdx >= 1)
            return '#EFEFEF';
        return '#000000';
    }
    /** 次要文字色（默认深灰 #595959） */
    getT2(): string {
        if (this.themeIdx >= 1)
            return '#BDBDBD';
        return '#595959';
    }
    /** 运算符文字色（白字在有色按钮上） */
    getBtnText(): string {
        if (this.themeIdx >= 1)
            return '#EFEFEF';
        return '#000000';
    }
    // ==================== 主布局 ====================
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
            Stack.onAreaChange((_old: Area, newVal: Area): void => {
                const w: number = newVal.width as number;
                const h: number = newVal.height as number;
                this.isLandscape = w > h;
                // 横屏时自动开启科学模式（但不强制显示历史）
                if (this.isLandscape)
                    this.scientific = true;
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLandscape) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 横屏：左边按钮 + 可选右侧历史（有折叠按钮）
                        Row.create();
                        // 横屏：左边按钮 + 可选右侧历史（有折叠按钮）
                        Row.width('100%');
                        // 横屏：左边按钮 + 可选右侧历史（有折叠按钮）
                        Row.height('100%');
                        // 横屏：左边按钮 + 可选右侧历史（有折叠按钮）
                        Row.backgroundColor(this.getBg());
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.layoutWeight(this.showHistory ? 3 : 1);
                        Column.height('100%');
                    }, Column);
                    this.DisplayPanel.bind(this)();
                    this.ButtonGrid.bind(this)();
                    Column.pop();
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
                    // 横屏：左边按钮 + 可选右侧历史（有折叠按钮）
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 竖屏：原有布局
                        Column.create();
                        // 竖屏：原有布局
                        Column.width('100%');
                        // 竖屏：原有布局
                        Column.height('100%');
                        // 竖屏：原有布局
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
                    // 竖屏：原有布局
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
    // ==================== 显示屏 ====================
    DisplayPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(this.isLandscape ? { top: 8, bottom: 2 } : { top: 24, bottom: 8 });
            globalThis.Gesture.create(GesturePriority.Low);
            LongPressGesture.create();
            LongPressGesture.onAction((): void => { this.onCopy(); });
            LongPressGesture.pop();
            globalThis.Gesture.pop();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 横屏时在显示屏右侧加历史切换按钮
            if (this.isLandscape) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding({ right: 8, left: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.expression.length > 0 ? this.expression : ' ');
                        Text.fontSize(14);
                        Text.fontColor(this.getT2());
                        Text.textAlign(TextAlign.End);
                        Text.maxLines(3);
                        Text.layoutWeight(1);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.showHistory ? '◀' : '▶');
                        Text.fontSize(14);
                        Text.fontColor(this.getOp());
                        Text.padding({ left: 8 });
                        Text.onClick((): void => { this.showHistory = !this.showHistory; });
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.expression.length > 0 ? this.expression : ' ');
                        Text.fontSize(18);
                        Text.fontColor(this.getT2());
                        Text.width('100%');
                        Text.textAlign(TextAlign.End);
                        Text.padding({ right: 12, left: 12 });
                        Text.maxLines(3);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.errorMsg.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMsg);
                        Text.fontSize(this.isLandscape ? 22 : 28);
                        Text.fontColor(this.getErr());
                        Text.width('100%');
                        Text.textAlign(TextAlign.End);
                        Text.padding({ right: 12, left: 12 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.result.length > 0 ? this.result : '0');
                        Text.fontSize(this.isLandscape ? 28 : 36);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(this.getT1());
                        Text.width('100%');
                        Text.textAlign(TextAlign.End);
                        Text.padding({ right: 12, left: 12 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    // ==================== 模式切换栏（仅竖屏显示） ====================
    ToggleRow(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16, bottom: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.scientific ? '科学' : '基础');
            Text.fontSize(12);
            Text.fontColor(this.getOp());
            Text.padding({ left: 12, right: 12, top: 4, bottom: 4 });
            Text.border({ width: 1, color: this.getOp(), radius: 8 });
            Text.onClick((): void => { this.scientific = !this.scientific; });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.showHistory ? '▲ 历史' : '▼ 历史');
            Text.fontSize(12);
            Text.fontColor(this.getT2());
            Text.padding(8);
            Text.onClick((): void => { this.showHistory = !this.showHistory; });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('⚙');
            Text.fontSize(16);
            Text.fontColor(this.getT2());
            Text.padding(8);
            Text.onClick((): void => { this.showSettings = true; });
        }, Text);
        Text.pop();
        Row.pop();
    }
    // ==================== 按钮网格 ====================
    ButtonGrid(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 8, right: 8 });
            Column.layoutWeight(this.isLandscape ? 0 : 1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
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
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.BtnAct.bind(this)('AC');
        this.BtnOp.bind(this)('(');
        this.BtnOp.bind(this)(')');
        this.BtnOp.bind(this)('÷');
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
    /** 数字按钮 */
    BtnDig(l: string, parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(l);
        Text.fontSize(this.isLandscape ? 16 : 22);
        Text.fontColor(this.getT1());
        Text.width('22%');
        Text.height(this.isLandscape ? 36 : 56);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor(this.getBtnBg());
        Text.borderRadius(50);
        Text.margin(this.isLandscape ? 1 : 4);
        Text.onClick((): void => { this.onDigit(l); });
    }, Text); Text.pop(); }
    /** 运算符按钮 */
    BtnOp(l: string, parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(l);
        Text.fontSize(this.isLandscape ? 14 : 20);
        Text.fontColor(this.getBtnText());
        Text.width('22%');
        Text.height(this.isLandscape ? 36 : 56);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor(this.getOp());
        Text.borderRadius(50);
        Text.margin(this.isLandscape ? 1 : 4);
        Text.onClick((): void => { this.onOp(l); });
    }, Text); Text.pop(); }
    /** 科学函数按钮 */
    BtnFunc(l: string, parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(l);
        Text.fontSize(this.isLandscape ? 11 : 14);
        Text.fontColor(this.getT1());
        Text.width('18%');
        Text.height(this.isLandscape ? 30 : 46);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor(this.getBtnBg());
        Text.borderRadius(50);
        Text.margin(this.isLandscape ? 1 : 3);
        Text.onClick((): void => { this.onFunc(l); });
    }, Text); Text.pop(); }
    /** 常量按钮 */
    BtnConst(l: string, parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(l);
        Text.fontSize(this.isLandscape ? 13 : 18);
        Text.fontColor(this.getOp() === '#B4D2E4' ? '#4684E3' : this.getOp());
        Text.width('18%');
        Text.height(this.isLandscape ? 30 : 46);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor(this.getBtnBg());
        Text.borderRadius(50);
        Text.margin(this.isLandscape ? 1 : 3);
        Text.onClick((): void => { this.onConst(l); });
    }, Text); Text.pop(); }
    /** 动作按钮（AC/退格） */
    BtnAct(l: string, parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(l);
        Text.fontSize(this.isLandscape ? 14 : 20);
        Text.fontColor(this.getBtnText());
        Text.width('22%');
        Text.height(this.isLandscape ? 36 : 56);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor(l === 'AC' ? this.getClr() : this.getBtnBg());
        Text.borderRadius(50);
        Text.margin(this.isLandscape ? 1 : 4);
        Text.onClick((): void => { if (l === 'AC')
            this.onAC();
        else
            this.onBS(); });
    }, Text); Text.pop(); }
    /** 等号按钮 */
    BtnEq(parent = null) { this.observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create('=');
        Text.fontSize(this.isLandscape ? 18 : 24);
        Text.fontWeight(FontWeight.Bold);
        Text.fontColor(this.getBtnText());
        Text.width('22%');
        Text.height(this.isLandscape ? 36 : 56);
        Text.textAlign(TextAlign.Center);
        Text.backgroundColor(this.getEq());
        Text.borderRadius(50);
        Text.margin(this.isLandscape ? 1 : 4);
        Text.onClick((): void => { this.onEquals(); });
    }, Text); Text.pop(); }
    // ==================== 历史面板（仿 Android SlidingUpPanelLayout） ====================
    HistoryPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(this.isLandscape ? 1 : 0);
            Column.width('100%');
            Column.height(this.isLandscape ? '100%' : 'auto');
            Column.backgroundColor(this.getPanelBg());
            Column.borderRadius(this.isLandscape ? 0 : { topLeft: 16, topRight: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 拖拽手柄 / 折叠按钮（始终可见，仿 Android sliding_layout_button）
            Row.create();
            // 拖拽手柄 / 折叠按钮（始终可见，仿 Android sliding_layout_button）
            Row.width('100%');
            // 拖拽手柄 / 折叠按钮（始终可见，仿 Android sliding_layout_button）
            Row.height(24);
            // 拖拽手柄 / 折叠按钮（始终可见，仿 Android sliding_layout_button）
            Row.justifyContent(FlexAlign.Center);
            // 拖拽手柄 / 折叠按钮（始终可见，仿 Android sliding_layout_button）
            Row.onClick((): void => { this.showHistory = false; });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手柄横条
            Text.create('');
            // 手柄横条
            Text.width(40);
            // 手柄横条
            Text.height(4);
            // 手柄横条
            Text.backgroundColor(this.getT2());
            // 手柄横条
            Text.borderRadius(2);
        }, Text);
        // 手柄横条
        Text.pop();
        // 拖拽手柄 / 折叠按钮（始终可见，仿 Android sliding_layout_button）
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.history.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无计算记录');
                        Text.fontSize(13);
                        Text.fontColor(this.getT2());
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                        Text.padding(20);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.layoutWeight(1);
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
                                        Text.fontColor(this.getT2());
                                        Text.maxLines(1);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.result);
                                        Text.fontSize(15);
                                        Text.fontWeight(FontWeight.Bold);
                                        Text.fontColor(this.getOp());
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
    DelBtn(item: HistoryItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('删除');
            Text.fontSize(14);
            Text.fontColor(this.getT1());
            Text.padding(16);
            Text.backgroundColor(this.getErr());
            Text.height('100%');
            Text.onClick((): void => { this.onHistoryDelete(item); });
        }, Text);
        Text.pop();
    }
    // ==================== 设置面板 ====================
    SettingsPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('85%');
            Column.backgroundColor(this.getPanelBg());
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('设置');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.getT1());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('✕');
            Text.fontSize(20);
            Text.fontColor(this.getT2());
            Text.onClick((): void => { this.showSettings = false; });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create();
        }, List);
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
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.ToggleItem.bind(this)('振动反馈', this.vibrateOn, (v: boolean): void => { this.vibrateOn = v; this.savePref('vibrateOn', v); });
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
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
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.ToggleItem.bind(this)('防休眠', this.preventSleep, (v: boolean): void => { this.preventSleep = v; this.savePref('preventSleep', v); });
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
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
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.ToggleItem.bind(this)('弧度模式', this.radianMode, (v: boolean): void => { this.radianMode = v; this.savePref('radianMode', v); });
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
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
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.ThemeItem.bind(this)();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
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
                    Text.fontColor(this.getT2());
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('>');
                    Text.fontColor(this.getT2());
                }, Text);
                Text.pop();
                Row.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        List.pop();
        Column.pop();
    }
    ToggleItem(title: string, val: boolean, cb: (v: boolean) => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(15);
            Text.fontColor(this.getT1());
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
    ThemeItem(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('主题');
            Text.fontSize(15);
            Text.fontColor(this.getT1());
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('浅色');
            Text.fontSize(11);
            Text.fontColor(this.themeIdx === 0 ? '#000' : this.getT2());
            Text.backgroundColor(this.themeIdx === 0 ? this.getOp() : (this.themeIdx >= 1 ? '#555' : '#DDD'));
            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            Text.borderRadius(8);
            Text.margin({ left: 2 });
            Text.onClick((): void => { this.themeIdx = 0; this.savePref('themeIdx', 0); });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('暗色');
            Text.fontSize(11);
            Text.fontColor(this.themeIdx === 2 ? '#EFEFEF' : this.getT2());
            Text.backgroundColor(this.themeIdx === 2 ? '#0070BC' : (this.themeIdx >= 1 ? '#555' : '#DDD'));
            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            Text.borderRadius(8);
            Text.margin({ left: 2 });
            Text.onClick((): void => { this.themeIdx = 2; this.savePref('themeIdx', 2); });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AMOLED');
            Text.fontSize(11);
            Text.fontColor(this.themeIdx === 1 ? '#EFEFEF' : this.getT2());
            Text.backgroundColor(this.themeIdx === 1 ? '#B3004D' : (this.themeIdx >= 1 ? '#555' : '#DDD'));
            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            Text.borderRadius(8);
            Text.margin({ left: 2 });
            Text.onClick((): void => { this.themeIdx = 1; this.savePref('themeIdx', 1); });
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
    }
    // ==================== 关于面板 ====================
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
            Text.fontColor(this.getT1());
            Text.padding({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('OpenCalc HarmonyOS');
            Text.fontSize(14);
            Text.fontColor(this.getT2());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('版本 1.0.0');
            Text.fontSize(14);
            Text.fontColor(this.getT2());
            Text.padding({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('原项目: github.com/clementwzk/OpenCalc');
            Text.fontSize(11);
            Text.fontColor(this.getT2());
            Text.padding({ top: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Android 3.2.1 → HarmonyOS');
            Text.fontSize(11);
            Text.fontColor(this.getT2());
            Text.padding({ top: 2 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('迁移: github.com/JungleTestLabs/opencalc-harmonyos');
            Text.fontSize(11);
            Text.fontColor(this.getOp());
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
