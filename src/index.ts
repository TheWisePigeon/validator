/**
 * Represent the structure of a validator.
 */
interface validator {
    alias: string
    validator: Function
    message: string
}

/// NOTE *************************UTILITY FUNCTIONS******************************************//
/**
 * 
 * @param event : An event which takes place in the DOM
 */
const grabValue = (event: Event) => {
    const target = event.target as HTMLInputElement
    return {
        "target": target,
        "value": target.value
    }
}


/**
 * Insert a warning span under an input element 
 * @param target : The HTML element that caused the event
 * @param warningText : The text to show to the user
 */
const insertWarning = (target: HTMLElement, warningText: string) => {
    let span: HTMLElement | null = document.querySelector(`span[warning='${warningText}'][id='${target.id}']`)
    if (span) {
        return
    }
    span = document.createElement("span")
    span.innerText = warningText
    span.style.cssText = "color: red; font-size:10px; display: block;"
    span.setAttribute("warning", warningText)
    span.setAttribute("id", target.id)

    target.after(span)
}

/**
 * Remove a span under an input element once it's input gets validated
 * @param target : The HTML element under which was the span to be removed
 * @param warning : The text showed to the user
 */
const removeWarning = (target: HTMLElement, warning: string) => {
    const span: HTMLElement | null = document.querySelector(`span[warning='${warning}'][id='${target.id}']`)
    if (span == null) {
        return
    }
    span.remove()

}

// NOTE ****************************************************CORE*******************************************************************************************/
const simpleTextInputs = document.querySelectorAll("input[type='text']")
const passworwdInputs = document.querySelectorAll("input[type='password']")
const emailInputs = document.querySelectorAll("input[type='email']")

simpleTextInputs.forEach(element => {
    element.addEventListener(
        'input', (event) => {
            whatValidator(event)
        }
    )

});

passworwdInputs.forEach(element => {
    element.addEventListener(
        'input', (event) => {
            whatValidator(event)
        }
    )
})

emailInputs.forEach(element => {
    element.addEventListener(
        'input', (event) => {
            whatValidator(event)
        }
    )
})
//***************************************************************************************************************************************************** */

const whatValidator = (wvValue: Event) => {
    const target = wvValue.target as HTMLInputElement
    const wv: string = target.getAttribute('wv')
    const rules = wv.split(' ')
    rules.forEach(rule => {
        validators.forEach(validator => {
            if (validator.alias == rule) {
                validator.validator(wvValue)
            }
        });
    });
    // alphaOnly.validator(wvValue)

}



// NOTE **************************************************VALIDATORS***************************************************************** */
const alphaOnly: validator = {
    alias: 'alpha',
    message: 'This field must not be a numeric values',
    validator: (event: Event) => {
        const target = event.target as HTMLInputElement
        const value = target.value
        if (Number.isInteger(Number(value))) {
            insertWarning(target, alphaOnly.message)
        } else {
            removeWarning(target, alphaOnly.message);

        }
    }
}

const numOnly: validator = {
    alias: 'num',
    message: 'This field must only contain numerical values',
    validator: (event: Event) => {
        const target = event.target as HTMLInputElement
        const value = target.value
        if (!Number.isInteger(Number(value))) {
            insertWarning(target, numOnly.message)
        } else {
            removeWarning(target, numOnly.message)
        }
    }
}

const proEmail: validator = {
    alias: 'email',
    message: 'Only pro emails are accepted',
    validator: (event: Event) => {
        const { target, value } = grabValue(event)

    }
}

const hasOneUpperCase: validator = {
    alias: '1up',
    message: 'Must contain at least one uppercase letter',
    validator: (event: Event) => {
        const { target, value } = grabValue(event)
        let uppercases = 0
        for (let char of value) {
            if (char == char.toUpperCase()) {
                uppercases += 1
            }
        }
        if (uppercases > 0) {
            removeWarning(target, hasOneUpperCase.message)
        } else {
            insertWarning(target, hasOneUpperCase.message)
        }

    }
}

const isNCharsLong: validator = {
    alias: 'len',
    message: '',
    validator: (event: Event) => {
        const { target, value } = grabValue(event)
        let min: Number
        let max: Number
        if (target.getAttribute('wmin')) {
            min = Number(target.getAttribute('wmin'))
            const belowMessage = `Must be at least ${min} characters`

            console.log(min);

            if (value.length < min) {
                insertWarning(target, belowMessage)
            } else {
                removeWarning(target, belowMessage)
            }
        }
        if (target.getAttribute('wmax')) {
            max = Number(target.getAttribute('wmax'))
            const exceedMessage = `Must not exceed ${max} characters`

            if (value.length > max) {
                insertWarning(target, exceedMessage)
            } else {
                removeWarning(target, exceedMessage)
            }

        }


    }
}

const validators = [
    alphaOnly,
    numOnly,
    hasOneUpperCase,
    isNCharsLong
]

// NOTE *****************************************************************REGEX******************************************************************* */
const numericOnly: RegExp = /[A-B]/