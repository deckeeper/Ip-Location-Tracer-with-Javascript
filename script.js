    //regular expressions to extract IP and country values
    const countryCodeExpression = /loc=([\w]{2})/;
    const userIPExpression = /ip=([\w\.]+)/;
    const main = document.getElementById('main');
    //automatic country determination.
    function initCountry() {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.timeout = 3000;
            xhr.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        countryCode = countryCodeExpression.exec(this.responseText)
                        ip = userIPExpression.exec(this.responseText)
                        if (countryCode === null || countryCode[1] === '' ||
                            ip === null || ip[1] === '') {
                            reject('IP/Country code detection failed');
                        }
                        let result = {
                            "countryCode": countryCode[1],
                            "IP": ip[1]
                        };
                        resolve(result)
                    } else {
                        reject(xhr.status)
                    }
                }
            }
            xhr.ontimeout = function () {
                reject('timeout')
            }
            xhr.open('GET', 'https://www.cloudflare.com/cdn-cgi/trace', true);
            xhr.send();
        });
    }

    // Call `initCountry` function 
    initCountry()
    .then(result => {
        main.insertAdjacentHTML('beforeend', `<img src="https://www.countryflags.io/`+result.countryCode+`/shiny/64.png"><p>`+result.countryCode+`</p><br><p>`+result.IP+`</p>`);
    })
    .catch(e => {
        main.insertAdjacentHTML('beforeend', `<p>`+e+`</p>`);
    })