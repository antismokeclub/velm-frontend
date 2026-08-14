        // Płynne pojawienie się — window.load jako fallback nawet gdy JS rzuci błąd wyżej
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            updateRpeSlider(); // init RPE slider
            makeSliderTouchFriendly('energySlider', updateSlider);
            makeSliderTouchFriendly('rpeSlider', updateRpeSlider);

            // Dane z zegarka dociągamy w tle, PO starcie — nie blokują pierwszego
            // ekranu i nie dokładają się do serii żądań startowych. W przeglądarce
            // funkcja wychodzi od razu, bo nie ma magazynu telefonu do czytania.
            setTimeout(() => { try { watchAutoSync(); } catch (e) { console.warn('[zegarek]', e); } }, 2500);
        });
        // Dodaj też natychmiast po init dla szybkich połączeń
        document.body.classList.add('loaded');
        makeSliderTouchFriendly('energySlider', updateSlider);
        makeSliderTouchFriendly('rpeSlider', updateRpeSlider);

