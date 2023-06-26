function changeLanguage(language) {
    if (language === 'en') {
        window.location.href = '/';
    } else {
        window.location.href = '/' + language + '/';
    }
}
