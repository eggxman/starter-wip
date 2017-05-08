import $ from 'jquery'
import Cookie from './class/cookie.class'
import Loader from './class/loader.class'
import * as Modernizr from './lib/modernizr'

$(function () {

    const disableButton = () => {
        $('button').text('Cookie is set')
        $('button').attr('disabled', 'disabled')
    }

    const loader = new Loader({
        devMode: false, // Mode developpeur
        onInit: () => {}, // Fonction déclenchée à l'initialisation du loader
        afterLoad: () => {}
    })

    const cookie = new Cookie({
        is_found: () => {},
        is_not_found: () => {}
    })

    const testCookie = new Cookie({
        is_found: () => { disableButton() },
        is_not_found: () => {}
    })

    $(document).ready(() => {
        cookie.set()

        $('button').click(() => {
            testCookie.set()
            disableButton()
        })
    })

})




