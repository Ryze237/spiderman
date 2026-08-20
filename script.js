/* =====================================================
   LOVE METER
   0 → 500%
===================================================== */

"use strict";


/* =====================================================
   SETTINGS
===================================================== */

const MAX_VALUE = 500;


/*
    Change these messages whenever you want.
*/

const messages = [

    {
        min: 0,
        max: 49,
        text: "How much do you love me?"
    },

    {
        min: 50,
        max: 99,
        text: "Hmm... that's a little better..."
    },

    {
        min: 100,
        max: 199,
        text: "Awww... you do love me! ♡"
    },

    {
        min: 200,
        max: 299,
        text: "Okayyy... I can feel the love! ♡"
    },

    {
        min: 300,
        max: 399,
        text: "That's a LOT of love! ♡♡"
    },

    {
        min: 400,
        max: 499,
        text: "Wait... THAT much?!"
    },

    {
        min: 500,
        max: 500,
        text: "500%?! You broke the love meter! ♡"
    }

];


/* =====================================================
   ELEMENTS
===================================================== */

const slider =
    document.getElementById(
        "slider"
    );


const sliderHandle =
    document.getElementById(
        "sliderHandle"
    );


const sliderProgress =
    document.getElementById(
        "sliderProgress"
    );


const percentage =
    document.getElementById(
        "percentage"
    );


const message =
    document.getElementById(
        "message"
    );


const needle =
    document.getElementById(
        "needle"
    );


const cat =
    document.getElementById(
        "cat"
    );


const catMouth =
    document.getElementById(
        "catMouth"
    );


const happyLines =
    document.getElementById(
        "happyLines"
    );


const nextButton =
    document.getElementById(
        "nextButton"
    );


/* =====================================================
   STATE
===================================================== */

let value = 0;

let dragging = false;

let completed = false;


/* =====================================================
   UTILITY
===================================================== */

function clamp(
    number,
    minimum,
    maximum
) {

    return Math.max(
        minimum,
        Math.min(
            maximum,
            number
        )
    );
}


/* =====================================================
   GET MESSAGE
===================================================== */

function getMessage(
    currentValue
) {

    const result =
        messages.find(
            item =>
                currentValue >= item.min &&
                currentValue <= item.max
        );

    return result
        ? result.text
        : "";
}


/* =====================================================
   UPDATE CAT
===================================================== */

function updateCat(
    currentValue
) {

    /*
        0–99
        confused / neutral

        100–199
        beginning smile

        200–299
        happy

        300–399
        very happy

        400–499
        excited

        500
        maximum happiness
    */

    if (
        currentValue >= 500
    ) {

        catMouth.setAttribute(
            "d",
            `
            M108 105
            Q130 135 152 105
            Q130 125 108 105
            `
        );


        happyLines.setAttribute(
            "opacity",
            "1"
        );


        cat.classList.add(
            "celebrate"
        );

        return;
    }


    if (
        currentValue >= 400
    ) {

        catMouth.setAttribute(
            "d",
            `
            M110 105
            Q130 128 150 105
            `
        );


        happyLines.setAttribute(
            "opacity",
            "1"
        );


        return;
    }


    if (
        currentValue >= 300
    ) {

        catMouth.setAttribute(
            "d",
            `
            M115 105
            Q130 121 145 105
            `
        );


        happyLines.setAttribute(
            "opacity",
            ".8"
        );


        return;
    }


    if (
        currentValue >= 200
    ) {

        catMouth.setAttribute(
            "d",
            `
            M118 105
            Q130 118 142 105
            `
        );


        happyLines.setAttribute(
            "opacity",
            ".35"
        );


        return;
    }


    if (
        currentValue >= 100
    ) {

        catMouth.setAttribute(
            "d",
            `
            M124 105
            Q130 113 136 105
            `
        );


        happyLines.setAttribute(
            "opacity",
            "0"
        );


        return;
    }


    /*
        0–99%
    */

    catMouth.setAttribute(
        "d",
        `
        M130 104
        Q130 112 122 113

        M130 104
        Q130 112 138 113
        `
    );


    happyLines.setAttribute(
        "opacity",
        "0"
    );


    cat.classList.remove(
        "celebrate"
    );
}


/* =====================================================
   UPDATE GAUGE
===================================================== */

function updateGauge(
    currentValue
) {

    /*
        Needle moves from:

        -90 degrees
        ↓
        0 degrees
        ↓
        +90 degrees
    */

    const percentageValue =
        currentValue / MAX_VALUE;


    const angle =
        -90 +
        (
            percentageValue *
            180
        );


    needle.style.transform =
        `rotate(${angle}deg)`;
}


/* =====================================================
   UPDATE EVERYTHING
===================================================== */

function updateUI(
    newValue
) {

    value =
        Math.round(
            clamp(
                newValue,
                0,
                MAX_VALUE
            )
        );


    const percentageValue =
        value / MAX_VALUE;


    /*
        NUMBER
    */

    percentage.textContent =
        value;


    /*
        MESSAGE
    */

    message.textContent =
        getMessage(value);


    /*
        SLIDER
    */

    sliderHandle.style.left =
        `${percentageValue * 100}%`;


    sliderProgress.style.width =
        `${percentageValue * 100}%`;


    /*
        ACCESSIBILITY
    */

    slider.setAttribute(
        "aria-valuenow",
        value
    );


    slider.setAttribute(
        "aria-valuetext",
        `${value}%`
    );


    /*
        GAUGE
    */

    updateGauge(
        value
    );


    /*
        CAT
    */

    updateCat(
        value
    );


    /*
        500%
    */

    if (
        value === MAX_VALUE &&
        !completed
    ) {

        completed = true;

        showCompletion();

    }


    /*
        If user moves back down
    */

    if (
        value < MAX_VALUE
    ) {

        completed = false;

        nextButton.classList.remove(
            "show"
        );
    }
}


/* =====================================================
   GET VALUE FROM TOUCH / MOUSE
===================================================== */

function getValueFromPointer(
    clientX
) {

    const rect =
        slider.getBoundingClientRect();


    const x =
        clientX -
        rect.left;


    const percentagePosition =
        clamp(
            x / rect.width,
            0,
            1
        );


    return (
        percentagePosition *
        MAX_VALUE
    );
}


/* =====================================================
   POINTER DOWN
===================================================== */

function pointerDown(
    event
) {

    dragging = true;


    slider.setPointerCapture(
        event.pointerId
    );


    const newValue =
        getValueFromPointer(
            event.clientX
        );


    updateUI(
        newValue
    );


    event.preventDefault();
}


/* =====================================================
   POINTER MOVE
===================================================== */

function pointerMove(
    event
) {

    if (!dragging) {
        return;
    }


    const newValue =
        getValueFromPointer(
            event.clientX
        );


    updateUI(
        newValue
    );


    event.preventDefault();
}


/* =====================================================
   POINTER UP
===================================================== */

function pointerUp(
    event
) {

    dragging = false;


    try {

        slider.releasePointerCapture(
            event.pointerId
        );

    } catch (error) {

        // Nothing to do.
    }
}


/* =====================================================
   KEYBOARD
===================================================== */

function keyboardControl(
    event
) {

    let newValue =
        value;


    /*
        Normal movement
    */

    if (
        event.key ===
        "ArrowRight"
    ) {

        newValue += 5;
    }


    else if (
        event.key ===
        "ArrowLeft"
    ) {

        newValue -= 5;
    }


    /*
        Faster movement
    */

    else if (
        event.shiftKey &&
        event.key ===
        "ArrowRight"
    ) {

        newValue += 25;
    }


    else if (
        event.shiftKey &&
        event.key ===
        "ArrowLeft"
    ) {

        newValue -= 25;
    }


    /*
        Home
    */

    else if (
        event.key ===
        "Home"
    ) {

        newValue = 0;
    }


    /*
        End
    */

    else if (
        event.key ===
        "End"
    ) {

        newValue = MAX_VALUE;
    }


    else {

        return;
    }


    event.preventDefault();


    updateUI(
        newValue
    );
}


/* =====================================================
   CELEBRATION
===================================================== */

function showCompletion() {

    /*
        Show NEXT button
    */

    nextButton.classList.add(
        "show"
    );


    /*
        Create floating hearts
    */

    createCelebrationHearts();
}


/* =====================================================
   CREATE HEARTS
===================================================== */

function createCelebrationHearts() {

    const symbols = [
        "♡",
        "♥",
        "♡",
        "✦",
        "♥",
        "♡"
    ];


    for (
        let i = 0;
        i < 20;
        i++
    ) {

        const heart =
            document.createElement(
                "span"
            );


        heart.className =
            "celebration-heart";


        heart.textContent =
            symbols[
                i %
                symbols.length
            ];


        const angle =
            (
                Math.PI * 2 * i
            ) /
            20;


        const distance =
            80 +
            Math.random() *
            140;


        const x =
            Math.cos(angle) *
            distance;


        const y =
            Math.sin(angle) *
            distance;


        heart.style.setProperty(
            "--x",
            `${x}px`
        );


        heart.style.setProperty(
            "--y",
            `${y}px`
        );


        heart.style.setProperty(
            "--rotation",
            `${Math.random() * 90 - 45}deg`
        );


        document.body.appendChild(
            heart
        );


        heart.addEventListener(
            "animationend",
            () => {

                heart.remove();

            },
            {
                once: true
            }
        );
    }
}


/* =====================================================
   EVENTS
===================================================== */

slider.addEventListener(
    "pointerdown",
    pointerDown
);


slider.addEventListener(
    "pointermove",
    pointerMove
);


slider.addEventListener(
    "pointerup",
    pointerUp
);


slider.addEventListener(
    "pointercancel",
    pointerUp
);


slider.addEventListener(
    "keydown",
    keyboardControl
);


/* =====================================================
   NEXT BUTTON
===================================================== */

nextButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "surprise.html";

    }
);


/* =====================================================
   INITIAL STATE
===================================================== */

updateUI(
    0
);