import $ from 'jquery'

const pfx = ["webkit", "moz", "MS", "o", ""];

function PrefixedEvent(element, type, callback) {
    for (let p = 0; p < pfx.length; p++) {
        if (!pfx[p]) type = type.toLowerCase();
        if (element != null) {
            element.addEventListener(pfx[p] + type, callback, false);
        };
    }
}

export default class Loader {
    constructor(options) {

        this.options = options || {}
        this.container = this.options.container || document.querySelector('.loader')
        this.prependIt = this.options.prependIt || false
        // Activer ou non le loader que sur les pages dont le body a une classe spécifique
        this.classOnly = this.options.classOnly || false
        // classe sur le body permettant d'activer le loader
        this.bodyClassOnly = this.options.bodyClassOnly || 'home'
        // Affichage de la barre de chargement
        this.barchargement = this.options.barchargement || document.querySelector('.loader_bar')
        this.infoschargement = this.options.infoschargement || document.querySelector('.loader_info') // Affichage du
        // pourcentage de chargement
        this.bgcolor = this.options.bgcolor || '' // Couleur de fond
        this.barcolor = this.options.barcolor || '' // Couleur de la barre de chargement
        this.infocolor = this.options.infocolor || '' // Couleur du texte de chargement
        this.devMode = this.options.devMode || false // Mode developpeur
        this.animationListener = this.options.animationListener || '' // Classe ou Id sur laquelle on écoute la fin d'une
        // animation CSS
        this.minLoadingTime = this.options.minLoadingTime || 0 // Temps de chargement minimum, si aucun écouteur d'animation n'est
        // définit
        this.maxLoadingTime = this.options.maxLoadingTime || 0 // Temps de chargement maximum, pour forcer l'apparition du contenu
        this.on_init = this.options.on_init || function() {} // Fonction déclenchée à l'initialisation du loader
        this.on_loading = this.options.on_loading || function (now, fx) {},
        this.after_load = this.options.after_load || function() {}

        this.loading()
        this.init_events()
    }


    init () {

        let that = this

        this.t0 = performance.now()

        if (this.classOnly === true && document.body.classList.contains(this.bodyClassOnly) != true) {
            if (this.devMode) {
                console.log('############################################');
                console.log('bodyClassOnly');
                console.log('############################################');
            }

            this.remove()
            return false;
        };

        if (this.animationListener !== '') {
            this.listenerSelector = document.querySelector(this.animationListener);

            PrefixedEvent(this.listenerSelector, "AnimationStart", (e) => {
                if (that.devMode) {
                    console.log("Animation CSS commencée : " + e.animationName);
                }
            });
            PrefixedEvent(this.listenerSelector, "AnimationEnd", (e) => {
                if (that.devMode) {
                    console.log("Animation CSS terminée.");
                }
                that.animationFinished = true;
            });

        }

        if (this.prependIt) {

            $("body").prepend(`
                <div class='loader valign'>
                    <div class='loader_logo'>
                        <div class="loader_info">lel</div>
                        <div class="loader_bar"></div>
                    </div>
                </div>
                `);
        }


        document.body.classList.add('page-is-loading')

        if (this.bgcolor != '' || this.bgcolor != undefined || this.bgcolor!= null) {
            $('.loader').css("background-color", this.bgcolor);
        };

        if (this.barcolor != '' || this.barcolor != undefined || this.barcolor!= null) {
            $('.loader_bar').css("background-color", this.barcolor);
        };

        if (this.infocolor != '' || this.infocolor != undefined || this.infocolor!= null) {
            $('.loader_info').css("color", this.infocolor);
        };

        // à la fin
        this.on_init()
    }


    loading () {

        let that = this
        this.init()
        this.get_elements()
        this.loadedElements = 0

        this.percentage = 0
        this.duration = 1000

        if(this.elements.length) {
            this.percentage = parseInt((that.loadedElements / that.elements.length) * 100)
        }

        $(this.barchargement).stop()

        $(this.container).stop()
            .animate({ percentage: that.percentage}, {
                duration: this.duration,
                step: this._animate_steps(that.percentage)
        })


        if (this.elements.length) {

            $(this.elements).on('load', function() {
                $(this).off('load');
                that.loadedElements++;
                that.loading()
            });
        }

    }

    get_elements () {
        let that = this
        this.elements = $('html').find('img[src]');
        // Selection des images en background-image
        $.each(function() {
            var src = $(this).css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            if (src && src != 'none') {
                that.elements = that.elements.add($('<img src="' + src + '"/>'));
            }
        });
    }

    loaded () {

        let that = this
        this.percentage = 100

        if($(this.container).length) {
            $(that.barchargement)
                .stop()
                .animate({ width: that.percentage + '%' }, (that.duration / 2))

            $(that.container)
                .stop()
                .animate({ percentage: this.percentage},
                    {
                        duration: (this.duration/ 2),
                        step: this._animate_steps(that.percentage),
                        complete: () => {
                            if(that.devMode) {
                                console.log('chargementTermine')
                            }

                            if (that.animationListener !== '') {

                                if(that.animationFinished) {

                                    that.t1 = performance.now()

                                    let delayApparition

                                    if ((that.t1 - that.t0) > that.minLoadingTime) {
                                        delayApparition = 0;
                                    } else{
                                        delayApparition = that.minLoadingTime-(that.t1 - that.t0);
                                    };

                                    that.loadingFinished = true;

                                    $(that.container).delay(delayApparition).fadeOut(800, () => {

                                        that.after_load();
                                        that.remove()

                                    });

                                } else {
                                    PrefixedEvent(that.listenerSelector, "AnimationEnd", function(e) {

                                        if (that.devMode) {
                                            console.log('Event AnimationEnd. Animation CSS terminée.');
                                        }

                                        // Temps quand le chargement est terminé
                                        that.t2 = performance.now();

                                        // Définition du delay en fonction du temps écoulé
                                        let delayApparition;
                                        if ((that.t2 - that.t0) > that.minLoadingTime) {
                                            delayApparition = 0;
                                        } else{
                                            delayApparition = that.minLoadingTime-(that.t2 - that.t0);
                                        };

                                        that.loadingFinished = true;

                                        $(that.container).delay(delayApparition).fadeOut(800, () => {

                                            // Animation complete
                                            that.after_load();
                                            that.remove();

                                        });

                                    });
                                }

                            } else {
                                if (that.devMode) {
                                    console.log('Event AnimationEnd. Animation CSS terminée.');
                                }

                                // Temps quand le chargement est terminé
                                that.t3 = performance.now();

                                // Définition du delay en fonction du temps écoulé
                                let delayApparition;
                                if ((that.t3 - that.t0) > that.minLoadingTime) {
                                    delayApparition = 0;
                                } else{
                                    delayApparition = that.minLoadingTime-(that.t3 - that.t0);
                                };

                                that.loadingFinished = true;

                                $(that.container).delay(delayApparition).fadeOut(800, () => {

                                    // Animation complete
                                    that.after_load();
                                    that.remove();

                                });

                            }
                        }
                    })
        } else {
            if (this.devMode) {
                console.log('no div #loader');
            }

            that.after_load();
            that.remove()
            that.loadingFinished = true;
        }

    }

    remove() {
        document.querySelector('.loader').parentNode.removeChild(this.container)
        document.body.classList.remove('page-is-loading')
        document.body.classList.add('loading-finished')
    }

    init_events() {
        let that = this
        $(document).ready(() => {
            that.loaded()
        })
    }

    _animate_steps(now, fx) {
        let that = this
        $('.loader_info').text('Chargement ' + Math.ceil(parseInt(that.percentage)) + '%')
        $(that.barchargement).css({ 'width': parseInt(that.percentage) + '%' })
        this.on_loading(that.percentage, fx)
    }

}