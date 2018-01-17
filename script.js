$(document).ready(() => {


    let timer = 0;
    const BAR_COLOR = 'green'
    const state = {
        count: timer,
        isPaused: false,
        isRunning: false,
        inverted: false,
        lastTimerInverted: false
    }


    const element = document.querySelector('.formContainer')
    
    element.addEventListener("transitionend", function(event) {
       console.log('finished')
      }, false);

    // listen out for a rotate event
    // set inverted
    // start timer

    $('.form').on('submit', (e) => {
        e.preventDefault()
        const form = document.querySelector('.form')
        timer = Number($('.form input').val());
        state.count = timer;
        
         $('.formContainer').addClass('slideUp')
        startTimer();
    })

    window.addEventListener('deviceorientation', _.debounce(function (event) {
        const { alpha, beta, gamma } = event;
        //$('.coords').text(Math.round(alpha) + ' : ' + Math.round(beta) + ' : ' + Math.round(gamma))
        // if (state.isRunning) {
        if (beta >= 65) {
            // standard portrait orientation (not inverted)

            // if the last timer was inverted, were due for this one.
            if (!state.lastTimerInverted) {

                return
            } else {
                state.inverted = false;
                state.lastTimerInverted = false;
                startTimer();
            }

        } else if (beta <= -65) {
            // inverted portrait orientation

            // if we just did an inverted timer, return.
            if (state.lastTimerInverted) {

                return
            } else {
                state.inverted = true;
                state.lastTimerInverted = true;
                startTimer();
            }
        }

        // }

    }, 50));



    const drawBar = () => {
        const inverted = state.inverted ? (state.count - 1) : ((timer - state.count) + 1)
        const pctHeight = ((100 / (timer)) * inverted); // % of height
        const clipHeight = window.innerHeight / (100 / pctHeight)
        console.log('drawing bar...')
        console.log({ count: state.count, pctHeight, inverted, clipHeight, })

        $('#bar').css({
            'clip': `rect(0px,${window.innerWidth}px,${clipHeight}px,0px)`
        })
    }

    const updateUI = () => {
        $('.count').text(state.count);
        if (state.inverted) {
            $('.countContainer').addClass('countContainer--inverted')
        } else {
            $('.countContainer').removeClass('countContainer--inverted')
        }
        drawBar();
    }

    const countDown = (time) => {
        // update the state
        state.isPaused = false;
        state.isRunning = true;
        updateUI();

        const timeInterval = setInterval(() => {
            const { isPaused, isRunning } = state;
            if (state.count <= 0 || isPaused || !isRunning) {
                clearInterval(timeInterval);
                state.inverted = !state.inverted;
                state.isRunning = false;
                state.count = timer;
                return;
            }
            state.count--
            console.log(state.count);

            updateUI();
        }, 60000)
    }

    const startTimer = () => countDown(timer);
    startTimer();
})