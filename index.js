import Keypad from "./keypad.js";

function KeyEvent(){
    const keypad = new Keypad;
    keypad.render();

    keypad.enter = (value) => {
        document.querySelector('.key_display').innerHTML = value;
    }

}

document.querySelector('.keypad_on').addEventListener('click', () => {
    KeyEvent();
});
