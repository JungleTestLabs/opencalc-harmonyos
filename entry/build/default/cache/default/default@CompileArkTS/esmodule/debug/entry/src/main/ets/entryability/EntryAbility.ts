import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import type window from "@ohos:window";
import hilog from "@ohos:hilog";
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        hilog.info(0x0000, 'OpenCalc', 'Ability onCreate');
    }
    onDestroy(): void {
        hilog.info(0x0000, 'OpenCalc', 'Ability onDestroy');
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        hilog.info(0x0000, 'OpenCalc', 'Ability onWindowStageCreate');
        windowStage.loadContent('pages/Index', (err) => {
            if (err.code) {
                hilog.error(0x0000, 'OpenCalc', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err));
                return;
            }
            hilog.info(0x0000, 'OpenCalc', 'Succeeded in loading the content.');
        });
    }
    onWindowStageDestroy(): void {
        hilog.info(0x0000, 'OpenCalc', 'Ability onWindowStageDestroy');
    }
    onForeground(): void {
        hilog.info(0x0000, 'OpenCalc', 'Ability onForeground');
    }
    onBackground(): void {
        hilog.info(0x0000, 'OpenCalc', 'Ability onBackground');
    }
}
