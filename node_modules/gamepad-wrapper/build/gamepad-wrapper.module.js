const STANDARD_BUTTONS = {
    RC_BOTTOM: 'RC_BOTTOM', // Bottom button in right cluster
    RC_RIGHT: 'RC_RIGHT', // Right button in right cluster
    RC_LEFT: 'RC_LEFT', // Left button in right cluster
    RC_TOP: 'RC_TOP', // Top button in right cluster
    BUMPER_LEFT: 'BUMPER_LEFT', // Top left front button
    BUMPER_RIGHT: 'BUMPER_RIGHT', // Top right front button
    TRIGGER_LEFT: 'TRIGGER_LEFT', // Bottom left front button
    TRIGGER_RIGHT: 'TRIGGER_RIGHT', // Bottom right front button
    CC_LEFT: 'CC_LEFT', // Left button in center cluster
    CC_RIGHT: 'CC_RIGHT', // Right button in center cluster
    THUMBSTICK_LEFT: 'THUMBSTICK_LEFT', // Left stick pressed button
    THUMBSTICK_RIGHT: 'THUMBSTICK_RIGHT', // Right stick pressed button
    LC_BOTTOM: 'LC_BOTTOM', // Bottom button in left cluster
    LC_RIGHT: 'LC_RIGHT', // Right button in left cluster
    LC_LEFT: 'LC_LEFT', // Left button in left cluster
    LC_TOP: 'LC_TOP', // Top button in left cluster
    CC_CENTER: 'CC_CENTER', // Center button in center cluster
};
const STANDARD_BUTTON_MAPPING = {
    RC_BOTTOM: 0,
    RC_RIGHT: 1,
    RC_LEFT: 2,
    RC_TOP: 3,
    BUMPER_LEFT: 4,
    BUMPER_RIGHT: 5,
    TRIGGER_LEFT: 6,
    TRIGGER_RIGHT: 7,
    CC_LEFT: 8,
    CC_RIGHT: 9,
    THUMBSTICK_LEFT: 10,
    THUMBSTICK_RIGHT: 11,
    LC_BOTTOM: 12,
    LC_RIGHT: 13,
    LC_LEFT: 14,
    LC_TOP: 15,
    CC_CENTER: 16,
};
const STANDARD_AXES = {
    THUMBSTICK_LEFT_X: 'THUMBSTICK_LEFT_X', // Horizontal axis for left stick (negative left/positive right)
    THUMBSTICK_LEFT_Y: 'THUMBSTICK_LEFT_Y', // Vertical axis for left stick (negative up/positive down)
    THUMBSTICK_RIGHT_X: 'THUMBSTICK_RIGHT_X', // Horizontal axis for right stick (negative left/positive right)
    THUMBSTICK_RIGHT_Y: 'THUMBSTICK_RIGHT_Y', // Vertical axis for right stick (negative up/positive down)
};
const STANDARD_AXES_MAPPING = {
    THUMBSTICK_LEFT_X: 0,
    THUMBSTICK_LEFT_Y: 1,
    THUMBSTICK_RIGHT_X: 2,
    THUMBSTICK_RIGHT_Y: 3,
};

const XR_STANDARD_BUTTONS = {
    TRIGGER: 'TRIGGER',
    SQUEEZE: 'SQUEEZE',
    TOUCHPAD: 'TOUCHPAD',
    THUMBSTICK: 'THUMBSTICK',
    BUTTON_1: 'BUTTON_1',
    BUTTON_2: 'BUTTON_2',
};
const XR_STANDARD_BUTTON_MAPPING = {
    TRIGGER: 0,
    SQUEEZE: 1,
    TOUCHPAD: 2,
    THUMBSTICK: 3,
    BUTTON_1: 4,
    BUTTON_2: 5,
};
const XR_STANDARD_AXES = {
    TOUCHPAD_X: 'TOUCHPAD_X',
    TOUCHPAD_Y: 'TOUCHPAD_Y',
    THUMBSTICK_X: 'THUMBSTICK_X',
    THUMBSTICK_Y: 'THUMBSTICK_Y',
};
const XR_STANDARD_AXES_MAPPING = {
    TOUCHPAD_X: 0,
    TOUCHPAD_Y: 1,
    THUMBSTICK_X: 2,
    THUMBSTICK_Y: 3,
};

class GamepadWrapper {
    constructor(gamepad, options = {}) {
        var _a, _b, _c;
        this._buttons = [];
        this._gamepad = gamepad;
        this._buttonPressValueMin = (_a = options.buttonPressValueMin) !== null && _a !== void 0 ? _a : 0;
        this._buttonPressValueMax = (_b = options.buttonPressValueMax) !== null && _b !== void 0 ? _b : 1;
        this._buttonClickThreshold = (_c = options.buttonClickThreshold) !== null && _c !== void 0 ? _c : 0.9;
        for (let buttonIdx = 0; buttonIdx < this._gamepad.buttons.length; buttonIdx++) {
            this._buttons[buttonIdx] = {
                currFrame: {
                    value: 0,
                    touched: false,
                },
                prevFrame: {
                    value: 0,
                    touched: false,
                },
                pressedSince: 0,
            };
        }
    }
    update() {
        for (let buttonIdx = 0; buttonIdx < this._gamepad.buttons.length; buttonIdx++) {
            this._buttons[buttonIdx].prevFrame = this._buttons[buttonIdx].currFrame;
            this._buttons[buttonIdx].currFrame = {
                value: this._gamepad.buttons[buttonIdx].value,
                touched: this._gamepad.buttons[buttonIdx].touched,
            };
        }
    }
    get gamepad() {
        return this._gamepad;
    }
    getButtonIdx(buttonId) {
        const buttonIdx = this._gamepad.mapping == 'standard'
            ? STANDARD_BUTTON_MAPPING[buttonId]
            : this._gamepad.mapping == 'xr-standard'
                ? XR_STANDARD_BUTTON_MAPPING[buttonId]
                : null;
        if (buttonIdx == null) {
            throw `Button "${buttonId}" does not exist in layout "${this._gamepad.mapping}"`;
        }
        else {
            return buttonIdx;
        }
    }
    getAxisIdx(axisId) {
        const axisIdx = this._gamepad.mapping == 'standard'
            ? STANDARD_AXES_MAPPING[axisId]
            : this._gamepad.mapping == 'xr-standard'
                ? XR_STANDARD_AXES_MAPPING[axisId]
                : null;
        if (axisIdx == null) {
            throw `Axis "${axisId}" does not exist in layout "${this._gamepad.mapping}"`;
        }
        else {
            return axisIdx;
        }
    }
    getButtonValueByIndex(buttonIdx) {
        if (this._buttons[buttonIdx]) {
            return this._buttons[buttonIdx].currFrame.value;
        }
        else {
            return 0;
        }
    }
    getButtonValue(buttonId) {
        const buttonIdx = this.getButtonIdx(buttonId);
        return this.getButtonValueByIndex(buttonIdx);
    }
    getButtonByIndex(buttonIdx) {
        if (this._buttons[buttonIdx]) {
            return (this._buttons[buttonIdx].currFrame.value > this._buttonPressValueMin);
        }
        else {
            return false;
        }
    }
    getButton(buttonId) {
        const buttonIdx = this.getButtonIdx(buttonId);
        return this.getButtonByIndex(buttonIdx);
    }
    getButtonDownByIndex(buttonIdx) {
        if (this._buttons[buttonIdx]) {
            return (this._buttons[buttonIdx].prevFrame.value <= this._buttonPressValueMin &&
                this._buttons[buttonIdx].currFrame.value > this._buttonPressValueMin);
        }
        else {
            return false;
        }
    }
    getButtonDown(buttonId) {
        const buttonIdx = this.getButtonIdx(buttonId);
        return this.getButtonDownByIndex(buttonIdx);
    }
    getButtonUpByIndex(buttonIdx) {
        if (this._buttons[buttonIdx]) {
            return (this._buttons[buttonIdx].prevFrame.value >= this._buttonPressValueMax &&
                this._buttons[buttonIdx].currFrame.value < this._buttonPressValueMax);
        }
        else {
            return false;
        }
    }
    getButtonUp(buttonId) {
        const buttonIdx = this.getButtonIdx(buttonId);
        return this.getButtonUpByIndex(buttonIdx);
    }
    getButtonClickByIndex(buttonIdx) {
        if (this._buttons[buttonIdx]) {
            return (this._buttons[buttonIdx].prevFrame.value <=
                this._buttonClickThreshold &&
                this._buttons[buttonIdx].currFrame.value > this._buttonClickThreshold);
        }
        else {
            return false;
        }
    }
    getButtonClick(buttonId) {
        const buttonIdx = this.getButtonIdx(buttonId);
        return this.getButtonClickByIndex(buttonIdx);
    }
    getAxisByIndex(axisIdx) {
        return this._gamepad.axes[axisIdx];
    }
    getAxis(axisId) {
        const axisIdx = this.getAxisIdx(axisId);
        return this.getAxisByIndex(axisIdx);
    }
    get2DInputAngle(buttonId) {
        const axisX = this.getAxis(buttonId + '_X');
        const axisY = this.getAxis(buttonId + '_Y');
        if (axisX == null || axisY == null || (axisX == 0 && axisY == 0)) {
            return NaN;
        }
        let rad = Math.atan(axisX / axisY);
        if (axisX >= 0) {
            if (axisY < 0) {
                rad *= -1;
            }
            else if (axisY > 0) {
                rad = Math.PI - rad;
            }
            else if (axisY == 0) {
                rad = Math.PI / 2;
            }
        }
        else {
            if (axisY < 0) {
                rad *= -1;
            }
            else if (axisY > 0) {
                rad = -Math.PI - rad;
            }
            else if (axisY == 0) {
                rad = -Math.PI / 2;
            }
        }
        return rad;
    }
    get2DInputValue(buttonId) {
        const axisX = this.getAxis(buttonId + '_X');
        const axisY = this.getAxis(buttonId + '_Y');
        return Math.sqrt(axisX * axisX + axisY * axisY);
    }
    getHapticActuator(actuatorIdx) {
        // @ts-ignore
        const hapticActuator = this._gamepad.hapticActuators[actuatorIdx];
        if (!hapticActuator) {
            throw 'Requested haptic actuator does not exist in gamepad';
        }
        else {
            return hapticActuator;
        }
    }
}
const BUTTONS = {
    STANDARD: STANDARD_BUTTONS,
    XR_STANDARD: XR_STANDARD_BUTTONS,
};
const AXES = {
    STANDARD: STANDARD_AXES,
    XR_STANDARD: XR_STANDARD_AXES,
};

export { AXES, BUTTONS, GamepadWrapper, STANDARD_AXES, STANDARD_BUTTONS, XR_STANDARD_AXES as XR_AXES, XR_STANDARD_BUTTONS as XR_BUTTONS };
