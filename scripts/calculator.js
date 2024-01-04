
//keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Map keyboard keys to corresponding button keys
    const keyMap = {
        'Escape': 'AC',
        'Delete': 'del',
        'Backspace': 'del',
        '%': '%',
        '/': '/',
        '7': '7',
        '8': '8',
        '9': '9',
        '*': '*',
        '4': '4',
        '5': '5',
        '6': '6',
        '-': '-',
        '1': '1',
        '2': '2',
        '3': '3',
        '+': '+',
        '.': '.',
        '0': '0',
        'Enter': '=',
    };

    const buttonKey = keyMap[key];

    if (buttonKey) {
        handleButtonClick(buttonKey);
    }
});


//keys of the calculator to render
const buttonOrder = [
    'AC', 'del', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '.', '0', '+/-', '='
];
//rendering the buttons dynamicly
const calculatorContainer = document.querySelector('.calculator-body_container');
const createButtons = () => {
    for (const buttonKey of buttonOrder) {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = buttonKey;
        buttonElement.classList.add('button');
        buttonElement.classList.add(buttonKey);
        buttonElement.addEventListener('click', () => {
            handleButtonClick(buttonKey);
        });
        calculatorContainer.appendChild(buttonElement);
    }
}

createButtons();


let upperDisplayValue = '';
let lowerDisplayValue = '';
let lastOperator = '';
const displayLowerContainer = document.querySelector('.button-section');
const displayUpperContainer = document.querySelector('.result-section');

//interaction with calculator buttons

const handleButtonClick = (buttonKey) => {
    switch (buttonKey) {
        case 'AC':
            upperDisplayValue = '';
            lowerDisplayValue = '';
            displayLowerContainer.innerText = '';
            displayUpperContainer.innerText = '';
            break;

        case 'del':
            lowerDisplayValue = displayLowerContainer.innerText.slice(0, -1);
            displayLowerContainer.innerText = lowerDisplayValue;
            break;

        case '=':
            upperDisplayValue = evaluateExpression(lowerDisplayValue);
            displayUpperContainer.innerText = upperDisplayValue + '';
            lowerDisplayValue = '';
            displayLowerContainer.innerText = '';

            break;

        case '+/-':
            lowerDisplayValue = '-' + lowerDisplayValue;
            displayLowerContainer.innerText = lowerDisplayValue;
            break;


        case '.':
            // Ensure only one decimal point is added
            if (!lowerDisplayValue.includes('.')) {
                lowerDisplayValue += buttonKey;
                displayLowerContainer.innerText = lowerDisplayValue;
            }
            break;

        default:
            if (lowerDisplayValue !== '' && ['/', '*', '-', '+'].includes(lowerDisplayValue.slice(-1))) {
                // If the last character is an operator, replace it with the new operator
                lastOperator = buttonKey;
            }
            lowerDisplayValue += buttonKey;
            displayLowerContainer.innerText = lowerDisplayValue;
            break;
    }




}

//calculation 
const evaluateExpression = (lowerDisplayValue) => {
    const operators = ['+', '-', '*', '/'];
    let expression = lowerDisplayValue.split(/([+\-*/])/);
    const stack = [];
    let currentOperator = '+';

    // Check if the first element is a negative sign
    if (lowerDisplayValue.length > 0 && lowerDisplayValue[0] === '-') {
        expression = lowerDisplayValue.substring(1, lowerDisplayValue.length).split(/([+\-*/])/);
        currentOperator = '-';
    }


    for (let i = 0; i < expression.length; i++) {
        const token = expression[i];

        if (operators.includes(token)) {
            currentOperator = token;
        } else {
            let percentageOperand = '';
            if (token.includes('%')) {
                let stackTop = stack.pop();
                stack.push(stackTop);
                percentageOperand = parseFloat(stackTop * token.replace('%', '') / 100);
            }

            const operand = percentageOperand === '' ? parseFloat(token) : percentageOperand;
            switch (currentOperator) {
                case '+':
                    stack.push(operand);
                    break;
                case '-':
                    stack.push(-operand);
                    break;
                case '*':
                    stack.push(stack.pop() * operand);
                    break;
                case '/':
                    stack.push(stack.pop() / operand);
                    break;
            }
        }
        percentageOperand = '';
    }
    const roundedResult = stack.reduce((acc, val) => acc + val, 0);
    return Math.round(roundedResult * 100) / 100;
};

