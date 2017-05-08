export default class Cookie {

    constructor(options) {

        this.options = options
        this.name = this.options.name || 'cookie'
        this.value = this.options.value || 'value'
        this.duration = this.options.duration || 15
        this.is_found = this.options.is_found || function () { }
        this.is_not_found = this.options.is_not_found || function () { }

        this.check();

    }


    set () {

        let date = new Date();
        date.setTime(date.getTime() + (this.duration * 60 * 1000));
        let expires = "expires="+date.toUTCString();
        document.cookie = this.name + "=" + this.value + ";" + expires + ";path=/";

    }

    get () {
        let name = this.name + "=";
        let ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    check () {

        let cookie_exists = this.get()

        if(cookie_exists != "") {

            this.is_found()

        } else {

            this.is_not_found()

        }
    }

}