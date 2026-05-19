if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface GraphPage_Params {
    expression?: string;
    errorMsg?: string;
    isPlotting?: boolean;
    themeIdx?: number;
    canvasReady?: boolean;
    ctx?: CanvasRenderingContext2D;
    engine?: CalcEngine;
    expr?: Expression;
    debounceTimer?: number;
    canvasWidthPx?: number;
    canvasHeightPx?: number;
    prefs?: PreferencesStore | null;
}
import router from "@ohos:router";
import { CalcEngine } from "@bundle:com.darkempire78.opencalculator/entry/ets/calculator/Calculator";
import { Expression } from "@bundle:com.darkempire78.opencalculator/entry/ets/calculator/Expression";
import { Plotter } from "@bundle:com.darkempire78.opencalculator/entry/ets/calculator/Plotter";
import type { ThemeColors } from "@bundle:com.darkempire78.opencalculator/entry/ets/calculator/Plotter";
import type { GraphConfig, PlotResult } from '../model/Models';
import { PreferencesStore } from "@bundle:com.darkempire78.opencalculator/entry/ets/preferences/PreferencesStore";
import type common from "@ohos:app.ability.common";
class GraphPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__expression = new ObservedPropertySimplePU('', this, "expression");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.__isPlotting = new ObservedPropertySimplePU(false, this, "isPlotting");
        this.__themeIdx = new ObservedPropertySimplePU(0, this, "themeIdx");
        this.__canvasReady = new ObservedPropertySimplePU(false, this, "canvasReady");
        this.ctx = new CanvasRenderingContext2D(new RenderingContextSettings(true));
        this.engine = new CalcEngine();
        this.expr = new Expression();
        this.debounceTimer = -1;
        this.canvasWidthPx = 0;
        this.canvasHeightPx = 0;
        this.prefs = null;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: GraphPage_Params) {
        if (params.expression !== undefined) {
            this.expression = params.expression;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
        if (params.isPlotting !== undefined) {
            this.isPlotting = params.isPlotting;
        }
        if (params.themeIdx !== undefined) {
            this.themeIdx = params.themeIdx;
        }
        if (params.canvasReady !== undefined) {
            this.canvasReady = params.canvasReady;
        }
        if (params.ctx !== undefined) {
            this.ctx = params.ctx;
        }
        if (params.engine !== undefined) {
            this.engine = params.engine;
        }
        if (params.expr !== undefined) {
            this.expr = params.expr;
        }
        if (params.debounceTimer !== undefined) {
            this.debounceTimer = params.debounceTimer;
        }
        if (params.canvasWidthPx !== undefined) {
            this.canvasWidthPx = params.canvasWidthPx;
        }
        if (params.canvasHeightPx !== undefined) {
            this.canvasHeightPx = params.canvasHeightPx;
        }
        if (params.prefs !== undefined) {
            this.prefs = params.prefs;
        }
    }
    updateStateVars(params: GraphPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__expression.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
        this.__isPlotting.purgeDependencyOnElmtId(rmElmtId);
        this.__themeIdx.purgeDependencyOnElmtId(rmElmtId);
        this.__canvasReady.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__expression.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        this.__isPlotting.aboutToBeDeleted();
        this.__themeIdx.aboutToBeDeleted();
        this.__canvasReady.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __expression: ObservedPropertySimplePU<string>;
    get expression() {
        return this.__expression.get();
    }
    set expression(newValue: string) {
        this.__expression.set(newValue);
    }
    private __errorMsg: ObservedPropertySimplePU<string>;
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    private __isPlotting: ObservedPropertySimplePU<boolean>;
    get isPlotting() {
        return this.__isPlotting.get();
    }
    set isPlotting(newValue: boolean) {
        this.__isPlotting.set(newValue);
    }
    private __themeIdx: ObservedPropertySimplePU<number>;
    get themeIdx() {
        return this.__themeIdx.get();
    }
    set themeIdx(newValue: number) {
        this.__themeIdx.set(newValue);
    }
    private __canvasReady: ObservedPropertySimplePU<boolean>;
    get canvasReady() {
        return this.__canvasReady.get();
    }
    set canvasReady(newValue: boolean) {
        this.__canvasReady.set(newValue);
    }
    private ctx: CanvasRenderingContext2D;
    private engine: CalcEngine;
    private expr: Expression;
    private debounceTimer: number;
    private canvasWidthPx: number;
    private canvasHeightPx: number;
    private prefs: PreferencesStore | null;
    async aboutToAppear(): Promise<void> {
        const ctx = getContext(this) as common.UIAbilityContext;
        this.prefs = new PreferencesStore(ctx);
        await this.prefs.init();
        this.themeIdx = await this.prefs.getTheme();
    }
    aboutToDisappear(): void {
        if (this.debounceTimer !== -1) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = -1;
        }
    }
    // ==================== 主题颜色（拷贝模式,与 CalculatorPage 同源） ====================
    getBg(): string {
        if (this.themeIdx === 1)
            return '#000000';
        if (this.themeIdx === 2)
            return '#121212';
        return '#FFFFFF';
    }
    getBtnBg(): string {
        if (this.themeIdx === 1)
            return '#1a1a1a';
        if (this.themeIdx === 2)
            return '#333333';
        return '#EFEFEF';
    }
    getT1(): string {
        if (this.themeIdx >= 1)
            return '#EFEFEF';
        return '#000000';
    }
    getT2(): string {
        if (this.themeIdx >= 1)
            return '#BDBDBD';
        return '#595959';
    }
    getErr(): string { return '#F44B3F'; }
    getAxis(): string {
        if (this.themeIdx >= 1)
            return '#666666';
        return '#888888';
    }
    getCurve(): string {
        if (this.themeIdx === 1)
            return '#00BCD4';
        if (this.themeIdx === 2)
            return '#A8C7FA';
        return '#1976D2';
    }
    // ==================== 交互逻辑 ====================
    onPlot(): void {
        if (this.expression.trim() === '') {
            this.errorMsg = '请输入表达式';
            this.ctx.clearRect(0, 0, this.canvasWidthPx, this.canvasHeightPx);
            return;
        }
        if (!this.canvasReady)
            return;
        this.isPlotting = true;
        this.errorMsg = '';
        let prepared: string = '';
        try {
            prepared = this.expr.getCleanExpression(this.expression, '.', ',');
        }
        catch (e) {
            this.errorMsg = '表达式语法错误';
            this.isPlotting = false;
            this.ctx.clearRect(0, 0, this.canvasWidthPx, this.canvasHeightPx);
            return;
        }
        const sampleCount: number = Math.max(200, Math.min(600, Math.floor(this.canvasWidthPx / 2)));
        const cfg: GraphConfig = {
            xMin: -10,
            xMax: 10,
            sampleCount: sampleCount,
            canvasWidthPx: this.canvasWidthPx,
            canvasHeightPx: this.canvasHeightPx,
            paddingPx: 16
        };
        const theme: ThemeColors = {
            axis: this.getAxis(),
            curve: this.getCurve(),
            bg: this.getBg()
        };
        try {
            const result: PlotResult = Plotter.sample(prepared, cfg, this.engine, false);
            if (result.validCount === 0) {
                this.errorMsg = '函数在该区间未定义';
            }
            Plotter.drawTo(this.ctx, result, cfg, theme);
        }
        catch (e) {
            console.error('plot render error', e);
            this.errorMsg = '绘图失败';
        }
        this.isPlotting = false;
    }
    onAreaChangeRedraw(w: number, h: number): void {
        this.canvasWidthPx = w;
        this.canvasHeightPx = h;
        if (!this.canvasReady)
            return;
        if (this.expression.trim() === '')
            return;
        if (this.debounceTimer !== -1)
            clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout((): void => {
            this.debounceTimer = -1;
            this.onPlot();
        }, 300);
    }
    // ==================== UI ====================
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(this.getBg());
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.fontSize(20);
            Text.fontColor(this.getT1());
            Text.padding(12);
            Text.onClick((): void => { router.back(); });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('函数绘图');
            Text.fontSize(18);
            Text.fontColor(this.getT1());
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.width(44);
        }, Blank);
        Blank.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 表达式输入行
            Row.create();
            // 表达式输入行
            Row.width('100%');
            // 表达式输入行
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '输入函数,例如 sin(x)', text: this.expression });
            TextInput.fontSize(18);
            TextInput.fontColor(this.getT1());
            TextInput.backgroundColor(this.getBtnBg());
            TextInput.placeholderColor(this.getT2());
            TextInput.layoutWeight(1);
            TextInput.height(48);
            TextInput.onChange((v: string): void => { this.expression = v; });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('x');
            Text.fontSize(16);
            Text.fontColor(this.getT1());
            Text.width(44);
            Text.height(48);
            Text.textAlign(TextAlign.Center);
            Text.backgroundColor(this.getBtnBg());
            Text.borderRadius(8);
            Text.margin({ left: 8 });
            Text.onClick((): void => { this.expression = this.expression + 'x'; });
        }, Text);
        Text.pop();
        // 表达式输入行
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作行
            Row.create();
            // 操作行
            Row.width('100%');
            // 操作行
            Row.padding({ left: 16, right: 16, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isPlotting ? '绘图中…' : '绘图');
            Button.fontSize(16);
            Button.fontColor(this.getT1());
            Button.backgroundColor(this.getBtnBg());
            Button.height(48);
            Button.layoutWeight(1);
            Button.enabled(!this.isPlotting);
            Button.onClick((): void => { this.onPlot(); });
        }, Button);
        Button.pop();
        // 操作行
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Canvas
            Canvas.create(this.ctx);
            // Canvas
            Canvas.width('100%');
            // Canvas
            Canvas.layoutWeight(1);
            // Canvas
            Canvas.backgroundColor(this.getBg());
            // Canvas
            Canvas.onReady((): void => {
                this.canvasReady = true;
            });
            // Canvas
            Canvas.onAreaChange((_oldArea: Area, newArea: Area): void => {
                const w: number = Number(newArea.width);
                const h: number = Number(newArea.height);
                this.onAreaChangeRedraw(w, h);
            });
        }, Canvas);
        // Canvas
        Canvas.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 错误提示行
            if (this.errorMsg !== '') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMsg);
                        Text.fontSize(14);
                        Text.fontColor(this.getErr());
                        Text.width('100%');
                        Text.padding({ left: 16, right: 16, top: 4, bottom: 8 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "GraphPage";
    }
}
registerNamedRoute(() => new GraphPage(undefined, {}), "", { bundleName: "com.darkempire78.opencalculator", moduleName: "entry", pagePath: "pages/GraphPage", pageFullPath: "entry/src/main/ets/pages/GraphPage", integratedHsp: "false", moduleType: "followWithHap" });
