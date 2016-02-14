/*
login page
 */
var divLoginScreen =  document.createElement('div');
divLoginScreen.setAttribute('class', 'loginScreen');

var loginDiv = document.createElement('div');
loginDiv.setAttribute('class', 'loginDiv')

var boxHeader = document.createElement('div');
boxHeader.setAttribute('class', 'boxHeader');
var loginTitle = document.createElement('h2');
loginTitle.textContent = "Log In";
boxHeader.appendChild(loginTitle);
loginDiv.appendChild(boxHeader);

var userLabel = document.createElement('label');
userLabel.setAttribute('for', 'username');
userLabel.textContent = 'Username';
loginDiv.appendChild(userLabel);

var breaking = document.createElement('br');
loginDiv.appendChild(breaking);

var userInput = document.createElement('input');
userInput.setAttribute('type', 'text', 'id', 'userinput');
loginDiv.appendChild(userInput);

var breaking = document.createElement('br');
loginDiv.appendChild(breaking);

var passLabel = document.createElement('label');
passLabel.setAttribute('for', 'password');
passLabel.textContent = 'Password';
loginDiv.appendChild(passLabel);

var breaking = document.createElement('br');
loginDiv.appendChild(breaking);

var passInput = document.createElement('input');
passInput.setAttribute('type', 'password', 'id', 'passinput');
loginDiv.appendChild(passInput);

var breaking = document.createElement('br');
loginDiv.appendChild(breaking);

var signInButton = document.createElement('button');
signInButton.setAttribute('type', 'submit');
signInButton.textContent = 'Sign In';
loginDiv.appendChild(signInButton);

signInButton.addEventListener('click', goToProfile);
function goToProfile() {
    if(userInput.value=='admin' && passInput.value=='admin')
    {
        toProfile();
    }
    else
    {
        alert("Error\nWorng username or password");
    }
}
divLoginScreen.appendChild(loginDiv);
document.body.appendChild(divLoginScreen);
/*
profile page
 */
var divProfileScreen = document.createElement('div');
divProfileScreen.setAttribute('class', 'profileScreen');
document.body.appendChild(divProfileScreen);
divProfileScreen.style.display = 'none';

var profile = document.createElement('h1');
profile.textContent = 'Aviad\'s Profile';
divProfileScreen.appendChild(profile);

var introductionText = document.createElement('h2');
introductionText.textContent = 'Aviad Levy 22yo 1.85cm';
divProfileScreen.appendChild(introductionText);

var hobbies = document.createElement('h3');
hobbies.textContent = 'I love watching good TV shows';
divProfileScreen.appendChild(hobbies);

var quotes1 = document.createElement('h3');
quotes1.textContent = '\"Kowalski, we\'ll be rich. The laws of physics don\'t apply to us.\" (Skipper from Madagascar After being told that a solid gold plane would not fly)';
divProfileScreen.appendChild(quotes1);

var photo = document.createElement('img');
photo.setAttribute('id', "profilePhoto");
photo.setAttribute('src', "minions.jpg");
divProfileScreen.appendChild(photo);
divProfileScreen.appendChild(document.createElement('br'));
photo.addEventListener('mouseenter', changePhoto);
photo.addEventListener('mouseleave', changePhotoBack);

function changePhoto(){
    photo.setAttribute('src', "minions2.png");
}
function changePhotoBack(){
    photo.setAttribute('src', "minions.jpg");
}

var loginClick = document.createElement('button');
loginClick.textContent = "Back To Login Page";
divProfileScreen.appendChild(loginClick);
loginClick.addEventListener('click', toLogin);

var calcClick = document.createElement('button');
calcClick.textContent="Calculator";
divProfileScreen.appendChild(calcClick);
calcClick.addEventListener('click', toCalculator);

/*
Calculator page
 */
var divCalculatorScreen = document.createElement('div');
divCalculatorScreen.setAttribute('class', 'calculatorScreen');
document.body.appendChild(divCalculatorScreen);
divCalculatorScreen.style.display = 'none';
divCalculatorScreen.setAttribute('id', "divCalculatorScreen");
var calcHeadLine = document.createElement('h1');
calcHeadLine.textContent = "Calculator";
divCalculatorScreen.appendChild(calcHeadLine);

function Calc() {
    var that = this;
    that.input = document.createElement('input');
    that.input2 = document.createElement('input');
    that.outputBox = document.createElement('input');

    Calc.prototype.validate = function () {
        if (isNaN(that.input.value) || isNaN(that.input2.value))
            alert("The number is not valid");
        else if (that.input.value < 0 || that.input2.value < 0)
            alert("The number is not valid");
        else if ((that.input.value % 1) != 0 || (that.input2.value % 1) != 0) {
            alert("The number is not valid");
        }
    }

    Calc.prototype.multiply = function () {
        that.outputBox.value = parseInt(that.input.value) * parseInt(that.input2.value);
    }
    Calc.prototype.plus = function () {
        that.outputBox.value = parseInt(that.input.value) + parseInt(that.input2.value);
    }
    Calc.prototype.minus = function () {
        if (parseInt(that.input.value) - parseInt(that.input2.value) < 0) {
            alert("Operation is not valid");
            return;
        }
        that.outputBox.value = parseInt(that.input.value) - parseInt(that.input2.value);
    }
    Calc.prototype.clear = function () {
        that.input.value = 0;
        that.input2.value = 0;
        that.outputBox.value = 0;
    }
    Calc.prototype.addCalc = function () {
        var divInput = document.createElement('div');
        that.input.value = 0;
        that.input.setAttribute('type', "text");
        that.input.setAttribute('id', "input");
        that.input.addEventListener('keyup', this.validate);
        divInput.appendChild(that.input);
        var multButton = document.createElement('button');
        multButton.textContent = "*";
        multButton.setAttribute('id', 'mult');
        multButton.setAttribute('class', 'opButtons');
        multButton.addEventListener('click', this.multiply);
        divInput.appendChild(multButton);
        var plusButton = document.createElement('button');
        plusButton.textContent = "+";
        plusButton.setAttribute('id', 'plus');
        plusButton.setAttribute('class', 'opButtons');
        plusButton.addEventListener('click', this.plus);
        divInput.appendChild(plusButton);
        var minusButton = document.createElement('button');
        minusButton.textContent = "-";
        minusButton.setAttribute('id', 'minus');
        minusButton.setAttribute('class', 'opButtons');
        minusButton.addEventListener('click', this.minus);
        divInput.appendChild(minusButton);
        that.input2.value = 0;
        that.input2.setAttribute('type', "text");
        that.input2.setAttribute('id', "input");
        that.input2.addEventListener('keyup', this.validate);
        divInput.appendChild(that.input2);
        divCalculatorScreen.appendChild(document.createElement('br'));

        var divActions = document.createElement('div');
        var clearButton = document.createElement('button');
        clearButton.textContent = "Clear";
        clearButton.setAttribute('id', 'clear');
        clearButton.setAttribute('class', 'opButtons');
        clearButton.addEventListener('click', this.clear);
        divActions.appendChild(clearButton);

        var divOutputBox = document.createElement('div');

        that.outputBox.readOnly = true;
        that.outputBox.value = 0;
        that.outputBox.setAttribute('type', "text");
        that.outputBox.setAttribute('id', "output");
        divOutputBox.appendChild(that.outputBox);

        divCalculatorScreen.appendChild(divOutputBox);
        divCalculatorScreen.appendChild(divInput);
        divCalculatorScreen.appendChild(divActions);
    }
}
function multipleCalc()
{
    var calc = new Calc();
    calc.addCalc();
    divCalculatorScreen.appendChild(document.createElement('br'));
}
var calcScreenButtons = document.createElement('div');
var loginCalc = document.createElement('button');
loginCalc.textContent = "Back To Login";
loginCalc.setAttribute('id', "backToLogBut");
calcScreenButtons.appendChild(loginCalc);
loginCalc.addEventListener('click', toLogin);

var addButton = document.createElement('button');
addButton.textContent = "Add Calculator";
addButton.setAttribute('id', 'addCalc');
addButton.addEventListener('click', multipleCalc);
calcScreenButtons.appendChild(addButton);

var profileClick = document.createElement('button');
profileClick.textContent = "Back To Profile";
profileClick.setAttribute('id', "backToProfBut");
calcScreenButtons.appendChild(profileClick);
profileClick.addEventListener('click', toProfile);
calcScreenButtons.setAttribute('class', "Buttons");
divCalculatorScreen.appendChild(calcScreenButtons);

var divInstructions = document.createElement('h3');
var instructions1 = document.createElement('span');
instructions1.textContent = "First insert tow numbers, then choose the operation";
divInstructions.appendChild(instructions1);
divInstructions.appendChild(document.createElement('br'));
var instrucion2 = document.createElement('span');
instrucion2.textContent = "The calculator support only non-negative int numbers";
divInstructions.appendChild(instrucion2);
divCalculatorScreen.appendChild(divInstructions);

multipleCalc();

/*
common functions
 */

function toCalculator(){
    divLoginScreen.style.display= 'none';
    divProfileScreen.style.display = 'none';
    divCalculatorScreen.style.display = 'block';
}
function toLogin(){
    alert("You logged out successfully!")
    divLoginScreen.style.display= 'block';
    divProfileScreen.style.display = 'none';
    divCalculatorScreen.style.display = 'none';
}

function toProfile(){
    divLoginScreen.style.display= 'none';
    divProfileScreen.style.display = 'block';
    divCalculatorScreen.style.display = 'none';
}

