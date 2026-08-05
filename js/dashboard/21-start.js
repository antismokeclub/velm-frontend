        // Płynne pojawienie się — window.load jako fallback nawet gdy JS rzuci błąd wyżej
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            updateRpeSlider(); // init RPE slider
            makeSliderTouchFriendly('energySlider', updateSlider);
            makeSliderTouchFriendly('rpeSlider', updateRpeSlider);
        });
        // Dodaj też natychmiast po init dla szybkich połączeń
        document.body.classList.add('loaded');
        makeSliderTouchFriendly('energySlider', updateSlider);
        makeSliderTouchFriendly('rpeSlider', updateRpeSlider);

