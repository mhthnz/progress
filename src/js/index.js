(function(window, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        window.Progress = factory();
    }
})(window, () => {
    class Progress {

        settings = {
            state: null,
            tickInterval: null,
            tickDelay: 250
        };

        constructor() {
            document.body.innerHTML += `
                <div class="progress" role="bar">
                    <div class="progress__line"></div>
                </div>
            `;

            this.progressBar = document.querySelector('.progress');
            this.progressLine = document.querySelector('.progress__line');
        }

        start() {
            if (this.settings.state > 0) {
                this._setTransition('none');
                this._setTransform('-100');
                this._resetAndStart();
            } else {
                this._toggleLoader(true);
                this._setTransition(null);
                this._tick();
            }
        }

        done() {
            if (this.settings.state !== 1) {
                this._set(1);

                setTimeout(() => {
                    this._toggleLoader(false);
                }, 450);
            }
        }

        _inc() {
            let amount = null;
            const state = this.settings.state;

            if (state >= 0 && state < 0.25) {
                amount = (Math.random() * 3 + 3) / 100;
            } else if (state >= 0.25 && state < 0.65) {
                amount = (Math.random() * 3) / 100;
            } else if (state >= 0.65 && state < 0.9) {
                amount = (Math.random() * 2) / 100;
            } else if (state >= 0.9 && state < 0.99) {
                amount = 0.005;
            } else {
                amount = 0;
            }

            this._set(state + amount);
        }

        _set(state) {
            this.settings.state = state;
            this._setTransform((-1 + state) * 100);
        }

        _tick() {
            this.settings.tickInterval = setTimeout(() => {
                if (this.settings.state < 0.99) {
                    this._inc();
                    this._tick();
                }
            }, this.settings.tickDelay);
        }

        _resetAndStart() {
            clearInterval(this.settings.tickInterval);
            this.settings.state = 0;
            setTimeout(this.start.bind(this), 10);
        }

        _toggleLoader(visible) {
            if (visible) {
                this.progressBar.classList.add('progress_visible');
            } else {
                this.progressBar.classList.remove('progress_visible');
            }
        }

        _setTransition(value) {
            this.progressLine.style.transition = value;
        }

        _setTransform(percent) {
            this.progressLine.style.transform = `translate3d(${percent}%, 0, 0)`;
        }
    }

    return Progress;
});