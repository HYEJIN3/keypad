import Keypad from "./keypad.js";

document.addEventListener('DOMContentLoaded', () => {
    let keypad = new Keypad();
    keypad.render();
    keypad.completeEvent = (inputValue) => {
        document.querySelector('#aaa').innerHTML += inputValue;
    };

});
