if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TipCalculatorPage_Params {
    amountText?: string;
    peopleText?: string;
    tipPercent?: number;
    isCustomMode?: boolean;
    customTipText?: string;
}
import router from "@ohos:router";
import hilog from "@ohos:hilog";
import { TipCalculator } from "@bundle:com.darkempire78.opencalculator/entry/ets/calculator/TipCalculator";
class TipCalculatorPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__amountText = new ObservedPropertySimplePU('', this, "amountText");
        this.__peopleText = new ObservedPropertySimplePU('', this, "peopleText");
        this.__tipPercent = new ObservedPropertySimplePU(15, this, "tipPercent");
        this.__isCustomMode = new ObservedPropertySimplePU(false, this, "isCustomMode");
        this.__customTipText = new ObservedPropertySimplePU('', this, "customTipText");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TipCalculatorPage_Params) {
        if (params.amountText !== undefined) {
            this.amountText = params.amountText;
        }
        if (params.peopleText !== undefined) {
            this.peopleText = params.peopleText;
        }
        if (params.tipPercent !== undefined) {
            this.tipPercent = params.tipPercent;
        }
        if (params.isCustomMode !== undefined) {
            this.isCustomMode = params.isCustomMode;
        }
        if (params.customTipText !== undefined) {
            this.customTipText = params.customTipText;
        }
    }
    updateStateVars(params: TipCalculatorPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__amountText.purgeDependencyOnElmtId(rmElmtId);
        this.__peopleText.purgeDependencyOnElmtId(rmElmtId);
        this.__tipPercent.purgeDependencyOnElmtId(rmElmtId);
        this.__isCustomMode.purgeDependencyOnElmtId(rmElmtId);
        this.__customTipText.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__amountText.aboutToBeDeleted();
        this.__peopleText.aboutToBeDeleted();
        this.__tipPercent.aboutToBeDeleted();
        this.__isCustomMode.aboutToBeDeleted();
        this.__customTipText.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __amountText: ObservedPropertySimplePU<string>;
    get amountText() {
        return this.__amountText.get();
    }
    set amountText(newValue: string) {
        this.__amountText.set(newValue);
    }
    private __peopleText: ObservedPropertySimplePU<string>;
    get peopleText() {
        return this.__peopleText.get();
    }
    set peopleText(newValue: string) {
        this.__peopleText.set(newValue);
    }
    private __tipPercent: ObservedPropertySimplePU<number>;
    get tipPercent() {
        return this.__tipPercent.get();
    }
    set tipPercent(newValue: number) {
        this.__tipPercent.set(newValue);
    }
    private __isCustomMode: ObservedPropertySimplePU<boolean>;
    get isCustomMode() {
        return this.__isCustomMode.get();
    }
    set isCustomMode(newValue: boolean) {
        this.__isCustomMode.set(newValue);
    }
    private __customTipText: ObservedPropertySimplePU<string>;
    get customTipText() {
        return this.__customTipText.get();
    }
    set customTipText(newValue: string) {
        this.__customTipText.set(newValue);
    }
    private static readonly TIERS: number[] = [10, 15, 18, 20];
    private computePerPerson(): string {
        const amount: number = parseFloat(this.amountText);
        const people: number = parseInt(this.peopleText, 10);
        const tip: number = this.isCustomMode ? parseFloat(this.customTipText) : this.tipPercent;
        return TipCalculator.calcPerPerson(amount, people, tip);
    }
    private goBack(): void {
        router.back();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#FFFFFF');
        }, Column);
        this.Header.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.width('100%');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 8, bottom: 16 });
        }, Column);
        this.AmountInput.bind(this)();
        this.PeopleInput.bind(this)();
        this.TipTierRow.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isCustomMode) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.CustomTipInput.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.ResultPanel.bind(this)();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    Header(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            Row.border({ width: { bottom: 1 }, color: '#E8E8E8' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('← 返回');
            Text.fontSize(14);
            Text.fontColor('#595959');
            Text.padding({ left: 12, right: 12, top: 8, bottom: 8 });
            Text.onClick((): void => { this.goBack(); });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('小费计算器');
            Text.fontSize(20);
            Text.fontColor('#000000');
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('  ');
            Text.fontSize(14);
            Text.padding({ left: 12, right: 12, top: 8, bottom: 8 });
        }, Text);
        Text.pop();
        Row.pop();
    }
    AmountInput(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('账单金额');
            Text.fontSize(14);
            Text.fontColor('#595959');
            Text.margin({ top: 12, bottom: 6 });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入金额', text: this.amountText });
            TextInput.type(InputType.NUMBER_DECIMAL);
            TextInput.inputFilter('^\\d*\\.?\\d{0,2}$', (err: string): void => {
                hilog.warn(0x0000, 'TipCalc', `amount filter rejected: %{public}s`, err);
            });
            TextInput.maxLength(15);
            TextInput.fontSize(20);
            TextInput.height(48);
            TextInput.backgroundColor('#EFEFEF');
            TextInput.borderRadius(12);
            TextInput.padding({ left: 12, right: 12 });
            TextInput.onChange((value: string): void => { this.amountText = value; });
        }, TextInput);
        Column.pop();
    }
    PeopleInput(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('就餐人数');
            Text.fontSize(14);
            Text.fontColor('#595959');
            Text.margin({ top: 12, bottom: 6 });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入人数', text: this.peopleText });
            TextInput.type(InputType.Number);
            TextInput.inputFilter('^\\d*$', (err: string): void => {
                hilog.warn(0x0000, 'TipCalc', `people filter rejected: %{public}s`, err);
            });
            TextInput.maxLength(3);
            TextInput.fontSize(20);
            TextInput.height(48);
            TextInput.backgroundColor('#EFEFEF');
            TextInput.borderRadius(12);
            TextInput.padding({ left: 12, right: 12 });
            TextInput.onChange((value: string): void => { this.peopleText = value; });
        }, TextInput);
        Column.pop();
    }
    TipTierRow(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('小费率');
            Text.fontSize(14);
            Text.fontColor('#595959');
            Text.margin({ top: 12, bottom: 6 });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const tier = _item;
                this.TierButton.bind(this)(tier);
            };
            this.forEachUpdateFunction(elmtId, TipCalculatorPage.TIERS, forEachItemGenFunction, (tier: number): string => `${tier}`, false, false);
        }, ForEach);
        ForEach.pop();
        this.CustomButton.bind(this)();
        Row.pop();
        Column.pop();
    }
    TierButton(tier: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${tier}%`);
            Text.fontSize(14);
            Text.fontColor(!this.isCustomMode && this.tipPercent === tier ? '#FFFFFF' : '#000000');
            Text.height(40);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
            Text.backgroundColor(!this.isCustomMode && this.tipPercent === tier ? '#B4D2E4' : '#EFEFEF');
            Text.borderRadius(12);
            Text.margin({ right: 8 });
            Text.onClick((): void => {
                this.tipPercent = tier;
                this.isCustomMode = false;
            });
        }, Text);
        Text.pop();
    }
    CustomButton(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('自定义');
            Text.fontSize(14);
            Text.fontColor(this.isCustomMode ? '#FFFFFF' : '#000000');
            Text.height(40);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
            Text.backgroundColor(this.isCustomMode ? '#B4D2E4' : '#EFEFEF');
            Text.borderRadius(12);
            Text.onClick((): void => {
                this.isCustomMode = true;
            });
        }, Text);
        Text.pop();
    }
    CustomTipInput(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('自定义小费率 (%)');
            Text.fontSize(14);
            Text.fontColor('#595959');
            Text.margin({ top: 12, bottom: 6 });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '0 - 100', text: this.customTipText });
            TextInput.type(InputType.NUMBER_DECIMAL);
            TextInput.inputFilter('^\\d{0,3}(\\.\\d{0,2})?$', (err: string): void => {
                hilog.warn(0x0000, 'TipCalc', `customTip filter rejected: %{public}s`, err);
            });
            TextInput.maxLength(6);
            TextInput.fontSize(20);
            TextInput.height(48);
            TextInput.backgroundColor('#EFEFEF');
            TextInput.borderRadius(12);
            TextInput.padding({ left: 12, right: 12 });
            TextInput.onChange((value: string): void => { this.customTipText = value; });
        }, TextInput);
        Column.pop();
    }
    ResultPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('每人应付');
            Text.fontSize(14);
            Text.fontColor('#595959');
            Text.margin({ top: 24, bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.computePerPerson());
            Text.fontSize(36);
            Text.fontColor('#000000');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "TipCalculatorPage";
    }
}
registerNamedRoute(() => new TipCalculatorPage(undefined, {}), "", { bundleName: "com.darkempire78.opencalculator", moduleName: "entry", pagePath: "pages/TipCalculatorPage", pageFullPath: "entry/src/main/ets/pages/TipCalculatorPage", integratedHsp: "false", moduleType: "followWithHap" });
