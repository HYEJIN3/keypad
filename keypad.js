export default class Keypad {

    static _instance;
    constructor() {
        if (Keypad._instance) return Keypad._instance;
        Keypad._instance = this;
    }

    wordStatus = 0;  // shift control
    inputValue = '';  // input value

    // keypad basic architecture
    inputEvent = (inputValue) => {};
    completeEvent = (inputValue) => {};
    add = (inputValue) => {};
    delete = (inputValue) => {};
    enter = (inputValue) => {};

    // basic rendering
    async render(req) {
        await this.keypadHtmlRender();
        await this.keypadRender();
        await this.keypadEvent();
        await this.keypadHoverEvent();

        if (req){
            this.inputEvent = () => {req.input({inputValue: this.inputValue});};
            this.completeEvent = () => {req.complete({enterValue: this.inputValue});};
        }
    }

    async keypadHtmlRender() {
        let keypadCssElement = document.createElement('style');
        keypadCssElement.setAttribute('id', '1');
        keypadCssElement.innerHTML =`
            .keypad_container {
                width: 100%;
                right: 0;
                margin: 0 auto;
                height: 36%;
                position: fixed;
                display: none;
                flex-direction: column;
                bottom: 0;
                left: 0;
                background: #ffffff;
                z-index: 1000;
                border-top: 1px solid #EDEDED;
            }
            
            .keypad_keyBox {
                display: flex;
                justify-content: start;
                align-items: center;
                flex-direction: column;
                margin: 0 1px;
                height: 100%;
            }
            
            .keypad_numbers {
                display: flex;
                flex-direction: row;
                width: 100%;
                height: 18%;
            }
            
            .keypad_alphabetLine1 {
                display: flex;
                flex-direction: row;
                width: 100%;
                height: 18%;
            }
            
            .keypad_alphabetLine2 {
                display: flex;
                flex-direction: row;
                width: 100%;
                height: 18%;
            }
            
            .keypad_alphabetLine3 {
                position: relative;
                display: flex;
                flex-direction: row;
                width: 100%;
                height: 18%;
            }
            
            .keypad_alphabetLine4 {
                margin: 2px 0 0 0;
                display: flex;
                flex-direction: row;
                width: 100%;
                height: 20%;
            }
            
            .keypad_number {
                margin-top: 3px;
                font-size: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                user-select: none;
                pointer-events: none;
            }
            
            .keypad_numberCharacter {
                user-select: none;
                pointer-events: none;
            }
            
            .keypad_alphabetLine1Element {
                padding: 2px;
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                border: 1px solid #EDEDED;
                cursor: pointer;
            }
            
            .keypad_alphabetLine2Element {
                flex: 1;
                border: 1px solid #EDEDED;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 2px;
                font-size: 14px;
                cursor: pointer;
            }
            
            .keypad_alphabetLine3Element {
                flex: 1;
                border: 1px solid #EDEDED;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 2px;
                font-size: 14px;
                cursor: pointer;
            }
            
            
            .keypad_shift {
                padding: 0 3px;
                margin: 1px 0;
                border-radius: 4px;
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #EAEAEA;
                position: relative;
                cursor: pointer;
            }
            
            .keypad_shift1 {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0px;
                height: 0px;
                border-bottom: 10px solid #000000;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                transform: translate(-50%, -50%);
            }
            
            .keypad_shift2 {
                display: none;
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0px;
                height: 0px;
                border-bottom: 10px solid #666666;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                transform: translate(-50%, -50%);
            }
            
            .keypad_shift3 {
                display: none;
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0px;
                height: 0px;
                border-bottom: 10px solid #666666;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                transform: translate(-50%, -50%);
            }
            
            .keypad_del {
                margin: 1px 0;
                padding: 0 6px;
                flex: 2;
                position: relative;
                border-radius: 4px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #9A9AA0;
                color: #FFFFFF;
                cursor: pointer;
            }
            
            .keypad_delImg {
                width: 30%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            
            .keypad_tbd {
                border-radius: 4px;
                width: 16vw;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #9A9AA0;
                color: #FFFFFF;
            }
            
            .keypad_specialCharacters {
                border-radius: 4px;
                width: 20vw;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #9A9AA0;
                color: #FFFFFF;
            }
            
            .keypad_enter {
                border-radius: 4px;
                flex: 3;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #0000FF;
                color: #FFFFFF;
                font-size: 14px;
                margin: 0 0 0 1px;
                cursor: pointer;
            }
            
            .keypad_empty {
                display: flex;
                justify-content: center;
                align-content: center;
                flex-direction: row;
                flex: 1;
                border: 1px solid #EDEDED;
                padding: 2px;
                pointer-events: none;
            }
            
            .keypad_emptyIcon {
                margin: auto;
            }
            
            .keypad_borderEmpty {
                width: 2px;
                height: 2px;
            }
            
            .keypad_numbersBox {
                flex: 1;
                border: 1px solid #EDEDED;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                padding: 2px;
                cursor: pointer;
            }
            .keypad_numberCharacter {
                font-size: 4px;
                margin-top: 2px;
                color: #D8D8D8;
            }
            
            .keypad_pw {
                position: fixed;
                right: 0;
                bottom: 0;
                left: 0;
                margin: 0 auto;
                max-width: 414px;
                height: 36%;
                z-index: 1000;
                background: #FFFFFF;
            }
            
            .keypad_xBtn {
                position: absolute;
                top: 30px;
                right: 20px;
                width: 11px;
                cursor: pointer;
            }
            
            .keypad_pwSettingContainer {
                height: 100%;
                background: #FFFFFF;
                z-index: 1000;
                position: relative;
            }
            
            .keypad_pwSettingTitleBox {
                width: 100%;
                height: 35%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
            
            .keypad_pwSettingFirstTitle {
                font-size: 22px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 10%;
                height: 16%;
            }
            
            .keypad_pwSettingSecondTitle {
                font-size: 22px;
                justify-content: center;
                align-items: center;
                margin-top: 10%;
                height: 16%;
                display: none;
            }
            
            .keypad_pwSettingGuideFirstText {
                color: #8B8B8B;
                font-size: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: "GmarketSans Light", sans-serif;
            }
            
            .keypad_pwSettingGuideSecondText {
                color: #8B8B8B;
                font-size: 16px;
                display: none;
                justify-content: center;
                align-items: center;
                font-family: "GmarketSans Light", sans-serif;
            }
            
            .keypad_pwInputBox {
                height: 60%;
                position: relative;
            }
            
            .keypad_pwContainer {
                width: 100%;
                margin-top: 2%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: row;
            }
            
            .keypad_pwBox {
                width: 7%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                box-sizing: border-box;
            }
            
            .createwallet_checkPasswordBox {
                width: 7%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                box-sizing: border-box;
            }
            
            .keypad_pwInput {
                width: 1px;
                text-align: center;
                color: #727272;
                border: none;
                opacity: 0;
            }
            
            .createwallet_passwordCheck {
                width: 1px;
                text-align: center;
                color: #727272;
                border: none;
                opacity: 0;
            }
            
            .keypad_pwLine {
                width: 12px;
                height: 2px;
                text-align: center;
                color: #727272;
                font-size: 32px;
                position: relative;
                background: #2F2725;
            }
            
            .keypad_pwCheckLine {
                width: 100%;
                height: 100%;
                text-align: center;
                color: #727272;
                font-size: 42px;
                position: relative;
            }
            
            .keypad_pwStar {
                position: absolute;
                font-size: 28px;
                bottom: 5%;
                left: 50%;
                color: #2F2725;
                transform: translate(-50%, -10%);
            }
            
            .keypad_pwCheckBox {
                max-width: 414px;
                width: 100%;
                height: 10%;
                position: fixed;
                bottom: 36%;
                margin: 0 auto;
                right: 0;
                z-index: 1000;
                left: 0;
                background: #F8F8F8;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .keypad_pwSet {
                height: 50%;
                border: 1px solid #B5B5B5;
                color: #B5B5B5;
                border-radius: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 80%;
                font-size: 14px;
                margin: 0 auto;
                background: #FFFFFF;
            }
            
            
            .keypad_inputtedCheckBox {
                width: 100%;
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                top: 37%;
                left: 50%;
                z-index: 50;
                transform: translate(-50%, -50%);
            }
            
            .keypad_inputtedCheckContainer {
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                width: 15px;
                height: 10px;
                position: relative;
            }
            
            .keypad_inputtedPwStar {
                width: 100%;
                font-size: 18px;
                justify-content: center;
                display: flex;
                align-items: center;
                color: #E6E6E6;
            }
            
            .keypad_inputtedPwLine {
                width: 100%;
                font-size: 18px;
                text-align: center;
                position: absolute;
                top: 50%;
                left: 0;
                color: #E6E6E6;
            }
            
            .keypad_errorText {
                width: 100%;
                position: absolute;
                left: 0;
                bottom: 75%;
                transform: translate(0, -50%);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                color: #FF0000;
            }
            
            .val {
                user-select: none;
            }
            
            @media screen and (max-width: 335px) {
                .keypad_pwSettingFirstTitle {
                    font-size: 20px;
                }
            
                .keypad_pwSettingSecondTitle {
                    font-size: 20px;
                }
            
                .keypad_pwSettingGuideFirstText {
                    font-size: 12px;
                }
                .keypad_pwSettingGuideSecondText {
                    font-size: 12px;
                }
            }
            `;
        document.head.insertBefore(keypadCssElement, document.head.childNodes[0]);
        document.querySelector('body').innerHTML += `
            <div class="keypad_pw">
                <div class="keypad_container">
                    <div class="keypad_keyBox">
                        <div class="keypad_numbers">
                            <div class="keypad_numbersBox 1">
                                <div class="keypad_number" data-value="1">1</div>
                                <div class="keypad_numberCharacter" data-value="!">!</div>
                            </div>
                            <div class="keypad_numbersBox 2">
                                <div class="keypad_number" data-value="2">2</div>
                                <div class="keypad_numberCharacter" data-value="@">@</div>
                            </div>
                            <div class="keypad_numbersBox 3">
                                <div class="keypad_number" data-value="3">3</div>
                                <div class="keypad_numberCharacter" data-value="#">#</div>
                            </div>
                            <div class="keypad_numbersBox 4">
                                <div class="keypad_number" data-value="4">4</div>
                                <div class="keypad_numberCharacter" data-value="$">$</div>
                            </div>
                            <div class="keypad_numbersBox 5">
                                <div class="keypad_number" data-value="5">5</div>
                                <div class="keypad_numberCharacter" data-value="%">%</div>
                            </div>
                            <div class="keypad_numbersBox 6">
                                <div class="keypad_number" data-value="6">6</div>
                                <div class="keypad_numberCharacter" data-value="^">^</div>
                            </div>
                            <div class="keypad_numbersBox 7">
                                <div class="keypad_number" data-value="7">7</div>
                                <div class="keypad_numberCharacter" data-value="&">&</div>
                            </div>
                            <div class="keypad_numbersBox 8">
                                <div class="keypad_number" data-value="8">8</div>
                                <div class="keypad_numberCharacter" data-value="*">*</div>
                            </div>
                            <div class="keypad_numbersBox 9">
                                <div class="keypad_number" data-value="9">9</div>
                                <div class="keypad_numberCharacter" data-value="_">_</div>
                            </div>
                            <div class="keypad_numbersBox 0">
                                <div class="keypad_number" data-value="0">0</div>
                                <div class="keypad_numberCharacter" data-value="/">/</div>
                            </div>
                        </div>
                        <div class="keypad_alphabetLine1">
                            <div class="keypad_alphabetLine1Element val lower q">q</div>
                            <div class="keypad_alphabetLine1Element val lower w">w</div>
                            <div class="keypad_alphabetLine1Element val lower e">e</div>
                            <div class="keypad_alphabetLine1Element val lower r">r</div>
                            <div class="keypad_alphabetLine1Element val lower t">t</div>
                            <div class="keypad_alphabetLine1Element val lower y">y</div>
                            <div class="keypad_alphabetLine1Element val lower u">u</div>
                            <div class="keypad_alphabetLine1Element val lower i">i</div>
                            <div class="keypad_alphabetLine1Element val lower o">o</div>
                            <div class="keypad_alphabetLine1Element val lower p">p</div>
                        </div>
                        <div class="keypad_alphabetLine2">
                            <div class="keypad_alphabetLine2Element val lower a">a</div>
                            <div class="keypad_alphabetLine2Element val lower s">s</div>
                            <div class="keypad_alphabetLine2Element val lower d">d</div>
                            <div class="keypad_alphabetLine2Element val lower f">f</div>
                            <div class="keypad_alphabetLine2Element val lower g">g</div>
                            <div class="keypad_alphabetLine2Element val lower h">h</div>
                            <div class="keypad_alphabetLine2Element val lower j">j</div>
                            <div class="keypad_alphabetLine2Element val lower k">k</div>
                            <div class="keypad_alphabetLine2Element val lower l">l</div>
                        </div>
                        <div class="keypad_alphabetLine3">
                            <div class="keypad_shift keypad_hover">
                                <div class="keypad_shift1"></div>
                                <div class="keypad_shift2"></div>
                                <div class="keypad_shift3"></div>
                            </div>
                            <div class="keypad_alphabetLine3Element val lower z">z</div>
                            <div class="keypad_alphabetLine3Element val lower x">x</div>
                            <div class="keypad_alphabetLine3Element val lower c">c</div>
                            <div class="keypad_alphabetLine3Element val lower v">v</div>
                            <div class="keypad_alphabetLine3Element val lower b">b</div>
                            <div class="keypad_alphabetLine3Element val lower n">n</div>
                            <div class="keypad_alphabetLine3Element val lower m">m</div>
                            <div class="keypad_del keypad_hover">
                                <div class="keypad_delImg">del</div>
                            </div>
                        </div>
                        <div class="keypad_alphabetLine4">
                            <div class="keypad_enter keypad_hover">enter</div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    keypadEvent() {
        // text input
        document.querySelectorAll('.val').forEach(el => {
            el.addEventListener('click', e => {
                this.inputValue += el.innerHTML;
                this.inputEvent(this.inputValue);
                this.add(el.innerHTML);

                if (this.wordStatus === 1){this.keypadinit()};
            });

            el.addEventListener('touchstart', e => {
                this.inputValue += el.innerHTML;
                this.inputEvent(this.inputValue);
                this.add(el.innerHTML);

                if (this.wordStatus === 1){this.keypadinit()};
            });
        });

        document.querySelectorAll('.keypad_numbersBox').forEach(el => {
            el.addEventListener('click', e => {
                this.inputValue += el.childNodes[1].outerText;
                this.inputEvent(this.inputValue);
                this.add(el.childNodes[1].outerText);

                if (this.wordStatus === 1){this.keypadinit()};
            });

            el.addEventListener('touchstart', e => {
                this.inputValue += el.childNodes[1].outerText;
                this.inputEvent(this.inputValue);
                this.add(el.childNodes[1].outerText);

                if (this.wordStatus === 1){this.keypadinit()};
            });
        });

        // delete btn click event
        document.querySelector('.keypad_del').addEventListener('click', e => {
            this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
            this.inputEvent(this.inputValue);
            this.delete();
        });

        document.querySelector('.keypad_del').addEventListener('touchstart', e => {
            this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
            this.inputEvent(this.inputValue);
            this.delete();
        });


        // done btn click event
        document.querySelector('.keypad_enter').addEventListener('click', e => {
            try {
                this.completeEvent(this.inputValue);
                this.enter(this.inputValue);
                for (let i = 0; i < document.querySelectorAll('.keypad_empty').length; i++) {
                    document.querySelectorAll('.keypad_empty')[i].remove();
                }
                this.inputValue = '';
            } catch (e) {
                console.log(e);
            }
        });

        document.querySelector('.keypad_enter').addEventListener('touchstart', e => {
            try {
                this.completeEvent(this.inputValue);
                this.enter(this.inputValue);
                document.querySelectorAll('.keypad_pw').remove();
            } catch (e) {
                console.log(e);
            }
        });


        // switch word case
        document.querySelector('.keypad_shift').addEventListener('click', e => {
            switch (this.wordStatus) {
                case 0:
                    this.keypadShift();
                    break;
                case 1:
                    this.keypadShiftFix();
                    break;
                case 2:
                    this.keypadinit();
                    break;
            }
        });

        document.querySelector('.keypad_shift').addEventListener('touchstart', e => {
            switch (this.wordStatus) {
                case 0:
                    this.keypadShift();
                    break;
                case 1:
                    this.keypadShiftFix();
                    break;
                case 2:
                    this.keypadinit();
                    break;
            }
        });


    }

    // keypad Hover Event
    keypadHoverEvent() {
        const value = 'abcdefghijklnmopqrstuvwxyz1234567890';
        let arr = [];
        for(let i = 0; i < value.length; i++){
            const val = value[i];
            arr.push('.' + val);
        }
    }

    // keypad init
    keypadinit() {
        this.wordStatus = 0;
        let toLower = document.querySelectorAll('.lower');
        let keypadNumber = document.querySelectorAll('.keypad_number');
        let keypadCharacter = document.querySelectorAll('.keypad_numberCharacter');

        for (let i = 0; i < toLower.length; i++) {
            toLower[i].innerHTML = toLower[i].innerHTML.toLowerCase();
        }
        for (let i = 0; i < keypadNumber.length; i++) {
            keypadNumber[i].innerHTML = keypadNumber[i].getAttribute('data-value');
            keypadCharacter[i].innerHTML = keypadCharacter[i].getAttribute('data-value');
        }
        document.querySelector('.keypad_shift').style.background = "#EAEAEA";
        document.querySelector('.keypad_shift2').style.display = "none";
        document.querySelector('.keypad_shift3').style.display = "none";
        document.querySelector('.keypad_shift1').style.display = "block";
    }

    // keypad Shift Btn Ui Rendering
    keypadShift() {
        this.wordStatus = 1;
        let toLower = document.querySelectorAll('.lower');
        let keypadNumber = document.querySelectorAll('.keypad_number');
        let keypadCharacter = document.querySelectorAll('.keypad_numberCharacter');

        for (let i = 0; i < toLower.length; i++) {
            toLower[i].innerHTML = toLower[i].innerHTML.toUpperCase();
        }
        for (let i = 0; i < keypadNumber.length; i++) {
            keypadNumber[i].innerHTML = keypadCharacter[i].innerHTML;
            keypadCharacter[i].innerHTML = keypadNumber[i].getAttribute('data-value');
        }
        document.querySelector('.keypad_shift2').style.display = "block";
        document.querySelector('.keypad_shift1').style.display = "none";
    }

    // keypad Shift Fix Btn Ui Rendering
    keypadShiftFix() {
        this.wordStatus = 2;
        document.querySelector('.keypad_shift').style.background = "#9A9AA0";
        document.querySelector('.keypad_shift3').style.display = "block";
        document.querySelector('.keypad_shift2').style.display = "none";
    }

    // keypad Rendering
    async keypadRender() {
        for (let i = 0; i < document.querySelectorAll('.keypad_empty').length; i++) {
            document.querySelectorAll('.keypad_empty')[i].remove();
        }
        document.querySelector('.keypad_container').style.display = 'flex';
        this.inputValue = '';
        if (this.wordStatus === 1 || this.wordStatus === 2){this.keypadinit()}
    }
}