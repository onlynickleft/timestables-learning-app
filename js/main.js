/**
 * @name 				main.js
 * @description 		Initializes script
 * @author 				Domenic Polsoni
 * @version 			0.1
*/

import Timer from '../js/timer.js'

'use strict';

let timeInt;
const timer = new Timer();
timer.start();

function getReadableTime(timeMs)
{
    let minutes = Math.floor(timeMs / 60000),
        seconds = Math.floor((timeMs % 60000) / 1000);
    minutes = (minutes < 10 ? '0' : '') + minutes;
    seconds = (seconds < 10 ? '0' : '') + seconds;

    return `${minutes}m  ${seconds}s`;
}

function updateTime()
{
    document.querySelector('#clock span').innerHTML = getReadableTime(timer.getTime());
}

function firstInputFocus()
{
    // Focus on first input
    let numberInputs = document.getElementsByClassName('number-inputs');
    numberInputs[0].focus();
}

function createTable()
{
    const numberOfFactorsVal = parseInt(document.getElementById('select-number-of-factors').value) + 1,
        container = document.getElementById('table-output-container');

    container.innerHTML = `<div class="div-table"><div class="div-table-body"></div></div>`;

    let divTableBody = document.getElementsByClassName('div-table-body')[0];

    for (let i = 0; i <= numberOfFactorsVal; i++)
    {
        let tr = document.createElement('div');
        tr.className = 'div-table-row';

        // Top row of multiplicands
        if (i == 0)
        {
            for (let x = 0; x <= numberOfFactorsVal; x++)
            {
                if (x === 0)
                {
                    tr.innerHTML += `<div class="div-table-cell multiplicand"><span>&#215</span></div>`;
                }
                else
                {
                    tr.innerHTML += `<div class="div-table-cell multiplicand">${x - 1}</div>`;
                }
            }
        }
        else
        {
            // Each subsequent row of inputs and multipliers
            for (let x = 0; x <= numberOfFactorsVal; x++)
            {
                if (x === 0)
                {
                    tr.innerHTML += `<div class="div-table-cell multiplier">${i - 1}</div>`;
                }
                else
                {
                    tr.innerHTML += `<div class="div-table-cell"><input class="number-inputs" type="number" value="" data-x-value="${x - 1}" data-y-value="${i - 1}"></div>`;
                }
            }
        }

        // Add row
        divTableBody.appendChild(tr);

        // Set the displayed number of factors
        displayNumberOfFactors(document.getElementById('select-number-of-factors').value);
    }
}

function increaseFactors()
{
    const selectNumberOfFactors = document.getElementById('select-number-of-factors'),
        max = parseInt(selectNumberOfFactors.getAttribute('max'));
    let currVal = parseInt(selectNumberOfFactors.value);

    // Do not exceed the max on the number type input
    if (currVal + 1 <= max)
    {
        selectNumberOfFactors.value = (currVal + 1);
    }
}

function decreaseFactors()
{
    const selectNumberOfFactors = document.getElementById('select-number-of-factors'),
        min = parseInt(selectNumberOfFactors.getAttribute('min'));
    let currVal = selectNumberOfFactors.value;

    // Do not exceed the min on the number type input
    if (currVal - 1 >= min)
    {
        selectNumberOfFactors.value = (currVal - 1);
    }
}

function displayNumberOfFactors(max)
{
    let factorsDisplay = document.querySelector('[for="select-number-of-factors"] span');
    factorsDisplay.innerHTML = `0 - ${max}`;
}


function isTableEmpty()
{
    const numberInputs = document.getElementsByClassName('number-inputs');

    for (let i = 0, j = numberInputs.length; i < j; i++)
    {
        if (numberInputs[i].value !== '')
        {
            return false;
        }
    }
    return true;
}

function clearTable()
{
    const tableInputs = document.querySelectorAll('.div-table-cell input');
    let html = `<h2 class="warning">Warning!</h2>
                <p>
                    Are you sure you want to delete your answers?
                </p>
                <div id="confirm-buttons-container">
                    <button id="confirm-button-delete" type="button">Ok</button>
                    <button id="cancel-button" type="button">Cancel</button>
                </div>`;
    if (!isTableEmpty())
    {
        controlModal(true, html);

        document.getElementById('confirm-button-delete').addEventListener('click', e =>
        {
            timer.reset();
            tableInputs.forEach(input =>
            {
                input.value = '';
            });
            controlModal(false);
        });
    }
    else
    {
        timer.reset();
        tableInputs.forEach(input =>
        {
            input.value = '';
        });
    }



}

function testFillTable()
{
    let divTableCellInputs = document.querySelectorAll('.div-table-cell input');
    for (let i = 0; i < divTableCellInputs.length; i++)
    {
        let input = divTableCellInputs[i];
        input.value = parseInt(input.dataset.xValue) * parseInt(input.dataset.yValue);
        highlightAnswer(input);
        checkForCompletion();
        if (i === divTableCellInputs.length - 2)
        {
            break;
        }

    }
}

function multiply(fact1, fact2)
{
    return fact1 * fact2;
}

function checkAnswer(input)
{
    let x = parseInt(input.dataset.xValue),
        y = parseInt(input.dataset.yValue),
        givenAnswer = parseInt(input.value);

    return multiply(x, y) === givenAnswer;
}

function removeHighlights()
{
    const tableInputs = document.querySelectorAll('.div-table-cell input');

    tableInputs.forEach(input =>
    {
        input.className = 'number-inputs';
    });
}

function highlightAnswer(input)
{
    input.className = 'number-inputs';
    if (checkAnswer(input))
    {
        // correct answer
        input.classList.add('highlight-green');
    }
    else
    {
        // incorrect answer
        input.classList.add('highlight-red');
        input.classList.add('error');
    }
}

function highlightSelectedCol(row, cIndex)
{
    let rowIndexArray = Array.from(document.getElementsByClassName('div-table-row')),
        rIndex = rowIndexArray.indexOf(row);

    for (let i = rIndex; i >= 0; i--)
    {
        rowIndexArray[i].getElementsByClassName('div-table-cell')[cIndex].classList.add('highlighted')
    }
}

function removeHighlightSelectedCol(row, cIndex)
{
    let rowIndexArray = Array.from(document.getElementsByClassName('div-table-row')),
        rIndex = rowIndexArray.indexOf(row);

    for (let i = rIndex; i >= 0; i--)
    {
        rowIndexArray[i].getElementsByClassName('div-table-cell')[cIndex].classList.remove('highlighted')
    }
}

function highlightSelectedRow(cell)
{
    let cellIndexArray = Array.from(cell.parentNode.childNodes),
        cIndex = cellIndexArray.indexOf(cell);

    for (let i = cIndex; i >= 0; i--)
    {
        cellIndexArray[i].classList.add('highlighted');
    }
    return cIndex;
}

function removeHighlightRow(cell)
{
    let cellIndexArray = Array.from(cell.parentNode.childNodes),
        cIndex = cellIndexArray.indexOf(cell);

    for (let i = cIndex; i >= 0; i--)
    {
        cellIndexArray[i].classList.remove('highlighted');
    }
    return cIndex;
}


function checkForCompletion()
{
    let numberInputs = document.getElementsByClassName('number-inputs'),
        totalCells = numberInputs.length,
        errors = document.getElementsByClassName('error').length,
        cellsFilled = 0;

    Array.from(numberInputs).forEach(input =>
    {
        if (input.value !== '')
        {
            cellsFilled++;
        }
    });

    // Table is complete and all answers are correct
    if (cellsFilled === totalCells && errors === 0)
    {
        let html = '',
            totalTime = '';

        // End the time and display it
        timer.stop();
        totalTime = getReadableTime(timer.getTime());

        // Stop timer
        clearInterval(timeInt);

        html = `<h2>Congratulations!</h2>
        <p>
            You completed the entire multiplication table correctly in <span id="time-complete">${totalTime}.</span>
        </p>
        <button id="start-over" type="button">Start over?</button>`;
        controlModal(true, html);
    }
}

function controlModal(display, html)
{
    let modalContainer = document.createElement('div'),
        overlay = document.createElement('div'),
        body = document.getElementsByTagName('body')[0];
    html = html || '';

    modalContainer.id = 'modal-container';
    overlay.id = 'overlay';


    if (display)
    {
        modalContainer.innerHTML = html;
        body.appendChild(modalContainer);
        body.appendChild(overlay);

        // Display overlay
        overlay.classList.add('display');

        // Display modal
        setTimeout(() =>
        {
            modalContainer.classList.add('fade-in');
        }, 0);

    }
    else
    {
        // Hide modal
        document.getElementById('modal-container').classList.remove('fade-in');
        setTimeout(() =>
        {
            body.removeChild(document.getElementById('modal-container'));
            body.removeChild(document.getElementById('overlay'));
        }, 300);
    }
}

function numberFactorsControl(factorId)
{
    let html = '',
        incrementType = /^.+?(?=\-)/.exec(factorId);


    if (isTableEmpty())
    {
        if (factorId === 'increase-factor')
        {
            increaseFactors();
        }
        else if (factorId === 'decrease-factor')
        {
            decreaseFactors();
        }
        createTable();
    }
    else
    {
        html = `<h2 class="warning">Warning!</h2>
                <p>
                    Are you sure you want to create a new table and clear out your answers?
                </p>
                <div id="confirm-buttons-container">
                    <button id="confirm-button" type="button" data-increment="${incrementType}">Ok</button>
                    <button id="cancel-button" type="button">Cancel</button>
                </div>`;
        controlModal(true, html);
    }
}

/** 
 * Use event delegation to grab individual elements on the page. Reduce the number of event handlers in memory
 * and improve performance.
 *
 * @function delegatedClicks
 * @param {ClickEvent} e The observable event.
 */
function delegatedClicks(e)
{
    const elem = e.target;

    // Clear the table of values and restore them all to blank
    if (elem.id === 'clear-table' || elem.closest('#clear-table'))
    {
        clearTable();
        removeHighlights();
        firstInputFocus();
    }

    // Control the number of factors to be displayed in the table
    if (elem.id === 'increase-factor' || elem.id === 'decrease-factor')
    {
        numberFactorsControl(elem.id);
    }

    // Start over button
    if (elem.id === 'start-over')
    {
        location.reload();
    }

    // Create new table prompt confirmation
    if (elem.id === 'confirm-button')
    {
        timer.reset();
        controlModal(false);
        if (elem.dataset.increment === 'increase')
        {
            increaseFactors();
        }
        else if (elem.dataset.increment === 'decrease')
        {
            decreaseFactors();
        }
        createTable();
    }

    // Don't do anything
    if (elem.id === 'cancel-button')
    {
        controlModal(false);
    }
}

function delegatedChanges(e)
{
    const elem = e.target;

    // Build the table with the set number of factors
    if (elem.classList.contains('number-inputs'))
    {
        highlightAnswer(elem);
        checkForCompletion();
    }
}

function delegatedMouseOver(e)
{
    let elem = e.target;

    if (elem.closest('.div-table-cell'))
    {
        elem = elem.closest('.div-table-cell');
        if (!elem.classList.contains('multiplicand') && !elem.classList.contains('multiplier'))
        {
            let cIndex = highlightSelectedRow(elem);
            highlightSelectedCol(elem.closest('.div-table-row'), cIndex);
        }
    }
}

function delegatedMouseOut(e)
{
    let elem = e.target;

    if (elem.closest('.div-table-cell'))
    {
        elem = elem.closest('.div-table-cell');
        if (!elem.classList.contains('multiplicand') && !elem.classList.contains('multiplier'))
        {
            let cIndex = removeHighlightRow(elem);
            removeHighlightSelectedCol(elem.closest('.div-table-row'), cIndex);
        }
    }
}

/**
 * Compile all of the events 
 * 
 * @function bindEvents
 */
function bindEvents()
{
    // All click events
    document.addEventListener('click', delegatedClicks);

    // All change events
    document.addEventListener('change', delegatedChanges);

    // All mouseover events
    document.addEventListener('mouseover', delegatedMouseOver);

    // All mouseout events
    document.addEventListener('mouseout', delegatedMouseOut);
}

/**
 * Main init method
 * 
 * @function init
 */
function init()
{
    createTable();

    // All events
    bindEvents();

    timeInt = setInterval(updateTime, 1000);
}

init(timeInt);
